import axios from 'axios'

let handler = async (m, { conn, text, command, usedPrefix }) => {
    if (!text) return m.reply(`Gunakan format ${usedPrefix + command} <url>\n\n*Contoh :* ${usedPrefix + command} https://github.com/ShirokamiRyzen`);


    await m.react('🕓')

    if (!text.startsWith('https://') && !text.startsWith('http://')) {
        text = 'https://' + text;
    }

    const ssweb = async (url, type) => {
        try {
            let apiUrl = `https://api.zenitsu.web.id/api/tools/ssweb?url=${encodeURIComponent(url)}&type=${type}&full=full`;
            console.log('Requesting:', apiUrl);
            let response = await axios.get(apiUrl, {
                responseType: 'arraybuffer',
                timeout: 30000
            });
            console.log('Response status:', response.status, 'Size:', response.data.length);
            return response.data;
        } catch (err) {
            console.error('SSWeb error:', err.message);
            return null;
        }
    };

    let type = 'mobile'; // default mobile
    let url = text;

    if (text.includes(' ')) {
        let [arg1, arg2] = text.split(' ');
        if (arg1 === 'desktop' || arg1 === 'mobile') {
            type = arg1;
            url = arg2;
        } else {
            url = text;
        }
    }

    let screenshot = await ssweb(url, type);
    if (!screenshot) {
        return m.reply("Gagal mengambil screenshot. Pastikan URL valid atau coba lagi nanti.");
    }

    let res = `Screenshot untuk ${text}`;

    await conn.sendMessage(m.chat, {
        image: screenshot,
        caption: res
    }, { quoted: m });
};

handler.help = ['ssweb <url>', 'ssweb desktop <url>', 'ssweb mobile <url>'];
handler.tags = ['internet'];
handler.command = /^(ssweb)$/i;

handler.limit = 1
handler.register = true

export default handler
