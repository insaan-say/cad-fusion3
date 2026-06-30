"use client";

import {
  BadgeCheck,
  Brain,
  ClipboardCheck,
  FileText,
  History,
  Layers3,
  LockKeyhole,
  MessageSquarePlus,
  Ruler,
  ShieldCheck
} from "lucide-react";
import { useMemo, useState } from "react";
import { PanelHeader } from "@/components/ui/PanelHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { IndustrialModelViewer } from "@/components/viewer/IndustrialModelViewer";
import {
  auditEvents,
  engineeringParts,
  recommendations,
  revisionEvents,
  type UserRole
} from "@/lib/platform-data";

type EngineerWorkspaceProps = {
  activeRole: UserRole;
};

export function EngineerWorkspace({ activeRole }: EngineerWorkspaceProps) {
  const [selectedPartId, setSelectedPartId] = useState(engineeringParts[0].id);

  const selectedPart = useMemo(
    () => engineeringParts.find((part) => part.id === selectedPartId) ?? engineeringParts[0],
    [selectedPartId]
  );

  const partRecommendations = recommendations.filter((item) => item.partId === selectedPartId);

  return (
    <div className="grid min-h-[calc(100vh-158px)] gap-4 xl:grid-cols-[290px_minmax(0,1fr)_360px]">
      <section className="order-2 min-w-0 overflow-hidden rounded-lg border border-line bg-white shadow-panel xl:order-1">
        <PanelHeader title="Parts Tree" eyebrow="Engineer Workspace" icon={Layers3} />
        <div className="thin-scrollbar max-h-[calc(100vh-245px)] overflow-auto p-3">
          <div className="rounded-lg border border-line bg-panel p-3">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-ink">Compressor assembly</p>
                <p className="text-xs text-steel">TT-2409 | Controlled package</p>
              </div>
              <ShieldCheck aria-hidden="true" className="shrink-0 text-success" size={20} />
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-white">
              <div className="h-full w-[72%] bg-cyan" />
            </div>
          </div>

          <div className="mt-3 space-y-2">
            {engineeringParts.map((part) => {
              const isSelected = part.id === selectedPartId;
              return (
                <button
                  key={part.id}
                  type="button"
                  onClick={() => setSelectedPartId(part.id)}
                  className={`w-full rounded-lg border p-3 text-left transition ${
                    isSelected
                      ? "border-marine bg-marine/10 shadow-sm"
                      : "border-line bg-white hover:border-cyan hover:bg-panel"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-ink">{part.name}</p>
                      <p className="mt-1 truncate text-xs text-steel">{part.system}</p>
                    </div>
                    <StatusBadge status={part.status} />
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-steel">
                    <span className="rounded-md bg-panel px-2 py-1">{part.revision}</span>
                    <span className="rounded-md bg-panel px-2 py-1">{part.massKg} kg</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="order-1 min-w-0 xl:order-2">
        <IndustrialModelViewer selectedPartId={selectedPartId} onSelectPart={setSelectedPartId} />

        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          <div className="rounded-lg border border-line bg-white p-4 shadow-panel">
            <div className="flex items-center gap-2 text-sm font-bold text-ink">
              <Ruler aria-hidden="true" className="text-marine" size={18} />
              Measurement
            </div>
            <p className="mt-2 text-sm text-steel">
              Tolerance band for {selectedPart.name}: <span className="font-semibold text-ink">{selectedPart.tolerance}</span>
            </p>
          </div>
          <div className="rounded-lg border border-line bg-white p-4 shadow-panel">
            <div className="flex items-center gap-2 text-sm font-bold text-ink">
              <MessageSquarePlus aria-hidden="true" className="text-cyan" size={18} />
              Annotation
            </div>
            <p className="mt-2 text-sm text-steel">
              Latest comment pins the risk area: <span className="font-semibold text-ink">{selectedPart.risk}</span>
            </p>
          </div>
          <div className="rounded-lg border border-line bg-white p-4 shadow-panel">
            <div className="flex items-center gap-2 text-sm font-bold text-ink">
              <LockKeyhole aria-hidden="true" className="text-success" size={18} />
              Access
            </div>
            <p className="mt-2 text-sm text-steel">
              Active role <span className="font-semibold text-ink">{activeRole}</span> can review and comment in this demo session.
            </p>
          </div>
        </div>
      </section>

      <aside className="order-3 min-w-0 overflow-hidden rounded-lg border border-line bg-white shadow-panel">
        <PanelHeader title="Properties & AI" eyebrow={selectedPart.revision} icon={Brain} />
        <div className="thin-scrollbar max-h-[calc(100vh-245px)] overflow-auto p-4">
          <dl className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-lg border border-line bg-panel p-3">
              <dt className="text-xs font-semibold text-steel">Material</dt>
              <dd className="mt-1 font-bold text-ink">{selectedPart.material}</dd>
            </div>
            <div className="rounded-lg border border-line bg-panel p-3">
              <dt className="text-xs font-semibold text-steel">Mass</dt>
              <dd className="mt-1 font-bold text-ink">{selectedPart.massKg} kg</dd>
            </div>
            <div className="rounded-lg border border-line bg-panel p-3">
              <dt className="text-xs font-semibold text-steel">Supplier</dt>
              <dd className="mt-1 font-bold text-ink">{selectedPart.supplier}</dd>
            </div>
            <div className="rounded-lg border border-line bg-panel p-3">
              <dt className="text-xs font-semibold text-steel">Format</dt>
              <dd className="mt-1 font-bold text-ink">{selectedPart.file.split(".").pop()?.toUpperCase()}</dd>
            </div>
          </dl>

          <div className="mt-4 rounded-lg border border-line bg-panel p-3">
            <div className="flex items-center gap-2 text-sm font-bold text-ink">
              <ClipboardCheck aria-hidden="true" className="text-marine" size={18} />
              Manufacturing constraints
            </div>
            <ul className="mt-3 space-y-2 text-sm text-steel">
              <li>Minimum tool access radius: 4.5 mm</li>
              <li>Heat treatment review required before transfer approval</li>
              <li>Metadata retention: material, tolerance, supplier, revision reason</li>
            </ul>
          </div>

          <div className="mt-4">
            <div className="mb-2 flex items-center justify-between gap-3">
              <h3 className="text-sm font-bold text-ink">AI suggestions</h3>
              <span className="text-xs font-semibold text-cyan">{partRecommendations.length || recommendations.length} active</span>
            </div>
            <div className="space-y-3">
              {(partRecommendations.length ? partRecommendations : recommendations.slice(0, 2)).map((item) => (
                <article key={item.id} className="rounded-lg border border-line bg-white p-3 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-cyan">{item.category} | {item.id}</p>
                      <h4 className="mt-1 text-sm font-bold text-ink">{item.title}</h4>
                    </div>
                    <span className="shrink-0 rounded-md bg-success/10 px-2 py-1 text-xs font-bold text-success">
                      {item.confidence}%
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-steel">{item.impact}</p>
                  <p className="mt-2 text-xs font-semibold text-steel">Owner: {item.owner}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="mt-4 rounded-lg border border-line bg-white p-3 shadow-sm">
            <div className="flex items-center gap-2 text-sm font-bold text-ink">
              <History aria-hidden="true" className="text-amber" size={18} />
              Recent changes
            </div>
            <div className="mt-3 space-y-3">
              {revisionEvents.slice(0, 2).map((event) => (
                <div key={event.id} className="border-l-2 border-cyan pl-3">
                  <p className="text-xs font-semibold text-steel">{event.timestamp}</p>
                  <p className="mt-1 text-sm font-semibold text-ink">{event.asset}: {event.previous} to {event.updated}</p>
                  <p className="mt-1 text-xs text-steel">{event.reason}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 rounded-lg border border-line bg-panel p-3">
            <div className="flex items-center gap-2 text-sm font-bold text-ink">
              <FileText aria-hidden="true" className="text-marine" size={18} />
              Audit snapshot
            </div>
            <div className="mt-3 space-y-2">
              {auditEvents.slice(0, 3).map((event) => (
                <div key={event} className="flex gap-2 text-xs text-steel">
                  <BadgeCheck aria-hidden="true" className="mt-0.5 shrink-0 text-success" size={14} />
                  <span>{event}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
