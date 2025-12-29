import TurndownService from 'turndown';
// Note: In a real environment, you might import turndown-plugin-gfm
// import { gfm } from 'turndown-plugin-gfm';
import { cleanTrackingParams } from './cleanUrl';

let cleanUrlsEnabled = false;

// Create instance
const turndownService = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
  emDelimiter: '*',
  bulletListMarker: '-',
});

// Configure GFM-like tables (Simplified implementation if plugin not available)
// Ideally: turndownService.use(gfm);

// Custom Rule: Clean Links
// This intercepts all <a> tags.
turndownService.addRule('cleanLinks', {
  filter: 'a',
  replacement: function (content, node) {
    const element = node as HTMLAnchorElement;
    let href = element.getAttribute('href') || '';
    
    if (cleanUrlsEnabled) {
      href = cleanTrackingParams(href);
    }

    const title = element.title ? ' "' + element.title + '"' : '';
    return '[' + content + '](' + href + title + ')';
  }
});

// Utility to run conversion
export const convertHtmlToMarkdown = (html: string, cleanUrls: boolean): string => {
  cleanUrlsEnabled = cleanUrls;
  
  // Basic pre-cleaning of HTML string to remove scripts/styles before processing
  // This helps Turndown focus on content
  const cleanerDiv = document.createElement('div');
  cleanerDiv.innerHTML = html;
  
  // Remove scripts and styles
  const scripts = cleanerDiv.querySelectorAll('script, style, iframe, noscript');
  scripts.forEach(s => s.remove());

  return turndownService.turndown(cleanerDiv.innerHTML);
};
