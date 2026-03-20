
CREATE TABLE public.quotes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  service text NOT NULL CHECK (service IN ('Diesel', 'Transport')),
  details text NOT NULL,
  status text NOT NULL DEFAULT 'Inquiry Received' CHECK (status IN ('Inquiry Received', 'Quote Sent', 'Processing Order', 'Dispatched', 'Completed')),
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own quotes"
ON public.quotes FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own quotes"
ON public.quotes FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);
