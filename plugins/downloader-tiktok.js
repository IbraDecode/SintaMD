import axios from 'axios'

// ============================
//     FUNCTION TIKTOK DL (TikWM)
// ============================
async function tiktok(query) {
  try {
    const encodedParams = new URLSearchParams();
    encodedParams.set("url", query);
    encodedParams.set("hd", "1");

    const response = await axios({
      method: "POST",
      url: "https://tikwm.com/api/",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        Cookie: "current_language=en",
        "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36",
      },
      data: encodedParams,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

let handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0])
    throw `[❗] Contoh: ${usedPrefix + command} https://www.tiktok.com/@m4uryy/video/7350083403556883745\n\natau\n\n${usedPrefix + command} https://v.douyin.com/i5GhvkBY/`

  await m.react('🕓')

  try {
    // Use TikWM for all platforms
    const result = await tiktok(args[0])
    if (!result || !result.data) throw "Gagal mendownload video!"

    const videoInfo = result.data
    const isDouyin = args[0].includes("douyin")
    
    let videoURL, info
    
    if (isDouyin) {
      const hdURL = videoInfo.nwm_video_url_HQ
      videoURL = args[1] === "hd" && hdURL ? hdURL : videoInfo.nwm_video_url
      const uploadTime = new Date(videoInfo.create_time * 1000).toLocaleString()
      const author = videoInfo.author || {}
      const authorId = author.unique_id || author.short_id || "unknown"
      info = `Judul: ${result.desc}\nUpload: ${uploadTime}\n\nUploader: ${author.nickname || "unknown"}\n(${authorId} - https://www.douyin.com/user/${authorId})\nSound: ${result.music?.author || ""}\n`
    } else {
      const hdURL = videoInfo.hdplay
      videoURL = args[1] === "hd" && hdURL ? hdURL : videoInfo.play
      const author = videoInfo.author || {}
      info = `Judul: ${videoInfo.title}\nUpload: ${videoInfo.create_time}\n\nSTATUS:\n=====================\nLike = ${videoInfo.digg_count}\nKomen = ${videoInfo.comment_count}\nShare = ${videoInfo.share_count}\nViews = ${videoInfo.play_count}\nSimpan = ${videoInfo.download_count}\n=====================\n\nUploader: ${author.nickname || "unknown"}\n(${author.unique_id || "unknown"} - https://www.tiktok.com/@${author.unique_id || "unknown"})\nSound: ${videoInfo.music}\n`
    }

    // Check for images (photo slideshow)
    if (videoInfo.images?.length > 0) {
      // Send images
      for (let i = 0; i < videoInfo.images.length; i++) {
        const caption = i === 0 ? `Ini kak gambar ${i + 1}\n\n${info}` : `Ini kak gambar ${i + 1}`
        await conn.sendFile(m.chat, videoInfo.images[i], `image${i + 1}.jpg`, caption, m)
      }
    } else if (videoURL) {
      // Send video
      await conn.sendFile(m.chat, videoURL, isDouyin ? "douyin.mp4" : "tiktok.mp4", `Ini kak videonya\n\n${info}`, m)
    } else {
      throw "Tidak ada tautan video yang tersedia."
    }
  } catch (error) {
    conn.reply(m.chat, `Error: ${error}`, m)
  }
}

handler.help = ['tiktok']
handler.tags = ['downloader']
handler.command = /^(tt|ttdl|douyin|tiktok(dl)?)$/i;

handler.disable = false
handler.register = true
handler.limit = true

export default handler