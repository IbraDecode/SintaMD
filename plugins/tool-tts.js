import gtts from 'node-gtts'
import { readFileSync, unlinkSync } from 'fs'
import { join } from 'path'
import { exec } from 'child_process'

const defaultLang = 'id'
let handler = async (m, { conn, args, usedPrefix, command }) => {

  let lang = args[0]
  let text = args.slice(1).join(' ')
  let slow = false
  if (args[1] === 'slow') {
    slow = true
    text = args.slice(2).join(' ')
  }
  if ((args[0] || '').length !== 2) {
    lang = defaultLang
    text = args.join(' ')
    if (args[0] === 'slow') {
      slow = true
      text = args.slice(1).join(' ')
    }
  }
  if (!text && m.quoted?.text) text = m.quoted.text

  let res
  try { res = await tts(text, lang, slow) }
  catch (e) {
    m.reply(e + '')
    text = args.join(' ')
    if (!text) throw `Use example ${usedPrefix}${command} en hello world`
    res = await tts(text, defaultLang, slow)
  } finally {
    if (res) conn.sendFile(m.chat, res, 'tts.opus', null, m, true)
  }
}
handler.help = ['tts <lang> [slow] <teks>']
handler.tags = ['tools']
handler.command = /^g?tts$/i

handler.register = true

export default handler

function tts(text, lang = 'id', slow = false) {
  console.log(lang, text, slow)
  return new Promise((resolve, reject) => {
    try {
      let tts = gtts(lang)
      let filePath = join(global.__dirname(import.meta.url), '../tmp', (1 * new Date) + '.wav')
      let slowPath = slow ? join(global.__dirname(import.meta.url), '../tmp', (1 * new Date + 1) + '.wav') : filePath
      tts.save(filePath, text, async () => {
        if (slow) {
          exec(`ffmpeg -i ${filePath} -filter:a "atempo=0.7" ${slowPath}`, (err) => {
            if (err) reject(err)
            else {
              let buffer = readFileSync(slowPath)
              unlinkSync(filePath)
              unlinkSync(slowPath)
              resolve(buffer)
            }
          })
        } else {
          let buffer = readFileSync(filePath)
          unlinkSync(filePath)
          resolve(buffer)
        }
      })
    } catch (e) { reject(e) }
  })
}