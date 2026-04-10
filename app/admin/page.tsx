"use client";
import { supabase } from "../../lib/supabase";
import { useState, useEffect } from "react";


const ADMIN_PASSWORD = "bubbry-admin-2024";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Plus Jakarta Sans', sans-serif; background: #F4F6FB; min-height: 100vh; }
.admin-header { background: #0D1B3E; padding: 16px 20px; display: flex; align-items: center; justify-content: space-between; gap:8px; flex-wrap:wrap; }
.admin-brand { font-size: 18px; font-weight: 900; color: white; }
.admin-badge { background: #1A6BFF; color: white; font-size: 11px; font-weight: 800; padding: 4px 10px; border-radius: 20px; }
.card { background: white; border-radius: 16px; border: 1.5px solid #E4EAFF; overflow: hidden; box-shadow: 0 2px 12px rgba(26,107,255,0.06); margin-bottom:16px; }
.shop-img { width: 100%; height: 200px; object-fit: cover; display: block; background: #E4EAFF; }
.shop-img-placeholder { width: 100%; height: 200px; background: #F4F6FB; display: flex; align-items: center; justify-content: center; font-size: 48px; }
.card-body { padding: 16px; }
.card-title { font-size: 15px; font-weight: 800; color: #0D1B3E; margin-bottom: 3px; }
.card-meta { font-size: 12px; color: #8A96B5; font-weight: 600; margin-bottom: 14px; }
.action-row { display: flex; gap: 8px; flex-wrap: wrap; }
.btn { flex: 1; min-width: 100px; padding: 11px 10px; border: none; border-radius: 10px; font-size: 13px; font-weight: 800; cursor: pointer; font-family: inherit; transition: all 0.2s; }
.btn-green { background: #00B37E; color: white; }
.btn-green:hover { background: #009068; }
.btn-green:disabled { opacity: 0.5; cursor: not-allowed; }
.btn-red { background: white; color: #E53E3E; border: 2px solid #E53E3E; }
.btn-red:hover { background: #FFF5F5; }
.btn-red:disabled { opacity: 0.5; cursor: not-allowed; }
.btn-orange { background: #FFF8E6; color: #946200; border: 1.5px solid #F59E0B; }
.btn-orange:hover { background: #FEFCE8; }
.btn-dark { background: #0D1B3E; color: white; }
.btn-dark:hover { background: #1A2F5A; }
.btn-dark:disabled { opacity: 0.5; cursor: not-allowed; }
.chip { display: inline-flex; align-items: center; gap: 4px; padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 800; }
.chip-pending { background: #FFF8E6; color: #946200; }
.chip-open { background: #FFF8E6; color: #946200; }
.chip-resolved { background: #E6FAF4; color: #00875A; }
.chip-approved { background: #E6FAF4; color: #00875A; }
.chip-rejected { background: #FFF0F0; color: #E53E3E; }
.login-card { background: white; border-radius: 20px; padding: 32px; box-shadow: 0 8px 40px rgba(0,0,0,0.1); max-width: 380px; margin: 80px auto; }
.auth-input { width: 100%; padding: 14px 16px; border: 2px solid #E4EAFF; border-radius: 12px; font-size: 15px; font-weight: 500; color: #0D1B3E; background: white; font-family: inherit; outline: none; }
.auth-input:focus { border-color: #1A6BFF; }
.auth-btn { width: 100%; padding: 14px; background: #0D1B3E; color: white; border: none; border-radius: 12px; font-size: 15px; font-weight: 800; cursor: pointer; font-family: inherit; margin-top: 12px; }
.empty-state { text-align: center; padding: 60px 20px; color: #8A96B5; }
.tab-row { display: flex; gap: 8px; padding: 16px 16px 0; flex-wrap: wrap; }
.tab-btn { padding: 8px 16px; border-radius: 10px; border: none; font-family: inherit; font-weight: 700; font-size: 13px; cursor: pointer; }
.tab-btn.active { background: #1A6BFF; color: white; }
.tab-btn:not(.active) { background: white; color: #8A96B5; box-shadow: 0 1px 6px rgba(0,0,0,0.08); }
.proof-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0; }
.proof-panel { display: flex; flex-direction: column; }
.proof-label { font-size: 10px; font-weight: 800; padding: 5px 10px; text-align: center; }
.proof-img { width: 100%; height: 170px; object-fit: contain; background: #F4F6FB; display: block; padding: 6px; }
.evidence-section { background: #F4F6FB; border-radius: 10px; padding: 12px; margin-bottom: 12px; }
.evidence-label { font-size: 10px; font-weight: 800; color: #8A96B5; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; }
.evidence-text { font-size: 13px; color: #0D1B3E; font-weight: 500; line-height: 1.5; }
.warning-banner { background: #FFF0F0; border: 1.5px solid #FFCDD2; border-radius: 10px; padding: 10px 14px; margin-bottom: 12px; font-size: 12px; font-weight: 700; color: #E53E3E; }
`;

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState("");
  const [adminTab, setAdminTab] = useState<"shops"|"photos"|"disputes">("shops");

  const [shops, setShops] = useState<any[]>([]);
  const [shopLoading, setShopLoading] = useState(false);
  const [shopFilter, setShopFilter] = useState<"pending"|"all">("pending");

  const [photos, setPhotos] = useState<any[]>([]);
  const [photoLoading, setPhotoLoading] = useState(false);

  const [disputes, setDisputes] = useState<any[]>([]);
  const [disputeLoading, setDisputeLoading] = useState(false);
  const [actioning, setActioning] = useState<string|null>(null);

  useEffect(() => { if (authed) { fetchShops(); fetchPendingPhotos(); fetchDisputes(); } }, [authed, shopFilter]);

  async function fetchShops() {
    setShopLoading(true);
    let query = supabase.from("profiles").select("id,name,shop_name,email,shopfront_image,shopfront_verified,shopfront_rejected,created_at").eq("role","shopkeeper").not("shopfront_image","is",null);
    if (shopFilter==="pending") query = query.eq("shopfront_verified",false).not("shopfront_rejected","eq",true);
    const { data } = await query.order("created_at",{ascending:false});
    setShops(data||[]); setShopLoading(false);
  }

  async function fetchPendingPhotos() {
    setPhotoLoading(true);
    const { data } = await supabase.from("master_products").select("id,name,size,category,brand,image_url,pending_image_url").not("pending_image_url","is",null).order("name",{ascending:true});
    setPhotos(data||[]); setPhotoLoading(false);
  }

  async function fetchDisputes() {
    setDisputeLoading(true);
    const { data } = await supabase.from("disputes").select("*").order("created_at",{ascending:false});
    setDisputes(data||[]); setDisputeLoading(false);
  }

  async function approveShop(id: string) { await supabase.from("profiles").update({shopfront_verified:true,shopfront_rejected:false}).eq("id",id); fetchShops(); }
  async function rejectShop(id: string) { await supabase.from("profiles").update({shopfront_verified:false,shopfront_rejected:true,is_live:false}).eq("id",id); fetchShops(); }
  async function approvePhoto(p: any) { await supabase.from("master_products").update({image_url:p.pending_image_url,pending_image_url:null}).eq("id",p.id); fetchPendingPhotos(); }
  async function rejectPhoto(p: any) { await supabase.from("master_products").update({pending_image_url:null}).eq("id",p.id); fetchPendingPhotos(); }

  // ── DISPUTE ACTIONS ──────────────────────────────────────────────────
  async function blameCustomer(dispute: any) {
    const custName = dispute.customer_name || (dispute.customer_id||"").slice(0,8);
    if (!confirm(`Customer (${custName}) is guilty?\n\nThis will:\n• Permanently ban their account\n• Lift the temp restriction\nThis cannot be undone.`)) return;
    setActioning(dispute.id);
    if (dispute.customer_id) {
      await supabase.from("profiles").update({
        banned: true, ban_reason: "fraud_payment",
        banned_at: new Date().toISOString(),
        temp_banned: false, temp_ban_reason: null,
      }).eq("id", dispute.customer_id);
      await supabase.from("notifications").insert({
        user_id: dispute.customer_id,
        title: "⛔ Account Banned",
        body: "Your Bubbry account has been banned due to submitting fraudulent payment proof. This decision is final. Contact support@bubbry.in to appeal.",
        type: "ban", read: false, created_at: new Date().toISOString(),
      });
    }
    await supabase.from("disputes").update({
      status: "resolved", resolution: "customer_banned",
      resolved_at: new Date().toISOString(),
    }).eq("id", dispute.id);
    setActioning(null); fetchDisputes();
    alert(`✓ Customer (${custName}) permanently banned and notified.`);
  }

  async function blameShop(dispute: any) {
    const shopName = dispute.shop_name || (dispute.shop_id||"").slice(0,8);
    if (!confirm(`Shop (${shopName}) is guilty?\n\nThis will:\n• Lift customer's temp ban\n• Suspend or ban the shop\n• Notify both parties`)) return;
    setActioning(dispute.id);
    // Always lift the customer's temp ban — they were innocent
    if (dispute.customer_id) {
      await supabase.from("profiles").update({ temp_banned: false, temp_ban_reason: null }).eq("id", dispute.customer_id);
    }
    const { count: priorOffences } = await supabase.from("disputes")
      .select("id", { count: "exact", head: true })
      .eq("shop_id", dispute.shop_id).eq("resolution", "shop_suspended");
    const isBan = (priorOffences ?? 0) >= 1;
    const suspendedUntil = new Date();
    suspendedUntil.setDate(suspendedUntil.getDate() + 15);
    if (isBan) {
      await supabase.from("profiles").update({
        is_live: false, banned: true, ban_reason: "repeated_fraud", banned_at: new Date().toISOString(),
      }).eq("id", dispute.shop_id);
      await supabase.from("disputes").update({ status: "resolved", resolution: "shop_banned", resolved_at: new Date().toISOString() }).eq("id", dispute.id);
      await supabase.from("notifications").insert({ user_id: dispute.shop_id, title: "⛔ Shop Permanently Banned", body: "Your shop has been permanently banned from Bubbry due to repeated fraudulent activity. You cannot create a new shop account in this area.", type: "ban", read: false, created_at: new Date().toISOString() });
      if (dispute.customer_id) await supabase.from("notifications").insert({ user_id: dispute.customer_id, title: "✅ Dispute Resolved — Account Restored", body: `Your account restriction has been lifted. The shop has been permanently banned. Refund of ₹${dispute.order_amount||0} incoming within 24–48 hrs.`, type: "refund", read: false, created_at: new Date().toISOString() });
      alert(`✓ Shop (${shopName}) permanently banned. Customer account restored.`);
    } else {
      await supabase.from("profiles").update({ is_live: false, auto_offlined_until: suspendedUntil.toISOString(), suspended_until: suspendedUntil.toISOString() }).eq("id", dispute.shop_id);
      await supabase.from("disputes").update({ status: "resolved", resolution: "shop_suspended", resolved_at: new Date().toISOString() }).eq("id", dispute.id);
      await supabase.from("notifications").insert({ user_id: dispute.shop_id, title: "⚠️ Shop Suspended for 15 Days", body: `Your shop has been suspended for 15 days. You must refund ₹${dispute.order_amount||0} to the customer within 48 hours. A second offence will result in a permanent ban.`, type: "suspension", read: false, created_at: new Date().toISOString() });
      if (dispute.customer_id) await supabase.from("notifications").insert({ user_id: dispute.customer_id, title: "✅ Dispute Resolved — Account Restored", body: `Your account restriction has been lifted. Dispute ruled in your favour. Shopkeeper instructed to refund ₹${dispute.order_amount||0} to your UPI within 48 hours.`, type: "refund", read: false, created_at: new Date().toISOString() });
      alert(`✓ Shop (${shopName}) suspended 15 days. Customer account restored & refund instructed.`);
    }
    setActioning(null); fetchDisputes();
  }

  async function dismissDispute(dispute: any) {
    if (!confirm("Dismiss as inconclusive?\n\nCustomer's temporary restriction will be lifted.")) return;
    setActioning(dispute.id);
    if (dispute.customer_id) {
      await supabase.from("profiles").update({ temp_banned: false, temp_ban_reason: null }).eq("id", dispute.customer_id);
      await supabase.from("notifications").insert({ user_id: dispute.customer_id, title: "ℹ️ Dispute Closed", body: "The payment dispute on your account has been closed as inconclusive. Your account restriction has been lifted.", type: "info", read: false, created_at: new Date().toISOString() });
    }
    await supabase.from("disputes").update({ status: "resolved", resolution: "dismissed", resolved_at: new Date().toISOString() }).eq("id", dispute.id);
    setActioning(null); fetchDisputes();
    alert("✓ Dispute dismissed. Customer account restriction lifted.");
  }

  if (!authed) return (
    <div style={{background:"#F4F6FB",minHeight:"100vh",fontFamily:"'Plus Jakarta Sans',sans-serif"}}>
      <style>{CSS}</style>
      <div className="login-card">
        <div style={{textAlign:"center",marginBottom:24}}>
          <div style={{fontSize:36,marginBottom:8}}>🔐</div>
          <div style={{fontSize:20,fontWeight:900,color:"#0D1B3E"}}>Admin Panel</div>
          <div style={{fontSize:13,color:"#8A96B5",marginTop:4}}>Bubbry Shop Verification</div>
        </div>
        <input className="auth-input" type="password" placeholder="Admin password" value={pw} onChange={e=>setPw(e.target.value)} onKeyDown={e=>e.key==="Enter"&&(pw===ADMIN_PASSWORD?setAuthed(true):alert("Wrong password"))} />
        <button className="auth-btn" onClick={()=>pw===ADMIN_PASSWORD?setAuthed(true):alert("Wrong password")}>Enter Admin Panel</button>
      </div>
    </div>
  );

  const openDisputes = disputes.filter(d=>d.status==="open");

  return (
    <div style={{minHeight:"100vh",background:"#F4F6FB",fontFamily:"'Plus Jakarta Sans',sans-serif"}}>
      <style>{CSS}</style>
      <div className="admin-header">
        <div className="admin-brand">🫧 Bubbry Admin</div>
        <a href="/admin/shops-map" style={{display:"flex",alignItems:"center",gap:5,background:"rgba(255,255,255,0.1)",padding:"6px 12px",borderRadius:9,textDecoration:"none",color:"white",fontSize:12,fontWeight:800}}>🗺️ Shops Map</a>
        <div className="admin-badge">Admin Panel</div>
      </div>

      <div className="tab-row">
        <button className={`tab-btn ${adminTab==="shops"?"active":""}`} onClick={()=>setAdminTab("shops")}>🏪 Shop Verification</button>
        <button className={`tab-btn ${adminTab==="photos"?"active":""}`} onClick={()=>{setAdminTab("photos");fetchPendingPhotos();}}>📸 Photos {photos.length>0?`(${photos.length})`:""}</button>
        <button className={`tab-btn ${adminTab==="disputes"?"active":""}`} onClick={()=>{setAdminTab("disputes");fetchDisputes();}}>
          🚨 Disputes {openDisputes.length>0?`(${openDisputes.length})` : ""}
        </button>
        <button onClick={()=>{fetchShops();fetchPendingPhotos();fetchDisputes();}} style={{marginLeft:"auto",padding:"8px 14px",borderRadius:10,border:"1.5px solid #E4EAFF",background:"white",fontFamily:"inherit",fontWeight:700,fontSize:13,cursor:"pointer",color:"#1A6BFF"}}>↻ Refresh</button>
      </div>

      {/* ── SHOP VERIFICATION ── */}
      {adminTab==="shops" && (
        <>
          <div style={{display:"flex",gap:8,padding:"12px 16px 0"}}>
            {(["pending","all"] as const).map(f=>(
              <button key={f} onClick={()=>setShopFilter(f)} style={{padding:"7px 14px",borderRadius:9,border:"none",fontFamily:"inherit",fontWeight:700,fontSize:12,cursor:"pointer",background:shopFilter===f?"#1A6BFF":"white",color:shopFilter===f?"white":"#8A96B5",boxShadow:"0 1px 6px rgba(0,0,0,0.08)"}}>
                {f==="pending"?"⏳ Pending Review":"📋 All Shops"}
              </button>
            ))}
          </div>
          <div style={{padding:16,display:"grid",gap:16,maxWidth:600,margin:"0 auto"}}>
            {shopLoading && <div className="empty-state">Loading...</div>}
            {!shopLoading && shops.length===0 && <div className="empty-state"><div style={{fontSize:48,marginBottom:12}}>✅</div><div style={{fontSize:16,fontWeight:800,color:"#0D1B3E"}}>No pending reviews</div></div>}
            {shops.map(shop=>{
              const isApproved=shop.shopfront_verified, isRejected=shop.shopfront_rejected;
              return (
                <div key={shop.id} className="card">
                  {shop.shopfront_image?<img className="shop-img" src={shop.shopfront_image} alt="Shopfront"/>:<div className="shop-img-placeholder">🏪</div>}
                  <div className="card-body">
                    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:4}}>
                      <div className="card-title">{shop.shop_name||shop.name}</div>
                      <span className={`chip ${isApproved?"chip-approved":isRejected?"chip-rejected":"chip-pending"}`}>{isApproved?"✓ Approved":isRejected?"✗ Rejected":"⏳ Pending"}</span>
                    </div>
                    <div className="card-meta">{shop.name} · {shop.email}</div>
                    <div className="action-row">
                      <button className="btn btn-green" onClick={()=>approveShop(shop.id)} disabled={isApproved}>{isApproved?"✓ Approved":"✓ Approve"}</button>
                      <button className="btn btn-red" onClick={()=>rejectShop(shop.id)} disabled={isRejected}>{isRejected?"✗ Rejected":"✗ Reject"}</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* ── PRODUCT PHOTOS ── */}
      {adminTab==="photos" && (
        <div style={{padding:16,display:"grid",gap:16,maxWidth:600,margin:"0 auto"}}>
          {photoLoading && <div className="empty-state">Loading...</div>}
          {!photoLoading && photos.length===0 && <div className="empty-state"><div style={{fontSize:48,marginBottom:12}}>✅</div><div style={{fontSize:16,fontWeight:800,color:"#0D1B3E"}}>No pending photos</div></div>}
          {photos.map(product=>(
            <div key={product.id} className="card">
              <div className="proof-grid" style={{borderBottom:"1.5px solid #E4EAFF"}}>
                <div className="proof-panel" style={{borderRight:"1.5px solid #E4EAFF"}}>
                  <div className="proof-label" style={{background:"#FFF8E6",color:"#946200"}}>⏳ SUBMITTED PHOTO</div>
                  <img className="proof-img" src={product.pending_image_url} alt={product.name}/>
                </div>
                <div className="proof-panel">
                  <div className="proof-label" style={{background:"#E6FAF4",color:"#00875A"}}>✓ CURRENT PHOTO</div>
                  {product.image_url?<img className="proof-img" src={product.image_url} alt={product.name}/>:<div style={{height:170,display:"flex",alignItems:"center",justifyContent:"center",fontSize:36,color:"#B0BACC"}}>🛍️</div>}
                </div>
              </div>
              <div className="card-body">
                <div className="card-title">{product.name}</div>
                <div className="card-meta">{[product.size,product.brand,product.category].filter(Boolean).join(" · ")}</div>
                <div className="action-row">
                  <button className="btn btn-green" onClick={()=>approvePhoto(product)}>✓ Approve Photo</button>
                  <button className="btn btn-red" onClick={()=>rejectPhoto(product)}>✗ Reject Photo</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── DISPUTES ── */}
      {adminTab==="disputes" && (
        <div style={{padding:16,display:"grid",gap:16,maxWidth:640,margin:"0 auto"}}>
          {disputeLoading && <div className="empty-state">Loading...</div>}
          {!disputeLoading && disputes.length===0 && <div className="empty-state"><div style={{fontSize:48,marginBottom:12}}>✅</div><div style={{fontSize:16,fontWeight:800,color:"#0D1B3E"}}>No disputes</div></div>}
          {disputes.map(d=>(
            <div key={d.id} className="card">
              <div className="card-body">
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
                  <div style={{fontSize:13,fontWeight:800,color:"#0D1B3E"}}>🚨 Fraud Report</div>
                  <span className={`chip ${d.status==="open"?"chip-open":"chip-resolved"}`}>
                    {d.status==="open"?"⏳ Open":"✓ "+((d.resolution||"resolved").replace(/_/g," "))}
                  </span>
                </div>
                <div style={{fontSize:11,color:"#8A96B5",fontWeight:600,marginBottom:12}}>
                  Order #{(d.order_id||"").slice(0,8).toUpperCase()} · {new Date(d.created_at).toLocaleDateString("en-IN")}
                  {d.order_amount ? ` · ₹${d.order_amount}` : ""}
                </div>

                {/* Contact details for admin team */}
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
                  <div style={{background:"#EBF4FF",borderRadius:10,padding:"10px 12px"}}>
                    <div style={{fontSize:10,fontWeight:800,color:"#1A6BFF",textTransform:"uppercase",letterSpacing:"0.5px",marginBottom:6}}>🏪 Shopkeeper</div>
                    <div style={{fontSize:13,fontWeight:700,color:"#0D1B3E",marginBottom:2}}>{d.shop_name || "—"}</div>
                    {d.shop_phone
                      ? <a href={`tel:${d.shop_phone}`} style={{fontSize:12,fontWeight:800,color:"#1A6BFF",textDecoration:"none",display:"flex",alignItems:"center",gap:4}}>📞 {d.shop_phone}</a>
                      : <div style={{fontSize:12,color:"#B0BACC",fontWeight:500}}>No phone on file</div>}
                  </div>
                  <div style={{background:"#FFF0F0",borderRadius:10,padding:"10px 12px",position:"relative"}}>
                    <div style={{fontSize:10,fontWeight:800,color:"#E53E3E",textTransform:"uppercase",letterSpacing:"0.5px",marginBottom:6}}>👤 Customer</div>
                    <div style={{fontSize:13,fontWeight:700,color:"#0D1B3E",marginBottom:2}}>{d.customer_name || "—"}</div>
                    {d.customer_phone
                      ? <a href={`tel:${d.customer_phone}`} style={{fontSize:12,fontWeight:800,color:"#E53E3E",textDecoration:"none",display:"flex",alignItems:"center",gap:4}}>📞 {d.customer_phone}</a>
                      : <div style={{fontSize:12,color:"#B0BACC",fontWeight:500}}>No phone on file</div>}
                    {d.status === "open" && <div style={{marginTop:5,background:"#FFE4E4",borderRadius:6,padding:"3px 7px",fontSize:10,fontWeight:800,color:"#E53E3E",display:"inline-block"}}>⚠️ Account Temp Restricted</div>}
                  </div>
                </div>

                {/* Evidence section */}
                <div className="evidence-section">
                  <div className="evidence-label">📝 Shopkeeper's Description</div>
                  <div className="evidence-text">{d.note || "No description provided"}</div>
                </div>

                {/* Screenshots side by side */}
                {(d.payment_proof_url || d.proof_url) && (
                  <div className="proof-grid" style={{borderRadius:10,overflow:"hidden",border:"1.5px solid #E4EAFF",marginBottom:12}}>
                    {d.payment_proof_url && (
                      <div className="proof-panel" style={{borderRight:d.proof_url?"1.5px solid #E4EAFF":"none"}}>
                        <div className="proof-label" style={{background:"#FFF0F0",color:"#E53E3E"}}>Customer's Payment Screenshot</div>
                        <a href={d.payment_proof_url} target="_blank" rel="noreferrer">
                          <img className="proof-img" src={d.payment_proof_url} alt="Customer payment proof" style={{cursor:"pointer"}}/>
                        </a>
                        <div style={{fontSize:10,color:"#8A96B5",textAlign:"center",padding:"4px 0"}}>Tap to open full size</div>
                      </div>
                    )}
                    {d.proof_url && (
                      <div className="proof-panel">
                        <div className="proof-label" style={{background:"#EBF4FF",color:"#1A6BFF"}}>Shop's Evidence Screenshot</div>
                        <a href={d.proof_url} target="_blank" rel="noreferrer">
                          <img className="proof-img" src={d.proof_url} alt="Shop proof" style={{cursor:"pointer"}}/>
                        </a>
                        <div style={{fontSize:10,color:"#8A96B5",textAlign:"center",padding:"4px 0"}}>Tap to open full size</div>
                      </div>
                    )}
                  </div>
                )}

                {d.status === "open" ? (
                  <>
                    <div className="warning-banner">
                      ⚠️ Review both screenshots carefully before taking action. This cannot be undone.
                    </div>
                    <div style={{fontSize:12,color:"#8A96B5",fontWeight:600,marginBottom:8}}>
                      If customer is guilty → Ban their account permanently<br/>
                      If shop is guilty → 15-day suspension + refund (2nd offence = permanent ban)
                    </div>
                    <div className="action-row">
                      <button className="btn btn-red" onClick={()=>blameCustomer(d)} disabled={actioning===d.id}>
                        {actioning===d.id?"Working...":"⛔ Ban Customer"}
                      </button>
                      <button className="btn btn-orange" onClick={()=>blameShop(d)} disabled={actioning===d.id}>
                        {actioning===d.id?"Working...":"🔒 Punish Shop"}
                      </button>
                      <button className="btn btn-dark" onClick={()=>dismissDispute(d)} disabled={actioning===d.id}>
                        Dismiss
                      </button>
                    </div>
                  </>
                ) : (
                  <div style={{padding:"10px 14px",background:"#F4F6FB",borderRadius:10,fontSize:12,fontWeight:700,color:"#8A96B5"}}>
                    Resolved: {(d.resolution||"").replace(/_/g," ")} on {d.resolved_at ? new Date(d.resolved_at).toLocaleDateString("en-IN") : "—"}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
