
CREATE TABLE public.creators (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  image_url TEXT NOT NULL,
  channel_url TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.promo_codes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  discount_percent INTEGER NOT NULL CHECK (discount_percent BETWEEN 1 AND 100),
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.creators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promo_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "creators public read" ON public.creators FOR SELECT USING (true);
CREATE POLICY "creators public insert" ON public.creators FOR INSERT WITH CHECK (true);
CREATE POLICY "creators public update" ON public.creators FOR UPDATE USING (true);
CREATE POLICY "creators public delete" ON public.creators FOR DELETE USING (true);

CREATE POLICY "promo public read" ON public.promo_codes FOR SELECT USING (true);
CREATE POLICY "promo public insert" ON public.promo_codes FOR INSERT WITH CHECK (true);
CREATE POLICY "promo public update" ON public.promo_codes FOR UPDATE USING (true);
CREATE POLICY "promo public delete" ON public.promo_codes FOR DELETE USING (true);

INSERT INTO public.creators (id, name, image_url, sort_order, channel_url) VALUES
  ('5e32e202-6871-4380-ab14-fa29eb1ee80e','ii3Mory','https://yt3.googleusercontent.com/gQMreKDO8vo5IvcIsezQGhiECNdEhqDJ2jB5QNgUz5c2aCG9I3XFp4rmS5oYQ4ROlIwffEMj8w=s120-c-k-c0x00ffffff-no-rj',0,'https://www.youtube.com/@ii3Mory'),
  ('bbd1a052-f64f-4d71-b020-a8f779ed5349','Rest','https://yt3.googleusercontent.com/dWPJAHNPJgCQ3dUlyqdtcs0M1hKmo4Ddt3KGhc7_rQbClybz2XOuAa_n7XAtxi-Sbhi49vucyg=s120-c-k-c0x00ffffff-no-rj',1,'https://www.youtube.com/@Restt_'),
  ('45409792-e393-4555-bf3b-9244dd3d3959','Fariis47','https://yt3.googleusercontent.com/j-StGjm-axMNJjlLTkMczrVyF4Azofh11MP9IZR7_Eqosdyvvcmlizn7IO7Ia46rx_T85q2sBN8=s120-c-k-c0x00ffffff-no-rj',2,'https://www.youtube.com/@Fariis47'),
  ('cd03caa2-3449-494d-9d3f-290c031e738c','Omarfive','https://yt3.googleusercontent.com/FKs-QGWO30-vzY92CZRDC9ugJ5eZUeQsAYwttPAeYOyuy0rmTROwhJevIV_GqvmXpuyW8XjdTQ=s120-c-k-c0x00ffffff-no-rj',3,'https://www.youtube.com/@OmarFive'),
  ('ef441584-4432-40b9-9510-dad86895a502','Khazneh','https://yt3.googleusercontent.com/OvM-7EhIajjW-MdhT0c0zH1YDcnA0kduSCAf2wnwuTP_Nw7XpsLD1anTcw49_0mS7ZTcccBdG0w=s120-c-k-c0x00ffffff-no-rj',4,'https://www.youtube.com/@abukhazne');
