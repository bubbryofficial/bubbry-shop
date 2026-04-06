"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const MAX_RIDERS = 5;

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Plus Jakarta Sans', sans-serif; background: #F4F6FB; }
.top-bar { background: linear-gradient(135deg, #0B1F5C, #1A6BFF); padding: 14px 16px 16px; display: flex; align-items: center; gap: 12px; }
.back-btn { width: 36px; height: 36px; background: rgba(255,255,255,0.18); border: none; border-radius: 10px; color: white; font-size: 18px; cursor: pointer; display: flex; align-items: center; justify-content: center; text-decoration: none; }
.page-title { font-size: 18px; font-weight: 900; color: white; flex: 1; }
.count-chip { background: rgba(255,255,255,0.2); color: white; font-size: 12px; font-weight: 800; padding: 4px 10px; border-radius: 20px; }
.page { padding: 16px 16px 100px; max-width: 500px; margin: 0 auto; }
.card { background: white; border-radius: 16px; border: 1.5px solid #E4EAFF; padding: 20px; margin-bottom: 14px; box-shadow: 0 2px 10px rgba(26,107,255,0.05); }
.card-title { font-size: 14px; font-weight: 800; color: #0D1B3E; margin-bottom: 14px; }
.lbl { font-size: 11px; font-weight: 700; color: #8A96B5; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; display: block; }
.inp { width: 100%; padding: 12px 14px; border: 1.5px solid #E4EAFF; border-radius: 10px; font-size: 14px; font-weight: 500; color: #0D1B3E; font-family: inherit; outline: none; margin-bottom: 12px; box-sizing: border-box; transition: border-color 0.2s; }
.inp:focus { border-color: #1A6BFF; }
.phone-row { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; }
.phone-pre { background: #EBF1FF; border: 1.5px solid #E4EAFF; border-radius: 10px; padding: 12px 12px; font-size: 13px; font-weight: 700; color: #1A6BFF; flex-shrink: 0; }
.add-btn { width: 100%; padding: 13px; background: #1A6BFF; color: white; border: none; border-radius: 12px; font-size: 15px; font-weight: 800; cursor: pointer; font-family: inherit; transition: all 0.2s; }
.add-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.rider-row { display: flex; align-items: center; gap: 12px; padding: 14px 0; border-bottom: 1px solid #F4F6FB; }
.rider-row:last-child { border-bottom: none; }
.rider-num { width: 36px; height: 36px; background: linear-gradient(135deg, #1A6BFF, #4D8FFF); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 16px; color: white; font-weight: 900; flex-shrink: 0; }
.rider-name { font-size: 15px; font-weight: 800; color: #0D1B3E; }
.rider-phone { font-size: 12px; color: #8A96B5; font-weight: 500; margin-top: 2px; }
.remove-btn { margin-left: auto; padding: 7px 12px; background: #FFF0F0; color: #E53E3E; border: 1.5px solid #FFCDD2; border-radius: 8px; font-size: 12px; font-weight: 700; cursor: pointer; font-family: inherit; }
.limit-bar { background: #EBF1FF; border-radius: 10px; padding: 12px 14px; font-size: 13px; font-weight: 700; color: #1A6BFF; margin-bottom: 14px; display: flex; align-items: center; gap: 8px; }
.limit-bar.full { background: #FFF8E6; color: #946200; }
.empty { text-align: center; padding: 32px; color: #8A96B5; }
.info-box { background: #F4F6FB; border-radius: 12px; padding: 12px 14px; font-size: 12px; color: #4A5880; font-weight: 600; line-height: 1.6; margin-bottom: 14px; }
`;

export default function RidersPage() {
  const [riders, setRiders] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);
  const [shopId, setShopId] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session?.user) return;
      setShopId(session.user.id);
      loadRiders(session.user.id);
    });
  }, []);

  async function loadRiders(sid: string) {
    const { data } = await supabase.from("riders").select("*").eq("shop_id", sid).eq("active", true).order("created_at");
    setRiders(data || []);
  }

  async function addRider() {
    if (!name.trim()) { alert("Enter rider name"); return; }
    if (phone.replace(/\D/g,"").length < 10) { alert("Enter valid 10-digit phone"); return; }
    if (riders.length >= MAX_RIDERS) { alert(`Maximum ${MAX_RIDERS} riders allowed`); return; }
    setSaving(true);
    const fullPhone = "+91" + phone.replace(/\D/g,"");
    // Check duplicate
    const exists = riders.find(r => r.phone === fullPhone);
    if (exists) { alert("This phone number is already added"); setSaving(false); return; }
    const { error } = await supabase.from("riders").insert({
      shop_id: shopId, name: name.trim(), phone: fullPhone, active: true,
    });
    if (error) { alert("Error: " + error.message); }
    else { setName(""); setPhone(""); loadRiders(shopId); }
    setSaving(false);
  }

  async function removeRider(id: string) {
    if (!confirm("Remove this rider?")) return;
    await supabase.from("riders").update({ active: false }).eq("id", id);
    loadRiders(shopId);
  }

  const isFull = riders.length >= MAX_RIDERS;

  return (
    <div style={{ minHeight: "100vh", background: "#F4F6FB", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <style>{CSS}</style>
      <div className="top-bar">
        <a href="/shop-dashboard" className="back-btn">←</a>
        <div className="page-title">🛵 My Riders</div>
        <div className="count-chip">{riders.length}/{MAX_RIDERS}</div>
      </div>

      <div className="page">
        <div className="info-box">
          📱 Riders log in at <strong>rider.bubbry.in</strong> using their phone number. Add their number here first — they can't log in without being registered under your shop.
        </div>

        {/* Add rider */}
        {!isFull ? (
          <div className="card">
            <div className="card-title">➕ Add New Rider</div>
            <label className="lbl">Rider's Full Name</label>
            <input className="inp" placeholder="e.g. Rajan Kumar" value={name} onChange={e => setName(e.target.value)} />
            <label className="lbl">Phone Number</label>
            <div className="phone-row">
              <div className="phone-pre">🇮🇳 +91</div>
              <input className="inp" style={{ marginBottom: 0, flex: 1 }} type="tel" maxLength={10}
                placeholder="9876543210" value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g,""))} />
            </div>
            <div style={{ height: 12 }} />
            <button className="add-btn" onClick={addRider} disabled={saving || !name || phone.length < 10}>
              {saving ? "Adding..." : "✓ Add Rider"}
            </button>
          </div>
        ) : (
          <div className={`limit-bar full`}>⚠️ Maximum {MAX_RIDERS} riders reached. Remove one to add another.</div>
        )}

        {/* Riders list */}
        <div className="card">
          <div className="card-title">👥 Registered Riders ({riders.length})</div>
          {riders.length === 0 && <div className="empty">No riders yet. Add your first rider above.</div>}
          {riders.map((r, i) => (
            <div key={r.id} className="rider-row">
              <div className="rider-num">{i + 1}</div>
              <div>
                <div className="rider-name">{r.name}</div>
                <div className="rider-phone">{r.phone}</div>
              </div>
              <button className="remove-btn" onClick={() => removeRider(r.id)}>Remove</button>
            </div>
          ))}
        </div>

        <div className="info-box" style={{ marginTop: 4 }}>
          🔒 <strong>How it works:</strong><br />
          1. Add rider's name and phone here<br />
          2. Rider opens rider.bubbry.in and logs in with their phone<br />
          3. When you mark an order "Out for Delivery", select the rider<br />
          4. Rider sees the delivery details and their live location shows on the map
        </div>
      </div>
    </div>
  );
}
