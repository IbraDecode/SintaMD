let handler = async (m, { conn, command, isOwner }) => {
  if (!isOwner) return m.reply('Owner only!')
  let status = true
  if (command === 'self' || command === 'tidur' || command === 'bobo') status = false
  conn.public = status
  m.reply(`Berhasil mengganti ke mode *${command}*`)
}

handler.help = ['public', 'self', 'tidur', 'bangun', 'bobo']
handler.tags = ['owner']
handler.command = /^(public|self|tidur|bangun|bobo)$/i
handler.owner = true

export default handler