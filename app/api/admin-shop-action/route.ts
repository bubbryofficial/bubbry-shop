import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { shop_id, action, admin_email, admin_password } = body;

    if (!shop_id || !action || !admin_email || !admin_password)
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceKey)
      return NextResponse.json({ error: "Server config missing - add SUPABASE_SERVICE_ROLE_KEY to Vercel env vars" }, { status: 500 });

    const { createClient } = await import("@supabase/supabase-js");
    const admin = createClient(supabaseUrl, serviceKey);

    // Verify sub-admin credentials
    const { data: subAdmin, error: authErr } = await admin
      .from("sub_admins")
      .select("id, permissions, is_active")
      .eq("email", admin_email.toLowerCase().trim())
      .eq("password_hash", admin_password)
      .eq("is_active", true)
      .single();

    if (authErr || !subAdmin)
      return NextResponse.json({ error: "Unauthorized - invalid sub-admin credentials" }, { status: 401 });

    if (!subAdmin.permissions?.includes("manage_shops"))
      return NextResponse.json({ error: "No permission to manage shops" }, { status: 403 });

    // Build update
    let update: Record<string, any> = {};
    if (action === "approve") {
      // Approving the shopfront only marks it verified. The shop does NOT go
      // live automatically — the shopkeeper must toggle live themselves (which
      // also checks for an active subscription).
      update = { shopfront_verified: true, shopfront_rejected: false };
    } else if (action === "reject") {
      update = { shopfront_verified: false, shopfront_rejected: true, is_live: false };
    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    const { error: updateErr } = await admin
      .from("profiles")
      .update(update)
      .eq("id", shop_id)
      .eq("role", "shopkeeper");

    if (updateErr)
      return NextResponse.json({ error: "DB update failed: " + updateErr.message }, { status: 500 });

    return NextResponse.json({ success: true });

  } catch (e: any) {
    return NextResponse.json({ error: "Server error: " + e.message }, { status: 500 });
  }
}
