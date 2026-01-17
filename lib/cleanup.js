// Auto cleanup tmp files older than 1 hour
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const tmpDir = path.join(__dirname, 'tmp')

function cleanupTmp() {
  try {
    if (!fs.existsSync(tmpDir)) return

    const files = fs.readdirSync(tmpDir)
    const now = Date.now()
    const oneHour = 60 * 60 * 1000

    let deletedCount = 0
    for (const file of files) {
      const filePath = path.join(tmpDir, file)
      const stats = fs.statSync(filePath)

      // Delete files older than 1 hour
      if (now - stats.mtime.getTime() > oneHour) {
        fs.unlinkSync(filePath)
        deletedCount++
      }
    }

    if (deletedCount > 0) {
      console.log(`🧹 Cleanup: ${deletedCount} old files deleted from tmp`)
    }
  } catch (err) {
    console.error('❌ Cleanup error:', err)
  }
}

// Run cleanup every 30 minutes
setInterval(cleanupTmp, 30 * 60 * 1000)

// Run cleanup on startup
cleanupTmp()

export default cleanupTmp