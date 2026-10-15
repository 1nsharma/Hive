-- migrations/003_scan_pings.sql

create table if not exists public.scan_events (
  id bigint generated always as identity primary key,
  pet_id uuid not null references public.pets(id) on delete cascade,
  lat numeric(9,6),
  lng numeric(9,6),
  area text,
  source text not null check (source in ('geolocation', 'manual')),
  accuracy_m int,
  ip_hash text,
  created_at timestamptz not null default now(),
  constraint scan_event_location_check
    check ((lat is not null and lng is not null) or area is not null)
);

create index if not exists scan_events_pet_time_idx
  on public.scan_events (pet_id, created_at desc);

alter table public.scan_events enable row level security;

-- Sirf owner apne pet ke pings padh sakta hai
create policy owner_select_scan_events
on public.scan_events for select to authenticated
using (
  exists (
    select 1 from public.pets p
    where p.id = pet_id and p.owner_id = auth.uid()
  )
);

-- Anonymous ko read/write direct nahi (insert API service-role se hoga)
create policy no_anon_scan_events
on public.scan_events for select to anon using (false);

-- WhatsApp opt-in columns (default OFF = privacy-first)
alter table public.owner_contact_settings
  add column if not exists whatsapp_number text,
  add column if not exists whatsapp_enabled boolean not null default false;

-- Retention: daily cleanup job
-- delete from public.scan_events where created_at < now() - interval '30 days';
