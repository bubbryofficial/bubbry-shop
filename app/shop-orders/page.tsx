"use client";
import { supabase } from "../../lib/supabase";

import { useState, useEffect, useRef } from "react";


const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Plus Jakarta Sans', sans-serif; background: #F4F6FB; }
.page { min-height: 100vh; background: #F4F6FB; font-family: 'Plus Jakarta Sans', sans-serif; padding-bottom: 90px; }
.top-bar { background: #1A6BFF; padding: 16px 20px; position: sticky; top: 0; z-index: 100; box-shadow: 0 4px 20px rgba(26,107,255,0.25); display: flex; align-items: center; gap: 12px; }
.back-btn { width: 36px; height: 36px; background: rgba(255,255,255,0.18); border-radius: 10px; display: flex; align-items: center; justify-content: center; text-decoration: none; font-size: 18px; color: white; flex-shrink: 0; }
.page-title { font-size: 18px; font-weight: 800; color: white; }
.filter-tabs { background: white; display: flex; gap: 8px; padding: 12px 16px; border-bottom: 1.5px solid #E4EAFF; overflow-x: auto; }
.filter-chip { padding: 6px 14px; border-radius: 20px; font-size: 13px; font-weight: 700; border: 1.5px solid #E4EAFF; background: white; color: #8A96B5; cursor: pointer; white-space: nowrap; font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.15s; }
.filter-chip.active { background: #1A6BFF; color: white; border-color: #1A6BFF; }
.content { padding: 14px; max-width: 480px; margin: 0 auto; }
.order-card { background: white; border-radius: 16px; border: 1.5px solid #E4EAFF; margin-bottom: 12px; overflow: hidden; box-shadow: 0 2px 10px rgba(26,107,255,0.06); }
.order-hdr { padding: 12px 16px; border-bottom: 1px solid #F4F6FB; display: flex; align-items: center; justify-content: space-between; }
.order-id { font-size: 12px; color: #8A96B5; font-weight: 700; font-family: monospace; }
.order-time { font-size: 11px; color: #B0BACC; }
.order-body { padding: 14px 16px; }
.order-product { font-size: 16px; font-weight: 800; color: #0D1B3E; margin-bottom: 6px; }
.order-detail { font-size: 13px; color: #4A5880; font-weight: 500; margin-bottom: 3px; display: flex; align-items: center; gap: 6px; }
.order-price { font-size: 15px; font-weight: 900; color: #1A6BFF; margin: 8px 0 12px; }
.addr-box { background: #F4F6FB; border-radius: 10px; padding: 10px 12px; font-size: 13px; color: #4A5880; font-weight: 500; margin-bottom: 12px; }
.type-badge { display: inline-flex; align-items: center; gap: 4px; padding: 3px 10px; border-radius: 20px; font-size: 12px; font-weight: 700; }
.type-pickup { background: #EBF1FF; color: #1A6BFF; }
.type-delivery { background: #FFF8E6; color: #946200; }
.status-pill { display: inline-flex; align-items: center; gap: 4px; padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 700; }
.s-pending { background: #FFF8E6; color: #946200; }
.s-ready { background: #E6FAF4; color: #00875A; }
.s-completed { background: #F0F2F8; color: #4A5880; }
.action-row { display: flex; gap: 8px; }
.action-btn { flex: 1; padding: 11px; border: none; border-radius: 12px; font-size: 13px; font-weight: 800; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.2s; }
.btn-ready { background: #1A6BFF; color: white; }
.btn-ready:hover { background: #1255CC; }
.btn-done { background: #E6FAF4; color: #00875A; border: 1.5px solid #B8E8D4; }
.btn-track { flex: 1; padding: 11px; border: none; border-radius: 12px; font-size: 13px; font-weight: 800; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; background: #EBF1FF; color: #1A6BFF; text-decoration: none; display: flex; align-items: center; justify-content: center; gap: 4px; }
.call-btn { display: flex; align-items: center; gap: 6px; padding: 10px 14px; border-radius: 10px; font-size: 13px; font-weight: 800; cursor: pointer; font-family: inherit; text-decoration: none; border: none; flex-shrink: 0; }
.call-customer { background: #E6FAF4; color: #00875A; border: 1.5px solid #B8E8D4; }
.call-rider { background: #EBF1FF; color: #1A6BFF; border: 1.5px solid #C5D5FF; }
.call-row { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 10px; padding-top: 10px; border-top: 1px solid #F4F6FB; }
.btn-done:hover { background: #C3F0DC; }
.btn-disabled { background: #F4F6FB; color: #B0BACC; cursor: default; }
.handoff-thumb { width: 100%; height: 90px; object-fit: cover; border-radius: 10px; margin-bottom: 10px; border: 1.5px solid #E4EAFF; display: block; }
.payment-proof-box { background: #F4F6FB; border: 1.5px solid #E4EAFF; border-radius: 12px; overflow: hidden; margin-bottom: 12px; }
.payment-proof-header { display: flex; align-items: center; justify-content: space-between; padding: 10px 12px; }
.payment-proof-title { font-size: 12px; font-weight: 800; color: #0D1B3E; display: flex; align-items: center; gap: 5px; }
.payment-method-chip { font-size: 10px; font-weight: 800; padding: 3px 8px; border-radius: 6px; }
.chip-upi { background: #EBF1FF; color: #1A6BFF; }
.chip-cod { background: #FFF8E6; color: #946200; }
.payment-amounts { display: flex; gap: 12px; padding: 0 12px 10px; }
.payment-amount-item { flex: 1; background: white; border-radius: 8px; padding: 8px 10px; border: 1px solid #E4EAFF; }
.payment-amount-label { font-size: 10px; color: #8A96B5; font-weight: 700; text-transform: uppercase; letter-spacing: 0.4px; }
.payment-amount-val { font-size: 14px; font-weight: 900; color: #0D1B3E; margin-top: 2px; }
.payment-amount-val.green { color: #00875A; }
.payment-amount-val.orange { color: #946200; }
.proof-img-wrap { position: relative; cursor: pointer; }
.proof-img { width: 100%; height: 160px; object-fit: cover; display: block; }
.proof-img-expand { position: absolute; bottom: 8px; right: 8px; background: rgba(0,0,0,0.6); color: white; font-size: 11px; font-weight: 700; padding: 4px 8px; border-radius: 6px; }
.proof-missing { padding: 12px; font-size: 12px; color: #E53E3E; font-weight: 700; text-align: center; background: #FFF0F0; }
.verify-pending { display: flex; align-items: center; gap: 6px; padding: 8px 12px; background: #FFF8E6; border-top: 1px solid #FFB800; font-size: 12px; font-weight: 700; color: #946200; }
.verify-done { display: flex; align-items: center; gap: 6px; padding: 8px 12px; background: #E6FAF4; border-top: 1px solid #B8E8D4; font-size: 12px; font-weight: 700; color: #00875A; }
/* Lightbox */
.lightbox { position: fixed; inset: 0; background: rgba(0,0,0,0.92); z-index: 700; display: flex; align-items: center; justify-content: center; flex-direction: column; }
.lightbox img { max-width: 100%; max-height: 85vh; border-radius: 12px; }
.lightbox-close { position: absolute; top: 16px; right: 16px; background: rgba(255,255,255,0.2); border: none; color: white; font-size: 22px; width: 44px; height: 44px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; }
.cancel-reason-btn { width: 100%; padding: 13px 16px; border: 2px solid #E4EAFF; border-radius: 12px; background: white; font-size: 13px; font-weight: 700; color: #0D1B3E; cursor: pointer; font-family: inherit; text-align: left; display: flex; align-items: center; gap: 10px; margin-bottom: 8px; transition: all 0.15s; }
.cancel-reason-btn:hover { border-color: #1A6BFF; background: #EBF1FF; }
.cancel-reason-btn.selected { border-color: #E53E3E; background: #FFF0F0; color: #E53E3E; }
.cancel-reason-btn.selected-fraud { border-color: #E53E3E; background: #FFF0F0; }
.fraud-warning { background: #FFF0F0; border: 2px solid #FFCDD2; border-radius: 12px; padding: 14px; margin-bottom: 14px; }
.fraud-warning-title { font-size: 15px; font-weight: 900; color: #E53E3E; margin-bottom: 6px; }
.fraud-warning-text { font-size: 12px; color: #4A5880; font-weight: 500; line-height: 1.6; }
.btn-cancel-order { width: 100%; padding: 14px; background: #E53E3E; color: white; border: none; border-radius: 12px; font-size: 15px; font-weight: 800; cursor: pointer; font-family: inherit; margin-top: 4px; }
.btn-cancel-order:disabled { opacity: 0.45; cursor: not-allowed; }

/* Modal overlay */
.modal-overlay { position: fixed; inset: 0; background: rgba(13,27,62,0.6); z-index: 400; display: flex; align-items: flex-end; justify-content: center; backdrop-filter: blur(4px); }
.modal-sheet { background: white; border-radius: 24px 24px 0 0; width: 100%; max-width: 480px; padding: 28px 24px 48px; animation: slideUp 0.3s ease; }
@keyframes slideUp { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
.modal-handle { width: 40px; height: 4px; background: #E4EAFF; border-radius: 2px; margin: 0 auto 20px; }
.modal-title { font-size: 18px; font-weight: 900; color: #0D1B3E; margin-bottom: 4px; }
.modal-sub { font-size: 13px; color: #8A96B5; font-weight: 500; margin-bottom: 20px; }
.photo-step { margin-bottom: 16px; }
.photo-step-label { font-size: 12px; font-weight: 800; color: #8A96B5; text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 8px; display: flex; align-items: center; gap: 6px; }
.photo-step-label.required::after { content: '* Required'; background: #FFF8E6; color: #946200; font-size: 10px; font-weight: 700; padding: 2px 7px; border-radius: 5px; letter-spacing: 0; }
.camera-box { border: 2px dashed #E4EAFF; border-radius: 14px; padding: 24px 16px; text-align: center; cursor: pointer; transition: all 0.2s; background: #F4F6FB; position: relative; }
.camera-box:hover { border-color: #1A6BFF; background: #EBF1FF; }
.camera-box.captured { border: 2px solid #00B37E; background: #E6FAF4; padding: 0; overflow: hidden; }
.capture-preview { width: 100%; height: 180px; object-fit: cover; display: block; border-radius: 12px; }
.live-badge { position: absolute; top: 8px; left: 8px; background: #E53E3E; color: white; font-size: 10px; font-weight: 800; padding: 3px 8px; border-radius: 6px; display: flex; align-items: center; gap: 4px; }
.live-badge::before { content: ''; width: 6px; height: 6px; border-radius: 50%; background: white; animation: livepulse 1s infinite; }
@keyframes livepulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
.retake-bar { display: flex; gap: 6px; padding: 8px; background: #F4F6FB; border-top: 1px solid #E4EAFF; }
.retake-btn { flex: 1; padding: 9px; background: white; border: 1.5px solid #E4EAFF; border-radius: 10px; font-size: 12px; font-weight: 700; color: #4A5880; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; }
.camera-icon-big { font-size: 36px; margin-bottom: 8px; }
.camera-cta { font-size: 14px; font-weight: 800; color: #0D1B3E; margin-bottom: 4px; }
.camera-sub { font-size: 11px; color: #B0BACC; font-weight: 500; }
.camera-no-gallery { font-size: 10px; color: #E53E3E; font-weight: 700; margin-top: 6px; }
.damage-check { background: #F4F6FB; border: 1.5px solid #E4EAFF; border-radius: 12px; padding: 14px; margin-bottom: 14px; }
.damage-check-title { font-size: 13px; font-weight: 800; color: #0D1B3E; margin-bottom: 10px; }
.damage-row { display: flex; align-items: center; gap: 10px; cursor: pointer; margin-bottom: 8px; }
.damage-row:last-child { margin-bottom: 0; }
.damage-checkbox { width: 20px; height: 20px; border-radius: 6px; border: 2px solid #E4EAFF; background: white; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: all 0.2s; }
.damage-checkbox.checked { background: #00B37E; border-color: #00B37E; }
.damage-label { font-size: 13px; font-weight: 600; color: #4A5880; line-height: 1.4; }
.modal-confirm-btn { width: 100%; padding: 15px; background: #00B37E; color: white; border: none; border-radius: 14px; font-size: 16px; font-weight: 800; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.2s; margin-bottom: 10px; }
.modal-confirm-btn:hover:not(:disabled) { background: #009068; transform: translateY(-1px); }
.modal-confirm-btn:disabled { opacity: 0.45; cursor: not-allowed; transform: none; }
.progress-steps { display: flex; align-items: center; gap: 0; margin-bottom: 16px; }
.progress-step { flex: 1; text-align: center; font-size: 11px; font-weight: 700; color: #B0BACC; padding-bottom: 8px; border-bottom: 3px solid #E4EAFF; transition: all 0.2s; }
.progress-step.done { color: #00B37E; border-color: #00B37E; }
.progress-step.active { color: #1A6BFF; border-color: #1A6BFF; }
.camera-overlay { position: fixed; inset: 0; background: black; z-index: 9999; }
.camera-video { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; display: block; }
.camera-label { position: absolute; top: 0; left: 0; right: 0; z-index: 10; color: white; font-size: 13px; font-weight: 700; text-align: center; padding: 14px 16px; padding-top: max(14px, env(safe-area-inset-top)); background: linear-gradient(to bottom, rgba(0,0,0,0.75), transparent); }
.camera-controls { position: absolute; bottom: 0; left: 0; right: 0; z-index: 10; background: linear-gradient(to top, rgba(0,0,0,0.85), transparent); padding: 32px 40px; padding-bottom: max(32px, env(safe-area-inset-bottom)); display: flex; align-items: center; justify-content: space-between; gap: 16px; }
.camera-shutter { width: 80px; height: 80px; border-radius: 50%; background: white; border: 5px solid rgba(255,255,255,0.4); cursor: pointer; flex-shrink: 0; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 0 3px rgba(255,255,255,0.2); transition: transform 0.1s; }
.camera-shutter:active { transform: scale(0.92); }
.camera-shutter-inner { width: 60px; height: 60px; border-radius: 50%; background: white; border: 2px solid #E4EAFF; }
.camera-flip { width: 54px; height: 54px; border-radius: 50%; background: rgba(255,255,255,0.18); border: 1.5px solid rgba(255,255,255,0.3); color: white; font-size: 22px; cursor: pointer; display: flex; align-items: center; justify-content: center; }
.camera-cancel { width: 54px; height: 54px; border-radius: 50%; background: rgba(220,50,50,0.55); border: none; color: white; font-size: 20px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; }
.cam-vid-fill { flex: 1; width: 100%; object-fit: cover; display: block; }
.cam-ctrl-bar { flex-shrink: 0; background: rgba(0,0,0,0.88); padding: 24px 32px; padding-bottom: max(24px, env(safe-area-inset-bottom)); display: flex; align-items: center; justify-content: space-between; gap: 16px; }
.shutter-big { width: 80px; height: 80px; border-radius: 50%; background: white; border: 5px solid rgba(255,255,255,0.4); cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 0 3px rgba(255,255,255,0.2); }
.shutter-big:active { transform: scale(0.93); }
.cam-side-btn { width: 54px; height: 54px; border-radius: 50%; background: rgba(255,255,255,0.18); border: none; color: white; font-size: 22px; cursor: pointer; display: flex; align-items: center; justify-content: center; }
.rider-option { display: flex; align-items: center; gap: 12px; padding: 14px 0; border-bottom: 1px solid #F4F6FB; cursor: pointer; transition: all 0.15s; }
.rider-option:last-child { border-bottom: none; }
.rider-option.selected { background: #EBF1FF; margin: 0 -20px; padding: 14px 20px; border-radius: 12px; }
.rider-avatar { width: 44px; height: 44px; background: linear-gradient(135deg, #1A6BFF, #4D8FFF); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 20px; flex-shrink: 0; }
.rider-name { font-size: 15px; font-weight: 800; color: #0D1B3E; }
.rider-phone { font-size: 12px; color: #8A96B5; font-weight: 500; margin-top: 2px; }
.rider-check { width: 22px; height: 22px; border-radius: 50%; border: 2px solid #E4EAFF; background: white; margin-left: auto; flex-shrink: 0; display: flex; align-items: center; justify-content: center; }
.rider-check.on { background: #1A6BFF; border-color: #1A6BFF; }
.empty-state { text-align: center; padding: 80px 24px; }
.empty-icon { font-size: 56px; margin-bottom: 12px; }
.empty-title { font-size: 18px; font-weight: 800; color: #0D1B3E; margin-bottom: 6px; }
.empty-sub { font-size: 14px; color: #8A96B5; }
.bottom-nav { position: fixed; bottom: 0; left: 0; right: 0; height: 70px; background: white; border-top: 1.5px solid #E4EAFF; display: flex; align-items: center; box-shadow: 0 -4px 20px rgba(26,107,255,0.07); z-index: 100; }
.nav-item { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 3px; padding: 8px 0; text-decoration: none; color: #B0BACC; font-size: 10px; font-weight: 700; transition: color 0.15s; }
.nav-item.active { color: #1A6BFF; }
.nav-icon { font-size: 22px; line-height: 1; }
`;

const FILTERS = ["all", "pending", "ready", "out_for_delivery", "completed"];

function PickupOtpVerify({ order, onVerified }: { order: any; onVerified: () => void }) {
  const [otp, setOtp] = useState("");
  const [err, setErr] = useState("");
  function verify() {
    if (otp.trim() === order.delivery_otp) {
      setErr("");
      onVerified();
    } else {
      setErr("❌ Wrong OTP. Ask customer to check their My Orders.");
    }
  }
  return (
    <div style={{marginBottom:8}}>
      <div style={{fontSize:11,fontWeight:700,color:"#8A96B5",marginBottom:6,textTransform:"uppercase",letterSpacing:"0.5px"}}>Enter Customer Pickup OTP</div>
      <div style={{display:"flex",gap:8}}>
        <input type="number" placeholder="6-digit OTP"
          value={otp} onChange={e => { setOtp(e.target.value.slice(0,6)); setErr(""); }}
          style={{flex:1,padding:"10px 12px",border:`2px solid ${err?"#E53E3E":otp.length===6?"#00B37E":"#E4EAFF"}`,borderRadius:10,fontSize:18,fontWeight:900,letterSpacing:4,fontFamily:"monospace",outline:"none",textAlign:"center"}} />
        <button onClick={verify} disabled={otp.length < 6}
          style={{padding:"10px 16px",background:otp.length===6?"#00B37E":"#E4EAFF",color:otp.length===6?"white":"#B0BACC",border:"none",borderRadius:10,fontSize:13,fontWeight:800,cursor:otp.length===6?"pointer":"not-allowed",fontFamily:"inherit",flexShrink:0}}>
          ✓ Verify
        </button>
      </div>
      {err && <div style={{fontSize:12,fontWeight:700,color:"#E53E3E",marginTop:4}}>{err}</div>}
    </div>
  );
}

export default function ShopOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const shopUserIdRef = useRef<string>(""); // current shop user id for timers
  const notifSentRef = useRef<Set<string>>(new Set()); // tracks orders we already notified this minute
  const autoCancelTimersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map()); // per-order auto-cancel timers

  // Handoff photo modal state
  const [completingOrder, setCompletingOrder] = useState<any>(null);
  const [productFile, setProductFile] = useState<File | null>(null);
  const [productPreview, setProductPreview] = useState("");
  const [customerFile, setCustomerFile] = useState<File | null>(null);
  const [customerPreview, setCustomerPreview] = useState("");
  const [completing, setCompleting] = useState(false);
  const [damageChecks, setDamageChecks] = useState({ undamaged: false, correct: false, customer_present: false });
  const [modalStep, setModalStep] = useState<"photos"|"checklist">("photos");
  const [lightboxImg, setLightboxImg] = useState<string|null>(null);
  const [cancelOrder, setCancelOrder] = useState<any>(null);
  const [cancelReason, setCancelReason] = useState<"unavailable"|"fraud"|"other"|null>(null);
  const [cancelNote, setCancelNote] = useState("");
  const [cancelProof, setCancelProof] = useState<File|null>(null);
  const [cancelProofPreview, setCancelProofPreview] = useState("");
  const [submittingCancel, setSubmittingCancel] = useState(false);
  const [riders, setRiders] = useState<any[]>([]);
  const [riderSelectOrder, setRiderSelectOrder] = useState<any>(null);
  const [selectedRider, setSelectedRider] = useState("");
  const productInputRef = useRef<HTMLInputElement>(null);
  const customerInputRef = useRef<HTMLInputElement>(null);
  // Live camera state
  const [cameraOpen, setCameraOpen] = useState<"product"|"customer"|null>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream|null>(null);
  const [camFacing, setCamFacing] = useState<"environment"|"user">("environment");
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Get session so timer functions have the shop user id
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) shopUserIdRef.current = session.user.id;
    });
    fetchOrders();
    loadRiders();
    // Realtime — any order change triggers immediate refresh
    const channel = supabase.channel("shop-orders-rt")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, () => {
        fetchOrders();
      })
      .subscribe();
    // Poll every 5s — near real-time for busy shops
    const poll = setInterval(() => fetchOrders(), 3000);
    // Every 60s: send reminder notification for any pending order older than 1 min,
    // and auto-cancel any pending order older than 15 min
    const timerCheck = setInterval(() => checkPendingOrderTimers(), 60000);
    return () => {
      supabase.removeChannel(channel);
      clearInterval(poll);
      clearInterval(timerCheck);
      // Clear any per-order timeouts
      autoCancelTimersRef.current.forEach(t => clearTimeout(t));
    };
  }, []);

  async function loadRiders() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return;
    const { data } = await supabase.from("riders").select("id, name, phone").eq("shop_id", session.user.id).eq("active", true);
    setRiders(data || []);
  }

  // Checks all pending orders every 60s:
  // — sends a reminder notification if order is still pending
  // — auto-cancels if order has been pending for 15+ minutes
  async function checkPendingOrderTimers() {
    const shopId = shopUserIdRef.current;
    if (!shopId) return;
    const now = Date.now();
    const FIFTEEN_MIN = 15 * 60 * 1000;
    const ONE_MIN = 60 * 1000;

    // ── PENDING ORDERS: must be accepted within 15 min ──────────────────
    const { data: pendingOrders } = await supabase
      .from("orders")
      .select("id, group_id, created_at, shop_id")
      .eq("shop_id", shopId)
      .eq("status", "pending");

    const seenGroups = new Set<string>();
    for (const order of (pendingOrders || [])) {
      const key = order.group_id || order.id;
      if (seenGroups.has(key)) continue;
      seenGroups.add(key);
      const age = now - new Date(order.created_at).getTime();

      if (age >= FIFTEEN_MIN) {
        let ids = [order.id];
        if (order.group_id) {
          const { data: gr } = await supabase.from("orders").select("id").eq("group_id", order.group_id);
          ids = (gr || []).map((r: any) => r.id);
        }
        for (const id of ids) {
          await supabase.from("orders").update({
            status: "cancelled",
            cancelled_by: "system",
            cancellation_reason: "shop_timeout",
            cancellation_note: "Shop did not accept the order within 15 minutes.",
            cancelled_at: new Date().toISOString(),
          }).eq("id", id);
        }
        await sendNotification(shopId,
          "⏰ Order Auto-Cancelled",
          "An order was automatically cancelled because you didn't mark it ready within 15 minutes.",
          "auto_cancel", "/shop-orders"
        );
        notifSentRef.current.delete(key);
      } else if (age >= ONE_MIN && !notifSentRef.current.has(key)) {
        const minsOld = Math.floor(age / ONE_MIN);
        const minsLeft = 15 - minsOld;
        await sendNotification(shopId,
          "🔔 New Order Waiting — Mark Ready",
          `You have a new order waiting ${minsOld} min. Mark it ready or cancel — it auto-cancels in ${minsLeft} min.`,
          "order_reminder", "/shop-orders"
        );
        notifSentRef.current.add(key);
        setTimeout(() => notifSentRef.current.delete(key), 61000);
      }
    }

    // ── READY ORDERS: must be dispatched within 15 min ──────────────────
    // Use a separate key prefix so ready timers don't clash with pending ones
    const { data: readyOrders } = await supabase
      .from("orders")
      .select("id, group_id, updated_at, shop_id, order_type")
      .eq("shop_id", shopId)
      .eq("status", "ready");

    const seenReadyGroups = new Set<string>();
    for (const order of (readyOrders || [])) {
      if (order.order_type !== "delivery") continue; // pickup orders don't need dispatch
      const key = "ready_" + (order.group_id || order.id);
      if (seenReadyGroups.has(key)) continue;
      seenReadyGroups.add(key);

      // Use updated_at as the time order was marked ready
      const readySince = now - new Date(order.updated_at || order.group_id || now).getTime();
      const age = readySince > 0 ? readySince : 0;

      if (age >= FIFTEEN_MIN) {
        // Auto-cancel if not dispatched in 15 min
        let ids = [order.id];
        if (order.group_id) {
          const { data: gr } = await supabase.from("orders").select("id").eq("group_id", order.group_id);
          ids = (gr || []).map((r: any) => r.id);
        }
        for (const id of ids) {
          await supabase.from("orders").update({
            status: "cancelled",
            cancelled_by: "system",
            cancellation_reason: "dispatch_timeout",
            cancellation_note: "Order was not dispatched within 15 minutes of being marked ready.",
            cancelled_at: new Date().toISOString(),
          }).eq("id", id);
        }
        await sendNotification(shopId,
          "⏰ Order Auto-Cancelled — Not Dispatched",
          "An order was cancelled because it wasn't dispatched within 15 minutes of being marked ready. Assign a rider and dispatch promptly.",
          "auto_cancel", "/shop-orders"
        );
        notifSentRef.current.delete(key);
      } else if (age >= ONE_MIN && !notifSentRef.current.has(key)) {
        const minsOld = Math.floor(age / ONE_MIN);
        const minsLeft = 15 - minsOld;
        await sendNotification(shopId,
          "🛵 Order Ready — Dispatch Now",
          `Order marked ready ${minsOld} min ago. Assign a rider and dispatch — it auto-cancels in ${minsLeft} min if not dispatched.`,
          "dispatch_reminder", "/shop-orders"
        );
        notifSentRef.current.add(key);
        setTimeout(() => notifSentRef.current.delete(key), 61000);
      }
    }
  }

  async function fetchOrders() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user;
      if (!user) { setLoading(false); return; }

      const { data: ordersData, error } = await supabase
        .from("orders")
        .select("id, group_id, quantity, customer_id, order_type, delivery_address, status, created_at, product_id, shop_id, handoff_photo, product_photo, payment_proof, payment_method, amount_paid, amount_cash, delivery_otp, cancellation_reason, cancelled_by, refund_upi, refund_screenshot, cancellation_proof, customer_id, rider_id")
        .eq("shop_id", user.id)
        .order("created_at", { ascending: false });

      if (error) { console.error("Orders fetch error:", error.message); setLoading(false); return; }
      if (!ordersData || ordersData.length === 0) { setOrders([]); setLoading(false); return; }

      const productIds = [...new Set(ordersData.map((o: any) => o.product_id).filter(Boolean))];
      const { data: spData } = productIds.length > 0
        ? await supabase.from("shop_products").select("product_id, shop_id, name, price").in("product_id", productIds)
        : { data: [] };

      const spMap: any = {};
      (spData || []).forEach((sp: any) => { spMap[sp.product_id + "_" + sp.shop_id] = sp; });

      const STATUS_ORDER = ["pending", "ready", "out_for_delivery", "completed"];

      // Group orders by group_id — old orders without group_id each get their own group
      const groupMap: Record<string, any> = {};
      for (const order of ordersData) {
        const key = order.group_id || order.id;
        const sp = spMap[order.product_id + "_" + order.shop_id] || {};

        if (!groupMap[key]) {
          groupMap[key] = {
            group_id: key,
            id: order.id,  // use first order id for actions
            shop_id: order.shop_id,
            order_type: order.order_type,
            delivery_address: order.delivery_address,
            status: order.status || "pending",
            created_at: order.created_at,
            handoff_photo: order.handoff_photo,
            product_photo: order.product_photo,
            delivery_otp: order.delivery_otp,
            cancellation_reason: order.cancellation_reason || null,
            cancelled_by: order.cancelled_by || null,
            refund_upi: order.refund_upi || null,
            refund_screenshot: order.refund_screenshot || null,
            customer_id: order.customer_id || null,
            rider_id: order.rider_id || null,
            customer_id: order.customer_id || null,
            payment_proof: order.payment_proof,
            payment_method: order.payment_method,
            amount_paid: order.amount_paid || 0,
            amount_cash: order.amount_cash || 0,
            items: [],
            total: 0,
            all_ids: [], // all order ids in group for bulk status updates
          };
        }

        groupMap[key].items.push({
          id: order.id,
          product_name: sp.name || "Product",
          quantity: order.quantity || 1,
          price: sp.price || 0,
          product_id: order.product_id,
        });
        groupMap[key].total += (sp.price || 0) * (order.quantity || 1);
        groupMap[key].all_ids.push(order.id);

        // Payment proof — use whichever row has it
        if (order.payment_proof && !groupMap[key].payment_proof) {
          groupMap[key].payment_proof = order.payment_proof;
          groupMap[key].payment_method = order.payment_method;
          groupMap[key].amount_paid = order.amount_paid || 0;
          groupMap[key].amount_cash = order.amount_cash || 0;
        }

        // Use highest-progress status
        const curIdx = STATUS_ORDER.indexOf(groupMap[key].status);
        const newIdx = STATUS_ORDER.indexOf(order.status);
        if (newIdx > curIdx) groupMap[key].status = order.status;
      }

      // Fetch rider_id and delivery_otp separately (columns may not exist yet)
      let riderIdMap: Record<string, string> = {};
      let otpMap: Record<string, string> = {};
      try {
        const orderIds = Object.values(groupMap).map((g:any) => g.id);
        const { data: extraData } = await supabase
          .from("orders")
          .select("id, rider_id, delivery_otp")
          .in("id", orderIds);
        (extraData || []).forEach((row: any) => {
          if (row.rider_id) riderIdMap[row.id] = row.rider_id;
          if (row.delivery_otp) otpMap[row.id] = row.delivery_otp;
        });
        // Apply to groupMap
        Object.values(groupMap).forEach((g: any) => {
          if (riderIdMap[g.id]) g.rider_id = riderIdMap[g.id];
          if (otpMap[g.id]) g.delivery_otp = otpMap[g.id];
        });
      } catch (e) { /* columns may not exist yet */ }

      // Fetch customer phones
      const customerIds = [...new Set(Object.values(groupMap).map((g:any) => g.customer_id).filter(Boolean))];
      const { data: custPhones } = customerIds.length > 0
        ? await supabase.from("profiles").select("id, phone, name").in("id", customerIds)
        : { data: [] };
      const custPhoneMap: any = {};
      (custPhones || []).forEach((p: any) => { custPhoneMap[p.id] = { phone: p.phone, name: p.name }; });

      // Fetch rider phones
      const riderIds = [...new Set(Object.values(groupMap).map((g:any) => g.rider_id).filter(Boolean))];
      const { data: riderData } = riderIds.length > 0
        ? await supabase.from("riders").select("id, name, phone").in("id", riderIds)
        : { data: [] };
      const riderMap: any = {};
      (riderData || []).forEach((r: any) => { riderMap[r.id] = { name: r.name, phone: r.phone || null }; });

      const grouped = Object.values(groupMap).map((g: any) => ({
        ...g,
        rider_name: g.rider_id ? riderMap[g.rider_id]?.name || null : null,
        rider_phone: g.rider_id ? riderMap[g.rider_id]?.phone || null : null,
        customer_phone: g.customer_id ? custPhoneMap[g.customer_id]?.phone || null : null,
        customer_name: g.customer_id ? custPhoneMap[g.customer_id]?.name || null : null,
      })).sort((a: any, b: any) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      setOrders(grouped);
    } catch (err) {
      console.error("fetchOrders error:", err);
    }
    setLoading(false);
  }

  async function sendNotification(userId: string, title: string, body: string, type: string, link?: string) {
    try {
      await supabase.from("notifications").insert({
        user_id: userId, title, body, type,
        link: link || null, read: false,
        created_at: new Date().toISOString(),
      });
    } catch(e) { console.error("notif error:", e); }
  }

  async function markReady(group: any) {
    const pickupOtp = group.order_type !== "delivery"
      ? Math.floor(100000 + Math.random() * 900000).toString()
      : null;
    for (const id of (group.all_ids || [group.id])) {
      await supabase.from("orders").update({
        status: "ready",
        ...(pickupOtp ? { delivery_otp: pickupOtp } : {}),
      }).eq("id", id);
    }
    // Deduct stock when order is marked ready (not on delivery)
    for (const item of (group.items || [])) {
      const { data: sp } = await supabase.from("shop_products")
        .select("id, stock")
        .eq("product_id", item.product_id || item.id)
        .eq("shop_id", group.shop_id || group.items?.[0]?.shop_id)
        .single();
      if (sp) {
        const newStock = Math.max(0, (sp.stock ?? 0) - (item.quantity ?? 1));
        await supabase.from("shop_products").update({ stock: newStock }).eq("id", sp.id);
      }
    }
    fetchOrders();
    if (pickupOtp) {
      alert(`Order is ready!\n\nPickup OTP: ${pickupOtp}\n\nCustomer must show this OTP when collecting their order.`);
    }
  }

  async function markOutForDelivery(group: any) {
    if (riders.length === 0) {
      alert("⚠️ You must add at least one rider before dispatching a delivery order.\n\nGo to the Riders tab to add a rider first.");
      return;
    }
    // Show rider selector — rider is mandatory
    setRiderSelectOrder(group);
    setSelectedRider("");
  }

  async function confirmOutForDelivery() {
    if (!riderSelectOrder) return;
    if (!selectedRider) {
      alert("⚠️ You must assign a rider before dispatching the order.");
      return;
    }
    const group = riderSelectOrder;
    // Generate 6-digit delivery OTP
    const deliveryOtp = Math.floor(100000 + Math.random() * 900000).toString();
    for (const id of (group.all_ids || [group.id])) {
      await supabase.from("orders").update({
        status: "out_for_delivery",
        rider_id: selectedRider || null,
        delivery_otp: deliveryOtp,
        delivery_otp_verified: false,
      }).eq("id", id);
    }
    // Notify rider via realtime if selected
    if (selectedRider) {
      // Send broadcast — rider's postgres_changes will catch it even if broadcast is missed
      try {
        const ch = supabase.channel(`rider-assign-${selectedRider}`);
        ch.subscribe((status: string) => {
          if (status === "SUBSCRIBED") {
            setTimeout(() => {
              ch.send({ type: "broadcast", event: "assigned", payload: {
                order: { ...group, id: group.id, status: "out_for_delivery", rider_id: selectedRider, delivery_otp: deliveryOtp }
              }});
            }, 500);
          }
        });
      } catch(e) { console.error("broadcast error:", e); }
    }
    setRiderSelectOrder(null);
    setSelectedRider("");
    fetchOrders();
    // OTP is shown only to the customer in their My Orders page — not revealed to shopkeeper
  }

  // Opens the handoff photo modal
  async function openCamera(type: "product"|"customer") {
    const facing = "environment";
    setCamFacing(facing);
    setCameraOpen(type);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: facing }, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false
      });
      setCameraStream(stream);
      // Retry attaching stream until video element is mounted
      let attempts = 0;
      const attach = () => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        } else if (attempts < 20) {
          attempts++;
          setTimeout(attach, 80);
        }
      };
      setTimeout(attach, 80);
    } catch(err: any) {
      const msg = err?.name === "NotAllowedError"
        ? "Camera permission denied. Please allow camera access in your browser settings and try again."
        : err?.name === "NotFoundError"
        ? "No camera found on this device."
        : "Could not access camera. Please allow camera permission and try again.";
      alert(msg);
      setCameraOpen(null);
    }
  }

  function stopCamera() {
    if (cameraStream) {
      cameraStream.getTracks().forEach(t => t.stop());
      setCameraStream(null);
    }
    setCameraOpen(null);
  }

  async function flipCamera() {
    const newFacing = camFacing === "environment" ? "user" : "environment";
    setCamFacing(newFacing);
    if (cameraStream) cameraStream.getTracks().forEach(t => t.stop());
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: newFacing } }, audio: false
      });
      setCameraStream(stream);
      let attempts = 0;
      const attach = () => {
        if (videoRef.current) { videoRef.current.srcObject = stream; videoRef.current.play().catch(()=>{}); }
        else if (attempts++ < 10) setTimeout(attach, 80);
      };
      setTimeout(attach, 80);
    } catch(err) { alert("Could not flip camera."); }
  }

  function capturePhoto() {
    if (!videoRef.current || !canvasRef.current || !cameraOpen) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      if (!blob) return;
      const file = new File([blob], `photo_${Date.now()}.jpg`, { type: "image/jpeg" });
      const url = URL.createObjectURL(blob);
      if (cameraOpen === "product") { setProductFile(file); setProductPreview(url); }
      else { setCustomerFile(file); setCustomerPreview(url); }
      stopCamera();
    }, "image/jpeg", 0.92);
  }

  async function submitCancellation() {
    if (!cancelOrder || !cancelReason) return;
    setSubmittingCancel(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;
      const shopId = session.user.id;

      // Upload shopkeeper's proof screenshot
      let proofUrl = null;
      if (cancelProof) {
        const path = `cancellations/${cancelOrder.id}_${Date.now()}.jpg`;
        const { error: upErr } = await supabase.storage.from("product-images")
          .upload(path, cancelProof, { upsert: true, contentType: cancelProof.type });
        if (!upErr) {
          const { data: urlData } = supabase.storage.from("product-images").getPublicUrl(path);
          proofUrl = urlData.publicUrl;
        }
      }

      // Cancel all orders in the group
      for (const id of (cancelOrder.all_ids || [cancelOrder.id])) {
        await supabase.from("orders").update({
          status: "cancelled",
          cancellation_reason: cancelReason,
          cancellation_note: cancelNote,
          cancellation_proof: proofUrl,
          cancelled_by: "shop",
          cancelled_at: new Date().toISOString(),
        }).eq("id", id);
      }

      // ── FRAUD REPORT ───────────────────────────────────────────
      if (cancelReason === "fraud") {
        // Fetch shop's own contact details to store in dispute
        const { data: shopProfile } = await supabase
          .from("profiles")
          .select("shop_name, name, phone")
          .eq("id", shopId)
          .single();

        // Temporarily ban customer account until admin resolves the dispute
        if (cancelOrder.customer_id) {
          await supabase.from("profiles").update({
            temp_banned: true,
            temp_ban_reason: "fraud_dispute_pending",
            temp_banned_at: new Date().toISOString(),
          }).eq("id", cancelOrder.customer_id);

          // Notify customer their account is temporarily restricted
          await supabase.from("notifications").insert({
            user_id: cancelOrder.customer_id,
            title: "⚠️ Account Temporarily Restricted",
            body: "Your account has been temporarily restricted while we review a payment dispute filed against you. Our team will contact you within 24 hours. If you believe this is a mistake, email support@bubbry.in.",
            type: "temp_ban",
            read: false,
            created_at: new Date().toISOString(),
          });
        }

        // Insert dispute with all evidence + contact details for admin team
        const { error: disputeErr } = await supabase.from("disputes").insert({
          order_id: cancelOrder.id,
          shop_id: shopId,
          customer_id: cancelOrder.customer_id || null,
          reason: "fraud_customer",
          note: cancelNote,
          proof_url: proofUrl,
          payment_proof_url: cancelOrder.payment_proof || null,
          order_amount: (cancelOrder.amount_paid || 0) + (cancelOrder.amount_cash || 0),
          // Contact details for admin team to call
          shop_name: shopProfile?.shop_name || shopProfile?.name || null,
          shop_phone: shopProfile?.phone || null,
          customer_name: cancelOrder.customer_name || null,
          customer_phone: cancelOrder.customer_phone || null,
          status: "open",
          reported_by: "shop",
          created_at: new Date().toISOString(),
        });

        if (disputeErr) {
          // Fallback: minimal insert if new columns not added yet
          await supabase.from("disputes").insert({
            order_id: cancelOrder.id,
            shop_id: shopId,
            customer_id: cancelOrder.customer_id || null,
            reason: "fraud_customer",
            note: cancelNote,
            proof_url: proofUrl,
            status: "open",
            reported_by: "shop",
          });
        }

        setCancelOrder(null); setCancelReason(null); setCancelNote("");
        setCancelProof(null); setCancelProofPreview("");
        fetchOrders();
        alert("✓ Order cancelled.\n\n🚨 Fraud report submitted to Bubbry admin with all screenshots.\n\nCustomer's account has been temporarily restricted pending review.\nOur team will contact both parties within 24 hours.");
        setSubmittingCancel(false);
        return;
      }

      // ── NON-FRAUD: check daily cancel limit ────────────────────
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      const { count } = await supabase
        .from("orders")
        .select("id", { count: "exact", head: true })
        .eq("shop_id", shopId)
        .eq("cancelled_by", "shop")
        .neq("cancellation_reason", "fraud")
        .gte("cancelled_at", todayStart.toISOString());

      if ((count ?? 0) >= 2) {
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);
        await supabase.from("profiles").update({
          is_live: false,
          auto_offlined_until: endOfDay.toISOString(),
        }).eq("id", shopId);
        setCancelOrder(null); setCancelReason(null); setCancelNote("");
        setCancelProof(null); setCancelProofPreview("");
        fetchOrders();
        alert("✓ Order cancelled.\n\n⚠️ Your shop has been taken OFFLINE automatically.\n\nYou cancelled 2 or more orders today. Your shop will remain offline until midnight.");
        setSubmittingCancel(false);
        return;
      }

      setCancelOrder(null); setCancelReason(null); setCancelNote("");
      setCancelProof(null); setCancelProofPreview("");
      fetchOrders();
      alert("✓ Order cancelled. Customer will be notified to provide UPI for refund.");
    } catch(e: any) { alert("Error: " + e.message); }
    setSubmittingCancel(false);
  }

  function openCompleteModal(order: any) {
    setCompletingOrder(order);
    setProductFile(null); setProductPreview("");
    setCustomerFile(null); setCustomerPreview("");
    setDamageChecks({ undamaged: false, correct: false, customer_present: false });
    setModalStep("photos");
  }

  function closeModal() {
    stopCamera();
    setCompletingOrder(null);
    setProductFile(null); setProductPreview("");
    setCustomerFile(null); setCustomerPreview("");
    setDamageChecks({ undamaged: false, correct: false, customer_present: false });
    setModalStep("photos");
  }

  function handleCapture(type: "product"|"customer") {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        if (type === "product") { setProductFile(file); setProductPreview(reader.result as string); }
        else { setCustomerFile(file); setCustomerPreview(reader.result as string); }
      };
      reader.readAsDataURL(file);
    };
  }

  async function confirmComplete() {
    if (!completingOrder || !productFile || !customerFile) return;
    setCompleting(true);
    const order = completingOrder;

    // Upload product photo (camera only, live)
    let productPhotoUrl = null;
    const prodPath = `handoffs/${order.id}_products.jpg`;
    const { error: pe } = await supabase.storage.from("product-images").upload(prodPath, productFile, { upsert: true, contentType: productFile.type });
    if (!pe) {
      const { data } = supabase.storage.from("product-images").getPublicUrl(prodPath);
      productPhotoUrl = data.publicUrl;
    }

    // Upload customer photo (camera only, live)
    let customerPhotoUrl = null;
    const custPath = `handoffs/${order.id}_customer.jpg`;
    const { error: ce } = await supabase.storage.from("product-images").upload(custPath, customerFile, { upsert: true, contentType: customerFile.type });
    if (!ce) {
      const { data } = supabase.storage.from("product-images").getPublicUrl(custPath);
      customerPhotoUrl = data.publicUrl;
    }

    // Mark ALL items in group as completed + save proof
    for (const id of (order.all_ids || [order.id])) {
      await supabase.from("orders").update({
        status: "completed",
        handoff_photo: customerPhotoUrl,
        product_photo: productPhotoUrl,
        damage_check: JSON.stringify(damageChecks),
        completed_at: new Date().toISOString(),
      }).eq("id", id);
    }

    // Stock was already deducted when shopkeeper marked order ready — do not deduct again here
    setCompleting(false);
    closeModal();
    fetchOrders();
  }

  function timeAgo(date: string) {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  }

  const filtered = filter === "all" ? orders : orders.filter((o: any) => o.status === filter);

  return (
    <div className="page">
      <style>{CSS}</style>

      <div className="top-bar">
        <a href="/shop-dashboard" className="back-btn">←</a>
        <div className="page-title">Orders 📋</div>
      </div>

      <div className="filter-tabs">
        {FILTERS.map((f) => (
          <button key={f} className={`filter-chip ${filter === f ? "active" : ""}`} onClick={() => setFilter(f)}>
            {f === "all" ? `All (${orders.length})` : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className="content">
        {loading ? (
          <div style={{ textAlign: "center", padding: 60, color: "#8A96B5", fontWeight: 600 }}>Loading orders...</div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <div className="empty-title">No {filter !== "all" ? filter : ""} orders</div>
            <div className="empty-sub">Orders from customers will appear here</div>
          </div>
        ) : (
          filtered.map((order: any) => {
            const status = order.status ?? "pending";
            return (
              <div key={order.group_id || order.id} className="order-card">
                <div className="order-hdr">
                  <div className="order-id">#{order.id.slice(0, 8).toUpperCase()}</div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <span className={`type-badge ${order.order_type === "delivery" ? "type-delivery" : "type-pickup"}`}>
                      {order.order_type === "delivery" ? "🛵" : "🏃"} {order.order_type}
                    </span>
                    <span className="order-time">{timeAgo(order.created_at)}</span>
                  </div>
                </div>
                <div className="order-body">
                  {/* Items list */}
                  <div style={{marginBottom:10}}>
                    {(order.items || []).map((item: any, idx: number) => (
                      <div key={item.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"6px 0",borderBottom:idx < order.items.length-1?"1px solid #F4F6FB":"none"}}>
                        <div>
                          <div style={{fontSize:14,fontWeight:700,color:"#0D1B3E"}}>{item.product_name}</div>
                          <div style={{fontSize:12,color:"#8A96B5"}}>Qty: {item.quantity}</div>
                        </div>
                        <div style={{fontSize:14,fontWeight:800,color:"#1A6BFF"}}>₹{item.price * item.quantity}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingTop:8,borderTop:"1.5px solid #E4EAFF",marginBottom:10}}>
                    <span style={{fontSize:13,fontWeight:700,color:"#4A5880"}}>{(order.items||[]).length} item{(order.items||[]).length!==1?"s":""}</span>
                    <span className={`status-pill ${status === "pending" ? "s-pending" : status === "ready" ? "s-ready" : status === "out_for_delivery" ? "s-out" : "s-completed"}`}>
                      {status === "out_for_delivery"
                        ? `🛵 ${order.rider_name ? `With ${order.rider_name}` : "Out for Delivery"}`
                        : status.charAt(0).toUpperCase() + status.slice(1)}
                    </span>
                  </div>
                  <div className="order-price">₹{order.total ?? 0}</div>

                  {order.order_type === "delivery" && order.delivery_address && (
                    <div className="addr-box">📍 {order.delivery_address}</div>
                  )}

                  {/* Delivery proof photos — both clickable */}
                  {status === "completed" && (order.handoff_photo || order.product_photo) && (
                    <div style={{marginBottom:10}}>
                      <div style={{fontSize:11,fontWeight:800,color:"#8A96B5",textTransform:"uppercase",letterSpacing:"0.5px",marginBottom:6}}>
                        📸 Delivery Proof Photos
                      </div>
                      <div style={{display:"flex",gap:8}}>
                        {order.product_photo && (
                          <div style={{flex:1,cursor:"pointer",position:"relative"}} onClick={() => setLightboxImg(order.product_photo)}>
                            <img src={order.product_photo} alt="Products" style={{width:"100%",height:90,objectFit:"cover",borderRadius:10,border:"1.5px solid #E4EAFF",display:"block"}} />
                            <div style={{position:"absolute",bottom:4,left:4,background:"rgba(0,0,0,0.55)",color:"white",fontSize:9,fontWeight:800,borderRadius:4,padding:"2px 5px"}}>📦 Products</div>
                            <div style={{position:"absolute",top:4,right:4,background:"rgba(26,107,255,0.85)",color:"white",fontSize:9,fontWeight:800,borderRadius:4,padding:"2px 5px"}}>🔍 View</div>
                          </div>
                        )}
                        {order.handoff_photo && (
                          <div style={{flex:1,cursor:"pointer",position:"relative"}} onClick={() => setLightboxImg(order.handoff_photo)}>
                            <img src={order.handoff_photo} alt="Customer" style={{width:"100%",height:90,objectFit:"cover",borderRadius:10,border:"1.5px solid #E4EAFF",display:"block"}} />
                            <div style={{position:"absolute",bottom:4,left:4,background:"rgba(0,0,0,0.55)",color:"white",fontSize:9,fontWeight:800,borderRadius:4,padding:"2px 5px"}}>🤝 Customer</div>
                            <div style={{position:"absolute",top:4,right:4,background:"rgba(26,107,255,0.85)",color:"white",fontSize:9,fontWeight:800,borderRadius:4,padding:"2px 5px"}}>🔍 View</div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Call Buttons — only when order is ready or out for delivery */}
                  {(status === "ready" || status === "out_for_delivery") && (
                    <div className="call-row">
                      {order.customer_phone ? (
                        <a href={`tel:${order.customer_phone}`} className="call-btn call-customer">
                          📞 Call Customer
                          {order.customer_name && <span style={{fontWeight:500,fontSize:11,marginLeft:2}}>({order.customer_name})</span>}
                        </a>
                      ) : (
                        <span style={{fontSize:11,color:"#B0BACC",fontWeight:600,alignSelf:"center"}}>📵 Customer phone not available</span>
                      )}
                      {order.rider_id && (() => {
                        const riderInState = riders.find((r:any) => r.id === order.rider_id);
                        const riderPhone = riderInState?.phone || order.rider_phone;
                        const riderName = riderInState?.name || order.rider_name;
                        return riderPhone ? (
                          <a href={`tel:${riderPhone}`} className="call-btn call-rider">
                            🛵 Call Rider
                            {riderName && <span style={{fontWeight:500,fontSize:11,marginLeft:2}}>({riderName})</span>}
                          </a>
                        ) : null;
                      })()}
                    </div>
                  )}

                  {/* Payment Proof Section */}
                  <div className="payment-proof-box">
                    <div className="payment-proof-header">
                      <div className="payment-proof-title">💳 Payment Proof</div>
                      <span className={`payment-method-chip ${order.payment_method === "cod" ? "chip-cod" : "chip-upi"}`}>
                        {order.payment_method === "cod" ? "💵 COD" : "📲 UPI"}
                      </span>
                    </div>
                    <div className="payment-amounts">
                      <div className="payment-amount-item">
                        <div className="payment-amount-label">UPI Paid</div>
                        <div className={`payment-amount-val ${order.amount_paid > 0 ? "green" : ""}`}>
                          ₹{order.amount_paid ?? 0}
                        </div>
                      </div>
                      {order.payment_method === "cod" && (
                        <div className="payment-amount-item">
                          <div className="payment-amount-label">Cash Due</div>
                          <div className="payment-amount-val orange">₹{order.amount_cash ?? 0}</div>
                        </div>
                      )}
                      <div className="payment-amount-item">
                        <div className="payment-amount-label">Total</div>
                        <div className="payment-amount-val">₹{(order.amount_paid ?? 0) + (order.amount_cash ?? 0)}</div>
                      </div>
                    </div>
                    {order.payment_proof ? (
                      <>
                        <div className="proof-img-wrap" onClick={() => setLightboxImg(order.payment_proof)}>
                          <img src={order.payment_proof} alt="Payment Screenshot" className="proof-img" />
                          <div className="proof-img-expand">🔍 Tap to enlarge</div>
                        </div>
                        {status === "pending"
                          ? <div className="verify-pending">⏳ Verify this payment before marking ready</div>
                          : <div className="verify-done">✓ Payment verified</div>
                        }
                      </>
                    ) : (
                      <div className="proof-missing">⚠️ No payment screenshot uploaded by customer</div>
                    )}
                  </div>

                  <div className="action-row">
                    {status === "pending" && (
                      <>
                        <button className="action-btn btn-ready" onClick={() => markReady(order)}>
                          Mark Ready ⭐
                        </button>
                        <button className="action-btn" style={{background:"#FFF0F0",color:"#E53E3E",border:"1.5px solid #FFCDD2"}}
                          onClick={() => { setCancelOrder(order); setCancelReason(null); setCancelNote(""); setCancelProof(null); setCancelProofPreview(""); }}>
                          ✕ Cancel
                        </button>
                      </>
                    )}
                    {status === "ready" && (
                      <div className="action-row" style={{flexDirection:"column",gap:8}}>
                        {order.order_type === "delivery" && (
                          <button className="action-btn btn-out" onClick={() => markOutForDelivery(order)}>
                            🛵 Mark Out for Delivery
                          </button>
                        )}
                        {order.order_type !== "delivery" && (
                          <div>
                            <div style={{background:"#EBF1FF",borderRadius:10,padding:"10px 12px",fontSize:12,fontWeight:700,color:"#1A6BFF",marginBottom:8}}>
                              🏃 Customer is on their way — verify their OTP when they arrive
                            </div>
                            <PickupOtpVerify order={order} onVerified={() => { openCompleteModal(order); fetchOrders(); }} />
                          </div>
                        )}
                        <a href={`/track?order=${order.id}&role=shop`} className="btn-track">
                          📍 Track Customer →
                        </a>
                      </div>
                    )}
                    {status === "out_for_delivery" && (
                      <div className="action-row" style={{flexDirection:"column",gap:8}}>
                        {/* Delivery OTP is shown ONLY to the customer to prevent fraud — not shown here */}
                        <div style={{background:"#EBF1FF",borderRadius:10,padding:"10px 12px",fontSize:12,fontWeight:700,color:"#1A6BFF"}}>
                          🛵 Rider is delivering — they will mark it delivered after OTP verification
                        </div>
                        <a href={`/track?order=${order.id}&role=shop`} className="btn-track" style={{background:"linear-gradient(135deg,#1A6BFF,#4D8FFF)",color:"white",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
                          📍 Track Live Delivery
                        </a>
                      </div>
                    )}
                    {status === "cancelled" && (
                      <div style={{background:"#FFF8E6",border:"1.5px solid #FFD88A",borderRadius:12,padding:"12px 14px"}}>
                        <div style={{fontSize:13,fontWeight:800,color:"#946200",marginBottom:6}}>
                          {order.cancellation_reason === "fraud" ? "🚨 Cancelled — Fraud Reported" : "✕ Order Cancelled"}
                        </div>
                        {order.refund_upi && !order.refund_screenshot && (
                          <div>
                            <div style={{fontSize:12,fontWeight:700,color:"#0D1B3E",marginBottom:6}}>
                              📱 Customer UPI for refund: <strong>{order.refund_upi}</strong>
                            </div>
                            <div style={{fontSize:11,color:"#8A96B5",marginBottom:8}}>
                              Refund ₹{(order.amount_paid||0)+(order.amount_cash||0)} to this UPI and attach screenshot below
                            </div>
                            <label style={{display:"flex",alignItems:"center",gap:8,padding:"10px 12px",border:"2px dashed #E4EAFF",borderRadius:10,cursor:"pointer",color:"#1A6BFF",fontSize:12,fontWeight:700}}>
                              📸 Attach refund screenshot
                              <input type="file" accept="image/*" style={{display:"none"}} onChange={async (e) => {
                                const f = e.target.files?.[0]; if (!f) return;
                                const path = `refunds/${order.id}_${Date.now()}.jpg`;
                                const { error } = await supabase.storage.from("product-images").upload(path, f, {upsert:true, contentType:f.type});
                                if (!error) {
                                  const { data } = supabase.storage.from("product-images").getPublicUrl(path);
                                  for (const id of (order.all_ids||[order.id])) {
                                    await supabase.from("orders").update({ refund_screenshot: data.publicUrl }).eq("id", id);
                                  }
                                  fetchOrders();
                                  alert("✓ Refund screenshot sent to customer!");
                                }
                              }}/>
                            </label>
                          </div>
                        )}
                        {order.refund_screenshot && (
                          <div>
                            <div style={{fontSize:12,fontWeight:700,color:"#00875A",marginBottom:6}}>✅ Refund screenshot sent</div>
                            <button onClick={() => setLightboxImg(order.refund_screenshot)}
                              style={{background:"#E6FAF4",border:"1.5px solid #B8E8D4",color:"#00875A",borderRadius:8,padding:"7px 12px",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>
                              View Screenshot
                            </button>
                          </div>
                        )}
                        {!order.refund_upi && order.cancellation_reason !== "fraud" && (
                          <div style={{fontSize:12,color:"#8A96B5",fontWeight:600}}>Waiting for customer to provide UPI...</div>
                        )}
                      </div>
                    )}
                    {status === "completed" && (
                      <button className="action-btn btn-disabled" disabled>
                        {order.handoff_photo ? "✓ Completed with photo" : "✓ Order Completed"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Delivery Proof Modal */}
      {completingOrder && (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}>
          <div className="modal-sheet" style={{maxHeight:"92vh",overflowY:"auto"}}>
            <div className="modal-handle" />

            {/* Step indicator */}
            <div className="progress-steps">
              <div className={`progress-step ${modalStep==="photos"?"active":"done"}`}>📸 Photos</div>
              <div className={`progress-step ${modalStep==="checklist"?"active":productFile&&customerFile?"":"" }`}>✅ Checklist</div>
            </div>

            {modalStep === "photos" && (
              <>
                <div className="modal-title">📸 Delivery Proof Photos</div>
                <div className="modal-sub">Both photos are required. Use your camera only — gallery is disabled for authenticity.</div>

                {/* Photo 1: Products */}
                <div className="photo-step">
                  <div className="photo-step-label required">📦 Photo of Products</div>
                  <div className={`camera-box ${productPreview?"captured":""}`} onClick={() => !productPreview && openCamera("product")}>
                    {productPreview ? (
                      <>
                        <div className="live-badge">LIVE</div>
                        <img src={productPreview} alt="Products" className="capture-preview" />
                        <div className="retake-bar">
                          <button className="retake-btn" onClick={e => { e.stopPropagation(); setProductFile(null); setProductPreview(""); openCamera("product"); }}>🔄 Retake</button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="camera-icon-big">📦</div>
                        <div className="camera-cta">Tap to photograph products</div>
                        <div className="camera-sub">Show all products clearly — sealed, undamaged</div>
                        <div className="camera-no-gallery">📵 Camera only — gallery disabled</div>
                      </>
                    )}
                  </div>
                </div>

                {/* Photo 2: Customer */}
                <div className="photo-step">
                  <div className="photo-step-label required">🤝 Photo with Customer</div>
                  <div className={`camera-box ${customerPreview?"captured":""}`} onClick={() => !customerPreview && openCamera("customer")}>
                    {customerPreview ? (
                      <>
                        <div className="live-badge">LIVE</div>
                        <img src={customerPreview} alt="Customer" className="capture-preview" />
                        <div className="retake-bar">
                          <button className="retake-btn" onClick={e => { e.stopPropagation(); setCustomerFile(null); setCustomerPreview(""); openCamera("customer"); }}>🔄 Retake</button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="camera-icon-big">🤝</div>
                        <div className="camera-cta">Tap to photograph customer handoff</div>
                        <div className="camera-sub">Customer must be visible receiving the order</div>
                        <div className="camera-no-gallery">📵 Camera only — gallery disabled</div>
                      </>
                    )}
                  </div>
                </div>

                <button
                  className="modal-confirm-btn"
                  disabled={!productFile || !customerFile}
                  onClick={() => setModalStep("checklist")}
                >
                  {!productFile || !customerFile ? `📸 ${!productFile?"Take Product Photo":"Take Customer Photo"} First` : "Next: Delivery Checklist →"}
                </button>
              </>
            )}

            {modalStep === "checklist" && (
              <>
                <div className="modal-title">✅ Delivery Checklist</div>
                <div className="modal-sub">Confirm all items before completing the order.</div>

                {/* Preview thumbnails */}
                <div style={{display:"flex",gap:8,marginBottom:16}}>
                  <img src={productPreview} style={{flex:1,height:80,objectFit:"cover",borderRadius:10,border:"1.5px solid #E4EAFF"}} alt="Products" />
                  <img src={customerPreview} style={{flex:1,height:80,objectFit:"cover",borderRadius:10,border:"1.5px solid #E4EAFF"}} alt="Customer" />
                </div>

                <div className="damage-check">
                  <div className="damage-check-title">Confirm the following to complete delivery:</div>
                  {[
                    { key:"undamaged", label:"✅ All products are undamaged and in original condition" },
                    { key:"correct", label:"✅ Correct products delivered as per the order" },
                    { key:"customer_present", label:"✅ Customer is present and has received the order" },
                  ].map(({key,label}) => (
                    <div key={key} className="damage-row" onClick={() => setDamageChecks(p => ({...p, [key]: !p[key as keyof typeof p]}))}>
                      <div className={`damage-checkbox ${damageChecks[key as keyof typeof damageChecks]?"checked":""}`}>
                        {damageChecks[key as keyof typeof damageChecks] && <span style={{color:"white",fontSize:12,fontWeight:900}}>✓</span>}
                      </div>
                      <div className="damage-label">{label}</div>
                    </div>
                  ))}
                </div>

                <div style={{background:"#EBF1FF",borderRadius:10,padding:"10px 12px",fontSize:11,color:"#4A5880",fontWeight:600,marginBottom:14,lineHeight:1.6}}>
                  ⚖️ By completing this order, you confirm the above checklist is accurate. These photos and confirmations are legally binding delivery proof stored in our system.
                </div>

                <button
                  className="modal-confirm-btn"
                  onClick={confirmComplete}
                  disabled={completing || !damageChecks.undamaged || !damageChecks.correct || !damageChecks.customer_present}
                >
                  {completing ? "Completing..." : !damageChecks.undamaged||!damageChecks.correct||!damageChecks.customer_present ? "Tick all checkboxes to confirm" : "✓ Complete Delivery"}
                </button>
                <button style={{width:"100%",padding:12,background:"none",border:"none",color:"#8A96B5",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"'Plus Jakarta Sans',sans-serif"}} onClick={() => setModalStep("photos")}>← Back to Photos</button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Payment Screenshot Lightbox */}
      {/* ─── Cancellation Modal ─── */}
      {cancelOrder && (
        <div style={{position:"fixed",inset:0,background:"rgba(13,27,62,0.6)",zIndex:800,display:"flex",alignItems:"flex-end",justifyContent:"center",backdropFilter:"blur(4px)"}}>
          <div style={{background:"white",borderRadius:"24px 24px 0 0",width:"100%",maxWidth:480,maxHeight:"90vh",overflowY:"auto",padding:"0 0 32px"}}>
            <div style={{width:40,height:4,background:"#E4EAFF",borderRadius:2,margin:"14px auto 16px"}}/>
            <div style={{padding:"0 20px 16px",borderBottom:"1.5px solid #F4F6FB"}}>
              <div style={{fontSize:18,fontWeight:900,color:"#0D1B3E",marginBottom:4}}>✕ Cancel Order</div>
              <div style={{fontSize:13,color:"#8A96B5",fontWeight:500}}>Order #{(cancelOrder.id||"").slice(0,8).toUpperCase()} · {cancelOrder.order_type === "delivery" ? "🛵 Delivery" : "🏃 Pickup"}</div>
            </div>

            <div style={{padding:"16px 20px 0"}}>
              <div style={{fontSize:13,fontWeight:800,color:"#0D1B3E",marginBottom:10}}>Why are you cancelling?</div>

              {/* Reason: Unavailability */}
              <button className={`cancel-reason-btn ${cancelReason==="unavailable"?"selected":""}`}
                onClick={() => setCancelReason("unavailable")}>
                <span style={{fontSize:20}}>📦</span>
                <div>
                  <div>Product unavailable / Out of stock</div>
                  <div style={{fontSize:11,color:"#8A96B5",fontWeight:500,marginTop:2}}>You'll need to refund the customer</div>
                </div>
                {cancelReason==="unavailable" && <span style={{marginLeft:"auto",color:"#E53E3E"}}>✓</span>}
              </button>

              {/* Reason: Other shop issue */}
              <button className={`cancel-reason-btn ${cancelReason==="other"?"selected":""}`}
                onClick={() => setCancelReason("other")}>
                <span style={{fontSize:20}}>🏪</span>
                <div>
                  <div>Shop issue (closed, can't fulfil)</div>
                  <div style={{fontSize:11,color:"#8A96B5",fontWeight:500,marginTop:2}}>You'll need to refund the customer</div>
                </div>
                {cancelReason==="other" && <span style={{marginLeft:"auto",color:"#E53E3E"}}>✓</span>}
              </button>

              {/* Reason: Fraud */}
              <button className={`cancel-reason-btn ${cancelReason==="fraud"?"selected-fraud":""}`}
                style={{borderColor:cancelReason==="fraud"?"#E53E3E":"#E4EAFF"}}
                onClick={() => setCancelReason("fraud")}>
                <span style={{fontSize:20}}>🚨</span>
                <div>
                  <div style={{fontWeight:900,color:cancelReason==="fraud"?"#E53E3E":"#0D1B3E"}}>Fraud / Fake payment proof</div>
                  <div style={{fontSize:11,color:"#8A96B5",fontWeight:500,marginTop:2}}>Report to Bubbry team for investigation</div>
                </div>
                {cancelReason==="fraud" && <span style={{marginLeft:"auto",color:"#E53E3E"}}>✓</span>}
              </button>

              {/* Fraud warning */}
              {cancelReason==="fraud" && (
                <div className="fraud-warning">
                  <div className="fraud-warning-title">⚠️ Fraud Reporting Policy</div>
                  <div className="fraud-warning-text">
                    By reporting fraud, you confirm the payment proof is fake or no payment was received.<br/><br/>
                    <strong>If customer is found guilty:</strong> Customer must pay double the order amount to you.<br/>
                    <strong>If report is false:</strong> Shopkeeper must pay double to the customer.<br/><br/>
                    🚔 Repeated fraud may result in police involvement. Our team will review within 24 hours.
                  </div>
                </div>
              )}

              {/* Notes */}
              {cancelReason && (
                <div style={{marginBottom:12}}>
                  <label style={{fontSize:11,fontWeight:700,color:"#8A96B5",textTransform:"uppercase",letterSpacing:"0.5px",display:"block",marginBottom:6}}>
                    {cancelReason==="fraud" ? "Describe the fraud (required)" : "Additional note (optional)"}
                    {cancelReason==="fraud" && <span style={{color:"#E53E3E",marginLeft:4}}>*</span>}
                  </label>
                  <textarea rows={3} placeholder={cancelReason==="fraud" ? "e.g. Customer sent edited GPay screenshot, amount shows ₹499 but I received nothing..." : "e.g. Item out of stock, will restock in 2 days..."}
                    value={cancelNote} onChange={e => setCancelNote(e.target.value)}
                    style={{width:"100%",padding:"10px 12px",border:"1.5px solid #E4EAFF",borderRadius:10,fontSize:13,fontFamily:"inherit",resize:"none",outline:"none",boxSizing:"border-box"}}/>
                </div>
              )}

              {/* Proof screenshot */}
              {cancelReason && (
                <div style={{marginBottom:14}}>
                  <label style={{fontSize:11,fontWeight:700,color:"#8A96B5",textTransform:"uppercase",letterSpacing:"0.5px",display:"block",marginBottom:6}}>
                    {cancelReason==="fraud" ? "📸 Attach your GPay/payment screenshot (required)" : "📸 Screenshot (optional)"}
                    {cancelReason==="fraud" && <span style={{color:"#E53E3E",marginLeft:4}}>*</span>}
                  </label>
                  {cancelProofPreview ? (
                    <div style={{position:"relative",borderRadius:10,overflow:"hidden",border:"1.5px solid #E4EAFF"}}>
                      <img src={cancelProofPreview} style={{width:"100%",maxHeight:160,objectFit:"cover",display:"block"}} alt="proof"/>
                      <button onClick={() => { setCancelProof(null); setCancelProofPreview(""); }}
                        style={{position:"absolute",top:6,right:6,background:"rgba(0,0,0,0.5)",border:"none",color:"white",borderRadius:"50%",width:28,height:28,cursor:"pointer",fontSize:13}}>✕</button>
                    </div>
                  ) : (
                    <label style={{display:"flex",alignItems:"center",gap:10,padding:"12px 14px",border:"2px dashed #E4EAFF",borderRadius:10,cursor:"pointer",color:"#1A6BFF",fontSize:13,fontWeight:700}}>
                      <span style={{fontSize:22}}>📷</span> Tap to attach screenshot
                      <input type="file" accept="image/*" style={{display:"none"}} onChange={e => {
                        const f = e.target.files?.[0]; if (!f) return;
                        setCancelProof(f);
                        const r2 = new FileReader(); r2.onload = () => setCancelProofPreview(r2.result as string); r2.readAsDataURL(f);
                      }}/>
                    </label>
                  )}
                </div>
              )}

              {/* Action buttons */}
              {cancelReason && (
                <button className="btn-cancel-order"
                  disabled={submittingCancel || (cancelReason==="fraud" && (!cancelNote.trim() || !cancelProof))}
                  onClick={submitCancellation}>
                  {submittingCancel ? "Cancelling..." :
                    cancelReason==="fraud" ? "🚨 Cancel & Report Fraud" :
                    "✕ Cancel Order"}
                </button>
              )}
              <button onClick={() => setCancelOrder(null)}
                style={{width:"100%",padding:12,background:"none",border:"none",color:"#8A96B5",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit",marginTop:8}}>
                Keep Order
              </button>
            </div>
          </div>
        </div>
      )}

      {lightboxImg && (
        <div className="lightbox" onClick={() => setLightboxImg(null)}>
          <button className="lightbox-close" onClick={() => setLightboxImg(null)}>✕</button>
          <img src={lightboxImg} alt="Payment proof" />
          <div style={{color:"rgba(255,255,255,0.6)",fontSize:12,fontWeight:600,marginTop:12}}>Tap anywhere to close</div>
        </div>
      )}

      {/* Rider Selector Modal */}
      {riderSelectOrder && (
        <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) setRiderSelectOrder(null); }}>
          <div className="modal-sheet" style={{ maxHeight: "80vh", overflowY: "auto" }}>
            <div className="modal-handle" />
            <div className="modal-title">🛵 Select Rider</div>
            <div className="modal-sub">Choose who will deliver order #{riderSelectOrder.id.slice(0,8).toUpperCase()}</div>

            {riders.map((rider: any) => (
              <div key={rider.id} className={`rider-option ${selectedRider === rider.id ? "selected" : ""}`}
                onClick={() => setSelectedRider(rider.id)}>
                <div className="rider-avatar">🛵</div>
                <div style={{ flex: 1 }}>
                  <div className="rider-name">{rider.name}</div>
                  <div className="rider-phone">{rider.phone}</div>
                </div>
                <div className={`rider-check ${selectedRider === rider.id ? "on" : ""}`}>
                  {selectedRider === rider.id && <span style={{ color: "white", fontSize: 12, fontWeight: 900 }}>✓</span>}
                </div>
              </div>
            ))}

            <div style={{ marginTop: 6, padding: "10px 0", borderTop: "1px solid #F4F6FB" }}>
              <div style={{background:"#FFF8E6",borderRadius:10,padding:"10px 14px",fontSize:12,fontWeight:700,color:"#946200"}}>
                ⚠️ Assigning a rider is required to dispatch a delivery order.
              </div>
            </div>

            <button
              className="modal-confirm-btn"
              style={{ marginTop: 16, opacity: selectedRider ? 1 : 0.5, cursor: selectedRider ? "pointer" : "not-allowed" }}
              onClick={confirmOutForDelivery}
              disabled={!selectedRider}
            >
              🛵 Assign Rider & Dispatch
            </button>
          </div>
        </div>
      )}

      {/* Live Camera Overlay */}
      {cameraOpen && (
        <div className="camera-overlay">
          <div className="camera-label">
            {cameraOpen === "product" ? "📦 Photograph the products clearly" : "🤝 Photograph customer receiving order"}
          </div>
          <video ref={videoRef} className="camera-video" autoPlay playsInline muted />
          <canvas ref={canvasRef} style={{display:"none"}} />
          <div className="camera-controls">
            <button className="camera-cancel" onClick={stopCamera}>✕</button>
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:6}}>
              <button className="camera-shutter" onClick={capturePhoto} title="Take photo">
                <div className="camera-shutter-inner"/>
              </button>
              <span style={{color:"rgba(255,255,255,0.7)",fontSize:11,fontWeight:700}}>Tap to capture</span>
            </div>
            <button className="camera-flip" onClick={flipCamera}>🔄</button>
          </div>
        </div>
      )}

      <nav className="bottom-nav">
        <a href="/shop-dashboard" className="nav-item"><div className="nav-icon">🏠</div>Home</a>
        <a href="/add-product" className="nav-item"><div className="nav-icon">➕</div>Add</a>
        <a href="/shop-orders" className="nav-item active"><div className="nav-icon">📋</div>Orders</a>
        <a href="/help" className="nav-item"><div className="nav-icon">💬</div>Help</a>
      </nav>
    </div>
  );
}
