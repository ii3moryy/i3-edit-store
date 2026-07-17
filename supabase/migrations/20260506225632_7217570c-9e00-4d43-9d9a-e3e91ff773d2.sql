CREATE TABLE public.reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  stars INTEGER NOT NULL DEFAULT 5 CHECK (stars BETWEEN 1 AND 5),
  description TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "reviews public read" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Admins insert reviews" ON public.reviews FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins update reviews" ON public.reviews FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins delete reviews" ON public.reviews FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));