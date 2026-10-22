'use client';

import React, { useState, useMemo } from 'react';
import { 
  ArrowRightLeft, 
  Copy, 
  Check, 
  Download, 
  ClipboardPaste, 
  Trash2, 
  AlertCircle, 
  CheckCircle2
} from 'lucide-react';
import { 
  SupportedFormat, 
  convertFormat, 
  detectFormat 
} from '@/lib/converter';
import { SAMPLES } from '@/lib/samples';
import { Language, translations } from '@/lib/i18n';
import { StatsBar } from './StatsBar';

interface FormatConverterViewProps {
  onNotify: (msg: string) => void;
  lang: Language;
}

export function FormatConverterView({ onNotify, lang }: FormatConverterViewProps) {
  const t = translations[lang];
  const [input, setInput] = useState<string>(SAMPLES[4].data); // CSV sample default
  const [fromFormat, setFromFormat] = useState<SupportedFormat | 'auto'>('auto');
  const [toFormat, setToFormat] = useState<SupportedFormat>('json');
  const [copied, setCopied] = useState<boolean>(false);

  // Pure memoized conversion without side effects or parent re-renders
  const result = useMemo(() => {
    return convertFormat(input, fromFormat, toFormat);
  }, [input, fromFormat, toFormat]);

  const detected = useMemo(() => detectFormat(input), [input]);

  const inBytes = useMemo(() => new TextEncoder().encode(input).length, [input]);
  const outBytes = useMemo(() => new TextEncoder().encode(result.output).length, [result.output]);

  const handleCopy = async () => {
    if (!result.output) return;
    try {
      await navigator.clipboard.writeText(result.output);
      setCopied(true);
      onNotify(t.toastCopied);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      onNotify(t.toastCopyFailed);
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setInput(text);
        onNotify(t.toastPasted);
      }
    } catch {
      onNotify(t.toastPasteDenied);
    }
  };

  const handleSwap = () => {
    const currentSource = fromFormat === 'auto' ? detected : fromFormat;
    setFromFormat(toFormat);
    setToFormat(currentSource);
    if (result.output) {
      setInput(result.output);
    }
    onNotify(t.toastSwapped);
  };

  const handleDownload = () => {
    if (!result.output) return;
    const extMap: Record<SupportedFormat, string> = {
      json: 'json',
      yaml: 'yaml',
      xml: 'xml',
      csv: 'csv',
    };
    const mimeMap: Record<SupportedFormat, string> = {
      json: 'application/json',
      yaml: 'text/yaml',
      xml: 'application/xml',
      csv: 'text/csv',
    };
    const filename = `data.${extMap[toFormat]}`;
    const blob = new Blob([result.output], { type: mimeMap[toFormat] });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    onNotify(`${filename} ${t.toastDownloaded}`);
  };

  const handleLoadSample = (sampleId: string) => {
    const sample = SAMPLES.find((s) => s.id === sampleId);
    if (sample) {
      setInput(sample.data);
      if (sample.format) {
        setFromFormat(sample.format);
        if (sample.format === 'csv') setToFormat('json');
        else if (sample.format === 'json') setToFormat('yaml');
        else if (sample.format === 'yaml') setToFormat('json');
        else if (sample.format === 'xml') setToFormat('json');
      }
      onNotify(t.toastSampleLoaded);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Top Format Selector Controls Bar */}
      <div className="bg-white/80 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-3 sm:p-4 shadow-xs flex flex-wrap items-center justify-between gap-3 transition-colors">
        <div className="flex flex-wrap items-center gap-3">
          {/* Source Format */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">{t.source}</span>
            <div className="flex items-center rounded-xl bg-neutral-100 dark:bg-neutral-950 p-1 border border-neutral-200 dark:border-neutral-800 text-xs">
              {(['auto', 'json', 'yaml', 'xml', 'csv'] as const).map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => setFromFormat(fmt)}
                  className={`px-2.5 py-1 rounded-lg uppercase font-mono font-medium transition-colors ${
                    fromFormat === fmt
                      ? 'bg-white dark:bg-neutral-800 text-cyan-600 dark:text-cyan-300 shadow-xs font-bold'
                      : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200'
                  }`}
                >
                  {fmt === 'auto' ? `${t.autoDetect} (${detected.toUpperCase()})` : fmt}
                </button>
              ))}
            </div>
          </div>

          {/* Swap Button */}
          <button
            onClick={handleSwap}
            className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300 transition-transform active:scale-90"
            title={t.swap}
          >
            <ArrowRightLeft className="w-4 h-4" />
          </button>

          {/* Target Format */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">{t.target}</span>
            <div className="flex items-center rounded-xl bg-neutral-100 dark:bg-neutral-950 p-1 border border-neutral-200 dark:border-neutral-800 text-xs">
              {(['json', 'yaml', 'xml', 'csv'] as const).map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => setToFormat(fmt)}
                  className={`px-2.5 py-1 rounded-lg uppercase font-mono font-medium transition-colors ${
                    toFormat === fmt
                      ? 'bg-cyan-500 text-neutral-950 font-bold shadow-xs'
                      : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200'
                  }`}
                >
                  {fmt}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Sample Presets */}
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-neutral-400 hidden md:inline text-[11px]">{t.examples}</span>
          <button
            onClick={() => handleLoadSample('csv-sample')}
            className="px-2.5 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-800/80 hover:bg-neutral-200 dark:hover:bg-neutral-750 text-neutral-700 dark:text-neutral-300 font-mono text-[11px] border border-neutral-200 dark:border-neutral-700/60 transition-colors"
          >
            CSV
          </button>
          <button
            onClick={() => handleLoadSample('yaml-sample')}
            className="px-2.5 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-800/80 hover:bg-neutral-200 dark:hover:bg-neutral-750 text-neutral-700 dark:text-neutral-300 font-mono text-[11px] border border-neutral-200 dark:border-neutral-700/60 transition-colors"
          >
            YAML
          </button>
          <button
            onClick={() => handleLoadSample('xml-sample')}
            className="px-2.5 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-800/80 hover:bg-neutral-200 dark:hover:bg-neutral-750 text-neutral-700 dark:text-neutral-300 font-mono text-[11px] border border-neutral-200 dark:border-neutral-700/60 transition-colors"
          >
            XML
          </button>
        </div>
      </div>

      {/* Editor Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-[500px]">
        {/* Left: Source Input */}
        <div className="flex flex-col bg-white dark:bg-neutral-900/70 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden shadow-xl focus-within:border-cyan-500/50 transition-colors">
          <div className="flex items-center justify-between px-4 py-3 bg-neutral-50 dark:bg-neutral-900/90 border-b border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
                {fromFormat === 'auto' ? `${t.autoDetect}: ${detected.toUpperCase()}` : fromFormat.toUpperCase()}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={handlePaste}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white bg-neutral-200/60 dark:bg-neutral-800 transition-colors"
              >
                <ClipboardPaste className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t.paste}</span>
              </button>
              {input && (
                <button
                  onClick={() => setInput('')}
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
              placeholder={t.converterInputPlaceholder}
              spellCheck={false}
              className="w-full h-full min-h-[380px] lg:min-h-[460px] p-4 bg-transparent text-neutral-800 dark:text-neutral-200 font-mono text-[13px] leading-relaxed resize-none focus:outline-none placeholder:text-neutral-400 dark:placeholder:text-neutral-600"
            />
          </div>

          <div className="px-4 py-2 bg-neutral-50 dark:bg-neutral-900/90 border-t border-neutral-200 dark:border-neutral-800 text-[11px] font-mono text-neutral-500 dark:text-neutral-400 flex items-center justify-between">
            <span>{input.length} {t.chars} • {inBytes} B</span>
            <span>{t.source} {detected.toUpperCase()}</span>
          </div>
        </div>

        {/* Right: Target Output */}
        <div className="flex flex-col bg-white dark:bg-neutral-900/70 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden shadow-xl focus-within:border-emerald-500/50 transition-colors">
          <div className="flex items-center justify-between px-4 py-3 bg-neutral-50 dark:bg-neutral-900/90 border-b border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50" />
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
                {toFormat.toUpperCase()}
              </span>
              {result.success && result.output && (
                <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  <CheckCircle2 className="w-3 h-3" />
                  {t.convertedBadge}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {result.output && (
                <button
                  onClick={handleDownload}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white bg-neutral-200/60 dark:bg-neutral-800 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{t.download}</span>
                </button>
              )}

              <button
                onClick={handleCopy}
                disabled={!result.output || !result.success}
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
            {result.error ? (
              <div className="p-6 flex items-start gap-3 text-rose-500 bg-rose-500/5 dark:bg-rose-500/10 h-full">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold mb-1">{t.parseError}</h4>
                  <p className="text-xs font-mono leading-relaxed">{result.error}</p>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-3">
                    {t.parseHint} ({fromFormat === 'auto' ? detected.toUpperCase() : fromFormat.toUpperCase()}).
                  </p>
                </div>
              </div>
            ) : (
              <textarea
                readOnly
                value={result.output}
                placeholder={t.outputPlaceholder}
                spellCheck={false}
                className="w-full h-full min-h-[380px] lg:min-h-[460px] p-4 bg-transparent text-emerald-800 dark:text-emerald-300/90 font-mono text-[13px] leading-relaxed resize-none focus:outline-none placeholder:text-neutral-400 dark:placeholder:text-neutral-700 select-all"
              />
            )}
          </div>

          <div className="px-4 py-2 bg-neutral-50 dark:bg-neutral-900/90 border-t border-neutral-200 dark:border-neutral-800 text-[11px] font-mono text-neutral-500 dark:text-neutral-400 flex items-center justify-between">
            <span>{result.output.length} {t.chars} • {outBytes} B</span>
            <span className="text-emerald-600 dark:text-emerald-400/80 font-medium hidden sm:inline">
              {t.realtimeSync}
            </span>
          </div>
        </div>
      </div>

      {/* Live Telemetry Bar directly rendered for Converter */}
      <StatsBar
        inputBytes={inBytes}
        outputBytes={outBytes}
        totalFixes={result.success ? 1 : 0}
        inputChars={input.length}
        outputChars={result.output.length}
        latencyMs={1}
        mode="converter"
        lang={lang}
      />
    </div>
  );
}
