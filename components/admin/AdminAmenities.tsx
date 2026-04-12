"use client";

import { useState } from "react";
import {
  Waves, Home, TreePine, Flame, Coffee, Utensils, UtensilsCrossed, Wifi,
  Star, Heart, Sun, Bath, Car, Wind, Flower2, ShieldCheck,
  Bed, Mountain, Sparkles, Music, Bike, MapPin, Users, Tv, Wine,
  Baby, Shirt, Plus, Trash2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const ICON_OPTIONS: { name: string; label: string; icon: LucideIcon }[] = [
  { name: "Waves",           label: "Hullámok (jacuzzi)",        icon: Waves           },
  { name: "Flame",           label: "Láng (kandalló)",            icon: Flame           },
  { name: "Wind",            label: "Szél (klíma)",               icon: Wind            },
  { name: "Wifi",            label: "Wi-Fi",                      icon: Wifi            },
  { name: "Tv",              label: "TV",                         icon: Tv              },
  { name: "UtensilsCrossed", label: "Konyha",                     icon: UtensilsCrossed },
  { name: "Utensils",        label: "Evőeszköz",                  icon: Utensils        },
  { name: "Coffee",          label: "Kávé / tea",                 icon: Coffee          },
  { name: "Wine",            label: "Bor",                        icon: Wine            },
  { name: "Car",             label: "Autó (parkoló)",             icon: Car             },
  { name: "TreePine",        label: "Fenyőfa (kert)",              icon: TreePine        },
  { name: "Shirt",           label: "Fürdőköpeny",                icon: Shirt           },
  { name: "Baby",            label: "Bababarát",                  icon: Baby            },
  { name: "Home",            label: "Ház",                        icon: Home            },
  { name: "MapPin",          label: "Helyszín",                   icon: MapPin          },
  { name: "Users",           label: "Vendégek",                   icon: Users           },
  { name: "Star",            label: "Csillag",                    icon: Star            },
  { name: "Heart",           label: "Szív",                       icon: Heart           },
  { name: "Sun",             label: "Nap",                        icon: Sun             },
  { name: "Bath",            label: "Fürdőkád",                   icon: Bath            },
  { name: "Flower2",         label: "Virág",                      icon: Flower2         },
  { name: "ShieldCheck",     label: "Védelem (biztonság)",         icon: ShieldCheck     },
  { name: "Bed",             label: "Ágy",                        icon: Bed             },
  { name: "Mountain",        label: "Hegy (természet)",            icon: Mountain        },
  { name: "Sparkles",        label: "Csillogás (luxus)",           icon: Sparkles        },
  { name: "Music",           label: "Zene",                       icon: Music           },
  { name: "Bike",            label: "Kerékpár",                   icon: Bike            },
];

const ICON_MAP: Record<string, LucideIcon> = Object.fromEntries(
  ICON_OPTIONS.map(({ name, icon }) => [name, icon])
);

interface Item {
  icon:  string;
  label: string;
  desc:  string;
}

interface AmenitiesData {
  subtitle:    string;
  heading:     string;
  description: string;
  items:       Item[];
}

export default function AdminAmenities({ initial }: { initial: AmenitiesData }) {
  const [form, setForm]     = useState<AmenitiesData>(initial);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved]   = useState(false);

  const set = (key: keyof AmenitiesData, val: string) =>
    setForm((f) => ({ ...f, [key]: val }));

  const setItem = (i: number, key: keyof Item, val: string) =>
    setForm((f) => {
      const items = [...f.items];
      items[i] = { ...items[i], [key]: val };
      return { ...f, items };
    });

  const addItem = () =>
    setForm((f) => ({ ...f, items: [...f.items, { icon: "Star", label: "", desc: "" }] }));

  const removeItem = (i: number) =>
    setForm((f) => ({ ...f, items: f.items.filter((_, idx) => idx !== i) }));

  const save = async () => {
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch("/api/admin/amenities", {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Mentési hiba");
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      alert("Hiba történt mentés közben.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-2xl">

      {/* Szövegek */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-5">
        <h2 className="font-medium text-stone-700">Fejléc szövegek</h2>

        <div>
          <label className="block text-xs font-medium text-stone-500 mb-1.5 uppercase tracking-wide">
            Badge felirat (kis szöveg cím felett)
          </label>
          <input
            value={form.subtitle}
            onChange={(e) => set("subtitle", e.target.value)}
            className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500/30"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-stone-500 mb-1.5 uppercase tracking-wide">
            Főcím
          </label>
          <input
            value={form.heading}
            onChange={(e) => set("heading", e.target.value)}
            className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500/30"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-stone-500 mb-1.5 uppercase tracking-wide">
            Leírás
          </label>
          <textarea
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            rows={3}
            className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500/30 resize-none"
          />
        </div>
      </div>

      {/* Elemek */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-medium text-stone-700">Felszereltség elemek</h2>
            <p className="text-xs text-stone-400 mt-0.5">{form.items.length} elem</p>
          </div>
          <button
            onClick={addItem}
            className="flex items-center gap-1.5 text-xs font-medium text-forest-600 hover:text-forest-700 border border-forest-200 hover:border-forest-300 px-3 py-1.5 rounded-lg transition-colors"
          >
            <Plus size={12} />
            Hozzáadás
          </button>
        </div>

        {form.items.length === 0 && (
          <p className="text-sm text-stone-400 italic">Nincsenek elemek.</p>
        )}

        <div className="space-y-3">
          {form.items.map((item, i) => {
            const IconComp = ICON_MAP[item.icon] ?? Star;
            return (
              <div key={i} className="flex items-start gap-3 p-4 bg-stone-50 rounded-xl">

                {/* Ikon */}
                <div className="flex-shrink-0">
                  <label className="block text-xs font-medium text-stone-500 mb-1">Ikon</label>
                  <div className="relative">
                    <select
                      value={item.icon}
                      onChange={(e) => setItem(i, "icon", e.target.value)}
                      className="appearance-none border border-stone-200 rounded-lg pl-8 pr-6 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-forest-500/30 cursor-pointer"
                    >
                      {ICON_OPTIONS.map((opt) => (
                        <option key={opt.name} value={opt.name}>{opt.label}</option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-stone-500">
                      <IconComp size={14} />
                    </div>
                  </div>
                </div>

                {/* Név + leírás */}
                <div className="flex-1 space-y-2">
                  <div>
                    <label className="block text-xs font-medium text-stone-500 mb-1">Név</label>
                    <input
                      value={item.label}
                      onChange={(e) => setItem(i, "label", e.target.value)}
                      placeholder="pl. Jacuzzi"
                      className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-forest-500/30"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-stone-500 mb-1">Alcím</label>
                    <input
                      value={item.desc}
                      onChange={(e) => setItem(i, "desc", e.target.value)}
                      placeholder="pl. Privát, korlátlan használat"
                      className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-forest-500/30"
                    />
                  </div>
                </div>

                <button
                  onClick={() => removeItem(i)}
                  className="mt-5 flex-shrink-0 text-red-400 hover:text-red-600 transition-colors"
                  title="Törlés"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mentés */}
      <div className="flex items-center gap-3">
        <button
          onClick={save}
          disabled={saving}
          className="px-6 py-2.5 bg-forest-700 hover:bg-forest-800 text-white text-sm font-medium rounded-xl transition-colors disabled:opacity-60"
        >
          {saving ? "Mentés…" : "Mentés"}
        </button>
        {saved && <span className="text-sm text-green-600">Sikeresen mentve!</span>}
      </div>

    </div>
  );
}
