ALTER TABLE public.quotes
ADD COLUMN IF NOT EXISTS service_type text;

ALTER TABLE public.quotes
DROP CONSTRAINT IF EXISTS quotes_service_check;

ALTER TABLE public.quotes
DROP CONSTRAINT IF EXISTS quotes_status_check;

ALTER TABLE public.quotes
ADD CONSTRAINT quotes_service_check
CHECK (
  service = ANY (ARRAY['Diesel'::text, 'Transport'::text])
  AND (
    service_type IS NULL
    OR service_type = ANY (ARRAY['Diesel'::text, 'Transport'::text])
  )
);

ALTER TABLE public.quotes
ADD CONSTRAINT quotes_status_check
CHECK (
  status = ANY (
    ARRAY[
      'Inquiry Received'::text,
      'Quote Sent'::text,
      'Processing Order'::text,
      'Order Approved'::text,
      'Order Accepted'::text,
      'Vehicle Assigned'::text,
      'In Transit'::text,
      'Delivered'::text,
      'Dispatched'::text,
      'Completed'::text,
      'Approved'::text,
      'Accepted'::text
    ]
  )
);

CREATE OR REPLACE FUNCTION public.sync_quote_service_fields()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.service = 'Logistics' THEN
    NEW.service := 'Transport';
  END IF;

  IF NEW.service_type = 'Logistics' THEN
    NEW.service_type := 'Transport';
  END IF;

  IF NEW.service IS NULL OR btrim(NEW.service) = '' THEN
    NEW.service := NEW.service_type;
  END IF;

  IF NEW.service_type IS NULL OR btrim(NEW.service_type) = '' THEN
    NEW.service_type := NEW.service;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS sync_quote_service_fields_on_quotes ON public.quotes;
CREATE TRIGGER sync_quote_service_fields_on_quotes
BEFORE INSERT OR UPDATE ON public.quotes
FOR EACH ROW
EXECUTE FUNCTION public.sync_quote_service_fields();

DROP TRIGGER IF EXISTS assign_skylands_order_id_on_quotes ON public.quotes;
CREATE TRIGGER assign_skylands_order_id_on_quotes
BEFORE INSERT ON public.quotes
FOR EACH ROW
EXECUTE FUNCTION public.assign_skylands_order_id();

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'quotes_user_id_profiles_fkey'
      AND conrelid = 'public.quotes'::regclass
  ) THEN
    ALTER TABLE public.quotes
    ADD CONSTRAINT quotes_user_id_profiles_fkey
    FOREIGN KEY (user_id)
    REFERENCES public.profiles(user_id)
    ON DELETE CASCADE
    NOT VALID;
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

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'quotes'
      AND policyname = 'Admin can update all quotes'
  ) THEN
    CREATE POLICY "Admin can update all quotes"
    ON public.quotes
    FOR UPDATE
    TO authenticated
    USING (public.is_admin(auth.uid()))
    WITH CHECK (public.is_admin(auth.uid()));
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_publication_rel pr
    JOIN pg_class c ON c.oid = pr.prrelid
    JOIN pg_namespace n ON n.oid = c.relnamespace
    JOIN pg_publication p ON p.oid = pr.prpubid
    WHERE p.pubname = 'supabase_realtime'
      AND n.nspname = 'public'
      AND c.relname = 'quotes'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.quotes;
  END IF;
END
$$;