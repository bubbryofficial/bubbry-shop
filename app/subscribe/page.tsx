"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
* { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
body { font-family: 'Plus Jakarta Sans', sans-serif; background: #F4F6FB; }
.page { min-height: 100vh; background: #F4F6FB; padding-bottom: 40px; }
.header { background: linear-gradient(135deg, #1A6BFF 0%, #0B47CC 100%); padding: 20px 16px 32px; }
.header-top { display: flex; align-items: center; gap: 12px; padding-bottom: 12px; }
.back-btn { width: 36px; height: 36px; border-radius: 10px; background: rgba(255,255,255,0.18); border: 1.5px solid rgba(255,255,255,0.25); color: white; font-size: 18px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-family: inherit; }
.header-title { font-size: 18px; font-weight: 900; color: white; letter-spacing: -0.5px; }
.hero { padding: 8px 8px 0; text-align: center; }
.hero-emoji { font-size: 40px; margin-bottom: 8px; }
.hero-title { color: white; font-size: 22px; font-weight: 900; letter-spacing: -0.5px; margin-bottom: 4px; }
.hero-sub { color: rgba(255,255,255,0.85); font-size: 13px; font-weight: 500; max-width: 320px; margin: 0 auto; line-height: 1.5; }
.plans { padding: 0 16px; margin-top: -16px; }
.plan-card { background: white; border-radius: 20px; padding: 22px 20px 24px; margin-bottom: 14px; box-shadow: 0 8px 32px rgba(13,27,62,0.08); border: 2.5px solid transparent; transition: all 0.2s; cursor: pointer; }
.plan-card.selected { border-color: #1A6BFF; box-shadow: 0 12px 36px rgba(26,107,255,0.2); }
.plan-card.recommended { position: relative; }
.plan-card.recommended::before { content: "RECOMMENDED"; position: absolute; top: -10px; right: 18px; background: linear-gradient(135deg, #FF6B35, #FF3DA8); color: white; font-size: 9px; font-weight: 800; padding: 4px 10px; border-radius: 20px; letter-spacing: 0.6px; }
.plan-head { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 14px; }
.plan-name { font-size: 18px; font-weight: 900; color: #0D1B3E; letter-spacing: -0.3px; }
.plan-sub { font-size: 12px; color: #8A96B5; font-weight: 600; margin-top: 2px; }
.plan-price { text-align: right; }
.plan-price-amount { font-size: 28px; font-weight: 900; color: #1A6BFF; line-height: 1; letter-spacing: -1px; }
.plan-price-period { font-size: 11px; color: #8A96B5; font-weight: 700; margin-top: 2px; }
.plan-features { padding: 12px 0 0; border-top: 1px solid #F4F6FB; }
.feature { display: flex; gap: 10px; align-items: flex-start; margin-bottom: 8px; font-size: 13px; color: #4A5880; font-weight: 600; line-height: 1.4; }
.feature.disabled { color: #B0BACC; text-decoration: line-through; }
.feature-icon { flex-shrink: 0; font-size: 14px; margin-top: 1px; }
.btn-primary { display: block; width: calc(100% - 32px); margin: 14px 16px 0; padding: 16px; background: linear-gradient(135deg, #1A6BFF, #0B47CC); color: white; border: none; border-radius: 16px; font-size: 15px; font-weight: 800; cursor: pointer; font-family: inherit; box-shadow: 0 6px 24px rgba(26,107,255,0.3); transition: all 0.2s; }
.btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
.btn-primary:not(:disabled):active { transform: scale(0.98); }
.disclaimer { margin: 16px 20px 0; padding: 14px; background: #FFF8E1; border: 1.5px solid #FFE082; border-radius: 14px; font-size: 12px; color: #5C4A18; line-height: 1.6; font-weight: 500; }
.disclaimer b { color: #946200; }
.info-card { margin: 14px 16px 0; padding: 14px 16px; background: white; border-radius: 14px; box-shadow: 0 2px 8px rgba(13,27,62,0.05); display: flex; gap: 12px; align-items: flex-start; }
.info-card-icon { font-size: 22px; flex-shrink: 0; }
.info-card-title { font-size: 13px; font-weight: 800; color: #0D1B3E; margin-bottom: 2px; }
.info-card-text { font-size: 12px; color: #4A5880; font-weight: 500; line-height: 1.5; }
.spin-wrap { min-height: 100vh; display: flex; align-items: center; justify-content: center; flex-direction: column; gap: 12px; }
.spinner { width: 36px; height: 36px; border: 3px solid #E4EAFF; border-top-color: #1A6BFF; border-radius: 50%; animation: spin 0.7s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.active-banner { background: linear-gradient(135deg, #00875A, #00A56C); color: white; margin: 14px 16px 0; padding: 18px 20px; border-radius: 18px; }
.active-banner-title { font-size: 16px; font-weight: 900; margin-bottom: 4px; }
.active-banner-sub { font-size: 12px; opacity: 0.9; font-weight: 500; line-height: 1.5; }
`;

declare global { interface Window { Razorpay: any; } }

export default function SubscribePage() {
  const router = useRouter();
  const calledRef = useRef(false);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<"pickup" | "full">("full");
  const [processing, setProcessing] = useState(false);
  const [shop, setShop] = useState<any>(null);

  useEffect(() => {
    if (calledRef.current) return;
    calledRef.current = true;
    init();
  }, []);

  async function init() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) { router.replace("/login"); return; }
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("id, role, shop_name, name, shopfront_verified, subscription_plan, subscription_status, subscription_next_billing_at")
      .eq("id", session.user.id)
      .single();

    if (error || !profile) { alert("Profile not found"); router.replace("/login"); return; }
    if (profile.role !== "shopkeeper") { router.replace("/customer-dashboard"); return; }
    if (!profile.shopfront_verified) {
      alert("Your shopfront needs to be verified by admin before you can subscribe.");
      router.replace("/shop-dashboard");
      return;
    }

    setShop(profile);
    if (profile.subscription_plan) setSelectedPlan(profile.subscription_plan);
    setLoading(false);

    // Load Razorpay checkout SDK
    if (!document.getElementById("razorpay-sdk")) {
      const s = document.createElement("script");
      s.id = "razorpay-sdk";
      s.src = "https://checkout.razorpay.com/v1/checkout.js";
      document.body.appendChild(s);
    }
  }

  async function startSubscription() {
    if (!shop) return;
    setProcessing(true);

    try {
      // Call edge function to create Razorpay subscription
      const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/create-subscription`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          "Authorization": `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`,
        },
        body: JSON.stringify({ plan: selectedPlan, shop_id: shop.id }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        alert("Could not start subscription: " + (data.error || "unknown"));
        setProcessing(false); return;
      }

      // Open Razorpay checkout to authorize the autopay mandate
      if (!window.Razorpay) {
        // SDK still loading — fall back to redirect
        window.location.href = data.short_url;
        return;
      }

      const rzp = new window.Razorpay({
        key: data.razorpay_key,
        subscription_id: data.subscription_id,
        name: "Bubbry",
        description: selectedPlan === "pickup" ? "Pickup Plan — ₹116.82/month (incl. 18% GST)" : "Full Plan — ₹234.82/month (incl. 18% GST)",
        prefill: {
          name: shop.name || shop.shop_name || "",
          contact: shop.phone || "",
        },
        theme: { color: "#1A6BFF" },
        handler: async function (response: any) {
          // Mandate authorized — webhook will mark subscription active
          // Wait a moment then redirect (webhook is near-instant but not guaranteed)
          alert("✅ Autopay authorized! Your subscription is now active.");
          router.replace("/shop-dashboard");
        },
        modal: {
          ondismiss: () => {
            setProcessing(false);
          },
        },
      });
      rzp.open();

    } catch (e: any) {
      alert("Error: " + e.message);
      setProcessing(false);
    }
  }

  async function upgradeToFull() {
    if (!shop) return;
    setProcessing(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/upgrade-subscription`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          "Authorization": `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`,
        },
        body: JSON.stringify({ shop_id: shop.id }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) { alert("Could not start upgrade: " + (data.error || "unknown")); setProcessing(false); return; }
      if (!window.Razorpay) { alert("Payment is loading, please try again in a moment."); setProcessing(false); return; }

      const rzp = new window.Razorpay({
        key: data.razorpay_key,
        order_id: data.order_id,
        amount: data.amount,
        currency: "INR",
        name: "Bubbry",
        description: "Upgrade to Full — current-month difference ₹118 (₹100 + 18% GST)",
        prefill: { name: shop.name || shop.shop_name || "", contact: shop.phone || "" },
        theme: { color: "#1A6BFF" },
        handler: async function (response: any) {
          const vRes = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/verify-upgrade`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "apikey": process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
              "Authorization": `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`,
            },
            body: JSON.stringify({
              shop_id: shop.id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });
          const vData = await vRes.json();
          if (vRes.ok && vData.success) {
            alert("✅ Upgraded to Full plan! Delivery is now available. From next month you'll be billed ₹234.82.");
            router.replace("/shop-dashboard");
          } else {
            alert("Payment received but upgrade failed: " + (vData.error || "contact support"));
            setProcessing(false);
          }
        },
        modal: { ondismiss: () => setProcessing(false) },
      });
      rzp.open();
    } catch (e: any) {
      alert("Error: " + e.message);
      setProcessing(false);
    }
  }

  if (loading) return (
    <div className="spin-wrap">
      <style>{CSS}</style>
      <div className="spinner" />
      <div style={{ fontSize: 14, color: "#8A96B5", fontWeight: 600 }}>Loading subscription…</div>
    </div>
  );

  const hasActiveSub = shop?.subscription_status === "active";

  return (
    <div className="page">
      <style>{CSS}</style>
      <div className="header">
        <div className="header-top">
          <button suppressHydrationWarning className="back-btn" onClick={() => router.push("/shop-dashboard")}>←</button>
          <div className="header-title">Choose Your Plan</div>
        </div>
        <div className="hero">
          <div className="hero-emoji">🚀</div>
          <div className="hero-title">Activate Your Shop</div>
          <div className="hero-sub">Pick a plan to start receiving orders. Cancel anytime from your dashboard.</div>
        </div>
      </div>

      {hasActiveSub && (
        <div className="active-banner">
          <div className="active-banner-title">✓ Active Subscription</div>
          <div className="active-banner-sub">
            You're on the <b>{shop.subscription_plan === "full" ? "Full" : "Pickup"}</b> plan.
            {shop.subscription_next_billing_at && (
              <> Next charge on {new Date(shop.subscription_next_billing_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}.</>
            )}
          </div>
        </div>
      )}

      {hasActiveSub && shop.subscription_plan === "pickup" && (
        <div style={{ margin: "14px 16px 0", background: "white", border: "2px solid #1A6BFF", borderRadius: 16, padding: 18, boxShadow: "0 6px 20px rgba(26,107,255,0.12)" }}>
          <div style={{ fontSize: 15, fontWeight: 900, color: "#0D1B3E", marginBottom: 4 }}>🛵 Upgrade to Full Plan</div>
          <div style={{ fontSize: 13, color: "#4A5880", fontWeight: 500, lineHeight: 1.5, marginBottom: 12 }}>
            Unlock delivery. Pay only the difference for this month, then ₹234.82/month from next cycle.
          </div>
          <div style={{ background: "#F4F6FB", borderRadius: 10, padding: "10px 12px", fontSize: 13, fontWeight: 600, color: "#0D1B3E", marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}><span>This month's difference</span><span>₹100</span></div>
            <div style={{ display: "flex", justifyContent: "space-between" }}><span>GST (18%)</span><span>₹18</span></div>
            <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 800, color: "#1A6BFF", marginTop: 4 }}><span>Pay now</span><span>₹118</span></div>
          </div>
          <button
            onClick={upgradeToFull}
            disabled={processing}
            style={{ width: "100%", padding: 14, background: "linear-gradient(135deg,#1A6BFF,#0B47CC)", color: "white", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 800, cursor: processing ? "not-allowed" : "pointer", fontFamily: "inherit", opacity: processing ? 0.6 : 1 }}>
            {processing ? "Opening payment…" : "Upgrade — Pay ₹118 difference"}
          </button>
        </div>
      )}

      <div className="plans" style={{ marginTop: hasActiveSub ? 14 : -16 }}>

        {/* Pickup Plan */}
        <div
          className={`plan-card ${selectedPlan === "pickup" ? "selected" : ""}`}
          onClick={() => setSelectedPlan("pickup")}
        >
          <div className="plan-head">
            <div>
              <div className="plan-name">🏪 Pickup Plan</div>
              <div className="plan-sub">For shops that only offer pickup</div>
            </div>
            <div className="plan-price">
              <div className="plan-price-amount">₹116.82</div>
              <div className="plan-price-period">per month incl. GST</div>
            </div>
          </div>
          <div style={{ fontSize: 11, color: "#8A96B5", fontWeight: 600, marginBottom: 10 }}>₹99 + 18% GST (₹17.82)</div>
          <div className="plan-features">
            <div className="feature"><span className="feature-icon">✅</span><span>Customer pickup orders</span></div>
            <div className="feature"><span className="feature-icon">✅</span><span>List unlimited products</span></div>
            <div className="feature"><span className="feature-icon">✅</span><span>Order notifications & dashboard</span></div>
            <div className="feature disabled"><span className="feature-icon">❌</span><span>Home delivery to customers</span></div>
          </div>
        </div>

        {/* Full Plan */}
        <div
          className={`plan-card recommended ${selectedPlan === "full" ? "selected" : ""}`}
          onClick={() => setSelectedPlan("full")}
        >
          <div className="plan-head">
            <div>
              <div className="plan-name">🛵 Full Plan</div>
              <div className="plan-sub">Pickup + Delivery, anytime</div>
            </div>
            <div className="plan-price">
              <div className="plan-price-amount">₹234.82</div>
              <div className="plan-price-period">per month incl. GST</div>
            </div>
          </div>
          <div style={{ fontSize: 11, color: "#8A96B5", fontWeight: 600, marginBottom: 10 }}>₹199 + 18% GST (₹35.82)</div>
          <div className="plan-features">
            <div className="feature"><span className="feature-icon">✅</span><span>Everything in Pickup Plan</span></div>
            <div className="feature"><span className="feature-icon">✅</span><span><b>Home delivery</b> via your riders</span></div>
            <div className="feature"><span className="feature-icon">✅</span><span>Switch pickup & delivery anytime</span></div>
            <div className="feature"><span className="feature-icon">✅</span><span>Priority support</span></div>
          </div>
        </div>
      </div>

      <div className="info-card">
        <span className="info-card-icon">🔄</span>
        <div>
          <div className="info-card-title">Auto-renews every month</div>
          <div className="info-card-text">
            We use Razorpay e-mandate. Your bank charges this amount on the same date each month — no manual action needed.
          </div>
        </div>
      </div>

      <div className="disclaimer">
        <b>How it works:</b> On the next screen you'll authorize a monthly autopay mandate with your bank.
        The first charge runs immediately. After that, the amount is debited automatically every month on the same date.
        You can cancel anytime from your dashboard.
      </div>

      <button
        suppressHydrationWarning
        className="btn-primary"
        onClick={startSubscription}
        disabled={processing || hasActiveSub}
      >
        {hasActiveSub
          ? "✓ Already Subscribed"
          : processing
            ? "Opening payment..."
            : `Subscribe — ₹${selectedPlan === "pickup" ? "116.82" : "234.82"}/month`
        }
      </button>
    </div>
  );
}
