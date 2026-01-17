import axios from 'axios'
import FormData from 'form-data'

let handler = async (m, { conn, usedPrefix }) => {
    try {
        await m.react('🕓')
        let q = m.quoted ? m.quoted : m;
        let mime = (q.msg || q).mimetype || '';
        if (!mime) throw `Kirim/Reply Gambar dengan caption ${usedPrefix}toprompt`;

        let media = await q.download();

        // Upload to telegra.ph
        let form = new FormData();
        form.append('file', media, 'image.jpg');
        let uploadRes = await axios.post('https://telegra.ph/upload', form, {
            headers: form.getHeaders()
        });
        let url = 'https://telegra.ph' + uploadRes.data[0].src;

        await new Promise(resolve => setTimeout(resolve, 2000)); // Delay 2s to avoid rate limit

        let { data } = await axios.post('https://imagetoprompt.org/api/describe/generate', {
            image: url,
            model: 'gpt-4-vision-preview',
            language: 'english'
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
