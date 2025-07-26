// Express backend to proxy AliExpress DataHub API requests securely
require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');
const app = express();
const PORT = process.env.PORT || 3001;

app.get('/api/aliexpress', async (req, res) => {
  const itemId = req.query.itemId;
  if (!itemId) return res.status(400).json({ error: 'Missing itemId' });
  try {
    const url = `https://aliexpress-datahub.p.rapidapi.com/item_detail_2?itemId=${itemId}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'x-rapidapi-key': process.env.RAPIDAPI_KEY,
        'x-rapidapi-host': 'aliexpress-datahub.p.rapidapi.com'
      }
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'API error' });
  }
});

app.listen(PORT, () => {
  console.log(`AliExpress proxy running on port ${PORT}`);
});
