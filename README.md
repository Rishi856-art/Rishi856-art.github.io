# Rishi Photography Portfolio

A production-oriented photography portfolio with a browser-based CMS. The public site works in demo mode immediately; connect Supabase to activate authentication, albums, uploads, featured images, contact messages, and persistent gallery management.

## Features

- Cinematic responsive homepage with an automatically rotating featured slideshow
- Album collections and dedicated album pages
- Filterable masonry gallery with lazy loading and fullscreen lightbox
- Secure email/password admin login
- Drag-and-drop multi-image upload with previews
- Automatic WebP conversion, resizing, and compression in the browser
- Create, edit, and delete albums without touching code
- Edit/delete photographs and toggle homepage featured images
- Supabase Postgres, Auth, Storage, and Row Level Security
- SEO metadata, responsive navigation, and Vercel-ready configuration

## Local setup

1. Install Node.js 20 or newer.
2. Run `npm install`.
3. Copy `.env.example` to `.env.local` and add your Supabase project URL and anon key.
4. Open Supabase SQL Editor and run [`supabase/schema.sql`](supabase/schema.sql).
5. In Supabase Authentication, create an email/password user.
6. Copy that user's UUID and run:

```sql
insert into public.admins (user_id) values ('YOUR_AUTH_USER_UUID');
```

7. Run `npm run dev` and open `http://localhost:3000`.
8. Open `http://localhost:3000/admin` and sign in.

## Content workflow

1. Create an album in **Dashboard > Albums**.
2. Open **Dashboard > Photos** and drag images into the upload area.
3. Choose an album and category, then publish.
4. Use the star button on any photograph to include it in the homepage slideshow.
5. Edit titles, alt text, and categories or delete photographs from the same screen.

The first photo uploaded to an album becomes its cover automatically. Public pages read directly from Supabase, so published changes appear without a redeploy.

## Deploy to Vercel

1. Push this folder to a Git repository and import it into Vercel.
2. Add `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `NEXT_PUBLIC_SITE_URL` in Vercel project settings.
3. Set `NEXT_PUBLIC_SITE_URL` to the production domain, then deploy.
4. In Supabase Authentication URL Configuration, add the production domain as the Site URL.

## Security notes

- The browser only receives the Supabase anon key. Never add the service-role key to a `NEXT_PUBLIC_` variable.
- Database and Storage writes require both an authenticated session and membership in `public.admins`.
- Uploaded files are restricted to common image MIME types and 10 MB at the bucket level, then optimized before upload.
- For public launch, enable CAPTCHA or rate limiting for the contact form in Supabase.
