const fetch = require('node-fetch');

module.exports = async (req, res) => {
  const apiUrl = 'https://platform.fintacharts.com/api/bars/v1/bars/count-back';

  try {

    const options = {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (req.method === 'POST' || req.method === 'PUT') {
      options.body = JSON.stringify(req.body);
    }

    let url = apiUrl;
    if (req.method === 'GET' && Object.keys(req.query).length) {
      const params = new URLSearchParams(req.query).toString();
      url += `?${params}`;
    }

    const response = await fetch(url, options);
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Proxy error', details: error.message });
  }
};