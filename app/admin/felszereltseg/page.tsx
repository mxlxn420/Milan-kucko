import { cookies }       from "next/headers";
import { redirect }      from "next/navigation";
import { prisma }        from "@/lib/prisma";
import AdminAmenities    from "@/components/admin/AdminAmenities";

const DEFAULTS = {
  subtitle:    "Felszerelts\u00E9g",
  heading:     "Minden, amire sz\u00FCks\u00E9ge van",
  description: "A Mil\u00E1n Kuck\u00F3 pr\u00E9mium felszerelts\u00E9ggel v\u00E1rja vend\u00E9geit \u2013 hogy az els\u0151 pillanatt\u00F3l fogva csak a pihen\u00E9sre kelljen gondolni.",
  items: [
    { icon: "Waves",           label: "Jacuzzi",                  desc: "Priv\u00E1t, korl\u00E1tlan haszn\u00E1lat" },
    { icon: "Flame",           label: "Kandall\u00F3",             desc: "Hangulatos esti t\u0171z" },
    { icon: "Wind",            label: "Kl\u00EDma",               desc: "F\u0171t\u00E9s \u00E9s h\u0171t\u00E9s eg\u00E9sz \u00E9vben" },
    { icon: "Wifi",            label: "Ingyenes WiFi",             desc: "Nagy sebess\u00E9g\u0171 internet" },
    { icon: "Tv",              label: "Smart TV",                  desc: "S\u00EDkk\u00E9perny\u0151s, m\u0171holdas" },
    { icon: "UtensilsCrossed", label: "Felszerelt konyha",         desc: "F\u0151z\u0151lap, mosogat\u00F3g\u00E9p, mikr\u00F3" },
    { icon: "Coffee",          label: "Bek\u00E9sz\u00EDtett tea \u00E9s k\u00E1v\u00E9", desc: "Tea-/k\u00E1v\u00E9f\u0151z\u0151 bek\u00E9sz\u00EDtve" },
    { icon: "Wine",            label: "Aj\u00E1nd\u00E9k \u00FCveg bor",         desc: "Minden \u00E9rkez\u00E9skor" },
    { icon: "Car",             label: "Ingyenes parkol\u00F3",     desc: "Saj\u00E1t, priv\u00E1t be\u00E1ll\u00F3" },
    { icon: "TreePine",        label: "Hatalmas priv\u00E1t kert", desc: "Grill, bogr\u00E1cs, szalonnas\u00FCt\u0151" },
    { icon: "Shirt",           label: "F\u00FCrd\u0151k\u00F6peny \u0026 t\u00F6r\u00F6lk\u00F6z\u0151", desc: "Minden vend\u00E9gnek" },
    { icon: "Baby",            label: "Babbar\u00E1t sz\u00E1ll\u00E1s",        desc: "Kis\u00E1gy, f\u00FCrdet\u0151k\u00E1d, etet\u0151k\u00E9szlet" },
  ],
};

export default async function AdminFelszereltsegPage() {
  const cookieStore = await cookies();
  const token       = cookieStore.get("admin_token")?.value;
  if (!token) redirect("/admin/login");

  const row = await prisma.amenitiesContent.findUnique({ where: { id: "singleton" } });

  const data = {
    subtitle:    row?.subtitle    ?? DEFAULTS.subtitle,
    heading:     row?.heading     ?? DEFAULTS.heading,
    description: row?.description ?? DEFAULTS.description,
    items:       (row?.items      ?? DEFAULTS.items) as { icon: string; label: string; desc: string }[],
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-stone-800">Felszereltség szekció</h1>
        <p className="text-stone-500 text-sm mt-1">
          A főoldal felszereltség részének szövegei és elemei
        </p>
      </div>
      <AdminAmenities initial={data} />
    </div>
  );
}
