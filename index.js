export default async function handler(req, res) {
  const VPS = "http://204.10.194.164:2148";

  // build path + query string
  const url = VPS + req.url;

  try {
    const vpsRes = await fetch(url, {
      method: req.method,
      headers: {
        "Content-Type": req.headers["content-type"] || "application/json",
      },
      body: req.method !== "GET" && req.method !== "HEAD"
        ? JSON.stringify(req.body)
        : undefined,
    });

    const contentType = vpsRes.headers.get("content-type") || "";
    res.status(vpsRes.status);

    if (contentType.includes("application/json")) {
      const data = await vpsRes.json();
      res.json(data);
    } else {
      const text = await vpsRes.text();
      res.setHeader("Content-Type", contentType);
      res.send(text);
    }
  } catch (e) {
    res.status(502).json({ ok: false, error: "VPS unreachable" });
  }
}
