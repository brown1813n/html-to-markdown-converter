import React from 'react';
import { ArrowRight, Trash2, Copy, Download, FileType, Link, Settings2 } from 'lucide-react';
import { Button } from './Button';
import { ConversionType, ConverterStats, MarkdownPreset, ConversionOptions } from '../types';
import { getLabels } from '../lib/converters';

interface WorkspaceProps {
  inputContent: string;
  setInputContent: (content: string) => void;
  outputContent: string;
  conversionType: ConversionType;
  cleanUrls: boolean;
  stats: ConverterStats;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
  onCopy: () => void;
  onDownload: () => void;
  // New Props
  preset?: MarkdownPreset;
  setPreset?: (preset: MarkdownPreset) => void;
  options?: ConversionOptions;
  updateOption?: (key: keyof ConversionOptions, value: any) => void;
}

export const Workspace: React.FC<WorkspaceProps> = ({
  inputContent,
  setInputContent,
  outputContent,
  conversionType,
  cleanUrls,
  stats,
  onFileUpload,
  onClear,
  onCopy,
  onDownload,
  preset,
  setPreset,
  options,
  updateOption
}) => {
  const labels = getLabels(conversionType);
  const isHtmlToMd = conversionType === 'HTML_TO_MD';

  return (
    <div className="flex flex-col gap-4 relative flex-1">
        
        {/* Settings Toolbar - Only visible for HTML -> MD */}
        {isHtmlToMd && setPreset && updateOption && options && (
            <div className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-wrap items-center gap-4 shadow-sm animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center gap-2 text-slate-400 text-sm font-medium border-r border-slate-800 pr-4">
                    <Settings2 className="w-4 h-4" />
                    <span>Config</span>
                </div>
                
                {/* Preset Selector */}
                <div className="flex flex-col gap-1">
                    <label className="text-[10px] uppercase text-slate-500 font-bold tracking-wider">Flavor</label>
                    <select 
                        value={preset} 
                        onChange={(e) => setPreset(e.target.value as MarkdownPreset)}
                        className="bg-slate-800 border-none text-slate-200 text-xs rounded px-2 py-1.5 focus:ring-1 focus:ring-blue-500 cursor-pointer hover:bg-slate-700 transition-colors"
                    >
                        <option value="default">Default</option>
                        <option value="gfm">GitHub (GFM)</option>
                        <option value="slack">Slack</option>
                        <option value="notion">Notion</option>
                    </select>
                </div>

                {/* Heading Style */}
                <div className="flex flex-col gap-1">
                    <label className="text-[10px] uppercase text-slate-500 font-bold tracking-wider">Heading</label>
                    <select 
                        value={options.headingStyle} 
                        onChange={(e) => updateOption('headingStyle', e.target.value)}
                        className="bg-slate-800 border-none text-slate-200 text-xs rounded px-2 py-1.5 focus:ring-1 focus:ring-blue-500 cursor-pointer hover:bg-slate-700 transition-colors"
                    >
                        <option value="atx"># ATX</option>
                        <option value="setext">Underline</option>
                    </select>
                </div>

                {/* Bullet Style */}
                <div className="flex flex-col gap-1">
                    <label className="text-[10px] uppercase text-slate-500 font-bold tracking-wider">List</label>
                    <select 
                        value={options.bulletListMarker} 
                        onChange={(e) => updateOption('bulletListMarker', e.target.value)}
                        className="bg-slate-800 border-none text-slate-200 text-xs rounded px-2 py-1.5 focus:ring-1 focus:ring-blue-500 cursor-pointer hover:bg-slate-700 transition-colors"
                    >
                        <option value="-">- Dash</option>
                        <option value="*">* Asterisk</option>
                        <option value="+">+ Plus</option>
                    </select>
                </div>

                {/* Code Block Style */}
                <div className="flex flex-col gap-1">
                    <label className="text-[10px] uppercase text-slate-500 font-bold tracking-wider">Code</label>
                    <select 
                        value={options.codeBlockStyle} 
                        onChange={(e) => updateOption('codeBlockStyle', e.target.value)}
                        className="bg-slate-800 border-none text-slate-200 text-xs rounded px-2 py-1.5 focus:ring-1 focus:ring-blue-500 cursor-pointer hover:bg-slate-700 transition-colors"
                    >
                        <option value="fenced">``` Fenced</option>
                        <option value="indented">    Indented</option>
                    </select>
                </div>
            </div>
        )}

        <div className="flex flex-col md:flex-row gap-4 md:gap-6 relative flex-1">
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
                        <input type="file" accept=".html,.htm,.txt,.md" className="hidden" onChange={onFileUpload} />
                    </label>
                    <div className="w-px h-3 bg-slate-700 mx-1"></div>
                    <button 
                    onClick={onClear}
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
                <div className="flex gap-4 text-xs text-slate-500 font-medium">
                    <span>{stats.charsMarkdown} chars</span>
                    {stats.linksCleaned > 0 && (
                        <span className="text-green-400 flex items-center gap-1 animate-in fade-in">
                            <Link className="w-3 h-3" />
                            {stats.linksCleaned} links cleaned
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-3">
                <Button variant="ghost" size="sm" onClick={onCopy} icon={<Copy className="w-4 h-4"/>}>
                    Copy
                </Button>
                <Button variant="primary" size="sm" onClick={onDownload} icon={<Download className="w-4 h-4"/>}>
                    Download
                </Button>
                </div>
            </div>
            </section>
        </div>
    </div>
  );
};