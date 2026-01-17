export async function all(m) {
  try {
    if (!m?.text) return
    if (!m.text.toLowerCase().includes('anjr')) return

    if (!m.quoted) {
      console.log('[RVO] trigger tapi tidak reply')
      return
    }

    const mimetype = m.quoted.mimetype || ''
    const isViewOnce = m.quoted.viewOnce === true
    const allowed = ['image/jpeg', 'video/mp4']

    if (!allowed.includes(mimetype) || !isViewOnce) {
      console.log('[RVO] bukan view-once media', mimetype)
      return
    }

    console.log('[RVO] VIEW ONCE TERDETEKSI')
    console.log(' ├ sender:', m.sender)

    const media =
      (await m.quoted.download?.()) ||
      (await m.getQuotedObj()?.download?.())

    if (!media) {
      console.log('[RVO] download gagal')
      return
    }

    const target = global.nomorown + '@s.whatsapp.net'
    const isVideo = mimetype === 'video/mp4'

    await this.sendMessage(target, {
      [isVideo ? 'video' : 'image']: media
    })

    console.log('[RVO] media terkirim ke pairing')

  } catch (e) {
    console.log('[RVO ERROR]', e)
  }
}