CREATE TABLE public.profiles (
  user_id uuid PRIMARY KEY,
  display_name text NOT NULL DEFAULT '',
  avatar_url text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  preferences jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users read own profile" ON public.profiles FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "users create own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "users update own profile" ON public.profiles FOR UPDATE TO authenticated USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin')) WITH CHECK (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins delete profiles" ON public.profiles FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER t_profiles BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name_en text NOT NULL,
  name_ar text NOT NULL DEFAULT '',
  title_en text NOT NULL,
  title_ar text NOT NULL DEFAULT '',
  photo_url text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  whatsapp text NOT NULL DEFAULT '',
  badges jsonb NOT NULL DEFAULT '[]'::jsonb,
  sort_order integer NOT NULL DEFAULT 0,
  visible boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.team_members TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.team_members TO authenticated;
GRANT ALL ON public.team_members TO service_role;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read visible team" ON public.team_members FOR SELECT TO anon, authenticated USING (visible OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins manage team" ON public.team_members FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER t_team_members BEFORE UPDATE ON public.team_members FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.site_settings (
  id text PRIMARY KEY DEFAULT 'main',
  company_name text NOT NULL DEFAULT 'AGRO SUN',
  legal_name text NOT NULL DEFAULT 'Agrosun Group',
  logo_url text NOT NULL DEFAULT '',
  hero_title_en text NOT NULL DEFAULT '',
  hero_title_ar text NOT NULL DEFAULT '',
  hero_subtitle_en text NOT NULL DEFAULT '',
  hero_subtitle_ar text NOT NULL DEFAULT '',
  hero_media_url text NOT NULL DEFAULT '',
  hero_media_type text NOT NULL DEFAULT 'image',
  email text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  whatsapp text NOT NULL DEFAULT '',
  maps_url text NOT NULL DEFAULT '',
  facebook_url text NOT NULL DEFAULT '',
  instagram_url text NOT NULL DEFAULT '',
  linkedin_url text NOT NULL DEFAULT '',
  youtube_url text NOT NULL DEFAULT '',
  section_visibility jsonb NOT NULL DEFAULT '{"stats":true,"products":true,"quality":true,"certifications":true,"markets":true,"team":true}'::jsonb,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_settings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read published settings" ON public.site_settings FOR SELECT TO anon, authenticated USING (published OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins manage settings" ON public.site_settings FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER t_site_settings BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.products ADD COLUMN featured boolean NOT NULL DEFAULT false;
ALTER TABLE public.products ADD COLUMN image_alt_en text NOT NULL DEFAULT '';
ALTER TABLE public.products ADD COLUMN image_alt_ar text NOT NULL DEFAULT '';

ALTER TABLE public.contact_messages ADD COLUMN status text NOT NULL DEFAULT 'new';
ALTER TABLE public.contact_messages ADD COLUMN internal_notes text NOT NULL DEFAULT '';
ALTER TABLE public.contact_messages ADD COLUMN source text NOT NULL DEFAULT 'contact';

INSERT INTO public.site_settings (
  id, company_name, legal_name, hero_title_en, hero_title_ar,
  hero_subtitle_en, hero_subtitle_ar, email, section_visibility
) VALUES (
  'main', 'AGRO SUN', 'Agrosun Group',
  'From Egyptian soil to the world''s tables.', 'من أرض مصر إلى موائد العالم.',
  'Egyptian growers, packers and exporters since 1995.', 'مزارعون ومعبئون ومصدرون مصريون منذ 1995.',
  'exportagrosun@agrosunegypt.com',
  '{"stats":true,"products":true,"quality":true,"certifications":true,"markets":true,"team":true}'::jsonb
);