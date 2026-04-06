"use client";
import { useEffect, useRef, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
const ADMIN_PASSWORD = "bubbry-admin-2024";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Plus Jakarta Sans', sans-serif; }
#admin-map { position: fixed; inset: 0; z-index: 1; }
.top-bar { position: fixed; top: 0; left: 0; right: 0; z-index: 1000; background: #0D1B3E; padding: 14px 16px; display: flex; align-items: center; gap: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.3); }
.back-btn { width: 36px; height: 36px; background: rgba(255,255,255,0.15); border: none; border-radius: 10px; color: white; font-size: 18px; cursor: pointer; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.top-title { font-size: 16px; font-weight: 900; color: white; flex: 1; }
.count-badge { background: #1A6BFF; color: white; font-size: 11px; font-weight: 800; padding: 4px 10px; border-radius: 20px; flex-shrink: 0; }
.panel { position: fixed; bottom: 0; left: 0; right: 0; z-index: 1000; background: white; border-radius: 20px 20px 0 0; box-shadow: 0 -8px 32px rgba(0,0,0,0.15); max-height: 55vh; display: flex; flex-direction: column; }
.panel-handle { width: 40px; height: 4px; background: #E4EAFF; border-radius: 2px; margin: 14px auto 10px; flex-shrink: 0; }
.panel-list { overflow-y: auto; padding: 0 16px 32px; }
.shop-row { display: flex; align-items: center; gap: 12px; padding: 12px 0; border-bottom: 1px solid #F4F6FB; cursor: pointer; transition: background 0.1s; }
.shop-row:hover { background: #F8FAFF; margin: 0 -16px; padding: 12px 16px; }
.shop-row:last-child { border-bottom: none; }
.shop-dot { width: 12px; height: 12px; border-radius: 50%; flex-shrink: 0; }
.dot-live { background: #00B37E; }
.dot-offline { background: #B0BACC; }
.dot-unverified { background: #FFB800; }
.shop-info { flex: 1; }
.shop-name { font-size: 14px; font-weight: 800; color: #0D1B3E; }
.shop-meta { font-size: 11px; color: #8A96B5; font-weight: 600; margin-top: 2px; }
.shop-status { font-size: 10px; font-weight: 800; padding: 3px 8px; border-radius: 6px; flex-shrink: 0; }
.status-live { background: #E6FAF4; color: #00875A; }
.status-offline { background: #F4F6FB; color: #8A96B5; }
.status-unverified { background: #FFF8E6; color: #946200; }
.center-btn { position: fixed; bottom: 48vh; right: 16px; z-index: 1000; width: 46px; height: 46px; background: white; border-radius: 50%; border: none; font-size: 18px; box-shadow: 0 4px 14px rgba(0,0,0,0.15); cursor: pointer; display: flex; align-items: center; justify-content: center; }
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 2000; display: flex; align-items: center; justify-content: center; padding: 20px; }
.modal-box { background: white; border-radius: 16px; padding: 20px; width: 100%; max-width: 360px; }
.modal-title { font-size: 16px; font-weight: 900; color: #0D1B3E; margin-bottom: 4px; }
.modal-sub { font-size: 12px; color: #8A96B5; font-weight: 500; margin-bottom: 16px; }
.modal-inp { width: 100%; padding: 10px 12px; border: 1.5px solid #E4EAFF; border-radius: 8px; font-size: 14px; font-family: inherit; outline: none; margin-bottom: 10px; box-sizing: border-box; }
.modal-inp:focus { border-color: #1A6BFF; }
.modal-hint { font-size: 11px; color: #8A96B5; margin-bottom: 14px; line-height: 1.5; }
.btn-save { width: 100%; padding: 12px; background: #1A6BFF; color: white; border: none; border-radius: 10px; font-size: 14px; font-weight: 800; cursor: pointer; font-family: inherit; }
.btn-cancel { width: 100%; padding: 10px; background: none; border: none; color: #8A96B5; font-size: 13px; font-weight: 700; cursor: pointer; font-family: inherit; margin-top: 6px; }
.legend { position: fixed; top: 68px; right: 12px; z-index: 1000; background: white; border-radius: 12px; padding: 10px 12px; box-shadow: 0 4px 16px rgba(0,0,0,0.12); }
.leg-row { display: flex; align-items: center; gap: 6px; font-size: 11px; font-weight: 700; color: #4A5880; margin-bottom: 5px; }
.leg-row:last-child { margin-bottom: 0; }
.leg-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
.filter-bar { position: fixed; top: 64px; left: 0; right: 0; z-index: 999; padding: 8px 12px; display: flex; gap: 6px; overflow-x: auto; scrollbar-width: none; }
.filter-chip { flex-shrink: 0; padding: 6px 14px; border-radius: 20px; border: 1.5px solid #E4EAFF; background: white; font-size: 12px; font-weight: 700; color: #4A5880; cursor: pointer; font-family: inherit; transition: all 0.15s; white-space: nowrap; }
.filter-chip.active { background: #0D1B3E; color: white; border-color: #0D1B3E; }
`;

export default function AdminShopsMapPage() {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState("");
  const [shops, setShops] = useState<any[]>([]);
  const [filter, setFilter] = useState("all");
  const [editingShop, setEditingShop] = useState<any>(null);
  const [editLat, setEditLat] = useState("");
  const [editLng, setEditLng] = useState("");
  const [saving, setSaving] = useState(false);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const circlesRef = useRef<any[]>([]);

  useEffect(() => {
    if (!authed) return;
    loadMap();
    loadShops();
  }, [authed]);

  useEffect(() => {
    if (mapRef.current && shops.length > 0) plotShops();
  }, [shops, filter]);

  async function saveShopLocation() {
    if (!editingShop || !editLat || !editLng) return;
    setSaving(true);
    await supabase.from("profiles").update({
      latitude: parseFloat(editLat),
      longitude: parseFloat(editLng),
    }).eq("id", editingShop.id);
    setSaving(false);
    setEditingShop(null);
    loadShops();
    alert("✓ Location saved for " + (editingShop.shop_name || editingShop.name));
  }

  async function loadShops() {
    const { data } = await supabase.from("profiles")
      .select("id,shop_name,name,latitude,longitude,is_live,shopfront_verified,shopfront_rejected,phone,email,created_at")
      .eq("role", "shopkeeper")
      .order("created_at", { ascending: false });
    setShops(data || []);
  }

  function loadMap() {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    document.head.appendChild(link);
    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.onload = () => {
      const L = (window as any).L;
      const map = L.map("admin-map", { zoomControl: true }).setView([29.2183, 79.5130], 13);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { attribution: "© OSM", maxZoom: 19 }).addTo(map);
      mapRef.current = map;
      if (shops.length > 0) plotShops();
    };
    document.head.appendChild(script);
  }

  function plotShops() {
    const L = (window as any).L;
    if (!L || !mapRef.current) return;

    // Clear existing markers and circles
    markersRef.current.forEach(m => m.remove());
    circlesRef.current.forEach(c => c.remove());
    markersRef.current = [];
    circlesRef.current = [];

    const filtered = shops.filter(s => {
      if (filter === "live") return s.is_live && s.shopfront_verified;
      if (filter === "offline") return !s.is_live && s.shopfront_verified;
      if (filter === "unverified") return !s.shopfront_verified;
      if (filter === "no_location") return !s.latitude || !s.longitude;
      return true;
    }).filter(s => s.latitude && s.longitude);

    const bounds: number[][] = [];

    filtered.forEach(shop => {
      const isLive = shop.is_live && shop.shopfront_verified;
      const isUnverified = !shop.shopfront_verified;
      const color = isLive ? "#00B37E" : isUnverified ? "#FFB800" : "#B0BACC";
      const emoji = isLive ? "🟢" : isUnverified ? "🟡" : "⚫";

      // Shop marker
      const ic = L.divIcon({
        html: `<div style="font-size:28px;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.25));line-height:1">🏪</div>`,
        iconSize: [32, 32], iconAnchor: [16, 32], className: ""
      });
      const marker = L.marker([shop.latitude, shop.longitude], { icon: ic })
        .addTo(mapRef.current)
        .bindPopup(`
          <div style="font-family:'Plus Jakarta Sans',sans-serif;min-width:180px">
            <div style="font-size:14px;font-weight:900;color:#0D1B3E;margin-bottom:4px">${emoji} ${shop.shop_name || shop.name}</div>
            <div style="font-size:11px;color:#8A96B5;margin-bottom:2px">📱 ${shop.phone || "No phone"}</div>
            <div style="font-size:11px;color:#8A96B5;margin-bottom:6px">📧 ${shop.email || "No email"}</div>
            <div style="font-size:11px;font-weight:800;color:${isLive ? "#00875A" : isUnverified ? "#946200" : "#8A96B5"}">
              ${isLive ? "✅ Live" : isUnverified ? "⚠️ Not Verified" : "⭕ Offline"}
            </div>
            <div style="font-size:10px;color:#B0BACC;margin-top:4px">${shop.latitude.toFixed(5)}, ${shop.longitude.toFixed(5)}</div>
          </div>
        `);
      markersRef.current.push(marker);

      // 500m radius circle
      const circle = L.circle([shop.latitude, shop.longitude], {
        radius: 500,
        color: color,
        fillColor: color,
        fillOpacity: 0.08,
        weight: 1.5,
        dashArray: "6,4"
      }).addTo(mapRef.current);
      circlesRef.current.push(circle);

      bounds.push([shop.latitude, shop.longitude]);
    });

    if (bounds.length > 0) {
      try { mapRef.current.fitBounds(bounds, { padding: [80, 80], maxZoom: 15 }); } catch {}
    }
  }

  function centerAll() {
    const L = (window as any).L;
    if (!L || !mapRef.current) return;
    const pts = shops.filter(s => s.latitude && s.longitude).map(s => [s.latitude, s.longitude]);
    if (pts.length > 0) { try { mapRef.current.fitBounds(pts, { padding: [80, 80], maxZoom: 15 }); } catch {} }
  }

  function flyToShop(shop: any) {
    if (!shop.latitude || !shop.longitude) { alert("No location saved for this shop"); return; }
    mapRef.current?.setView([shop.latitude, shop.longitude], 17);
  }

  const noLocation = shops.filter(s => !s.latitude || !s.longitude);
  const filtered = filter === "all" ? shops
    : filter === "live" ? shops.filter(s => s.is_live && s.shopfront_verified)
    : filter === "offline" ? shops.filter(s => !s.is_live && s.shopfront_verified)
    : filter === "unverified" ? shops.filter(s => !s.shopfront_verified)
    : shops.filter(s => !s.latitude || !s.longitude);

  if (!authed) return (
    <div style={{ minHeight: "100vh", background: "#F4F6FB", fontFamily: "'Plus Jakarta Sans',sans-serif", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <style>{CSS}</style>
      <div style={{ background: "white", borderRadius: 16, padding: 24, width: "100%", maxWidth: 360, border: "1.5px solid #E4EAFF" }}>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ fontSize: 44, marginBottom: 8 }}>🗺️</div>
          <div style={{ fontSize: 20, fontWeight: 900, color: "#0D1B3E" }}>Shops Map — Admin</div>
        </div>
        <input type="password" placeholder="Admin password"
          style={{ width: "100%", padding: "11px 14px", border: "1.5px solid #E4EAFF", borderRadius: 10, fontSize: 14, fontFamily: "inherit", outline: "none", marginBottom: 12, boxSizing: "border-box" }}
          value={pw} onChange={e => setPw(e.target.value)}
          onKeyDown={e => e.key === "Enter" && (pw === ADMIN_PASSWORD ? setAuthed(true) : alert("Wrong password"))} />
        <button style={{ width: "100%", padding: 13, background: "#0D1B3E", color: "white", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 800, cursor: "pointer", fontFamily: "inherit" }}
          onClick={() => pw === ADMIN_PASSWORD ? setAuthed(true) : alert("Wrong password")}>Enter</button>
      </div>
    </div>
  );

  return (
    <div style={{ height: "100vh", overflow: "hidden", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
      <style>{CSS}</style>
      <div id="admin-map" />

      <div className="top-bar">
        <a href="/admin" className="back-btn">←</a>
        <div className="top-title">🗺️ Shops on Map</div>
        <div className="count-badge">{shops.filter(s => s.latitude).length} pinned</div>
      </div>

      {/* Filter bar */}
      <div className="filter-bar">
        {[["all","All"], ["live","🟢 Live"], ["offline","⭕ Offline"], ["unverified","⚠️ Unverified"], ["no_location","❌ No Location"]].map(([val,label]) => (
          <button key={val} className={`filter-chip ${filter===val?"active":""}`} onClick={() => { setFilter(val); }}>
            {label} {val === "no_location" ? `(${noLocation.length})` : ""}
          </button>
        ))}
      </div>

      {/* Legend */}
      <div className="legend">
        <div className="leg-row"><div className="leg-dot" style={{background:"#00B37E"}} />Live</div>
        <div className="leg-row"><div className="leg-dot" style={{background:"#B0BACC"}} />Offline</div>
        <div className="leg-row"><div className="leg-dot" style={{background:"#FFB800"}} />Unverified</div>
        <div className="leg-row" style={{borderTop:"1px solid #F4F6FB",paddingTop:5,marginTop:2,fontSize:10,color:"#B0BACC"}}>Circles = 500m radius</div>
      </div>

      <button className="center-btn" onClick={centerAll}>🗺️</button>

      {/* Bottom panel shop list */}
      <div className="panel">
        <div className="panel-handle" />
        <div className="panel-list">
          {filtered.length === 0 && <div style={{ textAlign: "center", padding: 24, color: "#8A96B5", fontSize: 13 }}>No shops in this filter</div>}
          {filtered.map(shop => (
            <div key={shop.id} className="shop-row" onClick={() => flyToShop(shop)}>
              <div className={`shop-dot ${shop.is_live && shop.shopfront_verified ? "dot-live" : !shop.shopfront_verified ? "dot-unverified" : "dot-offline"}`} />
              <div className="shop-info">
                <div className="shop-name">{shop.shop_name || shop.name}</div>
                <div className="shop-meta">
                  {shop.latitude ? `📍 ${shop.latitude.toFixed(4)}, ${shop.longitude.toFixed(4)}` : "❌ No location saved"}
                  {shop.phone ? ` · ${shop.phone}` : ""}
                </div>
              </div>
              <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4}}>
                <div className={`shop-status ${shop.is_live && shop.shopfront_verified ? "status-live" : !shop.shopfront_verified ? "status-unverified" : "status-offline"}`}>
                  {shop.is_live && shop.shopfront_verified ? "Live" : !shop.shopfront_verified ? "Unverified" : "Offline"}
                </div>
                {(!shop.latitude || !shop.longitude) && (
                  <button onClick={e => { e.stopPropagation(); setEditingShop(shop); setEditLat(""); setEditLng(""); }}
                    style={{fontSize:10,fontWeight:800,color:"#1A6BFF",background:"#EBF1FF",border:"1px solid #C5D5FF",borderRadius:5,padding:"3px 7px",cursor:"pointer",fontFamily:"inherit"}}>
                    📍 Set Location
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Edit Location Modal for shops missing coordinates */}
      {editingShop && (
        <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) setEditingShop(null); }}>
          <div className="modal-box">
            <div className="modal-title">📍 Set Shop Location</div>
            <div className="modal-sub">{editingShop.shop_name || editingShop.name}</div>
            <div className="modal-hint">
              To get coordinates: Open Google Maps → long-press on the shop location → copy the latitude and longitude shown at the bottom.
            </div>
            <input className="modal-inp" placeholder="Latitude (e.g. 29.21830)" value={editLat} onChange={e => setEditLat(e.target.value)} />
            <input className="modal-inp" placeholder="Longitude (e.g. 79.51530)" value={editLng} onChange={e => setEditLng(e.target.value)} />
            <button className="btn-save" onClick={saveShopLocation} disabled={saving || !editLat || !editLng}>
              {saving ? "Saving..." : "✓ Save Location"}
            </button>
            <button className="btn-cancel" onClick={() => setEditingShop(null)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
