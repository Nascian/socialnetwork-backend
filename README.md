# Node.js Backend (TypeScript + Express)

A minimal backend ready to run with TypeScript, Express, Jest, ESLint, and Prettier.

## Features
- Express server with a health check: GET /health
- TypeScript build (tsc) and dev reload (ts-node-dev)
- Jest + Supertest for API tests
- ESLint + Prettier configured
- dotenv for environment variables

## Quick start

1) Install dependencies
2) Run in dev mode
3) Build and start
4) Run tests

### Scripts
- `npm run dev` - Start in watch mode
- `npm run build` - Compile TypeScript to `dist/`
- `npm start` - Run compiled build
- `npm test` - Run tests once
- `npm run test:watch` - Watch tests
- `npm run lint` - Lint
- `npm run format` - Format with Prettier

### Environment
Copy `.env.example` to `.env` and adjust as needed.

## Endpoints
- GET `/health` -> `{ status: "ok", timestamp: "..." }`

## Notes
- Default port is 3000. Override via `PORT`.