const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for all origins
app.use(cors());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Proxy endpoint
app.get('/api/scorecard', async (req, res) => {
  const { clubId, matchId } = req.query;
  if (!clubId || !matchId) return res.status(400).send('Missing clubId or matchId');
  const url = `https://cricclubs.com/FT20/fullScorecard.do?matchId=${matchId}&clubId=${clubId}`;
  try {
    const resp = await fetch(url);
    if (!resp.ok) throw new Error('Upstream error: ' + resp.status);
    const html = await resp.text();
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(html);
  } catch (err) {
    res.status(502).send('Proxy error: ' + err.message);
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
