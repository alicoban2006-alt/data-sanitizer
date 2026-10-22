'use client';

import React from 'react';
import { 
  Activity, 
  HardDrive, 
  ShieldCheck, 
  TrendingDown,
  Sparkles,
  Zap
} from 'lucide-react';
import { Language, translations } from '@/lib/i18n';

interface StatsBarProps {
  inputBytes: number;
  outputBytes: number;
  totalFixes: number;
  inputChars: number;
  outputChars: number;
  latencyMs?: number;
  mode: 'sanitizer' | 'converter';
  lang: Language;
}

export function StatsBar({
  inputBytes,
  outputBytes,
  totalFixes,
  inputChars,
  outputChars,
  latencyMs = 1,
  mode,
  lang,
}: StatsBarProps) {
  const t = translations[lang];
  const bytesSaved = inputBytes > outputBytes ? inputBytes - outputBytes : 0;
  const pctSaved = inputBytes > 0 ? Math.round(((outputBytes - inputBytes) / inputBytes) * 100) : 0;

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    return `${(bytes / 1024).toFixed(1)} KB`;
  };

  return (
    <div className="w-full bg-white/80 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800/80 rounded-2xl p-3 sm:p-4 shadow-xs backdrop-blur-md transition-colors">
      <div className="flex items-center justify-between mb-3 border-b border-neutral-200 dark:border-neutral-800 pb-2.5">
        <div className="flex items-center gap-2">
          <Activity className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 animate-pulse" />
          <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 tracking-wide uppercase">
            {t.telemetryTitle}
          </span>
          <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            {t.telemetryLive}
          </span>
        </div>

        <div className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400 flex items-center gap-2">
          <span>{mode === 'sanitizer' ? t.tabSanitizer : t.tabConverter}</span>
          <span className="hidden sm:inline">•</span>
          <span className="hidden sm:inline">{t.telemetryZeroLag}</span>
        </div>
      </div>

      {/* Grid of Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* Metric 1: Total Processed */}
        <div className="p-3 rounded-xl bg-neutral-100/70 dark:bg-neutral-950/60 border border-neutral-200/80 dark:border-neutral-800/80 flex flex-col">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 text-[11px] font-medium mb-1">
            <span>{t.metricProcessed}</span>
            <HardDrive className="w-3.5 h-3.5 text-neutral-400" />
          </div>
          <div className="text-lg font-bold font-mono text-neutral-900 dark:text-white">
            {formatBytes(inputBytes)}
          </div>
          <div className="text-[10px] text-neutral-500 dark:text-neutral-400 font-mono mt-0.5">
            {inputChars.toLocaleString()} {t.chars}
          </div>
        </div>

        {/* Metric 2: Errors & Fixes Found */}
        <div className="p-3 rounded-xl bg-neutral-100/70 dark:bg-neutral-950/60 border border-neutral-200/80 dark:border-neutral-800/80 flex flex-col">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 text-[11px] font-medium mb-1">
            <span>{t.metricFixes}</span>
            <Sparkles className="w-3.5 h-3.5 text-cyan-500" />
          </div>
          <div className="text-lg font-bold font-mono text-cyan-600 dark:text-cyan-400">
            {totalFixes}
          </div>
          <div className="text-[10px] text-neutral-500 dark:text-neutral-400 font-mono mt-0.5">
            {t.metricFixesSub}
          </div>
        </div>

        {/* Metric 3: Size Change / Optimization */}
        <div className="p-3 rounded-xl bg-neutral-100/70 dark:bg-neutral-950/60 border border-neutral-200/80 dark:border-neutral-800/80 flex flex-col">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 text-[11px] font-medium mb-1">
            <span>{t.metricSizeChange}</span>
            <TrendingDown className="w-3.5 h-3.5 text-emerald-500" />
          </div>
          <div className={`text-lg font-bold font-mono ${pctSaved <= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-neutral-900 dark:text-white'}`}>
            {pctSaved > 0 ? `+${pctSaved}%` : `${pctSaved}%`}
          </div>
          <div className="text-[10px] text-neutral-500 dark:text-neutral-400 font-mono mt-0.5">
            {bytesSaved > 0 ? `${formatBytes(bytesSaved)} ${t.metricSizeSaved}` : '1:1'}
          </div>
        </div>

        {/* Metric 4: Latency */}
        <div className="p-3 rounded-xl bg-neutral-100/70 dark:bg-neutral-950/60 border border-neutral-200/80 dark:border-neutral-800/80 flex flex-col">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 text-[11px] font-medium mb-1">
            <span>{t.metricSpeed}</span>
            <Zap className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <div className="text-lg font-bold font-mono text-amber-600 dark:text-amber-400">
            &lt; {latencyMs} ms
          </div>
          <div className="text-[10px] text-neutral-500 dark:text-neutral-400 font-mono mt-0.5">
            {t.metricZeroNet}
          </div>
        </div>

        {/* Metric 5: Privacy Score */}
        <div className="p-3 rounded-xl bg-neutral-100/70 dark:bg-neutral-950/60 border border-neutral-200/80 dark:border-neutral-800/80 col-span-2 sm:col-span-1 flex flex-col">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 text-[11px] font-medium mb-1">
            <span>{t.metricPrivacy}</span>
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          </div>
          <div className="text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400">
            100 / 100
          </div>
          <div className="text-[10px] text-neutral-500 dark:text-neutral-400 font-mono mt-0.5">
            {t.metricPrivacySub}
          </div>
        </div>
      </div>
    </div>
  );
}
