import { NextResponse }  from "next/server";
import { cookies }       from "next/headers";
import { prisma }        from "@/lib/prisma";
import { createClient }  from "@supabase/supabase-js";

async function isAuthed() {
  const store = await cookies();
  return !!store.get("admin_token")?.value;
}

const BUCKET = "extra-services";

function getSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase env változók nincsenek beállítva!");
  return createClient(url, key);
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAuthed())) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { name, description, pricingType, price, imageUrl, isActive } = await req.json();

  const data: Record<string, unknown> = {};
  if (name        !== undefined) data.name        = name.trim();
  if (description !== undefined) data.description = description.trim();
  if (pricingType !== undefined) {
    if (!["PER_NIGHT", "PER_BOOKING"].includes(pricingType)) {
      return NextResponse.json({ success: false, error: "Érvénytelen árazási típus!" }, { status: 400 });
    }
    data.pricingType = pricingType;
  }
  if (price    !== undefined) data.price    = price != null ? Number(price) : null;
  if (imageUrl !== undefined) data.imageUrl = imageUrl ?? null;
  if (isActive !== undefined) data.isActive = isActive;

  const service = await prisma.extraService.update({ where: { id }, data });
  return NextResponse.json({ success: true, data: service });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAuthed())) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const service = await prisma.extraService.findUnique({ where: { id }, select: { imageUrl: true } });

  // Supabase Storage képtörlés
  if (service?.imageUrl) {
    try {
      const supabase = getSupabase();
      const url      = new URL(service.imageUrl);
      // URL formátum: .../storage/v1/object/public/extra-services/filename.jpg
      const parts    = url.pathname.split(`/object/public/${BUCKET}/`);
      if (parts.length === 2) {
        await supabase.storage.from(BUCKET).remove([parts[1]]);
      }
    } catch {
      // nem blokkolja a törlést ha a kép már nem létezik
    }
  }

  await prisma.extraService.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
