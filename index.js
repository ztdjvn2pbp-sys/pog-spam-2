const {
  default: makeWASocket,
  useMultiFileAuthState,
  fetchLatestBaileysVersion
} = require("@whiskeysockets/baileys")

async function startBot() {

  console.log("🚀 BOT RENDER START")

  const { state, saveCreds } =
    await useMultiFileAuthState("./session")

  const { version } =
    await fetchLatestBaileysVersion()

  const sock = makeWASocket({
    auth: state,
    version,
    printQRInTerminal: true,
    browser: ["Render", "Chrome", "Linux"]
  })

  sock.ev.on("creds.update", saveCreds)

  sock.ev.on("connection.update", (update) => {

    const { connection, lastDisconnect } = update

    // 🔥 IMPORTANT : QR LOG STABLE
    if (update.qr) {
      console.log("\n📱 QR CODE WHATSAPP :\n")
      console.log(update.qr)
    }

    if (connection === "connecting") {
      console.log("🔄 Connexion en cours...")
    }

    if (connection === "open") {
      console.log("✅ BOT CONNECTÉ WHATSAPP")
    }

    if (connection === "close") {
      console.log("❌ CONNEXION FERMÉE")

      console.log("Cause :", lastDisconnect?.error)
    }
  })

  sock.ev.on("messages.upsert", async ({ messages }) => {

    const msg = messages[0]
    if (!msg.message) return

    const jid = msg.key.remoteJid

    const text =
      msg.message.conversation ||
      msg.message.extendedTextMessage?.text

    if (!text) return

    if (text === ".menu") {
      await sock.sendMessage(jid, {
        text: "🤖 MENU BOT\n\n.menu\n.ping"
      })
    }

    if (text === ".ping") {
      await sock.sendMessage(jid, {
        text: "🏓 Pong!"
      })
    }
  })
}

startBot()
