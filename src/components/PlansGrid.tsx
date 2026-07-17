import type { Plan } from "@/lib/plans";
import { PlanCard } from "@/components/PlanCard";

/**
 * Layout rules:
 *  1–3 plans: single row, centered
 *  4 plans: 2×2 grid
 *  5 plans: 3 on top, 2 centered below
 *  6 plans: 3×2 grid
 *  7+ plans: responsive CSS grid, max 3 per row
 */
export function PlansGrid({ plans }: { plans: Plan[] }) {
  const n = plans.length;
  if (n === 0) return null;

  if (n <= 3) {
    return (
      <div className={`grid gap-6 mx-auto ${
        n === 1 ? "max-w-md md:grid-cols-1" :
        n === 2 ? "max-w-3xl md:grid-cols-2" :
        "max-w-5xl md:grid-cols-3"
      }`}>
        {plans.map((p) => <PlanCard key={p.id} plan={p} />)}
      </div>
    );
  }

  if (n === 4) {
    return (
      <div className="grid gap-6 mx-auto max-w-4xl md:grid-cols-2">
        {plans.map((p) => <PlanCard key={p.id} plan={p} />)}
      </div>
    );
  }

  if (n === 5) {
    const top = plans.slice(0, 3);
    const bottom = plans.slice(3);
    return (
      <div className="space-y-6 max-w-5xl mx-auto">
        <div className="grid gap-6 md:grid-cols-3">
          {top.map((p) => <PlanCard key={p.id} plan={p} />)}
        </div>
        <div className="grid gap-6 md:grid-cols-2 max-w-3xl mx-auto">
          {bottom.map((p) => <PlanCard key={p.id} plan={p} />)}
        </div>
      </div>
    );
  }

  if (n === 6) {
    return (
      <div className="grid gap-6 mx-auto max-w-5xl md:grid-cols-3">
        {plans.map((p) => <PlanCard key={p.id} plan={p} />)}
      </div>
    );
  }

  // 7+
  return (
    <div className="grid gap-6 mx-auto max-w-5xl sm:grid-cols-2 md:grid-cols-3">
      {plans.map((p) => <PlanCard key={p.id} plan={p} />)}
    </div>
  );
}
