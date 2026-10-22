'use client';

import React, { useState } from 'react';
import { Coffee, X, ExternalLink, Check, Copy, Sparkles, Heart } from 'lucide-react';
import { Language, translations } from '@/lib/i18n';

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export function SupportModal({ isOpen, onClose, lang }: SupportModalProps) {
  const t = translations[lang];
  const [copiedLink, setCopiedLink] = useState(false);
  const bmacUrl = 'https://buymeacoffee.com/alicoban';

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(bmacUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl overflow-hidden p-6 text-neutral-800 dark:text-neutral-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow accent */}
        <div className="absolute -top-12 -right-12 w-36 h-36 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
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

        {/* Dedicated Buy Me a Coffee Card */}
        <div className="p-5 rounded-2xl bg-gradient-to-b from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 mb-2">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">☕</span>
              <div>
                <div className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-1.5">
                  Ali (DataPurge)
                  <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                </div>
                <div className="text-xs font-mono text-amber-600 dark:text-amber-400 font-medium">
                  buymeacoffee.com/alicoban
                </div>
              </div>
            </div>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-xs font-mono text-neutral-700 dark:text-neutral-300 transition-colors"
              title="Copy Link"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink ? t.linkCopied : t.copyLink}</span>
            </button>
          </div>

          <a
            href={bmacUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm text-neutral-950 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 hover:from-amber-300 hover:to-amber-400 shadow-md shadow-amber-500/20 active:scale-[0.99] transition-all"
          >
            <Coffee className="w-4 h-4 stroke-[2.5]" />
            <span>{lang === 'tr' ? "Ali'ye Kahve Ismarla" : 'Buy Ali a Coffee'}</span>
            <ExternalLink className="w-4 h-4 stroke-[2.2] ml-0.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
