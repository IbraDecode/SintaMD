let handler = async (m, { conn, text, args }) => {
  let method = text.toLowerCase().trim()
  if (!method) return m.reply('Usage: .pay <method>\nAvailable: qris/qr, dana, dana global pdana, gopay, ovo, atsd, atsg, atso')
  
  if (method === 'qris' || method === 'qr') {
    let anu = `Pembayaran via QRIS\nScan kode QR di atas untuk menyelesaikan pembayaran.\n\nContact Owner jika ada masalah.`
    await conn.sendFile(m.chat, './qris.png', '', anu, m)
  } else if (method === 'dana') {
    let anu = `Pembayaran via Dana\nNomor: ${global.pdana}\nAtas Nama: ${global.ats}\n\nTransfer ke nomor tersebut.`
    m.reply(anu)
  } else if (method === 'dana global pdana') {
    let anu = `Pembayaran via Dana Global QRIS\nScan kode QR di atas untuk menyelesaikan pembayaran.`
    await conn.sendFile(m.chat, './qris.png', '', anu, m)
  } else if (method === 'gopay') {
    let anu = `Pembayaran via GoPay\nNomor: ${global.pgopay}\nAtas Nama: ${global.ats}\n\nTransfer ke nomor tersebut.`
    m.reply(anu)
  } else if (method === 'ovo') {
    let anu = `Pembayaran via OVO\nNomor: ${global.povo}\nAtas Nama: ${global.ats}\n\nTransfer ke nomor tersebut.`
    m.reply(anu)
  } else if (method === 'atsd') {
    m.reply(`Ai Dedeh: ${global.atsd}`)
  } else if (method === 'atsg') {
    m.reply(`Ai Dedeh: ${global.atsg}`)
  } else if (method === 'atso') {
    m.reply(`Ai Dedeh: ${global.atso}`)
  } else {
    m.reply('Invalid method. Available: qris/qr, dana, dana global pdana, gopay, ovo, atsd, atsg, atso')
  }
}

handler.help = ['pay']
handler.tags = ['main']
handler.command = /^(pay)$/i

export default handler