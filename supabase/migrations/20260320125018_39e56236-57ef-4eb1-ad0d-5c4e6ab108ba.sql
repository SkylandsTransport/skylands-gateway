ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email text;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, default_address, phone_number, email)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'default_address',
    NEW.raw_user_meta_data->>'phone_number',
    NEW.email
  )
  ON CONFLICT (user_id) DO UPDATE
  SET
    full_name = COALESCE(EXCLUDED.full_name, public.profiles.full_name),
    default_address = COALESCE(EXCLUDED.default_address, public.profiles.default_address),
    phone_number = COALESCE(EXCLUDED.phone_number, public.profiles.phone_number),
    email = COALESCE(EXCLUDED.email, public.profiles.email),
    updated_at = now();
  RETURN NEW;
END;
$function$;

ALTER PUBLICATION supabase_realtime ADD TABLE public.quotes;