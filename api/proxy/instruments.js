const fetch = require('node-fetch');

module.exports = async (req, res) => {
  const url = new URL('https://platform.fintacharts.com/api/instruments/v1/instruments');
  if (req.query.provider) url.searchParams.set('provider', req.query.provider);
  if (req.query.kind) url.searchParams.set('kind', req.query.kind);

  try {
    const response = await fetch(url.toString(), {
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