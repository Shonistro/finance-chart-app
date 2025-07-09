import fetch from 'node-fetch';

export default async function handler(req, res) {
  const authHeader = req.headers['authorization'];

  const apiRes = await fetch('https://platform.fintacharts.com/api/instruments/v1/providers', {
    method: 'GET',
    headers: {
      'Authorization': authHeader || '',
      'Accept': 'application/json',
    },
  });

  const data = await apiRes.text();
  res.status(apiRes.status).send(data);
} 