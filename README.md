# Bearly Bullish

Next.js 14, TypeScript, React, Tailwind CSS and Recharts-ready editorial publication.

## Run

Open BearlyBullish
`npm install` then `npm run dev`.

## Environment

Copy `.env.example` to `.env.local`. The market route retrieves public provider data only on the server. `DATABASE_URL` enables PostgreSQL-backed moderated discussions; it is never sent to the browser. The comments table and retrieval index are created automatically on the first configured request. New comments are stored as `pending`; approve them directly in the database until an authenticated editorial admin area is added.

## Content

Articles live in `content/articles.ts`; the 46-term glossary lives in `content/glossary.ts`.
