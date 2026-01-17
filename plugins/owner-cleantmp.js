import { tmpdir } from 'os'
import path, { join } from 'path'
import { readdirSync, statSync, unlinkSync, existsSync } from 'fs'

let handler = async (m, { conn, usedPrefix, __dirname }) => {
    const tmpDirs = [
        tmpdir(),
        join(__dirname, '../tmp'),
        join(__dirname, 'tmp')
    ]

    let totalDeleted = 0
    let totalSize = 0

    for (const tmpDir of tmpDirs) {
        try {
            if (!existsSync(tmpDir)) continue

            const files = readdirSync(tmpDir)
            let deleted = 0
            let size = 0

            for (const file of files) {
                const filePath = join(tmpDir, file)

                try {
                    const stats = statSync(filePath)
                    if (stats.isFile()) {
                        unlinkSync(filePath)
                        deleted++
                        size += stats.size
                    }
                } catch (err) {
                    console.error(`Error deleting ${filePath}:`, err)
                }
            }

            totalDeleted += deleted
            totalSize += size

            console.log(`🧹 Cleaned ${tmpDir}: ${deleted} files (${(size / 1024 / 1024).toFixed(2)} MB)`)
        } catch (err) {
            console.error(`Error cleaning ${tmpDir}:`, err)
        }
    }

    const sizeText = totalSize > 0 ? ` (${(totalSize / 1024 / 1024).toFixed(2)} MB)` : ''
    m.reply(`✅ *TMP CLEANUP SELESAI*\n\n🗂️ Files terhapus: ${totalDeleted}${sizeText}\n⏰ Next auto-cleanup: 30 menit lagi`)

    // React success
    await conn.sendMessage(m.chat, { react: { text: '🧹', key: m.key } })
}

handler.help = ['cleantmp']
handler.tags = ['owner']
handler.command = /^(cleantmp|cleantemp|clean)$/i
handler.owner = true

export default handler