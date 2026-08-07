# Book Exchange

A premium student marketplace for buying, selling, and exchanging academic books.

## Features
- Responsive light-themed UI inspired by OLX
- Auth flow for login and signup
- Home, library, sell, my books, account, and details pages
- Mock book data for testing

## Run locally
1. Install dependencies: npm install
2. Start the API server: npm run server
3. Start the dev server: npm run dev
4. Open http://localhost:3000

## Supabase setup
- Put your Supabase project values in `.env.local`
- `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are read by the Express API
- `SUPABASE_TABLE_NAME` is optional; if you set it, the API will use that table first
- Without it, the API checks `projects` first and then `books`

## Tech stack
- React + TypeScript + Vite
- Tailwind CSS
- Framer Motion
- React Router
- Lucide Icons
