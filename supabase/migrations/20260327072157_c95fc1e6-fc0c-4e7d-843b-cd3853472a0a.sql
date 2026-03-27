
-- Enable realtime on orders table
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;

-- Add estimated_delivery and status_updated_at columns
ALTER TABLE public.orders 
  ADD COLUMN IF NOT EXISTS status_updated_at TIMESTAMPTZ DEFAULT now(),
  ADD COLUMN IF NOT EXISTS estimated_delivery TEXT;

-- Allow users to see status updates (update policy already exists for select)
-- Add update policy so edge function can update status via service role
CREATE POLICY "Service role can update orders"
  ON public.orders FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);
