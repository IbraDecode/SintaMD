import axios from 'axios'
import { load } from 'cheerio'
import vm from 'vm'
import { URLSearchParams } from 'url'

// ============================
//     FUNCTION INSTAGRAM DL
// ============================
async function savegram(url) {
  if (!url) throw new Error('Hayyaaa Yang Bener Laa Url tak ade, Nak download ape ha?');

  const payload = new URLSearchParams({
    url,
    action: 'post',
    lang: 'id',
  });

  const { data: obfuscatedScript } = await axios({
    method: 'post',
    url: 'https://savegram.info/action.php',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'User-Agent': 'Mozilla/5.0',
      'Referer': 'https://savegram.info/id',
    },
    data: payload.toString(),
  });

  if (typeof obfuscatedScript !== 'string') throw new Error('Amboy Aneh kali lah, Script tak ade');

  let capturedHtml = '';
  const context = {
    window: { location: { hostname: 'savegram.info' } },
    pushAlert: () => {},
    gtag: () => {},
    document: {
      getElementById: (id) => {
        if (id === 'div_download') {
          return {
            set innerHTML(html) {
              capturedHtml = html;
            },
          };
        }
        return { style: {}, remove: () => {} };
      },
      querySelector: () => ({ classList: { remove: () => {} } }),
    },
  };

  vm.createContext(context);
  const script = new vm.Script(obfuscatedScript);
  script.runInContext(context);

  if (!capturedHtml) throw new Error('Hayaa, takde html nya maa:)');

  const $ = load(capturedHtml);
  const out = [];

  $('.download-items').each((_, el) => {
    const item = $(el);
    const thumbnail = item.find('img').attr('src');
    const btn = item.find('.download-items__btn a');
    const url_download = btn.attr('href');
    const kualitas = btn.text().trim() || 'standar kaya muka lu';

    if (url_download) {
                console.log('URL:', url_download); // Debug log
                let isVideo = false;
                
                // Try to decode token to check actual filename
                if (url_download.includes('token=')) {
                    try {
                        const tokenPart = url_download.split('token=')[1].split('&')[0];
                        const decoded = JSON.parse(Buffer.from(tokenPart.split('.')[1], 'base64').toString());
                        const filename = decoded.filename || '';
                        console.log('Decoded filename:', filename); // Debug log
                        isVideo = filename.includes('.mp4') || filename.includes('video');
                    } catch (e) {
                        // Fallback to basic detection
                        isVideo = url_download.includes('.mp4') || url_download.includes('video');
                    }
                } else {
                    isVideo = url_download.includes('.mp4') || 
                             url_download.includes('video') || 
                             url_download.includes('reel') ||
                             (kualitas && kualitas.toLowerCase().includes('video'));
                }
                
                console.log('Detected type:', isVideo ? 'video' : 'image'); // Debug log
                out.push({ thumbnail, kualitas, url_download, type: isVideo ? 'video' : 'image' });
            }
  });

  if (!out.length) throw new Error('Waduh url download nya takde lah, jatuh kat jalan kek nya');

  return out;
}

let handler = async (m, { conn, args }) => {
    if (!args[0]) throw 'Please provide an Instagram media URL';
    const sender = m.sender.split('@')[0];
    const url = args[0];

    await m.react('🕓')

    try {
        // Use our own Instagram function
        const mediaData = await savegram(url);
        
        let first = true;

        for (const item of mediaData) {
            try {
                const mediaUrl = item.url_download;
                console.log('Processing URL:', mediaUrl); // Debug log
                let type = 'image';
                if (item.type) {
                    type = item.type;
                } else if (mediaUrl.includes('token=')) {
                    try {
                        const tokenPart = mediaUrl.split('token=')[1].split('&')[0];
                        const decoded = JSON.parse(Buffer.from(tokenPart.split('.')[1], 'base64').toString());
                        const filename = decoded.filename || '';
                        console.log('Decoded filename for send:', filename); // Debug log
                        type = filename.includes('.mp4') || filename.includes('video') ? 'video' : 'image';
                    } catch (e) {
                        type = 'image'; // Default to image if decode fails
                    }
                } else {
                    type = (mediaUrl.includes('.mp4') || mediaUrl.includes('video') || mediaUrl.includes('reel')) ? 'video' : 'image';
                }
                console.log('Final detected type:', type); // Debug log
                const caption = first ? `Ini kak @${sender}` : '';
                first = false;

                if (type === 'video') {
                    await conn.sendMessage(
                        m.chat,
                        {
                            video: { url: mediaUrl },
                            mimetype: 'video/mp4',
                            fileName: 'video.mp4',
                            caption,
                            mentions: [m.sender],
                        },
                        { quoted: m }
                    );
                } else if (type === 'image') {
                    await conn.sendMessage(
                        m.chat,
                        {
                            image: { url: mediaUrl },
                            caption,
                            mentions: [m.sender],
                        },
                        { quoted: m }
                    );
                } else {
                    try {
                        await conn.sendMessage(
                            m.chat,
                            { image: { url: mediaUrl }, caption, mentions: [m.sender] },
                            { quoted: m }
                        );
                    } catch {
                        await conn.sendMessage(
                            m.chat,
                            { video: { url: mediaUrl }, mimetype: 'video/mp4', fileName: 'video.mp4', caption, mentions: [m.sender] },
                            { quoted: m }
                        );
                    }
                }
            } catch (error) {
                console.error('Error sending media:', error);
                await conn.reply(m.chat, `Gagal mengirim media: ${error.message}`, m);
            }
        }
    } catch (error) {
        console.error('Handler Error:', error);
        conn.reply(m.chat, `An error occurred: ${error.message}`, m);
    }
}

handler.help = ['ig'].map(v => v + ' <url>');
handler.tags = ['downloader'];
handler.command = /^(ig(dl)?)$/i;

handler.limit = true
handler.register = true

export default handler
