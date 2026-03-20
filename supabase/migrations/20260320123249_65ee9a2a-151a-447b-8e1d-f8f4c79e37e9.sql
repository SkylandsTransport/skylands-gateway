-- Site settings table for maintenance mode and announcements
CREATE TABLE public.site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value text NOT NULL DEFAULT '',
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Insert default settings
INSERT INTO public.site_settings (key, value) VALUES
  ('diesel_maintenance', 'false'),
  ('logistics_maintenance', 'false'),
  ('announcement', '');

-- Everyone can read site settings (needed for announcement bar + maintenance checks)
CREATE POLICY "Anyone can read site settings"
  ON public.site_settings FOR SELECT
  TO public
  USING (true);

-- Security definer function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = _user_id
      AND email = 'delarey.skylands@gmail.com'
  )
$$;

-- Only admin can update site settings
CREATE POLICY "Admin can update site settings"
  ON public.site_settings FOR UPDATE
  TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- Admin can read ALL quotes
CREATE POLICY "Admin can view all quotes"
  ON public.quotes FOR SELECT
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- Admin can update any quote status
CREATE POLICY "Admin can update all quotes"
  ON public.quotes FOR UPDATE
  TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- Admin can read ALL profiles
CREATE POLICY "Admin can view all profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (public.is_admin(auth.uid()));
