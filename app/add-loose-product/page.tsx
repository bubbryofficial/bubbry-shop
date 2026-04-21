"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

const LOOSE_CATEGORIES = [
  { name: "Grains & Flour", items: ["Atta (Wheat Flour)", "Rice (Basmati)", "Rice (Non-Basmati)", "Maida", "Besan (Chickpea Flour)", "Sooji (Semolina)", "Cornflour", "Ragi Flour", "Bajra Flour"] },
  { name: "Pulses & Lentils", items: ["Toor Dal", "Moong Dal", "Chana Dal", "Urad Dal", "Masoor Dal", "Rajma", "Chhole (Chickpeas)", "Moong Whole", "Matki"] },
  { name: "Edible Oils", items: ["Mustard Oil", "Sunflower Oil", "Groundnut Oil", "Soybean Oil", "Coconut Oil", "Palm Oil", "Sesame Oil"] },
  { name: "Spices & Masala", items: ["Red Chilli Powder", "Turmeric Powder", "Coriander Powder", "Cumin Seeds", "Black Pepper", "Garam Masala", "Amchur Powder", "Fennel Seeds", "Carom Seeds"] },
  { name: "Dry Fruits & Nuts", items: ["Cashews", "Almonds", "Raisins", "Peanuts", "Walnuts", "Pistachios", "Dates", "Dried Apricots"] },
  { name: "Sugar & Sweeteners", items: ["Sugar", "Jaggery (Gud)", "Brown Sugar", "Mishri (Rock Sugar)"] },
  { name: "Other", items: ["Salt", "Poha", "Sago (Sabudana)", "Vermicelli", "Tamarind", "Dry Coconut"] },
];

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Plus Jakarta Sans', sans-serif; background: #F4F6FB; }
.top-bar { background: #1A6BFF; padding: 14px 16px; display: flex; align-items: center; gap: 12px; position: sticky; top: 0; z-index: 100; }
.back-btn { width: 36px; height: 36px; background: rgba(255,255,255,0.2); border-radius: 10px; border: none; color: white; font-size: 18px; cursor: pointer; display: flex; align-items: center; justify-content: center; }
.page-title { font-size: 17px; font-weight: 900; color: white; }
.page { padding: 16px; max-width: 480px; margin: 0 auto; padding-bottom: 100px; }
.info-banner { background: #EBF1FF; border-radius: 12px; padding: 12px 14px; margin-bottom: 16px; font-size: 13px; color: #1A6BFF; font-weight: 600; line-height: 1.5; }
.section-title { font-size: 11px; font-weight: 800; color: #8A96B5; text-transform: uppercase; letter-spacing: 0.5px; margin: 16px 0 8px; }
.input-label { font-size: 12px; font-weight: 700; color: #0D1B3E; margin-bottom: 6px; display: block; }
.input { width: 100%; padding: 12px 14px; border: 1.5px solid #E4EAFF; border-radius: 12px; font-size: 15px; font-family: inherit; outline: none; background: white; color: #0D1B3E; }
.input:focus { border-color: #1A6BFF; }
.unit-row { display: flex; gap: 8px; margin-bottom: 14px; }
.unit-btn { flex: 1; padding: 10px; border: 1.5px solid #E4EAFF; border-radius: 10px; background: white; font-size: 13px; font-weight: 800; cursor: pointer; font-family: inherit; color: #8A96B5; }
.unit-btn.active { background: #1A6BFF; color: white; border-color: #1A6BFF; }
.cat-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 8px; }
.cat-item { padding: 10px 12px; border: 1.5px solid #E4EAFF; border-radius: 10px; background: white; font-size: 13px; font-weight: 700; cursor: pointer; font-family: inherit; color: #0D1B3E; text-align: left; }
.cat-item.selected { background: #EBF1FF; border-color: #1A6BFF; color: #1A6BFF; }
.custom-name-row { display: flex; gap: 8px; align-items: center; margin-bottom: 14px; }
.save-btn { width: 100%; padding: 15px; background: #1A6BFF; color: white; border: none; border-radius: 14px; font-size: 15px; font-weight: 800; cursor: pointer; font-family: inherit; }
.save-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.preview-box { background: white; border-radius: 14px; padding: 16px; border: 1.5px solid #E4EAFF; margin-bottom: 16px; }
.preview-title { font-size: 16px; font-weight: 900; color: #0D1B3E; margin-bottom: 4px; }
.preview-price { font-size: 20px; font-weight: 900; color: #1A6BFF; }
.preview-sub { font-size: 12px; color: #8A96B5; margin-top: 4px; }
`;

export default function AddLooseProduct() {
  const router = useRouter();
  const [productName, setProductName] = useState("");
  const [selectedItem, setSelectedItem] = useState("");
  const [customName, setCustomName] = useState("");
  const [unit, setUnit] = useState<"kg"|"liter"|"gram"|"piece">("kg");
  const [pricePerUnit, setPricePerUnit] = useState("");
  const [minQty, setMinQty] = useState("0.25");
  const [maxQty, setMaxQty] = useState("10");
  const [availableStock, setAvailableStock] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [expandedCat, setExpandedCat] = useState<string|null>("Grains & Flour");

  const finalName = customName.trim() || selectedItem || productName;
  const unitLabel = unit === "kg" ? "kg" : unit === "liter" ? "L" : unit === "gram" ? "100g" : "piece";
  const effectivePrice = unit === "gram" ? (parseFloat(pricePerUnit)||0) / 10 : parseFloat(pricePerUnit) || 0;

  async function save() {
    if (!finalName) { alert("Enter a product name"); return; }
    if (!pricePerUnit || parseFloat(pricePerUnit) <= 0) { alert("Enter a valid price"); return; }
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { alert("Not logged in"); return; }

      // Insert directly into shop_products with is_loose flag
      const { error } = await supabase.from("shop_products").insert({
        shop_id: user.id,
        product_id: null,           // no master_product reference
        name: finalName,
        size: `Per ${unitLabel}`,
        price: parseFloat(pricePerUnit),
        stock: availableStock ? parseFloat(availableStock) : 999,
        is_loose: true,
        loose_unit: unit,
        loose_min_qty: parseFloat(minQty) || 0.25,
        loose_max_qty: parseFloat(maxQty) || 10,
        price_per_unit: parseFloat(pricePerUnit),
      });

      if (error) { alert(error.message); return; }
      setSaved(true);
      setTimeout(() => router.push("/add-product"), 1500);
    } catch(e: any) { alert(e.message); }
    setSaving(false);
  }

  return (
    <div style={{ minHeight: "100vh", background: "#F4F6FB", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <style>{CSS}</style>
      <div className="top-bar">
        <button className="back-btn" onClick={() => router.back()}>←</button>
        <div className="page-title">🧺 Add Loose Product</div>
      </div>
      <div className="page">
        <div className="info-banner">
          ℹ️ Loose products like atta, rice, dal, oil can be sold by weight or volume. Customers enter the amount they want to spend and the quantity is auto-calculated.
        </div>

        {/* Step 1: Choose product */}
        <div className="section-title">Step 1 — Choose Product</div>
        {LOOSE_CATEGORIES.map(cat => (
          <div key={cat.name} style={{ marginBottom: 8 }}>
            <button onClick={() => setExpandedCat(expandedCat === cat.name ? null : cat.name)}
              style={{ width: "100%", padding: "10px 14px", background: "white", border: "1.5px solid #E4EAFF", borderRadius: 12, fontSize: 13, fontWeight: 800, cursor: "pointer", fontFamily: "inherit", color: "#0D1B3E", textAlign: "left", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>{cat.name}</span>
              <span style={{ color: "#8A96B5" }}>{expandedCat === cat.name ? "▲" : "▼"}</span>
            </button>
            {expandedCat === cat.name && (
              <div className="cat-grid" style={{ marginTop: 6 }}>
                {cat.items.map(item => (
                  <button key={item} className={`cat-item ${selectedItem === item ? "selected" : ""}`}
                    onClick={() => { setSelectedItem(item); setCustomName(""); }}>
                    {item}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        <div style={{ marginTop: 12, marginBottom: 14 }}>
          <label className="input-label">Or type a custom product name</label>
          <input className="input" placeholder="e.g. Poha, Sago, Makhana..."
            value={customName} onChange={e => { setCustomName(e.target.value); setSelectedItem(""); }} />
        </div>

        {/* Step 2: Unit */}
        <div className="section-title">Step 2 — Sold by</div>
        <div className="unit-row">
          {(["kg","liter","gram","piece"] as const).map(u => (
            <button key={u} className={`unit-btn ${unit===u?"active":""}`} onClick={() => setUnit(u)}>
              {u === "gram" ? "100g" : u === "liter" ? "Litre" : u === "piece" ? "Piece" : "Kg"}
            </button>
          ))}
        </div>

        {/* Step 3: Pricing */}
        <div className="section-title">Step 3 — Pricing</div>
        <label className="input-label">Price per {unit === "gram" ? "100g" : unit} (₹)</label>
        <input className="input" type="number" placeholder={unit==="kg" ? "e.g. 55" : unit==="liter" ? "e.g. 120" : unit==="gram" ? "e.g. 30" : "e.g. 10"}
          value={pricePerUnit} onChange={e => setPricePerUnit(e.target.value)} style={{ marginBottom: 12 }} />

        <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
          <div style={{ flex: 1 }}>
            <label className="input-label">Min order ({unit === "gram" ? "g" : unit})</label>
            <input className="input" type="number" value={minQty} onChange={e => setMinQty(e.target.value)} />
          </div>
          <div style={{ flex: 1 }}>
            <label className="input-label">Max order ({unit === "gram" ? "g" : unit})</label>
            <input className="input" type="number" value={maxQty} onChange={e => setMaxQty(e.target.value)} />
          </div>
        </div>

        <label className="input-label">Available stock ({unit === "gram" ? "g" : unit}) — optional</label>
        <input className="input" type="number" placeholder="Leave blank for unlimited"
          value={availableStock} onChange={e => setAvailableStock(e.target.value)} style={{ marginBottom: 16 }} />

        {/* Preview */}
        {finalName && pricePerUnit && (
          <>
            <div className="section-title">Preview</div>
            <div className="preview-box">
              <div className="preview-title">🧺 {finalName}</div>
              <div className="preview-price">₹{pricePerUnit} / {unit === "gram" ? "100g" : unit}</div>
              <div className="preview-sub">Customer enters ₹50 → gets {(50 / (parseFloat(pricePerUnit)||1)).toFixed(2)} {unit}</div>
            </div>
          </>
        )}

        <button className="save-btn" disabled={saving || saved || !finalName || !pricePerUnit}
          onClick={save}>
          {saved ? "✓ Saved! Redirecting..." : saving ? "Saving..." : "💾 Save Loose Product"}
        </button>
      </div>
    </div>
  );
}
