import tailwindcss from '@tailwindcss/vite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig, Plugin } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Middleware plugin to serve multi-page clean URLs seamlessly in Vite dev server
function cleanUrlsPlugin(): Plugin {
  return {
    name: 'clean-urls-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const rawUrl = req.url?.split('?')[0];
        const routeMap: Record<string, string> = {
          '/renaissance-paintings': '/renaissance-paintings/index.html',
          '/indian-folk-art': '/indian-folk-art/index.html',
          '/impressionist-paintings': '/impressionist-paintings/index.html',
          '/404': '/404.html',
        };

        if (rawUrl && routeMap[rawUrl]) {
          const filePath = path.resolve(__dirname, routeMap[rawUrl].replace(/^\//, ''));
          if (fs.existsSync(filePath)) {
            try {
              const htmlContent = fs.readFileSync(filePath, 'utf-8');
              const transformedHtml = await server.transformIndexHtml(req.url || rawUrl, htmlContent);
              res.statusCode = 200;
              res.setHeader('Content-Type', 'text/html; charset=utf-8');
              return res.end(transformedHtml);
            } catch (err) {
              return next(err);
            }
          }
        }
        next();
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [tailwindcss(), cleanUrlsPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
          renaissance: path.resolve(__dirname, 'renaissance-paintings/index.html'),
          indianFolk: path.resolve(__dirname, 'indian-folk-art/index.html'),
          impressionist: path.resolve(__dirname, 'impressionist-paintings/index.html'),
          notFound: path.resolve(__dirname, '404.html'),
        },
      },
    },
    server: {
      port: 3000,
      host: '0.0.0.0',
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
