# Dive Center CMS

Strapi 5 (TypeScript) CMS backend powering the dive center website's frontend, which is developed as a separate application and consumes this API.

## Stack

- [Strapi 5](https://docs.strapi.io) (TypeScript)
- PostgreSQL (no SQLite — this project is configured for Postgres in all environments)
- Node.js 20–26 (even-numbered LTS releases), npm

## Prerequisites

- Node.js and npm (see `engines` in `package.json` for supported versions)
- A PostgreSQL database (local, Docker, or managed — e.g. Neon, RDS, Supabase)

## Setup

1. Clone the repo and install dependencies:
   ```
   npm install
   ```
2. Copy `.env.example` to `.env` and fill in real values:
   ```
   cp .env.example .env
   ```
   - `APP_KEYS`, `API_TOKEN_SALT`, `ADMIN_JWT_SECRET`, `TRANSFER_TOKEN_SALT`, `JWT_SECRET`, `ENCRYPTION_KEY` — generate unique secrets per environment (never reuse dev secrets in production).
   - `DATABASE_*` — your PostgreSQL connection details.
   - `CORS_ORIGIN` — comma-separated list of allowed frontend origins.
3. Start the dev server:
   ```
   npm run develop
   ```
4. Open `http://localhost:1337/admin` and create your first administrator account (first run only).

## Scripts

| Command          | Purpose                                             |
| ----------------- | ---------------------------------------------------- |
| `npm run develop` | Start Strapi with autoReload for local development   |
| `npm run start`   | Start Strapi without autoReload (production runtime) |
| `npm run build`   | Build the admin panel                                |

## Environment variables

Never commit `.env` — it's gitignored. `.env.example` documents every variable this project expects, with placeholder values only.

## Deployment

See [Strapi's deployment docs](https://docs.strapi.io/cms/deployment) for hosting options. Whatever platform is used, set the environment variables above (with production-grade secrets and DB credentials) rather than committing them.
