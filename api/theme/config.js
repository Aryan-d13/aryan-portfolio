import { readThemeConfigSnapshot } from '../_theme-utils.js';

export default async function handler(request, response) {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    response.setHeader('allow', 'GET, HEAD');
    response.status(405).send('Method not allowed');
    return;
  }

  try {
    const config = await readThemeConfigSnapshot(process.env);
    response.setHeader('content-type', 'application/json; charset=utf-8');
    response.setHeader('cache-control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.status(200).send(request.method === 'HEAD' ? '' : JSON.stringify(config));
  } catch (error) {
    response.status(500).json({ ok: false, error: error.message });
  }
}
