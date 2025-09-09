import cors from 'cors';
import dotenv from 'dotenv';
import express, { Request, Response } from 'express';

import authRouter from './routes/auth';
import healthRouter from './routes/health';
import profileRouter from './routes/profile';
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

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({ message: 'Not Found' });
});

export default app;
