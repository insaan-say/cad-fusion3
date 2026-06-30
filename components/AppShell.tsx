"use client";

import {
  Activity,
  BarChart3,
  Bell,
  Box,
  Brain,
  Building2,
  Database,
  FileClock,
  LockKeyhole,
  Radio,
  ShieldCheck,
  UploadCloud,
  UserCog,
  Wrench
} from "lucide-react";
import { useState } from "react";
import { AnalyticsDashboard } from "@/components/screens/AnalyticsDashboard";
import { EngineerWorkspace } from "@/components/screens/EngineerWorkspace";
import { RepairCollaboration } from "@/components/screens/RepairCollaboration";
import { TechnologyTransferDashboard } from "@/components/screens/TechnologyTransferDashboard";
import { roleCapabilities, roles, type UserRole } from "@/lib/platform-data";

type ScreenKey = "engineer" | "repair" | "transfer" | "analytics";

const navItems = [
  { key: "engineer", label: "Engineer", icon: Box },
  { key: "repair", label: "Repair", icon: Wrench },
  { key: "transfer", label: "Transfers", icon: UploadCloud },
  { key: "analytics", label: "Analytics", icon: BarChart3 }
] satisfies Array<{ key: ScreenKey; label: string; icon: typeof Box }>;

export function AppShell() {
  const [activeScreen, setActiveScreen] = useState<ScreenKey>("engineer");
  const [role, setRole] = useState<UserRole>("Engineer");

  return (
    <main className="min-h-screen text-ink">
      <div className="mx-auto flex min-h-screen w-full max-w-[1600px] flex-col lg:flex-row">
        <aside className="border-b border-line bg-ink text-white lg:sticky lg:top-0 lg:h-screen lg:w-72 lg:border-b-0 lg:border-r lg:border-white/10">
          <div className="flex items-center gap-3 px-5 py-5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-cyan text-white">
              <ShieldCheck aria-hidden="true" size={23} />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-cyan">Secure industrial SaaS</p>
              <h1 className="text-lg font-bold leading-tight">
                3D Transfer Platform
              </h1>
            </div>
          </div>

          <nav className="flex gap-2 overflow-x-auto px-4 pb-4 lg:flex-col lg:overflow-visible lg:pb-0">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeScreen === item.key;

              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setActiveScreen(item.key)}
                  className={`flex h-11 min-w-32 items-center gap-3 rounded-md px-3 text-left text-sm font-semibold transition ${
                    isActive
                      ? "bg-white text-ink"
                      : "bg-white/5 text-white/80 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon aria-hidden="true" size={18} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="hidden px-5 py-5 lg:block">
            <div className="rounded-lg border border-white/10 bg-white/5 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                <LockKeyhole aria-hidden="true" size={17} />
                RBAC Session
              </div>
              <select
                value={role}
                onChange={(event) => setRole(event.target.value as UserRole)}
                className="mt-3 h-10 w-full rounded-md border border-white/20 bg-ink px-3 text-sm text-white outline-none focus:border-cyan"
                aria-label="Select active role"
              >
                {roles.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
              <div className="mt-3 space-y-2">
                {roleCapabilities[role].map((capability) => (
                  <div key={capability} className="flex items-center gap-2 text-xs text-white/72">
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan" />
                    <span>{capability}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>

        <section className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 border-b border-line bg-white/95 px-4 py-3 backdrop-blur md:px-6">
            <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-marine">Industrial 3D Technology Transfer & Remote Engineering Collaboration Platform</p>
                <div className="mt-2 flex flex-wrap gap-2 text-xs font-semibold text-steel">
                  <span className="inline-flex h-7 items-center rounded-md border border-line bg-panel px-2.5">
                    <Database aria-hidden="true" className="mr-1.5" size={14} />
                    Versioned CAD assets
                  </span>
                  <span className="inline-flex h-7 items-center rounded-md border border-line bg-panel px-2.5">
                    <Radio aria-hidden="true" className="mr-1.5" size={14} />
                    Live collaboration
                  </span>
                  <span className="inline-flex h-7 items-center rounded-md border border-line bg-panel px-2.5">
                    <Brain aria-hidden="true" className="mr-1.5" size={14} />
                    AI engineering review
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={role}
                  onChange={(event) => setRole(event.target.value as UserRole)}
                  className="h-10 rounded-md border border-line bg-white px-3 text-sm font-semibold text-ink outline-none focus:border-marine lg:hidden"
                  aria-label="Select active role"
                >
                  {roles.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
                <button
                  type="button"
                  title="Organization controls"
                  className="flex h-10 w-10 items-center justify-center rounded-md border border-line bg-white text-steel hover:border-marine hover:text-marine"
                >
                  <Building2 aria-hidden="true" size={18} />
                </button>
                <button
                  type="button"
                  title="Security events"
                  className="flex h-10 w-10 items-center justify-center rounded-md border border-line bg-white text-steel hover:border-marine hover:text-marine"
                >
                  <Bell aria-hidden="true" size={18} />
                </button>
                <button
                  type="button"
                  title="User administration"
                  className="flex h-10 w-10 items-center justify-center rounded-md border border-line bg-white text-steel hover:border-marine hover:text-marine"
                >
                  <UserCog aria-hidden="true" size={18} />
                </button>
              </div>
            </div>
          </header>

          <div className="flex-1 px-4 py-4 md:px-6 md:py-5">
            {activeScreen === "engineer" ? <EngineerWorkspace activeRole={role} /> : null}
            {activeScreen === "repair" ? <RepairCollaboration activeRole={role} /> : null}
            {activeScreen === "transfer" ? <TechnologyTransferDashboard activeRole={role} /> : null}
            {activeScreen === "analytics" ? <AnalyticsDashboard activeRole={role} /> : null}
          </div>

          <footer className="border-t border-line bg-white px-4 py-3 text-xs text-steel md:px-6">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <span>Encrypted transfer, full audit trail, controlled access, and Socket.io collaboration endpoints scaffolded.</span>
              <span className="inline-flex items-center gap-2 font-semibold text-success">
                <Activity aria-hidden="true" size={14} />
                Platform status: operational demo
              </span>
            </div>
          </footer>
        </section>
      </div>
    </main>
  );
}
