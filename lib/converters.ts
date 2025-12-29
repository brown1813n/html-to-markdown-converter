import { marked } from 'marked';
import { convertHtmlToMarkdown as turndownConvert } from './turndownService';
import { cleanTrackingParams } from './cleanUrl';
import { ConversionType } from '../types';

// Helper to clean links in Markdown text: [text](url)
const cleanMarkdownLinks = (markdown: string): string => {
  return markdown.replace(/\[([^\]]*)\]\(([^)]+)\)/g, (match, text, url) => {
    return `[${text}](${cleanTrackingParams(url)})`;
  });
};

export const convertContent = (input: string, type: ConversionType, cleanUrls: boolean): string => {
  if (!input.trim()) return '';

  switch (type) {
    case 'HTML_TO_MD':
      return turndownConvert(input, cleanUrls);
      
    case 'MD_TO_HTML':
      // If cleaning is enabled, clean the markdown source before parsing
      const sourceMd = cleanUrls ? cleanMarkdownLinks(input) : input;
      // marked.parse returns string | Promise<string>. In browser (esm.sh), it's usually sync unless async extensions are used.
      // Casting to string for simplicity as we aren't using async extensions.
      return marked.parse(sourceMd) as string;

    case 'HTML_TO_TEXT':
      // Create a temporary DOM element to strip tags
      const div = document.createElement('div');
      div.innerHTML = input;
      // Use textContent to get plain text
      let text = div.textContent || div.innerText || '';
      // If we want to clean URLs in plain text, it's harder because we don't know what is a URL.
      // But we can try a regex replace for http/https strings if strictly needed.
      // For now, HTML_TO_TEXT usually just means stripping tags, so we'll skip URL cleaning logic
      // unless it's explicitly requested to clean raw text URLs.
      if (cleanUrls) {
          // precise regex for raw URLs in text is complex, we'll stick to basic stripping for this mode
      }
      return text;
      
    default:
      return '';
  }
};

export const getLabels = (type: ConversionType) => {
    switch (type) {
        case 'HTML_TO_MD': return { input: 'HTML Input', output: 'Markdown Output' };
        case 'MD_TO_HTML': return { input: 'Markdown Input', output: 'HTML Output' };
        case 'HTML_TO_TEXT': return { input: 'HTML Input', output: 'Plain Text Output' };
    }
}
