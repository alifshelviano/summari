'use client';

import React from 'react';
import { Sparkles, Settings, FileText, Mail } from 'lucide-react';
import { GithubIcon } from './Icons';

interface HeaderProps {
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSettings }) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-800 dark:from-white dark:via-slate-200 dark:to-indigo-300 bg-clip-text text-transparent">
                Summari
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/60">
                v1.0
              </span>
            </div>
            <p className="text-[11px] text-slate-700 dark:text-slate-300 font-medium hidden sm:block">
              YouTube AI Summarizer & PDF Email Delivery
            </p>
          </div>
        </div>

        {/* Feature Badges & Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden md:flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 font-medium">
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <FileText className="w-3.5 h-3.5 text-indigo-500" />
              PDF Siap Baca
            </span>
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <Mail className="w-3.5 h-3.5 text-emerald-500" />
              Kirim ke Email
            </span>
          </div>

          {/* Settings Button */}
          <button
            onClick={onOpenSettings}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-800 transition-all"
            title="Pengaturan API & SMTP"
          >
            <Settings className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Konfigurasi</span>
          </button>

          {/* GitHub Repo Link */}
          <a
            href="https://github.com/alifshelviano/summari"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-500 rounded-lg shadow-sm transition-all"
          >
            <GithubIcon className="w-3.5 h-3.5" />
            <span>GitHub</span>
          </a>
        </div>

      </div>
    </header>
  );
};
