'use client';

import React from 'react';
import { Coffee, ShieldCheck, Zap, Sun, Moon, ArrowRightLeft, FileCode2, Globe } from 'lucide-react';
import { Language, translations } from '@/lib/i18n';

interface NavbarProps {
  onOpenCoffee: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  lang: Language;
  onToggleLang: () => void;
  activeTab: 'sanitizer' | 'converter';
  onSelectTab: (tab: 'sanitizer' | 'converter') => void;
}

export function Navbar({
  onOpenCoffee,
  theme,
  onToggleTheme,
  lang,
  onToggleLang,
  activeTab,
  onSelectTab,
}: NavbarProps) {
  const t = translations[lang];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-200 dark:border-neutral-800/80 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-emerald-500 to-indigo-500 p-[1px] shadow-sm shadow-cyan-500/20 shrink-0">
            <div className="w-full h-full bg-white dark:bg-neutral-950 rounded-[11px] flex items-center justify-center">
              <Zap className="w-4 h-4 text-cyan-600 dark:text-cyan-400 fill-cyan-400/20" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base tracking-tight text-neutral-900 dark:text-white flex items-center">
                DataPurge
                <span className="text-cyan-600 dark:text-cyan-400 ml-0.5">.dev</span>
              </span>
              <span className="text-[10px] tracking-wide font-medium px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-800 hidden sm:inline">
                zero-telemetry
              </span>
            </div>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 hidden md:block">
              {t.brandSubtitle}
            </p>
          </div>
        </div>

        {/* Center: Tabs Switcher (Sanitizer vs Converter) */}
        <div className="flex items-center bg-neutral-100 dark:bg-neutral-900 p-1 rounded-xl border border-neutral-200 dark:border-neutral-800">
          <button
            onClick={() => onSelectTab('sanitizer')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'sanitizer'
                ? 'bg-white dark:bg-neutral-800 text-cyan-600 dark:text-cyan-300 shadow-xs'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <FileCode2 className="w-3.5 h-3.5" />
            <span>{t.tabSanitizer}</span>
          </button>

          <button
            onClick={() => onSelectTab('converter')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'converter'
                ? 'bg-white dark:bg-neutral-800 text-cyan-600 dark:text-cyan-300 shadow-xs'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span>{t.tabConverter}</span>
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Client-side guarantee badge */}
          <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-[11px] font-mono text-neutral-600 dark:text-neutral-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>{t.badgePrivate}</span>
          </div>

          {/* Language Switcher (EN / TR) */}
          <button
            onClick={onToggleLang}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold font-mono text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-800 transition-colors"
            title={lang === 'en' ? 'Türkçe diline geç' : 'Switch to English'}
          >
            <Globe className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
            <span>{lang.toUpperCase()}</span>
          </button>

          {/* Theme Toggle (Güneş / Ay) */}
          <button
            onClick={onToggleTheme}
            aria-label="Toggle theme"
            className="p-2 rounded-xl text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-800 transition-colors"
            title={theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-600" />
            )}
          </button>

          {/* GitHub link */}
          <a
            href="https://github.com/alicoban2006-alt/data-sanitizer"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub Repository"
            className="hidden sm:flex items-center p-2 rounded-xl text-neutral-600 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-800 transition-colors"
          >
            <svg
              className="w-4 h-4 fill-current"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
              />
            </svg>
          </a>

          {/* Buy Me a Coffee Button */}
          <button
            onClick={onOpenCoffee}
            className="group relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-neutral-950 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 hover:from-amber-300 hover:to-amber-400 transition-all shadow-sm active:scale-95 shrink-0"
          >
            <Coffee className="w-3.5 h-3.5 stroke-[2.2] group-hover:rotate-12 transition-transform duration-200" />
            <span className="hidden xs:inline">{t.buyCoffee}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
