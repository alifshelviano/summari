'use client';

import React, { useState } from 'react';
import {
  Mail,
  X,
  Send,
  Loader2,
  CheckCircle2,
  ExternalLink,
  FileText,
  AlertCircle,
} from 'lucide-react';
import { SummaryResult } from '@/lib/types';
import { generatePdfDocument } from '@/lib/pdf';

interface EmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  summary: SummaryResult | null;
  onShowToast: (message: string, type?: 'success' | 'info' | 'error') => void;
}

export const EmailModal: React.FC<EmailModalProps> = ({
  isOpen,
  onClose,
  summary,
  onShowToast,
}) => {
  const [email, setEmail] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [notes, setNotes] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen || !summary) return null;

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setErrorMsg('Masukkan alamat email yang valid.');
      return;
    }

    try {
      setIsSending(true);
      setErrorMsg(null);
      setPreviewUrl(null);

      // 1. Generate PDF on client as base64 string
      const doc = generatePdfDocument(summary);
      const pdfBase64 = doc.output('datauristring');

      // 2. Call API /api/send-email
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          recipientName: recipientName.trim() || undefined,
          notes: notes.trim() || undefined,
          summary,
          pdfBase64,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Gagal mengirim email.');
      }

      setIsSuccess(true);
      if (data.previewUrl) {
        setPreviewUrl(data.previewUrl);
      }

      onShowToast('Email berhasil dikirim dengan lampiran PDF!', 'success');
    } catch (err) {
      console.error('Send email error:', err);
      setErrorMsg((err as Error).message || 'Terjadi kesalahan saat mengirim email.');
      onShowToast('Gagal mengirim email.', 'error');
    } finally {
      setIsSending(false);
    }
  };

  const handleResetAndClose = () => {
    setIsSuccess(false);
    setErrorMsg(null);
    setPreviewUrl(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl transition-all">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <Mail className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Kirim Ringkasan ke Email
            </h3>
          </div>
          <button
            onClick={handleResetAndClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {isSuccess ? (
            <div className="text-center py-4 space-y-4">
              <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                  Email Berhasil Dikirim!
                </h4>
                <p className="text-sm text-slate-700 dark:text-slate-300 mt-1">
                  Ringkasan dan lampiran dokumen PDF siap baca telah dikirim ke{' '}
                  <strong className="text-slate-900 dark:text-white">{email}</strong>.
                </p>
              </div>

              {/* Preview Link if in test account mode */}
              {previewUrl && (
                <div className="p-3.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 text-left text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-indigo-700 dark:text-indigo-300 mb-1">
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Mode Pengujian SMTP (Ethereal Inbox)</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 mb-2">
                    Karena kredensial SMTP produksi belum diatur di file .env, email dikirim ke kotak uji coba sandbox:
                  </p>
                  <a
                    href={previewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
                  >
                    <span>Buka & Lihat Email Uji Coba</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-sm font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                >
                  Selesai
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSendEmail} className="space-y-4">
              
              {/* Video reference info */}
              <div className="p-3 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200/80 dark:border-slate-800 text-xs">
                <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 font-semibold mb-1">
                  <FileText className="w-3.5 h-3.5" />
                  <span>Lampiran PDF: Summari-{summary.videoId}.pdf</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 line-clamp-1 font-medium">
                  {summary.title}
                </p>
              </div>

              {/* Recipient Email Input */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Alamat Email Penerima <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contoh: nama@domain.com"
                  required
                  disabled={isSending}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                />
              </div>

              {/* Recipient Name (Optional) */}
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Nama Penerima (Opsional)
                </label>
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="contoh: Alif Shelviano"
                  disabled={isSending}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition"
                />
              </div>

              {/* Custom Notes */}
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Catatan Tambahan (Opsional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Tambahkan pesan pengantar singkat untuk penerima..."
                  rows={2}
                  disabled={isSending}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition"
                />
              </div>

              {/* Error message */}
              {errorMsg && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900/60 text-xs text-red-600 dark:text-red-400">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  disabled={isSending}
                  className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSending || !email}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95 disabled:opacity-60 transition shadow-md shadow-emerald-600/20"
                >
                  {isSending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Mengirim Email...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Kirim Dokumen PDF</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          )}
        </div>

      </div>
    </div>
  );
};

