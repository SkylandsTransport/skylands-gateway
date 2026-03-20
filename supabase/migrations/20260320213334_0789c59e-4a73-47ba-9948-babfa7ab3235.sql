DROP TRIGGER IF EXISTS set_quote_delivery_timestamp ON public.quotes;
CREATE TRIGGER set_quote_delivery_timestamp
BEFORE INSERT OR UPDATE ON public.quotes
FOR EACH ROW
EXECUTE FUNCTION public.set_quote_delivery_timestamp();