CREATE TABLE public.plans (
  id text PRIMARY KEY,
  name_ar text NOT NULL,
  name_en text NOT NULL,
  price_before integer NOT NULL,
  price_after integer NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "plans public read" ON public.plans FOR SELECT USING (true);
CREATE POLICY "Admins insert plans" ON public.plans FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins update plans" ON public.plans FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins delete plans" ON public.plans FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

CREATE OR REPLACE FUNCTION public.update_plans_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER plans_updated_at
BEFORE UPDATE ON public.plans
FOR EACH ROW
EXECUTE FUNCTION public.update_plans_updated_at();

INSERT INTO public.plans (id, name_ar, name_en, price_before, price_after, sort_order) VALUES
  ('3m',  'Creative Cloud - 3 أشهر',   'Creative Cloud - 3 Months', 40, 30, 1),
  ('6m',  'Creative Cloud - 6 أشهر',   'Creative Cloud - 6 Months', 70, 50, 2),
  ('12m', 'Creative Cloud - سنة كاملة','Creative Cloud - 1 Year',  120, 90, 3);