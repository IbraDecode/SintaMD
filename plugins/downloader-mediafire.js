import axios from 'axios'

// ============================
//     FUNCTION MEDIAFIRE DL
// ============================
const mfdl = async function (mfUrl) {
    const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args))
    
    const r = await fetch(mfUrl, {
        headers: {
            "accept-encoding": "gzip, deflate, br, zstd"
        }
    });

    if (!r.ok) throw Error(`${r.status} ${r.statusText}`);

    const html = await r.text();
    const url = html.match(/href="(.+?)" +id="downloadButton"/)?.[1];
    if (!url) throw Error(`Gagal menemukan match url`);

    const ft_m = html.match(/class="filetype"><span>(.+?)<(?:.+?) \((.+?)\)/);
    const fileType = `${ft_m?.[1] || '(no ext)'} ${ft_m?.[2] || '(no ext)'}`;

    const d_m = html.match(/<div class="description">(.+?)<\/div>/s)?.[1];
    const titleExt = d_m?.match(/subheading">(.+?)</)?.[1] || '(no title extension)';
    const descriptionExt = d_m?.match(/<p>(.+?)<\/p>/)?.[1] || '(no about extension)';

    const fileSize = html.match(/File size: <span>(.+?)<\/span>/)?.[1] || '(no file size)';
    const uploaded = html.match(/Uploaded: <span>(.+?)<\/span>/)?.[1] || '(no date)';
    const fileName = html.match(/class="filename">(.+?)<\/div>/)?.[1] || '(no file name)';

    return { fileName, fileSize, url, uploaded, fileType, titleExt, descriptionExt };
};

let handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!args[0]) throw `Gunakan contoh: ${usedPrefix}${command} https://www.mediafire.com/file/in5j3u2zwoq1x33/BLUR_BLUR_ASIK.zip/file`;

    await m.react('🕓')

    try {
        // Use our own Mediafire function
        let result = await mfdl(args[0]);
        
        if (!result || !result.url) throw 'Gagal mengambil link download. Coba lagi nanti.';

        m.reply(`
📁 *Nama File:* ${result.fileName}
📦 *Ukuran:* ${result.fileSize}
📅 *Upload:* ${result.uploaded}
📋 *Tipe:* ${result.fileType}
📝 *Deskripsi:* ${result.titleExt}
`.trim());
        
        await conn.sendFile(m.chat, result.url, result.fileName, '', m, null, { asDocument: true });
    } catch (e) {
        throw 'Terjadi kesalahan: ' + (e?.message || e);
    }
};

handler.help = ['mediafire'].map(v => v + ' <url>');
handler.tags = ['downloader'];
handler.command = /^(mediafire|mf)$/i;
handler.limit = true
handler.register = true

export default handler
