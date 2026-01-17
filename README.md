![SintaMD Banner](https://raw.githubusercontent.com/IbraDecode/MyAssets/refs/heads/main/1000063460.png)

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![Node.js Version](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![GitHub Stars](https://img.shields.io/github/stars/IbraDecode/SintaMD?style=social)](https://github.com/IbraDecode/SintaMD)

# SintaMD

Bot WhatsApp multi-device berbasis Node.js dengan fitur lengkap untuk otomasi dan hiburan.

## Daftar Isi

- [Deskripsi](#deskripsi)
- [Fitur Utama](#fitur-utama)
- [Persyaratan](#persyaratan)
- [Instalasi](#instalasi)
- [Penggunaan](#penggunaan)
- [Contoh Perintah](#contoh-perintah)
- [Troubleshooting](#troubleshooting)
- [Kontribusi](#kontribusi)
- [Lisensi](#lisensi)
- [Author](#author)

## Deskripsi

SintaMD adalah bot WhatsApp yang mendukung multi-device, dibangun menggunakan Baileys. Bot ini menyediakan berbagai fitur seperti AI, downloader media, manajemen grup, dan banyak lagi. Dirancang untuk mudah digunakan dengan sistem plugin modular.

### Arsitektur Bot

- **Modular Plugins**: 183+ plugin untuk berbagai fungsi.
- **Database JSON**: Persistent storage untuk user dan chat data.
- **Event-Driven**: Respon cepat terhadap pesan dan event grup.

## Fitur Utama

| Kategori | Deskripsi |
|----------|-----------|
| [AI] **AI & Otomasi** | Integrasi dengan Gemini, OpenAI, DeepSeek, image generation, chat, negotiator. |
| [DL] **Downloader** | TikTok, YouTube, Instagram, Facebook, SoundCloud, dan lebih dari 10 platform. |
| [GRP] **Grup Management** | Welcome/leave, anti-link, anti-toxic, promote/demote, tag all, hidetag. |
| [MED] **Stiker & Media** | Buat stiker, konversi webp/mp4, OCR, watermark, upscale. |
| [INF] **Informasi & Tools** | Cek IP, speedtest, translate, TTS, jadwal sholat, cuaca, IP lookup. |
| [PREM] **Premium & Limit** | XP system, daily limits, premium features, user registration. |
| [ANON] **Memfess & Anonymous** | Kirim pesan anonim tanpa jejak. |
| [BCAST] **Broadcast & Admin** | Kirim ke semua chat/grup, owner controls, backup/restore. |

## Persyaratan

- [Node.js](https://nodejs.org/) versi 18 atau lebih tinggi
- [FFmpeg](https://ffmpeg.org/) untuk konversi media
- NPM (terinstall otomatis dengan Node.js)
- Akun WhatsApp aktif untuk pairing

## Instalasi

1. Pastikan Node.js dan NPM terinstall.

2. Clone repository ini:
   ```
   git clone https://github.com/IbraDecode/SintaMD.git
   cd SintaMD
   ```

3. Install dependencies:
   ```
   npm install
   ```

4. (Opsional) Install FFmpeg jika belum ada:
   - Ubuntu/Debian: `sudo apt install ffmpeg`
   - Windows: Download dari situs resmi FFmpeg.

5. Jalankan bot:
   ```
   npm start
   ```
   Atau untuk development:
   ```
   npm run dev
   ```

## Penggunaan

1. Saat pertama kali menjalankan, bot akan menampilkan pairing code. Masukkan code tersebut di WhatsApp untuk pairing.

2. Bot akan terhubung dan siap digunakan.

3. Gunakan perintah dengan prefix "." (contoh: .menu).

4. Untuk owner commands, pastikan nomor Anda terdaftar di config.js.

## Contoh Perintah

- `.menu` - Tampilkan menu utama
- `.sticker` - Buat stiker dari gambar
- `.play [query]` - Putar musik dari YouTube
- `.ai [pertanyaan]` - Chat dengan AI
- `.tiktok [url]` - Download video TikTok
- `.groupinfo` - Info grup saat ini

Lihat semua perintah dengan `.menu` atau cek folder `plugins/` untuk detail.

## Troubleshooting

| Masalah | Solusi |
|---------|--------|
| Pairing gagal | Pastikan nomor WhatsApp valid, tidak terblokir, dan coba lagi. |
| Media tidak terkirim | Periksa koneksi internet, pastikan FFmpeg terinstall dengan `ffmpeg -version`. |
| Bot tidak merespons | Cek log console, restart dengan `npm start`, atau periksa error di terminal. |
| Limit tercapai | Tunggu reset harian (otomatis) atau hubungi owner untuk premium. |
| Error dependencies | Jalankan `npm install` ulang atau hapus `node_modules` dan install lagi. |

Jika masalah berlanjut, buat issue di [GitHub Issues](https://github.com/IbraDecode/SintaMD/issues) dengan log error.

## Kontribusi

Kontribusi diterima! Ikuti panduan berikut:

1. **Fork** repository ini.
2. **Clone** fork Anda: `git clone https://github.com/your-username/SintaMD.git`
3. **Buat branch** baru: `git checkout -b fitur-baru`
4. **Edit** kode dan **test** perubahan.
5. **Commit** perubahan: `git commit -m 'Tambah fitur baru'`
6. **Push** ke branch: `git push origin fitur-baru`
7. **Buat Pull Request** di GitHub.

**Panduan Kode**:
- Ikuti style existing code.
- Tambah komentar pada fungsi baru.
- Test plugin di environment lokal.
- Jangan commit secrets atau API keys.

Untuk pertanyaan, hubungi [Ibra Decode](https://github.com/IbraDecode).

## Lisensi

Lisensi GPL-3.0-or-later. Lihat file [LICENSE](LICENSE) untuk detail.

## Author

**Ibra Decode**
- GitHub: [@IbraDecode](https://github.com/IbraDecode)
- Website: [ibraa.web.id](https://ibraa.web.id)
- WhatsApp: [+31617786379](https://wa.me/31617786379)

---

* Jika suka proyek ini, beri star di GitHub!