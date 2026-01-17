![SintaMD Banner](https://raw.githubusercontent.com/IbraDecode/MyAssets/refs/heads/main/1000063460.png)

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![Node.js Version](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![GitHub Stars](https://img.shields.io/github/stars/IbraDecode/SintaMD?style=social)](https://github.com/IbraDecode/SintaMD)
[![Visitors](https://visitor-badge.glitch.me/badge?page_id=IbraDecode.SintaMD)](https://github.com/IbraDecode/SintaMD)
[![GitHub last commit](https://img.shields.io/github/last-commit/IbraDecode/SintaMD)](https://github.com/IbraDecode/SintaMD/commits/main)
[![GitHub issues](https://img.shields.io/github/issues/IbraDecode/SintaMD)](https://github.com/IbraDecode/SintaMD/issues)

<div align="center">

# SintaMD

```
   _____         _           __  __ ______
  / ___/____  __(_)___ ___  / /_/ // ____/
  \__ \/ __ \/ / / __ `__ \/ __  //___ \
 ___/ / /_/ / / / / / / / / /_/ //___/ /
/____/\____/_/_/_/ /_/ /_/\__/_//_____/

```

*Bot WhatsApp multi-device berbasis Node.js dengan fitur lengkap untuk otomasi dan hiburan.*

> **Tagline**: Otomasi WhatsApp yang Powerful, Simple, dan Fun!  
> **Created by**: [Ibra Decode](https://github.com/IbraDecode) | Wave: ~

[![Version](https://img.shields.io/badge/Version-0.61.1-blue.svg)](https://github.com/IbraDecode/SintaMD)
[![Status](https://img.shields.io/badge/Status-Active-brightgreen.svg)](https://github.com/IbraDecode/SintaMD)
[![Platform](https://img.shields.io/badge/Platform-Node.js-339933.svg)](https://nodejs.org/)

</div>

## Daftar Isi

- [Deskripsi](#deskripsi)
- [Demo](#demo)
- [Fitur Utama](#fitur-utama)
- [Persyaratan](#persyaratan)
- [Instalasi](#instalasi)
- [Penggunaan](#penggunaan)
- [Contoh Perintah](#contoh-perintah)
- [Troubleshooting](#troubleshooting)
- [Roadmap](#roadmap)
- [FAQ](#faq)
- [Credits](#credits)
- [Kontribusi](#kontribusi)
- [Lisensi](#lisensi)
- [Author](#author)

## Deskripsi

SintaMD adalah bot WhatsApp yang mendukung multi-device, dibangun menggunakan Baileys. Bot ini menyediakan berbagai fitur seperti AI, downloader media, manajemen grup, dan banyak lagi. Dirancang untuk mudah digunakan dengan sistem plugin modular.

### Arsitektur Bot

- **Modular Plugins**: 183+ plugin untuk berbagai fungsi.
- **Database JSON**: Persistent storage untuk user dan chat data.
- **Event-Driven**: Respon cepat terhadap pesan dan event grup.

## Demo

![SintaMD Demo](https://raw.githubusercontent.com/IbraDecode/MyAssets/main/demo.gif)

*Demo menampilkan bot dalam aksi: pairing, menu, dan perintah AI.*

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

<details>
<summary>Klik untuk panduan instalasi lengkap</summary>

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

</details>

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

## Roadmap

- [ ] Integrasi lebih banyak AI models
- [ ] Dashboard web untuk management
- [ ] Multi-language support
- [ ] Plugin marketplace
- [ ] Optimasi performa untuk large groups

## FAQ

<details>
<summary>Klik untuk FAQ</summary>

**Q: Bagaimana cara pairing bot?**  
A: Jalankan bot, ikuti instruksi pairing code di terminal, masukkan ke WhatsApp.

**Q: Bot tidak merespons perintah?**  
A: Pastikan prefix "." digunakan, dan Anda memiliki permission (user/admin/owner).

**Q: Bagaimana update bot?**  
A: Pull dari git: `git pull origin main`, lalu restart.

**Q: Premium features apa saja?**  
A: Unlimited limits, priority support, exclusive commands. Hubungi owner.

**Q: Error saat install?**  
A: Pastikan Node.js 18+, hapus node_modules dan npm install ulang.

</details>

## Credits

Terima kasih kepada:

- **Base Project**: Elaina-MultiDevice
- **Libraries**: Baileys, LowDB, Axios, dll.
- **Contributors**: Semua yang membantu development
- **Community**: Pengguna dan tester

---

*Powered by Node.js and Baileys*

## Contributors

<div align="center">

[![GitHub contributors](https://img.shields.io/github/contributors/IbraDecode/SintaMD)](https://github.com/IbraDecode/SintaMD/graphs/contributors)

### Terima Kasih Khusus

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/IbraDecode">
        <img src="https://github.com/IbraDecode.png" width="100px;" alt="Ibra Decode"/><br />
        <sub><b>Ibra Decode</b></sub>
      </a>
      <br />
      <sub>Creator & Main Developer</sub>
    </td>
    <td align="center">
      <a href="https://github.com">
        <img src="https://via.placeholder.com/100?text=You" width="100px;" alt="You"/><br />
        <sub><b>Anda?</b></sub>
      </a>
      <br />
      <sub>Future Contributor</sub>
    </td>
  </tr>
</table>

*Kontribusi Anda sangat dihargai! Jika ingin bergabung, lihat [Panduan Kontribusi](#kontribusi).*

</div>

## Kontribusi

<details>
<summary>Klik untuk panduan kontribusi</summary>

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

</details>

## Lisensi

Lisensi GPL-3.0-or-later. Lihat file [LICENSE](LICENSE) untuk detail.

## Author

<div align="center">

**Ibra Decode**  
*Developer & Creator of SintaMD*

[![GitHub](https://img.shields.io/badge/GitHub-@IbraDecode-181717?style=flat-square&logo=github)](https://github.com/IbraDecode)
[![Website](https://img.shields.io/badge/Website-ibraa.web.id-FF6B35?style=flat-square&logo=firefox)](https://ibraa.web.id)
[![WhatsApp](https://img.shields.io/badge/WhatsApp-Chat-25D366?style=flat-square&logo=whatsapp)](https://wa.me/31617786379)

---

*Jika suka proyek ini, beri star di GitHub!*

</div>