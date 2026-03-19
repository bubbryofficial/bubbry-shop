"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

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

/* Modal overlay */
.modal-overlay { position: fixed; inset: 0; background: rgba(13,27,62,0.6); z-index: 500; display: flex; align-items: flex-end; justify-content: center; backdrop-filter: blur(4px); }
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
.camera-overlay { position: fixed; inset: 0; background: black; z-index: 600; display: flex; flex-direction: column; }
.camera-video { flex: 1; width: 100%; object-fit: cover; }
.camera-controls { background: rgba(0,0,0,0.85); padding: 20px 24px; display: flex; align-items: center; justify-content: space-between; gap: 16px; }
.camera-shutter { width: 72px; height: 72px; border-radius: 50%; background: white; border: 4px solid rgba(255,255,255,0.5); cursor: pointer; flex-shrink: 0; transition: transform 0.1s; }
.camera-shutter:active { transform: scale(0.92); }
.camera-flip { width: 48px; height: 48px; border-radius: 50%; background: rgba(255,255,255,0.2); border: none; color: white; font-size: 20px; cursor: pointer; display: flex; align-items: center; justify-content: center; }
.camera-cancel { width: 48px; height: 48px; border-radius: 50%; background: rgba(255,0,0,0.3); border: none; color: white; font-size: 18px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; }
.camera-label { color: white; font-size: 13px; font-weight: 700; text-align: center; position: absolute; top: 16px; left: 0; right: 0; }
.empty-state { text-align: center; padding: 80px 24px; }
.empty-icon { font-size: 56px; margin-bottom: 12px; }
.empty-title { font-size: 18px; font-weight: 800; color: #0D1B3E; margin-bottom: 6px; }
.empty-sub { font-size: 14px; color: #8A96B5; }
.bottom-nav { position: fixed; bottom: 0; left: 0; right: 0; height: 70px; background: white; border-top: 1.5px solid #E4EAFF; display: flex; align-items: center; box-shadow: 0 -4px 20px rgba(26,107,255,0.07); z-index: 100; }
.nav-item { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 3px; padding: 8px 0; text-decoration: none; color: #B0BACC; font-size: 10px; font-weight: 700; transition: color 0.15s; }
.nav-item.active { color: #1A6BFF; }
.nav-icon { font-size: 22px; line-height: 1; }
`;

const FILTERS = ["all", "pending", "ready", "completed"];

export default function ShopOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

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
  const productInputRef = useRef<HTMLInputElement>(null);
  const customerInputRef = useRef<HTMLInputElement>(null);
  // Live camera state
  const [cameraOpen, setCameraOpen] = useState<"product"|"customer"|null>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream|null>(null);
  const [camFacing, setCamFacing] = useState<"environment"|"user">("environment");
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => { fetchOrders(); }, []);

  async function fetchOrders() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data: ordersData, error } = await supabase
      .from("orders")
      .select("id, quantity, order_type, delivery_address, status, created_at, product_id, shop_id, handoff_photo, payment_proof, payment_method, amount_paid, amount_cash")
      .eq("shop_id", user.id)
      .order("created_at", { ascending: false });

    if (error) { console.log(error); setLoading(false); return; }
    if (!ordersData || ordersData.length === 0) { setOrders([]); setLoading(false); return; }

    const productIds = [...new Set(ordersData.map((o: any) => o.product_id).filter(Boolean))];
    const { data: spData } = productIds.length > 0
      ? await supabase.from("shop_products").select("product_id, shop_id, name, price").in("product_id", productIds)
      : { data: [] };

    const spMap: any = {};
    (spData || []).forEach((sp: any) => { spMap[sp.product_id + "_" + sp.shop_id] = sp; });

    const enriched = ordersData.map((order: any) => {
      const sp = spMap[order.product_id + "_" + order.shop_id] || {};
      return { ...order, product_name: sp.name ?? "Product", product_price: sp.price ?? 0 };
    });

    setOrders(enriched);
    setLoading(false);
  }

  async function markReady(id: string) {
    await supabase.from("orders").update({ status: "ready" }).eq("id", id);
    fetchOrders();
  }

  // Opens the handoff photo modal
  async function openCamera(type: "product"|"customer") {
    const facing = type === "product" ? "environment" : "environment";
    setCamFacing(facing);
    setCameraOpen(type);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: facing }, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false
      });
      setCameraStream(stream);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      }, 100);
    } catch(err) {
      alert("Could not access camera. Please allow camera permission and try again.");
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
      if (videoRef.current) { videoRef.current.srcObject = stream; videoRef.current.play(); }
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

    // Mark order completed + save both photo URLs + checklist
    await supabase.from("orders").update({
      status: "completed",
      handoff_photo: customerPhotoUrl,
      product_photo: productPhotoUrl,
      damage_check: JSON.stringify(damageChecks),
      completed_at: new Date().toISOString(),
    }).eq("id", order.id);

    // Deduct stock
    const { data: sp } = await supabase
      .from("shop_products")
      .select("id, stock")
      .eq("product_id", order.product_id)
      .eq("shop_id", order.shop_id)
      .single();
    if (sp) {
      const newStock = Math.max(0, (sp.stock ?? 0) - (order.quantity ?? 1));
      await supabase.from("shop_products").update({ stock: newStock }).eq("id", sp.id);
    }

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

  const filtered = filter === "all" ? orders : orders.filter((o) => o.status === filter);

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
          filtered.map((order) => {
            const status = order.status ?? "pending";
            return (
              <div key={order.id} className="order-card">
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
                  <div className="order-product">{order.product_name ?? "Product"}</div>
                  <div className="order-detail">
                    <span>Qty: {order.quantity}</span>
                    <span>·</span>
                    <span className={`status-pill ${status === "pending" ? "s-pending" : status === "ready" ? "s-ready" : "s-completed"}`}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </span>
                  </div>
                  <div className="order-price">₹{(order.product_price ?? 0) * order.quantity}</div>

                  {order.order_type === "delivery" && order.delivery_address && (
                    <div className="addr-box">📍 {order.delivery_address}</div>
                  )}

                  {/* Show handoff photo if completed */}
                  {status === "completed" && order.handoff_photo && (
                    <img src={order.handoff_photo} alt="Handoff" className="handoff-thumb" />
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
                        <button className="action-btn btn-ready" onClick={() => markReady(order.id)}>
                          Mark Ready ⭐
                        </button>
                        <button className="action-btn btn-done" onClick={() => openCompleteModal(order)}>
                          Complete ✓
                        </button>
                      </>
                    )}
                    {status === "ready" && (
                      <button className="action-btn btn-done" onClick={() => openCompleteModal(order)}>
                        📷 Mark Completed
                      </button>
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
      {lightboxImg && (
        <div className="lightbox" onClick={() => setLightboxImg(null)}>
          <button className="lightbox-close" onClick={() => setLightboxImg(null)}>✕</button>
          <img src={lightboxImg} alt="Payment proof" />
          <div style={{color:"rgba(255,255,255,0.6)",fontSize:12,fontWeight:600,marginTop:12}}>Tap anywhere to close</div>
        </div>
      )}

      {/* Live Camera Overlay */}
      {cameraOpen && (
        <div className="camera-overlay">
          <div style={{position:"relative"}}>
            <div className="camera-label">
              {cameraOpen === "product" ? "📦 Photograph the products" : "🤝 Photograph customer handoff"}
            </div>
          </div>
          <video ref={videoRef} className="camera-video" autoPlay playsInline muted />
          <canvas ref={canvasRef} style={{display:"none"}} />
          <div className="camera-controls">
            <button className="camera-cancel" onClick={stopCamera}>✕</button>
            <button className="camera-shutter" onClick={capturePhoto} title="Take photo" />
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
