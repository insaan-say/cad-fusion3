# Industrial 3D Technology Transfer & Remote Engineering Platform

Enterprise SaaS MVP for secure CAD and manufacturing document transfer, browser-based 3D engineering review, remote repair collaboration, AI design recommendations, engineering change management, and manufacturing analytics.

## What is included

- Next.js, React, TypeScript, Tailwind CSS frontend
- React Three Fiber and Three.js interactive industrial 3D viewer
- Engineer workspace, repair collaboration, technology transfer, and analytics screens
- Express.js API scaffold with Socket.io real-time collaboration events
- Prisma PostgreSQL schema for organizations, users, assets, versions, transfers, approvals, audit logs, annotations, repair sessions, and AI recommendations
- Supabase client helper and environment template for auth/storage integration

## Run locally

```bash
npm install
npm run dev
```

The frontend runs at `http://localhost:3000`.

Run the API scaffold separately:

```bash
npm run dev:server
```

The API listens on `http://localhost:4000`.

Run the functional browser/API verifier:

```bash
npm run verify:ui
```

The verifier checks desktop and mobile rendering, viewer toolbar toggles, navigation across the engineer, repair, transfer, and analytics screens, and API smoke tests. If the API is not already running, it starts a temporary API process for the verification run and stops only that managed process when finished.

## Environment

Copy `.env.example` to `.env.local` for the frontend and configure Supabase values. Use `DATABASE_URL` for Prisma migrations.

## Production path

1. Create Supabase Auth project and private storage bucket for engineering assets.
2. Configure PostgreSQL and run `npm run prisma:migrate`.
3. Deploy the Next.js app to Vercel.
4. Deploy the Express/Socket.io API to Railway or Render.
5. Replace demo fixtures in `lib/platform-data.ts` with API queries and Supabase signed upload/download flows.
