import BookingPage from "@/components/booking/BookingPage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title:       "Foglalás",
  description: "Foglalja le a Milán Kuckót közvetlenül, extra díjak nélkül: válassza ki a szabad napokat a naptárban. Privát jacuzzis vendégház max. 4 főre Miskolctapolcán.",
  path:        "/foglalas",
});

export default function FoglalasOldal() {
  return <BookingPage />;
}
