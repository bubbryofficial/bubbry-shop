import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { id } = await req.json();

    if (!id)
      return NextResponse.json({ error: "ID required" }, { status: 400 });

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceKey)
      return NextResponse.json({ error: "Server config missing" }, { status: 500 });

    const { createClient } = await import("@supabase/supabase-js");
    const admin = createClient(supabaseUrl, serviceKey);

    const { data, error } = await admin
      .from("sub_admins")
      .select("*")
      .eq("id", id)
      .eq("is_active", true)
      .single();

    if (error || !data)
      return NextResponse.json({ error: "Account not found or deactivated" }, { status: 404 });

    return NextResponse.json({ success: true, admin: data });

  } catch (e: any) {
    return NextResponse.json({ error: "Server error: " + e.message }, { status: 500 });
  }
}
