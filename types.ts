export enum ConversionMode {
  STANDARD = 'STANDARD',
  CLEAN_URLS = 'CLEAN_URLS',
}

export type ConversionType = 'HTML_TO_MD' | 'MD_TO_HTML' | 'HTML_TO_TEXT';

export type PageView = 
  | 'home' 
  | 'post-html-to-markdown' 
  | 'post-markdown-to-html' 
  | 'post-html-to-text'
  | 'post-url-cleaning'
  | 'post-markdown-guide'
  | 'post-static-sites';

export interface ConverterStats {
  charsOriginal: number;
  charsMarkdown: number;
  linksCleaned: number;
}

export type MarkdownPreset = 'default' | 'gfm' | 'slack' | 'notion';

export interface ConversionOptions {
  headingStyle: 'atx' | 'setext';
  bulletListMarker: '-' | '+' | '*';
  codeBlockStyle: 'fenced' | 'indented';
  emDelimiter: '_' | '*';
  strongDelimiter: '**' | '__' | '*';
  linkStyle: 'inlined' | 'referenced';
}

export interface TurndownRule {
  filter: string | string[] | ((node: HTMLElement, options: any) => boolean);
  replacement: (content: string, node: HTMLElement, options: any) => string;
}

// Minimal type definition for TurndownService since we are using it in a raw context
// In a real project, you would install @types/turndown
export interface TurndownServiceInstance {
  turndown: (html: string) => string;
  addRule: (key: string, rule: TurndownRule) => void;
  keep: (filter: string[]) => void;
  remove: (filter: string[]) => void;
  options: any;
  use: (plugin: any) => void;
}