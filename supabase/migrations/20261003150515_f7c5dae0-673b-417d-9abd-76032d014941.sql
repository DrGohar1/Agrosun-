ALTER TABLE public.site_banners
  ADD COLUMN IF NOT EXISTS media_type text NOT NULL DEFAULT 'image',
  ADD COLUMN IF NOT EXISTS title_it text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS title_fr text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS title_de text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS subtitle_it text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS subtitle_fr text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS subtitle_de text NOT NULL DEFAULT '';

ALTER TABLE public.site_settings
  ADD COLUMN IF NOT EXISTS hero_title_it text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS hero_title_fr text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS hero_title_de text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS hero_subtitle_it text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS hero_subtitle_fr text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS hero_subtitle_de text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS slogan_it text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS slogan_fr text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS slogan_de text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS hq_address_it text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS hq_address_fr text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS hq_address_de text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS packhouse_address_it text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS packhouse_address_fr text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS packhouse_address_de text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS iqf_address_it text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS iqf_address_fr text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS iqf_address_de text NOT NULL DEFAULT '';

ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS name_it text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS name_fr text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS name_de text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS description_it text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS description_fr text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS description_de text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS packaging_it text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS packaging_fr text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS packaging_de text NOT NULL DEFAULT '';

ALTER TABLE public.facilities
  ADD COLUMN IF NOT EXISTS name_it text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS name_fr text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS name_de text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS place_it text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS place_fr text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS place_de text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS points_it text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS points_fr text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS points_de text NOT NULL DEFAULT '';

ALTER TABLE public.certifications
  ADD COLUMN IF NOT EXISTS description_it text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS description_fr text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS description_de text NOT NULL DEFAULT '';

ALTER TABLE public.team_members
  ADD COLUMN IF NOT EXISTS name_it text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS name_fr text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS name_de text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS title_it text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS title_fr text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS title_de text NOT NULL DEFAULT '';

ALTER TABLE public.contact_messages
  ADD COLUMN IF NOT EXISTS contacted_at timestamp with time zone,
  ADD COLUMN IF NOT EXISTS assigned_to text NOT NULL DEFAULT '';

ALTER TABLE public.site_banners DROP CONSTRAINT IF EXISTS site_banners_media_type_check;
ALTER TABLE public.site_banners ADD CONSTRAINT site_banners_media_type_check CHECK (media_type IN ('image', 'video'));
ALTER TABLE public.site_settings DROP CONSTRAINT IF EXISTS site_settings_hero_media_type_check;
ALTER TABLE public.site_settings ADD CONSTRAINT site_settings_hero_media_type_check CHECK (hero_media_type IN ('image', 'video'));