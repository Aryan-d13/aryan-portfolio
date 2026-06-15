import { createThemeBootstrapScript, themeBootstrapHeaders } from './_theme-utils.js';

export default async function handler(request, response) {
  if (request.method && request.method !== 'GET' && request.method !== 'HEAD') {
    response.setHeader('allow', 'GET, HEAD');
    response.status(405).send('Method not allowed');
    return;
  }

  const script = await createThemeBootstrapScript(process.env);
  const headers = themeBootstrapHeaders();
  Object.entries(headers).forEach(([key, value]) => response.setHeader(key, value));
  response.status(200).send(request.method === 'HEAD' ? '' : script);
}
