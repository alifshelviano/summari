# 📄 Summari — YouTube Video AI Summarizer & PDF Email Delivery

> **Website cerdas untuk merangkum inti hasil pembahasan dari link video YouTube, mengekstrak wawasan penting, serta mengirimkan dokumen PDF siap baca langsung ke alamat email.**

[![GitHub stars](https://img.shields.io/github/stars/alifshelviano/summari?style=social)](https://github.com/alifshelviano/summari)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Google Gemini](https://img.shields.io/badge/Google-Gemini_AI-orange?logo=google)](https://aistudio.google.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

---

## 🌟 Fitur Utama

- ⚡ **Ekstraksi Cepat & Otomatis**: Mendukung semua format URL YouTube (`youtube.com/watch?v=...`, `youtu.be/...`, `youtube.com/shorts/...`, atau `embed`).
- 🤖 **Kecerdasan Buatan Google Gemini**: Menganalisis transkrip dialog video secara mendalam untuk menyarikan:
  - **Ringkasan Eksekutif** (Executive Briefing): 2–3 paragraf intisari topik dan premis utama.
  - **Poin-Poin Utama Pembahasan**: Pembagian bab topik beserta rincian konteks & penanda waktu (*timestamps*).
  - **Wawasan Kunci (Key Takeaways)**: Poin-poin hikmah dan pelajaran inti.
  - **Langkah Aksi & Tips Praktis**: Rekomendasi checklist yang dapat langsung dieksekusi penonton.
  - **Kesimpulan Akhir**: Pesan penutup yang mengikat seluruh bahasan.
- 📑 **Dokumen PDF Siap Baca (Executive Layout)**:
  - Format standar cetak A4 dengan tata letak profesional.
  - Lengkap dengan metadata video, nama kreator, badge estimasi waktu baca, pembagian bab bergaris aksen, dan penomoran halaman otomatis (*Halaman X dari Y*).
  - Dapat langsung diunduh secara instan ke browser dengan 1-klik.
- ✉️ **Pengiriman Otomatis ke Email**:
  - Kirim hasil ringkasan lengkap beserta lampiran dokumen PDF (`Summari-[Judul].pdf`) langsung ke email penerima.
  - Dilengkapi template email HTML responsif yang elegan.
  - Mendukung SMTP standar (Gmail dengan App Password, Brevo, SendGrid, Amazon SES, Mailgun).
  - **Mode Sandbox (Ethereal Email)**: Jika kredensial SMTP belum diisi, sistem otomatis menyediakan link preview email langsung untuk pengujian interaktif!
- 🎨 **UI Modern & Responsif**: Dibangun dengan Tailwind CSS, dark/light theme, tombol salin Markdown, dan modal konfigurasi API Key lokal di browser.

---

## 🏗️ Arsitektur & Teknologi

| Bagian | Teknologi | Keterangan |
| :--- | :--- | :--- |
| **Framework** | Next.js 14 (App Router) | Full-stack React framework dengan API routes |
| **Bahasa** | TypeScript | Type-safety penuh di sisi server dan klien |
| **Styling** | Tailwind CSS & Lucide Icons | Desain UI modern, responsif, dan elegan |
| **AI Model** | Google Gemini 1.5 Flash | Analisis transkrip cepat dengan jendela konteks besar |
| **PDF Generator** | jsPDF | Pembuatan dokumen PDF presisi di klien & server |
| **Email Service** | Nodemailer | Pengiriman email HTML dengan attachment PDF |
| **Transcript** | `youtube-transcript` + Scraper | Ekstraksi transkrip otomatis dengan fallback |
| **CI/CD** | GitHub Actions | Linting, validasi build, dan auto-deploy |

---

## 🚀 Panduan Memulai Cepat (Local Development)

### 1. Clone Repositori

```bash
git clone https://github.com/alifshelviano/summari.git
cd summari
```

### 2. Instal Dependensi

```bash
npm install
```

### 3. Konfigurasi Lingkungan (`.env.local`)

Salin file contoh konfigurasi:

```bash
cp .env.example .env.local
```

Buka `.env.local` dan sesuaikan nilainya:

```env
# 1. Google Gemini AI API Key (Dapatkan gratis di https://aistudio.google.com/app/apikey)
GEMINI_API_KEY=AIzaSy...
GEMINI_MODEL=gemini-1.5-flash

# 2. SMTP Konfigurasi Email (Contoh menggunakan Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=emailanda@gmail.com
SMTP_PASS=xxxx xxxx xxxx xxxx
SMTP_FROM="Summari AI" <emailanda@gmail.com>
```

> 💡 **Catatan Kredensial:**
> - Jika `GEMINI_API_KEY` belum diisi, aplikasi tetap dapat dijalankan dan menyediakan fitur ekstraksi heuristik pintar fallback. Pengguna juga dapat memasukkan API Key pribadi langsung lewat menu **Konfigurasi** di website.
> - Jika SMTP belum diisi, sistem otomatis menggunakan **Ethereal Email Sandbox** dan menampilkan tombol tautan untuk melihat email yang terkirim di browser.

### 4. Jalankan Aplikasi

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

---

## 📧 Panduan Menyiapkan Gmail SMTP (App Password)

Untuk mengirim email menggunakan akun Gmail Anda:

1. Buka [Google Account Security](https://myaccount.google.com/security).
2. Pastikan **Verifikasi 2 Langkah (2-Step Verification)** aktif.
3. Cari menu **Sandi Aplikasi (App Passwords)**.
4. Buat sandi aplikasi baru dengan nama `Summari`.
5. Salin 16 karakter kata sandi yang dihasilkan (misal: `abcd efgh ijkl mnop`).
6. Masukkan kata sandi tersebut ke variabel `SMTP_PASS` pada `.env.local` tanpa tanda spasi.

---

## 🚢 Panduan Deployment & GitHub Actions

Repositori ini telah dilengkapi alur kerja otomatis di `.github/workflows/deploy.yml`:

```
Git Push (master/main) ──> Lint & TypeScript Check ──> Next.js Build ──> Deploy to Vercel / Cloud
```

### A. Deploy Otomatis ke Vercel via GitHub Actions

1. Hubungkan repositori GitHub ini ke akun [Vercel](https://vercel.com).
2. Dapatkan kredensial Vercel:
   - `VERCEL_TOKEN`: Buat token di [Vercel Account Tokens](https://vercel.com/account/tokens).
   - `VERCEL_ORG_ID` & `VERCEL_PROJECT_ID`: Ditemukan pada halaman *Project Settings* di Vercel.
3. Di repositori GitHub Anda, buka **Settings** &rarr; **Secrets and variables** &rarr; **Actions** &rarr; **New repository secret**:
   - `VERCEL_TOKEN`
   - `VERCEL_ORG_ID`
   - `VERCEL_PROJECT_ID`
   - `GEMINI_API_KEY`
   - `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`
4. Setiap kali Anda melakukan `git push` ke branch `master` atau `main`, GitHub Actions akan memvalidasi kode dan melakukan *deploy* ke lingkungan *Production*.

### B. Deploy Menggunakan Docker

Tersedia `Dockerfile` multi-stage build yang sangat efisien dan `docker-compose.yml`:

```bash
# Build dan jalankan kontainer
docker-compose up -d --build
```

Aplikasi akan berjalan di port `3000`.

---

## 📁 Struktur Direktori

```
summari/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions CI/CD workflow
├── public/                     # Aset statis & robots.txt
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── summarize/      # Endpoint POST merangkum YouTube
│   │   │   ├── send-email/     # Endpoint POST mengirim email & PDF
│   │   │   └── generate-pdf/   # Endpoint POST unduh PDF langsung
│   │   ├── globals.css         # Styling global Tailwind
│   │   ├── layout.tsx          # Root layout & meta SEO
│   │   └── page.tsx            # Halaman utama aplikasi
│   ├── components/
│   │   ├── Header.tsx          # Navigasi atas & badge
│   │   ├── Hero.tsx            # Hero banner & value proposition
│   │   ├── SummaryInput.tsx    # Form input link & opsi bahasa/format
│   │   ├── VideoCard.tsx       # Kartu detail video YouTube
│   │   ├── SummaryDisplay.tsx  # Tampilan ringkasan & tombol aksi
│   │   ├── EmailModal.tsx      # Modal pengiriman email & preview PDF
│   │   ├── SettingsModal.tsx   # Modal konfigurasi API & panduan SMTP
│   │   └── Toast.tsx           # Notifikasi pop-up
│   └── lib/
│       ├── types.ts            # Definisi antarmuka TypeScript
│       ├── youtube.ts          # Ekstraktor ID, oEmbed & transkrip
│       ├── gemini.ts           # Mesin pemrosesan AI Google Gemini
│       ├── pdf.ts              # Pembuat dokumen PDF A4 siap baca
│       └── email.ts            # Nodemailer sender & template HTML
├── .env.example                # Panduan variabel lingkungan
├── Dockerfile                  # Container production build
├── docker-compose.yml          # Orkestrasi Docker compose
├── package.json
└── README.md
```

---

## 📄 Lisensi

Proyek ini dirilis di bawah lisensi [MIT License](LICENSE).

Dibuat dengan dedikasi untuk memudahkan pencatatan, riset, dan pembelajaran dari video YouTube.
Kontribusi dan *pull request* sangat disambut hangat di [alifshelviano/summari](https://github.com/alifshelviano/summari)!
