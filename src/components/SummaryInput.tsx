'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  ClipboardPaste,
  X,
  Languages,
  Sliders,
  ChevronDown,
  ChevronUp,
  FileText,
  Loader2,
} from 'lucide-react';
import { YoutubeIcon } from './Icons';
import { SummaryRequest } from '@/lib/types';

interface SummaryInputProps {
  onSubmit: (params: SummaryRequest) => void;
  isLoading: boolean;
  loadingStep: string;
}

const SAMPLE_VIDEOS = [
  {
    label: 'AI & Masa Depan Kerja',
    url: 'https://www.youtube.com/watch?v=kYv9qQvA7gU',
  },
  {
    label: 'Prinsip Produktivitas & Fokus',
    url: 'https://www.youtube.com/watch?v=IlU-zDU6aQ0',
  },
  {
    label: 'Strategi Finansial & Investasi',
    url: 'https://www.youtube.com/watch?v=WEDIj9JBTC8',
  },
];

export const SummaryInput: React.FC<SummaryInputProps> = ({
  onSubmit,
  isLoading,
  loadingStep,
}) => {
  const [url, setUrl] = useState('');
  const [language, setLanguage] = useState<'id' | 'en'>('id');
  const [format, setFormat] = useState<'concise' | 'detailed' | 'actions'>('detailed');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [manualTranscript, setManualTranscript] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    onSubmit({
      url: url.trim(),
      language,
      format,
      manualTranscript: manualTranscript.trim() || undefined,
    });
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) setUrl(text.trim());
    } catch {
      // Fallback if permission denied
    }
  };

  const handleClear = () => {
    setUrl('');
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl shadow-slate-200/50 dark:shadow-none transition-all">
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Main Input Row */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
              Masukkan Tautan Video YouTube
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-3.5 text-red-500 pointer-events-none">
                <YoutubeIcon className="w-5 h-5" />
              </div>

              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=... atau youtu.be/..."
                disabled={isLoading}
                required
                className="w-full pl-11 pr-24 py-3.5 text-sm sm:text-base rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-950/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />

              {/* Paste & Clear actions */}
              <div className="absolute right-2.5 flex items-center gap-1">
                {url ? (
                  <button
                    type="button"
                    onClick={handleClear}
                    disabled={isLoading}
                    className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                    title="Hapus"
                  >
                    <X className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handlePaste}
                    disabled={isLoading}
                    className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition"
                    title="Tempel dari Clipboard"
                  >
                    <ClipboardPaste className="w-3.5 h-3.5" />
                    <span>Paste</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Quick Sample Links */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs">
            <span className="text-slate-600 dark:text-slate-300 font-medium">Contoh video:</span>
            {SAMPLE_VIDEOS.map((sample, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setUrl(sample.url)}
                disabled={isLoading}
                className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800/80 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 hover:text-indigo-600 dark:hover:text-indigo-400 text-slate-700 dark:text-slate-200 transition-colors border border-slate-200/60 dark:border-slate-700/60"
              >
                {sample.label}
              </button>
            ))}
          </div>

          {/* Options Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            
            {/* Language Selector */}
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                <Languages className="w-3.5 h-3.5 text-indigo-500" />
                Bahasa Ringkasan
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as 'id' | 'en')}
                disabled={isLoading}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="id">Bahasa Indonesia (Baku & Profesional)</option>
                <option value="en">English (Clear & Professional)</option>
              </select>
            </div>

            {/* Summary Depth / Format */}
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-purple-500" />
                Gaya & Kedalaman Ringkasan
              </label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value as 'concise' | 'detailed' | 'actions')}
                disabled={isLoading}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="detailed">Lengkap & Terstruktur (Rekomendasi)</option>
                <option value="concise">Ringkas & Padat (Executive Briefing)</option>
                <option value="actions">Fokus Aksi & Checklist Praktis</option>
              </select>
            </div>

          </div>

          {/* Advanced / Manual Transcript Toggle */}
          <div className="pt-1">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-xs text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1 transition-colors"
            >
              <span>{showAdvanced ? 'Tutup Opsi Transkrip Manual' : 'Video tanpa subtitle? Tempel transkrip manual di sini'}</span>
              {showAdvanced ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {showAdvanced && (
              <div className="mt-2 p-3 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800">
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-indigo-500" />
                  Transkrip / Catatan Video Manual (Opsional)
                </label>
                <textarea
                  value={manualTranscript}
                  onChange={(e) => setManualTranscript(e.target.value)}
                  placeholder="Jika video tidak memiliki subtitle otomatis dari YouTube, Anda dapat menempelkan teks atau transkrip di sini..."
                  rows={3}
                  disabled={isLoading}
                  className="w-full p-2.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            )}
          </div>

          {/* Submit Button & Progress Indicator */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading || !url.trim()}
              className="w-full py-3.5 px-6 rounded-xl font-bold text-sm sm:text-base text-white bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 hover:from-indigo-700 hover:via-indigo-800 hover:to-purple-700 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Sedang Meringkas...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Rangkum Video & Siapkan PDF</span>
                </>
              )}
            </button>

            {/* Dynamic Step Status when loading */}
            {isLoading && (
              <div className="mt-3 p-3 rounded-lg bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-800/60 text-center animate-fade-in">
                <div className="flex items-center justify-center gap-2 text-xs font-semibold text-indigo-700 dark:text-indigo-300">
                  <span className="w-2 h-2 rounded-full bg-indigo-600 animate-ping" />
                  <span>{loadingStep || 'Sedang memproses video YouTube...'}</span>
                </div>
              </div>
            )}
          </div>

        </form>
      </div>
    </div>
  );
};
