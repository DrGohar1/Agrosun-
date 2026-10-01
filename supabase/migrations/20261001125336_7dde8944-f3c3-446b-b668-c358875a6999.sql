CREATE OR REPLACE FUNCTION public.claim_initial_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  caller uuid := auth.uid();
BEGIN
  IF caller IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;
  PERFORM pg_advisory_xact_lock(71395021);
  IF EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') THEN
    RETURN false;
  END IF;
  INSERT INTO public.user_roles (user_id, role) VALUES (caller, 'admin') ON CONFLICT DO NOTHING;
  RETURN true;
END;
$$;
REVOKE ALL ON FUNCTION public.claim_initial_admin() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.claim_initial_admin() FROM anon;
GRANT EXECUTE ON FUNCTION public.claim_initial_admin() TO authenticated;