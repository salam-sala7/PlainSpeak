# PlainSpeak

PlainSpeak helps readers understand terms in everyday documents through community explanations, a professional directory, and consultation requests.

## Run the demo

Use Node.js 22.12 or later.

```sh
npm ci
npm run dev
```

Open the Local URL printed by Vite. The demo starts with 54 fictional explanations, 16 sample professionals, and six sponsored examples. **Continue as demo member** enables term submission, profile editing, consultation requests, and plan switching. Demo changes stay in the current browser. Demo attachments are validated and only their file name is saved.

## Connect Supabase

For a separate empty Supabase project, run the SQL files in `supabase/migrations/` in filename order. Run `supabase/seed.sql` if you want the fictional records in that database. For a project that already ran the original six PlainSpeak migrations, run just `202611280001_public_glossary.sql` before using this frontend.

Copy `.env.example` to `.env.local` and set the URL and publishable key for the same project. Restart Vite. Keep the Email auth provider enabled, set the project's Site URL to the live frontend origin, and add each development and production origin with `/login` to the allowed redirect list. Use the actual port that Vite displays. Only the publishable key belongs in the frontend.

A connected build uses Supabase Auth and persists database changes. Consultation PDFs are capped at 1 MB and protected by the consultation policies. The requester can see their saved requests. The plans and sponsored placements model the experience for the class project. There is no payment processor or automatic notification to the directory listing.

Verification and sponsorship are database-managed fields. The public glossary query exposes the author name and verification status alongside published terms while profile settings keep their existing access policies.

## Build and deploy

```sh
npm run build
```

The Netlify configuration builds into `dist` and routes deep links through `index.html`. Set both `VITE_SUPABASE_*` values in Netlify before building if you want a connected production build. A build without those values runs in demo mode and uses hash-based routing for static hosting.
