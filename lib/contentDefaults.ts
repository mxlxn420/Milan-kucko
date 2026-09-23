// Alapértelmezett tartalmak – akkor jelennek meg, ha az adminban még nincs mentett adat

export const HERO_DEFAULTS = {
  subtitle:      "Bencések útja 117/A, Miskolctapolca",
  titleBefore:   "A tökéletes ",
  titleEmphasis: "kikapcsolódás",
  titleAfter:    "csak rád vár.",
  description:   "Romantikus vendégház hatalmas kerttel és privát jacuzzival, Miskolctapolca csendes zsákutcájában. Csak ti vagytok az egész „birtokon.”",
  highlights: [
    { icon: "Waves", label: "Privát jacuzzi" },
    { icon: "Home",  label: "Csak ti vagytok" },
  ] as { icon: string; label: string }[],
  slides: [
    { src: "/images/haz/IMG_8519 kicsi.jpg",     alt: "Milán Kuckó – vendégház kívülről" },
    { src: "/images/jacuzzi/jacuzzikivilag.jpg", alt: "Privát jacuzzi"                   },
    { src: "/images/kert/kert.jpg",              alt: "Hatalmas privát kert"             },
  ] as { src: string; alt: string }[],
};

export const ABOUT_DEFAULTS = {
  heading1:     "Egy kis kuckó,",
  heading2:     "ahol az idő megáll.",
  description1: "A Milán Kuckó egy romantikus, gondosan berendezett vendégház Miskolctapolca csendes zsákutcájában – maximum 4 fő részére. Hatalmas kert, privát jacuzzi, kandalló és ajándék bor vár minden érkezőt.",
  description2: "Csak ti vagytok az egész „birtokon” – nincs más vendég, nincs zaj. Ugyanakkor Magyarország egyik legkedveltebb üdülőhelyén, a Bükk lábán rengeteg program vár a közelben.",
  mainImage:    { src: "/images/haz/Milán Kuckó vendégház kis.jpg", alt: "Milán Kuckó – vendégház kívülről" },
  floatImage:   { src: "/images/belso/fürdő.jpg", alt: "Jacuzzi este" },
  values: [
    { icon: "MapPin", title: "Zsákutcai csend", text: "Miskolctapolca csendes sarkában, zsákutcában – mégis mindenhez közel. Az Ellipsum, Barlangfürdő csak 1 km-re!" },
    { icon: "Users",  title: "Csak ti vagytok", text: "Az egész kuckót kizárólag nektek tartjuk fenn. Nincs más vendég – teljes privát szféra, igazi intimszféra." },
  ] as { icon: string; title: string; text: string }[],
  nearby: [
    "Ellipsum, Barlangfürdő – 1 km",
    "Avalon Park / Maya Játszópark – 2,5 km",
    "Miskolctapolcai Bobpálya",
    "Erdei kisvasút – Lillafüred",
    "Diósgyőri Vár",
    "Hámori tó & Zsófia kilátó",
  ] as string[],
};

export const AMENITIES_DEFAULTS = {
  subtitle:    "Felszereltség",
  heading:     "Minden, amire szüksége van",
  description: "A Milán Kuckó prémium felszereltséggel várja vendégeit – hogy az első pillanattól fogva csak a pihenésre kelljen gondolni.",
  items: [
    { icon: "Waves",           label: "Jacuzzi",                     desc: "Privát, korlátlan használat" },
    { icon: "Flame",           label: "Kandalló",                    desc: "Hangulatos esti tűz" },
    { icon: "Wind",            label: "Klíma",                       desc: "Fűtés és hűtés egész évben" },
    { icon: "Wifi",            label: "Ingyenes WiFi",               desc: "Nagy sebességű internet" },
    { icon: "Tv",              label: "Smart TV",                    desc: "Síkképernyős, műholdas" },
    { icon: "UtensilsCrossed", label: "Felszerelt konyha",           desc: "Főzőlap, mosogatógép, mikró" },
    { icon: "Coffee",          label: "Bekészített tea és kávé",     desc: "Tea-/kávéfőző bekészítve" },
    { icon: "Wine",            label: "Ajándék üveg bor",            desc: "Minden érkezéskor" },
    { icon: "Car",             label: "Ingyenes parkoló",            desc: "Saját, privát beálló" },
    { icon: "TreePine",        label: "Hatalmas privát kert",        desc: "Grill, bogrács, szalonnasütő" },
    { icon: "Shirt",           label: "Fürdőköpeny & törölköző",     desc: "Minden vendégnek" },
    { icon: "Baby",            label: "Bababarát szállás",           desc: "Kiságy, fürdetőkád, etetőkészlet" },
  ] as { icon: string; label: string; desc: string }[],
};
