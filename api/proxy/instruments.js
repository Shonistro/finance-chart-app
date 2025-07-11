import fetch from 'node-fetch';

export default async function handler(req, res) {
  const authHeader = req.headers['authorization'];
  const url = 'https://platform.fintacharts.com/api/instruments/v1/instruments' + (req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : '');

  const apiRes = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': authHeader || '',
      'Accept': 'application/json',
    },
  });

  const data = await apiRes.text();
  res.status(apiRes.status).send(data);
} 