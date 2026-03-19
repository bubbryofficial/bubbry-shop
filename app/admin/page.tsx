"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const ADMIN_PASSWORD = "bubbry-admin-2024";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Plus Jakarta Sans', sans-serif; background: #F4F6FB; min-height: 100vh; }
.admin-header { background: #0D1B3E; padding: 16px 20px; display: flex; align-items: center; justify-content: space-between; }
.admin-brand { font-size: 18px; font-weight: 900; color: white; letter-spacing: -0.5px; }
.admin-badge { background: #1A6BFF; color: white; font-size: 11px; font-weight: 800; padding: 4px 10px; border-radius: 20px; }
.shop-card { background: white; border-radius: 16px; border: 1.5px solid #E4EAFF; overflow: hidden; box-shadow: 0 2px 12px rgba(26,107,255,0.06); }
.shop-img { width: 100%; height: 200px; object-fit: cover; display: block; background: #E4EAFF; }
.shop-img-placeholder { width: 100%; height: 200px; background: #F4F6FB; display: flex; align-items: center; justify-content: center; font-size: 48px; }
.shop-info { padding: 16px; }
.shop-name { font-size: 16px; font-weight: 800; color: #0D1B3E; margin-bottom: 4px; }
.shop-meta { font-size: 12px; color: #8A96B5; font-weight: 600; margin-bottom: 14px; }
.action-row { display: flex; gap: 8px; }
.btn-approve { flex: 1; padding: 12px; background: #00B37E; color: white; border: none; border-radius: 10px; font-size: 14px; font-weight: 800; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.2s; }
.btn-approve:hover { background: #009068; }
.btn-approve:disabled { opacity: 0.5; cursor: not-allowed; }
.btn-reject { flex: 1; padding: 12px; background: white; color: #E53E3E; border: 2px solid #E53E3E; border-radius: 10px; font-size: 14px; font-weight: 800; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.2s; }
.btn-reject:hover { background: #FFF5F5; }
.btn-reject:disabled { opacity: 0.5; cursor: not-allowed; }
.status-chip { display: inline-flex; align-items: center; gap: 4px; padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 800; }
.chip-pending { background: #FFF8E6; color: #946200; }
.chip-approved { background: #E6FAF4; color: #00875A; }
.chip-rejected { background: #FFF0F0; color: #E53E3E; }
.login-card { background: white; border-radius: 20px; padding: 32px; box-shadow: 0 8px 40px rgba(0,0,0,0.1); max-width: 380px; margin: 80px auto; }
.auth-input { width: 100%; padding: 14px 16px; border: 2px solid #E4EAFF; border-radius: 12px; font-size: 15px; font-weight: 500; color: #0D1B3E; background: white; font-family: 'Plus Jakarta Sans', sans-serif; outline: none; transition: all 0.2s; }
.auth-input:focus { border-color: #1A6BFF; box-shadow: 0 0 0 4px rgba(26,107,255,0.1); }
.auth-btn { width: 100%; padding: 14px; background: #0D1B3E; color: white; border: none; border-radius: 12px; font-size: 15px; font-weight: 800; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; margin-top: 12px; }
.empty-state { text-align: center; padding: 60px 20px; color: #8A96B5; }
`;

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState("");
  const [shops, setShops] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<"pending" | "all">("pending");

  useEffect(() => {
    if (authed) fetchShops();
  }, [authed, filter]);

  async function fetchShops() {
    setLoading(true);
    let query = supabase
      .from("profiles")
      .select("id, name, shop_name, email, shopfront_image, shopfront_verified, shopfront_rejected, created_at")
      .eq("role", "shopkeeper")
      .not("shopfront_image", "is", null);
    if (filter === "pending") query = query.eq("shopfront_verified", false).not("shopfront_rejected", "eq", true);
    const { data } = await query.order("created_at", { ascending: false });
    setShops(data || []);
    setLoading(false);
  }

  async function approve(shopId: string) {
    await supabase.from("profiles").update({ shopfront_verified: true, shopfront_rejected: false }).eq("id", shopId);
    fetchShops();
  }

  async function reject(shopId: string) {
    await supabase.from("profiles").update({ shopfront_verified: false, shopfront_rejected: true, is_live: false }).eq("id", shopId);
    fetchShops();
  }

  if (!authed) return (
    <div style={{ background: "#F4F6FB", minHeight: "100vh", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <style>{CSS}</style>
      <div className="login-card">
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ fontSize: 36, marginBottom: 8 }}>🔐</div>
          <div style={{ fontSize: 20, fontWeight: 900, color: "#0D1B3E" }}>Admin Panel</div>
          <div style={{ fontSize: 13, color: "#8A96B5", marginTop: 4 }}>Bubbry Shop Verification</div>
        </div>
        <input className="auth-input" type="password" placeholder="Admin password" value={pw} onChange={(e) => setPw(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (pw === ADMIN_PASSWORD ? setAuthed(true) : alert("Wrong password"))} />
        <button className="auth-btn" onClick={() => pw === ADMIN_PASSWORD ? setAuthed(true) : alert("Wrong password")}>Enter Admin Panel</button>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#F4F6FB", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <style>{CSS}</style>

      <div className="admin-header">
        <div className="admin-brand">🫧 Bubbry Admin</div>
        <div className="admin-badge">Shop Verification</div>
      </div>

      {/* Filter tabs */}
      <div style={{ display: "flex", gap: 8, padding: "16px 16px 0" }}>
        {(["pending", "all"] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)} style={{ padding: "8px 16px", borderRadius: 10, border: "none", fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: 13, cursor: "pointer", background: filter === f ? "#1A6BFF" : "white", color: filter === f ? "white" : "#8A96B5", boxShadow: "0 1px 6px rgba(0,0,0,0.08)" }}>
            {f === "pending" ? "⏳ Pending Review" : "📋 All Shops"}
          </button>
        ))}
        <button onClick={fetchShops} style={{ marginLeft: "auto", padding: "8px 14px", borderRadius: 10, border: "1.5px solid #E4EAFF", background: "white", fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: 13, cursor: "pointer", color: "#1A6BFF" }}>↻ Refresh</button>
      </div>

      <div style={{ padding: 16, display: "grid", gap: 16, maxWidth: 600, margin: "0 auto" }}>
        {loading && <div className="empty-state">Loading...</div>}

        {!loading && shops.length === 0 && (
          <div className="empty-state">
            <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: "#0D1B3E" }}>No pending reviews</div>
            <div style={{ fontSize: 13, marginTop: 4 }}>All shopfronts have been reviewed</div>
          </div>
        )}

        {shops.map((shop) => {
          const isPending = !shop.shopfront_verified && !shop.shopfront_rejected;
          const isApproved = shop.shopfront_verified;
          const isRejected = shop.shopfront_rejected;
          return (
            <div key={shop.id} className="shop-card">
              {shop.shopfront_image
                ? <img className="shop-img" src={shop.shopfront_image} alt="Shopfront" />
                : <div className="shop-img-placeholder">🏪</div>
              }
              <div className="shop-info">
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                  <div className="shop-name">{shop.shop_name || shop.name}</div>
                  <span className={`status-chip ${isApproved ? "chip-approved" : isRejected ? "chip-rejected" : "chip-pending"}`}>
                    {isApproved ? "✓ Approved" : isRejected ? "✗ Rejected" : "⏳ Pending"}
                  </span>
                </div>
                <div className="shop-meta">{shop.name} · {shop.email}</div>
                <div className="action-row">
                  <button className="btn-approve" onClick={() => approve(shop.id)} disabled={isApproved}>
                    {isApproved ? "✓ Approved" : "✓ Approve"}
                  </button>
                  <button className="btn-reject" onClick={() => reject(shop.id)} disabled={isRejected}>
                    {isRejected ? "✗ Rejected" : "✗ Reject"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
