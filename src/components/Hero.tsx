'use client';

import React from 'react';
import { Sparkles, CheckCircle2 } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section className="text-center pt-8 pb-4 sm:pt-12 sm:pb-6 max-w-3xl mx-auto px-4">
      {/* Top pill badge */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200/80 dark:border-indigo-800/80 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-6 shadow-sm">
        <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
        <span>Ekstraksi Cerdas & PDF Terstruktur dengan Google Gemini AI</span>
      </div>

      {/* Main Title */}
      <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
        Rangkum Video YouTube Jadi{' '}
        <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          PDF Siap Baca
        </span>{' '}
        & Kirim ke Email
      </h1>

      {/* Subtitle */}
      <p className="mt-4 text-base sm:text-lg text-slate-700 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
        Hemat waktu berjam-jam menonton video panjang. Ubah link YouTube menjadi ringkasan eksekutif, wawasan kunci, serta dokumen PDF siap baca yang dapat langsung dikirim ke email Anda.
      </p>

      {/* Highlights checklist */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">
        <span className="flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          Ekstraksi Transkrip Otomatis
        </span>
        <span className="flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          Tata Letak PDF Eksekutif A4
        </span>
        <span className="flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          Lampiran Email 1-Klik
        </span>
      </div>
    </section>
  );
};

