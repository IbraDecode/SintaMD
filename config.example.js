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
global.pairing = '6287829854688' //ganti ke nomer bot
global.owner = [['31617786379', '6287829854688', 'Ibra Decode', true]]
global.mods = []
global.prems = []
global.nomorbot = '6287829854688' //ganti ke nomer bot
global.nomorown = '31617786379'

/*============= WATERMARK =============*/
global.readMore = readMore
global.author = 'Ibra Decode'
global.namebot = 'シンタ MD'
global.wm = '© シンタ MD By Ibra Decode'
global.watermark = wm
global.botdate = `⫹⫺ DATE: ${week} ${date}\n⫹⫺ 𝗧𝗶𝗺𝗲: ${wktuwib}`
global.bottime = `T I M E : ${wktuwib}`
global.stickpack = `Sticker Dibuat dengan ${namebot}\ngithub.com/IbraDecode\n\nシンタ MD\n+${nomorbot}`
global.stickauth = `© シンタ MD By Ibra Decode`
global.week = `${week} ${date}`
global.wibb = `${wktuwib}`

/*============== SOCIAL ==============*/
global.sig = '' //link ig
global.sgh = 'https://github.com/IbraDecode'
global.sgc = ''
global.sgw = 'https://ibraa.web.id'
global.sdc = '-'
global.sfb = ''
global.snh = ''

/*============== PAYMENT ==============*/
global.pdana = '6287768378361'
global.qris = 'qris.png'
global.psaweria = ''
global.pgopay = '6287768378361'
global.povo = '6287768378361'
global.ats = 'RAT** ALF******'
global.atsd = 'RAT** ALF******'
global.atsg = 'RAT** ALF******'
global.atso = 'RAT** ALF******'

/*============= RESPON =============*/
global.wait = 'Please Wait...'
global.eror = 'Error!'

/*============= API =============*/
global.APIs = {
  ryzumi: 'https://api.ryzumi.vip',

}

/*============= API KEY =============*/
global.APIKeys = {
  // 'https://website': 'apikey'
}

/*============== LOGO ==============*/
global.thumb = 'https://telegra.ph/file/cce9ab4551f7150f1970d.jpg' //Main Thumbnail
global.thumb2 = 'https://telegra.ph/file/26b515d170f1e599f78a7.jpg'
global.thumbbc = 'https://telegra.ph/file/05f874dc87f7e27fa8127.jpg' //For broadcast
global.giflogo = 'https://telegra.ph/file/a46ab7fa39338b1f54d5a.mp4'
global.thumblvlup = 'https://telegra.ph/file/a3e66e0fa840b08236c75.jpg'

/*=========== TYPE DOCUMENT ===========*/
global.dpptx = 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
global.ddocx = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
global.dxlsx = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
global.dpdf = 'application/pdf'
global.drtf = 'text/rtf'
global.djson = 'application/json'

/*=========== HIASAN ===========*/
// DEFAULT MENU
global.dmenut = 'ଓ═┅═━–〈' //top
global.dmenub = '┊↬' //body
global.dmenub2 = '┊' //body for info cmd on Default menu
global.dmenuf = '┗––––––––––✦' //footer

// COMMAND MENU
global.dashmenu = '┅━━━═┅═❏ *ღ *DASHBOARD* ღ* ❏═┅═━━━┅'
global.cmenut = '❏––––––『'                       //top
global.cmenuh = '』––––––'                        //header
global.cmenub = '┊❀'                            //body
global.cmenuf = '┗━═┅═━––––––๑\n'                //footer
global.cmenua = '\n⌕ ❙❘❙❙❘❙❚❙❘❙❙❚❙❘❙❘❙❚❙❘❙❙❚❙❘❙❙❘❙❚❙❘ ⌕\n     ' //after
global.pmenus = '┊'                              //pembatas menu selector

global.htki = '––––––『' // Hiasan Titile (KIRI)
global.htka = '』––––––' // Hiasan Title  (KANAN)
global.lopr = 'Ⓟ' //LOGO PREMIUM ON MENU.JS
global.lolm = 'Ⓛ' //LOGO LIMIT/FREE ON MENU.JS
global.htjava = '⫹⫺'    //hiasan Doang :v
global.hsquere = ['⛶', '❏', '⫹⫺']

global.multiplier = 0

//------ JANGAN DIUBAH -----
let file = fileURLToPath(import.meta.url)
watchFile(file, () => {
  unwatchFile(file)
  console.log(chalk.redBright("Update 'config.js'"))
  import(`${file}?update=${Date.now()}`)
})