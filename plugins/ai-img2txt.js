import axios from 'axios'
import FormData from 'form-data'

let handler = async (m, { conn, usedPrefix }) => {
    try {
        await m.react('🕓')
        let q = m.quoted ? m.quoted : m;
        let mime = (q.msg || q).mimetype || '';
        if (!mime) throw `Kirim/Reply Gambar dengan caption ${usedPrefix}toprompt`;

        let media = await q.download();
        let url = await uploadPomf(media);

        await new Promise(resolve => setTimeout(resolve, 2000)); // Delay 2s to avoid rate limit

        let { data } = await axios.get(`https://api.termai.cc/api/img2txt/describe?apikey=jagojago&url=${encodeURIComponent(url)}`);

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
