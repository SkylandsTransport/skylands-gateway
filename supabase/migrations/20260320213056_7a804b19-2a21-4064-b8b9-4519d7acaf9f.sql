ALTER TABLE public.quotes
ADD COLUMN IF NOT EXISTS delivered_at timestamp with time zone;

CREATE OR REPLACE FUNCTION public.set_quote_delivery_timestamp()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.status = 'Delivered' AND (OLD.status IS DISTINCT FROM NEW.status OR OLD.delivered_at IS NULL) THEN
    NEW.delivered_at := COALESCE(NEW.delivered_at, now());
  ELSIF NEW.status IS DISTINCT FROM 'Delivered' THEN
    NEW.delivered_at := NULL;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_quote_delivery_timestamp ON public.quotes;
CREATE TRIGGER set_quote_delivery_timestamp
BEFORE UPDATE ON public.quotes
FOR EACH ROW
EXECUTE FUNCTION public.set_quote_delivery_timestamp();

UPDATE public.quotes
SET delivered_at = COALESCE(delivered_at, created_at)
WHERE status = 'Delivered' AND delivered_at IS NULL;