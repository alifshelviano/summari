'use client';
/* eslint-disable @next/next/no-img-element */

import React from 'react';
import { ExternalLink, Clock, Tv } from 'lucide-react';
import { SummaryResult } from '@/lib/types';

interface VideoCardProps {
  summary: SummaryResult;
}

export const VideoCard: React.FC<VideoCardProps> = ({ summary }) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all">
      <div className="flex flex-col sm:flex-row">
        
        {/* Thumbnail with overlay */}
        <div className="relative sm:w-64 sm:min-w-[16rem] h-44 sm:h-auto bg-slate-100 dark:bg-slate-950 overflow-hidden group">
          <img
            src={summary.thumbnailUrl}
            alt={summary.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              // Fallback placeholder if thumbnail fails
              (e.target as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80';
            }}
          />
          <a
            href={summary.videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white font-medium text-xs gap-1.5 backdrop-blur-[2px]"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Buka di YouTube</span>
          </a>
        </div>

        {/* Video Info Details */}
        <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 border border-red-200/60 dark:border-red-900/40">
                <Tv className="w-3 h-3" />
                {summary.channel || 'YouTube Video'}
              </span>

              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-900/40">
                <Clock className="w-3 h-3" />
                ~{summary.readingTimeMinutes} Menit Baca
              </span>
            </div>

            <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white leading-snug">
              {summary.title}
            </h3>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-700 dark:text-slate-300">
            <span>Diringkas oleh <strong>Summari AI</strong></span>
            <a
              href={summary.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline flex items-center gap-1"
            >
              Lihat Sumber Asli
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};

