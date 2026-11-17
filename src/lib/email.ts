import nodemailer from 'nodemailer';
import { SummaryResult } from './types';
import { generatePdfBuffer } from './pdf';

interface SendSummaryEmailParams {
  recipientEmail: string;
  recipientName?: string;
  notes?: string;
  summary: SummaryResult;
  pdfBase64?: string;
}

interface SendEmailResult {
  success: boolean;
  messageId?: string;
  previewUrl?: string;
  error?: string;
}

/**
 * Creates the Nodemailer transport.
 * Uses environment SMTP credentials or generates an Ethereal test inbox if unconfigured.
 */
async function getTransporter() {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const secure = process.env.SMTP_SECURE === 'true' || port === 465;

  if (host && user && pass) {
    return {
      transporter: nodemailer.createTransport({
        host,
        port,
        secure,
        auth: { user, pass },
      }),
      isTest: false,
    };
  }

  // Fallback to Ethereal Email for instant testing and sandbox demonstration
  console.log('No SMTP credentials in environment. Creating Ethereal test account...');
  const testAccount = await nodemailer.createTestAccount();
  return {
    transporter: nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    }),
    isTest: true,
  };
}

/**
 * Sanitizes a title for a clean PDF filename.
 */
function sanitizeFilename(title: string): string {
  const clean = title.replace(/[^a-zA-Z0-9_\-\s]/g, '').trim();
  const truncated = clean.substring(0, 40) || 'Ringkasan-Video';
  return `Summari-${truncated.replace(/\s+/g, '_')}.pdf`;
}

/**
 * Builds a responsive, professional HTML email template.
 */
function buildEmailHtml({
  summary,
  recipientName,
  notes,
}: {
  summary: SummaryResult;
  recipientName?: string;
  notes?: string;
}): string {
  const greeting = recipientName ? `Halo ${recipientName},` : 'Halo,';
  const customNotesHtml = notes
    ? `<div style="background-color: #f1f5f9; border-left: 4px solid #64748b; padding: 12px 16px; margin: 16px 0; border-radius: 4px; font-style: italic; color: #334155;">
        <strong>Catatan Pengirim:</strong> "${notes}"
       </div>`
    : '';

  const takeawaysHtml = summary.takeaways
    .slice(0, 4)
    .map(
      (t) =>
        `<li style="margin-bottom: 8px; color: #334155; line-height: 1.5;">${t}</li>`
    )
    .join('');

  return `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Ringkasan YouTube: ${summary.title}</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #1e293b;">
  <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.06); border: 1px solid #e2e8f0;">
    
    <!-- HEADER -->
    <div style="background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); padding: 32px 24px; text-align: center; color: #ffffff;">
      <h1 style="margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">SUMMARI</h1>
      <p style="margin: 6px 0 0 0; font-size: 14px; opacity: 0.9;">Ringkasan Inti Video YouTube Siap Baca</p>
    </div>

    <!-- BODY -->
    <div style="padding: 28px 24px;">
      <p style="font-size: 16px; color: #0f172a; margin-top: 0;">${greeting}</p>
      <p style="font-size: 15px; color: #475569; line-height: 1.6;">
        Berikut adalah ringkasan eksekutif dari video YouTube yang Anda minta. File dokumen <strong>PDF Siap Baca</strong> berformat rapi telah dilampirkan pada email ini untuk memudahkan Anda membaca secara offline atau mencetaknya.
      </p>

      ${customNotesHtml}

      <!-- VIDEO INFO CARD -->
      <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 20px 0;">
        <h2 style="font-size: 17px; margin: 0 0 8px 0; color: #0f172a; line-height: 1.4;">
          ${summary.title}
        </h2>
        <div style="font-size: 13px; color: #64748b; margin-bottom: 12px;">
          <span>📺 Saluran: <strong>${summary.channel}</strong></span> &bull; 
          <span>⏱️ Waktu Baca: <strong>~${summary.readingTimeMinutes} Menit</strong></span>
        </div>
        <a href="${summary.videoUrl}" style="display: inline-block; font-size: 13px; color: #4f46e5; text-decoration: none; font-weight: 600;">
          Tonton Video di YouTube &rarr;
        </a>
      </div>

      <!-- PDF ATTACHMENT BADGE -->
      <div style="background-color: #eef2ff; border: 1px dashed #6366f1; border-radius: 8px; padding: 14px; margin: 20px 0; text-align: center;">
        <span style="font-size: 20px; vertical-align: middle;">📎</span>
        <strong style="color: #4338ca; font-size: 14px; vertical-align: middle; margin-left: 6px;">
          File PDF Siap Baca Terlampir (${sanitizeFilename(summary.title)})
        </strong>
        <p style="margin: 4px 0 0 0; font-size: 12px; color: #6366f1;">
          Buka lampiran email untuk membaca versi laporan lengkap dengan tata letak profesional.
        </p>
      </div>

      <!-- EXECUTIVE SUMMARY PREVIEW -->
      <div style="margin: 24px 0;">
        <h3 style="font-size: 15px; text-transform: uppercase; letter-spacing: 0.5px; color: #4f46e5; margin: 0 0 10px 0; font-weight: 700;">
          📌 Inti Pembahasan (Ringkasan Eksekutif)
        </h3>
        <p style="font-size: 14px; color: #334155; line-height: 1.6; margin: 0;">
          ${summary.executiveSummary.replace(/\n\n/g, '<br><br>')}
        </p>
      </div>

      <!-- KEY TAKEAWAYS PREVIEW -->
      ${
        summary.takeaways.length > 0
          ? `
      <div style="margin: 24px 0;">
        <h3 style="font-size: 15px; text-transform: uppercase; letter-spacing: 0.5px; color: #4f46e5; margin: 0 0 10px 0; font-weight: 700;">
          🔑 Cuplikan Wawasan Kunci
        </h3>
        <ul style="padding-left: 20px; margin: 0;">
          ${takeawaysHtml}
        </ul>
      </div>
      `
          : ''
      }

      <div style="margin-top: 32px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 13px; color: #94a3b8; text-align: center;">
        <p style="margin: 0;">Email ini dikirim secara otomatis oleh <strong>Summari AI</strong>.</p>
        <p style="margin: 4px 0 0 0;">
          <a href="https://github.com/alifshelviano/summari" style="color: #6366f1; text-decoration: none;">Lihat Repositori GitHub</a>
        </p>
      </div>
    </div>
  </div>
</body>
</html>
`;
}

