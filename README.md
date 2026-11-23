# Anil Rijal: portfolio

Portfolio site and admin dashboard. Next.js (App Router), React, TypeScript, Tailwind CSS, Prisma, and Supabase (PostgreSQL, Auth, Storage).

## Run it locally

Requires Node.js 22 or newer.

```bash
npm install
npm run dev
```

Open http://localhost:3000. Without a `.env` file the public pages show the verified content in `src/content/defaults.ts`. The blog is empty, and the contact form and admin stay off until the steps below are done.

## Connect Supabase

Use a new or staging project while reviewing, not a production database.

1. Create a Supabase project. Copy `.env.example` to `.env`.
2. Fill in `DATABASE_URL` (transaction pooler, port 6543), `DIRECT_URL` (session pooler or direct, port 5432), `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_SITE_URL` and `CONTACT_IP_SALT`.
3. Create the tables and policies, then load the starting content:

   ```bash
   npm run db:deploy
   npm run db:seed
   ```

   The seed never overwrites existing rows. NepFlix and CSIT GOD are added unpublished, for you to complete.
4. Open the Supabase SQL editor and run `supabase/storage.sql`.
5. Restart the server.

`NEXT_PUBLIC_*` values are read at build time, so rebuild after changing them.

### Storage buckets

| Bucket | Contents | Types |
| --- | --- | --- |
| `project-images` | Project covers and screenshots | JPEG, PNG, WebP, AVIF |
| `post-covers` | Article covers and images | JPEG, PNG, WebP, AVIF |
| `profile` | Profile image | JPEG, PNG, WebP, AVIF |
| `resume` | Resume | PDF |

All are public to read and limited to 4 MB. Only accounts in `AdminUser` can upload or delete. A file uploaded in a form that is never saved stays in its bucket; remove it in the Supabase dashboard.

## Create the administrator

1. In Supabase, under Authentication, turn off new user sign-ups.
2. Under Authentication > Users, add a user with your email and a strong password, with the email confirmed.
3. Add that user to the allow-list:

   ```bash
   npm run admin:grant -- you@example.com
   ```
4. Sign in at `/admin/login`.

To revoke access, delete the row from the `AdminUser` table. Reset passwords from the Supabase dashboard.

## Contact notifications

Messages are always stored in the database. To receive email too, set `RESEND_API_KEY`, `CONTACT_EMAIL` and `CONTACT_FROM_EMAIL`. The sender must be on a domain verified in Resend.

Spam protection is a hidden field, a minimum fill time, and hourly limits: 3 per sender and 60 in total. Sender limits use the `x-real-ip` header, so host behind a platform or proxy that sets it.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build`, `npm start` | Production build and server |
| `npm run typecheck` | TypeScript |
| `npm run lint` | ESLint |
| `npm run db:migrate` | Create a migration in development |
| `npm run db:deploy` | Apply migrations |
| `npm run db:seed` | Add starting content |
| `npm run admin:grant -- <email>` | Make an Auth user an administrator |

## Structure

```
prisma/            schema, migrations, seed
supabase/          Storage buckets and policies
scripts/           admin:grant
src/app/(site)/    public pages
src/app/admin/     sign-in and dashboard
src/actions/       Server Actions (every mutation)
src/components/    UI; ui/ for primitives, admin/ for the dashboard
src/content/       verified starting content
src/lib/           auth, queries, validation, Prisma and Supabase clients
src/proxy.ts       session refresh for /admin
```

## Security model

- The browser never talks to the database or Supabase directly. Reads and writes happen on the server.
- `requireAdmin()` runs in every admin page and action. It verifies the session with Supabase Auth, then checks `AdminUser`. `src/proxy.ts` is only a convenience.
- Row Level Security is on for every table. The public API roles can read published projects and articles and nothing else.
- Uploads run as the signed-in admin, so Storage policies apply. File types are detected from content. The service-role key is not used.
- Markdown is rendered without raw HTML, and unsafe link schemes are removed.
- Public queries filter for published content. Scheduled articles appear within five minutes of their date.

`public/sw.js` removes the service worker left by the previous site. Keep it for a few months after launch.
