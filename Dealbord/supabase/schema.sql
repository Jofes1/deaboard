-- Kör detta i Supabase Dashboard → SQL Editor

create table if not exists deals (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  store        text not null,
  category     text not null,
  image_url    text,
  price        text,
  discount     text,
  affiliate_link text not null,
  expires_at   timestamptz not null,
  active       boolean not null default true,
  created_at   timestamptz not null default now()
);

-- Index för snabba filtreringar
create index on deals (category);
create index on deals (expires_at);
create index on deals (active);

-- Row Level Security: publiken får läsa aktiva/ej utgångna deals
alter table deals enable row level security;

create policy "Public read active deals"
  on deals for select
  using (active = true and expires_at > now());

-- Admin-insättning/uppdatering/borttagning görs via service role key
-- (Dealboard använder anon key för läsning, service role hanteras via Supabase Dashboard)

-- Exempeldata (valfritt, ta bort i produktion)
insert into deals (title, store, category, image_url, price, discount, affiliate_link, expires_at) values
  ('Sommarrea – upp till 50% rabatt', 'Zalando', 'Mode', 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400', null, '-50%', 'https://zalando.se', now() + interval '7 days'),
  ('AirPods Pro 2 – bästa priset', 'Elgiganten', 'Elektronik', 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400', '2 195 kr', '-20%', 'https://elgiganten.se', now() + interval '3 days'),
  ('Löparskor Nike Pegasus', 'Stadium', 'Sport', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400', '899 kr', '-30%', 'https://stadium.se', now() + interval '5 days'),
  ('IKEA – Köksrea denna vecka', 'IKEA', 'Hem', 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400', null, 'Upp till 40%', 'https://ikea.com/se', now() + interval '2 days');
