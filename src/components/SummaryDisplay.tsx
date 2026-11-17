'use client';

import React, { useState } from 'react';
import {
  FileDown,
  Mail,
  Copy,
  Check,
  Sparkles,
  BookOpen,
  ListOrdered,
  Lightbulb,
  CheckSquare,
  BookmarkCheck,
  FileCode,
} from 'lucide-react';
import { SummaryResult } from '@/lib/types';
import { generatePdfDocument } from '@/lib/pdf';

interface SummaryDisplayProps {
  summary: SummaryResult;
  onOpenEmailModal: () => void;
  onShowToast: (message: string, type?: 'success' | 'info' | 'error') => void;
}

export const SummaryDisplay: React.FC<SummaryDisplayProps> = ({
  summary,
  onOpenEmailModal,
  onShowToast,
}) => {
  const [activeTab, setActiveTab] = useState<'structured' | 'markdown'>('structured');
  const [isCopied, setIsCopied] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

  const handleCopyMarkdown = async () => {
    try {
      await navigator.clipboard.writeText(summary.markdown);
      setIsCopied(true);
      onShowToast('Ringkasan berhasil disalin ke clipboard!', 'success');
      setTimeout(() => setIsCopied(false), 2500);
    } catch {
      onShowToast('Gagal menyalin teks.', 'error');
    }
  };

  const handleDownloadPdf = () => {
    try {
      setIsDownloadingPdf(true);
      const doc = generatePdfDocument(summary);
      const cleanTitle = (summary.title || 'Ringkasan')
        .replace(/[^a-zA-Z0-9_\-\s]/g, '')
        .substring(0, 40)
        .trim()
        .replace(/\s+/g, '_');
      doc.save(`Summari-${cleanTitle}.pdf`);
      onShowToast('File PDF berhasil diunduh!', 'success');
    } catch (err) {
      console.error('PDF generation error:', err);
      onShowToast('Gagal membuat file PDF.', 'error');
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      
      {/* Action Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        
        {/* Tabs toggle */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('structured')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'structured'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Tata Letak Rapi</span>
          </button>

          <button
            onClick={() => setActiveTab('markdown')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'markdown'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>Markdown Teks</span>
          </button>
        </div>

        {/* Action Buttons: PDF, Email, Copy */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Email Button */}
          <button
            onClick={onOpenEmailModal}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95 shadow-sm shadow-emerald-600/20 transition-all"
            title="Kirim ke Email dalam format PDF"
          >
            <Mail className="w-4 h-4" />
            <span>Kirim ke Email</span>
          </button>

          {/* Download PDF Button */}
          <button
            onClick={handleDownloadPdf}
            disabled={isDownloadingPdf}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 shadow-sm shadow-indigo-600/20 transition-all disabled:opacity-60"
            title="Unduh Dokumen PDF Siap Baca"
          >
            <FileDown className="w-4 h-4" />
            <span>Unduh PDF</span>
          </button>

          {/* Copy Markdown */}
          <button
            onClick={handleCopyMarkdown}
            className="flex items-center justify-center p-2 sm:px-3 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
            title="Salin Markdown"
          >
            {isCopied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            <span className="hidden sm:inline sm:ml-1.5">{isCopied ? 'Tersalin' : 'Salin'}</span>
          </button>
        </div>

      </div>

      {/* Main Content Area */}
      {activeTab === 'structured' ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-8">
          
          {/* Executive Summary */}
          <div>
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 mb-3">
              <Sparkles className="w-5 h-5" />
              <h2 className="text-lg font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                Ringkasan Eksekutif
              </h2>
            </div>
            <div className="p-5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 text-slate-700 dark:text-slate-200 text-sm sm:text-base leading-relaxed whitespace-pre-line">
              {summary.executiveSummary}
            </div>
          </div>

          {/* Key Discussion Points */}
          {summary.keyPoints && summary.keyPoints.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 mb-4">
                <ListOrdered className="w-5 h-5" />
                <h2 className="text-lg font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                  Poin-Poin Utama Pembahasan
                </h2>
              </div>
              <div className="grid grid-cols-1 gap-3.5">
                {summary.keyPoints.map((kp, idx) => (
                  <div
                    key={idx}
                    className="p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 hover:border-indigo-300 dark:hover:border-indigo-800 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <span className="w-7 h-7 rounded-xl bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-300 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                          <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                            {kp.topic}
                          </h3>
                          {kp.timestamp && (
                            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                              {kp.timestamp}
                            </span>
                          )}
                        </div>
                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                          {kp.details}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Key Takeaways Callout Box */}
          {summary.takeaways && summary.takeaways.length > 0 && (
            <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-200/70 dark:border-indigo-800/60">
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 mb-3">
                <Lightbulb className="w-5 h-5 text-amber-500" />
                <h2 className="text-base font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                  Wawasan Kunci (Key Takeaways)
                </h2>
              </div>
              <ul className="space-y-2.5">
                {summary.takeaways.map((takeaway, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400 mt-2 shrink-0" />
                    <span>{takeaway}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Action Items */}
          {summary.actionItems && summary.actionItems.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 mb-3">
                <CheckSquare className="w-5 h-5" />
                <h2 className="text-lg font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                  Langkah Aksi & Tips Praktis
                </h2>
              </div>
              <div className="space-y-2">
                {summary.actionItems.map((action, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200/60 dark:border-slate-800 text-xs sm:text-sm text-slate-700 dark:text-slate-300"
                  >
                    <BookmarkCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{action}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Conclusion */}
          {summary.conclusion && (
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                Kesimpulan Akhir
              </h3>
              <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed italic">
                &ldquo;{summary.conclusion}&rdquo;
              </p>
            </div>
          )}

        </div>
      ) : (
        /* Raw Markdown View */
        <div className="bg-slate-950 text-slate-200 rounded-3xl p-6 font-mono text-xs sm:text-sm overflow-x-auto border border-slate-800 leading-relaxed whitespace-pre-wrap">
          {summary.markdown}
        </div>
      )}

    </div>
  );
};

