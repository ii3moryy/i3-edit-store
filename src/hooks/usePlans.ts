import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Plan } from "@/lib/plans";

type DbPlan = {
  id: string;
  name_ar: string;
  name_en: string;
  price_before: number;
  price_after: number;
  sort_order: number;
  in_stock: boolean;
  visible: boolean;
  featured: boolean;
  duration_ar: string;
  duration_en: string;
  features_ar: string[] | null;
  features_en: string[] | null;
};

function monthsFromId(id: string): number {
  const m = id.match(/(\d+)\s*m/i);
  if (m) return Number(m[1]);
  return 1;
}

export function mapPlan(row: DbPlan): Plan {
  const months = monthsFromId(row.id) || 1;
  const perMonth = months > 0 ? (row.price_after / months).toFixed(1) : String(row.price_after);
  const save = row.price_before > 0
    ? Math.round(((row.price_before - row.price_after) / row.price_before) * 100)
    : 0;
  return {
    id: row.id,
    name: row.name_ar,
    nameEn: row.name_en,
    duration: row.duration_ar || "",
    durationEn: row.duration_en || "",
    price: row.price_after,
    original: row.price_before,
    perMonth,
    save,
    featured: row.featured,
    inStock: row.in_stock,
    features: row.features_ar ?? [],
    featuresEn: row.features_en ?? [],
  };
}

export function usePlans(): Plan[] {
  const { data } = useQuery({
    queryKey: ["plans"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("plans" as any)
        .select("*")
        .order("sort_order");
      if (error) throw error;
      return (data ?? []) as unknown as DbPlan[];
    },
  });

  if (!data) return [];
  return data.filter((r) => r.visible !== false).map(mapPlan);
}
