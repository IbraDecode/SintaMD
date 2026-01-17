import axios from 'axios'
import FormData from 'form-data'

let handler = async (m, { conn, text }) => {
    if (!text) return m.reply('Format: .editimage <prompt>\nReply gambar yang ingin diedit');

    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || '';
    if (!/image/.test(mime)) return m.reply('Reply gambar!');

    m.reply('Sedang mengedit gambar...');

    try {
        let media = await q.download();
        let base64Image = media.toString('base64');

        // Edit with termai API
        let { data } = await axios.post('https://api.termai.cc/api/img2img/edit?key=jagojago', {
            image: base64Image,
            prompt: text
        });

        if (!data || !data.result) throw 'Gagal edit gambar.';

        await conn.sendMessage(m.chat, { image: { url: data.result }, caption: `Edited with prompt: ${text}` }, { quoted: m });

    } catch (err) {
        console.log(err);
        m.reply('Terjadi kesalahan saat edit gambar.');
    }
}

handler.help = ['editimage <prompt>']
handler.tags = ['ai']
handler.command = /^(editimage)$/i

handler.limit = 5
handler.register = true

export default handler