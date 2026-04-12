import { cookies }    from "next/headers";
import { redirect }   from "next/navigation";
import { prisma }     from "@/lib/prisma";
import AdminAbout     from "@/components/admin/AdminAbout";

const DEFAULTS = {
  heading1:     "Egy kis kuckó,",
  heading2:     "ahol az idő megáll.",
  description1: "A Mil\u00E1n Kuck\u00F3 egy romantikus, gondosan berendezett vend\u00E9gh\u00E1z Miskolctapolca csendes zs\u00E1kutc\u00E1j\u00E1ban \u2013 maximum 4 f\u0151 r\u00E9sz\u00E9re. Hatalmas kert, priv\u00E1t jacuzzi, kandall\u00F3 \u00E9s aj\u00E1nd\u00E9k bor v\u00E1r minden \u00E9rkez\u0151t.",
  description2: "Csak ti vagytok az eg\u00E9sz \u201Ebirtokon\u201D \u2013 nincs m\u00E1s vend\u00E9g, nincs zaj. Ugyanakkor Magyarorsz\u00E1g egyik legkedveltebb \u00FCd\u00FCl\u0151hely\u00E9n, a B\u00FCkk l\u00E1b\u00E1n rengeteg program v\u00E1r a k\u00F6zelben.",
  mainImage:    { src: "/images/haz/Mil\u00E1n Kuck\u00F3 vend\u00E9gh\u00E1z kis.jpg", alt: "Mil\u00E1n Kuck\u00F3 \u2013 vend\u00E9gh\u00E1z k\u00EDv\u00FClr\u0151l" },
  floatImage:   { src: "/images/belso/f\u00FCrd\u0151.jpg", alt: "Jacuzzi este" },
  values: [
    { icon: "MapPin", title: "Zs\u00E1kutcai csend",  text: "Miskolctapolca csendes sark\u00E1ban, zs\u00E1kutc\u00E1ban \u2013 m\u00E9gis mindenhez k\u00F6zel. Az Ellipsum, Barlangf\u00FCrd\u0151 csak 1 km-re!" },
    { icon: "Users",  title: "Csak ti vagytok",  text: "Az eg\u00E9sz kuck\u00F3t kiz\u00E1r\u00F3lag nektek tartjuk fenn. Nincs m\u00E1s vend\u00E9g \u2013 teljes priv\u00E1t szf\u00E9ra, igazi intimszf\u00E9ra." },
  ],
  nearby: [
    "Ellipsum, Barlangf\u00FCrd\u0151 \u2013 1 km",
    "Avalon Park / Maya J\u00E1tsz\u00F3park \u2013 2,5 km",
    "Miskolctapolcai Bobp\u00E1lya",
    "Erdei kisvas\u00FAt \u2013 Lillaf\u00FCred",
    "Diósgyőri Vár",
    "Hámori tó & Zsófia kilátó",
  ],
};

export default async function AdminRolunkPage() {
  const cookieStore = await cookies();
  const token       = cookieStore.get("admin_token")?.value;
  if (!token) redirect("/admin/login");

  const row = await prisma.aboutContent.findUnique({ where: { id: "singleton" } });

  const data = {
    heading1:     row?.heading1     ?? DEFAULTS.heading1,
    heading2:     row?.heading2     ?? DEFAULTS.heading2,
    description1: row?.description1 ?? DEFAULTS.description1,
    description2: row?.description2 ?? DEFAULTS.description2,
    mainImage:    (row?.mainImage   ?? DEFAULTS.mainImage)  as { src: string; alt: string },
    floatImage:   (row?.floatImage  ?? DEFAULTS.floatImage) as { src: string; alt: string },
    values:       (row?.values      ?? DEFAULTS.values)     as { icon: string; title: string; text: string }[],
    nearby:       (row?.nearby      ?? DEFAULTS.nearby)     as string[],
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-stone-800">Rólunk szekció</h1>
        <p className="text-stone-500 text-sm mt-1">
          A főoldal "Rólunk" részének képei, szövegei, jellemzői és közeli látnivalói
        </p>
      </div>
      <AdminAbout initial={data} />
    </div>
  );
}
