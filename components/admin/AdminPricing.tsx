"use client";

import { useState } from "react";
import { motion }   from "framer-motion";
import { Save, Plus, Trash2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import type { PricingRule } from "@/types";

interface Props {
  rules: PricingRule[];
}

export default function AdminPricing({ rules: initialRules }: Props) {
  const [rules, setRules]   = useState<PricingRule[]>(initialRules);
  const [saving, setSaving] = useState<string | null>(null);

  const updateRule = async (rule: PricingRule) => {
    setSaving(rule.id);
    try {
      const res = await fetch(`/api/admin/pricing/${rule.id}`, {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(rule),
      });
      const data = await res.json();
      if (data.success) {
        setRules((prev) => prev.map((r) => r.id === rule.id ? data.data : r));
      }
    } finally {
      setSaving(null);
    }
  };

  const handleChange = (id: string, field: keyof PricingRule, value: any) => {
    setRules((prev) =>
      prev.map((r) => r.id === id ? { ...r, [field]: value } : r)
    );
  };

  return (
    <div className="space-y-4">
      {rules.map((rule) => (
        <motion.div
          key={rule.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-card p-6"
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-medium text-stone-800">{rule.name}</h3>
              <p className="text-xs text-stone-400 mt-0.5">
                {rule.dateFrom && rule.dateTo
                  ? `${new Date(rule.dateFrom).toLocaleDateString("hu-HU")} – ${new Date(rule.dateTo).toLocaleDateString("hu-HU")}`
                  : "Alap ár (fallback)"
                }
              </p>
            </div>
            <span className="font-serif text-2xl text-forest-900">
              {formatCurrency(rule.pricePerNight)}<span className="text-sm text-stone-400">/éj</span>
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="text-xs text-stone-400 uppercase tracking-wider block mb-1">Ár/éj (Ft)</label>
              <input
                type="number"
                className="input-base"
                value={rule.pricePerNight}
                onChange={(e) => handleChange(rule.id, "pricePerNight", Number(e.target.value))}
              />
            </div>
            <div>
              <label className="text-xs text-stone-400 uppercase tracking-wider block mb-1">Min. éjszaka</label>
              <input
                type="number"
                className="input-base"
                value={rule.minNights}
                onChange={(e) => handleChange(rule.id, "minNights", Number(e.target.value))}
              />
            </div>
            <div>
              <label className="text-xs text-stone-400 uppercase tracking-wider block mb-1">Extra vendég felár</label>
              <input
                type="number"
                className="input-base"
                value={rule.extraGuestFee}
                onChange={(e) => handleChange(rule.id, "extraGuestFee", Number(e.target.value))}
              />
            </div>
            <div>
              <label className="text-xs text-stone-400 uppercase tracking-wider block mb-1">Extra főtől</label>
              <input
                type="number"
                className="input-base"
                value={rule.extraGuestFrom}
                onChange={(e) => handleChange(rule.id, "extraGuestFrom", Number(e.target.value))}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-stone-600 cursor-pointer">
              <input
                type="checkbox"
                checked={rule.isActive}
                onChange={(e) => handleChange(rule.id, "isActive", e.target.checked)}
                className="accent-forest-900"
              />
              Aktív
            </label>
            <button
              onClick={() => updateRule(rule)}
              disabled={saving === rule.id}
              className="btn-primary py-2.5 px-5 text-xs"
            >
              <Save size={13} />
              {saving === rule.id ? "Mentés..." : "Mentés"}
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}