/**
 * Sends summary email with PDF attachment.
 */
export async function sendSummaryEmail({
  recipientEmail,
  recipientName,
  notes,
  summary,
  pdfBase64,
}: SendSummaryEmailParams): Promise<SendEmailResult> {
  if (!recipientEmail || !recipientEmail.includes('@')) {
    return { success: false, error: 'Alamat email penerima tidak valid.' };
  }

  try {
    const { transporter, isTest } = await getTransporter();

    // Prepare PDF buffer (from client base64 or generated on-demand)
    let pdfBuffer: Buffer;
    if (pdfBase64) {
      const cleanBase64 = pdfBase64.replace(/^data:application\/pdf;base64,/, '');
      pdfBuffer = Buffer.from(cleanBase64, 'base64');
    } else {
      pdfBuffer = generatePdfBuffer(summary);
    }

    const filename = sanitizeFilename(summary.title);
    const fromAddress =
      process.env.SMTP_FROM ||
      (process.env.SMTP_USER
        ? `"Summari AI" <${process.env.SMTP_USER}>`
        : '"Summari AI" <noreply@summari.local>');

    const subject = `[Summari] Ringkasan & Dokumen PDF: ${summary.title}`;

    const info = await transporter.sendMail({
      from: fromAddress,
      to: recipientEmail,
      subject,
      html: buildEmailHtml({ summary, recipientName, notes }),
      attachments: [
        {
          filename,
          content: pdfBuffer,
          contentType: 'application/pdf',
        },
      ],
    });

    let previewUrl: string | undefined;
    if (isTest) {
      previewUrl = nodemailer.getTestMessageUrl(info) || undefined;
      console.log('Ethereal test email preview URL:', previewUrl);
    }

    return {
      success: true,
      messageId: info.messageId,
      previewUrl,
    };
  } catch (err) {
    console.error('Failed to send email:', err);
    return {
      success: false,
      error: `Gagal mengirim email: ${(err as Error).message}`,
    };
  }
}

