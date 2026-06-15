import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

function readRequestBody(request: import('node:http').IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    request.on('data', chunk => chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)));
    request.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    request.on('error', reject);
  });
}

function themeBootstrapDevPlugin(env: Record<string, string>): Plugin {
  return {
    name: 'theme-bootstrap-dev',
    configureServer(server) {
      server.middlewares.use(async (request, response, next) => {
        const pathname = request.url?.split('?')[0];
        if (request.method === 'GET' && (pathname === '/api/theme-bootstrap.js' || pathname === '/api/theme-bootstrap')) {
          try {
            const { createThemeBootstrapScript, themeBootstrapHeaders } = await import('./api/_theme-utils.js');
            const script = await createThemeBootstrapScript({ ...process.env, ...env });
            Object.entries(themeBootstrapHeaders()).forEach(([key, value]) => response.setHeader(key, value));
            response.statusCode = 200;
            response.end(script);
          } catch (error) {
            response.statusCode = 500;
            response.setHeader('content-type', 'application/javascript; charset=utf-8');
            response.end(`document.documentElement.dataset.themeReady='error';window.__ARYAN_THEME_BOOTSTRAP_ERROR__=${JSON.stringify((error as Error).message)};`);
          }
          return;
        }

        if (request.method === 'GET' && pathname === '/api/theme/config') {
          try {
            const { readThemeConfigSnapshot } = await import('./api/_theme-utils.js');
            const config = await readThemeConfigSnapshot({ ...process.env, ...env });
            response.setHeader('content-type', 'application/json; charset=utf-8');
            response.setHeader('cache-control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
            response.statusCode = 200;
            response.end(JSON.stringify(config));
          } catch (error) {
            response.statusCode = 500;
            response.setHeader('content-type', 'application/json; charset=utf-8');
            response.end(JSON.stringify({ ok: false, error: (error as Error).message }));
          }
          return;
        }

        if (request.method === 'POST' && pathname === '/api/theme/publish') {
          try {
            const { handleThemePublish } = await import('./api/_theme-utils.js');
            const body = await readRequestBody(request);
            const result = await handleThemePublish(body, request.headers, { ...process.env, ...env });
            Object.entries(result.headers).forEach(([key, value]) => response.setHeader(key, value));
            response.statusCode = result.status;
            response.end(result.body);
          } catch (error) {
            response.statusCode = 500;
            response.setHeader('content-type', 'application/json; charset=utf-8');
            response.end(JSON.stringify({ ok: false, error: (error as Error).message }));
          }
          return;
        }

        next();
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [themeBootstrapDevPlugin(env), react()],
    server: {
      port: 3000,
      open: true,
    },
    resolve: {
      alias: {
        '@': '/src',
      },
    },
  };
});
