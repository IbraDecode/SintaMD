import { exec } from 'child_process'

let handler = async (m, { conn }) => {
  m.reply('Membuat backup project...')

  exec('zip -r Ryzumi-ESM-Backup.zip . --exclude=node_modules/** --exclude=.npm/** --exclude=sessions/** --exclude=*.log --exclude=*.tmp', (error, stdout, stderr) => {
    if (error) {
      m.reply(`Error: ${error.message}`)
      return
    }
    if (stderr) {
      console.log(`Stderr: ${stderr}`)
    }
    console.log(`Stdout: ${stdout}`)
    
    conn.sendFile(m.chat, './Ryzumi-ESM-Backup.zip', 'Ryzumi-ESM-Backup.zip', 'Backup project berhasil dibuat.', m)
    exec('rm Ryzumi-ESM-Backup.zip')
  })
}

handler.help = ['backup']
handler.tags = ['owner']
handler.command = /^(backup)$/i
handler.owner = true

export default handler