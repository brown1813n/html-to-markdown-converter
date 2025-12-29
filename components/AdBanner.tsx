import React from 'react';

export const AdBanner: React.FC = () => {
  return (
    <div className="w-full bg-slate-900/50 border border-slate-800 rounded-lg p-4 flex flex-col items-center justify-center gap-2 overflow-hidden relative group cursor-pointer hover:bg-slate-900 transition-colors">
      <div className="text-[10px] font-bold text-slate-600 tracking-widest uppercase mb-1">Advertisement</div>
      <div className="w-full h-[90px] bg-slate-800 rounded border border-slate-700/50 flex items-center justify-center relative overflow-hidden">
          <span className="text-slate-500 font-mono text-xs">Google AdSense Banner</span>
          {/* Decorative pattern to indicate placement */}
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#64748b 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>
      </div>
    </div>
  );
};