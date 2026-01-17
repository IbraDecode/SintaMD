import axios from 'axios'

let handler = async (m, { conn }) => {
    let quoted = m.quoted;
    let mime = quoted?.mimetype || quoted?.mime;
    if (!quoted) return m.reply('Reply gambar dengan caption .toprompt');
    if (!/image/.test(mime)) return m.reply('Reply gambar dengan gambar!');

    m.reply('Sedang menganalisis gambar...');

    try {
        let buffer = await quoted.download();

        let form = new FormData();
        form.append('image', buffer, { filename: 'image.jpg' });

        let { data } = await axios.post('https://api.termai.cc/api/img2txt/describe', form, {
            headers: form.getHeaders()
        });

        if (!data || !data.description) return m.reply('Gagal menganalisis gambar.');

        m.reply(`Prompt dari gambar:\n\n${data.description}`);

    } catch (err) {
        console.log(err);
        m.reply('Terjadi kesalahan saat analisis gambar.');
    }
}

handler.help = ['toprompt']
handler.tags = ['ai']
handler.command = /^(toprompt)$/i

handler.limit = 3
handler.register = true

export default handler