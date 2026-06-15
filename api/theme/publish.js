import { handleThemePublish } from '../_theme-utils.js';

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('allow', 'POST');
    response.status(405).json({ ok: false, error: 'Method not allowed' });
    return;
  }

  const result = await handleThemePublish(request.body, request.headers, process.env);
  Object.entries(result.headers).forEach(([key, value]) => response.setHeader(key, value));
  response.status(result.status).send(result.body);
}
