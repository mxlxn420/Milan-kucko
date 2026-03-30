import { NextResponse }  from "next/server";
import { cookies }       from "next/headers";
import { createClient }  from "@supabase/supabase-js";
import { randomBytes }   from "crypto";

async function isAuthed() {
  const store = await cookies();
  return !!store.get("admin_token")?.value;
}

const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_SIZE_MB   = 5;
const BUCKET        = "extra-services";

function getSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase env változók nincsenek beállítva!");
  return createClient(url, key);
}

export async function POST(req: Request) {
  if (!(await isAuthed())) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const file     = formData.get("file") as File | null;

  if (!file) return NextResponse.json({ success: false, error: "Nincs fájl!" }, { status: 400 });
  if (!ALLOWED_TYPES.includes(file.type)) return NextResponse.json({ success: false, error: "Csak JPG, PNG vagy WebP képet lehet feltölteni!" }, { status: 400 });
  if (file.size > MAX_SIZE_MB * 1024 * 1024) return NextResponse.json({ success: false, error: `A kép maximum ${MAX_SIZE_MB} MB lehet!` }, { status: 400 });

  const ext      = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
  const filename = `${randomBytes(12).toString("hex")}.${ext}`;
  const buffer   = Buffer.from(await file.arrayBuffer());

  const supabase = getSupabase();
  const { error } = await supabase.storage.from(BUCKET).upload(filename, buffer, {
    contentType: file.type,
    upsert:      false,
  });

  if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });

  const { data: { publicUrl } } = supabase.storage.from(BUCKET).getPublicUrl(filename);

  return NextResponse.json({ success: true, url: publicUrl });
}
