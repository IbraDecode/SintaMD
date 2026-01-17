import { execSync } from 'child_process'
import fs from 'fs'

let handler = async (m, { conn, isOwner }) => {
    if (!isOwner) return m.reply('Khusus owner!')
    
    try {
        m.reply('Memulai update...')

        // Git pull
        execSync('git pull origin main', { stdio: 'inherit' })

        // Cek jika package.json berubah, npm install
        if (fs.existsSync('package-lock.json')) {
            execSync('npm install', { stdio: 'inherit' })
        }

        m.reply('Update selesai. Bot akan restart dalam 5 detik...')
        
        // Restart
        setTimeout(() => {
            process.exit(0) // Restart via cluster atau pm2
        }, 5000)

    } catch (e) {
        m.reply('Error update: ' + e.message)
    }
}

handler.help = ['update']
handler.tags = ['owner']
handler.command = /^(update|up)$/i
handler.owner = true

export default handler