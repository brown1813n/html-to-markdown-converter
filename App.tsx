import React, { useState, useEffect, useCallback } from 'react';
import { 
  FileCode, 
  ArrowRight, 
  Trash2, 
  Copy, 
  Download, 
  Link, 
  Sparkles,
  CheckCircle2,
  FileType
} from 'lucide-react';

import { convertContent, getLabels } from './lib/converters';
import { Button } from './components/Button';
import { AdBanner } from './components/AdBanner';
import { Footer } from './components/Footer';
import { Modal } from './components/Modal';
import { ConversionType } from './types';

type ModalType = 'about' | 'privacy' | 'contact' | null;

const App: React.FC = () => {
  const [conversionType, setConversionType] = useState<ConversionType>('HTML_TO_MD');
  const [inputContent, setInputContent] = useState<string>('');
  const [outputContent, setOutputContent] = useState<string>('');
  const [cleanUrls, setCleanUrls] = useState<boolean>(true);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  const labels = getLabels(conversionType);

  // Auto-convert when input or settings change
  useEffect(() => {
    if (!inputContent.trim()) {
      setOutputContent('');
      return;
    }
    
    const timer = setTimeout(() => {
      handleConversion();
    }, 300);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputContent, cleanUrls, conversionType]);

  const handleConversion = useCallback(() => {
    try {
      const result = convertContent(inputContent, conversionType, cleanUrls);
      setOutputContent(result);
    } catch (e) {
      console.error("Conversion failed", e);
    }
  }, [inputContent, conversionType, cleanUrls]);

  const getStaticSample = (type: ConversionType): string => {
    switch(type) {
      case 'MD_TO_HTML':
        return `# HTML to Markdown Converter

This is a **Markdown** sample to demonstrate conversion.

## Features
- **Bold** and *Italic* text
- [Link with Tracking](https://example.com?utm_source=google&utm_medium=cpc&gclid=123)
- Code blocks:
\`\`\`javascript
console.log("Convert HTML to MD easily");
\`\`\`

> "The best free online converter tool."
`;
      default: // HTML inputs
        return `<h1>HTML to Markdown Converter</h1>
<p>This is a <strong>HTML</strong> sample to demonstrate conversion.</p>
<h2>Features</h2>
<ul>
  <li><strong>Bold</strong> and <em>Italic</em> text</li>
  <li><a href="https://example.com?utm_source=google&utm_medium=cpc&gclid=123">Link with Tracking</a></li>
</ul>
<pre><code class="language-javascript">console.log("Convert HTML to MD easily");</code></pre>
<blockquote>"The best free online converter tool."</blockquote>`;
    }
  };

  const handleGenerateSample = async () => {
    setIsProcessing(true);
    try {
      // Simulate network delay for UX
      await new Promise(resolve => setTimeout(resolve, 500));
      const sample = getStaticSample(conversionType);
      setInputContent(sample);
    } catch (error) {
      triggerToast("Failed to generate sample");
    } finally {
      setIsProcessing(false);
    }
  };

  const copyToClipboard = async () => {
    if (!outputContent) return;
    await navigator.clipboard.writeText(outputContent);
    triggerToast("Copied to clipboard!");
  };

  const downloadFile = () => {
    if (!outputContent) return;
    
    let extension = 'txt';
    let mimeType = 'text/plain';

    if (conversionType === 'HTML_TO_MD') {
        extension = 'md';
        mimeType = 'text/markdown';
    } else if (conversionType === 'MD_TO_HTML') {
        extension = 'html';
        mimeType = 'text/html';
    }

    const blob = new Blob([outputContent], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `converted-content.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    triggerToast("File downloaded!");
  };

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setInputContent(content);
    };
    reader.readAsText(file);
    e.target.value = ''; 
  };

  const handleModeChange = (newMode: ConversionType) => {
      setConversionType(newMode);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col font-sans selection:bg-blue-500/30">
      {/* Navbar */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-blue-500 to-cyan-400 p-2 rounded-lg">
              <FileCode className="w-5 h-5 text-white" />
            </div>
            <h1 className="hidden sm:block text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              HTML to Markdown Converter
            </h1>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center gap-1 bg-slate-800/50 p-1 rounded-lg border border-slate-700/50">
             <button 
               onClick={() => handleModeChange('HTML_TO_MD')}
               className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${conversionType === 'HTML_TO_MD' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
             >
               HTML → MD
             </button>
             <button 
               onClick={() => handleModeChange('MD_TO_HTML')}
               className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${conversionType === 'MD_TO_HTML' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
             >
               MD → HTML
             </button>
             <button 
               onClick={() => handleModeChange('HTML_TO_TEXT')}
               className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${conversionType === 'HTML_TO_TEXT' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
             >
               HTML → Text
             </button>
          </div>
          
          <div className="flex items-center gap-3">
             <div className="hidden lg:flex items-center gap-2 mr-4 bg-slate-800/50 p-1 rounded-lg border border-slate-700/50">
               <button 
                 onClick={() => setCleanUrls(!cleanUrls)}
                 className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${cleanUrls ? 'bg-green-500/10 text-green-400' : 'text-slate-400 hover:text-slate-300'}`}
                 title="Clean tracking parameters from URLs"
               >
                 <Link className="w-3.5 h-3.5" />
                 {cleanUrls ? 'Cleaning URLs' : 'Keep Params'}
                 {cleanUrls && <CheckCircle2 className="w-3 h-3" />}
               </button>
             </div>

             <Button 
               variant="secondary" 
               size="sm" 
               onClick={handleGenerateSample}
               isLoading={isProcessing}
               className="hidden sm:flex"
               icon={<Sparkles className="w-4 h-4 text-yellow-400" />}
             >
               Sample
             </Button>
          </div>
        </div>
      </header>

      {/* AdBanner Top - Underneath the navbar conversion options */}
      <div className="max-w-7xl mx-auto px-4 mt-6 w-full">
         <AdBanner />
      </div>

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-6 flex flex-col md:flex-row gap-4 md:gap-6 relative">
        
        {/* Input Pane */}
        <section className="flex-1 flex flex-col min-h-[300px] md:min-h-[500px] bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-2xl">
          <div className="h-12 border-b border-slate-800 bg-slate-900 px-4 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                <FileType className="w-4 h-4" />
                {labels.input}
            </span>
            <div className="flex items-center gap-2">
                <label className="cursor-pointer text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors">
                    Upload
                    <input type="file" accept=".html,.htm,.txt,.md" className="hidden" onChange={handleFileUpload} />
                </label>
                <div className="w-px h-3 bg-slate-700 mx-1"></div>
                <button 
                  onClick={() => setInputContent('')}
                  className="p-1.5 text-slate-500 hover:text-red-400 rounded-md transition-colors" 
                  title="Clear"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
            </div>
          </div>
          <div className="flex-1 relative group">
            <textarea
              value={inputContent}
              onChange={(e) => setInputContent(e.target.value)}
              placeholder={`Paste your ${labels.input.split(' ')[0]} here...`}
              className="w-full h-full bg-transparent p-4 resize-none focus:outline-none font-mono text-sm leading-relaxed text-slate-300 placeholder:text-slate-600"
              spellCheck={false}
            />
          </div>
        </section>

        {/* Center Action (Desktop) */}
        <div className="hidden md:flex flex-col justify-center gap-2">
          <div className="p-2 rounded-full bg-slate-800 text-slate-500">
            <ArrowRight className="w-5 h-5" />
          </div>
        </div>

        {/* Output Pane */}
        <section className="flex-1 flex flex-col min-h-[300px] md:min-h-[500px] bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-2xl">
           <div className="h-12 border-b border-slate-800 bg-slate-900 px-4 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              {labels.output}
              {cleanUrls && outputContent && (
                 <span className="bg-green-500/10 text-green-500 px-1.5 py-0.5 rounded text-[10px]">Cleaned</span>
              )}
            </span>
            {/* AI Refine button removed */}
          </div>
          <div className="flex-1 relative bg-slate-950/30">
             <textarea
              value={outputContent}
              readOnly
              placeholder="Output will appear here..."
              className="w-full h-full bg-transparent p-4 resize-none focus:outline-none font-mono text-sm leading-relaxed text-emerald-400 placeholder:text-slate-700"
            />
          </div>
          <div className="h-14 border-t border-slate-800 bg-slate-900 px-4 flex items-center justify-between">
             <div className="text-xs text-slate-500">
                {outputContent.length} chars
             </div>
             <div className="flex items-center gap-3">
               <Button variant="ghost" size="sm" onClick={copyToClipboard} icon={<Copy className="w-4 h-4"/>}>
                 Copy
               </Button>
               <Button variant="primary" size="sm" onClick={downloadFile} icon={<Download className="w-4 h-4"/>}>
                 Download
               </Button>
             </div>
          </div>
        </section>

      </main>

      {/* AdBanner Bottom */}
      <div className="max-w-7xl mx-auto px-4 mb-8 w-full">
         <AdBanner />
      </div>

      <Footer 
        onOpenAbout={() => setActiveModal('about')}
        onOpenPrivacy={() => setActiveModal('privacy')}
        onOpenContact={() => setActiveModal('contact')}
      />

      {/* Modals */}
      <Modal 
        isOpen={activeModal === 'about'} 
        onClose={() => setActiveModal(null)} 
        title="About Us"
      >
        <p className="font-semibold text-white">Just trying my hand at making a simple web tool, hope you find it useful.</p>
        <p>
          HTML to Markdown Converter was started as an experiment to create a clean, clutter-free utility for developers, writers, and content creators. 
          Often, moving between CMS editors (like WordPress) and developer tools (like VS Code or GitHub) requires quick formatting shifts.
        </p>
        <p>
          We aimed to build a tool that respects your privacy (running entirely in your browser) while offering smart features like URL cleaning to keep your documents neat.
        </p>
      </Modal>

      <Modal 
        isOpen={activeModal === 'privacy'} 
        onClose={() => setActiveModal(null)} 
        title="Privacy Policy"
      >
        <h3 className="text-white font-semibold mb-2">Data Processing</h3>
        <p>
          We do not store, save, or transmit any of the text or files you process with this tool. 
          All conversions happen locally on your device using JavaScript. Your data never leaves your browser.
        </p>
        
        <h3 className="text-white font-semibold mt-4 mb-2">Cookies & Advertising</h3>
        <p>
          We use Google AdSense to display advertisements. Google and its partners may use cookies to serve ads based on your prior visits to this website or other websites.
        </p>
        <p>
          You can opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Google's Ad Settings</a>.
        </p>
      </Modal>

      <Modal 
        isOpen={activeModal === 'contact'} 
        onClose={() => setActiveModal(null)} 
        title="Contact Us"
      >
        <p>Have a question, found a bug, or just want to say hi?</p>
        <div className="bg-slate-800 p-4 rounded-lg mt-2 inline-flex items-center gap-2">
            <span className="text-slate-400">Email:</span>
            <a href="mailto:brown1813n@gmail.com" className="text-blue-400 hover:text-blue-300 font-medium">brown1813n@gmail.com</a>
        </div>
      </Modal>

      {/* Toast Notification */}
      <div 
        className={`fixed bottom-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white px-4 py-2 rounded-full shadow-2xl border border-slate-700 flex items-center gap-2 transition-all duration-300 z-50 ${showToast ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
      >
        <CheckCircle2 className="w-4 h-4 text-green-400" />
        <span className="text-sm font-medium">{toastMessage}</span>
      </div>
      
    </div>
  );
};

export default App;