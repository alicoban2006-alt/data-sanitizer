'use client';

import React, { useState } from 'react';
import { 
  Wand2, 
  FileJson, 
  Code2, 
  Sparkles, 
  SlidersHorizontal, 
  ChevronDown,
  ShieldAlert,
  Eraser
} from 'lucide-react';
import { SanitizerOptions } from '@/lib/sanitizer';
import { SAMPLES, SampleData } from '@/lib/samples';
import { Language, translations } from '@/lib/i18n';

interface ToolbarProps {
  options: SanitizerOptions;
  onOptionsChange: (newOptions: SanitizerOptions) => void;
  onSelectSample: (sample: SampleData) => void;
  onClear: () => void;
  hasInput: boolean;
  lang: Language;
}

export function Toolbar({
  options,
  onOptionsChange,
  onSelectSample,
  onClear,
  hasInput,
  lang,
}: ToolbarProps) {
  const t = translations[lang];
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
    <div className="w-full bg-white/70 dark:bg-neutral-900/60 border-b border-neutral-200 dark:border-neutral-800/80 px-4 sm:px-6 lg:px-8 py-2.5 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left: Quick Sample Dropdown & Quick Presets */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Sample Selector */}
          <div className="relative">
            <button
              onClick={() => setSampleDropdownOpen(!sampleDropdownOpen)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-750 border border-neutral-300 dark:border-neutral-700/80 transition-colors shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-500 dark:text-cyan-400" />
              <span>{t.loadSample}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-neutral-400 transition-transform ${sampleDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {sampleDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-20"
                  onClick={() => setSampleDropdownOpen(false)}
                />
                <div className="absolute left-0 mt-2 w-72 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xl p-1.5 z-30">
                  <div className="px-2.5 py-1.5 text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                    {t.sampleScenarios}
                  </div>
                  {SAMPLES.map((sample) => (
                    <button
                      key={sample.id}
                      onClick={() => {
                        onSelectSample(sample);
                        setSampleDropdownOpen(false);
                      }}
                      className="w-full text-left p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800/90 transition-colors flex flex-col gap-0.5 group"
                    >
                      <span className="text-xs font-medium text-neutral-800 dark:text-neutral-200 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                        {sample.label}
                      </span>
                      <span className="text-[11px] text-neutral-500 dark:text-neutral-400 line-clamp-1">
                        {sample.description}
                      </span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="h-4 w-[1px] bg-neutral-300 dark:bg-neutral-800 hidden sm:block" />

          {/* Indent Presets */}
          <div className="flex items-center rounded-lg bg-neutral-100 dark:bg-neutral-950 p-0.5 border border-neutral-200 dark:border-neutral-800 text-xs">
            <button
              onClick={() => setIndent(2)}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                options.indentSize === 2
                  ? 'bg-white dark:bg-neutral-800 text-cyan-600 dark:text-cyan-300 font-semibold shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
              }`}
            >
              {t.twoSpaces}
            </button>
            <button
              onClick={() => setIndent(4)}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                options.indentSize === 4
                  ? 'bg-white dark:bg-neutral-800 text-cyan-600 dark:text-cyan-300 font-semibold shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
              }`}
            >
              {t.fourSpaces}
            </button>
            <button
              onClick={() => setIndent('minify')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                options.indentSize === 'minify'
                  ? 'bg-white dark:bg-neutral-800 text-cyan-600 dark:text-cyan-300 font-semibold shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
              }`}
            >
              {t.minify}
            </button>
          </div>

          {/* Quick toggle chips */}
          <button
            onClick={() => toggleOption('repairJson')}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors border ${
              options.repairJson
                ? 'bg-cyan-100 dark:bg-cyan-950/60 border-cyan-300 dark:border-cyan-800/80 text-cyan-700 dark:text-cyan-300'
                : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-300'
            }`}
          >
            <FileJson className="w-3.5 h-3.5" />
            <span>{t.repairJson}</span>
          </button>

          <button
            onClick={() => toggleOption('stripInvisibleChars')}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors border ${
              options.stripInvisibleChars
                ? 'bg-emerald-100 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800/80 text-emerald-700 dark:text-emerald-300'
                : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-300'
            }`}
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span>{t.stripInvisible}</span>
          </button>

          <button
            onClick={() => toggleOption('unescapeStrings')}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors border ${
              options.unescapeStrings
                ? 'bg-indigo-100 dark:bg-indigo-950/60 border-indigo-300 dark:border-indigo-800/80 text-indigo-700 dark:text-indigo-300'
                : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-300'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>{t.unescape}</span>
          </button>
        </div>

        {/* Right: Advanced Filters toggle & Clear button */}
        <div className="flex items-center gap-2">
          {hasInput && (
            <button
              onClick={onClear}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
              title={t.clear}
            >
              <Eraser className="w-3.5 h-3.5" />
              <span>{t.clear}</span>
            </button>
          )}

          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
              showAdvanced
                ? 'bg-neutral-200 dark:bg-neutral-800 text-neutral-900 dark:text-white border-neutral-300 dark:border-neutral-700'
                : 'bg-white dark:bg-neutral-900/80 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-neutral-500 dark:text-neutral-400" />
            <span>{t.filters}</span>
            <ChevronDown className={`w-3 h-3 text-neutral-500 dark:text-neutral-400 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Advanced Filter Settings Drawer */}
      {showAdvanced && (
        <div className="max-w-7xl mx-auto mt-3 pt-3 border-t border-neutral-200 dark:border-neutral-800 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs">
          <label className="flex items-center gap-2 p-2 rounded-lg bg-neutral-50 dark:bg-neutral-950/60 border border-neutral-200 dark:border-neutral-800/80 cursor-pointer hover:border-neutral-400 dark:hover:border-neutral-700 transition-colors">
            <input
              type="checkbox"
              checked={options.normalizeQuotes}
              onChange={() => toggleOption('normalizeQuotes')}
              className="rounded accent-cyan-500"
            />
            <span className="text-neutral-700 dark:text-neutral-300">{t.optSmartQuotes}</span>
          </label>

          <label className="flex items-center gap-2 p-2 rounded-lg bg-neutral-50 dark:bg-neutral-950/60 border border-neutral-200 dark:border-neutral-800/80 cursor-pointer hover:border-neutral-400 dark:hover:border-neutral-700 transition-colors">
            <input
              type="checkbox"
              checked={options.stripAnsi}
              onChange={() => toggleOption('stripAnsi')}
              className="rounded accent-cyan-500"
            />
            <span className="text-neutral-700 dark:text-neutral-300">{t.optStripAnsi}</span>
          </label>

          <label className="flex items-center gap-2 p-2 rounded-lg bg-neutral-50 dark:bg-neutral-950/60 border border-neutral-200 dark:border-neutral-800/80 cursor-pointer hover:border-neutral-400 dark:hover:border-neutral-700 transition-colors">
            <input
              type="checkbox"
              checked={options.normalizeSpaces}
              onChange={() => toggleOption('normalizeSpaces')}
              className="rounded accent-cyan-500"
            />
            <span className="text-neutral-700 dark:text-neutral-300">{t.optNbsp}</span>
          </label>

          <label className="flex items-center gap-2 p-2 rounded-lg bg-neutral-50 dark:bg-neutral-950/60 border border-neutral-200 dark:border-neutral-800/80 cursor-pointer hover:border-neutral-400 dark:hover:border-neutral-700 transition-colors">
            <input
              type="checkbox"
              checked={options.trimWhitespace}
              onChange={() => toggleOption('trimWhitespace')}
              className="rounded accent-cyan-500"
            />
            <span className="text-neutral-700 dark:text-neutral-300">{t.optTrim}</span>
          </label>

          <label className="flex items-center gap-2 p-2 rounded-lg bg-neutral-50 dark:bg-neutral-950/60 border border-neutral-200 dark:border-neutral-800/80 cursor-pointer hover:border-neutral-400 dark:hover:border-neutral-700 transition-colors">
            <input
              type="checkbox"
              checked={options.removeComments}
              onChange={() => toggleOption('removeComments')}
              className="rounded accent-cyan-500"
            />
            <span className="text-neutral-700 dark:text-neutral-300">{t.optComments}</span>
          </label>

          <label className="flex items-center gap-2 p-2 rounded-lg bg-neutral-50 dark:bg-neutral-950/60 border border-neutral-200 dark:border-neutral-800/80 cursor-pointer hover:border-neutral-400 dark:hover:border-neutral-700 transition-colors">
            <input
              type="checkbox"
              checked={options.maskSensitiveData}
              onChange={() => toggleOption('maskSensitiveData')}
              className="rounded accent-cyan-500"
            />
            <span className="text-neutral-700 dark:text-neutral-300 flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
              {t.optMask}
            </span>
          </label>
        </div>
      )}
    </div>
  );
}
