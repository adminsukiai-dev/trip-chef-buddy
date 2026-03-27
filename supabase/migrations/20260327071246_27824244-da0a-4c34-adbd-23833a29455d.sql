
-- Create orders table
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  status TEXT NOT NULL DEFAULT 'confirmed',
  delivery_slot TEXT,
  special_instructions TEXT,
  subtotal NUMERIC(10,2) NOT NULL DEFAULT 0,
  delivery_fee NUMERIC(10,2) NOT NULL DEFAULT 0,
  total NUMERIC(10,2) NOT NULL DEFAULT 0,
  resort TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create order items table
CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  product_id TEXT NOT NULL,
  product_name TEXT NOT NULL,
  product_price NUMERIC(10,2) NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1
);

-- Enable RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Orders: users can read/insert their own
CREATE POLICY "Users can read own orders"
  ON public.orders FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own orders"
  ON public.orders FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Order items: users can read/insert items for their own orders
CREATE POLICY "Users can read own order items"
  ON public.order_items FOR SELECT TO authenticated
  USING (order_id IN (SELECT id FROM public.orders WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert own order items"
  ON public.order_items FOR INSERT TO authenticated
  WITH CHECK (order_id IN (SELECT id FROM public.orders WHERE user_id = auth.uid()));
