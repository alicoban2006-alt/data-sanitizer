'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { 
  Copy, 
  Check, 
  Download, 
  ClipboardPaste, 
  FileCheck2, 
  FileWarning, 
  Info, 
  Trash2, 
  Sparkles,
  Zap,
  ShieldCheck,
  Code
} from 'lucide-react';
import { Navbar } from './Navbar';
import { Toolbar } from './Toolbar';
import { SupportModal } from './SupportModal';
import { StatsBar } from './StatsBar';
import { FormatConverterView } from './FormatConverterView';
import { sanitizeData, DEFAULT_OPTIONS, SanitizerOptions } from '@/lib/sanitizer';
import { SAMPLES, SampleData } from '@/lib/samples';
import { Language, translations } from '@/lib/i18n';

export function SanitizerApp() {
  const [input, setInput] = useState<string>(SAMPLES[0].data);
  const [options, setOptions] = useState<SanitizerOptions>(DEFAULT_OPTIONS);
  const [copied, setCopied] = useState<boolean>(false);
  const [isCoffeeOpen, setIsCoffeeOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  // Default language: English (en)
  const [lang, setLang] = useState<Language>('en');
  
  // Theme state: default dark
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  
  // Tab state: 'sanitizer' vs 'converter'
  const [activeTab, setActiveTab] = useState<'sanitizer' | 'converter'>('sanitizer');

  // Load language and theme from localStorage on client mount
  useEffect(() => {
    const savedLang = localStorage.getItem('datapurge-lang') as Language | null;
    if (savedLang === 'en' || savedLang === 'tr') {
      setLang(savedLang);
    }

    const savedTheme = localStorage.getItem('datapurge-theme') as 'dark' | 'light' | null;
    const initialTheme = savedTheme || 'dark';
    setTheme(initialTheme);
    if (initialTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleLang = () => {
    const nextLang: Language = lang === 'en' ? 'tr' : 'en';
    setLang(nextLang);
    localStorage.setItem('datapurge-lang', nextLang);
  };

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('datapurge-theme', nextTheme);
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const t = translations[lang];

  // Real-time pure sanitization calculation
  const result = useMemo(() => {
    return sanitizeData(input, options);
  }, [input, options]);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((curr) => (curr === msg ? null : curr));
    }, 2500);
  }, []);

  const handleCopy = async () => {
    if (!result.output) return;
    try {
      await navigator.clipboard.writeText(result.output);
      setCopied(true);
      showToast(t.toastCopied);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast(t.toastCopyFailed);
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setInput(text);
        showToast(t.toastPasted);
      }
    } catch {
      showToast(t.toastPasteDenied);
    }
  };

  const handleDownload = () => {
    if (!result.output) return;
    const isJson = result.isJson && result.jsonValid;
    const filename = isJson ? 'sanitized-data.json' : 'sanitized-text.txt';
    const blob = new Blob([result.output], {
      type: isJson ? 'application/json' : 'text/plain',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(`${filename} ${t.toastDownloaded}`);
  };

  const handleSelectSample = (sample: SampleData) => {
    setInput(sample.data);
    showToast(`${t.toastSampleLoaded} (${sample.label})`);
  };

  const handleClear = () => {
    setInput('');
    showToast(t.toastCleared);
  };

  const inputLines = input ? input.split('\n').length : 0;
  const outputLines = result.output ? result.output.split('\n').length : 0;

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    return `${(bytes / 1024).toFixed(1)} KB`;
  };

  const sizeDiff = result.inputByteCount > 0 
    ? Math.round(((result.outputByteCount - result.inputByteCount) / result.inputByteCount) * 100)
    : 0;

  const sanitizerFixes = 
    result.stats.invisibleCharsRemoved +
    result.stats.ansiCodesRemoved +
    result.stats.quotesNormalized +
    result.stats.commentsRemoved +
    (result.stats.jsonRepaired ? 1 : 0) +
    result.stats.maskedCount;

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 font-sans selection:bg-cyan-500/30 selection:text-cyan-600 dark:selection:text-cyan-200 transition-colors">
      {/* Top Navbar */}
      <Navbar 
        onOpenCoffee={() => setIsCoffeeOpen(true)}
        theme={theme}
        onToggleTheme={toggleTheme}
        lang={lang}
        onToggleLang={toggleLang}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
      />

      {/* Hero Headline / Value Statement */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-200/60 dark:border-neutral-800/60 pb-4">
          <div>
            <h1 className="text-lg sm:text-xl font-bold tracking-tight text-neutral-900 dark:text-white flex items-center gap-2">
              <span>{t.heroTitle}</span>
            </h1>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 max-w-2xl">
              {t.heroSubtitle}
            </p>
          </div>

          <div className="flex items-center gap-2 text-[11px] font-mono text-neutral-500 dark:text-neutral-400 shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>{t.heroBadge}</span>
          </div>
        </div>
      </div>

      {/* Action Toolbar (Only in Sanitizer tab) */}
      {activeTab === 'sanitizer' && (
        <Toolbar
          options={options}
          onOptionsChange={setOptions}
          onSelectSample={handleSelectSample}
          onClear={handleClear}
          hasInput={Boolean(input)}
          lang={lang}
        />
      )}

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:px-6 lg:px-8 flex flex-col gap-5">
        {activeTab === 'converter' ? (
          /* Multi-Format Converter View (Free of any render freeze!) */
          <FormatConverterView 
            onNotify={showToast} 
            lang={lang}
          />
        ) : (
          /* Sanitizer & Repair View */
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-[500px]">
              {/* Left Editor: Input */}
              <div className="flex flex-col bg-white dark:bg-neutral-900/70 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden shadow-xl focus-within:border-cyan-500/50 transition-colors">
                <div className="flex items-center justify-between px-4 py-3 bg-neutral-50 dark:bg-neutral-900/90 border-b border-neutral-200 dark:border-neutral-800">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80 animate-pulse" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
                      {t.rawInput}
                    </span>
                    {result.isJson && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-800/40">
                        {t.jsonDetected}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={handlePaste}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white bg-neutral-200/60 dark:bg-neutral-800 hover:bg-neutral-300/60 dark:hover:bg-neutral-750 transition-colors"
                      title={t.paste}
                    >
                      <ClipboardPaste className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">{t.paste}</span>
                    </button>
                    {input && (
                      <button
                        onClick={handleClear}
                        className="p-1 rounded-md text-neutral-400 hover:text-rose-500 transition-colors"
                        title={t.clear}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex-1 relative">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={t.inputPlaceholder}
                    spellCheck={false}
                    className="w-full h-full min-h-[380px] lg:min-h-[460px] p-4 bg-transparent text-neutral-800 dark:text-neutral-200 font-mono text-[13px] leading-relaxed resize-none focus:outline-none placeholder:text-neutral-400 dark:placeholder:text-neutral-600"
                  />
                </div>

                <div className="px-4 py-2 bg-neutral-50 dark:bg-neutral-900/90 border-t border-neutral-200 dark:border-neutral-800 text-[11px] font-mono text-neutral-500 dark:text-neutral-400 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span>{result.inputCharCount} {t.chars}</span>
                    <span>•</span>
                    <span>{inputLines} {t.lines}</span>
                    <span>•</span>
                    <span>{formatBytes(result.inputByteCount)}</span>
                  </div>
                  <span className="text-neutral-400 dark:text-neutral-500 hidden sm:inline">{t.pasteShortcut}</span>
                </div>
              </div>

              {/* Right Editor: Output */}
              <div className="flex flex-col bg-white dark:bg-neutral-900/70 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden shadow-xl focus-within:border-emerald-500/50 transition-colors">
                <div className="flex items-center justify-between px-4 py-3 bg-neutral-50 dark:bg-neutral-900/90 border-b border-neutral-200 dark:border-neutral-800">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 dark:bg-emerald-400 shadow-sm shadow-emerald-400/50" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
                      {t.cleanedOutput}
                    </span>

                    {result.output ? (
                      result.jsonValid ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800/40">
                          <FileCheck2 className="w-3 h-3" />
                          {t.validJson}
                        </span>
                      ) : result.warnings.length > 0 ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800/40">
                          <FileWarning className="w-3 h-3" />
                          {t.textFormat}
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
                          {t.plainText}
                        </span>
                      )
                    ) : null}
                  </div>

                  <div className="flex items-center gap-2">
                    {result.output && (
                      <button
                        onClick={handleDownload}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white bg-neutral-200/60 dark:bg-neutral-800 hover:bg-neutral-300/60 dark:hover:bg-neutral-750 transition-colors"
                        title={t.download}
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">{t.download}</span>
                      </button>
                    )}

                    <button
                      onClick={handleCopy}
                      disabled={!result.output}
                      className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-sm active:scale-95 ${
                        copied
                          ? 'bg-emerald-500 text-neutral-950 shadow-emerald-500/20'
                          : 'bg-cyan-500 hover:bg-cyan-400 text-neutral-950 shadow-cyan-500/20 disabled:opacity-40 disabled:pointer-events-none'
                      }`}
                    >
                      {copied ? (
                        <>
                          <Check className="w-4 h-4 stroke-[2.5]" />
                          <span>{t.copied}</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 stroke-[2.2]" />
                          <span>{t.copy}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex-1 relative bg-neutral-50/50 dark:bg-neutral-950/40">
                  <textarea
                    readOnly
                    value={result.output}
                    placeholder={t.outputPlaceholder}
                    spellCheck={false}
                    className="w-full h-full min-h-[380px] lg:min-h-[460px] p-4 bg-transparent text-emerald-800 dark:text-emerald-300/90 font-mono text-[13px] leading-relaxed resize-none focus:outline-none placeholder:text-neutral-400 dark:placeholder:text-neutral-700 select-all"
                  />
                </div>

                <div className="px-4 py-2 bg-neutral-50 dark:bg-neutral-900/90 border-t border-neutral-200 dark:border-neutral-800 text-[11px] font-mono text-neutral-500 dark:text-neutral-400 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span>{result.outputCharCount} {t.chars}</span>
                    <span>•</span>
                    <span>{outputLines} {t.lines}</span>
                    <span>•</span>
                    <span>{formatBytes(result.outputByteCount)}</span>
                    {result.inputByteCount > 0 && (
                      <span className={`font-semibold ${sizeDiff < 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-neutral-500 dark:text-neutral-400'}`}>
                        ({sizeDiff > 0 ? `+${sizeDiff}` : sizeDiff}%)
                      </span>
                    )}
                  </div>
                  <span className="text-emerald-600 dark:text-emerald-400/80 font-medium hidden sm:inline">
                    {t.realtimeSync}
                  </span>
                </div>
              </div>
            </div>

            {/* Live Transformation Report Card */}
            {(result.stats.invisibleCharsRemoved > 0 ||
              result.stats.ansiCodesRemoved > 0 ||
              result.stats.quotesNormalized > 0 ||
              result.stats.jsonRepaired ||
              result.stats.commentsRemoved > 0 ||
              result.stats.maskedCount > 0 ||
              result.warnings.length > 0) && (
              <div className="p-4 rounded-xl bg-white dark:bg-neutral-900/90 border border-neutral-200 dark:border-neutral-800 text-xs flex flex-col md:flex-row md:items-center justify-between gap-3 animate-in fade-in">
                <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 font-semibold">
                  <Sparkles className="w-4 h-4 text-cyan-500 shrink-0" />
                  <span>{t.fixesTitle}</span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {result.stats.jsonRepaired && (
                    <span className="px-2.5 py-1 rounded-md bg-cyan-100 dark:bg-cyan-950/80 text-cyan-800 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-800/40 font-mono">
                      ✓ {t.fixJsonRepaired}
                    </span>
                  )}
                  {result.stats.invisibleCharsRemoved > 0 && (
                    <span className="px-2.5 py-1 rounded-md bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800/40 font-mono">
                      ✓ {result.stats.invisibleCharsRemoved} {t.fixInvisibleRemoved}
                    </span>
                  )}
                  {result.stats.quotesNormalized > 0 && (
                    <span className="px-2.5 py-1 rounded-md bg-indigo-100 dark:bg-indigo-950/80 text-indigo-800 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-800/40 font-mono">
                      ✓ {result.stats.quotesNormalized} {t.fixQuotesNormalized}
                    </span>
                  )}
                  {result.stats.ansiCodesRemoved > 0 && (
                    <span className="px-2.5 py-1 rounded-md bg-purple-100 dark:bg-purple-950/80 text-purple-800 dark:text-purple-300 border border-purple-300 dark:border-purple-800/40 font-mono">
                      ✓ {result.stats.ansiCodesRemoved} {t.fixAnsiRemoved}
                    </span>
                  )}
                  {result.stats.commentsRemoved > 0 && (
                    <span className="px-2.5 py-1 rounded-md bg-neutral-200/80 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-300 border border-neutral-300 dark:border-neutral-700/60 font-mono">
                      ✓ {result.stats.commentsRemoved} {t.fixCommentsRemoved}
                    </span>
                  )}
                  {result.stats.maskedCount > 0 && (
                    <span className="px-2.5 py-1 rounded-md bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800/40 font-mono">
                      ✓ {result.stats.maskedCount} {t.fixMasked}
                    </span>
                  )}
                </div>

                {result.warnings.length > 0 && (
                  <div className="text-amber-600 dark:text-amber-400/90 text-[11px] font-mono flex items-center gap-1">
                    <Info className="w-3.5 h-3.5" />
                    <span>{result.warnings[0]}</span>
                  </div>
                )}
              </div>
            )}

            {/* Live Stats Bar in Sanitizer View */}
            <StatsBar 
              inputBytes={result.inputByteCount}
              outputBytes={result.outputByteCount}
              totalFixes={sanitizerFixes}
              inputChars={result.inputCharCount}
              outputChars={result.outputCharCount}
              latencyMs={1}
              mode="sanitizer"
              lang={lang}
            />
          </>
        )}

        {/* Human, authentic developer value props */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-neutral-200 dark:border-neutral-800/60 text-neutral-500 dark:text-neutral-400 text-xs">
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-800/60 shadow-xs">
            <Zap className="w-4 h-4 text-cyan-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-neutral-800 dark:text-neutral-200 block mb-0.5">
                {t.prop1Title}
              </span>
              {t.prop1Desc}
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-800/60 shadow-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-neutral-800 dark:text-neutral-200 block mb-0.5">
                {t.prop2Title}
              </span>
              {t.prop2Desc}
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-800/60 shadow-xs">
            <Code className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-neutral-800 dark:text-neutral-200 block mb-0.5">
                {t.prop3Title}
              </span>
              {t.prop3Desc}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-200 dark:border-neutral-800/80 bg-white dark:bg-neutral-950 py-6 text-center text-xs text-neutral-500 transition-colors">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            DataPurge.dev &copy; 2026 — {t.footerText}
          </p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsCoffeeOpen(true)}
              className="text-amber-500 hover:text-amber-600 transition-colors font-medium"
            >
              {t.buyCoffee} ☕
            </button>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors"
            >
              {t.openSource}
            </a>
          </div>
        </div>
      </footer>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 shadow-2xl text-xs font-semibold animate-in slide-in-from-bottom-2 duration-200">
          <Check className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Coffee / Support Modal */}
      <SupportModal
        isOpen={isCoffeeOpen}
        onClose={() => setIsCoffeeOpen(false)}
        lang={lang}
      />
    </div>
  );
}
