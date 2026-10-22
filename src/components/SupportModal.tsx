'use client';

import React, { useState } from 'react';
import { Coffee, Heart, X, ExternalLink, Check, Copy, Sparkles } from 'lucide-react';
import { Language, translations } from '@/lib/i18n';

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export function SupportModal({ isOpen, onClose, lang }: SupportModalProps) {
  const t = translations[lang];
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLink(id);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl overflow-hidden p-6 text-neutral-800 dark:text-neutral-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow accent */}
        <div className="absolute -top-12 -right-12 w-36 h-36 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-neutral-950 shadow-lg shadow-amber-500/20">
            <Coffee className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              {t.coffeeTitle}
              <Sparkles className="w-4 h-4 text-amber-500" />
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">{t.coffeeSubtitle}</p>
          </div>
        </div>

        {/* Content */}
        <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed mb-6">
          {t.coffeeBody}
        </p>

        {/* Support Options */}
        <div className="space-y-3 mb-6">
          {/* Ko-fi Link */}
          <a
            href="https://ko-fi.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-between p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/80 hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-700/60 hover:border-amber-500/50 transition-all duration-200"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">☕</span>
              <div className="text-left">
                <div className="text-sm font-semibold text-neutral-900 dark:text-white group-hover:text-amber-500 dark:group-hover:text-amber-300 transition-colors">
                  {t.kofiTitle}
                </div>
                <div className="text-xs text-neutral-500 dark:text-neutral-400">{t.kofiSub}</div>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors" />
          </a>

          {/* GitHub Sponsors */}
          <a
            href="https://github.com/sponsors"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-between p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/80 hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-700/60 hover:border-pink-500/50 transition-all duration-200"
          >
            <div className="flex items-center gap-3">
              <Heart className="w-5 h-5 text-pink-500" />
              <div className="text-left">
                <div className="text-sm font-semibold text-neutral-900 dark:text-white group-hover:text-pink-500 dark:group-hover:text-pink-300 transition-colors">
                  {t.githubSponsorsTitle}
                </div>
                <div className="text-xs text-neutral-500 dark:text-neutral-400">{t.githubSponsorsSub}</div>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors" />
          </a>

          {/* Buy Me a Coffee direct link */}
          <a
            href="https://buymeacoffee.com/alicoban"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-between p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/80 hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-700/60 hover:border-amber-500/50 transition-all duration-200"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">💛</span>
              <div className="text-left">
                <div className="text-sm font-semibold text-neutral-900 dark:text-white group-hover:text-amber-500 dark:group-hover:text-amber-300 transition-colors">
                  {t.bmacTitle}
                </div>
                <div className="text-xs text-neutral-500 dark:text-neutral-400">buymeacoffee.com/alicoban</div>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors" />
          </a>
        </div>

        {/* Tip: Link Customize Note */}
        <div className="p-3 rounded-lg bg-neutral-100 dark:bg-neutral-950/60 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-500 dark:text-neutral-400 flex items-center justify-between">
          <span>{t.modalTip}</span>
          <button
            onClick={() => handleCopy('https://buymeacoffee.com/alicoban', 'bmac')}
            className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 transition-colors shrink-0 ml-2 font-mono text-[11px]"
          >
            {copiedLink === 'bmac' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copiedLink === 'bmac' ? t.linkCopied : t.copyLink}
          </button>
        </div>
      </div>
    </div>
  );
}
