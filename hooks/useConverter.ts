import React, { useState, useEffect } from 'react';
import { convertContent, getSampleContent } from '../lib/converters';
import { ConversionType, ConverterStats, MarkdownPreset, ConversionOptions } from '../types';

const DEFAULT_OPTIONS: ConversionOptions = {
    headingStyle: 'atx',
    bulletListMarker: '-',
    codeBlockStyle: 'fenced',
    emDelimiter: '_',
    strongDelimiter: '**',
    linkStyle: 'inlined'
};

export const useConverter = () => {
  const [conversionType, setConversionType] = useState<ConversionType>('HTML_TO_MD');
  const [inputContent, setInputContent] = useState<string>('');
  const [outputContent, setOutputContent] = useState<string>('');
  const [cleanUrls, setCleanUrls] = useState<boolean>(true);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  
  // New State for Options
  const [preset, setPreset] = useState<MarkdownPreset>('default');
  const [options, setOptions] = useState<ConversionOptions>(DEFAULT_OPTIONS);

  // Track stats for the current conversion
  const [stats, setStats] = useState<ConverterStats>({
      charsOriginal: 0,
      charsMarkdown: 0, // In this context, it's just 'Output Chars'
      linksCleaned: 0
  });

  // Apply Presets
  useEffect(() => {
    let newOptions = { ...options };
    switch (preset) {
        case 'gfm':
            newOptions = { ...DEFAULT_OPTIONS, bulletListMarker: '-', codeBlockStyle: 'fenced' };
            break;
        case 'slack':
            // Slack uses single * for bold, _ for italic. 
            // It doesn't really support headers, but we keep atx for structure.
            newOptions = { 
                ...DEFAULT_OPTIONS, 
                strongDelimiter: '*', 
                emDelimiter: '_',
                bulletListMarker: '•' as any // Visual preference often used in slack pastes
            };
            break;
        case 'notion':
            // Notion prefers standard markdown but usually uses dashes
            newOptions = { ...DEFAULT_OPTIONS, bulletListMarker: '-', headingStyle: 'atx' };
            break;
        default:
            newOptions = DEFAULT_OPTIONS;
    }
    // Only update if different to avoid loops (though check is shallow)
    if (JSON.stringify(newOptions) !== JSON.stringify(options)) {
        setOptions(newOptions);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preset]);

  // Auto-convert when input or settings change
  useEffect(() => {
    if (!inputContent.trim()) {
      setOutputContent('');
      setStats({ charsOriginal: 0, charsMarkdown: 0, linksCleaned: 0 });
      return;
    }
    
    // Debounce conversion
    const timer = setTimeout(() => {
      try {
        const { result, linksCleaned } = convertContent(inputContent, conversionType, cleanUrls, options);
        setOutputContent(result);
        setStats({
            charsOriginal: inputContent.length,
            charsMarkdown: result.length,
            linksCleaned
        });
      } catch (e) {
        console.error("Conversion failed", e);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [inputContent, cleanUrls, conversionType, options]);

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

  const generateSample = async (): Promise<boolean> => {
    setIsProcessing(true);
    try {
      // Simulate network delay for UX or future async generation
      await new Promise(resolve => setTimeout(resolve, 500));
      const sample = getSampleContent(conversionType);
      setInputContent(sample);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  const clearContent = () => {
      setInputContent('');
      setOutputContent('');
      setStats({ charsOriginal: 0, charsMarkdown: 0, linksCleaned: 0 });
  };

  const updateOption = (key: keyof ConversionOptions, value: any) => {
      setOptions(prev => ({ ...prev, [key]: value }));
      // If user manually changes an option, technically they are drifting from the preset
      // We could set preset to 'custom' if we wanted, but keeping 'default' is fine for now
  };

  return {
    conversionType,
    setConversionType,
    inputContent,
    setInputContent,
    outputContent,
    cleanUrls,
    setCleanUrls,
    isProcessing,
    stats,
    handleFileUpload,
    generateSample,
    clearContent,
    // New exports
    preset,
    setPreset,
    options,
    updateOption
  };
};