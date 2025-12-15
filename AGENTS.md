# AGENTS.md

This file provides guidance to coding agents when working with code in this repository.

## Project Overview

A Saleor app template using Hono (ultrafast router) and Deno runtime, deployable to Deno Deploy.

## Commands

```bash
# Install dependencies
deno install

# Fetch Saleor GraphQL schema (requires pnpm/npm)
pnpm run fetch-schema

# Generate TypeScript types from GraphQL
deno task generate

# Development - build client then start server with watch mode
deno task serve

# Build client SPA only
deno task build

# Start server only (with watch mode)
deno task server:start
```

Note: Server does not hot-reload client changes - run `deno task build` manually after client code changes.

## Architecture

**Dual JSX Runtime Setup**: Server uses Hono JSX (`@jsxImportSource hono/jsx` pragma), client uses React. This is a workaround for Deno not supporting per-directory compiler option overrides.

**Key Files**:
- `server/main.tsx` - Hono app entry point, serves SPA at `/app` and static assets
- `server/saleor-app.ts` - SaleorApp instance with APL configuration (supports `deno` or `upstash`)
- `server/deno-kv-apl.ts` - Custom APL implementation using Deno KV for auth data storage
- `server/api/index.ts` - API routes: `/api/manifest`, `/api/register`, `/api/webhooks/*`
- `server/api/utils.ts` - `unpackHonoRequest()` helper to adapt Hono handlers for app-sdk
- `client/` - React SPA built with Vite, outputs to `server/dist/`

**Webhook Pattern** (see `server/api/webhooks/order-created.ts`):
1. Define GraphQL fragment for payload
2. Define subscription query including the fragment
3. Create `SaleorAsyncWebhook` instance with typed payload
4. Register handler in webhook routes using `webhook.createHandler()`

**GraphQL Code Generation**: Fragments in `graphql/`, client, and server files generate types to `generated/graphql.ts`.

## Environment Variables

- `APL`: Set to `deno` (default) for Deno KV storage or `upstash` for UpstashAPL

## Deployment

Deno Deploy settings:
- Install: `deno install`
- Build: `deno task build`
- Entry: `server/main.tsx`
- Env: `APL=deno`
