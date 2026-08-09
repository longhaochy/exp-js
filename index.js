const express = require("express");
const app = express();

const VPS = "http://204.10.194.164:2148";

app.use(async (req, res) => {
  const url = VPS + req.url;
  try {
    const vpsRes = await fetch(url, {
      method: req.method,
      headers: { "Content-Type": req.headers["content-type"] || "application/json" },
      body: req.method !== "GET" && req.method !== "HEAD" ? JSON.stringify(req.body) : undefined,
    });

    const contentType = vpsRes.headers.get("content-type") || "";
    res.status(vpsRes.status);
    res.setHeader("Content-Type", contentType);
    res.send(await vpsRes.text());
  } catch (e) {
    res.status(502).json({ ok: false, error: "VPS unreachable" });
  }
});

module.exports = app;
