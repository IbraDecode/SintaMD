/*
Author : Ibra Decode
WA : +31617786379
Base : Elaina-MultiDevice
Release : 22 Nov 2022
*/

import { watchFile, unwatchFile } from 'fs'
import chalk from 'chalk'
import { fileURLToPath } from 'url'
import moment from 'moment-timezone'

/*============= WAKTU =============*/
let wktuwib = moment.tz('Asia/Jakarta').format('HH:mm:ss') + ' WIB';
let wktuwita = moment.tz('Asia/Makassar').format('HH:mm:ss') + ' WITA';
let wktuwit = moment.tz('Asia/Jayapura').format('HH:mm:ss') + ' WIT';
global.gabung = wktuwib + '\n' + wktuwita + '\n' + wktuwit;
let d = new Date(new Date + 3600000)
let locale = 'id'

let weton = ['Pahing', 'Pon', 'Wage', 'Kliwon', 'Legi'][Math.floor(d / 84600000) % 5]
let week = d.toLocaleDateString(locale, { weekday: 'long' })
let date = d.toLocaleDateString(locale, {
  day: 'numeric',
  month: 'long',
  year: 'numeric'
});

const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)

/*============= MAIN INFO =============*/
// Nomor untuk pairing WhatsApp (tanpa + atau 0, contoh: '628xxxxxxxxx')
global.pairing = '31617786379' // Ganti ke nomor bot Anda

// Daftar owner: [nomor, nomor alternatif, nama, isPremium]
global.owner = [['31617786379', '6287829854688', 'Ibra Decode', true]]

// Moderator: array nomor yang bisa akses command tertentu
global.mods = []

// Premium user: array nomor premium
global.prems = []

// Nomor bot (untuk display)
global.nomorbot = '31617786379' // Ganti ke nomor bot Anda

// Nomor owner utama
global.nomorown = '31617786379'

/*============= WATERMARK =============*/
// Read more separator untuk pesan panjang
global.readMore = readMore

// Author bot
global.author = 'Ibra Decode'

// Nama bot (akan ditampilkan di menu, dll.)
global.namebot = 'シンタ MD'

// Watermark lengkap
global.wm = '© シンタ MD By Ibra Decode'

// Watermark singkat
global.watermark = wm

// Format tanggal untuk display
global.botdate = `⫹⫺ DATE: ${week} ${date}\n⫹⫺ 𝗧𝗶𝗺𝗲: ${wktuwib}`

// Format waktu
global.bottime = `T I M E : ${wktuwib}`

// Package name untuk sticker
global.stickpack = `Sticker Dibuat dengan ${namebot}\ngithub.com/IbraDecode\n\nシンタ MD\n+${nomorbot}`

// Author untuk sticker
global.stickauth = `© シンタ MD By Ibra Decode`

// Hari dan tanggal
global.week = `${week} ${date}`

// Waktu WIB
global.wibb = `${wktuwib}`

/*============== SOCIAL ==============*/
global.sig = '' // Link Instagram bot/owner
global.sgh = 'https://github.com/IbraDecode' // Link GitHub
global.sgc = '' // Link Grup WhatsApp
global.sgw = 'https://ibraa.web.id' // Link Website
global.sdc = '-' // Link Discord
global.sfb = '' // Link Facebook
global.snh = '' // Link TikTok atau lainnya

/*============== PAYMENT =============*/
// Nomor Dana untuk donasi
global.pdana = '6287768378361'

// Path gambar QRIS
global.qris = 'qris.png'

// Link Saweria
global.psaweria = ''

// Nomor GoPay
global.pgopay = '6287768378361'

// Nomor OVO
global.povo = '6287768378361'

// Atas nama rekening (disensor untuk keamanan)
global.ats = 'RAT** ALF******'
global.atsd = 'RAT** ALF******'
global.atsg = 'RAT** ALF******'
global.atso = 'RAT** ALF******'

/*============= RESPON =============*/
// Pesan menunggu proses
global.wait = 'Please Wait...'

// Pesan error
global.eror = 'Error!'

/*============= API =============*/
// Daftar API yang digunakan bot
global.APIs = {
  ryzumi: 'https://api.ryzumi.vip',
  // Tambah API lain jika perlu
}

/*============= API KEY =============*/
// API Keys untuk external services
global.APIKeys = {
  // 'https://website': 'apikey'
  // Contoh: 'https://api.example.com': 'your-api-key'
}

/*============== LOGO ==============*/
global.thumb = 'https://telegra.ph/file/cce9ab4551f7150f1970d.jpg' // Thumbnail utama untuk pesan
global.thumb2 = 'https://telegra.ph/file/26b515d170f1e599f78a7.jpg' // Thumbnail alternatif
global.thumbbc = 'https://telegra.ph/file/05f874dc87f7e27fa8127.jpg' // Thumbnail untuk broadcast
global.giflogo = 'https://telegra.ph/file/a46ab7fa39338b1f54d5a.mp4' // GIF logo
global.thumblvlup = 'https://telegra.ph/file/a3e66e0fa840b08236c75.jpg' // Thumbnail level up

/*=========== TYPE DOCUMENT ===========*/
// MIME types untuk berbagai format dokumen
global.dpptx = 'application/vnd.openxmlformats-officedocument.presentationml.presentation' // PowerPoint
global.ddocx = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' // Word
global.dxlsx = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' // Excel
global.dpdf = 'application/pdf' // PDF
global.drtf = 'text/rtf' // RTF
global.djson = 'application/json' // JSON

/*=========== HIASAN ===========*/
// Hiasan untuk menu default
global.dmenut = 'ଓ═┅═━–〈' // Top border menu
global.dmenub = '┊↬' // Body prefix menu
global.dmenub2 = '┊' // Body prefix untuk info command
global.dmenuf = '┗––––––––––✦' // Footer menu

// Hiasan untuk command menu
global.dashmenu = '┅━━━═┅═❏ *ღ *DASHBOARD* ღ* ❏═┅═━━━┅' // Dashboard header
global.cmenut = '❏––––––『' // Top command menu
global.cmenuh = '』––––––' // Header command menu
global.cmenub = '┊❀' // Body command menu
global.cmenuf = '┗━═┅═━––––––๑\n' // Footer command menu
global.cmenua = '\n⌕ ❙❘❙❙❘❙❚❙❘❙❙❚❙❘❙❘❙❚❙❘❙❙❚❙❘❙❙❘❙❚❙❘ ⌕\n     ' // After menu
global.pmenus = '┊' // Pembatas menu selector

// Hiasan umum
global.htki = '––––––『' // Hiasan title kiri
global.htka = '』––––––' // Hiasan title kanan
global.lopr = 'Ⓟ' // Logo premium di menu
global.lolm = 'Ⓛ' // Logo limit/free di menu
global.htjava = '⫹⫺' // Hiasan Java-style
global.hsquere = ['⛶', '❏', '⫹⫺'] // Array hiasan kotak

// Multiplier untuk XP atau reward (0 = normal)
global.multiplier = 0

//------ JANGAN DIUBAH -----
// Auto-reload config saat file berubah (untuk development)
let file = fileURLToPath(import.meta.url)
watchFile(file, () => {
  unwatchFile(file)
  console.log(chalk.redBright("Update 'config.js'"))
  import(`${file}?update=${Date.now()}`)
})