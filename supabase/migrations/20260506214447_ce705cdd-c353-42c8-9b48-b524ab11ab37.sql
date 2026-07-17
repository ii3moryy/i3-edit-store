
-- Role enum + user_roles table
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer role checker (avoids RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- RLS for user_roles
CREATE POLICY "Users view own roles" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage roles" ON public.user_roles
  FOR ALL USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Signup trigger: first user → admin, otherwise → user
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_count INT;
BEGIN
  SELECT count(*) INTO user_count FROM public.user_roles WHERE role = 'admin';
  IF user_count = 0 THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin');
  ELSE
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user');
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_role();

-- Lock down creators: public read, admin-only write
DROP POLICY IF EXISTS "creators public insert" ON public.creators;
DROP POLICY IF EXISTS "creators public update" ON public.creators;
DROP POLICY IF EXISTS "creators public delete" ON public.creators;

CREATE POLICY "Admins insert creators" ON public.creators
  FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update creators" ON public.creators
  FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete creators" ON public.creators
  FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- Lock down promo_codes: public read, admin-only write
DROP POLICY IF EXISTS "promo public insert" ON public.promo_codes;
DROP POLICY IF EXISTS "promo public update" ON public.promo_codes;
DROP POLICY IF EXISTS "promo public delete" ON public.promo_codes;

CREATE POLICY "Admins insert promos" ON public.promo_codes
  FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update promos" ON public.promo_codes
  FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete promos" ON public.promo_codes
  FOR DELETE USING (public.has_role(auth.uid(), 'admin'));
