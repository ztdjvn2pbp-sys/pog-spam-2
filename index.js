const {
  default: makeWASocket,
  useMultiFileAuthState,
  fetchLatestBaileysVersion
} = require("@whiskeysockets/baileys")

async function startBot() {

  console.log("🚀 BOT START RENDER")

  const { state, saveCreds } =
    await useMultiFileAuthState("./session")

  const { version } =
    await fetchLatestBaileysVersion()

  const sock = makeWASocket({
    auth: state,
    version,
    browser: ["Render", "Chrome", "Linux"]
  })

  sock.ev.on("creds.update", saveCreds)

  sock.ev.on("connection.update", (update) => {

    const { connection, qr } = update

    if (qr) {
      console.log("📱 SCAN QR :")
      console.log(qr)
    }

    if (connection === "open") {
      console.log("✅ BOT CONNECTÉ")
    }

    if (connection === "close") {
      console.log("❌ BOT STOP")
    }
  })
}

startBot()
