import * as baileys from "@whiskeysockets/baileys";
import crypto from "node:crypto";

async function groupStatus(conn, jid, content) {
    const {
        backgroundColor
    } = content;
    delete content.backgroundColor;

    const inside = await baileys.generateWAMessageContent(content, {
        upload: conn.waUploadToServer,
        backgroundColor
    });

    const messageSecret = crypto.randomBytes(32);

    const m = baileys.generateWAMessageFromContent(
        jid, {
            messageContextInfo: {
                messageSecret
            },
            groupStatusMessageV2: {
                message: {
                    ...inside,
                    messageContextInfo: {
                        messageSecret
                    }
                }
            }
        }, {}
    );

    await conn.relayMessage(jid, m.message, {
        messageId: m.key.id
    });
    return m;
}

const handler = async (m, {
    conn,
    prefix = ".",
    command
}) => {
    const quoted = m.quoted ? m.quoted : m;
    const mime = (quoted.msg || quoted).mimetype || "";

    const textToParse = m.text || m.body || "";
    const caption = textToParse.replace(
        new RegExp(`^\\${prefix}${command}\\s*`, "i"),
        ""
    ).trim();

    // Check for target parameter
    let targets = [];
    let targetParam = '';
    let actualCaption = caption;
    
    // Extract target parameter from caption
    const parts = caption.trim().split(' ');
    if (parts.length > 0) {
        const firstPart = parts[0].toLowerCase();
        if (['allgc', 'admin', 'owner', 'premium', 'active', 'private', 'public'].includes(firstPart)) {
            targetParam = firstPart;
            actualCaption = parts.slice(1).join(' ').trim();
        }
    }
    
    // Determine target groups based on parameter
    if (targetParam === 'allgc') {
        targets = Object.entries(conn.chats)
            .filter(([jid]) => jid.endsWith('@g.us'))
            .map(([jid]) => jid);
    } else if (targetParam === 'admin') {
        targets = Object.entries(conn.chats)
            .filter(([jid, chat]) => jid.endsWith('@g.us') && chat.isChats)
            .map(([jid]) => jid);
    } else if (targetParam === 'owner') {
        targets = Object.entries(conn.chats)
            .filter(([jid, chat]) => jid.endsWith('@g.us') && chat.isOwner)
            .map(([jid]) => jid);
    } else if (targetParam === 'premium') {
        targets = Object.entries(conn.chats)
            .filter(([jid, chat]) => jid.endsWith('@g.us') && chat.isPremium)
            .map(([jid]) => jid);
    } else if (targetParam === 'active') {
        // Groups with recent activity (last 24 hours)
        const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
        targets = Object.entries(conn.chats)
            .filter(([jid, chat]) => {
                if (!jid.endsWith('@g.us')) return false;
                const lastMsg = chat.lastMsgRecv || chat.lastMessage;
                return lastMsg && lastMsg.timestamp > oneDayAgo;
            })
            .map(([jid]) => jid);
    } else if (targetParam === 'private') {
        targets = Object.entries(conn.chats)
            .filter(([jid, chat]) => jid.endsWith('@g.us') && !chat.isAnnouncement)
            .map(([jid]) => jid);
    } else if (targetParam === 'public') {
        targets = Object.entries(conn.chats)
            .filter(([jid, chat]) => jid.endsWith('@g.us') && chat.isAnnouncement)
            .map(([jid]) => jid);
    } else {
        targets = [m.chat];
    }

    try {
        if (!mime && !actualCaption) {
            return await m.reply(
                `Reply media atau tambahkan teks.\nContoh: ${prefix}${command} (reply image/video/audio) Hai ini saya\n\nTarget parameter:\n• ${prefix}${command} allgc - Kirim ke semua grup\n• ${prefix}${command} active - Kirim ke grup aktif (24 jam terakhir)\n• ${prefix}${command} private - Kirim ke grup privat\n• ${prefix}${command} public - Kirim ke grup publik\n• ${prefix}${command} admin - Kirim ke grup admin\n• ${prefix}${command} owner - Kirim ke grup owner\n• ${prefix}${command} premium - Kirim ke grup premium`
            );
        }

        let payload = {};

        if (/image/.test(mime)) {
            const buffer = await quoted.download();
            payload = {
                image: buffer,
                caption: actualCaption
            };
        } else if (/video/.test(mime)) {
            const buffer = await quoted.download();
            payload = {
                video: buffer,
                caption: actualCaption
            };
        } else if (/audio/.test(mime)) {
            const buffer = await quoted.download();
            payload = {
                audio: buffer,
                mimetype: "audio/mp4"
            };
        } else if (actualCaption) {
            payload = {
                text: actualCaption
            };
        } else {
            return await m.reply(
                `Reply media atau tambahkan teks.\nContoh: ${prefix}${command} (reply image/video/audio) Hai ini saya\n\nTarget parameter:\n• ${prefix}${command} allgc - Kirim ke semua grup\n• ${prefix}${command} active - Kirim ke grup aktif (24 jam terakhir)\n• ${prefix}${command} private - Kirim ke grup privat\n• ${prefix}${command} public - Kirim ke grup publik\n• ${prefix}${command} admin - Kirim ke grup admin\n• ${prefix}${command} owner - Kirim ke grup owner\n• ${prefix}${command} premium - Kirim ke grup premium`
            );
        }

        // Create loading bar function
    function createProgressBar(current, total, size = 20) {
        const percentage = Math.round((current / total) * 100);
        const filled = Math.round((size * current) / total);
        const empty = size - filled;
        const bar = '█'.repeat(filled) + '░'.repeat(empty);
        return `${bar} ${percentage}%`;
    }

    // Send initial loading message
    const loadingMsg = await m.reply(`🚀 Memulai proses broadcast...\n📊 Target: ${targets.length} grup (${targetParam || 'grup saat ini'})\n${createProgressBar(0, targets.length)}\n⏳ Mohon tunggu...`);
    
    let successCount = 0;
    let failedGroups = [];
    const totalTargets = targets.length;
    
    // Progress tracking
    for (let i = 0; i < totalTargets; i++) {
        const jid = targets[i];
        
        try {
            await groupStatus(conn, jid, payload);
            successCount++;
            
            // Update progress every 2 groups or at the end
            if ((i + 1) % 2 === 0 || i === totalTargets - 1) {
                const progressText = `📤 Mengirim status...\n📊 Progress: ${createProgressBar(i + 1, totalTargets)}\n✅ Berhasil: ${successCount} | ❌ Gagal: ${failedGroups.length}\n📈 (${i + 1}/${totalTargets}) grup`;
                
                await new Promise(resolve => setTimeout(resolve, 3000));
                await conn.sendMessage(m.chat, { text: progressText, edit: loadingMsg.key });
            }
        } catch (err) {
            console.error(`❌ Gagal kirim status ke ${jid}:`, err);
            failedGroups.push(jid);
        }
        
        // Add small delay to prevent spam
        if (i < totalTargets - 1) {
            await new Promise(resolve => setTimeout(resolve, 200));
        }
    }

    // Final result with emoji styling
    let resultText = `🎉 *BROADCAST SELESAI!*\n\n`;
    resultText += `📊 *STATISTIK:*\n`;
    resultText += `✅ Berhasil: ${successCount} grup\n`;
    resultText += `❌ Gagal: ${failedGroups.length} grup\n`;
    resultText += `📈 Total Target: ${totalTargets} grup\n`;
    resultText += `🎯 Success Rate: ${Math.round((successCount/totalTargets) * 100)}%\n`;
    
    if (targetParam) {
        resultText += `🏷️ Tipe: ${targetParam.toUpperCase()}\n`;
    }
    
    // Show failed groups if any
    if (failedGroups.length > 0 && failedGroups.length <= 5) {
        resultText += `\n🚫 Grup gagal: ${failedGroups.length} grup`;
    } else if (failedGroups.length > 5) {
        resultText += `\n🚫 Grup gagal: ${failedGroups.length} grup (detail di console)`;
    }
    
    resultText += `\n\n💫 Status berhasil dikirim! 🎊`;
    
    await conn.sendMessage(m.chat, { text: resultText, edit: loadingMsg.key });
    
    // Add react to original message
    await conn.sendMessage(m.chat, {
        react: {
            text: "🎉",
            key: m.key
        }
    });
    } catch (err) {
        console.error("❌ Error di .upswgc:", err);
        await m.reply("❌ Terjadi kesalahan saat mengirim status grup.");
    }
};

handler.command = /^(upswgc|swgc|swgrup)$/i;
handler.help = ["swgc"];
handler.tags = ["group"];
export default handler;