
module.exports =  async function handler(req:any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const body = new URLSearchParams();
  body.set('grant_type', 'password');
  body.set('client_id', 'app-cli');
  body.set('username', process.env['KEYCLOAK_USERNAME']!);
  body.set('password', process.env['KEYCLOAK_PASSWORD']!);

  const keycloakUrl = `${process.env['KEYCLOAK_BASE_URL']}/identity/realms/${process.env['KEYCLOAK_REALM']}/protocol/openid-connect/token`;

  try {
    const response = await fetch(keycloakUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', details: (error as Error).message });
  }
}
