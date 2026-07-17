CREATE TABLE public.creators (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  image_url TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.creators ENABLE ROW LEVEL SECURITY;
CREATE POLICY "creators public read" ON public.creators FOR SELECT USING (true);
CREATE POLICY "creators public insert" ON public.creators FOR INSERT WITH CHECK (true);
CREATE POLICY "creators public update" ON public.creators FOR UPDATE USING (true);
CREATE POLICY "creators public delete" ON public.creators FOR DELETE USING (true);

CREATE TABLE public.promo_codes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  discount_percent INT NOT NULL CHECK (discount_percent BETWEEN 1 AND 100),
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.promo_codes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "promo public read" ON public.promo_codes FOR SELECT USING (true);
CREATE POLICY "promo public insert" ON public.promo_codes FOR INSERT WITH CHECK (true);
CREATE POLICY "promo public update" ON public.promo_codes FOR UPDATE USING (true);
CREATE POLICY "promo public delete" ON public.promo_codes FOR DELETE USING (true);