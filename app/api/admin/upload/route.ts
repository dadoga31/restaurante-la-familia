import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const BUCKET = "dish-images";

function safeFileName(originalName: string): string {
  const parts = originalName.split(".");
  const ext = (parts.length > 1 ? parts.pop()! : "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
  const safe = ext || "jpg";
  const ts = Date.now();
  const rand = Math.floor(Math.random() * 1e9);
  return `${ts}-${rand}.${safe}`;
}

export async function POST(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ error: "Storage not configured" }, { status: 500 });
  }
  const supabase = createClient(supabaseUrl, supabaseKey);

  const formData = await request.formData();
  const file = formData.get("file") as File;
  if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

  // Create bucket if it doesn't exist
  const { data: buckets } = await supabase.storage.listBuckets();
  const exists = buckets?.some((b) => b.name === BUCKET);
  if (!exists) {
    const { error: bucketErr } = await supabase.storage.createBucket(BUCKET, { public: true });
    if (bucketErr) return NextResponse.json({ error: `No se pudo crear el bucket: ${bucketErr.message}` }, { status: 500 });
  }

  const fileName = safeFileName(file.name);

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(fileName, file, { contentType: file.type, upsert: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const { data: { publicUrl } } = supabase.storage.from(BUCKET).getPublicUrl(fileName);

  return NextResponse.json({ url: publicUrl });
}
