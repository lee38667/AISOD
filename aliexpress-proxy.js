// Express backend to proxy AliExpress DataHub API requests securely
require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');
const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS for frontend requests
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Item search endpoint
app.get('/api/aliexpress', async (req, res) => {
  const query = req.query.q;
  const page = req.query.page || 1;
  const sort = req.query.sort || 'default';
  
  if (!query) return res.status(400).json({ error: 'Missing search query' });
  
  if (!fetch) {
    return res.status(500).json({ error: 'Fetch not available' });
  }
  
  try {
    const url = `https://aliexpress-datahub.p.rapidapi.com/item_search?q=${encodeURIComponent(query)}&page=${page}&sort=${sort}`;
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
    console.error('API Error:', err);
    res.status(500).json({ error: 'API error' });
  }
});

// Test endpoint to verify API is working
app.get('/api/test', async (req, res) => {
  try {
    if (!fetch) {
      return res.status(500).json({ error: 'Fetch not available' });
    }
    
    // Allow custom search query or default to 'laptop' for testing
    const testQuery = req.query.q || 'laptop';
    const url = `https://aliexpress-datahub.p.rapidapi.com/item_search?q=${encodeURIComponent(testQuery)}&page=1&sort=default`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'x-rapidapi-key': process.env.RAPIDAPI_KEY,
        'x-rapidapi-host': 'aliexpress-datahub.p.rapidapi.com'
      }
    });
    const data = await response.json();
    res.json({ success: true, testQuery, data });
  } catch (err) {
    console.error('Test API Error:', err);
    res.json({ success: false, error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`AliExpress proxy running on port ${PORT}`);
  console.log(`Search API: http://localhost:${PORT}/api/aliexpress?q=YOUR_SEARCH_TERM`);
  console.log(`Test API: http://localhost:${PORT}/api/test?q=YOUR_SEARCH_TERM`);
  console.log(`Example: http://localhost:${PORT}/api/test?q=headphones`);
});
