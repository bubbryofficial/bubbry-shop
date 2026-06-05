"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
* { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
body { font-family: 'Plus Jakarta Sans', sans-serif; background: #F4F6FB; }
.page { min-height: 100vh; background: #F4F6FB; padding-bottom: 40px; font-family: 'Plus Jakarta Sans', sans-serif; }
.header { background: linear-gradient(135deg, #1A6BFF 0%, #0B47CC 100%); padding: 20px 16px 32px; }
.header-top { display: flex; align-items: center; gap: 12px; padding-bottom: 12px; }
.back-btn { width: 36px; height: 36px; border-radius: 10px; background: rgba(255,255,255,0.18); border: 1.5px solid rgba(255,255,255,0.25); color: white; font-size: 18px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-family: inherit; }
.header-title { font-size: 18px; font-weight: 900; color: white; letter-spacing: -0.5px; }
.hero { padding: 8px 8px 0; text-align: center; }
.hero-emoji { font-size: 40px; margin-bottom: 8px; }
.hero-title { color: white; font-size: 22px; font-weight: 900; letter-spacing: -0.5px; margin-bottom: 4px; }
.hero-sub { color: rgba(255,255,255,0.85); font-size: 13px; font-weight: 500; max-width: 320px; margin: 0 auto; line-height: 1.5; }
.section { padding: 0 16px; margin-top: 18px; }
.section-title { font-size: 13px; font-weight: 800; color: #0D1B3E; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 0.5px; }
.plans { padding: 0 16px; margin-top: -16px; }
.plan-card { background: white; border-radius: 20px; padding: 20px; margin-bottom: 14px; box-shadow: 0 8px 32px rgba(13,27,62,0.08); border: 2.5px solid transparent; transition: all 0.2s; cursor: pointer; }
.plan-card.selected { border-color: #1A6BFF; box-shadow: 0 12px 36px rgba(26,107,255,0.2); }
.plan-head { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; }
.plan-name { font-size: 17px; font-weight: 900; color: #0D1B3E; letter-spacing: -0.3px; }
.plan-sub { font-size: 12px; color: #8A96B5; font-weight: 600; margin-top: 2px; }
.plan-price-amount { font-size: 26px; font-weight: 900; color: #1A6BFF; line-height: 1; letter-spacing: -1px; }
.plan-price-period { font-size: 11px; color: #8A96B5; font-weight: 700; margin-top: 2px; text-align: right; }
.feature { display: flex; gap: 9px; align-items: flex-start; margin-bottom: 7px; font-size: 13px; color: #4A5880; font-weight: 600; line-height: 1.4; }
.feature-icon { flex-shrink: 0; font-size: 14px; margin-top: 1px; }
.form-card { background: white; border-radius: 18px; padding: 18px; box-shadow: 0 4px 18px rgba(13,27,62,0.06); }
.lbl { font-size: 11px; font-weight: 700; color: #8A96B5; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; display: block; }
.inp { width: 100%; padding: 12px 14px; border: 1.5px solid #E4EAFF; border-radius: 11px; font-size: 14px; font-weight: 500; color: #0D1B3E; font-family: inherit; outline: none; margin-bottom: 14px; transition: border-color 0.2s; }
.inp:focus { border-color: #1A6BFF; }
.row2 { display: flex; gap: 10px; }
.row2 > div { flex: 1; }
.emoji-row { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 14px; }
.emoji-pick { width: 42px; height: 42px; border-radius: 10px; border: 1.5px solid #E4EAFF; background: white; font-size: 20px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.15s; }
.emoji-pick.sel { border-color: #1A6BFF; background: #EBF1FF; }
.color-row { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 14px; }
.color-pick { width: 34px; height: 34px; border-radius: 9px; cursor: pointer; border: 3px solid transparent; transition: all 0.15s; }
.color-pick.sel { border-color: #0D1B3E; transform: scale(1.08); }
.preview { border-radius: 16px; padding: 18px; color: white; position: relative; overflow: hidden; min-height: 92px; margin-bottom: 14px; }
.preview-title { font-size: 17px; font-weight: 900; margin-bottom: 4px; }
.preview-sub { font-size: 12px; font-weight: 500; opacity: 0.92; line-height: 1.4; }
.preview-cta { display: inline-block; margin-top: 10px; background: rgba(255,255,255,0.22); padding: 6px 14px; border-radius: 8px; font-size: 12px; font-weight: 800; }
.preview-emoji { position: absolute; right: 14px; bottom: 10px; font-size: 40px; opacity: 0.85; }
.btn-primary { display: block; width: 100%; padding: 15px; background: linear-gradient(135deg, #1A6BFF, #0B47CC); color: white; border: none; border-radius: 14px; font-size: 15px; font-weight: 800; cursor: pointer; font-family: inherit; box-shadow: 0 6px 24px rgba(26,107,255,0.3); transition: all 0.2s; }
.btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
.btn-primary:not(:disabled):active { transform: scale(0.98); }
.ad-item { background: white; border-radius: 16px; padding: 16px; margin-bottom: 12px; box-shadow: 0 4px 18px rgba(13,27,62,0.06); }
.ad-item-top { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; margin-bottom: 10px; }
.ad-item-title { font-size: 15px; font-weight: 800; color: #0D1B3E; }
.ad-item-meta { font-size: 11px; color: #8A96B5; font-weight: 600; margin-top: 3px; }
.status-chip { font-size: 10px; font-weight: 800; padding: 4px 10px; border-radius: 20px; white-space: nowrap; }
.st-pending { background: #FFF8E6; color: #946200; }
.st-approved { background: #EBF1FF; color: #1A6BFF; }
.st-active { background: #E6FAF4; color: #00875A; }
.st-rejected { background: #FFF0F0; color: #E53E3E; }
.st-expired { background: #F0F0F4; color: #8A96B5; }
.pay-btn { width: 100%; padding: 12px; background: linear-gradient(135deg, #00875A, #00A56C); color: white; border: none; border-radius: 11px; font-size: 14px; font-weight: 800; cursor: pointer; font-family: inherit; margin-top: 10px; }
.pay-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.reject-note { background: #FFF0F0; border: 1.5px solid #FFCDD2; border-radius: 10px; padding: 10px 12px; font-size: 12px; color: #E53E3E; font-weight: 600; margin-top: 8px; }
.info-card { margin: 16px 16px 0; padding: 14px 16px; background: white; border-radius: 14px; box-shadow: 0 2px 8px rgba(13,27,62,0.05); display: flex; gap: 12px; align-items: flex-start; }
.info-card-icon { font-size: 22px; flex-shrink: 0; }
.info-card-title { font-size: 13px; font-weight: 800; color: #0D1B3E; margin-bottom: 2px; }
.info-card-text { font-size: 12px; color: #4A5880; font-weight: 500; line-height: 1.5; }
.empty { text-align: center; padding: 24px; color: #8A96B5; font-size: 13px; font-weight: 600; }
.spin-wrap { min-height: 100vh; display: flex; align-items: center; justify-content: center; flex-direction: column; gap: 12px; }
.spinner { width: 36px; height: 36px; border: 3px solid #E4EAFF; border-top-color: #1A6BFF; border-radius: 50%; animation: spin 0.7s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
`;

declare global { interface Window { Razorpay: any; } }

const AD_TYPES = [
  { slot: "hero_banner",   name: "Hero Banner",   price: 999, emoji: "🎯",
    sub: "Top of customer home — maximum visibility",
    features: ["Large banner at the top of the customer app", "Shown to every customer in your city", "Live for 30 days after approval"] },
  { slot: "featured_shop", name: "Featured Shop", price: 699, emoji: "🏆",
    sub: "Highlighted in the featured shops row",
    features: ["Your shop appears in the Featured row", "Higher placement in your city", "Live for 30 days after approval"] },
];

const EMOJIS = ["🛒","🎯","🏆","🔥","⭐","🎁","💥","🛍️","✨","🥇","📢","💎"];
const COLORS = ["#1A6BFF","#FF6B35","#00875A","#E53E3E","#7C3AED","#0D1B3E","#FF3DA8","#946200"];

// Advertising services attract 18% GST (SAC 998361), charged on top of the base price.
const GST_RATE = 0.18;
function gstAmount(base: number) { return Math.round(base * GST_RATE * 100) / 100; }
function gstTotal(base: number) { return Math.round((base + gstAmount(base)) * 100) / 100; }

type Mode = "list" | "create";

export default function ShopAdsPage() {
  const router = useRouter();
  const calledRef = useRef(false);
  const [loading, setLoading] = useState(true);
  const [shop, setShop] = useState<any>(null);
  const [ads, setAds] = useState<any[]>([]);
  const [mode, setMode] = useState<Mode>("list");
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // create form
  const [slot, setSlot] = useState<"hero_banner" | "featured_shop">("hero_banner");
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [cta, setCta] = useState("Shop Now");
  const [emoji, setEmoji] = useState("🛒");
  const [bgColor, setBgColor] = useState("#1A6BFF");

  const selectedType = AD_TYPES.find(t => t.slot === slot)!;

  useEffect(() => {
    if (calledRef.current) return;
    calledRef.current = true;
    init();
  }, []);

  async function init() {
    const { data: { session } } = await supabase.auth.getSession();
    const uid = session?.user?.id || localStorage.getItem("bubbry_shop_uid") || "";
    if (!uid) { router.replace("/login"); return; }

    const { data: profile } = await supabase
      .from("profiles")
      .select("id, role, shop_name, name, city, state, phone, shopfront_verified, subscription_status")
      .eq("id", uid).single();

    if (!profile || profile.role !== "shopkeeper") { router.replace("/login"); return; }
    setShop(profile);
    await loadAds(uid);
    setLoading(false);

    // Preload Razorpay SDK
    if (!document.getElementById("razorpay-sdk")) {
      const s = document.createElement("script");
      s.id = "razorpay-sdk";
      s.src = "https://checkout.razorpay.com/v1/checkout.js";
      document.body.appendChild(s);
    }
  }

  async function loadAds(uid: string) {
    const { data } = await supabase
      .from("ads").select("*").eq("shop_id", uid)
      .order("created_at", { ascending: false });
    setAds(data || []);
  }

  function statusLabel(ad: any): { cls: string; text: string } {
    const expired = ad.paid_until && new Date(ad.paid_until) < new Date();
    if (ad.status === "active" && expired) return { cls: "st-expired", text: "Expired" };
    switch (ad.status) {
      case "pending_approval": return { cls: "st-pending",  text: "⏳ Awaiting approval" };
      case "approved_unpaid":  return { cls: "st-approved", text: "✓ Approved — pay to go live" };
      case "active":           return { cls: "st-active",   text: "🟢 Live" };
      case "rejected":         return { cls: "st-rejected", text: "✗ Rejected" };
      case "expired":          return { cls: "st-expired",  text: "Expired" };
      default:                 return { cls: "st-pending",  text: ad.status || "—" };
    }
  }

  async function submitAd() {
    if (!title.trim()) { alert("Please enter an ad title"); return; }
    if (!shop) return;
    setSaving(true);
    const type = AD_TYPES.find(t => t.slot === slot)!;
    const { error } = await supabase.from("ads").insert({
      shop_id: shop.id,
      shop_name: shop.shop_name || shop.name || "",
      city: shop.city || null,
      slot,
      title: title.trim(),
      subtitle: subtitle.trim(),
      cta: cta.trim() || "Shop Now",
      emoji,
      bg_color: bgColor,
      price: type.price,
      status: "pending_approval",
      active: false,
      submitted_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    });
    setSaving(false);
    if (error) { alert("Could not submit ad: " + error.message); return; }
    alert("✓ Ad submitted! Your city admin will review it shortly. You'll be able to pay once it's approved.");
    // reset + go back to list
    setTitle(""); setSubtitle(""); setCta("Shop Now"); setEmoji("🛒"); setBgColor("#1A6BFF");
    setMode("list");
    await loadAds(shop.id);
  }

  async function payForAd(ad: any) {
    setProcessingId(ad.id);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/create-ad-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          "Authorization": `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`,
        },
        body: JSON.stringify({ ad_id: ad.id }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        alert("Could not start payment: " + (data.error || "unknown"));
        setProcessingId(null); return;
      }

      if (!window.Razorpay) {
        alert("Payment is loading, please try again in a moment.");
        setProcessingId(null); return;
      }

      const rzp = new window.Razorpay({
        key: data.razorpay_key,
        order_id: data.order_id,
        amount: data.amount,           // paise
        currency: "INR",
        name: "Bubbry",
        description: `${selectedTypeName(ad.slot)} ad — ₹${ad.price} + 18% GST`,
        prefill: { name: shop?.name || shop?.shop_name || "", contact: shop?.phone || "" },
        theme: { color: "#1A6BFF" },
        handler: async function (response: any) {
          // Verify payment server-side, which flips the ad to active
          const vRes = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/verify-ad-payment`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "apikey": process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
              "Authorization": `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`,
            },
            body: JSON.stringify({
              ad_id: ad.id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });
          const vData = await vRes.json();
          if (vRes.ok && vData.success) {
            alert("✅ Payment successful! Your ad is now live for 30 days.");
          } else {
            alert("Payment received but activation failed: " + (vData.error || "contact support") + "\nYour payment is safe; the ad will activate shortly.");
          }
          setProcessingId(null);
          if (shop) await loadAds(shop.id);
        },
        modal: { ondismiss: () => setProcessingId(null) },
      });
      rzp.open();
    } catch (e: any) {
      alert("Error: " + e.message);
      setProcessingId(null);
    }
  }

  function selectedTypeName(s: string) {
    return AD_TYPES.find(t => t.slot === s)?.name || "Ad";
  }

  if (loading) return (
    <div className="spin-wrap"><style>{CSS}</style><div className="spinner" /><div style={{ fontSize: 14, color: "#8A96B5", fontWeight: 600 }}>Loading ads…</div></div>
  );

  return (
    <div className="page">
      <style>{CSS}</style>

      <div className="header">
        <div className="header-top">
          <button className="back-btn" onClick={() => mode === "create" ? setMode("list") : router.push("/shop-dashboard")}>←</button>
          <div className="header-title">{mode === "create" ? "Create Ad" : "Advertise Your Shop"}</div>
        </div>
        <div className="hero">
          <div className="hero-emoji">📢</div>
          <div className="hero-title">{mode === "create" ? "Design your ad" : "Reach more customers"}</div>
          <div className="hero-sub">
            {mode === "create"
              ? "Fill in your ad, submit for approval, then pay to go live."
              : "Promote your shop on the Bubbry customer app. Ads are reviewed by your city admin, then go live after payment."}
          </div>
        </div>
      </div>

      {mode === "list" && (
        <>
          <div className="section">
            <button className="btn-primary" onClick={() => setMode("create")}>+ Create a new ad</button>
          </div>

          <div className="section">
            <div className="section-title">Your Ads</div>
            {ads.length === 0 && <div className="empty">No ads yet. Create one to start promoting your shop.</div>}
            {ads.map(ad => {
              const st = statusLabel(ad);
              return (
                <div key={ad.id} className="ad-item">
                  <div className="ad-item-top">
                    <div>
                      <div className="ad-item-title">{ad.title}</div>
                      <div className="ad-item-meta">
                        {selectedTypeName(ad.slot)} · ₹{ad.price}
                        {ad.paid_until && ad.status === "active" && ` · until ${new Date(ad.paid_until).toLocaleDateString("en-IN")}`}
                      </div>
                    </div>
                    <span className={`status-chip ${st.cls}`}>{st.text}</span>
                  </div>

                  {ad.status === "rejected" && ad.rejected_reason && (
                    <div className="reject-note">Reason: {ad.rejected_reason}</div>
                  )}

                  {ad.status === "approved_unpaid" && (
                    <>
                      <div style={{ fontSize: 12, color: "#4A5880", fontWeight: 600, marginTop: 8, lineHeight: 1.7, borderTop: "1px solid #F4F6FB", paddingTop: 8 }}>
                        <div style={{ display: "flex", justifyContent: "space-between" }}><span>Ad price</span><span>₹{ad.price}</span></div>
                        <div style={{ display: "flex", justifyContent: "space-between" }}><span>GST (18%)</span><span>₹{gstAmount(ad.price).toFixed(2)}</span></div>
                        <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 800, color: "#0D1B3E" }}><span>Total payable</span><span>₹{gstTotal(ad.price).toFixed(2)}</span></div>
                      </div>
                      <button className="pay-btn" disabled={processingId === ad.id} onClick={() => payForAd(ad)}>
                        {processingId === ad.id ? "Opening payment…" : `Pay ₹${gstTotal(ad.price).toFixed(2)} to go live`}
                      </button>
                    </>
                  )}
                </div>
              );
            })}
          </div>

          <div className="info-card">
            <div className="info-card-icon">ℹ️</div>
            <div>
              <div className="info-card-title">How it works</div>
              <div className="info-card-text">
                1. Create your ad and submit it. 2. Your city admin reviews it. 3. Once approved, pay to publish. Your ad stays live for 30 days.
              </div>
            </div>
          </div>
        </>
      )}

      {mode === "create" && (
        <>
          <div className="plans">
            {AD_TYPES.map(t => (
              <div key={t.slot} className={`plan-card ${slot === t.slot ? "selected" : ""}`} onClick={() => { setSlot(t.slot as any); }}>
                <div className="plan-head">
                  <div>
                    <div className="plan-name">{t.emoji} {t.name}</div>
                    <div className="plan-sub">{t.sub}</div>
                  </div>
                  <div>
                    <div className="plan-price-amount">₹{t.price}</div>
                    <div className="plan-price-period">+ 18% GST / 30 days</div>
                  </div>
                </div>
                {t.features.map((f, i) => (
                  <div key={i} className="feature"><span className="feature-icon">✓</span>{f}</div>
                ))}
              </div>
            ))}
          </div>

          <div className="section">
            <div className="form-card">
              <label className="lbl">Ad Title</label>
              <input className="inp" placeholder="e.g. Fresh groceries, 20% off!" value={title} maxLength={40} onChange={e => setTitle(e.target.value)} />

              <label className="lbl">Subtitle (optional)</label>
              <input className="inp" placeholder="e.g. Free delivery above ₹299" value={subtitle} maxLength={60} onChange={e => setSubtitle(e.target.value)} />

              <label className="lbl">Button Text</label>
              <input className="inp" placeholder="Shop Now" value={cta} maxLength={20} onChange={e => setCta(e.target.value)} />

              <label className="lbl">Icon</label>
              <div className="emoji-row">
                {EMOJIS.map(em => (
                  <div key={em} className={`emoji-pick ${emoji === em ? "sel" : ""}`} onClick={() => setEmoji(em)}>{em}</div>
                ))}
              </div>

              <label className="lbl">Background Color</label>
              <div className="color-row">
                {COLORS.map(c => (
                  <div key={c} className={`color-pick ${bgColor === c ? "sel" : ""}`} style={{ background: c }} onClick={() => setBgColor(c)} />
                ))}
              </div>

              <label className="lbl">Preview</label>
              <div className="preview" style={{ background: bgColor }}>
                <div className="preview-title">{title || "Your ad title"}</div>
                <div className="preview-sub">{subtitle || "Your subtitle appears here"}</div>
                <div className="preview-cta">{cta || "Shop Now"}</div>
                <div className="preview-emoji">{emoji}</div>
              </div>

              <button className="btn-primary" disabled={saving || !title.trim()} onClick={submitAd}>
                {saving ? "Submitting…" : `Submit ${selectedType.name} for approval`}
              </button>
              <div style={{ fontSize: 11, color: "#8A96B5", fontWeight: 600, textAlign: "center", marginTop: 10, lineHeight: 1.5 }}>
                You'll only pay after your city admin approves this ad.<br/>
                ₹{selectedType.price} + 18% GST = <b>₹{gstTotal(selectedType.price).toFixed(2)}</b> for 30 days.
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
