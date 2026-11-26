import React, { useState } from "react";
import { ChevronRight, Pencil, Plus, Trash2, Check, X } from "lucide-react";
import type { AppLanguage, CostLineItem, NavScreenId, ProvenanceLevel, SHGCase, UserRole } from "@/data/sakhi-data";
import { GovernanceNotice, ProvenanceBadge, SectionHeader } from "@/components/shared/ui-primitives";
import { Button } from "@/components/ui/button";
import { Card, EmptyState, Field } from "@/components/ui/primitives";
import { formatINR } from "@/lib/utils";

interface Props {
  shg: SHGCase;
  role: UserRole;
  language: AppLanguage;
  onUpdateCase: (c: SHGCase) => void;
  onNavigate: (s: NavScreenId) => void;
  embeddedInStepper?: boolean;
  onStepNext?: () => void;
}

export const CreditDemandScreen: React.FC<Props> = ({
  shg,
  language,
  onUpdateCase,
  onNavigate,
  embeddedInStepper = false,
  onStepNext,
}) => {
  const showGu = language === "gu";
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editLabel, setEditLabel] = useState("");
  const [editAmount, setEditAmount] = useState<number>(0);
  const [editCategory, setEditCategory] = useState<"Capex" | "Working Capital">("Capex");

  const [newLabel, setNewLabel] = useState("");
  const [newAmount, setNewAmount] = useState("");
  const [newCategory, setNewCategory] = useState<"Capex" | "Working Capital">("Capex");
  const [newProvenance, setNewProvenance] = useState<ProvenanceLevel>("Self-declared");
  const [newNote, setNewNote] = useState("");
  const [formError, setFormError] = useState("");

  const capex = shg.costLines.filter((c) => c.category === "Capex");
  const wc = shg.costLines.filter((c) => c.category === "Working Capital");
  const capexTotal = capex.reduce((s, c) => s + c.amount, 0);
  const wcTotal = wc.reduce((s, c) => s + c.amount, 0);
  const totalCost = capexTotal + wcTotal;
  const externalNeed = Math.max(0, totalCost - shg.ownContribution);

  const startEdit = (line: CostLineItem) => {
    setEditingId(line.id);
    setEditLabel(line.label);
    setEditAmount(line.amount);
    setEditCategory(line.category);
  };

  const saveEdit = (id: string) => {
    if (!editLabel.trim() || editAmount <= 0) return;
    onUpdateCase({
      ...shg,
      costLines: shg.costLines.map((c) =>
        c.id === id
          ? {
              ...c,
              label: editLabel.trim(),
              labelGu: editLabel.trim(),
              amount: Math.round(editAmount),
              category: editCategory,
            }
          : c
      ),
    });
    setEditingId(null);
  };

  const deleteLine = (id: string) => {
    onUpdateCase({
      ...shg,
      costLines: shg.costLines.filter((c) => c.id !== id),
    });
  };

  const handleAddLine = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = Math.round(Number(newAmount));
    if (!newLabel.trim()) {
      setFormError("Enter a clear item description.");
      return;
    }
    if (!amt || amt <= 0) {
      setFormError("Enter a valid amount above ₹0.");
      return;
    }
    setFormError("");
    const created: CostLineItem = {
      id: `cl-${Date.now()}`,
      label: newLabel.trim(),
      labelGu: newLabel.trim(),
      category: newCategory,
      amount: amt,
      provenance: newProvenance,
      note: newNote.trim() || "Added in Credit Demand",
    };
    onUpdateCase({
      ...shg,
      costLines: [...shg.costLines, created],
    });
    setNewLabel("");
    setNewAmount("");
    setNewNote("");
  };

  const handleOwnContributionChange = (val: number) => {
    onUpdateCase({
      ...shg,
      ownContribution: Math.max(0, Math.round(val)),
    });
  };

  const renderTable = (lines: CostLineItem[], label: string) => (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between border-b border-[#DFDBD0] bg-[#F2EFE8] px-5 py-3">
        <span className="text-[14px] font-semibold text-[#141A23]">{label}</span>
        <span className="font-mono text-[14px] font-semibold text-[#0F5E4E] tabular-nums">
          {formatINR(lines.reduce((s, c) => s + c.amount, 0))}
        </span>
      </div>
      {lines.length === 0 ? (
        <div className="p-4">
          <EmptyState
            message={`No ${label.toLowerCase()} items added yet.`}
          />
        </div>
      ) : (
        <div className="divide-y divide-[#DFDBD0]">
          {lines.map((line) => {
            const isEditing = editingId === line.id;
            return (
              <div key={line.id} className="flex flex-col gap-3 px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between">
                {isEditing ? (
                  <div className="flex flex-1 flex-wrap items-center gap-2">
                    <input
                      type="text"
                      value={editLabel}
                      onChange={(e) => setEditLabel(e.target.value)}
                      aria-label="Edit item label"
                      className="min-h-[40px] flex-1 min-w-[180px] rounded-md border border-[#C9C3B4] bg-white px-3 text-[13.5px]"
                    />
                    <select
                      value={editCategory}
                      onChange={(e) => setEditCategory(e.target.value as "Capex" | "Working Capital")}
                      aria-label="Edit category"
                      className="min-h-[40px] rounded-md border border-[#C9C3B4] bg-white px-2.5 text-[13px]"
                    >
                      <option value="Capex">Capex</option>
                      <option value="Working Capital">Working Capital</option>
                    </select>
                    <input
                      type="number"
                      min={1}
                      value={editAmount}
                      onChange={(e) => setEditAmount(Number(e.target.value) || 0)}
                      aria-label="Edit amount"
                      className="min-h-[40px] w-32 rounded-md border border-[#C9C3B4] bg-white px-3 font-mono text-[13.5px] tabular-nums"
                    />
                    <Button variant="primary" size="sm" onClick={() => saveEdit(line.id)}>
                      <Check className="h-3.5 w-3.5" /> Save
                    </Button>
                    <Button variant="secondary" size="sm" onClick={() => setEditingId(null)}>
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="flex-1">
                      <div className="text-[14px] font-medium text-[#141A23]">
                        {showGu ? line.labelGu : line.label}
                      </div>
                      {line.note && <div className="mt-0.5 text-[12px] text-[#475467]">{line.note}</div>}
                    </div>
                    <div className="flex flex-wrap items-center gap-2.5">
                      <ProvenanceBadge level={line.provenance} />
                      <span className="font-mono text-[15px] font-semibold text-[#141A23] tabular-nums">
                        {formatINR(line.amount)}
                      </span>
                      <Button
                        variant="tertiary"
                        size="sm"
                        onClick={() => startEdit(line)}
                        aria-label={`Edit ${line.label}`}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="tertiary"
                        size="sm"
                        onClick={() => deleteLine(line.id)}
                        aria-label={`Delete ${line.label}`}
                        className="text-[#B91C1C] hover:bg-[#FEF2F2]"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow={shg.caseCode}
        title="Credit Demand & Cost Breakdown"
        subtitle={showGu ? shg.purposeSummaryGu : shg.purposeSummary}
        rightSlot={
          !embeddedInStepper ? (
            <Button
              variant="primary"
              onClick={() => (onStepNext ? onStepNext() : onNavigate("financing-blueprint"))}
            >
              Next: Livelihood Evidence <ChevronRight className="h-4 w-4" />
            </Button>
          ) : undefined
        }
      />

      {/* Summary strip */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-[#475467]">Capex</div>
          <div className="mt-1.5 font-mono text-[22px] font-semibold text-[#141A23] tabular-nums">{formatINR(capexTotal)}</div>
        </Card>
        <Card className="p-4">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-[#475467]">Working Capital</div>
          <div className="mt-1.5 font-mono text-[22px] font-semibold text-[#141A23] tabular-nums">{formatINR(wcTotal)}</div>
        </Card>
        <Card className="p-4">
          <label htmlFor="own-contribution-input" className="block text-[11px] font-semibold uppercase tracking-wider text-[#475467]">
            SHG Own Contribution (₹)
          </label>
          <input
            id="own-contribution-input"
            type="number"
            min={0}
            step={1000}
            value={shg.ownContribution}
            onChange={(e) => handleOwnContributionChange(Number(e.target.value) || 0)}
            className="mt-1.5 h-9 w-full rounded-md border border-[#C9C3B4] bg-[#FAF8F4] px-2.5 font-mono text-[18px] font-semibold text-[#141A23] tabular-nums focus:border-[#0F5E4E] focus:bg-white focus:outline-none"
          />
        </Card>
        <div className="rounded-lg border border-[#A7F3D0] bg-[#ECFDF5] p-4">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-[#047857]">External Need</div>
          <div className="mt-1.5 font-mono text-[22px] font-semibold text-[#047857] tabular-nums">{formatINR(externalNeed)}</div>
        </div>
      </div>

      <GovernanceNotice
        title="Capex / Working Capital Separation"
        body="Capital subsidies apply only to eligible fixed capital (machinery/equipment). Working capital items are strictly separated and routed to Cash Credit / Working Capital limits."
        tone="caution"
      />

      {renderTable(capex, "Capital Expenditure (Capex)")}
      {renderTable(wc, "Working Capital")}

      {/* Add Cost Item Form */}
      <Card className="p-5">
        <h2 className="text-[15px] font-semibold text-[#141A23] mb-4">Add Cost Line Item</h2>
        <form onSubmit={handleAddLine} className="grid gap-3 sm:grid-cols-12 items-end">
          <Field htmlFor="new-cost-label" label="Item Description" className="sm:col-span-4">
            <input
              id="new-cost-label"
              type="text"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              placeholder="e.g., Digital weighing scale"
              className="min-h-[44px] md:min-h-[38px] w-full rounded-md border border-[#C9C3B4] bg-white px-3 text-[13.5px]"
            />
          </Field>
          <Field htmlFor="new-cost-cat" label="Category" className="sm:col-span-3">
            <select
              id="new-cost-cat"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value as "Capex" | "Working Capital")}
              className="min-h-[44px] md:min-h-[38px] w-full rounded-md border border-[#C9C3B4] bg-white px-3 text-[13.5px]"
            >
              <option value="Capex">Capex</option>
              <option value="Working Capital">Working Capital</option>
            </select>
          </Field>
          <Field htmlFor="new-cost-amt" label="Amount (₹)" className="sm:col-span-2">
            <input
              id="new-cost-amt"
              type="number"
              min={1}
              value={newAmount}
              onChange={(e) => setNewAmount(e.target.value)}
              placeholder="15000"
              className="min-h-[44px] md:min-h-[38px] w-full rounded-md border border-[#C9C3B4] bg-white px-3 font-mono text-[13.5px]"
            />
          </Field>
          <Field htmlFor="new-cost-prov" label="Provenance" className="sm:col-span-3">
            <select
              id="new-cost-prov"
              value={newProvenance}
              onChange={(e) => setNewProvenance(e.target.value as ProvenanceLevel)}
              className="min-h-[44px] md:min-h-[38px] w-full rounded-md border border-[#C9C3B4] bg-white px-3 text-[13px]"
            >
              <option value="Self-declared">Self-declared</option>
              <option value="Document-supported">Document-supported</option>
              <option value="Field-verified">Field-verified</option>
            </select>
          </Field>
          <Field htmlFor="new-cost-note" label="Note (Optional)" className="sm:col-span-9">
            <input
              id="new-cost-note"
              type="text"
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Quotation vendor or cycle assumption"
              className="min-h-[44px] md:min-h-[38px] w-full rounded-md border border-[#C9C3B4] bg-white px-3 text-[13.5px]"
            />
          </Field>
          <div className="sm:col-span-3">
            <Button type="submit" variant="secondary" className="w-full">
              <Plus className="h-4 w-4" /> Add Cost Line
            </Button>
          </div>
        </form>
        {formError && <p className="mt-2 text-[12.5px] font-medium text-[#B91C1C]">{formError}</p>}
      </Card>

      {/* Visual cost split */}
      {totalCost > 0 && (
        <Card className="p-5">
          <div className="text-[14px] font-semibold text-[#141A23] mb-3">Cost Composition</div>
          <div className="flex h-4 overflow-hidden rounded-md border border-[#DFDBD0]">
            <div
              className="bg-[#0F5E4E]"
              style={{ width: `${(capexTotal / totalCost) * 100}%` }}
              title={`Capex: ${formatINR(capexTotal)}`}
            />
            <div
              className="bg-[#B45309]"
              style={{ width: `${(wcTotal / totalCost) * 100}%` }}
              title={`Working Capital: ${formatINR(wcTotal)}`}
            />
          </div>
          <div className="mt-2.5 flex flex-wrap items-center gap-6 text-[13px]">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-sm bg-[#0F5E4E]" />
              <span className="text-[#475467]">Capex ({Math.round((capexTotal / totalCost) * 100)}%)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-sm bg-[#B45309]" />
              <span className="text-[#475467]">Working Capital ({Math.round((wcTotal / totalCost) * 100)}%)</span>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
