// Simple in-memory chat API for Vercel serverless function
let messages = [];

export default function handler(req, res) {
  if (req.method === 'GET') {
    res.status(200).json(messages);
  } else if (req.method === 'POST') {
    const { user, text } = req.body;
    if (!user || !text) {
      res.status(400).json({ error: 'Missing user or text' });
      return;
    }
    const msg = { user, text, time: new Date().toISOString() };
    messages.push(msg);
    res.status(201).json(msg);
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
