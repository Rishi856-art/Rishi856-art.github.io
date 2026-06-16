-- Run this once in Supabase > SQL Editor.
create extension if not exists "pgcrypto";

create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.albums (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text,
  cover_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.photos (
  id uuid primary key default gen_random_uuid(),
  album_id uuid references public.albums(id) on delete set null,
  title text not null,
  alt_text text not null default '',
  image_url text not null,
  storage_path text,
  category text not null default 'Uncategorized',
  featured boolean not null default false,
  width integer,
  height integer,
  created_at timestamptz not null default now()
);

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 120),
  email text not null check (char_length(email) between 3 and 320),
  message text not null check (char_length(message) between 1 and 5000),
  created_at timestamptz not null default now()
);

alter table public.admins enable row level security;
alter table public.albums enable row level security;
alter table public.photos enable row level security;
alter table public.contact_messages enable row level security;

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.admins where user_id = auth.uid()); $$;

create policy "Public can view albums" on public.albums for select using (true);
create policy "Admins manage albums" on public.albums for all using (public.is_admin()) with check (public.is_admin());
create policy "Public can view photos" on public.photos for select using (true);
create policy "Admins manage photos" on public.photos for all using (public.is_admin()) with check (public.is_admin());
create policy "Users can verify own admin row" on public.admins for select using (user_id = auth.uid());
create policy "Anyone can send a contact message" on public.contact_messages for insert with check (true);
create policy "Admins can read contact messages" on public.contact_messages for select using (public.is_admin());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('portfolio-images', 'portfolio-images', true, 10485760, array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set public = true;

create policy "Public can view portfolio images" on storage.objects for select using (bucket_id = 'portfolio-images');
create policy "Admins upload portfolio images" on storage.objects for insert with check (bucket_id = 'portfolio-images' and public.is_admin());
create policy "Admins update portfolio images" on storage.objects for update using (bucket_id = 'portfolio-images' and public.is_admin());
create policy "Admins delete portfolio images" on storage.objects for delete using (bucket_id = 'portfolio-images' and public.is_admin());

create index if not exists photos_album_id_idx on public.photos(album_id);
create index if not exists photos_featured_idx on public.photos(featured) where featured = true;
create index if not exists photos_created_at_idx on public.photos(created_at desc);

-- After creating your first user in Authentication > Users, make them an admin:
-- insert into public.admins (user_id) values ('PASTE_AUTH_USER_UUID_HERE');
