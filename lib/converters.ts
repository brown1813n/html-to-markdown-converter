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
      
    case 'MD_TO_MD':
      // 1. Convert source Markdown to HTML using Marked
      // We don't clean links in this step, we let Turndown handle it in the next step
      const intermediateHtml = parse(input) as string;
      
      // 2. Convert HTML back to Markdown using Turndown with target options
      const { markdown: reformattedMd, linksCleaned: reformattedLinks } = turndownConvert(intermediateHtml, cleanUrls, options);
      return { result: reformattedMd, linksCleaned: reformattedLinks };

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
        case 'MD_TO_MD': return { input: 'Markdown Input', output: 'Reformatted Markdown' };
        case 'MD_TO_HTML': return { input: 'Markdown Input', output: 'HTML Output' };
        case 'HTML_TO_TEXT': return { input: 'HTML Input', output: 'Plain Text Output' };
    }
};

export const getSampleContent = (type: ConversionType): string => {
    switch(type) {
      case 'MD_TO_HTML':
      case 'MD_TO_MD':
        return `# Markdown Conversion

This sample demonstrates how to reformat **Markdown**.

## Why Convert MD to MD?
1. Convert headers to bold (for Slack)
2. Standardize list markers (- vs *)
3. Clean tracking URLs: [Link](https://example.com?utm_source=tracker)

> "Flexibility is key."

\`\`\`javascript
const simple = true;
\`\`\`
`;
      default: // HTML inputs for both HTML_TO_MD and HTML_TO_TEXT
        return `<h1>HTML to Markdown & Formatter</h1>
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