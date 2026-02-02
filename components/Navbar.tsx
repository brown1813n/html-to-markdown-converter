import React, { useState } from 'react';
import { FileCode, Link, CheckCircle2, Sparkles, Share2, Menu } from 'lucide-react';
import { Button } from './Button';
import { ConversionType } from '../types';

interface NavbarProps {
  conversionType: ConversionType;
  setConversionType: (type: ConversionType) => void;
  cleanUrls: boolean;
  setCleanUrls: (clean: boolean) => void;
  isProcessing: boolean;
  onGenerateSample: () => void;
  onShare: () => void;
  onNavigateHome: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  conversionType,
  setConversionType,
  cleanUrls,
  setCleanUrls,
  isProcessing,
  onGenerateSample,
  onShare,
  onNavigateHome
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleModeChange = (type: ConversionType) => {
    setConversionType(type);
    onNavigateHome();
  };

  const ModeButton = ({ type, label }: { type: ConversionType; label: string }) => (
    <button 
        onClick={() => handleModeChange(type)}
        className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all whitespace-nowrap ${
        conversionType === type 
            ? 'bg-blue-600 text-white shadow' 
            : 'text-slate-400 hover:text-slate-200'
        }`}
    >
        {label}
    </button>
  );

  return (
    <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={onNavigateHome}>
            <div className="bg-gradient-to-br from-blue-500 to-cyan-400 p-2 rounded-lg">
              <FileCode className="w-5 h-5 text-white" />
            </div>
            <h1 className="hidden sm:block text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              Markdown Formatter & Converter
            </h1>
          </div>

          {/* Desktop Nav Actions */}
          <div className="hidden lg:flex items-center gap-4">
            <div className="flex items-center gap-1 bg-slate-800/50 p-1 rounded-lg border border-slate-700/50">
                <ModeButton type="MD_TO_MD" label="MD → MD" />
                <ModeButton type="HTML_TO_MD" label="HTML → MD" />
                <ModeButton type="MD_TO_HTML" label="MD → HTML" />
                <ModeButton type="HTML_TO_TEXT" label="HTML → Text" />
            </div>
            
            <div className="flex items-center gap-2 bg-slate-800/50 p-1 rounded-lg border border-slate-700/50">
                <button 
                  onClick={() => setCleanUrls(!cleanUrls)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${cleanUrls ? 'bg-green-500/10 text-green-400' : 'text-slate-400 hover:text-slate-300'}`}
                  title="Clean tracking parameters from URLs"
                >
                  <Link className="w-3.5 h-3.5" />
                  {cleanUrls ? 'Clean URLs' : 'Keep Params'}
                  {cleanUrls && <CheckCircle2 className="w-3 h-3" />}
                </button>
            </div>

            <div className="flex items-center gap-2">
                <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={onShare}
                    className="text-slate-400 hover:text-white"
                    title="Share this page"
                >
                    <Share2 className="w-5 h-5" />
                </Button>
                <Button 
                    variant="secondary" 
                    size="sm" 
                    onClick={onGenerateSample}
                    isLoading={isProcessing}
                    icon={<Sparkles className="w-4 h-4 text-yellow-400" />}
                >
                    Sample
                </Button>
            </div>
          </div>

           {/* Mobile Menu Button */}
           <div className="lg:hidden">
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
                className="p-2 text-slate-400 hover:bg-slate-800 rounded-lg"
              >
                <Menu className="w-6 h-6" />
              </button>
           </div>
        </div>
        
        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
           <div className="lg:hidden border-t border-slate-800 bg-slate-900 px-4 py-4 space-y-4 animate-in slide-in-from-top-2">
              <div className="grid grid-cols-2 gap-2">
                 <button 
                   onClick={() => { handleModeChange('MD_TO_MD'); setMobileMenuOpen(false); }}
                   className={`p-2 rounded text-xs font-medium text-center border ${conversionType === 'MD_TO_MD' ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400'}`}
                 >
                   MD → MD
                 </button>
                 <button 
                   onClick={() => { handleModeChange('HTML_TO_MD'); setMobileMenuOpen(false); }}
                   className={`p-2 rounded text-xs font-medium text-center border ${conversionType === 'HTML_TO_MD' ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400'}`}
                 >
                   HTML → MD
                 </button>
                 <button 
                   onClick={() => { handleModeChange('MD_TO_HTML'); setMobileMenuOpen(false); }}
                   className={`p-2 rounded text-xs font-medium text-center border ${conversionType === 'MD_TO_HTML' ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400'}`}
                 >
                   MD → HTML
                 </button>
                 <button 
                   onClick={() => { handleModeChange('HTML_TO_TEXT'); setMobileMenuOpen(false); }}
                   className={`p-2 rounded text-xs font-medium text-center border ${conversionType === 'HTML_TO_TEXT' ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400'}`}
                 >
                   HTML → Text
                 </button>
              </div>
              
              <div className="flex items-center justify-between">
                <button 
                  onClick={() => setCleanUrls(!cleanUrls)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all w-full justify-center ${cleanUrls ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-slate-800 text-slate-400 border border-slate-700'}`}
                >
                  <Link className="w-4 h-4" />
                  {cleanUrls ? 'Cleaning URLs Active' : 'Enable URL Cleaning'}
                </button>
              </div>

               <Button 
                variant="secondary" 
                size="md" 
                onClick={() => { onGenerateSample(); setMobileMenuOpen(false); }}
                isLoading={isProcessing}
                className="w-full"
                icon={<Sparkles className="w-4 h-4 text-yellow-400" />}
              >
                Generate Sample Content
              </Button>

              <Button 
                variant="ghost" 
                size="md" 
                onClick={() => { onShare(); setMobileMenuOpen(false); }}
                className="w-full border border-slate-700 text-slate-400"
                icon={<Share2 className="w-4 h-4" />}
              >
                Share Page
              </Button>
           </div>
        )}
      </header>
  );
};