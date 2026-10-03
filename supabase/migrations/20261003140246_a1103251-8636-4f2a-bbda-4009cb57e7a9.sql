ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'viewer';

ALTER TABLE public.team_members ADD COLUMN IF NOT EXISTS linkedin_url text NOT NULL DEFAULT '', ADD COLUMN IF NOT EXISTS group_name text NOT NULL DEFAULT 'leadership';
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS slogan_en text NOT NULL DEFAULT '', ADD COLUMN IF NOT EXISTS slogan_ar text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS hq_address text NOT NULL DEFAULT 'El-Mahalla El-Kubra, Egypt',
  ADD COLUMN IF NOT EXISTS packhouse_address text NOT NULL DEFAULT 'Badr Center, Beheira, Egypt',
  ADD COLUMN IF NOT EXISTS iqf_address text NOT NULL DEFAULT 'Industrial Zone 4, Block 4, Sadat City',
  ADD COLUMN IF NOT EXISTS stats jsonb NOT NULL DEFAULT '[]'::jsonb;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS season_months jsonb NOT NULL DEFAULT '[]'::jsonb, ADD COLUMN IF NOT EXISTS in_season boolean NOT NULL DEFAULT true;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'active';
UPDATE public.site_settings SET email = 'exportagrosun@agrosunegypt.com' WHERE id = 'main' AND email = '';

CREATE OR REPLACE FUNCTION public.has_any_role(_user_id uuid, _roles text[])
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ select exists(select 1 from public.user_roles where user_id=_user_id and role::text = any(_roles)) $$;

CREATE TABLE public.audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id uuid,
  actor_email text NOT NULL DEFAULT '',
  action text NOT NULL,
  target text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.audit_logs TO authenticated;
GRANT ALL ON public.audit_logs TO service_role;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admins read audit" ON public.audit_logs FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "staff write own audit" ON public.audit_logs FOR INSERT TO authenticated WITH CHECK (actor_id = auth.uid() AND public.has_any_role(auth.uid(), ARRAY['admin','editor','viewer']));

CREATE POLICY "managers write products" ON public.products FOR ALL TO authenticated USING (public.has_any_role(auth.uid(), ARRAY['editor'])) WITH CHECK (public.has_any_role(auth.uid(), ARRAY['editor']));
CREATE POLICY "staff read products" ON public.products FOR SELECT TO authenticated USING (public.has_any_role(auth.uid(), ARRAY['editor','viewer']));
CREATE POLICY "staff read messages" ON public.contact_messages FOR SELECT TO authenticated USING (public.has_any_role(auth.uid(), ARRAY['editor','viewer']));
CREATE POLICY "managers update messages" ON public.contact_messages FOR UPDATE TO authenticated USING (public.has_any_role(auth.uid(), ARRAY['admin','editor'])) WITH CHECK (public.has_any_role(auth.uid(), ARRAY['admin','editor']));
CREATE POLICY "staff read team" ON public.team_members FOR SELECT TO authenticated USING (public.has_any_role(auth.uid(), ARRAY['editor','viewer']));

DO $$ DECLARE t text; BEGIN
  FOREACH t IN ARRAY ARRAY['site_settings','products','team_members','facilities','certifications','partners','site_banners'] LOOP
    BEGIN EXECUTE format('ALTER PUBLICATION supabase_realtime ADD TABLE public.%I', t); EXCEPTION WHEN duplicate_object THEN NULL; END;
  END LOOP;
END $$;