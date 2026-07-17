
ALTER TABLE public.plans
  ADD COLUMN IF NOT EXISTS in_stock boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS visible boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS featured boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS duration_ar text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS duration_en text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS features_ar text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS features_en text[] NOT NULL DEFAULT '{}';

-- Backfill duration/features/featured for the seed plans
UPDATE public.plans SET
  duration_ar = COALESCE(NULLIF(duration_ar,''), CASE id WHEN '3m' THEN '3 أشهر' WHEN '6m' THEN '6 أشهر' WHEN '12m' THEN 'سنة كاملة' ELSE '' END),
  duration_en = COALESCE(NULLIF(duration_en,''), CASE id WHEN '3m' THEN '3 Months' WHEN '6m' THEN '6 Months' WHEN '12m' THEN '1 Year' ELSE '' END),
  featured = CASE WHEN id = '6m' THEN true ELSE featured END
WHERE id IN ('3m','6m','12m');

UPDATE public.plans SET features_ar = ARRAY['Photoshop','Illustrator','Premiere Pro','After Effects','Lightroom','InDesign','XD','Acrobat Pro','وأكثر من 20 تطبيق'],
                       features_en = ARRAY['Photoshop','Illustrator','Premiere Pro','After Effects','Lightroom','InDesign','XD','Acrobat Pro','And 20+ more apps']
WHERE id = '3m' AND cardinality(features_ar) = 0;

UPDATE public.plans SET features_ar = ARRAY['Photoshop','Illustrator','Premiere Pro','After Effects','Lightroom','InDesign','XD','Acrobat Pro','100GB تخزين سحابي','وأكثر من 20 تطبيق'],
                       features_en = ARRAY['Photoshop','Illustrator','Premiere Pro','After Effects','Lightroom','InDesign','XD','Acrobat Pro','100GB Cloud Storage','And 20+ more apps']
WHERE id = '6m' AND cardinality(features_ar) = 0;

UPDATE public.plans SET features_ar = ARRAY['Photoshop','Illustrator','Premiere Pro','After Effects','Lightroom','InDesign','XD','Acrobat Pro','100GB تخزين سحابي','وأكثر من 20 تطبيق','دعم فني متميز','Adobe Portfolio مجاناً'],
                       features_en = ARRAY['Photoshop','Illustrator','Premiere Pro','After Effects','Lightroom','InDesign','XD','Acrobat Pro','100GB Cloud Storage','And 20+ more apps','Premium Support','Adobe Portfolio Free']
WHERE id = '12m' AND cardinality(features_ar) = 0;
