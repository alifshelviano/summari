import { NextRequest, NextResponse } from 'next/server';
import { generatePdfBuffer } from '@/lib/pdf';
import { SummaryResult } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const summary: SummaryResult = await req.json();

    if (!summary || !summary.title) {
      return NextResponse.json(
        { error: 'Summary data is required' },
        { status: 400 }
      );
    }

    const pdfBuffer = generatePdfBuffer(summary);
    const sanitizedTitle = (summary.title || 'Summary')
      .replace(/[^a-zA-Z0-9_\-\s]/g, '')
      .substring(0, 40)
      .trim()
      .replace(/\s+/g, '_');

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Summari-${sanitizedTitle}.pdf"`,
      },
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}
