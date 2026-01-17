import fetch from 'node-fetch'

let lastRelease = null

// Cek update saat bot start
setInterval(async () => {
    try {
        let res = await fetch('https://api.github.com/repos/IbraDecode/SintaMD/releases/latest')
        if (!res.ok) return

        let release = await res.json()
        let { tag_name, body, html_url } = release

        if (lastRelease !== tag_name) {
            lastRelease = tag_name

            let msg = `*UPDATE OTOMATIS SintaMD*\n\n` +
                      `Versi Baru: ${tag_name}\n` +
                      `Info: ${body}\n\n` +
                      `Link: ${html_url}\n\n` +
                      `Gunakan .update untuk update otomatis!`

            // Broadcast ke pairing number dan owner
            let targets = [global.pairing + '@s.whatsapp.net']
            global.owner.forEach(o => targets.push(o[0] + '@s.whatsapp.net'))

            for (let target of targets) {
                await global.conn.sendMessage(target, { text: msg }).catch(() => {})
            }
        }
    } catch (e) {
        console.log('Error auto check update:', e)
    }
}, 600000) // Cek setiap 10 menit

let handler = async (m, { conn, isOwner }) => {
    if (!isOwner) return m.reply('Khusus owner!')

    try {
        // Cek latest release di GitHub
        let res = await fetch('https://api.github.com/repos/IbraDecode/SintaMD/releases/latest')
        if (!res.ok) throw 'Gagal fetch release'

        let release = await res.json()
        let { tag_name, body, html_url } = release

        // Pesan broadcast
        let msg = `*UPDATE INFO SintaMD*\n\n` +
                  `Versi: ${tag_name}\n` +
                  `Info: ${body}\n\n` +
                  `Link: ${html_url}\n\n` +
                  `Gunakan .update untuk update otomatis!`

        // Broadcast ke pairing number dan owner
        let targets = [global.pairing + '@s.whatsapp.net']
        global.owner.forEach(o => targets.push(o[0] + '@s.whatsapp.net'))

        for (let target of targets) {
            await conn.sendMessage(target, { text: msg }).catch(() => {})
        }

        m.reply(`Broadcast update info ke ${chats.length} chat selesai!`)

    } catch (e) {
        m.reply('Error: ' + e)
    }
}

handler.help = ['broadcastupdate']
handler.tags = ['owner']
handler.command = /^(broadcastupdate|bcupdate)$/i
handler.owner = true

export default handler