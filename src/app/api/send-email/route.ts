import { NextRequest, NextResponse } from 'next/server';
import { sendSummaryEmail } from '@/lib/email';
import { ApiResponse, EmailRequest } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const body: EmailRequest = await req.json();
    const { email, recipientName, notes, summary, pdfBase64 } = body;

    if (!email || !email.includes('@')) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Alamat email penerima tidak valid.' },
        { status: 400 }
      );
    }

    if (!summary || !summary.title) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Data ringkasan tidak ditemukan.' },
        { status: 400 }
      );
    }

    const result = await sendSummaryEmail({
      recipientEmail: email,
      recipientName,
      notes,
      summary,
      pdfBase64,
    });

    if (!result.success) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: result.error || 'Gagal mengirim email.' },
        { status: 500 }
      );
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      previewUrl: result.previewUrl,
    });
  } catch (error) {
    console.error('Error in /api/send-email:', error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: (error as Error).message || 'Terjadi kesalahan saat mengirim email.',
      },
      { status: 500 }
    );
  }
}

