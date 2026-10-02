create table public.facilities (
  id uuid primary key default gen_random_uuid(),
  name_en text not null, name_ar text not null default '',
  place_en text not null default '', place_ar text not null default '',
  points_en text not null default '', points_ar text not null default '',
  cover_url text not null default '', gallery jsonb not null default '[]'::jsonb,
  sort_order integer not null default 0, visible boolean not null default true,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
grant select on public.facilities to anon, authenticated;
grant insert, update, delete on public.facilities to authenticated;
grant all on public.facilities to service_role;
alter table public.facilities enable row level security;
create policy "public read facilities" on public.facilities for select to anon, authenticated using (visible or public.has_role(auth.uid(),'admin'));
create policy "admin write facilities" on public.facilities for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create trigger t_facilities before update on public.facilities for each row execute function public.update_updated_at_column();