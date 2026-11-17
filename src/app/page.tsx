'use client';

import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { SummaryInput } from '@/components/SummaryInput';
import { VideoCard } from '@/components/VideoCard';
import { SummaryDisplay } from '@/components/SummaryDisplay';
import { EmailModal } from '@/components/EmailModal';
import { SettingsModal } from '@/components/SettingsModal';
import { Toast, ToastMessage } from '@/components/Toast';
import { GithubIcon, YoutubeIcon } from '@/components/Icons';
import { SummaryRequest, SummaryResult } from '@/lib/types';
import { Heart, FileText, Mail } from 'lucide-react';

export default function Home() {
  const [summary, setSummary] = useState<SummaryResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [savedApiKey, setSavedApiKey] = useState('');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const resultsRef = useRef<HTMLDivElement>(null);

  // Load custom API key from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('summari_gemini_api_key');
      if (stored) setSavedApiKey(stored);
    }
  }, []);

  const handleSaveApiKey = (key: string) => {
    setSavedApiKey(key);
    if (typeof window !== 'undefined') {
      if (key) {
        localStorage.setItem('summari_gemini_api_key', key);
      } else {
        localStorage.removeItem('summari_gemini_api_key');
      }
    }
    showToast('Kunci API berhasil disimpan!', 'success');
  };

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'info') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleSubmit = async (params: SummaryRequest) => {
    try {
      setIsLoading(true);
      setSummary(null);

      // Visual progress steps
      setLoadingStep('1/4: Mengambil metadata & detail video YouTube...');
      const stepTimer1 = setTimeout(() => {
        setLoadingStep('2/4: Mengekstrak subtitle & transkrip percakapan...');
      }, 1500);

      const stepTimer2 = setTimeout(() => {
        setLoadingStep('3/4: Menganalisis esensi pembahasan dengan Google Gemini AI...');
      }, 3500);

      const stepTimer3 = setTimeout(() => {
        setLoadingStep('4/4: Menyusun tata letak PDF siap baca...');
      }, 6000);

      const res = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...params,
          customApiKey: savedApiKey || undefined,
        }),
      });

      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      clearTimeout(stepTimer3);

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Gagal merangkum video.');
      }

      setSummary(data.data);
      showToast('Ringkasan video dan dokumen PDF siap baca berhasil dibuat!', 'success');

      // Trigger celebratory confetti
      try {
        confetti({
          particleCount: 45,
          spread: 60,
          origin: { y: 0.6 },
        });
      } catch {
        // Ignore in environments without canvas
      }

      // Smooth scroll to results
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);
    } catch (err) {
      console.error('Summarize error:', err);
      showToast((err as Error).message || 'Terjadi kesalahan.', 'error');
    } finally {
      setIsLoading(false);
      setLoadingStep('');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      
      {/* Navigation Header */}
      <Header onOpenSettings={() => setIsSettingsModalOpen(true)} />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        
        {/* Hero Section */}
        <Hero />

        {/* Form Input Section */}
        <div className="mt-2 mb-10">
          <SummaryInput
            onSubmit={handleSubmit}
            isLoading={isLoading}
            loadingStep={loadingStep}
          />
        </div>

        {/* Results Section */}
        {summary && (
          <div ref={resultsRef} className="max-w-4xl mx-auto px-4 space-y-6 pt-4 animate-fade-in">
            {/* Video Meta Card */}
            <VideoCard summary={summary} />

            {/* Summary & Actions Display */}
            <SummaryDisplay
              summary={summary}
              onOpenEmailModal={() => setIsEmailModalOpen(true)}
              onShowToast={showToast}
            />
          </div>
        )}

        {/* Feature Grid / Trust indicators if no summary yet */}
        {!summary && !isLoading && (
          <section className="max-w-4xl mx-auto px-4 mt-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center mb-3">
                  <YoutubeIcon className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1">
                  1. Input Link YouTube
                </h4>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  Cukup tempelkan tautan video apa saja. Sistem akan secara otomatis mengidentifikasi video dan mengekstrak transkrip dialognya.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-3">
                  <FileText className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1">
                  2. Ringkasan & PDF Siap Baca
                </h4>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  AI mengekstrak intisari eksekutif, bab topik bahasan, wawasan kunci, dan membuat layout dokumen PDF profesional A4 siap cetak.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
                  <Mail className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1">
                  3. Kirim Otomatis ke Email
                </h4>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  Kirimkan hasil ringkasan lengkap beserta lampiran file PDF langsung ke inbox email Anda atau rekan kerja Anda dengan 1-klik.
                </p>
              </div>

            </div>
          </section>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 py-6 text-center text-xs text-slate-700 dark:text-slate-300">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 font-medium">
            <span>Dibuat dengan</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
            <span>untuk produktivitas penonton YouTube</span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com/alifshelviano/summari"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1 font-semibold transition"
            >
              <GithubIcon className="w-3.5 h-3.5" />
              <span>alifshelviano/summari</span>
            </a>
          </div>
        </div>
      </footer>

      {/* Modals & Toasts */}
      <EmailModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        summary={summary}
        onShowToast={showToast}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        onSaveApiKey={handleSaveApiKey}
        savedApiKey={savedApiKey}
      />

      <Toast toasts={toasts} onDismiss={handleDismissToast} />

    </div>
  );
}
