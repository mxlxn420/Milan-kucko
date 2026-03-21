"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Save, Plus, Trash2, Lock, Star, Pencil } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import type { PricingRule } from "@/types";
import SeasonForm from "@/components/admin/SeasonForm";

interface Props {
  rules: PricingRule[];
}

interface EditableRule {
  id:              string;
  name:            string;
  pricePerNight:   number;
  weekendPrice:    number;
  childPrice2to6:  number;
  childPrice6to12: number;
  dateFrom:        Date | null;
  dateTo:          Date | null;
  minNights:       number;
  isActive:        boolean;
  featured:        boolean;
}

export default function AdminPricing({ rules: initialRules }: Props) {
  const [rules, setRules]         = useState<PricingRule[]>(initialRules);
  const [saving, setSaving]       = useState<string | null>(null);
  const [deleting, setDeleting]   = useState<string | null>(null);
  const [showNew, setShowNew]     = useState(false);
  const [creating, setCreating]   = useState(false);
  const [datePanel, setDatePanel] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editRule, setEditRule]   = useState<EditableRule | null>(null);

  const baseRule    = useMemo(() => rules.find((r) => !r.dateFrom && !r.dateTo), [rules]);
  const basePrice   = baseRule?.pricePerNight ?? 45_000;
  const seasonRules = useMemo(() => rules.filter((r) => r.dateFrom || r.dateTo), [rules]);

  const EMPTY_NEW = {
    name:            "",
    pricePerNight:   basePrice,
    weekendPrice:    0,
    childPrice2to6:  0,
    childPrice6to12: 0,
    dateFrom:        null as Date | null,
    dateTo:          null as Date | null,
    minNights:       2,
    isActive:        true,
    featured:        false,
  };

  const [newRule, setNewRule] = useState(EMPTY_NEW);

  const existingRanges = useMemo(() => {
    return seasonRules
      .filter((r) => r.dateFrom && r.dateTo && r.isActive && r.id !== editingId)
      .map((r) => ({
        from: new Date(r.dateFrom as string),
        to:   new Date(r.dateTo  as string),
        name: r.name,
      }));
  }, [seasonRules, editingId]);

  const disabledDaysNew  = useMemo(() =>
    newRule.featured  ? [] : existingRanges.map((r) => ({ from: r.from, to: r.to })),
    [existingRanges, newRule.featured]
  );
  const disabledDaysEdit = useMemo(() =>
    editRule?.featured ? [] : existingRanges.map((r) => ({ from: r.from, to: r.to })),
    [existingRanges, editRule?.featured]
  );

  function checkOverlap(from: Date | null, to: Date | null, featured: boolean): string | null {
    if (!from || !to || featured) return null;
    for (const r of existingRanges) {
      if (from <= r.to && to >= r.from) return r.name;
    }
    return null;
  }

  const overlapNew  = checkOverlap(newRule.dateFrom,      newRule.dateTo,      newRule.featured);
  const overlapEdit = checkOverlap(editRule?.dateFrom ?? null, editRule?.dateTo ?? null, editRule?.featured ?? false);

  const handleChange = (id: string, field: keyof PricingRule, value: any) => {
    setRules((prev) => prev.map((r) => r.id === id ? { ...r, [field]: value } : r));
  };

  const updateBaseRule = async (rule: PricingRule) => {
    setSaving(rule.id);
    try {
      const res  = await fetch(`/api/admin/pricing/${rule.id}`, {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(rule),
      });
      const data = await res.json();
      if (data.success) setRules((prev) => prev.map((r) => r.id === rule.id ? data.data : r));
    } finally {
      setSaving(null);
    }
  };

  const openEdit = (rule: PricingRule) => {
    setEditingId(rule.id);
    setEditRule({
      id:              rule.id,
      name:            rule.name,
      pricePerNight:   rule.pricePerNight,
      weekendPrice:    (rule as any).weekendPrice    ?? 0,
      childPrice2to6:  (rule as any).childPrice2to6  ?? 0,
      childPrice6to12: (rule as any).childPrice6to12 ?? 0,
      dateFrom:        rule.dateFrom ? new Date(rule.dateFrom as string) : null,
      dateTo:          rule.dateTo   ? new Date(rule.dateTo   as string) : null,
      minNights:       rule.minNights,
      isActive:        rule.isActive,
      featured:        rule.priority >= 10,
    });
    setShowNew(false);
  };

  const closeEdit = () => { setEditingId(null); setEditRule(null); setDatePanel(null); };

  const saveEditRule = async () => {
    if (!editRule) return;
    setSaving(editRule.id);
    try {
      const res = await fetch(`/api/admin/pricing/${editRule.id}`, {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          name:            editRule.name,
          pricePerNight:   editRule.pricePerNight,
          weekendPrice:    editRule.weekendPrice,
          childPrice2to6:  editRule.childPrice2to6,
          childPrice6to12: editRule.childPrice6to12,
          dateFrom:        editRule.dateFrom?.toISOString() ?? null,
          dateTo:          editRule.dateTo?.toISOString()   ?? null,
          minNights:       editRule.minNights,
          isActive:        editRule.isActive,
          priority:        editRule.featured ? 10 : 5,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setRules((prev) =>
          prev.map((r) => r.id === editRule.id ? {
            ...r,
            name:            editRule.name,
            pricePerNight:   editRule.pricePerNight,
            weekendPrice:    editRule.weekendPrice,
            childPrice2to6:  editRule.childPrice2to6,
            childPrice6to12: editRule.childPrice6to12,
            dateFrom:        editRule.dateFrom?.toISOString() ?? null,
            dateTo:          editRule.dateTo?.toISOString()   ?? null,
            minNights:       editRule.minNights,
            isActive:        editRule.isActive,
            priority:        editRule.featured ? 10 : 5,
          } : r)
        );
        closeEdit();
      } else {
        alert("Mentési hiba: " + data.error);
      }
    } finally {
      setSaving(null);
    }
  };

  const deleteRule = async (id: string) => {
    if (!confirm("Biztosan törli ezt a szezont?")) return;
    setDeleting(id);
    try {
      const res  = await fetch(`/api/admin/pricing/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) setRules((prev) => prev.filter((r) => r.id !== id));
    } finally {
      setDeleting(null);
    }
  };

  const createRule = async () => {
    if (!newRule.name || !newRule.pricePerNight) {
      alert("A név és az ár megadása kötelező!");
      return;
    }
    setCreating(true);
    try {
      const res = await fetch("/api/admin/pricing", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          ...newRule,
          priority: newRule.featured ? 10 : 5,
          dateFrom: newRule.dateFrom?.toISOString() ?? null,
          dateTo:   newRule.dateTo?.toISOString()   ?? null,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setRules((prev) => [...prev, data.data]);
        setNewRule(EMPTY_NEW);
        setShowNew(false);
        setDatePanel(null);
      }
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-4">

      {/* Alap ár */}
      {baseRule && (
        <div className="bg-white rounded-2xl shadow-card p-6 border-2 border-forest-100">
          <div className="flex items-center gap-2 mb-4">
            <Lock size={15} className="text-forest-700" />
            <h3 className="font-medium text-stone-800">Alap ár</h3>
            <span className="text-xs bg-forest-100 text-forest-700 px-2 py-0.5 rounded-full">
              Nem törölhető
            </span>
          </div>
          <p className="text-xs text-stone-400 mb-4">
            Ez az ár érvényes minden olyan napra, amelyre nincs szezon megadva.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-stone-400 uppercase tracking-wider block mb-1">Hétköznapi ár/éj</label>
              <input type="number" className="input-base" value={baseRule.pricePerNight}
                onChange={(e) => handleChange(baseRule.id, "pricePerNight", Number(e.target.value))} />
            </div>
            <div>
              <label className="text-xs text-stone-400 uppercase tracking-wider block mb-1">Hétvégi ár/éj</label>
              <input type="number" className="input-base" placeholder="Ha üres = hétköznapi"
                value={(baseRule as any).weekendPrice || ""}
                onChange={(e) => handleChange(baseRule.id, "weekendPrice" as any, Number(e.target.value))} />
            </div>
            <div>
              <label className="text-xs text-stone-400 uppercase tracking-wider block mb-1">Min. éjszaka</label>
              <input type="number" className="input-base" value={baseRule.minNights}
                onChange={(e) => handleChange(baseRule.id, "minNights", Number(e.target.value))} />
            </div>
          </div>
          <div className="flex justify-end mt-4 pt-4 border-t border-stone-100">
            <button onClick={() => updateBaseRule(baseRule)} disabled={saving === baseRule.id}
              className="btn-primary py-2 px-5 text-xs">
              <Save size={13} />
              {saving === baseRule.id ? "Mentés..." : "Mentés"}
            </button>
          </div>
        </div>
      )}

      {/* Szezonok fejléc */}
      <div className="flex justify-between items-center pt-2">
        <p className="text-sm text-stone-500">{seasonRules.length} szezon</p>
        <button
          onClick={() => { setNewRule(EMPTY_NEW); setShowNew(true); setEditingId(null); setEditRule(null); }}
          className="btn-primary py-2.5 px-5 text-xs"
        >
          <Plus size={14} /> Új szezon
        </button>
      </div>

      {/* Új szezon form */}
      <AnimatePresence>
        {showNew && (
          <SeasonForm
            rule={newRule}
            setRule={setNewRule}
            onSave={createRule}
            onCancel={() => { setShowNew(false); setDatePanel(null); }}
            isSaving={creating}
            isNew={true}
            disabledDays={disabledDaysNew}
            overlapError={overlapNew}
            panelPrefix="new"
            basePrice={basePrice}
            existingRanges={existingRanges}
            datePanel={datePanel}
            setDatePanel={setDatePanel}
          />
        )}
      </AnimatePresence>

      {/* Panel bezárás */}
      {datePanel && (
        <div className="fixed inset-0" style={{ zIndex: 9998 }} onClick={() => setDatePanel(null)} />
      )}

      {/* Meglévő szezonok */}
      {seasonRules.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-card p-10 text-center text-stone-400 text-sm">
          Még nincs szezon. Az alap ár érvényes minden napra.
        </div>
      ) : (
        seasonRules.map((rule) => (
          <motion.div key={rule.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <AnimatePresence mode="wait">
              {editingId === rule.id && editRule ? (
                <SeasonForm
                  key="edit-form"
                  rule={editRule}
                  setRule={(r) => setEditRule(r as EditableRule)}
                  onSave={saveEditRule}
                  onCancel={closeEdit}
                  isSaving={saving === rule.id}
                  isNew={false}
                  disabledDays={disabledDaysEdit}
                  overlapError={overlapEdit}
                  panelPrefix={rule.id}
                  basePrice={basePrice}
                  existingRanges={existingRanges}
                  datePanel={datePanel}
                  setDatePanel={setDatePanel}
                />
              ) : (
                <motion.div
                  key="card"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-white rounded-2xl shadow-card p-6"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        {rule.priority >= 10 && <Star size={13} className="text-terra-400 fill-terra-400" />}
                        <h3 className="font-medium text-stone-800">{rule.name}</h3>
                        {!rule.isActive && (
                          <span className="text-xs bg-stone-100 text-stone-500 px-2 py-0.5 rounded-full">Inaktív</span>
                        )}
                        {rule.priority >= 10 && (
                          <span className="text-xs bg-terra-100 text-terra-600 px-2 py-0.5 rounded-full">Kiemelt</span>
                        )}
                      </div>
                      <p className="text-xs text-stone-400">
                        {rule.dateFrom && rule.dateTo
                          ? `${new Date(rule.dateFrom as string).toLocaleDateString("hu-HU")} – ${new Date(rule.dateTo as string).toLocaleDateString("hu-HU")}`
                          : "Dátum nélkül"
                        }
                        {" · "}Min. {rule.minNights} éj
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="font-serif text-xl text-forest-900">
                          {formatCurrency(rule.pricePerNight)}
                        </span>
                        <span className="text-xs text-stone-400">/éj</span>
                        {(rule as any).weekendPrice > 0 && (
                          <p className="text-xs text-terra-400 mt-0.5">
                            Hétvége: {formatCurrency((rule as any).weekendPrice)}/éj
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEdit(rule)}
                          className="w-9 h-9 rounded-xl bg-forest-50 text-forest-700 hover:bg-forest-100 flex items-center justify-center transition-colors"
                          title="Szerkesztés"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => deleteRule(rule.id)}
                          disabled={deleting === rule.id}
                          className="w-9 h-9 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center transition-colors"
                          title="Törlés"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))
      )}
    </div>
  );
}