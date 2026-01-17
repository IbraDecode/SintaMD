import axios from 'axios'
import FormData from 'form-data'

let handler = async (m, { conn }) => {
    let quoted = m.quoted;
    let mime = quoted?.mimetype || quoted?.mime;
    console.log('Quoted:', quoted, 'Mime:', mime);
    if (!quoted) return m.reply('Reply gambar dengan caption .toreal');
    if (!/image/.test(mime)) return m.reply('Reply gambar dengan gambar!');

    m.reply('Sedang memproses gambar menjadi realistik...');

    try {
        // Download gambar
        let buffer = await quoted.download();

        // Upload ke qu.ax (supaya dapat link public untuk API)
        let form = new FormData();
        form.append("files[]", buffer, { filename: "image.jpg" });

        let up = await axios.post("https://qu.ax/upload.php", form, {
            headers: form.getHeaders()
        });

        if (!up.data.success) return m.reply("Gagal upload ke qu.ax");

        let imgUrl = up.data.files[0].url;

        // Kirim ke Stability AI img2img endpoint
        const apiKey = 'sk-OkBvToiPZQmJNlbrphYF55KQlS1ayrR3ZZJIUOl6rx2sbtjr';

        let payload = {
            init_image: imgUrl,
            prompt: "ultra realistic human face, photorealistic, highly detailed, natural skin texture, DSLR quality",
            cfg_scale: 7,
            strength: 0.4,
            samples: 1
        };

        let { data } = await axios.post('https://api.stability.ai/v2beta/stable-image-to-image', payload, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        if (!data.artifacts || data.artifacts.length === 0) return m.reply('Gagal mengubah gambar.');

        let outputUrl = data.artifacts[0].url;

        conn.sendMessage(m.chat, { image: { url: outputUrl }, caption: "Berikut hasil toreal realistiknya!" }, { quoted: m });

    } catch (err) {
        console.log(err.response?.data || err);
        m.reply('Terjadi kesalahan saat proses Stability AI.');
    }
}

handler.help = ['toreal']
handler.tags = ['ai']
handler.command = /^(toreal)$/i

handler.limit = 5
handler.register = true

export default handler