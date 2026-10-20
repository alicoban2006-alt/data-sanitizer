'use client';

import React, { useState } from 'react';
import { 
  Wand2, 
  Settings2, 
  FileJson, 
  Code2, 
  Sparkles, 
  SlidersHorizontal, 
  ChevronDown,
  ShieldAlert,
  Eraser,
  Check
} from 'lucide-react';
import { SanitizerOptions } from '@/lib/sanitizer';
import { SAMPLES, SampleData } from '@/lib/samples';

interface ToolbarProps {
  options: SanitizerOptions;
  onOptionsChange: (newOptions: SanitizerOptions) => void;
  onSelectSample: (sample: SampleData) => void;
  onClear: () => void;
  hasInput: boolean;
}

export function Toolbar({
  options,
  onOptionsChange,
  onSelectSample,
  onClear,
  hasInput,
}: ToolbarProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [sampleDropdownOpen, setSampleDropdownOpen] = useState(false);

  const toggleOption = (key: keyof SanitizerOptions) => {
    onOptionsChange({
      ...options,
      [key]: !options[key],
    });
  };

  const setIndent = (indent: 2 | 4 | 'minify') => {
    onOptionsChange({
      ...options,
      indentSize: indent,
    });
  };

  return (
    <div className="w-full bg-neutral-900/60 border-b border-neutral-800/80 px-4 sm:px-6 lg:px-8 py-2.5">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left: Quick Sample Dropdown & Quick Presets */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Sample Selector */}
          <div className="relative">
            <button
              onClick={() => setSampleDropdownOpen(!sampleDropdownOpen)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-750 border border-neutral-700/80 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Örnek Veri Yükle</span>
              <ChevronDown className={`w-3.5 h-3.5 text-neutral-400 transition-transform ${sampleDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {sampleDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-20"
                  onClick={() => setSampleDropdownOpen(false)}
                />
                <div className="absolute left-0 mt-2 w-72 rounded-xl bg-neutral-900 border border-neutral-800 shadow-2xl p-1.5 z-30">
                  <div className="px-2.5 py-1.5 text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                    Örnek Senaryolar
                  </div>
                  {SAMPLES.map((sample) => (
                    <button
                      key={sample.id}
                      onClick={() => {
                        onSelectSample(sample);
                        setSampleDropdownOpen(false);
                      }}
                      className="w-full text-left p-2 rounded-lg hover:bg-neutral-800/90 transition-colors flex flex-col gap-0.5 group"
                    >
                      <span className="text-xs font-medium text-neutral-200 group-hover:text-cyan-400 transition-colors">
                        {sample.label}
                      </span>
                      <span className="text-[11px] text-neutral-400 line-clamp-1">
                        {sample.description}
                      </span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="h-4 w-[1px] bg-neutral-800 hidden sm:block" />

          {/* Indent Presets */}
          <div className="flex items-center rounded-lg bg-neutral-950 p-0.5 border border-neutral-800 text-xs">
            <button
              onClick={() => setIndent(2)}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                options.indentSize === 2
                  ? 'bg-neutral-800 text-cyan-300 font-semibold shadow-xs'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              2 Spaces
            </button>
            <button
              onClick={() => setIndent(4)}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                options.indentSize === 4
                  ? 'bg-neutral-800 text-cyan-300 font-semibold shadow-xs'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              4 Spaces
            </button>
            <button
              onClick={() => setIndent('minify')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                options.indentSize === 'minify'
                  ? 'bg-neutral-800 text-cyan-300 font-semibold shadow-xs'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Minify
            </button>
          </div>

          {/* Quick toggle chips */}
          <button
            onClick={() => toggleOption('repairJson')}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors border ${
              options.repairJson
                ? 'bg-cyan-950/60 border-cyan-800/80 text-cyan-300'
                : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-neutral-300'
            }`}
          >
            <FileJson className="w-3.5 h-3.5" />
            <span>JSON Onar</span>
          </button>

          <button
            onClick={() => toggleOption('stripInvisibleChars')}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors border ${
              options.stripInvisibleChars
                ? 'bg-emerald-950/60 border-emerald-800/80 text-emerald-300'
                : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-neutral-300'
            }`}
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span>Gizli Karakterleri Sil</span>
          </button>

          <button
            onClick={() => toggleOption('unescapeStrings')}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors border ${
              options.unescapeStrings
                ? 'bg-indigo-950/60 border-indigo-800/80 text-indigo-300'
                : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-neutral-300'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Unescape (\")</span>
          </button>
        </div>

        {/* Right: Advanced Filters toggle & Clear button */}
        <div className="flex items-center gap-2">
          {hasInput && (
            <button
              onClick={onClear}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 transition-colors"
              title="Temizle"
            >
              <Eraser className="w-3.5 h-3.5" />
              <span>Temizle</span>
            </button>
          )}

          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
              showAdvanced
                ? 'bg-neutral-800 text-white border-neutral-700'
                : 'bg-neutral-900/80 text-neutral-300 border-neutral-800 hover:bg-neutral-800'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-neutral-400" />
            <span>Filtre Ayarları</span>
            <ChevronDown className={`w-3 h-3 text-neutral-400 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Advanced Filter Settings Drawer */}
      {showAdvanced && (
        <div className="max-w-7xl mx-auto mt-3 pt-3 border-t border-neutral-800 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs">
          <label className="flex items-center gap-2 p-2 rounded-lg bg-neutral-950/60 border border-neutral-800/80 cursor-pointer hover:border-neutral-700 transition-colors">
            <input
              type="checkbox"
              checked={options.normalizeQuotes}
              onChange={() => toggleOption('normalizeQuotes')}
              className="rounded accent-cyan-500"
            />
            <span className="text-neutral-300">Akıllı Tırnakları Düzelt (“ ” → &quot;)</span>
          </label>

          <label className="flex items-center gap-2 p-2 rounded-lg bg-neutral-950/60 border border-neutral-800/80 cursor-pointer hover:border-neutral-700 transition-colors">
            <input
              type="checkbox"
              checked={options.stripAnsi}
              onChange={() => toggleOption('stripAnsi')}
              className="rounded accent-cyan-500"
            />
            <span className="text-neutral-300">Terminal / ANSI Kodlarını Sil</span>
          </label>

          <label className="flex items-center gap-2 p-2 rounded-lg bg-neutral-950/60 border border-neutral-800/80 cursor-pointer hover:border-neutral-700 transition-colors">
            <input
              type="checkbox"
              checked={options.normalizeSpaces}
              onChange={() => toggleOption('normalizeSpaces')}
              className="rounded accent-cyan-500"
            />
            <span className="text-neutral-300">NBSP Boşlukları Düzelt</span>
          </label>

          <label className="flex items-center gap-2 p-2 rounded-lg bg-neutral-950/60 border border-neutral-800/80 cursor-pointer hover:border-neutral-700 transition-colors">
            <input
              type="checkbox"
              checked={options.trimWhitespace}
              onChange={() => toggleOption('trimWhitespace')}
              className="rounded accent-cyan-500"
            />
            <span className="text-neutral-300">Satır Sonu Boşluklarını Kırp</span>
          </label>

          <label className="flex items-center gap-2 p-2 rounded-lg bg-neutral-950/60 border border-neutral-800/80 cursor-pointer hover:border-neutral-700 transition-colors">
            <input
              type="checkbox"
              checked={options.removeComments}
              onChange={() => toggleOption('removeComments')}
              className="rounded accent-cyan-500"
            />
            <span className="text-neutral-300">Yorum Satırlarını Sil (// /* */)</span>
          </label>

          <label className="flex items-center gap-2 p-2 rounded-lg bg-neutral-950/60 border border-neutral-800/80 cursor-pointer hover:border-neutral-700 transition-colors">
            <input
              type="checkbox"
              checked={options.maskSensitiveData}
              onChange={() => toggleOption('maskSensitiveData')}
              className="rounded accent-cyan-500"
            />
            <span className="text-neutral-300 flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              API Key / E-posta Maskele
            </span>
          </label>
        </div>
      )}
    </div>
  );
}
