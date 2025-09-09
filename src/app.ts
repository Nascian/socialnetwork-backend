import cors from 'cors';
import dotenv from 'dotenv';
import express, { Request, Response } from 'express';

import authRouter from './routes/auth';
import healthRouter from './routes/health';
import profileRouter from './routes/profile';
import { openapiSpec } from './docs/openapi';
import postsRouter from './routes/posts';

dotenv.config();

const app = express();

// Middlewares
app.use(cors({ origin: ['http://localhost:8080', 'http://127.0.0.1:8080'], credentials: false }));
app.use(express.json());

// Routes
app.use('/health', healthRouter);
app.use('/auth', authRouter);
app.use('/', profileRouter);
app.use('/', postsRouter);

// Lightweight OpenAPI exposure
app.get('/openapi.json', (_req, res) => res.json(openapiSpec));
app.get('/docs', (_req, res) => {
  const specUrl = '/openapi.json';
  res.type('html').send(`<!doctype html>
<html>
  <head>
    <meta charset="utf-8"/>
    <title>API Docs</title>
    <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5.17.14/swagger-ui.css"/>
  </head>
  <body>
    <div id="swagger-ui"></div>
    <script src="https://unpkg.com/swagger-ui-dist@5.17.14/swagger-ui-bundle.js"></script>
    <script>
      window.onload = () => {
        window.ui = SwaggerUIBundle({ url: '${specUrl}', dom_id: '#swagger-ui' });
      };
    </script>
  </body>
</html>`);
});

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({ message: 'Not Found' });
});

export default app;
