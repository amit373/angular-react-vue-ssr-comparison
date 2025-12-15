import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr/node';
import express from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import bootstrap from './src/main.server';
import { getPosts } from '@ssr-comparison/api';
import {
  DEFAULT_INFINITE_LIMIT,
  decodeCursor,
  encodeCursor,
  getDynamicFrameworkMetrics,
  parseLimitParam,
  parsePageParam,
} from '@ssr-comparison/utils';

export function app(): express.Express {
  const server = express();
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../browser');
  const indexHtml = join(browserDistFolder, 'index.csr.html');
  const commonEngine = new CommonEngine();

  server.set('view engine', 'html');
  server.set('views', browserDistFolder);

  server.get(
    '*.*',
    express.static(browserDistFolder, {
      maxAge: '1y',
      etag: true,
      lastModified: true,
    })
  );

  // Compression middleware
  server.use((_, res, next) => {
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    next();
  });

  server.get('/api/metrics', (req, res) => {
    const framework = (req.query['framework'] ?? 'angular') as 'nextjs' | 'angular' | 'nuxt';
    const metrics = getDynamicFrameworkMetrics(framework);
    res.setHeader('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
    res.json(metrics);
  });

  server.get('/api/posts', async (req, res, next) => {
    try {
      const limit = parseLimitParam(req.query['limit'], DEFAULT_INFINITE_LIMIT);
      const cursorValue = req.query['cursor'];
      const cursor = typeof cursorValue === 'string' ? cursorValue : null;
      const cursorPage = decodeCursor(cursor);
      const page = cursorPage ?? parsePageParam(req.query['page'], 1);

      const posts = await getPosts();

      const total = posts.length;
      const totalPages = Math.ceil(total / limit);

      const start = (page - 1) * limit;
      const end = start + limit;

      const data = posts.slice(start, end);

      const nextPage = page + 1;
      const hasNext = nextPage <= totalPages;

      res.setHeader('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
      res.json({
        data,
        total,
        page,
        limit,
        totalPages,
        nextCursor: hasNext ? encodeCursor(nextPage) : null,
      });
    } catch (e) {
      next(e);
    }
  });

  server.get('*', (req, res, next) => {
    const { protocol, originalUrl, baseUrl, headers } = req;
    commonEngine
      .render({
        bootstrap,
        documentFilePath: indexHtml,
        url: `${protocol}://${headers.host}${originalUrl}`,
        publicPath: browserDistFolder,
        providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }],
      })
      .then((html) => res.send(html))
      .catch((err) => next(err));
  });

  return server;
}

function run(): void {
  const port = process.env['PORT'] || 4000;
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

run();

