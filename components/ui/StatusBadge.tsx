import type { TransferStatus } from "@/lib/platform-data";

type StatusBadgeProps = {
  status: TransferStatus | "Released" | "Review" | "Quarantine" | "Prototype" | "Done" | "Active" | "Waiting";
};

const statusStyles: Record<StatusBadgeProps["status"], string> = {
  Draft: "border-steel/25 bg-steel/10 text-steel",
  Approval: "border-amber/30 bg-amber/10 text-amber",
  "In Progress": "border-cyan/30 bg-cyan/10 text-cyan",
  Complete: "border-success/30 bg-success/10 text-success",
  Blocked: "border-danger/30 bg-danger/10 text-danger",
  Released: "border-success/30 bg-success/10 text-success",
  Review: "border-amber/30 bg-amber/10 text-amber",
  Quarantine: "border-danger/30 bg-danger/10 text-danger",
  Prototype: "border-cyan/30 bg-cyan/10 text-cyan",
  Done: "border-success/30 bg-success/10 text-success",
  Active: "border-cyan/30 bg-cyan/10 text-cyan",
  Waiting: "border-steel/25 bg-steel/10 text-steel"
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={`inline-flex h-7 items-center rounded-md border px-2.5 text-xs font-semibold ${statusStyles[status]}`}>
      {status}
    </span>
  );
}
