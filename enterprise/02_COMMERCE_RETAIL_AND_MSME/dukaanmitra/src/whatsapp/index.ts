import { makeWASocket, useMultiFileAuthState, DisconnectReason } from "@whiskeysockets/baileys";
import pino from "pino";
import qrcode from "qrcode";
import fs from "fs";
import path from "path";

// Store connection instances and their current QR code
const activeSockets = new Map<string, any>();
const latestQRs = new Map<string, string>();
const connectedStatus = new Map<string, boolean>();

const AUTH_DIR = path.join(process.cwd(), "whatsapp_auth");
if (!fs.existsSync(AUTH_DIR)) {
  fs.mkdirSync(AUTH_DIR);
}

export async function initWhatsApp(shopId: string) {
  if (activeSockets.has(shopId)) {
    return activeSockets.get(shopId);
  }

  const shopAuthDir = path.join(AUTH_DIR, `auth_info_${shopId}`);
  const { state, saveCreds } = await useMultiFileAuthState(shopAuthDir);

  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: false,
    logger: pino({ level: "silent" }) as any,
  });

  activeSockets.set(shopId, sock);

  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      // Convert QR to Base64 image
      try {
        const qrBase64 = await qrcode.toDataURL(qr, { margin: 1 });
        latestQRs.set(shopId, qrBase64);
      } catch (err) {
        console.error("Error generating QR code:", err);
      }
    }

    if (connection === "close") {
      connectedStatus.set(shopId, false);
      const shouldReconnect =
        (lastDisconnect?.error as any)?.output?.statusCode !==
        DisconnectReason.loggedOut;
      
      console.log(`Connection closed for shop ${shopId}. Reconnecting: ${shouldReconnect}`);
      
      if (shouldReconnect) {
        activeSockets.delete(shopId);
        initWhatsApp(shopId);
      } else {
        // If logged out, remove the folder to allow fresh scan next time
        activeSockets.delete(shopId);
        latestQRs.delete(shopId);
        fs.rmSync(shopAuthDir, { recursive: true, force: true });
      }
    } else if (connection === "open") {
      connectedStatus.set(shopId, true);
      console.log(`✅ WhatsApp connected for shop ${shopId}`);
      latestQRs.delete(shopId); // Clear QR once connected
    }
  });

  sock.ev.on("creds.update", saveCreds);
  
  return sock;
}

export function getWhatsAppStatus(shopId: string) {
  const sock = activeSockets.get(shopId);
  const qr = latestQRs.get(shopId);
  const isConnected = connectedStatus.get(shopId) || false;
  
  if (!sock) return { connected: false, qr: null };
  if (qr) return { connected: false, qr };
  return { connected: isConnected, qr: null };
}

export async function disconnectWhatsApp(shopId: string) {
  const sock = activeSockets.get(shopId);
  if (sock) {
    sock.logout();
    activeSockets.delete(shopId);
    latestQRs.delete(shopId);
    connectedStatus.delete(shopId);
    
    const shopAuthDir = path.join(AUTH_DIR, `auth_info_${shopId}`);
    if (fs.existsSync(shopAuthDir)) {
      fs.rmSync(shopAuthDir, { recursive: true, force: true });
    }
    return true;
  }
  return false;
}

export async function sendWhatsAppMessage(shopId: string, jid: string, text: string) {
  const sock = activeSockets.get(shopId);
  if (!sock) {
    throw new Error("WhatsApp not connected");
  }

  // Format JID correctly if just a number is passed
  if (!jid.includes("@s.whatsapp.net")) {
    jid = `${jid}@s.whatsapp.net`;
  }
  
  if (!jid.startsWith("91")) {
      jid = `91${jid}`; // Ensure country code for India
  }

  await sock.sendMessage(jid, { text });
}
