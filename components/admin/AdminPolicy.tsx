"use client";

import { useState } from "react";
import { Save, Trash2, Plus, Percent, Clock, Pencil, X } from "lucide-react";

interface Policy {
  id:             string;
  name:           string;
  depositPercent: number;
  freeCancelDays: number;
}

interface Props {
  policies: Policy[];
}

const EMPTY: Omit<Policy, "id"> = { name: "", depositPercent: 30, freeCancelDays: 7 };

export default function AdminPolicy({ policies: initial }: Props) {
  const [policies, setPolicies] = useState<Policy[]>(initial);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData]   = useState<Omit<Policy, "id">>(EMPTY);
  const [showNew, setShowNew]     = useState(false);
  const [newData, setNewData]     = useState<Omit<Policy, "id">>(EMPTY);
  const [saving, setSaving]       = useState(false);
  const [error, setError]         = useState<string | null>(null);

  const startEdit = (p: Policy) => {
    setEditingId(p.id);
    setEditData({ name: p.name, depositPercent: p.depositPercent, freeCancelDays: p.freeCancelDays });
  };

  const saveEdit = async () => {
    if (!editingId) return;
    setSaving(true); setError(null);
    try {
      const res  = await fetch(`/api/admin/policy/${editingId}`, {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(editData),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      setPolicies((prev) => prev.map((p) => p.id === editingId ? { ...p, ...editData } : p));
      setEditingId(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const deletePolicy = async (id: string) => {
    if (!confirm("Biztosan törlöd ezt a szabályt? A hozzá rendelt szezonokból eltávolításra kerül.")) return;
    try {
      const res = await fetch(`/api/admin/policy/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      setPolicies((prev) => prev.filter((p) => p.id !== id));
    } catch (err: any) {
      setError(err.message);
    }
  };

  const createPolicy = async () => {
    if (!newData.name.trim()) { setError("Adj meg egy nevet!"); return; }
    setSaving(true); setError(null);
    try {
      const res  = await fetch("/api/admin/policy", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(newData),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      setPolicies((prev) => [...prev, data.data]);
      setNewData(EMPTY);
      setShowNew(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-4">

      {/* Meglévő policy-k */}
      {policies.map((p) => (
        <div key={p.id} className="bg-white rounded-2xl shadow-card p-5">
          {editingId === p.id ? (
            <PolicyForm
              data={editData}
              setData={setEditData}
              onSave={saveEdit}
              onCancel={() => setEditingId(null)}
              saving={saving}
              label="Mentés"
            />
          ) : (
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-medium text-stone-800">{p.name}</p>
                <div className="flex flex-wrap gap-4 mt-2 text-sm text-stone-500">
                  <span className="flex items-center gap-1.5">
                    <Percent size={13} />
                    {p.depositPercent}% előleg
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock size={13} />
                    {p.freeCancelDays === 0 ? "Érkezésig lemondható" : `${p.freeCancelDays} nappal előbb lemondható`}
                  </span>
                </div>
              </div>
              <div className="flex gap-1.5 shrink-0">
                <button
                  onClick={() => startEdit(p)}
                  className="w-8 h-8 rounded-lg bg-stone-100 hover:bg-stone-200 flex items-center justify-center transition-colors"
                >
                  <Pencil size={13} className="text-stone-500" />
                </button>
                <button
                  onClick={() => deletePolicy(p.id)}
                  className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center transition-colors"
                >
                  <Trash2 size={13} className="text-red-500" />
                </button>
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Új policy form */}
      {showNew ? (
        <div className="bg-white rounded-2xl shadow-card p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="font-medium text-stone-800">Új szabály</p>
            <button onClick={() => { setShowNew(false); setNewData(EMPTY); }}>
              <X size={16} className="text-stone-400" />
            </button>
          </div>
          <PolicyForm
            data={newData}
            setData={setNewData}
            onSave={createPolicy}
            onCancel={() => { setShowNew(false); setNewData(EMPTY); }}
            saving={saving}
            label="Létrehozás"
          />
        </div>
      ) : (
        <button
          onClick={() => setShowNew(true)}
          className="flex items-center gap-2 px-5 py-3 rounded-xl border-2 border-dashed border-stone-200 text-stone-400 hover:border-forest-400 hover:text-forest-600 transition-colors w-full justify-center text-sm"
        >
          <Plus size={15} />
          Új szabály hozzáadása
        </button>
      )}

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}

function PolicyForm({
  data, setData, onSave, onCancel, saving, label,
}: {
  data: Omit<Policy, "id">;
  setData: (d: Omit<Policy, "id">) => void;
  onSave: () => void;
  onCancel: () => void;
  saving: boolean;
  label: string;
}) {
  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs font-medium text-stone-500 uppercase tracking-wider block mb-1.5">Szabály neve</label>
        <input
          className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm text-stone-800 focus:outline-none focus:border-forest-400"
          placeholder="pl. Alap, Nyári szezon, Karácsonyi..."
          value={data.name}
          onChange={(e) => setData({ ...data, name: e.target.value })}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-medium text-stone-500 uppercase tracking-wider block mb-1.5">
            <Percent size={11} className="inline mr-1" />Előleg mértéke
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number" min={0} max={100}
              className="w-20 px-3 py-2.5 rounded-xl border border-stone-200 text-center font-bold text-stone-800 focus:outline-none focus:border-forest-400"
              value={data.depositPercent}
              onChange={(e) => setData({ ...data, depositPercent: Math.min(100, Math.max(0, Number(e.target.value))) })}
            />
            <span className="text-stone-500 text-sm">%</span>
          </div>
        </div>
        <div>
          <label className="text-xs font-medium text-stone-500 uppercase tracking-wider block mb-1.5">
            <Clock size={11} className="inline mr-1" />Ingyenes lemondás
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number" min={0}
              className="w-20 px-3 py-2.5 rounded-xl border border-stone-200 text-center font-bold text-stone-800 focus:outline-none focus:border-forest-400"
              value={data.freeCancelDays}
              onChange={(e) => setData({ ...data, freeCancelDays: Math.max(0, Number(e.target.value)) })}
            />
            <span className="text-stone-500 text-sm">nap előtt</span>
          </div>
        </div>
      </div>
      <div className="flex gap-2 pt-1">
        <button
          onClick={onCancel}
          className="px-4 py-2.5 rounded-xl border border-stone-200 text-stone-500 text-sm hover:bg-stone-50 transition-colors"
        >
          Mégse
        </button>
        <button
          onClick={onSave}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-forest-800 text-cream text-sm font-medium hover:bg-forest-700 transition-colors disabled:opacity-60"
        >
          <Save size={13} />
          {saving ? "Mentés..." : label}
        </button>
      </div>
    </div>
  );
}
