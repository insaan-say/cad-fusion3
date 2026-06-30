"use client";

import {
  Activity,
  AlertTriangle,
  Camera,
  CheckCircle2,
  ClipboardList,
  Gauge,
  MessageSquare,
  Radio,
  ShieldCheck,
  Wrench
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useState } from "react";
import { PanelHeader } from "@/components/ui/PanelHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { IndustrialModelViewer } from "@/components/viewer/IndustrialModelViewer";
import {
  collaborationMessages,
  engineeringParts,
  healthMetrics,
  repairSteps,
  type UserRole
} from "@/lib/platform-data";

type RepairCollaborationProps = {
  activeRole: UserRole;
};

export function RepairCollaboration({ activeRole }: RepairCollaborationProps) {
  const [selectedPartId, setSelectedPartId] = useState("hydraulic-manifold");
  const [activeStepId, setActiveStepId] = useState("RS-2");

  return (
    <div className="grid min-h-[calc(100vh-158px)] gap-4 xl:grid-cols-[minmax(0,1fr)_390px]">
      <section className="min-w-0">
        <div className="mb-4 grid gap-4 md:grid-cols-4">
          <LiveTile icon={Radio} label="Session" value="Live" tone="cyan" />
          <LiveTile icon={AlertTriangle} label="Fault" value="Leak F-22" tone="danger" />
          <LiveTile icon={Wrench} label="Workflow" value="Step 2 of 4" tone="amber" />
          <LiveTile icon={ShieldCheck} label="Role" value={activeRole} tone="success" />
        </div>

        <IndustrialModelViewer selectedPartId={selectedPartId} onSelectPart={setSelectedPartId} mode="repair" />

        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          <section className="rounded-lg border border-line bg-white shadow-panel lg:col-span-2">
            <PanelHeader title="Digital Twin Health" eyebrow="Machine HPU-14" icon={Gauge} />
            <div className="grid gap-3 p-4 md:grid-cols-2">
              {healthMetrics.map((metric) => (
                <div key={metric.label} className="rounded-lg border border-line bg-panel p-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-bold text-ink">{metric.label}</p>
                    <p className="text-sm font-bold text-marine">
                      {metric.value}{metric.unit}
                    </p>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-white">
                    <div
                      className={metric.value > metric.target && metric.label === "Downtime Risk" ? "h-full bg-danger" : "h-full bg-success"}
                      style={{ width: `${Math.min(metric.value, 100)}%` }}
                    />
                  </div>
                  <p className="mt-2 text-xs text-steel">
                    Target: {metric.target}{metric.unit}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-line bg-white shadow-panel">
            <PanelHeader title="Field Evidence" eyebrow="Technician feedback" icon={Camera} />
            <div className="space-y-3 p-4">
              <div className="rounded-lg border border-dashed border-line bg-panel p-4 text-center">
                <Camera aria-hidden="true" className="mx-auto text-marine" size={28} />
                <p className="mt-2 text-sm font-bold text-ink">Thermal image queued</p>
                <p className="mt-1 text-xs text-steel">Attached to marker F-22 with timestamp and operator ID.</p>
              </div>
              <button
                type="button"
                className="h-10 w-full rounded-md bg-marine px-3 text-sm font-bold text-white hover:bg-ink"
              >
                Submit technician feedback
              </button>
            </div>
          </section>
        </div>
      </section>

      <aside className="grid min-w-0 gap-4">
        <section className="overflow-hidden rounded-lg border border-line bg-white shadow-panel">
          <PanelHeader title="Repair Workflow" eyebrow="Remote assistance" icon={ClipboardList} />
          <div className="thin-scrollbar max-h-[340px] overflow-auto p-4">
            <div className="space-y-3">
              {repairSteps.map((step) => {
                const isActive = activeStepId === step.id;
                return (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => setActiveStepId(step.id)}
                    className={`w-full rounded-lg border p-3 text-left transition ${
                      isActive
                        ? "border-cyan bg-cyan/10"
                        : "border-line bg-white hover:border-marine hover:bg-panel"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-ink">{step.label}</p>
                        <p className="mt-1 text-xs font-semibold text-steel">{step.owner}</p>
                      </div>
                      <StatusBadge status={step.status} />
                    </div>
                    <p className="mt-3 text-sm text-steel">{step.instruction}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-lg border border-line bg-white shadow-panel">
          <PanelHeader title="Live Chat" eyebrow="Engineer and technician" icon={MessageSquare} />
          <div className="thin-scrollbar max-h-[300px] overflow-auto p-4">
            <div className="space-y-3">
              {collaborationMessages.map((item) => (
                <article key={item.id} className="rounded-lg border border-line bg-panel p-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-bold text-ink">{item.sender}</p>
                    <span className="text-xs font-semibold text-steel">{item.time}</span>
                  </div>
                  <p className="mt-2 text-sm text-steel">{item.message}</p>
                </article>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <input
                aria-label="Collaboration message"
                className="h-10 min-w-0 flex-1 rounded-md border border-line px-3 text-sm outline-none focus:border-marine"
                placeholder="Send repair instruction"
              />
              <button type="button" className="h-10 rounded-md bg-ink px-4 text-sm font-bold text-white hover:bg-marine">
                Send
              </button>
            </div>
          </div>
        </section>

        <section className="rounded-lg border border-line bg-white p-4 shadow-panel">
          <div className="flex items-center gap-2 text-sm font-bold text-ink">
            <Activity aria-hidden="true" className="text-success" size={18} />
            Remote maintenance outcome
          </div>
          <div className="mt-3 grid gap-3">
            <OutcomeLine label="Downtime avoided" value="7.5 hours" />
            <OutcomeLine label="Replacement recommendation" value="BC-77 cartridge kit" />
            <OutcomeLine
              label="Selected component"
              value={engineeringParts.find((part) => part.id === selectedPartId)?.name ?? "Assembly"}
            />
          </div>
        </section>
      </aside>
    </div>
  );
}

type LiveTileProps = {
  icon: LucideIcon;
  label: string;
  value: string;
  tone: "cyan" | "danger" | "amber" | "success";
};

const tileTone: Record<LiveTileProps["tone"], string> = {
  cyan: "bg-cyan/10 text-cyan",
  danger: "bg-danger/10 text-danger",
  amber: "bg-amber/10 text-amber",
  success: "bg-success/10 text-success"
};

function LiveTile({ icon: Icon, label, value, tone }: LiveTileProps) {
  return (
    <div className="rounded-lg border border-line bg-white p-4 shadow-panel">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold text-steel">{label}</p>
          <p className="mt-1 truncate text-lg font-bold text-ink">{value}</p>
        </div>
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md ${tileTone[tone]}`}>
          <Icon aria-hidden="true" size={20} />
        </div>
      </div>
    </div>
  );
}

function OutcomeLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-2 rounded-md bg-panel p-3">
      <CheckCircle2 aria-hidden="true" className="mt-0.5 shrink-0 text-success" size={16} />
      <div className="min-w-0">
        <p className="text-xs font-semibold text-steel">{label}</p>
        <p className="truncate text-sm font-bold text-ink">{value}</p>
      </div>
    </div>
  );
}
