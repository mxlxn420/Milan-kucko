import { revalidatePath } from "next/cache";

// A főoldal és a galéria statikusan, CDN-ről szolgálódik ki –
// minden admin mentés után frissíteni kell őket, hogy a változás azonnal látszódjon.
export function revalidatePublicPages() {
  revalidatePath("/");
  revalidatePath("/galeria");
}
