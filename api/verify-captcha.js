const submissions = new Map();

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  // Rate limit: max 3 submissions per IP per hour
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  const now = Date.now();
  const windowMs = 60 * 60 * 1000; // 1 hour
  const maxSubmissions = 3;

  if (submissions.has(ip)) {
    const record = submissions.get(ip);
    // Clear old entries outside the window
    record.times = record.times.filter((t) => now - t < windowMs);

    if (record.times.length >= maxSubmissions) {
      return res
        .status(429)
        .json({
          success: false,
          reason: "Too many submissions. Please try again later.",
        });
    }
    record.times.push(now);
  } else {
    submissions.set(ip, { times: [now] });
  }
  if (req.method !== "POST") return res.status(405).end();

  const { token } = req.body;

  const response = await fetch(
    "https://www.google.com/recaptcha/api/siteverify",
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`,
    },
  );

  const data = await response.json();

  // Score is 0.0 (bot) to 1.0 (human) — 0.5 is a safe threshold
  if (data.success && data.score >= 0.5) {
    return res.status(200).json({ success: true });
  } else {
    return res.status(200).json({ success: false, score: data.score });
  }
}
