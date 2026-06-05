import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password)
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceKey)
      return NextResponse.json({ error: "Server config missing - add SUPABASE_SERVICE_ROLE_KEY to Vercel env vars" }, { status: 500 });

    const { createClient } = await import("@supabase/supabase-js");
    const admin = createClient(supabaseUrl, serviceKey);

    const { data, error } = await admin
      .from("sub_admins")
      .select("*")
      .eq("email", email.trim().toLowerCase())
      .eq("password_hash", password.trim())
      .eq("is_active", true)
      .single();

    if (error || !data)
      return NextResponse.json({ error: "Invalid credentials or account deactivated" }, { status: 401 });

    return NextResponse.json({ success: true, admin: data });

  } catch (e: any) {
    return NextResponse.json({ error: "Server error: " + e.message }, { status: 500 });
  }
}
