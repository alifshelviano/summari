import { NextRequest, NextResponse } from 'next/server';
import {
  extractVideoId,
  fetchVideoMetadata,
  fetchVideoTranscript,
  formatTranscriptForPrompt,
} from '@/lib/youtube';
import { generateSummary } from '@/lib/gemini';
import { ApiResponse, SummaryRequest, SummaryResult } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const body: SummaryRequest = await req.json();
    const { url, language = 'id', format = 'detailed', customApiKey, manualTranscript } = body;

    if (!url || typeof url !== 'string') {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Tautan YouTube wajib diisi.' },
        { status: 400 }
      );
    }

    const videoId = extractVideoId(url);
    if (!videoId) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error:
            'Tautan YouTube tidak valid. Pastikan format URL seperti https://www.youtube.com/watch?v=... atau https://youtu.be/...',
        },
        { status: 400 }
      );
    }

    // 1. Fetch metadata (Title, Creator, Thumbnail)
    const metadata = await fetchVideoMetadata(videoId);

    // 2. Fetch transcript or use manual transcript
    let formattedTranscript = '';
    if (manualTranscript && manualTranscript.trim().length > 0) {
      formattedTranscript = manualTranscript.trim();
    } else {
      try {
        const transcriptItems = await fetchVideoTranscript(videoId);
        formattedTranscript = formatTranscriptForPrompt(transcriptItems);
      } catch (transcriptError) {
        console.warn('Transcript extraction error:', transcriptError);
        // If transcript fails, we can still proceed with metadata-based summary or return informative message
        formattedTranscript = `[Transkrip otomatis tidak tersedia untuk video ini. Meringkas berdasarkan judul "${metadata.title}" dan informasi kreator "${metadata.author}"]`;
      }
    }

    // 3. Generate summary via Gemini (or smart fallback)
    const summary: SummaryResult = await generateSummary({
      metadata,
      transcriptText: formattedTranscript,
      language,
      format,
      apiKey: customApiKey,
    });

    return NextResponse.json<ApiResponse<SummaryResult>>({
      success: true,
      data: summary,
    });
  } catch (error) {
    console.error('Error in /api/summarize:', error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error:
          (error as Error).message ||
          'Terjadi kesalahan internal saat memproses ringkasan video.',
      },
      { status: 500 }
    );
  }
}

