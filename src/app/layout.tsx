import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: 'Summari — Ringkasan YouTube Siap Baca & Kirim ke Email PDF',
  description:
    'Website cerdas untuk merangkum inti hasil pembahasan dari link video YouTube, mengekstrak wawasan kunci, serta mengirimkan dokumen PDF siap baca langsung ke email.',
  keywords: [
    'youtube summarizer',
    'ringkasan youtube',
    'youtube to pdf',
    'ai summary',
    'kirim ringkasan ke email',
    'transkrip youtube',
    'gemini ai',
  ],
  authors: [{ name: 'Alif Shelviano', url: 'https://github.com/alifshelviano' }],
  openGraph: {
    title: 'Summari — Ringkasan YouTube Siap Baca & Kirim ke Email PDF',
    description:
      'Ubah link video YouTube panjang menjadi ringkasan eksekutif dan dokumen PDF siap baca langsung ke email Anda.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
