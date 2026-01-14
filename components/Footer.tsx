import React from 'react';
import { PageView } from '../types';

interface FooterProps {
  onOpenAbout: () => void;
  onOpenPrivacy: () => void;
  onOpenContact: () => void;
  onNavigate: (page: PageView) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAbout, onOpenPrivacy, onOpenContact, onNavigate }) => {
  return (
    <footer className="border-t border-slate-800 bg-slate-900/30 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-slate-200 font-semibold mb-3">HTML to Markdown Converter</h3>
            <p className="text-slate-500 text-sm leading-relaxed max-w-sm">
              A free, privacy-focused tool to convert text between HTML, Markdown, and Plain Text formats. 
              Running entirely in your browser for maximum security.
            </p>
          </div>
          <div>
            <h3 className="text-slate-200 font-semibold mb-3">Resources</h3>
            <ul className="space-y-2 text-sm text-slate-500">
              <li>
                <button onClick={() => onNavigate('post-html-to-markdown')} className="hover:text-blue-400 transition-colors text-left">
                  HTML to Markdown Guide
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('post-markdown-to-html')} className="hover:text-blue-400 transition-colors text-left">
                  Markdown to HTML Guide
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('post-html-to-text')} className="hover:text-blue-400 transition-colors text-left">
                  HTML to Text Benefits
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('post-url-cleaning')} className="hover:text-blue-400 transition-colors text-left">
                  URL Cleaning & Privacy
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('post-markdown-guide')} className="hover:text-blue-400 transition-colors text-left">
                  Markdown Cheatsheet
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('post-static-sites')} className="hover:text-blue-400 transition-colors text-left">
                  Static Sites & Markdown
                </button>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-slate-200 font-semibold mb-3">Company</h3>
            <ul className="space-y-2 text-sm text-slate-500">
              <li><button onClick={onOpenAbout} className="hover:text-slate-300 transition-colors">About Us</button></li>
              <li><button onClick={onOpenPrivacy} className="hover:text-slate-300 transition-colors">Privacy Policy</button></li>
              <li><button onClick={onOpenContact} className="hover:text-slate-300 transition-colors">Contact</button></li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-600">
          <div>
            &copy; {new Date().getFullYear()} HTML to Markdown Converter. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};