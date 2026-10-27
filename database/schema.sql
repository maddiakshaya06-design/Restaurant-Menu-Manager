CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE IF NOT EXISTS public.menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  description VARCHAR(500) NOT NULL DEFAULT '',
  category VARCHAR(30) NOT NULL CHECK (category IN ('Starters','Main Course','Desserts','Beverages','Snacks','Other')),
  price NUMERIC(10,2) NOT NULL CHECK (price >= 0 AND price <= 1000000),
  is_available BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_menu_items_category ON public.menu_items(category);
CREATE INDEX IF NOT EXISTS idx_menu_items_availability ON public.menu_items(is_available);
CREATE INDEX IF NOT EXISTS idx_menu_items_name ON public.menu_items(name);
CREATE OR REPLACE FUNCTION public.set_menu_item_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$;
DROP TRIGGER IF EXISTS menu_items_updated_at ON public.menu_items;
CREATE TRIGGER menu_items_updated_at BEFORE UPDATE ON public.menu_items
FOR EACH ROW EXECUTE FUNCTION public.set_menu_item_updated_at();
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
-- The app accesses this table through the server-side secret key only.
-- Do not expose that key or enable public browser access to this table.
