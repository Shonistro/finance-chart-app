const fetch = require('node-fetch');

module.exports = async (req, res) => {
  const apiUrl = 'https://platform.fintacharts.com/api/instruments/v1/exchanges';

  try {
    const response = await fetch(apiUrl, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Proxy error', details: error.message });
  }
}; 