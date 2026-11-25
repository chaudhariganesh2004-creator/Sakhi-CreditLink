import React, { useState } from "react";
import { ArrowRight, Camera, CheckCircle2, ClipboardList, WifiOff } from "lucide-react";
import type { NavScreenId, SHGCase } from "@/data/sakhi-data";
import {
  SectionHeader,
  StageChip,
  TaskStatusChip,
} from "@/components/shared/ui-primitives";
import { cn } from "@/lib/utils";

interface FieldFollowupsProps {
  cases: SHGCase[];
  onSelectCase: (caseId: string, navigateTo?: NavScreenId) => void;
  onUpdateCase: (updated: SHGCase) => void;
}

export const FieldFollowupsScreen: React.FC<FieldFollowupsProps> = ({
  cases,
  onSelectCase,
  onUpdateCase,
}) => {
  const [visitNote, setVisitNote] = useState("");
  const [selectedCaseForNote, setSelectedCaseForNote] = useState(cases[0]?.id ?? "");
  const [offlineSyncQueued, setOfflineSyncQueued] = useState(false);

  const allTasks = cases.flatMap((c) =>
    c.tasks.map((t) => ({ ...t, shgId: c.id, shgName: c.shgName, caseCode: c.caseCode, shg: c }))
  );

  const toggleTaskComplete = (shg: SHGCase, taskId: string) => {
    onUpdateCase({
      ...shg,
      tasks: shg.tasks.map((t) =>
        t.id === taskId
          ? { ...t, status: t.status === "Completed" ? "Pending" : "Completed" }
          : t
      ),
    });
  };

  const handleLogVisit = (e: React.FormEvent) => {
    e.preventDefault();
    const target = cases.find((c) => c.id === selectedCaseForNote);
    if (!target || !visitNote.trim()) return;
    onUpdateCase({
      ...target,
      timeline: [
        {
          id: `vis-${Date.now()}`,
          stage: "Field Visit Note",
          actor: `${target.bankSakhiName} (Bank Sakhi)`,
          timestamp: "26 Nov 2026 · Field Capture",
          note: visitNote.trim(),
        },
        ...target.timeline,
      ],
    });
    setVisitNote("");
  };

  return (
    <div className="space-y-6 animate-fade-in-up" style={{ animationDuration: "0.35s" }}>
      <SectionHeader
        eyebrow="Field Workspace · Bank Sakhi Queue"
        title="Field Follow-ups & Document Capture"
        subtitle="Prioritised due and overdue actions across assigned clusters, built for low-bandwidth assisted field visits."
        rightSlot={
          <button
            onClick={() => setOfflineSyncQueued(!offlineSyncQueued)}
            className={cn(
              "inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-[12.5px] font-medium transition-colors",
              offlineSyncQueued
                ? "border-amber-200 bg-amber-50 text-amber-800"
                : "border-[var(--sakhi-border)] bg-white text-[var(--sakhi-slate)] hover:bg-[var(--sakhi-surface)]"
            )}
          >
            <WifiOff className="h-3.5 w-3.5 text-amber-600" />
            {offlineSyncQueued ? "Offline Draft Mode Active" : "Low-Bandwidth Sync: Ready"}
          </button>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <section className="lg:col-span-7 rounded-2xl border border-[var(--sakhi-border)] bg-white p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--sakhi-border)] pb-3.5">
            <h2 className="flex items-center gap-2 text-[16px] font-bold text-[var(--sakhi-slate)]">
              <ClipboardList className="h-4 w-4 text-[var(--sakhi-forest)]" />
              Prioritised Cluster Action Queue
            </h2>
            <span className="rounded-full bg-[var(--sakhi-surface)] px-3 py-1 font-mono text-[12px] font-semibold text-[var(--sakhi-muted)]">
              {allTasks.filter((t) => t.status !== "Completed").length} pending
            </span>
          </div>

          <div className="space-y-3">
            {allTasks.map((t) => (
              <div
                key={t.id}
                className="flex flex-col gap-3 rounded-xl border border-[var(--sakhi-border)] bg-[var(--sakhi-surface)] p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-[11px] text-[var(--sakhi-muted)]">{t.caseCode}</span>
                    <span className="text-[14px] font-semibold text-[var(--sakhi-slate)]">{t.shgName}</span>
                    <TaskStatusChip status={t.status} />
                  </div>
                  <div className="text-[13px] text-[var(--sakhi-slate)]">{t.title}</div>
                  <div className="text-[12px] text-[var(--sakhi-muted)]">
                    Owner: {t.owner} · Due {t.dueDate}
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2.5">
                  <button
                    onClick={() => toggleTaskComplete(t.shg, t.id)}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--sakhi-border)] bg-white px-3 py-1.5 text-[12px] font-semibold text-[var(--sakhi-slate)] transition-colors hover:bg-[var(--sakhi-mint)]"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 text-[var(--sakhi-forest)]" />
                    {t.status === "Completed" ? "Reopen" : "Complete"}
                  </button>
                  <button
                    onClick={() => onSelectCase(t.shgId, "application-pack")}
                    className="inline-flex items-center gap-1 text-[12.5px] font-semibold text-[var(--sakhi-forest)] hover:underline"
                  >
                    Case <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Visit Note & Assisted Evidence */}
        <section className="lg:col-span-5 rounded-2xl border border-[var(--sakhi-border)] bg-white p-6 space-y-5">
          <h2 className="border-b border-[var(--sakhi-border)] pb-3.5 text-[16px] font-bold text-[var(--sakhi-slate)]">
            Log Field Visit Note
          </h2>
          <form onSubmit={handleLogVisit} className="space-y-4">
            <div>
              <label className="block text-[12.5px] font-semibold text-[var(--sakhi-slate)]">
                Select SHG Case
              </label>
              <select
                value={selectedCaseForNote}
                onChange={(e) => setSelectedCaseForNote(e.target.value)}
                className="mt-1.5 h-10 w-full rounded-xl border border-[var(--sakhi-border)] bg-[var(--sakhi-surface)] px-3 text-[13px] text-[var(--sakhi-slate)] focus:border-[var(--sakhi-forest)] focus:bg-white focus:outline-none"
              >
                {cases.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.shgName} ({c.caseCode})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[12.5px] font-semibold text-[var(--sakhi-slate)]">
                Visit Observation / Document Follow-up
              </label>
              <textarea
                rows={4}
                value={visitNote}
                onChange={(e) => setVisitNote(e.target.value)}
                placeholder="e.g., Collected signed Anand Consumer Co-op purchase letter during Chikhodra cluster visit."
                className="mt-1.5 w-full rounded-xl border border-[var(--sakhi-border)] bg-[var(--sakhi-surface)] p-3 text-[13px] text-[var(--sakhi-slate)] focus:border-[var(--sakhi-forest)] focus:bg-white focus:outline-none"
              />
            </div>
            <div className="flex items-center justify-between gap-2 pt-1">
              <span className="inline-flex items-center gap-1.5 text-[12px] text-[var(--sakhi-muted)]">
                <Camera className="h-4 w-4 text-[var(--sakhi-forest)]" /> Saved to case audit trail
              </span>
              <button
                type="submit"
                className="rounded-xl bg-[var(--sakhi-forest)] px-5 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-[var(--sakhi-forest-deep)]"
              >
                Save Visit Note
              </button>
            </div>
          </form>

          <div className="space-y-2.5 border-t border-[var(--sakhi-border)] pt-4">
            <div className="text-[11px] font-semibold uppercase tracking-widest text-[var(--sakhi-muted)]">
              Assigned Cluster Snapshots
            </div>
            {cases.slice(0, 3).map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between rounded-xl border border-[var(--sakhi-border)] bg-[var(--sakhi-surface)] px-3.5 py-2.5 text-[13px]"
              >
                <span className="font-medium text-[var(--sakhi-slate)]">{c.shgName}</span>
                <StageChip stage={c.stage} />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
