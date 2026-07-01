const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");
const axios = require("axios");

admin.initializeApp();
const db = admin.firestore();

const api = express();
api.use(cors({ origin: true }));
api.use(express.json());

api.get("/bots", async (req, res) => {
  try {
    const snap = await db.collection("bots").orderBy("createdAt", "desc").get();
    const bots = snap.docs.map(doc => ({ id: doc.id, ...doc.data(), token: undefined }));
    res.json({ bots });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

api.post("/bots", async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ error: "Token required" });

    const tg = await axios.get(`https://api.telegram.org/bot${token}/getMe`);
    if (!tg.data.ok) return res.status(400).json({ error: "Invalid token" });

    const bot = tg.data.result;

    const ref = await db.collection("bots").add({
      token,
      botId: bot.id,
      botName: bot.first_name || "",
      botUsername: bot.username ? "@" + bot.username : "",
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    res.json({ success: true, botId: ref.id });
  } catch (e) {
    res.status(500).json({ error: e.response?.data?.description || e.message });
  }
});

api.delete("/bots/:botId", async (req, res) => {
  try {
    await db.collection("bots").doc(req.params.botId).delete();
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

exports.api = functions.https.onRequest(api);
