"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  Settings,
  LogOut,
  Home,
  ScrollText,
  Sparkles,
  Tag,
  Image,
  Info,
  CheckSquare,
  Images,
} from "lucide-react";

const LINKS = [
  { href: "/admin",                        icon: LayoutDashboard, label: "Áttekintés"          },
  { href: "/admin/foglalasok",             icon: Calendar,        label: "Foglalások"           },
  { href: "/admin/naptar",                 icon: Calendar,        label: "Naptár"               },
  { href: "/admin/arak",                   icon: Settings,        label: "Árak"                 },
  { href: "/admin/szabalyok",              icon: ScrollText,      label: "Szabályok"            },
  { href: "/admin/kedvezmenyek",           icon: Tag,             label: "Kedvezmények"         },
  { href: "/admin/extra-szolgaltatasok",   icon: Sparkles,        label: "Extra szolgáltatások" },
  { href: "/admin/hero",                   icon: Image,           label: "Kezdőlap"          },
  { href: "/admin/rolunk",                 icon: Info,            label: "Rólunk"             },
  { href: "/admin/felszereltseg",          icon: CheckSquare,     label: "Felszereltség"       },
  { href: "/admin/galeria",               icon: Images,          label: "Galéria"              },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router   = useRouter();

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-forest-900 flex flex-col z-50">

      {/* Logo */}
      <div className="px-6 py-7 border-b border-white/10">
        <p className="font-serif text-xl text-cream">Milán Kuckó</p>
        <p className="text-xs text-cream/50 tracking-widest uppercase mt-0.5">Admin</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {LINKS.map(({ href, icon: Icon, label }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-colors ${
              pathname === href
                ? "bg-white/15 text-cream font-medium"
                : "text-cream/60 hover:text-cream hover:bg-white/8"
            }`}
          >
            <Icon size={17} />
            {label}
          </Link>
        ))}
      </nav>

      {/* Alt */}
      <div className="px-3 py-4 border-t border-white/10 space-y-1">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-cream/60 hover:text-cream hover:bg-white/8 transition-colors"
        >
          <Home size={17} />
          Főoldal
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-cream/60 hover:text-red-400 hover:bg-red-400/10 transition-colors"
        >
          <LogOut size={17} />
          Kijelentkezés
        </button>
      </div>

    </aside>
  );
}