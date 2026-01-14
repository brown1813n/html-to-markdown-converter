import React, { useState, useEffect } from 'react';
import { Footer } from './components/Footer';
import { Modal } from './components/Modal';
import { BlogPost } from './components/BlogPost';
import { blogPosts } from './lib/blogContent';
import { PageView } from './types';
import { useConverter } from './hooks/useConverter';
import { Navbar } from './components/Navbar';
import { Workspace } from './components/Workspace';
import { Toast } from './components/Toast';
import { AdBanner } from './components/AdBanner';

type ModalType = 'about' | 'privacy' | 'contact' | null;

const APP_METADATA = {
  name: "HTML to Markdown Converter",
  description: "Free online tool to convert HTML to Markdown, Markdown to HTML, and HTML to Plain Text. Automatically cleans URLs and removes tracking parameters."
};

const App: React.FC = () => {
  // Application State
  const [currentView, setCurrentView] = useState<PageView>('home');
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [toast, setToast] = useState({ show: false, message: '' });

  // Custom Hook for Logic
  const converter = useConverter();

  // SEO Management
  useEffect(() => {
    if (currentView === 'home') {
      document.title = `${APP_METADATA.name} - Free Online Tool`;
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.setAttribute('name', 'description');
        document.head.appendChild(metaDescription);
      }
      metaDescription.setAttribute('content', APP_METADATA.description);
    }
  }, [currentView]);

  // Actions
  const triggerToast = (msg: string) => {
    setToast({ show: true, message: msg });
    setTimeout(() => setToast({ show: false, message: '' }), 3000);
  };

  const handleGenerateSample = async () => {
      const success = await converter.generateSample();
      if (!success) triggerToast("Failed to generate sample");
  };

  const handleCopy = async () => {
    if (!converter.outputContent) return;
    await navigator.clipboard.writeText(converter.outputContent);
    triggerToast("Copied to clipboard!");
  };

  const handleDownload = () => {
    if (!converter.outputContent) return;
    
    let extension = 'txt';
    let mimeType = 'text/plain';

    if (converter.conversionType === 'HTML_TO_MD') {
        extension = 'md';
        mimeType = 'text/markdown';
    } else if (converter.conversionType === 'MD_TO_HTML') {
        extension = 'html';
        mimeType = 'text/html';
    }

    const blob = new Blob([converter.outputContent], { type: mimeType });
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

  const handleShare = async () => {
    const shareData = {
      title: APP_METADATA.name,
      text: APP_METADATA.description,
      url: window.location.href,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        triggerToast("Page link copied!");
      }
    } catch (err) { /* Ignore */ }
  };

  // Render Page Content based on View
  const renderContent = () => {
    if (currentView === 'home') {
      return (
        <div className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-6 flex flex-col relative">
           <Workspace 
             inputContent={converter.inputContent}
             setInputContent={converter.setInputContent}
             outputContent={converter.outputContent}
             conversionType={converter.conversionType}
             cleanUrls={converter.cleanUrls}
             stats={converter.stats}
             onFileUpload={converter.handleFileUpload}
             onClear={converter.clearContent}
             onCopy={handleCopy}
             onDownload={handleDownload}
             // New Props for Options
             preset={converter.preset}
             setPreset={converter.setPreset}
             options={converter.options}
             updateOption={converter.updateOption}
           />
           
           {/* Ad Placement: Bottom of Workspace */}
           <div className="mt-8 w-full max-w-3xl mx-auto">
              <AdBanner />
           </div>
        </div>
      );
    }

    const postKey = currentView.replace('post-', '') as keyof typeof blogPosts;
    const post = blogPosts[postKey];
    if (post) {
      return (
        <BlogPost 
          {...post}
          onBack={() => setCurrentView('home')} 
        />
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col font-sans selection:bg-blue-500/30">
      
      {/* Navbar is always visible */}
      <Navbar 
        conversionType={converter.conversionType}
        setConversionType={converter.setConversionType}
        cleanUrls={converter.cleanUrls}
        setCleanUrls={converter.setCleanUrls}
        isProcessing={converter.isProcessing}
        onGenerateSample={handleGenerateSample}
        onShare={handleShare}
        onNavigateHome={() => setCurrentView('home')}
      />

      {/* Main Content Area */}
      {renderContent()}

      <Footer 
        onOpenAbout={() => setActiveModal('about')}
        onOpenPrivacy={() => setActiveModal('privacy')}
        onOpenContact={() => setActiveModal('contact')}
        onNavigate={(view) => setCurrentView(view)}
      />

      {/* Modals */}
      <Modal isOpen={activeModal === 'about'} onClose={() => setActiveModal(null)} title="About Us">
        <p className="font-semibold text-white">Just trying my hand at making a simple web tool, hope you find it useful.</p>
        <p>HTML to Markdown Converter was started as an experiment to create a clean, clutter-free utility for developers. We aimed to build a tool that respects your privacy while offering smart features like URL cleaning.</p>
      </Modal>

      <Modal isOpen={activeModal === 'privacy'} onClose={() => setActiveModal(null)} title="Privacy Policy">
        <h3 className="text-white font-semibold mb-2">Data Processing</h3>
        <p>We do not store, save, or transmit any of the text or files you process with this tool. All conversions happen locally on your device.</p>
        <h3 className="text-white font-semibold mt-4 mb-2">Cookies & Advertising</h3>
        <p>We use Google AdSense to display advertisements. Google and its partners may use cookies to serve ads based on your prior visits to this website or other websites.</p>
        <p>You can opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Google's Ad Settings</a>.</p>
      </Modal>

      <Modal isOpen={activeModal === 'contact'} onClose={() => setActiveModal(null)} title="Contact Us">
        <p>Have a question or found a bug?</p>
        <div className="bg-slate-800 p-4 rounded-lg mt-2 inline-flex items-center gap-2">
            <span className="text-slate-400">Email:</span>
            <a href="mailto:brown1813n@gmail.com" className="text-blue-400 hover:text-blue-300 font-medium">brown1813n@gmail.com</a>
        </div>
      </Modal>

      <Toast message={toast.message} isVisible={toast.show} />
      
    </div>
  );
};

export default App;