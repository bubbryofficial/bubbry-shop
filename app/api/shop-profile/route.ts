import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

// Service role client — bypasses RLS so we can read profile without auth session
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const { data, error } = await supabaseAdmin
    .from("profiles")
    .select("id, is_live, offers_delivery, offers_pickup, shopfront_verified, shopfront_image, upi_id, shop_name, name, auto_offlined_until, phone")
    .eq("id", id)
    .eq("role", "shopkeeper") // Safety: only return shopkeeper profiles
    .single();

  if (error || !data) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(data);
}
