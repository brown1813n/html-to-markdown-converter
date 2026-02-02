import TurndownService from 'turndown';
import { gfm } from 'turndown-plugin-gfm';
import { cleanTrackingParams } from './cleanUrl';
import { ConversionOptions } from '../types';

// Handle potential ESM/CJS interop issues with the CDN import
const Turndown = (TurndownService && (TurndownService as any).default) || TurndownService;

if (!Turndown) {
    console.error("TurndownService failed to load.");
}

// Utility to run conversion
export const convertHtmlToMarkdown = (
  html: string, 
  cleanUrls: boolean, 
  options: ConversionOptions
): { markdown: string, linksCleaned: number } => {
  if (!Turndown) return { markdown: "Error: Converter not initialized", linksCleaned: 0 };

  let linksCleanedCount = 0;

  // Initialize service with dynamic options
  const service = new Turndown({
    headingStyle: options.headingStyle,
    bulletListMarker: options.bulletListMarker,
    codeBlockStyle: options.codeBlockStyle,
    emDelimiter: options.emDelimiter,
    strongDelimiter: options.strongDelimiter as any, // casting because standard types might strictly expect the literal chars
    linkStyle: options.linkStyle,
  });

  // Apply GFM plugin for tables and strikethrough unless we are in a mode that strictly forbids it (like Slack)
  // Slack actually supports strikethrough (~text~), so GFM is partially okay, but tables are bad in Slack.
  // For simplicity, we enable GFM generally, but specific presets might not render tables well.
  if (gfm) {
      try {
          service.use(gfm);
      } catch (e) {
          console.warn("Failed to register GFM plugin:", e);
      }
  }

  // --- Manual Table Rules ---
  // We add these rules to ensure robust table conversion. 
  // If the GFM plugin loads successfully, its rules usually take precedence because they are added first.
  // However, adding these ensures table support is available as a fallback or if GFM is disabled.

  service.addRule('tableCell', {
    filter: ['th', 'td'],
    replacement: function (content, node) {
      return cell(content, node);
    }
  });

  service.addRule('tableRow', {
    filter: 'tr',
    replacement: function (content, node) {
      var borderCells = '';
      var alignMap: any = { left: ':---', right: '---:', center: ':---:' };

      if (isHeadingRow(node)) {
        for (var i = 0; i < node.childNodes.length; i++) {
          var child = node.childNodes[i] as HTMLElement;
          var border = '---';
          var align = (child.getAttribute ? child.getAttribute('align') : '') || '';

          if (align) border = alignMap[align.toLowerCase()] || border;

          borderCells += cell(border, child);
        }
      }
      return '\n' + content + (borderCells ? '\n' + borderCells : '');
    }
  });

  service.addRule('table', {
    filter: 'table',
    replacement: function (content, node) {
      return '\n\n' + content + '\n\n';
    }
  });

  service.addRule('tableSection', {
    filter: ['thead', 'tbody', 'tfoot'],
    replacement: function (content) {
      return content;
    }
  });
  // --- End Manual Table Rules ---

  // Custom Rule: Flatten Headers (e.g. for Slack)
  if (options.flattenHeaders) {
    service.addRule('flattenHeaders', {
        filter: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
        replacement: function (content: string) {
            const delimiter = options.strongDelimiter || '**';
            // Emulate a header using bold text and double newline
            return '\n' + delimiter + content + delimiter + '\n\n';
        }
    });
  }

  // Custom Rule: Clean Links
  service.addRule('cleanLinks', {
    filter: 'a',
    replacement: function (content: string, node: any) {
        const element = node as HTMLAnchorElement;
        let href = element.getAttribute('href') || '';
        
        if (cleanUrls) {
            const originalHref = href;
            href = cleanTrackingParams(href);
            if (href !== originalHref) {
                linksCleanedCount++;
            }
        }

        const title = element.title ? ' "' + element.title + '"' : '';
        if (options.linkStyle === 'referenced') {
            return '[' + content + '][' + (element.getAttribute('href') || '') + ']'; // Simplified reference logic for demo
        }
        return '[' + content + '](' + href + title + ')';
    }
  });

  // Basic pre-cleaning of HTML string
  const cleanerDiv = document.createElement('div');
  cleanerDiv.innerHTML = html;
  
  // Remove scripts and styles
  const scripts = cleanerDiv.querySelectorAll('script, style, iframe, noscript');
  scripts.forEach(s => s.remove());

  const markdown = service.turndown(cleanerDiv.innerHTML);
  
  return { 
      markdown, 
      linksCleaned: linksCleanedCount 
  };
};

// --- Table Helper Functions ---
function cell(content: string, node: any) {
  var index = Array.prototype.indexOf.call(node.parentNode.childNodes, node);
  var prefix = ' ';
  if (index === 0) prefix = '| ';
  return prefix + content + ' |';
}

function isHeadingRow(tr: any) {
  var parentNode = tr.parentNode;
  return (
    parentNode.nodeName === 'THEAD' ||
    (
      parentNode.nodeName === 'TABLE' &&
      Array.prototype.indexOf.call(parentNode.childNodes, tr) === 0 &&
      tr.getElementsByTagName('th').length > 0
    )
  );
}