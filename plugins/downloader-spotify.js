import axios from 'axios'

/* ===============================
   SPOTIFY OFFICIAL CONFIG
================================ */

const CLIENT_ID = "bfcffccc6ed4441b965cd81b10ddb561";
const CLIENT_SECRET = "311427216ab64de1b3c0150ea43fd2c4";

let accessToken = null;
let tokenExpire = 0;

/**
 * Ambil / refresh token Spotify otomatis
 */
async function getAccessToken() {
  if (accessToken && Date.now() < tokenExpire) {
    return accessToken;
  }

  const res = await axios.post(
    "https://accounts.spotify.com/api/token",
    "grant_type=client_credentials",
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization":
          "Basic " +
          Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64"),
      },
    }
  );

  accessToken = res.data.access_token;
  tokenExpire = Date.now() + res.data.expires_in * 1000;

  return accessToken;
}

/**
 * ===============================
 * Spotify Search (OFFICIAL API)
 * ===============================
 */
async function spotifySearchV1(query, limit = 10) {
  try {
    const token = await getAccessToken();

    const res = await axios.get(
      "https://api.spotify.com/v1/search",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          q: query,
          type: "track",
          limit,
        },
      }
    );

    return res.data.tracks.items.map(track => ({
      id: track.id,
      title: track.name,
      artist: track.artists.map(a => a.name).join(", "),
      album: track.album.name,
      duration_ms: track.duration_ms,
      preview_url: track.preview_url,
      spotify_url: track.external_urls.spotify,
      image: track.album.images[0]?.url
    }));
  } catch (e) {
    return { error: e.response?.data || e.message };
  }
}

/* ===============================
   SPOTIFY DOWNLOAD (UNCHANGED)
================================ */
async function spotifyDl(spotifyUrl) {
  return {
    download_url: `https://spotdown.org/api/direct-download?url=${spotifyUrl}`
  };
}

let handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!args[0]) throw `Please provide a Spotify URL or search query\n\n*Example:*\n${usedPrefix}${command} https://open.spotify.com/track/...\n${usedPrefix}${command} search <query>`;

    await m.react('🕓')

    try {
        const isSearch = args[0] === 'search';
        const input = isSearch ? args.slice(1).join(' ') : args[0];

        if (!input) throw 'Please provide a query for search';

        if (isSearch) {
            // Search mode
            const results = await spotifySearchV1(input, 5);
            if (!results || results.error) throw 'Search failed';

            let caption = `*🎵 SPOTIFY SEARCH RESULTS*\n\n`;
            results.forEach((track, i) => {
                caption += `*${i + 1}.* ${track.title}\n`;
                caption += `🎤 *Artist:* ${track.artist}\n`;
                caption += `💽 *Album:* ${track.album}\n`;
                caption += `⏱️ *Duration:* ${Math.floor(track.duration_ms / 60000)}:${String(Math.floor((track.duration_ms % 60000) / 1000)).padStart(2, '0')}\n`;
                caption += `🔗 ${track.spotify_url}\n\n`;
            });

            caption += `📝 Reply with the number to download\nExample: reply "1" to download track 1`;

            const sentMsg = await m.reply(caption);
            conn.spotifySearchResults = conn.spotifySearchResults || {};
            conn.spotifySearchResults[sentMsg.key.id] = results;

        } else {
            // Download mode
            const result = await spotifyDl(input);

            if (!result.download_url) throw 'No download URL available';

            // Get track info from URL
            const trackId = input.split('/').pop().split('?')[0];
            const token = await getAccessToken();

            let trackInfo = null;
            try {
                const trackRes = await axios.get(`https://api.spotify.com/v1/tracks/${trackId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const track = trackRes.data;
                trackInfo = {
                    title: track.name,
                    artist: track.artists.map(a => a.name).join(", "),
                    album: track.album.name,
                    duration: `${Math.floor(track.duration_ms / 60000)}:${String(Math.floor((track.duration_ms % 60000) / 1000)).padStart(2, '0')}`,
                    released: track.album.release_date,
                    image: track.album.images[0]?.url
                };
            } catch (e) {
                trackInfo = { title: 'Unknown', artist: 'Unknown', album: 'Unknown' };
            }

            let caption = `
🎵 *Spotify Downloader*

📌 *Title:* ${trackInfo.title}
🎤 *Artist:* ${trackInfo.artist}
💽 *Album:* ${trackInfo.album}
⏱️ *Duration:* ${trackInfo.duration}
🎧 *Released:* ${trackInfo.released || 'Unknown'}

*Downloading...*
            `.trim();

            m.reply(caption);

            await conn.sendFile(m.chat, result.download_url, 'spotify.mp3', '', m, null, { mimetype: 'audio/mpeg' });
        }
    } catch (error) {
        console.error('Handler Error:', error);
        m.reply(`An error occurred: ${error.message}`, m);
    }
};

handler.help = ['spotify'].map(v => v + ' <url/search>');
handler.tags = ['downloader'];
handler.command = /^(spotify)$/i;

handler.limit = 2
handler.register = true

export default handler

// Reply handler for search results
conn.ev.on('messages.upsert', async (m) => {
    if (!m.messages) return;

    const msg = m.messages[0];
    if (!msg.message || msg.key.fromMe) return;

    const text = msg.message.conversation || msg.message.extendedTextMessage?.text;
    if (!text) return;

    const isReply = msg.message.extendedTextMessage?.contextInfo?.quotedMessage;
    if (!isReply) return;

    const quotedKey = msg.message.extendedTextMessage.contextInfo.stanzaId;

    if (conn.spotifySearchResults && conn.spotifySearchResults[quotedKey]) {
        const results = conn.spotifySearchResults[quotedKey];
        const num = parseInt(text.trim());

        if (isNaN(num) || num < 1 || num > results.length) {
            return msg.reply('Invalid number. Please reply with a valid number (1-' + results.length + ')');
        }

        const selectedTrack = results[num - 1];

        try {
            msg.react('🕓');

            const result = await spotifyDl(selectedTrack.spotify_url);

            if (!result.download_url) throw 'No download URL available';

            let caption = `
🎵 *Spotify Downloader*

📌 *Title:* ${selectedTrack.title}
🎤 *Artist:* ${selectedTrack.artist}
💽 *Album:* ${selectedTrack.album}
⏱️ *Duration:* ${Math.floor(selectedTrack.duration_ms / 60000)}:${String(Math.floor((selectedTrack.duration_ms % 60000) / 1000)).padStart(2, '0')}

*Downloading...*
            `.trim();

            msg.reply(caption);

            await conn.sendFile(msg.chat, result.download_url, 'spotify.mp3', '', msg, null, { mimetype: 'audio/mpeg' });

            // Clean up
            delete conn.spotifySearchResults[quotedKey];

        } catch (error) {
            msg.reply(`Error downloading: ${error.message}`);
        }
    }
});
