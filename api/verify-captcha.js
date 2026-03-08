export default async function handler(req, res) {
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

  console.log("reCAPTCHA result:", {
    success: data.success,
    score: data.score,
    action: data.action,
    timestamp: data.challenge_ts,
  });

  // Score is 0.0 (bot) to 1.0 (human) — 0.5 is a safe threshold
  if (data.success && data.score >= 0.5) {
    return res.status(200).json({ success: true });
  } else {
    return res.status(200).json({ success: false, score: data.score });
  }
}
