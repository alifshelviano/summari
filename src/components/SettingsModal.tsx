'use client';

import React, { useState, useEffect } from 'react';
import { X, Key, Mail, Check, ExternalLink, ShieldCheck } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveApiKey: (key: string) => void;
  savedApiKey: string;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  onSaveApiKey,
  savedApiKey,
}) => {
  const [apiKey, setApiKey] = useState(savedApiKey);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setApiKey(savedApiKey);
  }, [savedApiKey]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveApiKey(apiKey.trim());
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
              <Key className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Konfigurasi API & SMTP
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Custom Gemini API Key Form */}
          <form onSubmit={handleSave} className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-indigo-500" />
                  Gemini API Key (Klien / Pribadi)
                </label>
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-semibold"
                >
                  Dapatkan API Key Gratis
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition font-mono"
              />
              <p className="text-[11px] text-slate-700 dark:text-slate-300 mt-1.5 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                Kunci ini disimpan secara lokal di browser Anda dan tidak pernah dibagikan.
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-indigo-600 hover:bg-indigo-700 active:scale-98 transition flex items-center justify-center gap-1.5"
            >
              {isSaved ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Kunci Berhasil Disimpan!</span>
                </>
              ) : (
                <span>Simpan Kunci API</span>
              )}
            </button>
          </form>

          {/* Guide for Server .env.local Setup */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              <Mail className="w-4 h-4 text-emerald-500" />
              <span>Panduan Konfigurasi Server SMTP & Deploy</span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Untuk pengiriman email produksi (misalnya via Gmail, SendGrid, atau Brevo), salin file <code className="bg-slate-200 dark:bg-slate-800 px-1 py-0.5 rounded text-[11px]">.env.example</code> menjadi <code className="bg-slate-200 dark:bg-slate-800 px-1 py-0.5 rounded text-[11px]">.env.local</code> di server Anda:
            </p>

            <pre className="p-3 bg-slate-900 text-slate-200 rounded-xl text-[11px] font-mono overflow-x-auto leading-relaxed">
{`# Google Gemini
GEMINI_API_KEY=AIzaSy...

# SMTP Konfigurasi (Contoh: Gmail App Password)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=emailanda@gmail.com
SMTP_PASS=xxxx xxxx xxxx xxxx
SMTP_FROM="Summari AI" <emailanda@gmail.com>`}
            </pre>

            <div className="text-[11px] text-slate-700 dark:text-slate-300 space-y-1">
              <p>💡 <strong>Tips Gmail:</strong> Buat 16-digit App Password di Akun Google &rarr; Keamanan &rarr; Verifikasi 2 Langkah &rarr; Sandi Aplikasi.</p>
              <p>🧪 <strong>Mode Demo / Sandbox:</strong> Jika SMTP belum diatur, sistem otomatis menggunakan Ethereal Email sandbox dan memberikan tautan preview email langsung.</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

