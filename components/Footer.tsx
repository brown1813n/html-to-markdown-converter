import React from 'react';

interface FooterProps {
  onOpenAbout: () => void;
  onOpenPrivacy: () => void;
  onOpenContact: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAbout, onOpenPrivacy, onOpenContact }) => {
  return (
    <footer className="border-t border-slate-800 bg-slate-900/30 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
        <div>
          &copy; {new Date().getFullYear()} HTML to Markdown Converter.
        </div>
        <nav className="flex items-center gap-6">
          <button onClick={onOpenAbout} className="hover:text-slate-300 transition-colors">About Us</button>
          <button onClick={onOpenPrivacy} className="hover:text-slate-300 transition-colors">Privacy Policy</button>
          <button onClick={onOpenContact} className="hover:text-slate-300 transition-colors">Contact</button>
        </nav>
      </div>
    </footer>
  );
};