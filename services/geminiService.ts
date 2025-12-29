import { GoogleGenAI } from "@google/genai";
import { ConversionType } from '../types';

export class GeminiService {
  private ai: GoogleGenAI;
  private apiKey: string | undefined;

  constructor() {
    this.apiKey = process.env.API_KEY;
    if (this.apiKey) {
      this.ai = new GoogleGenAI({ apiKey: this.apiKey });
    } else {
        console.warn("API_KEY is missing. Gemini features will be disabled.");
    }
  }

  async optimizeContent(content: string, type: ConversionType): Promise<string> {
    if (!this.apiKey || !this.ai) {
      throw new Error("API Key not configured");
    }

    let prompt = "";
    let targetFormat = "";

    switch (type) {
        case 'HTML_TO_MD':
            targetFormat = "Markdown";
            prompt = `You are an expert technical editor. Refine the following Markdown content. 
            1. Fix any broken CommonMark syntax.
            2. Ensure heading levels are consistent.
            3. Fix table formatting if broken.
            4. Improve readability without changing the original meaning.
            5. Return ONLY the markdown.`;
            break;
        case 'MD_TO_HTML':
            targetFormat = "HTML";
            prompt = `You are an expert web developer. Refine the following HTML content.
            1. Ensure semantic HTML5 tags are used correctly.
            2. Fix indentation and formatting.
            3. Ensure accessibility attributes (aria, alt) are present where obvious.
            4. Return ONLY the HTML code.`;
            break;
        case 'HTML_TO_TEXT':
            targetFormat = "Plain Text";
            prompt = `You are an expert editor. Refine the following Plain Text content.
            1. Fix grammar and punctuation.
            2. Improve flow and readability.
            3. Remove any leftover artifacts that look like broken code or tags.
            4. Return ONLY the plain text.`;
            break;
    }

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `${prompt}
        
        Content:
        ${content}`,
        config: {
            temperature: 0.2,
        }
      });
      
      let text = response.text || content;
      
      // Clean up potential code block wrappings from the model
      if (text.startsWith('```')) {
        text = text.replace(/^```[a-z]*\s*/, '').replace(/\s*```$/, '');
      }

      return text;
    } catch (error) {
      console.error("Gemini Optimization Error:", error);
      throw error;
    }
  }

  async generateSample(type: ConversionType): Promise<string> {
    if (!this.apiKey || !this.ai) {
         // Fallbacks
         if (type === 'MD_TO_HTML') {
             return `# HTML to Markdown Converter\n\nThis is a **markdown** sample.\n\n[Link with Params](https://example.com?utm_source=test)`;
         }
         return `<h1>HTML to Markdown Converter</h1><p>This is a <strong>sample</strong> HTML.</p><a href="https://example.com?utm_source=test">Link</a>`;
    }

    let prompt = "";
    if (type === 'MD_TO_HTML') {
        prompt = "Generate a rich Markdown snippet (approx 300 words) containing: headings, bold/italic text, a list, a code block, and links with 'utm_' parameters. Return ONLY Markdown.";
    } else {
        // HTML input for both HTML->MD and HTML->Text
        prompt = "Generate a rich HTML snippet (approx 300 words) containing: headings, paragraphs, lists, a code block, and links with 'utm_' parameters. Return ONLY HTML.";
    }

    try {
        const response = await this.ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt
        });
        
        let out = response.text || "";
        out = out.replace(/^```[a-z]*\s*/, '').replace(/\s*```$/, '');
        return out;
    } catch (error) {
        console.error("Gemini Generation Error:", error);
        return "<!-- Error generating sample -->";
    }
  }
}

export const geminiService = new GeminiService();