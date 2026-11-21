# PlainSpeak

PlainSpeak is a React glossary for community explanations of legal terms. Demo professionals and subscriptions are fictional and do not charge users.

## Local setup

Use Node.js 22. Run `npm ci`, copy `.env.example` to `.env.local`, then set `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` for the PlainSpeak project. Run `npm run dev`.

## Supabase

Use a dedicated Free project. Run the scripts in `supabase/migrations/` in filename order, then run `supabase/seed.sql`. Keep the Email auth provider enabled. Keep database passwords and secret/service-role keys outside this repository and the frontend. Demo consultations support one optional PDF of up to 1 MB.

For email confirmation, set the authentication Site URL to the Netlify production URL and add the local development URL to the redirect allow list when needed.

## Netlify

Import the PlainSpeak GitHub repository and select the production branch. Set the same two public environment variables in Netlify, then deploy. The repository configuration builds the Vite app and sends direct page requests to React Router.

Verify the homepage, a direct visit to `/professionals`, and the login redirect from `/submit`. With a test account, submit a term, update a profile, request a demo consultation, and switch a demo plan.
