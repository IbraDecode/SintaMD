import axios from 'axios'
import FormData from 'form-data'

let handler = async (m, { conn, usedPrefix }) => {
    try {
        await m.react('🕓')
        let q = m.quoted ? m.quoted : m;
        let mime = (q.msg || q).mimetype || '';
        if (!mime) throw `Kirim/Reply Gambar dengan caption ${usedPrefix}toprompt`;

        let media = await q.download();

        let form = new FormData();
        form.append('image', media, { filename: 'image.jpg' });

        let { data } = await axios.post('https://api.termai.cc/api/img2txt/describe?apikey=jagojago', form, {
            headers: form.getHeaders()
        });

        if (!data || !data.description) throw 'Gagal menganalisis gambar.';

        await conn.sendMessage(m.chat, { text: `Prompt dari gambar:\n\n${data.description}` }, { quoted: m });
    } catch (error) {
        m.reply(`Error: ${error}`);
    }
};

handler.help = ['toprompt'];
handler.tags = ['ai'];
handler.command = /^(toprompt|img2txt)$/i;

handler.register = true
handler.limit = 5

export default handler
