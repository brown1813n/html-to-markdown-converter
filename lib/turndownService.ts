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
  if (gfm) {
      try {
          service.use(gfm);
      } catch (e) {
          console.warn("Failed to register GFM plugin:", e);
      }
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