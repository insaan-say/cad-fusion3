"use client";

import {
  Building2,
  CheckCircle2,
  Download,
  FileText,
  KeyRound,
  LockKeyhole,
  Route,
  ShieldCheck,
  UploadCloud,
  Users
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { PanelHeader } from "@/components/ui/PanelHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import {
  auditEvents,
  roles,
  transferPackages,
  type TransferPackage,
  type UserRole
} from "@/lib/platform-data";

type TechnologyTransferDashboardProps = {
  activeRole: UserRole;
};

const fileStatusStyles = {
  Encrypted: "border-marine/25 bg-marine/10 text-marine",
  Approved: "border-success/30 bg-success/10 text-success",
  Pending: "border-amber/30 bg-amber/10 text-amber"
};

export function TechnologyTransferDashboard({ activeRole }: TechnologyTransferDashboardProps) {
  const [selectedTransferId, setSelectedTransferId] = useState(transferPackages[0].id);

  const selectedTransfer = useMemo(
    () => transferPackages.find((transfer) => transfer.id === selectedTransferId) ?? transferPackages[0],
    [selectedTransferId]
  );

  return (
    <div className="grid min-h-[calc(100vh-158px)] gap-4 xl:grid-cols-[320px_minmax(0,1fr)_350px]">
      <section className="overflow-hidden rounded-lg border border-line bg-white shadow-panel">
        <PanelHeader title="Transfer Queue" eyebrow="Technology Transfer" icon={UploadCloud} />
        <div className="thin-scrollbar max-h-[calc(100vh-245px)] overflow-auto p-3">
          <div className="space-y-3">
            {transferPackages.map((transfer) => (
              <TransferListItem
                key={transfer.id}
                transfer={transfer}
                isSelected={transfer.id === selectedTransferId}
                onSelect={() => setSelectedTransferId(transfer.id)}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="min-w-0 overflow-hidden rounded-lg border border-line bg-white shadow-panel">
        <PanelHeader
          title={selectedTransfer.title}
          eyebrow={`${selectedTransfer.id} | ${selectedTransfer.classification}`}
          icon={Route}
          action={<StatusBadge status={selectedTransfer.status} />}
        />

        <div className="thin-scrollbar max-h-[calc(100vh-245px)] overflow-auto p-4">
          <div className="grid gap-4 md:grid-cols-3">
            <TransferFact icon={Building2} label="From" value={selectedTransfer.from} />
            <TransferFact icon={Building2} label="To" value={selectedTransfer.to} />
            <TransferFact icon={ShieldCheck} label="Approver" value={selectedTransfer.approver} />
          </div>

          <div className="mt-4 rounded-lg border border-line bg-panel p-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-bold text-ink">Approval workflow progress</p>
                <p className="text-xs text-steel">Due {selectedTransfer.due}; current role: {activeRole}</p>
              </div>
              <span className="text-sm font-bold text-marine">{selectedTransfer.progress}%</span>
            </div>
            <div className="mt-3 h-3 overflow-hidden rounded-full bg-white">
              <div className="h-full bg-cyan" style={{ width: `${selectedTransfer.progress}%` }} />
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-4">
              {["Package prepared", "Security scan", "Org approval", "Receiver acceptance"].map((label, index) => (
                <div key={label} className="rounded-md border border-line bg-white p-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2
                      aria-hidden="true"
                      className={index < 2 || selectedTransfer.progress === 100 ? "text-success" : "text-steel"}
                      size={16}
                    />
                    <p className="text-xs font-bold text-ink">{label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 overflow-hidden rounded-lg border border-line">
            <div className="flex items-center justify-between gap-3 border-b border-line bg-panel px-4 py-3">
              <div className="flex items-center gap-2 text-sm font-bold text-ink">
                <FileText aria-hidden="true" className="text-marine" size={18} />
                Transfer files
              </div>
              <button
                type="button"
                title="Download approved package"
                className="flex h-9 w-9 items-center justify-center rounded-md border border-line bg-white text-steel hover:text-marine"
              >
                <Download aria-hidden="true" size={17} />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[680px] border-collapse text-left text-sm">
                <thead className="bg-white text-xs font-bold text-steel">
                  <tr>
                    <th className="px-4 py-3">File</th>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3">Size</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedTransfer.files.map((file) => (
                    <tr key={file.name} className="border-t border-line">
                      <td className="px-4 py-3 font-semibold text-ink">{file.name}</td>
                      <td className="px-4 py-3 text-steel">{file.type}</td>
                      <td className="px-4 py-3 text-steel">{file.size}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex h-7 items-center rounded-md border px-2.5 text-xs font-bold ${fileStatusStyles[file.status]}`}>
                          {file.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <section className="rounded-lg border border-line bg-panel p-4">
              <div className="flex items-center gap-2 text-sm font-bold text-ink">
                <Users aria-hidden="true" className="text-cyan" size={18} />
                Access permissions
              </div>
              <div className="mt-3 grid gap-2">
                {roles.map((role) => (
                  <div key={role} className="flex items-center justify-between gap-3 rounded-md bg-white px-3 py-2 text-sm">
                    <span className="font-semibold text-ink">{role}</span>
                    <span className="text-xs font-bold text-steel">
                      {role === "Viewer" ? "Read" : role === "Technician" ? "Comment" : "Approve"}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-lg border border-line bg-panel p-4">
              <div className="flex items-center gap-2 text-sm font-bold text-ink">
                <LockKeyhole aria-hidden="true" className="text-success" size={18} />
                Exchange policy
              </div>
              <div className="mt-3 space-y-2 text-sm text-steel">
                <PolicyLine label="Storage" value="Supabase Storage private buckets" />
                <PolicyLine label="Encryption" value="AES-256 object encryption" />
                <PolicyLine label="Audit" value="Immutable activity trail" />
                <PolicyLine label="Retention" value="7 years, exportable by org admin" />
              </div>
            </section>
          </div>
        </div>
      </section>

      <aside className="grid min-w-0 gap-4">
        <section className="rounded-lg border border-line bg-white shadow-panel">
          <PanelHeader title="Secure Upload" eyebrow="CAD and documents" icon={KeyRound} />
          <div className="p-4">
            <div className="rounded-lg border border-dashed border-cyan bg-cyan/10 p-5 text-center">
              <UploadCloud aria-hidden="true" className="mx-auto text-marine" size={30} />
              <p className="mt-2 text-sm font-bold text-ink">Drop STEP, STL, OBJ, GLB, 3D PDF, BOM</p>
              <p className="mt-1 text-xs text-steel">Files are versioned, scanned, encrypted, and assigned to an approval workflow.</p>
            </div>
            <button
              type="button"
              className="mt-4 h-10 w-full rounded-md bg-marine px-3 text-sm font-bold text-white hover:bg-ink"
            >
              Create transfer package
            </button>
          </div>
        </section>

        <section className="overflow-hidden rounded-lg border border-line bg-white shadow-panel">
          <PanelHeader title="Activity Log" eyebrow="Download and approval events" icon={ShieldCheck} />
          <div className="thin-scrollbar max-h-[360px] overflow-auto p-4">
            <div className="space-y-3">
              {auditEvents.map((event, index) => (
                <div key={event} className="border-l-2 border-marine pl-3">
                  <p className="text-xs font-bold text-steel">LOG-{2400 + index}</p>
                  <p className="mt-1 text-sm text-ink">{event}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </aside>
    </div>
  );
}

function TransferListItem({
  transfer,
  isSelected,
  onSelect
}: {
  transfer: TransferPackage;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full rounded-lg border p-3 text-left transition ${
        isSelected ? "border-marine bg-marine/10" : "border-line bg-white hover:border-cyan hover:bg-panel"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-ink">{transfer.title}</p>
          <p className="mt-1 truncate text-xs text-steel">{transfer.from} to {transfer.to}</p>
        </div>
        <StatusBadge status={transfer.status} />
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-panel">
        <div className="h-full bg-cyan" style={{ width: `${transfer.progress}%` }} />
      </div>
    </button>
  );
}

function TransferFact({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="rounded-lg border border-line bg-panel p-4">
      <div className="flex items-center gap-2 text-xs font-bold text-steel">
        <Icon aria-hidden="true" size={15} />
        {label}
      </div>
      <p className="mt-2 text-sm font-bold text-ink">{value}</p>
    </div>
  );
}

function PolicyLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3 rounded-md bg-white px-3 py-2">
      <span className="font-semibold text-ink">{label}</span>
      <span className="text-right text-steel">{value}</span>
    </div>
  );
}
