ALTER TABLE public.quotes
ADD COLUMN IF NOT EXISTS order_id text,
ADD COLUMN IF NOT EXISTS quantity text,
ADD COLUMN IF NOT EXISTS location text;

CREATE SEQUENCE IF NOT EXISTS public.skylands_order_seq START 1001;

CREATE OR REPLACE FUNCTION public.assign_skylands_order_id()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.order_id IS NULL OR btrim(NEW.order_id) = '' THEN
    NEW.order_id := '#SK-' || nextval('public.skylands_order_seq');
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS assign_skylands_order_id_on_quotes ON public.quotes;
CREATE TRIGGER assign_skylands_order_id_on_quotes
BEFORE INSERT ON public.quotes
FOR EACH ROW
EXECUTE FUNCTION public.assign_skylands_order_id();

UPDATE public.quotes
SET order_id = '#SK-' || nextval('public.skylands_order_seq')
WHERE order_id IS NULL OR btrim(order_id) = '';

ALTER TABLE public.quotes
ALTER COLUMN order_id SET NOT NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'quotes_order_id_key'
      AND conrelid = 'public.quotes'::regclass
  ) THEN
    ALTER TABLE public.quotes ADD CONSTRAINT quotes_order_id_key UNIQUE (order_id);
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'quotes'
      AND policyname = 'Admin can insert quotes for any user'
  ) THEN
    CREATE POLICY "Admin can insert quotes for any user"
    ON public.quotes
    FOR INSERT
    TO authenticated
    WITH CHECK (public.is_admin(auth.uid()));
  END IF;
END
$$;