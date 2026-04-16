import { NextResponse }  from "next/server";
import { cookies }       from "next/headers";
import { createClient }  from "@supabase/supabase-js";
import { randomBytes }   from "crypto";

async function isAuthed() {
  const store = await cookies();
  return !!store.get("admin_token")?.value;
}

function detectImageType(buf: Buffer): string | null {
  if (buf[0] === 0xFF && buf[1] === 0xD8 && buf[2] === 0xFF) return "image/jpeg";
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4E && buf[3] === 0x47) return "image/png";
  if (
    buf[0] === 0x52 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x46 &&
    buf[8] === 0x57 && buf[9] === 0x45 && buf[10] === 0x42 && buf[11] === 0x50
  ) return "image/webp";
  return null;
}

const ALLOWED_TYPES  = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_SIZE_MB    = 20;
const ALLOWED_BUCKETS = ["extra-services", "hero", "about", "gallery"];

function getSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase env változók nincsenek beállítva!");
  return createClient(url, key);
}

export async function POST(req: Request) {
  if (!(await isAuthed())) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const bucket = searchParams.get("bucket") ?? "extra-services";

  if (!ALLOWED_BUCKETS.includes(bucket)) {
    return NextResponse.json({ success: false, error: "Ismeretlen bucket" }, { status: 400 });
  }

  const formData = await req.formData();
  const file     = formData.get("file") as File | null;

  if (!file) return NextResponse.json({ success: false, error: "Nincs fájl!" }, { status: 400 });
  if (!ALLOWED_TYPES.includes(file.type)) return NextResponse.json({ success: false, error: "Csak JPG, PNG vagy WebP képet lehet feltölteni!" }, { status: 400 });
  if (file.size > MAX_SIZE_MB * 1024 * 1024) return NextResponse.json({ success: false, error: `A kép maximum ${MAX_SIZE_MB} MB lehet!` }, { status: 400 });

  const buffer   = Buffer.from(await file.arrayBuffer());

  // Magic bytes ellenőrzés — kliens oldali file.type nem megbízható
  const actualType = detectImageType(buffer);
  if (!actualType) {
    return NextResponse.json({ success: false, error: "Érvénytelen képfájl (nem JPG, PNG vagy WebP)" }, { status: 400 });
  }

  const ext      = actualType === "image/png" ? "png" : actualType === "image/webp" ? "webp" : "jpg";
  const filename = `${randomBytes(12).toString("hex")}.${ext}`;

  const supabase = getSupabase();
  const { error } = await supabase.storage.from(bucket).upload(filename, buffer, {
    contentType: file.type,
    upsert:      false,
  });

  if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });

  const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(filename);

  return NextResponse.json({ success: true, url: publicUrl });
}
