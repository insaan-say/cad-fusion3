import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

type PanelHeaderProps = {
  title: string;
  eyebrow?: string;
  icon?: LucideIcon;
  action?: ReactNode;
};

export function PanelHeader({ title, eyebrow, icon: Icon, action }: PanelHeaderProps) {
  return (
    <div className="flex min-w-0 items-start justify-between gap-3 border-b border-line px-4 py-3">
      <div className="flex min-w-0 items-center gap-3">
        {Icon ? (
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-marine/10 text-marine">
            <Icon aria-hidden="true" size={19} />
          </div>
        ) : null}
        <div className="min-w-0">
          {eyebrow ? <p className="text-xs font-semibold text-cyan">{eyebrow}</p> : null}
          <h2 className="truncate text-base font-bold text-ink">{title}</h2>
        </div>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
