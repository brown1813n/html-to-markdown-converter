import { parse } from 'marked';
import { convertHtmlToMarkdown as turndownConvert } from './turndownService';
import { cleanTrackingParams } from './cleanUrl';
import { ConversionType, ConversionOptions } from '../types';

interface ConversionResult {
    result: string;
    linksCleaned: number;
}

// Helper to clean links in Markdown text: [text](url)
const cleanMarkdownLinks = (markdown: string): { text: string, count: number } => {
  let count = 0;
  const text = markdown.replace(/\[([^\]]*)\]\(([^)]+)\)/g, (match, text, url) => {
    const cleaned = cleanTrackingParams(url);
    if (cleaned !== url) {
        count++;
    }
    return `[${text}](${cleaned})`;
  });
  return { text, count };
};

export const convertContent = (
    input: string, 
    type: ConversionType, 
    cleanUrls: boolean,
    options: ConversionOptions
): ConversionResult => {
  if (!input.trim()) return { result: '', linksCleaned: 0 };

  switch (type) {
    case 'HTML_TO_MD':
      const { markdown, linksCleaned } = turndownConvert(input, cleanUrls, options);
      return { result: markdown, linksCleaned };
      
    case 'MD_TO_HTML':
      let sourceMd = input;
      let cleanedCount = 0;
      
      // If cleaning is enabled, clean the markdown source before parsing
      if (cleanUrls) {
          const cleaned = cleanMarkdownLinks(input);
          sourceMd = cleaned.text;
          cleanedCount = cleaned.count;
      }
      
      // Use 'parse' directly. 
      return { 
          result: parse(sourceMd) as string, 
          linksCleaned: cleanedCount 
      };

    case 'HTML_TO_TEXT':
      // Create a temporary DOM element to strip tags
      const div = document.createElement('div');
      div.innerHTML = input;
      // Use textContent to get plain text
      let text = div.textContent || div.innerText || '';
      return { result: text, linksCleaned: 0 };
      
    default:
      return { result: '', linksCleaned: 0 };
  }
};

export const getLabels = (type: ConversionType) => {
    switch (type) {
        case 'HTML_TO_MD': return { input: 'HTML Input', output: 'Markdown Output' };
        case 'MD_TO_HTML': return { input: 'Markdown Input', output: 'HTML Output' };
        case 'HTML_TO_TEXT': return { input: 'HTML Input', output: 'Plain Text Output' };
    }
};

export const getSampleContent = (type: ConversionType): string => {
    switch(type) {
      case 'MD_TO_HTML':
        return `# HTML to Markdown Converter

This is a **Markdown** sample to demonstrate conversion.

## Features
- **Bold** and *Italic* text
- [Link with Params](https://example.com?utm_source=google&utm_medium=cpc&gclid=123)
- Code blocks:
\`\`\`javascript
console.log("Convert HTML to MD easily");
\`\`\`

> "The best free online converter tool."
`;
      default: // HTML inputs for both HTML_TO_MD and HTML_TO_TEXT
        return `<h1>HTML to Markdown Converter</h1>
<p>This is a <strong>sample</strong> HTML.</p>
<h2>Features</h2>
<ul>
  <li><strong>Bold</strong> and <em>Italic</em> text</li>
  <li><a href="https://example.com?utm_source=google&utm_medium=cpc&gclid=123">Link with Tracking</a></li>
</ul>
<pre><code class="language-javascript">console.log("Convert HTML to MD easily");</code></pre>
<blockquote>"The best free online converter tool."</blockquote>`;
    }
};