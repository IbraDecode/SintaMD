import { tmpdir } from 'os'
import { writeFile, unlink } from 'fs/promises'
import { join } from 'path'
import axios from 'axios'
import FormData from 'form-data'

/* Ambil buffer dari url */
async function getBuffer(url) {
  const res = await axios.get(url, { responseType: "arraybuffer" });
  return Buffer.from(res.data);
}

/* Fungsi removeBg, jangan ubah header sama sekali */
async function removeBg(buffer, filename = "image.jpg") {
  const data = new FormData();

  // Bisa pakai buffer langsung atau fs.readFileSync
  data.append('image', buffer, { filename });

  data.append('format', 'png');
  data.append('model', 'v1');

  const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args))

  const options = {
    method: 'POST',
    headers: {
      ...data.getHeaders(),
      'User-Agent': 'Mozilla/5.0 (Linux; Android 15; 23124RA7EO Build/AQ3A.240829.003) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.7444.174 Mobile Safari/537.36',
      'Accept': 'application/json, text/plain, */*',
      'Accept-Encoding': 'gzip, deflate, br, zstd',
      'sec-ch-ua-platform': '"Android"',
      'sec-ch-ua': '"Chromium";v="142", "Android WebView";v="142", "Not_A Brand";v="99"',
      'sec-ch-ua-mobile': '?1',
      'x-client-version': 'web:pixelcut.ai:b8e5154f',
      'x-locale': 'id',
      'origin': 'https://www.pixelcut.ai',
      'x-requested-with': 'mark.via.gp',
      'sec-fetch-site': 'cross-site',
      'sec-fetch-mode': 'cors',
      'sec-fetch-dest': 'empty',
      'referer': 'https://www.pixelcut.ai/',
      'accept-language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
      'priority': 'u=1, i'
    },
    body: data,
  };

  return fetch('https://api2.pixelcut.app/image/matte/v1', options)
    .then(res => res.arrayBuffer())
    .then(buf => Buffer.from(buf))
    .catch(err => ({ error: err.message }));
}

let handler = async (m, { conn, usedPrefix }) => {
    try {
        await m.react('🕓')

        let q = m.quoted ? m.quoted : m;
        let mime = (q.msg || q).mimetype || '';
        if (!mime || !mime.startsWith('image/')) throw `Kirim/Reply Gambar dengan caption ${usedPrefix}removebg`;

        let media = await q.download();
        let image = await removeBg(media, "image.jpg");

        if (!image || image.error) {
            throw new Error(image.error || "Gagal remove background");
        }

        await conn.sendFile(m.chat, image, 'removedbg.png', global.wm, m);
    } catch (error) {
        m.reply(`Error: ${error.message}`);
    }
};

handler.help = ['removebg'];
handler.tags = ['ai'];
handler.command = /^(removebg)$/i;

handler.register = true
handler.limit = 3

export default handler
