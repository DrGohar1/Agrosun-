CREATE OR REPLACE FUNCTION public.bootstrap_admin(_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM pg_advisory_xact_lock(71395021);
  IF EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') THEN
    RETURN false;
  END IF;
  INSERT INTO public.user_roles (user_id, role) VALUES (_user_id, 'admin') ON CONFLICT DO NOTHING;
  RETURN true;
END;
$$;
REVOKE ALL ON FUNCTION public.bootstrap_admin(uuid) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.bootstrap_admin(uuid) FROM anon;
REVOKE ALL ON FUNCTION public.bootstrap_admin(uuid) FROM authenticated;
GRANT EXECUTE ON FUNCTION public.bootstrap_admin(uuid) TO service_role;