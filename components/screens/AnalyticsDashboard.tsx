"use client";

import {
  Activity,
  BarChart3,
  Brain,
  Factory,
  FileClock,
  Gauge,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  UploadCloud
} from "lucide-react";
import { MetricTile } from "@/components/ui/MetricTile";
import { PanelHeader } from "@/components/ui/PanelHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import {
  auditEvents,
  healthMetrics,
  productionInsights,
  recommendations,
  revisionEvents,
  transferPackages,
  type UserRole
} from "@/lib/platform-data";

type AnalyticsDashboardProps = {
  activeRole: UserRole;
};

const metricIcons = [UploadCloud, FileClock, Gauge, TrendingDown];

export function AnalyticsDashboard({ activeRole }: AnalyticsDashboardProps) {
  return (
    <div className="min-h-[calc(100vh-158px)] space-y-4">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {productionInsights.map((item, index) => (
          <MetricTile
            key={item.label}
            label={item.label}
            value={item.value}
            change={item.change}
            icon={metricIcons[index]}
          />
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_390px]">
        <section className="min-w-0 overflow-hidden rounded-lg border border-line bg-white shadow-panel">
          <PanelHeader title="Production Intelligence" eyebrow={`Dashboard role: ${activeRole}`} icon={BarChart3} />
          <div className="grid gap-4 p-4 lg:grid-cols-2">
            <section className="rounded-lg border border-line bg-panel p-4">
              <div className="flex items-center gap-2 text-sm font-bold text-ink">
                <Factory aria-hidden="true" className="text-marine" size={18} />
                Manufacturing performance
              </div>
              <div className="mt-4 space-y-4">
                {healthMetrics.map((metric) => (
                  <div key={metric.label}>
                    <div className="flex items-center justify-between gap-3 text-sm">
                      <span className="font-semibold text-ink">{metric.label}</span>
                      <span className="font-bold text-marine">
                        {metric.value}{metric.unit}
                      </span>
                    </div>
                    <div className="mt-2 h-3 overflow-hidden rounded-full bg-white">
                      <div
                        className={metric.label === "Downtime Risk" ? "h-full bg-amber" : "h-full bg-cyan"}
                        style={{ width: `${Math.min(metric.value, 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-lg border border-line bg-panel p-4">
              <div className="flex items-center gap-2 text-sm font-bold text-ink">
                <TrendingUp aria-hidden="true" className="text-success" size={18} />
                Transfer status mix
              </div>
              <div className="mt-4 space-y-3">
                {transferPackages.map((transfer) => (
                  <div key={transfer.id} className="rounded-md bg-white p-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-ink">{transfer.title}</p>
                        <p className="text-xs text-steel">{transfer.id}</p>
                      </div>
                      <StatusBadge status={transfer.status} />
                    </div>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-panel">
                      <div className="h-full bg-success" style={{ width: `${transfer.progress}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-lg border border-line bg-panel p-4 lg:col-span-2">
              <div className="flex items-center gap-2 text-sm font-bold text-ink">
                <FileClock aria-hidden="true" className="text-amber" size={18} />
                Revision history and change tracking
              </div>
              <div className="mt-4 overflow-x-auto rounded-lg border border-line bg-white">
                <table className="w-full min-w-[760px] border-collapse text-left text-sm">
                  <thead className="bg-panel text-xs font-bold text-steel">
                    <tr>
                      <th className="px-4 py-3">Change ID</th>
                      <th className="px-4 py-3">Asset</th>
                      <th className="px-4 py-3">Actor</th>
                      <th className="px-4 py-3">Revision</th>
                      <th className="px-4 py-3">Reason</th>
                    </tr>
                  </thead>
                  <tbody>
                    {revisionEvents.map((event) => (
                      <tr key={event.id} className="border-t border-line">
                        <td className="px-4 py-3 font-bold text-marine">{event.id}</td>
                        <td className="px-4 py-3 font-semibold text-ink">{event.asset}</td>
                        <td className="px-4 py-3 text-steel">{event.actor}</td>
                        <td className="px-4 py-3 text-steel">{event.previous} to {event.updated}</td>
                        <td className="px-4 py-3 text-steel">{event.reason}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </section>

        <aside className="grid min-w-0 gap-4">
          <section className="overflow-hidden rounded-lg border border-line bg-white shadow-panel">
            <PanelHeader title="AI Reports" eyebrow="Design and cost recommendations" icon={Brain} />
            <div className="thin-scrollbar max-h-[420px] overflow-auto p-4">
              <div className="space-y-3">
                {recommendations.map((item) => (
                  <article key={item.id} className="rounded-lg border border-line bg-panel p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-cyan">{item.category} | {item.id}</p>
                        <h3 className="mt-1 text-sm font-bold text-ink">{item.title}</h3>
                      </div>
                      <span className="shrink-0 rounded-md bg-success/10 px-2 py-1 text-xs font-bold text-success">
                        {item.confidence}%
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-steel">{item.impact}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className="rounded-lg border border-line bg-white shadow-panel">
            <PanelHeader title="Security Audit" eyebrow="Compliance events" icon={ShieldCheck} />
            <div className="space-y-3 p-4">
              {auditEvents.slice(0, 4).map((event) => (
                <div key={event} className="flex gap-3 rounded-md bg-panel p-3">
                  <ShieldCheck aria-hidden="true" className="mt-0.5 shrink-0 text-success" size={16} />
                  <p className="text-sm text-steel">{event}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-line bg-white p-4 shadow-panel">
            <div className="flex items-center gap-2 text-sm font-bold text-ink">
              <Activity aria-hidden="true" className="text-cyan" size={18} />
              Platform throughput
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3 text-center">
              <SmallStat label="Engineers" value="126" />
              <SmallStat label="Plants" value="18" />
              <SmallStat label="Assets" value="4.8k" />
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}

function SmallStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-panel p-3">
      <p className="text-lg font-bold text-ink">{value}</p>
      <p className="mt-1 text-xs font-semibold text-steel">{label}</p>
    </div>
  );
}
