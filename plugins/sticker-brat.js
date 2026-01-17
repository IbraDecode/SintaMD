import axios from 'axios'

let handler = async (m, { conn, command, text }) => {
  if (!text || !text.trim()) throw 'Masukkan teks yang valid!'

  try {
    // Format teks untuk API (encode)
    const query = encodeURIComponent(text.trim())
    
    // Tentukan endpoint berdasarkan command
    let url
    if (/vid|video/i.test(command)) {
      url = `https://aine-apis.vercel.app/imagecreator/bratvid?apikey=free&text=${query}`
    } else {
      url = `https://aine-apis.vercel.app/imagecreator/brat?apikey=free&text=${query}`
    }
    
    console.log('Fetching from URL:', url) // Debug log
    
    // Fetch data dari API
    const { data } = await axios.get(url, { 
      responseType: 'arraybuffer',
      timeout: 60000 // Timeout 60 detik (video butuh waktu lebih lama)
    })
    
    // Cek jika data valid
    if (!data || data.length === 0) {
      throw new Error('Data tidak ditemukan atau kosong')
    }
    
    console.log('Data received, size:', data.length, 'bytes') // Debug log
    
    // Untuk video (bratvid), konversi ke webp agar bisa jadi sticker animasi
    if (/vid|video/i.test(command)) {
      // Kirim sebagai sticker animasi (webp)
      await conn.sendSticker(m.chat, data, m, {
        packname: 'Brat Maker',
        author: text.trim()
      })
    } else {
      // Untuk gambar biasa, kirim sebagai sticker biasa
      await conn.sendSticker(m.chat, data, m, {
        packname: 'Brat Maker',
        author: text.trim()
      })
    }
    
  } catch (err) {
    console.error('Error details:', {
      message: err.message,
      code: err.code,
      response: err.response?.status
    })
    
    // Pesan error yang lebih informatif
    let errorMsg = 'Gagal membuat sticker. '
    
    if (err.response) {
      if (err.response.status === 404) {
        errorMsg = 'Endpoint API tidak ditemukan. Mungkin API sedang down.'
      } else if (err.response.status === 500) {
        errorMsg = 'Server API error. Silakan coba lagi nanti.'
      } else {
        errorMsg += `Status: ${err.response.status}`
      }
    } else if (err.code === 'ECONNABORTED') {
      errorMsg = 'Timeout: Server terlalu lama merespon. Coba lagi.'
    } else if (err.code === 'ENOTFOUND') {
      errorMsg = 'Tidak dapat menghubungi server API.'
    } else {
      errorMsg += err.message || 'Terjadi kesalahan tidak diketahui'
    }
    
    await m.reply(errorMsg)
  }
}

handler.help = ['brat', 'bratvid']
handler.tags = ['maker']
handler.command = /^(brat|brat(vid|video))$/i
handler.register = true
handler.limit = true

export default handler