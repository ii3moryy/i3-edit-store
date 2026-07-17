import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/lib/i18n";

type Creator = { id: string; name: string; image_url: string; channel_url: string | null };

export function CreatorsMarquee() {
  const { t } = useI18n();
  const [creators, setCreators] = useState<Creator[]>([]);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("creators" as any)
        .select("id,name,image_url,channel_url")
        .order("sort_order", { ascending: true });
      setCreators(((data ?? []) as unknown) as Creator[]);
    };
    load();

    const ch = supabase
      .channel("creators-rt")
      .on("postgres_changes" as any, { event: "*", schema: "public", table: "creators" }, load)
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  if (creators.length === 0) {
    return (
      <p className="text-center text-muted-foreground text-sm mt-8">
        {t("creators.empty")} <a href="/admin" className="text-primary underline">{t("creators.adminLink")}</a>
      </p>
    );
  }

  return (
    <>
      <style>{`
        @keyframes marquee-scroll {
          from { transform: translate3d(0, 0, 0); }
          to   { transform: translate3d(-50%, 0, 0); }
        }
        .creators-marquee {
          animation: marquee-scroll 18s linear infinite;
          will-change: transform;
        }
        .creators-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div className="max-w-3xl mx-auto relative" dir="ltr">
        {/* Left fade */}
        <div className="absolute left-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to right, hsl(var(--background)), transparent)" }} />
        {/* Right fade */}
        <div className="absolute right-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to left, hsl(var(--background)), transparent)" }} />

        <div className="overflow-hidden py-2">
          <div className="flex gap-8 w-max creators-marquee">
            {[...creators, ...creators].map((creator, i) => (
              <a
                key={i}
                href={creator.channel_url ?? "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-2 group flex-shrink-0 w-28"
              >
                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-border group-hover:border-primary transition-all shadow-md">
                  {creator.image_url ? (
                    <img
                      src={creator.image_url}
                      alt={creator.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary text-xl font-black">
                      {creator.name.charAt(0)}
                    </div>
                  )}
                </div>
                <span className="font-bold text-foreground text-xs text-center group-hover:text-primary transition-colors truncate w-full">
                  {creator.name}
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
