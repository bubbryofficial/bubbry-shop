"use client";
import { supabase } from "../../../lib/supabase";
import { useState, useEffect } from "react";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Plus Jakarta Sans', sans-serif; background: #F4F6FB; min-height: 100vh; }
.header { background: linear-gradient(135deg,#0D1B3E,#1A3A8F); padding: 16px 20px; position: sticky; top: 0; z-index: 100; box-shadow: 0 4px 20px rgba(13,27,62,0.3); }
.header-row { display: flex; align-items: center; justify-content: space-between; }
.header-title { font-size: 17px; font-weight: 900; color: white; }
.header-sub { font-size: 11px; color: rgba(255,255,255,0.6); margin-top: 2px; font-weight: 600; }
.logout-btn { background: rgba(255,255,255,0.15); border: none; color: white; padding: 7px 14px; border-radius: 9px; font-size: 12px; font-weight: 800; cursor: pointer; font-family: inherit; }
.page { max-width: 600px; margin: 0 auto; padding: 20px 16px 80px; }
.welcome-card { background: linear-gradient(135deg,#1A6BFF,#0D3FAD); border-radius: 16px; padding: 20px; margin-bottom: 20px; }
.welcome-name { font-size: 20px; font-weight: 900; color: white; margin-bottom: 4px; }
.welcome-loc { font-size: 13px; color: rgba(255,255,255,0.8); font-weight: 600; }
.perm-pills { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 12px; }
.perm-pill { background: rgba(255,255,255,0.2); color: white; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 20px; }
.sec-title { font-size: 11px; font-weight: 800; color: #8A96B5; text-transform: uppercase; letter-spacing: 0.6px; margin: 20px 0 12px; }
.menu-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.menu-card { background: white; border-radius: 14px; border: 1.5px solid #E4EAFF; padding: 18px 14px; cursor: pointer; transition: all 0.15s; text-align: center; }
.menu-card:hover { border-color: #1A6BFF; background: #F0F5FF; }
.menu-card.disabled { opacity: 0.4; cursor: not-allowed; }
.menu-card.disabled:hover { border-color: #E4EAFF; background: white; }
.menu-icon { font-size: 32px; margin-bottom: 8px; }
.menu-label { font-size: 13px; font-weight: 800; color: #0D1B3E; }
.menu-desc { font-size: 11px; color: #8A96B5; margin-top: 3px; }
.card { background: white; border-radius: 14px; border: 1.5px solid #E4EAFF; padding: 14px; margin-bottom: 10px; }
.back-row { display: flex; align-items: center; gap: 10px; margin-bottom: 16px; }
.back-btn { background: white; border: 1.5px solid #E4EAFF; border-radius: 10px; padding: 8px 14px; font-size: 13px; font-weight: 700; cursor: pointer; font-family: inherit; color: #4A5880; }
.sec-name { font-size: 17px; font-weight: 900; color: #0D1B3E; }
.shop-img { width: 50px; height: 50px; border-radius: 10px; object-fit: cover; flex-shrink: 0; }
.shop-img-ph { width: 50px; height: 50px; border-radius: 10px; background: #F4F6FB; display: flex; align-items: center; justify-content: center; font-size: 22px; flex-shrink: 0; }
.btn { padding: 7px 13px; border: 1.5px solid; border-radius: 9px; font-size: 12px; font-weight: 800; cursor: pointer; font-family: inherit; }
.btn-approve { background: #E6FAF4; color: #00875A; border-color: #B8E8D4; }
.btn-reject { background: #FFF0F0; color: #E53E3E; border-color: #FFCDD2; }
.btn-action { background: #EBF1FF; color: #1A6BFF; border-color: #C5D5FF; }
.badge { display: inline-block; font-size: 10px; font-weight: 800; padding: 3px 8px; border-radius: 6px; }
.badge-pending { background: #FFF8E6; color: #946200; }
.badge-verified { background: #E6FAF4; color: #00875A; }
.badge-rejected { background: #FFF0F0; color: #E53E3E; }
.dispute-card { border: 1.5px solid #E4EAFF; border-radius: 12px; padding: 14px; margin-bottom: 10px; background: white; }
.order-row { display: flex; align-items: center; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #F4F6FB; }
.order-row:last-child { border-bottom: none; }
.photo-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 8px; }
.ad-card { border: 1.5px solid #E4EAFF; border-radius: 12px; padding: 14px; margin-bottom: 10px; background: white; }
.empty { text-align: center; padding: 48px 20px; color: #B0BACC; }
.empty-icon { font-size: 44px; margin-bottom: 10px; }
.toast { position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%); background: #0D1B3E; color: white; padding: 12px 24px; border-radius: 12px; font-size: 13px; font-weight: 700; z-index: 999; white-space: nowrap; }
.login-wrap { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 24px; background: linear-gradient(160deg,#EBF1FF,#F4F6FB); }
.login-card { background: white; border-radius: 24px; padding: 36px 28px; box-shadow: 0 8px 40px rgba(26,107,255,0.12); border: 1.5px solid #E4EAFF; width: 100%; max-width: 380px; }
.auth-inp { width: 100%; padding: 14px 16px; border: 2px solid #E4EAFF; border-radius: 12px; font-size: 15px; font-family: inherit; outline: none; margin-bottom: 10px; display: block; }
.auth-inp:focus { border-color: #1A6BFF; }
.btn-primary { background: #1A6BFF; color: white; width: 100%; padding: 14px; font-size: 15px; border-radius: 13px; border: none; font-weight: 800; cursor: pointer; font-family: inherit; }
.btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
.stat-row { display: grid; grid-template-columns: repeat(3,1fr); gap: 8px; margin-bottom: 14px; }
.stat-box { background: #F4F6FB; border-radius: 10px; padding: 12px; text-align: center; }
.stat-num { font-size: 20px; font-weight: 900; color: #1A6BFF; }
.stat-label { font-size: 10px; font-weight: 700; color: #8A96B5; margin-top: 2px; }
.btn-row { display: flex; gap: 6px; margin-top: 10px; }
.search-box { display: flex; gap: 8px; margin-bottom: 14px; }
.search-inp { flex: 1; padding: 12px 13px; border: 1.5px solid #E4EAFF; border-radius: 10px; font-size: 15px; font-family: inherit; outline: none; }
.search-inp:focus { border-color: #1A6BFF; }
.search-btn { padding: 12px 16px; background: #1A6BFF; color: white; border: none; border-radius: 10px; font-size: 13px; font-weight: 800; cursor: pointer; font-family: inherit; flex-shrink: 0; }
.search-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.profile-card { background: #EBF1FF; border-radius: 12px; padding: 12px 14px; margin-bottom: 14px; display: flex; align-items: center; gap: 12px; }
.subsec-title { font-size: 11px; font-weight: 800; color: #8A96B5; text-transform: uppercase; letter-spacing: 0.5px; margin: 16px 0 8px; }
`;

const PERM_ICONS = { manage_shops:"🏪", manage_products:"📦", manage_disputes:"⚖️", manage_ads:"📢", view_orders:"📋", manage_riders:"🛵" };
const PERM_LABELS = { manage_shops:"Shops", manage_products:"Products", manage_disputes:"Disputes", manage_ads:"Ads", view_orders:"Orders", manage_riders:"Riders" };

const MENU = [
  { key:"manage_shops",    icon:"🏪", label:"Manage Shops",    desc:"Approve/reject shops",         perm:true },
  { key:"manage_products", icon:"📦", label:"Products",         desc:"Approve product photos",       perm:true },
  { key:"manage_disputes", icon:"⚖️", label:"Disputes",         desc:"Resolve complaints",           perm:true },
  { key:"manage_ads",      icon:"📢", label:"Advertisements",   desc:"Manage city ads",              perm:true },
  { key:"view_orders",     icon:"📋", label:"View Orders",      desc:"City order history",           perm:true },
  { key:"manage_riders",   icon:"🛵", label:"Riders",           desc:"Manage delivery riders",       perm:true },
  { key:"lookup_orders",   icon:"🔍", label:"Order Lookup",     desc:"Search orders by phone number",perm:false },
];

const SEC_TITLES = {
  manage_shops:"🏪 Manage Shops", manage_products:"📦 Product Photos",
  manage_disputes:"⚖️ Disputes", manage_ads:"📢 Advertisements",
  view_orders:"📋 Orders", manage_riders:"🛵 Riders",
  lookup_orders:"🔍 Order Lookup by Phone",
};

export default function SubAdminPortal() {
  // Auth
  const [admin, setAdmin]       = useState(null);
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [logging, setLogging]   = useState(false);
  // Navigation
  const [section, setSection]   = useState(null);
  const [toast, setToast]       = useState("");
  // Section data
  const [shops, setShops]       = useState([]);
  const [photos, setPhotos]     = useState([]);
  const [disputes, setDisputes] = useState([]);
  const [ads, setAds]           = useState([]);
  const [orders, setOrders]     = useState([]);
  const [riders, setRiders]     = useState([]);
  const [dataLoading, setDataLoading] = useState(false);
  // Order lookup
  const [lookupPhone, setLookupPhone]     = useState("");
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupProfile, setLookupProfile] = useState(null);
  const [lookupResults, setLookupResults] = useState(null);

  function showToast(msg: string) { setToast(msg); setTimeout(() => setToast(""), 3000); }

  // Restore session on page load
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("bubbry_sub_admin");
      if (saved) {
        const parsed = JSON.parse(saved);
        // Verify still active via direct Supabase query (RLS allows SELECT)
        supabase.from("sub_admins")
          .select("*").eq("id", parsed.id).eq("is_active", true).single()
          .then(({ data }) => {
            if (data) setAdmin(data);
            else {
              // Fallback to cached if query fails
              setAdmin(parsed);
            }
          }, () => setAdmin(parsed));
      }
    } catch (_) {}
  }, []);

  async function login() {
    if (!email.trim() || !password.trim()) { alert("Enter email and password"); return; }
    setLogging(true);
    try {
      const { data, error } = await supabase
        .from("sub_admins")
        .select("*")
        .eq("email", email.trim().toLowerCase())
        .eq("password_hash", password.trim())
        .eq("is_active", true)
        .single();
      if (error || !data) {
        // If RLS is blocking, try via API route as fallback
        try {
          const res = await fetch("/api/sub-admin-login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: email.trim(), password: password.trim() }),
          });
          const apiData = await res.json();
          if (res.ok && apiData.success && apiData.admin) {
            setAdmin(apiData.admin);
            sessionStorage.setItem("bubbry_sub_admin", JSON.stringify(apiData.admin));
            setLogging(false);
            return;
          }
        } catch(_) {}
        alert("Invalid email or password. Make sure your account is active.");
        setLogging(false);
        return;
      }
      setAdmin(data);
      sessionStorage.setItem("bubbry_sub_admin", JSON.stringify(data));
    } catch (e: any) {
      alert("Error: " + e.message);
    }
    setLogging(false);
  }

  function logout() {
    sessionStorage.removeItem("bubbry_sub_admin");
    setAdmin(null); setSection(null); setEmail(""); setPassword("");
  }

  function hasPerm(key) { return admin?.permissions?.includes(key); }

  // Filter shops by city — using city column (added via our signup fix)
  function filterByCity(rows, cityCol) {
    if (!admin?.city) return rows;
    return (rows || []).filter(r => {
      const c = (r[cityCol] || "").toLowerCase().trim();
      return c === admin.city.toLowerCase().trim() || c === "";
    });
  }

  async function loadSection(key) {
    setSection(key);
    if (key === "lookup_orders") return; // no auto-load for lookup
    setDataLoading(true);
    try {
      if (key === "manage_shops") {
        // Shops with city column (saved during signup)
        const { data } = await supabase.from("profiles")
          .select("id,name,shop_name,shopfront_image,shopfront_verified,shopfront_rejected,is_live,phone,city,state")
          .eq("role","shopkeeper").order("created_at",{ascending:false});
        // Filter by city — exact match or show all if city not set
        const cityShops = (data||[]).filter(s => {
          if (!admin.city) return true;
          const sc = (s.city||"").toLowerCase().trim();
          const ac = admin.city.toLowerCase().trim();
          return sc === ac || sc === "";
        });
        setShops(cityShops);
      }
      else if (key === "manage_products") {
        const { data } = await supabase.from("master_products")
          .select("id,name,category,pending_image_url,image_url")
          .not("pending_image_url","is",null).order("created_at",{ascending:false});
        setPhotos(data||[]);
      }
      else if (key === "manage_disputes") {
        const { data: shopData } = await supabase.from("profiles")
          .select("id,city,state").eq("role","shopkeeper");
        const cityShopIds = (shopData||[]).filter(s => {
          if (!admin.city) return true;
          return (s.city||"").toLowerCase().trim() === admin.city.toLowerCase().trim();
        }).map(s => s.id);
        if (cityShopIds.length > 0) {
          const { data: orderData } = await supabase.from("orders").select("id").in("shop_id", cityShopIds);
          const orderIds = (orderData||[]).map(o => o.id);
          if (orderIds.length > 0) {
            const { data } = await supabase.from("disputes")
              .select("*").in("order_id", orderIds).eq("status","open").order("created_at",{ascending:false});
            setDisputes(data||[]);
          } else setDisputes([]);
        } else setDisputes([]);
      }
      else if (key === "manage_ads") {
        const { data: shopData } = await supabase.from("profiles").select("id,shop_name,city").eq("role","shopkeeper");
        const cityShops = (shopData||[]).filter(s => !admin.city || (s.city||"").toLowerCase().trim() === admin.city.toLowerCase().trim());
        const cityShopIds = cityShops.map(s => s.id);
        const shopNameMap = {};
        cityShops.forEach(s => { shopNameMap[s.id] = s.shop_name; });
        if (cityShopIds.length > 0) {
          const { data } = await supabase.from("ads").select("*").in("shop_id", cityShopIds).order("created_at",{ascending:false});
          setAds((data||[]).map(a => ({...a, shop_name: shopNameMap[a.shop_id]||"Shop"})));
        } else setAds([]);
      }
      else if (key === "view_orders") {
        const { data: shopData } = await supabase.from("profiles").select("id,shop_name,city").eq("role","shopkeeper");
        const cityShops = (shopData||[]).filter(s => !admin.city || (s.city||"").toLowerCase().trim() === admin.city.toLowerCase().trim());
        const cityShopIds = cityShops.map(s => s.id);
        const shopNameMap = {};
        cityShops.forEach(s => { shopNameMap[s.id] = s.shop_name; });
        if (cityShopIds.length > 0) {
          const { data } = await supabase.from("orders")
            .select("id,status,order_type,amount_paid,created_at,shop_id")
            .in("shop_id", cityShopIds).order("created_at",{ascending:false}).limit(100);
          setOrders((data||[]).map(o => ({...o, shop_name: shopNameMap[o.shop_id]||"Shop"})));
        } else setOrders([]);
      }
      else if (key === "manage_riders") {
        const { data: shopData } = await supabase.from("profiles").select("id,city").eq("role","shopkeeper");
        const cityShopIds = (shopData||[]).filter(s => !admin.city || (s.city||"").toLowerCase().trim() === admin.city.toLowerCase().trim()).map(s => s.id);
        if (cityShopIds.length > 0) {
          const { data } = await supabase.from("riders").select("id,name,phone,active,shop_id").in("shop_id", cityShopIds).order("created_at",{ascending:false});
          setRiders(data||[]);
        } else {
          const { data } = await supabase.from("riders").select("id,name,phone,active,shop_id");
          setRiders(data||[]);
        }
      }
    } catch(e) { showToast("Error: " + e.message); }
    setDataLoading(false);
  }

  // Build grouped orders exactly like shop-orders page does
  async function buildGroupedOrders(ordersData) {
    if (!ordersData || ordersData.length === 0) return [];
    const productIds = [...new Set(ordersData.map(o => o.product_id).filter(Boolean))];
    const { data: spData } = productIds.length > 0
      ? await supabase.from("shop_products").select("product_id, shop_id, name, price").in("product_id", productIds)
      : { data: [] };
    const spMap = {};
    (spData||[]).forEach(sp => { spMap[sp.product_id+"_"+sp.shop_id] = sp; });

    const STATUS_ORDER = ["pending","ready","out_for_delivery","completed"];
    const groupMap = {};
    for (const order of ordersData) {
      const key = order.group_id || order.id;
      const sp = order.product_id ? (spMap[order.product_id+"_"+order.shop_id]||{}) : {};
      const isLoose = !order.product_id && order.loose_product_name;
      const productName = isLoose ? `${order.loose_product_name} (${order.loose_qty||""}${order.loose_unit||"kg"})` : (sp.name||"Product");
      const itemPrice = isLoose ? ((order.amount_paid||0)+(order.amount_cash||0)) : (sp.price||0);

      if (!groupMap[key]) {
        groupMap[key] = {
          group_id:key, id:order.id, shop_id:order.shop_id,
          order_type:order.order_type, delivery_address:order.delivery_address,
          status:order.status||"pending", created_at:order.created_at,
          handoff_photo:order.handoff_photo, product_photo:order.product_photo,
          delivery_otp:order.delivery_otp, payment_proof:order.payment_proof,
          payment_method:order.payment_method,
          amount_paid:order.amount_paid||0, amount_cash:order.amount_cash||0,
          cancellation_reason:order.cancellation_reason||null,
          cancelled_by:order.cancelled_by||null,
          customer_id:order.customer_id||null, rider_id:order.rider_id||null,
          items:[], total:0, all_ids:[],
        };
      }
      groupMap[key].items.push({ id:order.id, product_name:productName, quantity:order.quantity||1, price:itemPrice, is_loose:isLoose });
      groupMap[key].total += isLoose ? itemPrice : itemPrice*(order.quantity||1);
      groupMap[key].all_ids.push(order.id);
      if (order.handoff_photo) groupMap[key].handoff_photo = order.handoff_photo;
      if (order.product_photo) groupMap[key].product_photo = order.product_photo;
      const ci = STATUS_ORDER.indexOf(groupMap[key].status);
      const ni = STATUS_ORDER.indexOf(order.status);
      if (ni > ci) groupMap[key].status = order.status;
    }
    // Fetch shop names
    const shopIds = [...new Set(Object.values(groupMap).map((g: any) => g.shop_id).filter(Boolean))];
    const { data: shopProfiles } = shopIds.length > 0
      ? await supabase.from("profiles").select("id,shop_name,name").in("id", shopIds)
      : { data: [] };
    const shopNameMap: any = {};
    (shopProfiles||[]).forEach((s: any) => { shopNameMap[s.id] = s.shop_name||s.name; });

    return Object.values(groupMap).map((g: any) => ({
      ...g,
      shop_name: shopNameMap[g.shop_id]||"Shop",
    })).sort((a: any, b: any) => new Date(b.created_at).getTime()-new Date(a.created_at).getTime());
  }

  // Order lookup by phone
  async function lookupByPhone() {
    const digits = lookupPhone.replace(/\D/g, "");
    if (digits.length < 10) { alert("Enter a valid 10-digit phone number"); return; }
    const fullPhone = "+91" + digits.slice(-10);
    setLookupLoading(true);
    setLookupProfile(null);
    setLookupResults(null);
    try {
      const { data: profiles } = await supabase.from("profiles")
        .select("id,name,shop_name,role,phone").eq("phone", fullPhone);
      if (!profiles || profiles.length === 0) {
        alert("No account found with this number");
        setLookupLoading(false);
        return;
      }
      setLookupProfile(profiles);
      const profileIds = profiles.map(p => p.id);
      const SELECT = "id,group_id,quantity,customer_id,order_type,delivery_address,status,created_at,product_id,shop_id,handoff_photo,product_photo,payment_proof,payment_method,amount_paid,amount_cash,delivery_otp,cancellation_reason,cancelled_by,rider_id,loose_product_name,loose_unit,loose_qty";
      const [custRes, shopRes] = await Promise.all([
        supabase.from("orders").select(SELECT).in("customer_id", profileIds).order("created_at",{ascending:false}).limit(100),
        supabase.from("orders").select(SELECT).in("shop_id", profileIds).order("created_at",{ascending:false}).limit(100),
      ]);
      const [custGrouped, shopGrouped] = await Promise.all([
        buildGroupedOrders(custRes.data),
        buildGroupedOrders(shopRes.data),
      ]);
      setLookupResults({ customerOrders: custGrouped, shopOrders: shopGrouped });
    } catch(e) { alert("Error: " + e.message); }
    setLookupLoading(false);
  }

  // Actions
  async function shopAction(id, action) {
    // Use server-side API route to bypass RLS — anon client can't update profiles
    try {
      const res = await fetch("/api/admin-shop-action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shop_id: id,
          action,
          admin_email: admin.email,
          admin_password: admin.password_hash,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        alert("Error: " + (data.error || "Failed to update shop"));
        return;
      }
      if (action === "approve") {
        setShops(prev => prev.map(s => s.id === id ? {...s, shopfront_verified: true, shopfront_rejected: false} : s));
        showToast("✓ Shopfront approved — shopkeeper can now go live");
      } else {
        setShops(prev => prev.map(s => s.id === id ? {...s, shopfront_verified: false, shopfront_rejected: true, is_live: false} : s));
        showToast("Shop rejected");
      }
    } catch(e) {
      alert("Network error: " + e.message);
    }
  }
  async function approveShop(id) { await shopAction(id, "approve"); }
  async function rejectShop(id) { await shopAction(id, "reject"); }
  async function approvePhoto(p) {
    const { error } = await supabase.from("master_products").update({image_url:p.pending_image_url,pending_image_url:null}).eq("id",p.id);
    if (error) { alert("Error: " + error.message); return; }
    setPhotos(prev => prev.filter(x => x.id !== p.id));
    showToast("✓ Photo approved");
  }
  async function rejectPhoto(p) {
    const { error } = await supabase.from("master_products").update({pending_image_url:null}).eq("id",p.id);
    if (error) { alert("Error: " + error.message); return; }
    setPhotos(prev => prev.filter(x => x.id !== p.id));
    showToast("Photo rejected");
  }
  async function resolveDispute(d, outcome) {
    const { error } = await supabase.from("disputes").update({status:"resolved",outcome,resolved_by:admin.name,resolved_at:new Date().toISOString()}).eq("id",d.id);
    if (error) { alert("Error: " + error.message); return; }
    setDisputes(prev => prev.filter(x => x.id !== d.id));
    showToast("Dispute resolved");
  }
  async function approveAd(ad) {
    // Approve only marks it approved_unpaid — shop must then pay for it to go live.
    const { error } = await supabase.from("ads").update({
      status: "approved_unpaid",
      approved_at: new Date().toISOString(),
      approved_by: admin?.name || admin?.email || "sub-admin",
    }).eq("id", ad.id);
    if (error) { alert("Error: " + error.message); return; }
    setAds(prev => prev.map(a => a.id === ad.id ? {...a, status: "approved_unpaid"} : a));
    showToast("✓ Ad approved — shop can now pay to publish");
  }
  async function rejectAd(ad) {
    const reason = prompt("Reason for rejecting this ad (shown to the shopkeeper):", "");
    if (reason === null) return; // cancelled
    const { error } = await supabase.from("ads").update({
      status: "rejected",
      active: false,
      rejected_reason: reason || "Not approved",
    }).eq("id", ad.id);
    if (error) { alert("Error: " + error.message); return; }
    setAds(prev => prev.map(a => a.id === ad.id ? {...a, status: "rejected", rejected_reason: reason || "Not approved"} : a));
    showToast("Ad rejected");
  }
  async function toggleRider(r) {
    const { error } = await supabase.from("riders").update({active:!r.active}).eq("id",r.id);
    if (error) { alert("Error: " + error.message); return; }
    setRiders(prev => prev.map(x => x.id === r.id ? {...x, active: !r.active} : x));
    showToast(r.active?"Rider deactivated":"Rider activated");
  }

  function statusStyle(status) {
    if (status==="completed") return {background:"#E6FAF4",color:"#00875A"};
    if (status==="pending") return {background:"#FFF8E6",color:"#946200"};
    if (status==="ready") return {background:"#EBF1FF",color:"#1A6BFF"};
    if (status==="out_for_delivery") return {background:"#FFF8E6",color:"#946200"};
    return {background:"#FFF0F0",color:"#E53E3E"};
  }
  function statusLabel(status) {
    if (status==="out_for_delivery") return "Out for Delivery";
    if (status==="completed") return "Completed";
    if (status==="pending") return "Pending";
    if (status==="ready") return "Ready";
    return status||"Unknown";
  }

  function renderOrderCard(order, isShopView) {
    const total = order.amount_paid||0;
    const cash = order.amount_cash||0;
    return (
      <div key={order.group_id} style={{background:"white",borderRadius:16,border:"1.5px solid #E4EAFF",marginBottom:12,overflow:"hidden",boxShadow:"0 2px 10px rgba(26,107,255,0.06)"}}>
        {/* Header */}
        <div style={{padding:"12px 16px",borderBottom:"1px solid #F4F6FB",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div>
            <div style={{fontSize:12,color:"#8A96B5",fontWeight:700,fontFamily:"monospace"}}>#{order.id.slice(0,8).toUpperCase()}</div>
            <div style={{fontSize:11,color:"#B0BACC",marginTop:2}}>{new Date(order.created_at).toLocaleString("en-IN",{day:"numeric",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"})}</div>
          </div>
          <span style={{...statusStyle(order.status),padding:"4px 12px",borderRadius:20,fontSize:12,fontWeight:700}}>{statusLabel(order.status)}</span>
        </div>

        {/* Body */}
        <div style={{padding:"14px 16px"}}>
          {/* Shop / order type */}
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
            <span style={{background:order.order_type==="delivery"?"#FFF8E6":"#EBF1FF",color:order.order_type==="delivery"?"#946200":"#1A6BFF",padding:"3px 10px",borderRadius:20,fontSize:12,fontWeight:700}}>
              {order.order_type==="delivery"?"🛵 Delivery":"🏪 Pickup"}
            </span>
            {isShopView && order.shop_name && <span style={{fontSize:12,color:"#8A96B5",fontWeight:600}}>Shop: {order.shop_name}</span>}
            {!isShopView && order.shop_name && <span style={{fontSize:12,color:"#8A96B5",fontWeight:600}}>From: {order.shop_name}</span>}
          </div>

          {/* Products */}
          {(order.items||[]).map((item,i) => (
            <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
              <div style={{fontSize:14,fontWeight:700,color:"#0D1B3E"}}>{item.product_name}</div>
              <div style={{fontSize:13,color:"#4A5880",fontWeight:600,flexShrink:0,marginLeft:8}}>
                {item.is_loose ? `Rs.${item.price}` : `x${item.quantity} · Rs.${item.price}`}
              </div>
            </div>
          ))}

          {/* Total */}
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:10,paddingTop:10,borderTop:"1px dashed #E4EAFF"}}>
            <div style={{fontSize:13,color:"#8A96B5",fontWeight:600}}>
              {order.payment_method==="cod"?"💵 Cash on Delivery":order.payment_method==="upi"?"💳 UPI":"Payment"}
            </div>
            <div style={{fontSize:16,fontWeight:900,color:"#1A6BFF"}}>Rs.{total+cash}</div>
          </div>

          {/* Delivery address */}
          {order.order_type==="delivery" && order.delivery_address && (
            <div style={{background:"#F4F6FB",borderRadius:10,padding:"9px 12px",marginTop:10,fontSize:12,color:"#4A5880",fontWeight:500}}>
              📍 {order.delivery_address}
            </div>
          )}

          {/* Cancellation */}
          {order.cancellation_reason && (
            <div style={{background:"#FFF0F0",borderRadius:10,padding:"9px 12px",marginTop:10,fontSize:12,color:"#E53E3E",fontWeight:600}}>
              ✗ Cancelled: {order.cancellation_reason}
              {order.cancelled_by && <span style={{color:"#8A96B5"}}> by {order.cancelled_by}</span>}
            </div>
          )}

          {/* Proof photos */}
          {(order.handoff_photo || order.product_photo) && (
            <div style={{display:"flex",gap:8,marginTop:10}}>
              {order.handoff_photo && (
                <a href={order.handoff_photo} target="_blank" rel="noreferrer">
                  <img src={order.handoff_photo} style={{width:70,height:70,objectFit:"cover",borderRadius:10,display:"block"}} alt="Handoff"/>
                </a>
              )}
              {order.product_photo && (
                <a href={order.product_photo} target="_blank" rel="noreferrer">
                  <img src={order.product_photo} style={{width:70,height:70,objectFit:"cover",borderRadius:10,display:"block"}} alt="Product"/>
                </a>
              )}
              <div style={{fontSize:11,color:"#8A96B5",fontWeight:600,alignSelf:"center"}}>📸 Delivery proof</div>
            </div>
          )}

          {/* Payment proof */}
          {order.payment_proof && (
            <div style={{marginTop:10}}>
              <div style={{fontSize:11,color:"#8A96B5",fontWeight:700,marginBottom:4}}>PAYMENT SCREENSHOT</div>
              <a href={order.payment_proof} target="_blank" rel="noreferrer">
                <img src={order.payment_proof} style={{width:"100%",maxHeight:140,objectFit:"cover",borderRadius:10}} alt="Payment proof"/>
              </a>
            </div>
          )}
        </div>
      </div>
    );
  }

  function renderSection() {
    if (dataLoading) return <div style={{textAlign:"center",padding:48,color:"#8A96B5",fontWeight:600}}>Loading data for {admin.city}...</div>;

    if (section === "manage_shops") {
      const pending = shops.filter(s=>!s.shopfront_verified&&!s.shopfront_rejected);
      const verified = shops.filter(s=>s.shopfront_verified);
      const rejected = shops.filter(s=>s.shopfront_rejected);
      return (<>
        <div className="stat-row">
          <div className="stat-box"><div className="stat-num" style={{color:"#946200"}}>{pending.length}</div><div className="stat-label">Pending</div></div>
          <div className="stat-box"><div className="stat-num" style={{color:"#00B37E"}}>{verified.length}</div><div className="stat-label">Verified</div></div>
          <div className="stat-box"><div className="stat-num" style={{color:"#E53E3E"}}>{rejected.length}</div><div className="stat-label">Rejected</div></div>
        </div>
        {shops.length===0 ? <div className="empty"><div className="empty-icon">🏪</div><div style={{fontWeight:700}}>No shops in {admin.city}</div><div style={{fontSize:12,marginTop:6}}>Shops must select {admin.city} as their city during signup</div></div>
        : shops.map(s=>(
          <div key={s.id} className="card">
            <div style={{display:"flex",gap:12,alignItems:"flex-start"}}>
              {s.shopfront_image?<img src={s.shopfront_image} className="shop-img" alt=""/>:<div className="shop-img-ph">🏪</div>}
              <div style={{flex:1}}>
                <div style={{fontSize:14,fontWeight:800,color:"#0D1B3E"}}>{s.shop_name||s.name}</div>
                <div style={{fontSize:12,color:"#8A96B5",marginTop:2}}>{s.phone}</div>
                <div style={{fontSize:11,color:"#B0BACC",marginTop:2}}>{s.city}{s.state?", "+s.state:""}</div>
                <div style={{marginTop:6}}>
                  {s.shopfront_verified&&<span className="badge badge-verified">✓ Verified</span>}
                  {s.shopfront_rejected&&<span className="badge badge-rejected">✗ Rejected</span>}
                  {!s.shopfront_verified&&!s.shopfront_rejected&&<span className="badge badge-pending">⏳ Pending</span>}
                </div>
              </div>
            </div>
            <div className="btn-row">
              {!s.shopfront_verified&&<button className="btn btn-approve" onClick={()=>approveShop(s.id)}>✓ Approve</button>}
              {!s.shopfront_rejected&&<button className="btn btn-reject" onClick={()=>rejectShop(s.id)}>✗ Reject</button>}
            </div>
          </div>
        ))}
      </>);
    }

    if (section === "manage_products") {
      return photos.length===0 ? <div className="empty"><div className="empty-icon">📸</div>No pending photo approvals</div>
      : <div className="photo-grid">
          {photos.map(p=>(<div key={p.id}>
            <img src={p.pending_image_url} alt={p.name} onClick={()=>window.open(p.pending_image_url,"_blank")} style={{width:"100%",aspectRatio:"1",objectFit:"cover",borderRadius:10,display:"block",cursor:"pointer"}}/>
            <div style={{fontSize:10,fontWeight:700,color:"#0D1B3E",marginTop:4,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.name}</div>
            <div className="btn-row">
              <button className="btn btn-approve" style={{flex:1,padding:"5px 4px",fontSize:10}} onClick={()=>approvePhoto(p)}>✓</button>
              <button className="btn btn-reject" style={{flex:1,padding:"5px 4px",fontSize:10}} onClick={()=>rejectPhoto(p)}>✗</button>
            </div>
          </div>))}
        </div>;
    }

    if (section === "manage_disputes") {
      return disputes.length===0 ? <div className="empty"><div className="empty-icon">⚖️</div>No open disputes in {admin.city}</div>
      : disputes.map(d=>(
        <div key={d.id} className="dispute-card">
          <div style={{fontSize:11,fontWeight:800,color:"#946200",background:"#FFF8E6",padding:"3px 9px",borderRadius:6,display:"inline-block",marginBottom:8}}>{d.type||"Dispute"}</div>
          <div style={{fontSize:14,fontWeight:700,color:"#0D1B3E",marginBottom:6}}>{d.description||d.reason||"No description"}</div>
          <div style={{fontSize:12,color:"#8A96B5",marginBottom:10}}>Order #{(d.order_id||"").slice(0,8).toUpperCase()} · {new Date(d.created_at).toLocaleDateString("en-IN")}</div>
          <div className="btn-row">
            <button className="btn btn-approve" onClick={()=>resolveDispute(d,"customer_wins")}>👤 Customer Wins</button>
            <button className="btn btn-reject" onClick={()=>resolveDispute(d,"shop_wins")}>🏪 Shop Wins</button>
            <button className="btn btn-action" onClick={()=>resolveDispute(d,"dismissed")}>Dismiss</button>
          </div>
        </div>
      ));
    }

    if (section === "manage_ads") {
      const statusInfo = (ad) => {
        switch (ad.status) {
          case "pending_approval": return { t:"⏳ Awaiting review", bg:"#FFF8E6", c:"#946200" };
          case "approved_unpaid":  return { t:"✓ Approved — awaiting payment", bg:"#EBF1FF", c:"#1A6BFF" };
          case "active":           return { t:"🟢 Live", bg:"#E6FAF4", c:"#00875A" };
          case "rejected":         return { t:"✗ Rejected", bg:"#FFF0F0", c:"#E53E3E" };
          default:                 return { t: ad.status||"—", bg:"#F4F6FB", c:"#8A96B5" };
        }
      };
      // Pending first
      const sorted = [...ads].sort((a,b) => (a.status==="pending_approval"?-1:1) - (b.status==="pending_approval"?-1:1));
      return ads.length===0 ? <div className="empty"><div className="empty-icon">📢</div>No ads for {admin.city}</div>
      : sorted.map(ad=>{
        const si = statusInfo(ad);
        return (
        <div key={ad.id} className="ad-card">
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8,gap:10}}>
            <div>
              <div style={{fontSize:14,fontWeight:800,color:"#0D1B3E"}}>{ad.shop_name}</div>
              <div style={{fontSize:12,color:"#8A96B5",fontWeight:600}}>{(ad.slot||"").replace(/_/g," ")} · ₹{ad.price||(ad.slot==="hero_banner"?999:699)}</div>
            </div>
            <span style={{fontSize:11,fontWeight:800,padding:"3px 9px",borderRadius:6,background:si.bg,color:si.c,whiteSpace:"nowrap"}}>{si.t}</span>
          </div>
          {/* Ad content preview */}
          <div style={{borderRadius:10,padding:"14px 16px",color:"white",position:"relative",overflow:"hidden",marginBottom:10,background:ad.bg_color||"#1A6BFF",minHeight:70}}>
            <div style={{fontSize:15,fontWeight:900,marginBottom:3}}>{ad.title}</div>
            {ad.subtitle&&<div style={{fontSize:12,opacity:0.92,fontWeight:500}}>{ad.subtitle}</div>}
            {ad.cta&&<div style={{display:"inline-block",marginTop:8,background:"rgba(255,255,255,0.22)",padding:"4px 12px",borderRadius:7,fontSize:11,fontWeight:800}}>{ad.cta}</div>}
            <div style={{position:"absolute",right:12,bottom:8,fontSize:32,opacity:0.85}}>{ad.emoji}</div>
          </div>
          {ad.status==="pending_approval" && (
            <div style={{display:"flex",gap:8}}>
              <button className="btn btn-approve" style={{flex:1}} onClick={()=>approveAd(ad)}>✓ Approve</button>
              <button className="btn btn-reject" style={{flex:1}} onClick={()=>rejectAd(ad)}>✗ Reject</button>
            </div>
          )}
          {ad.status==="rejected" && ad.rejected_reason && (
            <div style={{fontSize:12,color:"#E53E3E",fontWeight:600,background:"#FFF0F0",borderRadius:8,padding:"8px 10px"}}>Reason: {ad.rejected_reason}</div>
          )}
        </div>
        );
      });
    }

    if (section === "view_orders") {
      const bs = {pending:orders.filter(o=>o.status==="pending").length,completed:orders.filter(o=>o.status==="completed").length,cancelled:orders.filter(o=>["cancelled","cancelled_by_shop","cancelled_by_customer"].includes(o.status)).length};
      return (<>
        <div className="stat-row">
          <div className="stat-box"><div className="stat-num" style={{color:"#946200"}}>{bs.pending}</div><div className="stat-label">Pending</div></div>
          <div className="stat-box"><div className="stat-num" style={{color:"#00B37E"}}>{bs.completed}</div><div className="stat-label">Completed</div></div>
          <div className="stat-box"><div className="stat-num" style={{color:"#E53E3E"}}>{bs.cancelled}</div><div className="stat-label">Cancelled</div></div>
        </div>
        {orders.length===0 ? <div className="empty"><div className="empty-icon">📋</div>No orders in {admin.city}</div>
        : <div className="card" style={{padding:"0 14px"}}>{orders.map(o=>(
            <div key={o.id} className="order-row">
              <div><div style={{fontSize:13,fontWeight:800,color:"#0D1B3E"}}>#{o.id.slice(0,8).toUpperCase()}</div><div style={{fontSize:11,color:"#8A96B5"}}>{o.shop_name} · {o.order_type}</div></div>
              <div style={{textAlign:"right"}}>
                <div style={{fontSize:13,fontWeight:800,color:"#1A6BFF"}}>Rs.{o.amount_paid||0}</div>
                <span style={{fontSize:10,fontWeight:800,padding:"2px 7px",borderRadius:5,display:"inline-block",background:o.status==="completed"?"#E6FAF4":o.status==="pending"?"#FFF8E6":"#FFF0F0",color:o.status==="completed"?"#00875A":o.status==="pending"?"#946200":"#E53E3E"}}>{o.status}</span>
              </div>
            </div>
          ))}</div>}
      </>);
    }

    if (section === "manage_riders") {
      return riders.length===0 ? <div className="empty"><div className="empty-icon">🛵</div>No riders in {admin.city}</div>
      : riders.map(r=>(
        <div key={r.id} className="card" style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div><div style={{fontSize:14,fontWeight:800,color:"#0D1B3E"}}>{r.name}</div><div style={{fontSize:12,color:"#8A96B5"}}>{r.phone}</div><div style={{fontSize:11,fontWeight:700,marginTop:3,color:r.active?"#00B37E":"#B0BACC"}}>{r.active?"● Active":"● Inactive"}</div></div>
          <button className="btn" style={{background:r.active?"#FFF0F0":"#E6FAF4",color:r.active?"#E53E3E":"#00875A",borderColor:r.active?"#FFCDD2":"#B8E8D4"}} onClick={()=>toggleRider(r)}>{r.active?"Deactivate":"Activate"}</button>
        </div>
      ));
    }

    if (section === "lookup_orders") {
      return (
        <div>
          <div className="card">
            <div style={{fontSize:11,fontWeight:700,color:"#8A96B5",textTransform:"uppercase",letterSpacing:"0.5px",marginBottom:8}}>Search by Phone Number</div>
            <div className="search-box">
              <input className="search-inp" type="tel" placeholder="10-digit mobile number" maxLength={10}
                value={lookupPhone} onChange={e=>setLookupPhone(e.target.value.replace(/\D/g,""))}
                onKeyDown={e=>{if(e.key==="Enter")lookupByPhone();}}/>
              <button className="search-btn" onClick={lookupByPhone} disabled={lookupLoading}>{lookupLoading?"...":"🔍 Search"}</button>
            </div>
            <div style={{fontSize:12,color:"#B0BACC",fontWeight:500}}>Works for both customers and shopkeepers</div>
          </div>

          {lookupProfile && (<>
            <div className="subsec-title">Account Found</div>
            {lookupProfile.map(p=>(
              <div key={p.id} className="profile-card">
                <div style={{fontSize:28}}>{p.role==="shopkeeper"?"🏪":p.role==="rider"?"🛵":"👤"}</div>
                <div>
                  <div style={{fontSize:14,fontWeight:800,color:"#0D1B3E"}}>{p.shop_name||p.name}</div>
                  <div style={{fontSize:12,color:"#4A5880"}}>{p.phone} · <span style={{fontWeight:800,color:"#1A6BFF",textTransform:"capitalize"}}>{p.role}</span></div>
                </div>
              </div>
            ))}

            {lookupResults && (<>
              {lookupResults.customerOrders.length > 0 && (<>
                <div className="subsec-title">Orders Placed as Customer ({lookupResults.customerOrders.length})</div>
                {lookupResults.customerOrders.map(o => renderOrderCard(o, false))}
              </>)}
              {lookupResults.shopOrders.length > 0 && (<>
                <div className="subsec-title">Orders Received by Shop ({lookupResults.shopOrders.length})</div>
                {lookupResults.shopOrders.map(o => renderOrderCard(o, true))}
              </>)}
              {lookupResults.customerOrders.length===0 && lookupResults.shopOrders.length===0 && (
                <div className="empty"><div className="empty-icon">📋</div>No orders found for this number</div>
              )}
            </>)}
          </>)}
        </div>
      );
    }

    return null;
  }

  // Login screen
  if (!admin) {
    return (
      <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif"}}>
        <style>{CSS}</style>
        <div className="login-wrap">
          <div className="login-card">
            <div style={{textAlign:"center",marginBottom:24}}>
              <div style={{fontSize:48,marginBottom:8}}>🫧</div>
              <div style={{fontSize:22,fontWeight:900,color:"#0D1B3E"}}>Bubbry Sub-Admin</div>
              <div style={{fontSize:13,color:"#8A96B5",marginTop:4}}>City Management Portal</div>
            </div>
            <input className="auth-inp" type="email" placeholder="Your email address" value={email} onChange={e=>setEmail(e.target.value)}/>
            <input className="auth-inp" type="password" placeholder="Your password" value={password}
              onChange={e=>setPassword(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")login();}}/>
            <button className="btn-primary" onClick={login} disabled={logging}>{logging?"Logging in...":"Login →"}</button>
          </div>
        </div>
      </div>
    );
  }

  // Main portal
  return (
    <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",minHeight:"100vh",background:"#F4F6FB"}}>
      <style>{CSS}</style>
      <div className="header">
        <div className="header-row">
          <div><div className="header-title">🫧 Bubbry Sub-Admin</div><div className="header-sub">{admin.city}, {admin.state}</div></div>
          <button className="logout-btn" onClick={logout}>Logout</button>
        </div>
      </div>
      <div className="page">
        {!section ? (<>
          <div className="welcome-card">
            <div className="welcome-name">👋 Hello, {admin.name.split(" ")[0]}!</div>
            <div className="welcome-loc">Managing: {admin.city}, {admin.state}</div>
            <div className="perm-pills">
              {(admin.permissions||[]).map(p=>(
                <span key={p} className="perm-pill">{PERM_ICONS[p]||""} {PERM_LABELS[p]||p}</span>
              ))}
              <span className="perm-pill">🔍 Order Lookup</span>
            </div>
          </div>
          {admin.notes&&<div className="card" style={{background:"#FFF8E6",border:"1.5px solid #FFD88A",marginBottom:16}}><div style={{fontSize:12,color:"#946200",fontWeight:700}}>📝 Admin Notes</div><div style={{fontSize:13,color:"#0D1B3E",marginTop:6}}>{admin.notes}</div></div>}
          <div className="sec-title">Your Dashboard</div>
          <div className="menu-grid">
            {MENU.map(item=>{
              const allowed = !item.perm || hasPerm(item.key);
              return (
                <div key={item.key} className={"menu-card"+(allowed?"":" disabled")} onClick={()=>{if(allowed)loadSection(item.key);}}>
                  <div className="menu-icon">{item.icon}</div>
                  <div className="menu-label">{item.label}</div>
                  <div className="menu-desc">{allowed?item.desc:"No permission"}</div>
                </div>
              );
            })}
          </div>
        </>) : (<>
          <div className="back-row">
            <button className="back-btn" onClick={()=>setSection(null)}>← Back</button>
            <div className="sec-name">{SEC_TITLES[section]}</div>
          </div>
          {renderSection()}
        </>)}
      </div>
      {toast&&<div className="toast">{toast}</div>}
    </div>
  );
}
