import yts from 'yt-search'
import fs from 'fs'
import path from 'path'
import axios from 'axios'
import { pipeline } from 'stream'
import { promisify } from 'util'

const streamPipeline = promisify(pipeline)

// YouTube Downloader V2 Function
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args))

async function youtubeV2(url, format) {
    const yt = { title: null, image: null, format, download: null }

    const options = {
        method: 'GET',
        headers: {
            'User-Agent': 'Mozilla/5.0 (Linux; Android 15; 23124RA7EO Build/AQ3A.240829.003) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.7444.174 Mobile Safari/537.36',
            'Accept-Encoding': 'gzip, deflate, br, zstd',
            'sec-ch-ua-platform': '"Android"',
            'sec-ch-ua': '"Chromium";v="142", "Android WebView";v="142", "Not_A Brand";v="99"',
            'sec-ch-ua-mobile': '?1',
            'origin': 'https://ytmp3.so',
            'x-requested-with': 'mark.via.gp',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'referer': 'https://ytmp3.so/',
            'accept-language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
            'priority': 'u=1, i'
        }
    }

    // STEP 1: init
    let init = await fetch(
        `https://p.savenow.to/ajax/download.php?copyright=0&format=${format}&url=${encodeURIComponent(url)}&api=dfcb6d76f2f6a9894gjkege8a4ab23222`,
        options
    ).then(r => r.json())

    const id = init.id
    yt.title = init.info?.title || ""
    yt.image = init.info?.image || ""

    let prog = await fetch(`https://p.savenow.to/api/progress?id=${id}`, options).then(r => r.json())

    while (prog.success === 0) {
        prog = await fetch(`https://p.savenow.to/api/progress?id=${id}`, options).then(r => r.json())
        if (prog.success === 1) break
    }

    yt.download = prog.download_url || null

    return yt
}

const handler = async (m, { conn, command, text, usedPrefix }) => {
  if (!text) throw `Use example: ${usedPrefix}${command} audio <query> | ${usedPrefix}${command} video <query> | ${usedPrefix}${command} all <query>`

  const args = text.trim().split(' ')
  const type = args[0].toLowerCase()
  const query = args.slice(1).join(' ')
  
  if (!['audio', 'video', 'all'].includes(type)) throw `Tipe tidak valid! Gunakan: audio, video, atau all`
  if (!query) throw `Query tidak boleh kosong! Contoh: ${usedPrefix}${command} audio${type === 'audio' ? ' ' : ' {}'.type}judul lagu`

  const search = await yts(query)
  const vid = search.videos[Math.floor(Math.random() * search.videos.length)]
  if (!vid) throw 'Video not found, coba judul lain ya Sayang~'

  const { title, thumbnail, timestamp, views, ago, url } = vid

  const typeEmoji = type === 'audio' ? '🎵' : type === 'video' ? '🎬' : '📦'
  await conn.sendMessage(m.chat, {
    image: { url: thumbnail },
    caption: `${typeEmoji} Menemukan ${type}: *${title}*\n⏳ Sedang diunduh ya...`,
  }, { quoted: m })

  try {
    // Download based on type
    let data
    if (type === 'audio') {
      data = await youtubeV2(url, "mp3")
    } else if (type === 'video') {
      data = await youtubeV2(url, "720")
    } else if (type === 'all') {
      // Download both audio and video
      data = await youtubeV2(url, "mp3")
      const videoData = await youtubeV2(url, "720")
      data.videoDownload = videoData.download
    }
    
    console.log('YouTube V2 Result:', { type, title: data.title }) // Debug log

    if (!data.download) throw new Error('URL tidak ditemukan')

    const safeTitle = data.title.replace(/[\\/:*?"<>|]/g, '').slice(0, 50)
    const tmpDir = path.join(process.cwd(), 'tmp')

    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir, { recursive: true })
    }

    const filePath = path.join(tmpDir, `${safeTitle}.mp3`)

    // Start download with progress
    const startTime = Date.now()
    const audioResponse = await axios({
      method: 'get',
      url: data.download,
      responseType: 'stream',
      timeout: 30000
    })

    await streamPipeline(audioResponse.data, fs.createWriteStream(filePath))
    
    const downloadTime = Math.round((Date.now() - startTime) / 1000)
    const fileSize = fs.statSync(filePath).size
    console.log(`✅ Download selesai: ${safeTitle} - ${Math.round(fileSize / 1024)} KB (${downloadTime} detik)`)

    if (type === 'audio') {
      await conn.sendMessage(m.chat, {
        audio: { url: filePath },
        mimetype: 'audio/mpeg',
        fileName: `${safeTitle}.mp3`,
        caption: `*${data.title}*`,
        contextInfo: {
          externalAdReply: {
            mediaType: 2,
            mediaUrl: url,
            title: data.title,
            body: 'Audio Download',
            sourceUrl: url,
            thumbnail: await (await conn.getFile(data.image)).data,
          },
        },
      }, { quoted: m })
    } else if (type === 'video') {
      await conn.sendMessage(m.chat, {
        video: { url: filePath },
        mimetype: 'video/mp4',
        fileName: `${safeTitle}.mp4`,
        caption: `*${data.title}*`,
        contextInfo: {
          externalAdReply: {
            mediaType: 2,
            mediaUrl: url,
            title: data.title,
            body: 'Video Download',
            sourceUrl: url,
            thumbnail: await (await conn.getFile(data.image)).data,
          },
        },
      }, { quoted: m })
    } else if (type === 'all') {
      // Send audio first
      await conn.sendMessage(m.chat, {
        audio: { url: filePath },
        mimetype: 'audio/mpeg',
        fileName: `${safeTitle}.mp3`,
        caption: `*${data.title} (Audio)*`,
        contextInfo: {
          externalAdReply: {
            mediaType: 2,
            mediaUrl: url,
            title: data.title,
            body: 'Audio Download',
            sourceUrl: url,
            thumbnail: await (await conn.getFile(data.image)).data,
          },
        },
      }, { quoted: m })
      
      // Download and send video
      if (data.videoDownload) {
        const videoPath = path.join(tmpDir, `${safeTitle}_video.mp4`)
        const videoResponse = await axios({
          method: 'get',
          url: data.videoDownload,
          responseType: 'stream',
          timeout: 30000
        })
        
        await streamPipeline(videoResponse.data, fs.createWriteStream(videoPath))
        
        await conn.sendMessage(m.chat, {
          video: { url: videoPath },
          mimetype: 'video/mp4',
          fileName: `${safeTitle}_video.mp4`,
          caption: `*${data.title} (Video)*`,
          contextInfo: {
            externalAdReply: {
              mediaType: 2,
              mediaUrl: url,
              title: data.title,
              body: 'Video Download',
              sourceUrl: url,
              thumbnail: await (await conn.getFile(data.image)).data,
            },
          },
        }, { quoted: m })
        
        setTimeout(() => fs.unlink(videoPath, () => {}), 5000)
      }
    }

    // Delete file after 5 seconds to prevent cleanup issues
    // Clean up file after 5 seconds
    setTimeout(() => {
      try {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          console.log(`✅ Cleanup: ${filePath} deleted`);
        }
      } catch (err) {
        console.error(`❌ Cleanup failed: ${filePath}`, err);
      }
    }, 5000)

  } catch (error) {
    console.error('Error:', error.message)
    throw `Gagal download audionya Sayang 😢: ${error.message}`
  }
}

handler.help = ['play audio <query>', 'play video <query>', 'play all <query>']
handler.tags = ['downloader']
handler.command = /^(play)$/i

handler.limit = 8
handler.register = true
handler.disable = false

export default handler
