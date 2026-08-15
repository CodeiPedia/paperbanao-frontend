# PaperBanao Frontend (Next.js — Phase 2)

This talks to the FastAPI backend from Phase 1. Make sure the backend is
running first (`uvicorn app.main:app --reload` in the backend folder).

## What's built so far

- Login / Signup / Forgot Password pages
- Dashboard: paper generator form, including the BSEB "Class → Subject →
  Chapter" curriculum picker
- History page (view / delete saved papers)

## What's NOT built yet (next phases)

- Digitize (handwritten → digital) page
- Payments / Pro upgrade flow
- Word/PDF export and download
- Institution letterhead settings page

## Setup (Windows)

1. Unzip this folder somewhere, e.g. `C:\Users\hp\paperbanao-frontend`

2. Open Command Prompt in that folder (same trick as before: address bar → type `cmd` → Enter)

3. Install dependencies:
   ```
   npm install
   ```
   This will take a few minutes and downloads a `node_modules` folder (normal, don't touch it).

4. Create your local environment file:
   ```
   copy .env.local.example .env.local
   ```
   The default value (`http://127.0.0.1:8000`) already matches your local backend, so you
   usually don't need to edit this file for local testing.

5. Start the dev server:
   ```
   npm run dev
   ```

6. Open your browser to:
   ```
   http://localhost:3000
   ```

You should land on the login page. Since your backend already has the
`testuser1` account from Phase 1 testing, you can log in with that, or
create a new account via Sign Up.

## Notes

- This frontend and the FastAPI backend must both be running at the same
  time for anything to work (two separate Command Prompt windows).
- If you see a "Failed to fetch" or network error on any page, it almost
  always means the backend isn't running, or `.env.local`'s
  `NEXT_PUBLIC_API_URL` doesn't match where it's running.
- Later, when the backend is deployed to Render/Railway, update
  `NEXT_PUBLIC_API_URL` in `.env.local` (or in Vercel's environment
  variables once deployed there) to point at the real backend URL instead
  of `127.0.0.1`.
