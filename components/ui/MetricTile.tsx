import type { LucideIcon } from "lucide-react";

type MetricTileProps = {
  label: string;
  value: string;
  change: string;
  icon: LucideIcon;
};

export function MetricTile({ label, value, change, icon: Icon }: MetricTileProps) {
  return (
    <div className="rounded-lg border border-line bg-white p-4 shadow-panel">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold text-steel">{label}</p>
          <p className="mt-1 text-2xl font-bold text-ink">{value}</p>
        </div>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-marine/10 text-marine">
          <Icon aria-hidden="true" size={20} />
        </div>
      </div>
      <p className="mt-3 text-sm text-steel">{change}</p>
    </div>
  );
}
