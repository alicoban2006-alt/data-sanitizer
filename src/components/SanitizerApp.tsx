'use client';

import React, { useState, useMemo } from 'react';
import { 
  Copy, 
  Check, 
  Download, 
  ClipboardPaste, 
  FileCheck2, 
  FileWarning, 
  Info, 
  Trash2, 
  ArrowRightLeft,
  Sparkles,
  Zap,
  ShieldCheck,
  Code
} from 'lucide-react';
import { Navbar } from './Navbar';
import { Toolbar } from './Toolbar';
import { SupportModal } from './SupportModal';
import { sanitizeData, DEFAULT_OPTIONS, SanitizerOptions } from '@/lib/sanitizer';
import { SAMPLES, SampleData } from '@/lib/samples';

export function SanitizerApp() {
  const [input, setInput] = useState<string>(SAMPLES[0].data);
  const [options, setOptions] = useState<SanitizerOptions>(DEFAULT_OPTIONS);
  const [copied, setCopied] = useState<boolean>(false);
  const [isCoffeeOpen, setIsCoffeeOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Compute sanitized output in real-time
  const result = useMemo(() => {
    return sanitizeData(input, options);
  }, [input, options]);

  // Show a temporary toast notification
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((curr) => (curr === msg ? null : curr));
    }, 2500);
  };

  // Copy to clipboard with sleek feedback
  const handleCopy = async () => {
    if (!result.output) return;
    try {
      await navigator.clipboard.writeText(result.output);
      setCopied(true);
      showToast('Panoya başarıyla kopyalandı!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast('Kopyalama başarısız oldu.');
    }
  };

  // Paste from clipboard
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setInput(text);
        showToast('Panodan yapıştırıldı.');
      }
    } catch {
      showToast('Panoya erişim izni verilmedi.');
    }
  };

  // Download cleaned file
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
    showToast(`${filename} indirildi.`);
  };

  const handleSelectSample = (sample: SampleData) => {
    setInput(sample.data);
    showToast(`"${sample.label}" örneği yüklendi.`);
  };

  const handleClear = () => {
    setInput('');
    showToast('Temizlendi.');
  };

  // Calculate lines count
  const inputLines = input ? input.split('\n').length : 0;
  const outputLines = result.output ? result.output.split('\n').length : 0;

  // Format bytes for display
  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    return `${(bytes / 1024).toFixed(1)} KB`;
  };

  // Delta calculation
  const sizeDiff = result.inputByteCount > 0 
    ? Math.round(((result.outputByteCount - result.inputByteCount) / result.inputByteCount) * 100)
    : 0;

  return (
    <div className="min-h-screen flex flex-col bg-neutral-950 text-neutral-100 font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Navbar */}
      <Navbar onOpenCoffee={() => setIsCoffeeOpen(true)} />

      {/* Action Toolbar */}
      <Toolbar
        options={options}
        onOptionsChange={setOptions}
        onSelectSample={handleSelectSample}
        onClear={handleClear}
        hasInput={Boolean(input)}
      />

      {/* Main Workspace: Split Pane */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-4">
        {/* Editor Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 min-h-[580px]">
          {/* Left Editor: Input */}
          <div className="flex flex-col bg-neutral-900/70 border border-neutral-800 rounded-2xl overflow-hidden shadow-xl focus-within:border-cyan-500/50 transition-colors">
            {/* Left Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-neutral-900/90 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80 animate-pulse" />
                <span className="text-xs font-semibold uppercase tracking-wider text-neutral-300">
                  Ham / Kirli Veri Girişi
                </span>
                {result.isJson && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800/40">
                    JSON Algılandı
                  </span>
                )}
              </div>

              {/* Input action buttons */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handlePaste}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-750 transition-colors"
                  title="Panodan Yapıştır"
                >
                  <ClipboardPaste className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Yapıştır</span>
                </button>
                {input && (
                  <button
                    onClick={handleClear}
                    className="p-1 rounded-md text-neutral-400 hover:text-rose-400 hover:bg-neutral-800 transition-colors"
                    title="İçeriği Sil"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Input Textarea */}
            <div className="flex-1 relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Kirli metni, bozuk JSON kodunu, terminal loglarını veya veritabanı dizgisini buraya yapıştırın..."
                spellCheck={false}
                className="w-full h-full min-h-[420px] lg:min-h-[500px] p-4 bg-transparent text-neutral-200 font-mono text-[13px] leading-relaxed resize-none focus:outline-none placeholder:text-neutral-600"
              />
            </div>

            {/* Left Footer: Stats */}
            <div className="px-4 py-2 bg-neutral-900/90 border-t border-neutral-800 text-[11px] font-mono text-neutral-400 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span>{result.inputCharCount} karakter</span>
                <span>•</span>
                <span>{inputLines} satır</span>
                <span>•</span>
                <span>{formatBytes(result.inputByteCount)}</span>
              </div>
              <span className="text-neutral-500 hidden sm:inline">Ctrl + V ile yapıştır</span>
            </div>
          </div>

          {/* Right Editor: Output */}
          <div className="flex flex-col bg-neutral-900/70 border border-neutral-800 rounded-2xl overflow-hidden shadow-xl focus-within:border-emerald-500/50 transition-colors">
            {/* Right Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-neutral-900/90 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50" />
                <span className="text-xs font-semibold uppercase tracking-wider text-neutral-300">
                  Temizlenmiş Çıktı
                </span>

                {/* Validation Badge */}
                {result.output ? (
                  result.jsonValid ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-800/40">
                      <FileCheck2 className="w-3 h-3" />
                      Geçerli JSON
                    </span>
                  ) : result.warnings.length > 0 ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-950/80 text-amber-300 border border-amber-800/40">
                      <FileWarning className="w-3 h-3" />
                      Metin Formatı
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-300">
                      Temiz Metin
                    </span>
                  )
                ) : null}
              </div>

              {/* Right action buttons: Download & COPY TO CLIPBOARD */}
              <div className="flex items-center gap-2">
                {result.output && (
                  <button
                    onClick={handleDownload}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-750 transition-colors"
                    title="Dosya Olarak İndir"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">İndir</span>
                  </button>
                )}

                {/* Prominent Copy to Clipboard Button */}
                <button
                  onClick={handleCopy}
                  disabled={!result.output}
                  className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-md active:scale-95 ${
                    copied
                      ? 'bg-emerald-500 text-neutral-950 shadow-emerald-500/20'
                      : 'bg-cyan-500 hover:bg-cyan-400 text-neutral-950 shadow-cyan-500/20 disabled:opacity-40 disabled:pointer-events-none'
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 stroke-[2.5]" />
                      <span>Kopyalandı!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 stroke-[2.2]" />
                      <span>Panoya Kopyala</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Output Area */}
            <div className="flex-1 relative bg-neutral-950/40">
              <textarea
                readOnly
                value={result.output}
                placeholder="Temizlenen sonuç burada anlık (real-time) olarak görünecektir..."
                spellCheck={false}
                className="w-full h-full min-h-[420px] lg:min-h-[500px] p-4 bg-transparent text-emerald-300/90 font-mono text-[13px] leading-relaxed resize-none focus:outline-none placeholder:text-neutral-700 select-all"
              />
            </div>

            {/* Right Footer: Stats & Diffs */}
            <div className="px-4 py-2 bg-neutral-900/90 border-t border-neutral-800 text-[11px] font-mono text-neutral-400 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span>{result.outputCharCount} karakter</span>
                <span>•</span>
                <span>{outputLines} satır</span>
                <span>•</span>
                <span>{formatBytes(result.outputByteCount)}</span>
                {result.inputByteCount > 0 && (
                  <span className={`font-semibold ${sizeDiff < 0 ? 'text-emerald-400' : 'text-neutral-400'}`}>
                    ({sizeDiff > 0 ? `+${sizeDiff}` : sizeDiff}%)
                  </span>
                )}
              </div>
              <span className="text-emerald-400/80 font-medium hidden sm:inline">Anlık Senkronize Edildi</span>
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
          <div className="p-4 rounded-xl bg-neutral-900/90 border border-neutral-800 text-xs flex flex-col md:flex-row md:items-center justify-between gap-3 animate-in fade-in">
            <div className="flex items-center gap-2 text-cyan-400 font-semibold">
              <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Yapılan Temizleme İşlemleri:</span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {result.stats.jsonRepaired && (
                <span className="px-2.5 py-1 rounded-md bg-cyan-950/80 text-cyan-300 border border-cyan-800/40 font-mono">
                  ✓ Bozuk JSON Anahtar/Tırnak Yapısı Onarıldı
                </span>
              )}
              {result.stats.invisibleCharsRemoved > 0 && (
                <span className="px-2.5 py-1 rounded-md bg-emerald-950/80 text-emerald-300 border border-emerald-800/40 font-mono">
                  ✓ {result.stats.invisibleCharsRemoved} Gizli / Zero-Width Karakter Silindi
                </span>
              )}
              {result.stats.quotesNormalized > 0 && (
                <span className="px-2.5 py-1 rounded-md bg-indigo-950/80 text-indigo-300 border border-indigo-800/40 font-mono">
                  ✓ {result.stats.quotesNormalized} Akıllı Tırnak ASCII&apos;ye Dönüştürüldü
                </span>
              )}
              {result.stats.ansiCodesRemoved > 0 && (
                <span className="px-2.5 py-1 rounded-md bg-purple-950/80 text-purple-300 border border-purple-800/40 font-mono">
                  ✓ {result.stats.ansiCodesRemoved} Terminal Renk / ANSI Kodu Temizlendi
                </span>
              )}
              {result.stats.commentsRemoved > 0 && (
                <span className="px-2.5 py-1 rounded-md bg-neutral-800 text-neutral-300 border border-neutral-700/60 font-mono">
                  ✓ {result.stats.commentsRemoved} Yorum Satırı Temizlendi
                </span>
              )}
              {result.stats.maskedCount > 0 && (
                <span className="px-2.5 py-1 rounded-md bg-amber-950/80 text-amber-300 border border-amber-800/40 font-mono">
                  ✓ {result.stats.maskedCount} Hassas Veri (Token/E-posta) Maskelendi
                </span>
              )}
            </div>

            {result.warnings.length > 0 && (
              <div className="text-amber-400/90 text-[11px] font-mono flex items-center gap-1">
                <Info className="w-3.5 h-3.5" />
                <span>{result.warnings[0]}</span>
              </div>
            )}
          </div>
        )}

        {/* Feature Highlights / Value Proposition for Micro-SaaS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-neutral-800/60 text-neutral-400 text-xs">
          <div className="flex items-start gap-3 p-3 rounded-xl bg-neutral-900/40 border border-neutral-800/60">
            <Zap className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-neutral-200 block mb-0.5">Bozuk JSON Kurtarma</span>
              Tırnaksız nesne anahtarları, tek tırnaklar, Python Boolean (True/False/None) ve fazlalık virgülleri tek tıkla onarır.
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-neutral-900/40 border border-neutral-800/60">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-neutral-200 block mb-0.5">Sıfır Veri Sızıntısı</span>
              Tüm işlemler %100 tarayıcı belleğinde (Client-side) gerçekleşir. Hiçbir sunucuya veri gönderilmez.
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-neutral-900/40 border border-neutral-800/60">
            <Code className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-neutral-200 block mb-0.5">Gizli Karakter & ANSI Temizleyici</span>
              Slack, Notion veya ChatGPT kopyalamalarından gelen zero-width space ve Docker log kodlarını ayıklar.
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-800/80 bg-neutral-950 py-6 text-center text-xs text-neutral-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            DataPurge.dev &copy; 2026 — Geliştiriciler &amp; Veri Analistleri için Minimalist Micro-SaaS.
          </p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsCoffeeOpen(true)}
              className="text-amber-400 hover:text-amber-300 transition-colors"
            >
              Destek Ol ☕
            </button>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-neutral-300 transition-colors"
            >
              Açık Kaynak
            </a>
          </div>
        </div>
      </footer>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-700 shadow-2xl text-xs font-medium text-white animate-in slide-in-from-bottom-2 duration-200">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Coffee / Support Modal */}
      <SupportModal
        isOpen={isCoffeeOpen}
        onClose={() => setIsCoffeeOpen(false)}
      />
    </div>
  );
}
