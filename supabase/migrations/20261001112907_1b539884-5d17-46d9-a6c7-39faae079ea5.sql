create type public.app_role as enum ('admin','editor');
create table public.user_roles (id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade, role app_role not null, unique(user_id, role));
grant select on public.user_roles to authenticated; grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;
create or replace function public.has_role(_user_id uuid, _role app_role) returns boolean language sql stable security definer set search_path = public as $$ select exists(select 1 from public.user_roles where user_id=_user_id and role=_role) $$;
create policy "own roles readable" on public.user_roles for select to authenticated using (user_id = auth.uid());

create or replace function public.update_updated_at_column() returns trigger language plpgsql set search_path = public as $$ begin new.updated_at = now(); return new; end; $$;

create table public.products (id uuid primary key default gen_random_uuid(), slug text unique not null, category text not null default 'fresh', name_en text not null, name_ar text not null default '', description_en text default '', description_ar text default '', specs jsonb not null default '[]', packaging text default '', image_url text default '', sort_order int not null default 0, visible boolean not null default true, created_at timestamptz not null default now(), updated_at timestamptz not null default now());
create table public.certifications (id uuid primary key default gen_random_uuid(), name text not null, description_en text default '', description_ar text default '', logo_url text default '', sort_order int not null default 0, visible boolean not null default true, created_at timestamptz not null default now(), updated_at timestamptz not null default now());
create table public.partners (id uuid primary key default gen_random_uuid(), name text not null, kind text not null default 'partner', country text default '', logo_url text default '', sort_order int not null default 0, visible boolean not null default true, created_at timestamptz not null default now(), updated_at timestamptz not null default now());
create table public.site_banners (id uuid primary key default gen_random_uuid(), page text not null, title_en text default '', title_ar text default '', subtitle_en text default '', subtitle_ar text default '', image_url text default '', sort_order int not null default 0, visible boolean not null default true, created_at timestamptz not null default now(), updated_at timestamptz not null default now());

grant select on public.products, public.certifications, public.partners, public.site_banners to anon, authenticated;
grant insert, update, delete on public.products, public.certifications, public.partners, public.site_banners to authenticated;
grant all on public.products, public.certifications, public.partners, public.site_banners to service_role;
alter table public.products enable row level security;
alter table public.certifications enable row level security;
alter table public.partners enable row level security;
alter table public.site_banners enable row level security;

create policy "public read products" on public.products for select to anon, authenticated using (visible or public.has_role(auth.uid(),'admin'));
create policy "admin write products" on public.products for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create policy "public read certs" on public.certifications for select to anon, authenticated using (visible or public.has_role(auth.uid(),'admin'));
create policy "admin write certs" on public.certifications for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create policy "public read partners" on public.partners for select to anon, authenticated using (visible or public.has_role(auth.uid(),'admin'));
create policy "admin write partners" on public.partners for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create policy "public read banners" on public.site_banners for select to anon, authenticated using (visible or public.has_role(auth.uid(),'admin'));
create policy "admin write banners" on public.site_banners for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

create trigger t_products before update on public.products for each row execute function public.update_updated_at_column();
create trigger t_certs before update on public.certifications for each row execute function public.update_updated_at_column();
create trigger t_partners before update on public.partners for each row execute function public.update_updated_at_column();
create trigger t_banners before update on public.site_banners for each row execute function public.update_updated_at_column();

create table public.contact_messages (id uuid primary key default gen_random_uuid(), name text not null, company text default '', email text not null, phone text default '', country text default '', product text default '', message text not null, created_at timestamptz not null default now());
grant insert on public.contact_messages to anon, authenticated;
grant select, delete on public.contact_messages to authenticated;
grant all on public.contact_messages to service_role;
alter table public.contact_messages enable row level security;
create policy "anyone can send" on public.contact_messages for insert to anon, authenticated with check (char_length(name) between 1 and 100 and char_length(email) between 3 and 255 and char_length(message) between 1 and 2000);
create policy "admins read messages" on public.contact_messages for select to authenticated using (public.has_role(auth.uid(),'admin'));
create policy "admins delete messages" on public.contact_messages for delete to authenticated using (public.has_role(auth.uid(),'admin'));