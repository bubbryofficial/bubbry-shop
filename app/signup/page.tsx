"use client";
import { useState, useRef, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
* { box-sizing: border-box; margin: 0; padding: 0; }
.auth-input { width: 100%; padding: 14px 16px; border: 2px solid #E4EAFF; border-radius: 12px; font-size: 15px; font-weight: 500; color: #0D1B3E; background: white; font-family: 'Plus Jakarta Sans', sans-serif; outline: none; transition: all 0.2s; }
.auth-input:focus { border-color: #1A6BFF; box-shadow: 0 0 0 4px rgba(26,107,255,0.1); }
.auth-btn { width: 100%; padding: 16px; background: #1A6BFF; color: white; border: none; border-radius: 14px; font-size: 16px; font-weight: 800; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.2s; margin-top: 8px; }
.auth-btn:hover:not(:disabled) { background: #1255CC; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(26,107,255,0.35); }
.auth-btn:disabled { opacity: 0.6; cursor: not-allowed; }
.auth-btn.secondary { background: white; color: #1A6BFF; border: 2px solid #1A6BFF; }
.auth-btn.secondary:hover:not(:disabled) { background: #EBF1FF; transform: none; box-shadow: none; }
.field-label { display: block; font-size: 12px; font-weight: 700; color: #8A96B5; text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 7px; }
.phone-row { display: flex; gap: 8px; }
.phone-prefix { padding: 14px 12px; border: 2px solid #E4EAFF; border-radius: 12px; font-size: 15px; font-weight: 700; color: #0D1B3E; background: #F4F6FB; white-space: nowrap; }
.otp-input { width: 100%; padding: 16px; border: 2px solid #E4EAFF; border-radius: 12px; font-size: 22px; font-weight: 800; color: #0D1B3E; text-align: center; letter-spacing: 6px; font-family: 'Plus Jakarta Sans', sans-serif; outline: none; transition: all 0.2s; }
.otp-input:focus { border-color: #1A6BFF; box-shadow: 0 0 0 4px rgba(26,107,255,0.1); }
.step-dots { display: flex; align-items: center; justify-content: center; gap: 6px; margin-bottom: 12px; }
.dot { width: 8px; height: 8px; border-radius: 50%; background: rgba(255,255,255,0.35); transition: all 0.3s; }
.dot.active { background: white; width: 24px; border-radius: 4px; }
.dot.done { background: rgba(255,255,255,0.7); }
.resend-btn { background: none; border: none; color: #1A6BFF; font-size: 13px; font-weight: 700; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; padding: 4px 0; }
.resend-btn:disabled { color: #B0BACC; cursor: not-allowed; }
.consent-box { background: #F4F6FB; border: 1.5px solid #E4EAFF; border-radius: 12px; padding: 14px; margin-bottom: 16px; }
.consent-row { display: flex; align-items: flex-start; gap: 10px; cursor: pointer; }
.cbox { width: 20px; height: 20px; border-radius: 6px; border: 2px solid #E4EAFF; background: white; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 1px; transition: all 0.2s; }
.cbox.on { background: #1A6BFF; border-color: #1A6BFF; }
.ctext { font-size: 12px; color: #4A5880; font-weight: 500; line-height: 1.6; }
.ctext a { color: #1A6BFF; font-weight: 700; text-decoration: none; }
.legal-links { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; margin-top: 10px; }
.legal-link { font-size: 12px; color: #1A6BFF; font-weight: 700; text-decoration: none; }
.img-upload-box { border: 2px dashed #E4EAFF; border-radius: 14px; padding: 20px; text-align: center; cursor: pointer; transition: all 0.2s; background: #F4F6FB; }
.img-upload-box:hover { border-color: #1A6BFF; background: #EBF1FF; }
.img-upload-box.has-img { border-color: #00B37E; border-style: solid; background: #E6FAF4; padding: 0; overflow: hidden; }
.img-preview { width: 100%; height: 160px; object-fit: cover; border-radius: 12px; display: block; }
.info-banner { background: #FFF8E6; border: 1.5px solid #FFB800; border-radius: 12px; padding: 12px 14px; font-size: 12px; font-weight: 600; color: #946200; margin-bottom: 16px; }
`;

type Step = "details" | "phone" | "otp" | "location" | "shopfront" | "done";

function LocationStep({ onConfirm }: { onConfirm: (lat: number, lng: number, addr: string, instructions: string) => void }) {
  const mapRef = useRef<any>(null);
  const [lat, setLat] = useState(29.2183);
  const [lng, setLng] = useState(79.5130);
  const [address, setAddress] = useState("");
  const [instructions, setInstructions] = useState("");
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    // Prevent body scroll while map is open
    document.body.style.overflow = "hidden";
    loadLeaflet();
    return () => {
      document.body.style.overflow = "";
      try { mapRef.current?.remove(); mapRef.current = null; } catch {}
    };
  }, []);

  function loadLeaflet() {
    if ((window as any).L) { initMap(); return; }
    if (!document.querySelector('link[href*="leaflet"]')) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }
    if (!document.querySelector('script[src*="leaflet"]')) {
      const script = document.createElement("script");
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.onload = () => setTimeout(initMap, 100);
      document.head.appendChild(script);
    } else {
      setTimeout(initMap, 200);
    }
  }

  function initMap() {
    const L = (window as any).L;
    const el = document.getElementById("shop-loc-map");
    if (!L || !el) { setTimeout(initMap, 200); return; }
    if (mapRef.current) { try { mapRef.current.remove(); } catch {} mapRef.current = null; }
    const map = L.map("shop-loc-map", { zoomControl: true }).setView([lat, lng], 17);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap", maxZoom: 19
    }).addTo(map);
    mapRef.current = map;
    map.on("moveend", () => {
      const center = map.getCenter();
      setLat(center.lat);
      setLng(center.lng);
      reverseGeocode(center.lat, center.lng);
    });
    // Auto-locate
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(pos => {
        const { latitude, longitude } = pos.coords;
        map.setView([latitude, longitude], 18);
        setLat(latitude); setLng(longitude);
        reverseGeocode(latitude, longitude);
      }, () => reverseGeocode(lat, lng));
    } else {
      reverseGeocode(lat, lng);
    }
  }

  async function reverseGeocode(lt: number, lg: number) {
    setFetching(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lt}&lon=${lg}&format=json&addressdetails=1`,
        { headers: { "Accept-Language": "en" } }
      );
      const data = await res.json();
      if (data.address) {
        const a = data.address;
        const parts = [
          a.house_number, a.road || a.street,
          a.neighbourhood || a.suburb,
          a.city || a.town || a.village,
          a.state, a.postcode
        ].filter(Boolean);
        setAddress(parts.join(", "));
      }
    } catch { }
    setFetching(false);
  }

  function locateMe() {
    if (!navigator.geolocation || !mapRef.current) return;
    navigator.geolocation.getCurrentPosition(pos => {
      mapRef.current.setView([pos.coords.latitude, pos.coords.longitude], 18);
    });
  }

  // Full-screen overlay styles
  const overlayStyle: React.CSSProperties = {
    position: "fixed", inset: 0, zIndex: 9999,
    background: "#fff", display: "flex", flexDirection: "column",
    fontFamily: "'Plus Jakarta Sans', sans-serif",
  };

  return (
    <div style={overlayStyle}>
      {/* Header */}
      <div style={{ background: "#1A6BFF", padding: "14px 16px", display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
        <div style={{ fontSize: 16, fontWeight: 900, color: "white", flex: 1 }}>📍 Pin Your Shop Location</div>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.75)", fontWeight: 600 }}>Step 4 of 5</div>
      </div>

      {/* Instruction */}
      <div style={{ background: "#EBF1FF", padding: "10px 16px", fontSize: 12, fontWeight: 600, color: "#1A6BFF", flexShrink: 0 }}>
        Drag the map so the 📍 pin is exactly on your shop entrance
      </div>

      {/* Map — fills all available space */}
      <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
        <div id="shop-loc-map" style={{ position: "absolute", inset: 0 }} />
        {/* Fixed center pin */}
        <div style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%, -100%)", zIndex: 1000,
          fontSize: 36, pointerEvents: "none",
          filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.35))"
        }}>📍</div>
        {/* Locate me button */}
        <button onClick={locateMe} style={{
          position: "absolute", bottom: 16, right: 16, zIndex: 1000,
          width: 48, height: 48, background: "white", border: "none",
          borderRadius: "50%", fontSize: 20, boxShadow: "0 4px 14px rgba(0,0,0,0.18)",
          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center"
        }}>🎯</button>
      </div>

      {/* Bottom panel */}
      <div style={{ background: "white", padding: "16px 16px 32px", boxShadow: "0 -8px 24px rgba(0,0,0,0.1)", flexShrink: 0 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#8A96B5", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 6 }}>
          Detected Address
        </div>
        <div style={{
          fontSize: 14, fontWeight: 700, color: address ? "#0D1B3E" : "#B0BACC",
          minHeight: 40, lineHeight: 1.5, marginBottom: 4
        }}>
          {fetching ? "📡 Detecting address..." : address || "Move the map to your shop location"}
        </div>
        {address && (
          <div style={{ fontSize: 11, color: "#B0BACC", marginBottom: 12 }}>
            📌 {lat.toFixed(5)}, {lng.toFixed(5)}
          </div>
        )}
        {/* Shop address instructions — required */}
        <div style={{ padding: "0 16px 4px" }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: "#8A96B5", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 6, display: "flex", alignItems: "center", gap: 6 }}>
            Shop Address Details
            <span style={{ background: "#FFF0F0", color: "#E53E3E", fontSize: 9, fontWeight: 800, padding: "2px 6px", borderRadius: 4 }}>Required</span>
          </div>
          <textarea
            rows={3}
            placeholder={"House/shop no., floor, building name, landmark, colony...\ne.g. Shop 12, Ground Floor, Radha Krishna Market, Near SBI Bank"}
            value={instructions}
            onChange={e => setInstructions(e.target.value)}
            style={{
              width: "100%", padding: "10px 12px", border: instructions.trim() ? "2px solid #00B37E" : "2px solid #E4EAFF",
              borderRadius: 10, fontSize: 13, fontWeight: 500, color: "#0D1B3E",
              fontFamily: "'Plus Jakarta Sans', sans-serif", resize: "none", outline: "none",
              background: instructions.trim() ? "#F0FBF7" : "white", lineHeight: 1.5,
              boxSizing: "border-box" as const, marginBottom: 12, transition: "border-color 0.2s"
            }}
          />
        </div>
        <button
          disabled={fetching || !address || !instructions.trim()}
          onClick={() => {
            if (!instructions.trim()) { alert("Please fill in the shop address details (house no., landmark, etc.)"); return; }
            onConfirm(lat, lng, address, instructions);
          }}
          style={{
            width: "100%", padding: 15, background: address && instructions.trim() && !fetching ? "#1A6BFF" : "#E4EAFF",
            color: address && instructions.trim() && !fetching ? "white" : "#B0BACC",
            border: "none", borderRadius: 14, fontSize: 16, fontWeight: 800,
            cursor: address && instructions.trim() && !fetching ? "pointer" : "not-allowed",
            fontFamily: "'Plus Jakarta Sans', sans-serif", transition: "all 0.2s"
          }}
        >
          {fetching ? "Detecting address..." : !address ? "Move map to your shop" : !instructions.trim() ? "Fill shop address details to continue" : "✓ Confirm Shop Location →"}
        </button>
      </div>
    </div>
  );
}

export default function ShopSignup() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("details");
  const [shopLat, setShopLat] = useState<number|null>(null);
  const [shopInstructions, setShopInstructions] = useState("");
  const [shopLng, setShopLng] = useState<number|null>(null);
  const [shopAddress, setShopAddress] = useState("");
  const [mapReady, setMapReady] = useState(false);
  const [mapRef, setMapRef] = useState<any>(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [shopName, setShopName] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [shopfrontFile, setShopfrontFile] = useState<File | null>(null);
  const [shopfrontPreview, setShopfrontPreview] = useState("");
  const [consentChecked, setConsentChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [userId, setUserId] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fullPhone = "+91" + phone.replace(/\D/g, "");
  const stepNum = step === "details" ? 1 : step === "phone" ? 2 : step === "otp" ? 3 : step === "location" ? 4 : step === "shopfront" ? 5 : 5;

  function startTimer() {
    setResendTimer(30);
    const iv = setInterval(() => setResendTimer(t => { if (t <= 1) { clearInterval(iv); return 0; } return t - 1; }), 1000);
  }

  async function sendOtp() {
    if (phone.replace(/\D/g, "").length < 10) { alert("Enter a valid 10-digit phone number"); return; }
    setLoading(true);
    // Check for existing shopkeeper account with same number
    const { data: existing } = await supabase
      .from("profiles").select("id, role").eq("phone", fullPhone);
    const alreadyShopkeeper = (existing || []).find((p: any) => p.role === "shopkeeper");
    if (alreadyShopkeeper) {
      alert("A shopkeeper account already exists with this number. Please log in instead.");
      setLoading(false);
      return;
    }
    const { error } = await supabase.auth.signInWithOtp({ phone: fullPhone });
    if (error) { alert("Could not send OTP: " + error.message); setLoading(false); return; }
    setLoading(false); startTimer(); setStep("otp");
  }

  async function verifyOtp() {
    if (otp.length < 4) { alert("Enter the OTP"); return; }
    setLoading(true);
    const { data, error } = await supabase.auth.verifyOtp({ phone: fullPhone, token: otp, type: "sms" });
    if (error) { alert("Invalid OTP: " + error.message); setLoading(false); return; }
    const user = data.user;
    if (!user) { alert("Verification failed"); setLoading(false); return; }
    setUserId(user.id);
    await supabase.auth.updateUser({ email, password });
    const { error: pe } = await supabase.from("profiles").upsert({
      id: user.id, name: fullName, email, phone: fullPhone, role: "shopkeeper",
      shop_name: shopName, is_live: false, shopfront_verified: false,
      offers_delivery: false, offers_pickup: true,
    });
    if (pe) { alert("Profile error: " + pe.message); setLoading(false); return; }
    setLoading(false);
    setStep("location");
  }

  async function uploadShopfront() {
    if (!shopfrontFile) { alert("Please add a photo of your shopfront"); return; }
    setLoading(true);
    const path = `shopfronts/${userId}.jpg`;
    const { error: upErr } = await supabase.storage.from("product-images").upload(path, shopfrontFile, { upsert: true, contentType: shopfrontFile.type });
    if (upErr) { alert("Upload failed: " + upErr.message); setLoading(false); return; }
    const { data } = supabase.storage.from("product-images").getPublicUrl(path);
    await supabase.from("profiles").update({ shopfront_image: data.publicUrl, shopfront_verified: false }).eq("id", userId);
    setLoading(false);
    setStep("done");
  }

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(160deg, #EBF1FF 0%, #F4F6FB 60%)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <style>{CSS}</style>
      <div style={{ background: "#1A6BFF", height: 180, borderBottomLeftRadius: "50% 40px", borderBottomRightRadius: "50% 40px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", paddingBottom: 24, marginBottom: -20, boxShadow: "0 8px 30px rgba(26,107,255,0.3)" }}>
        <div style={{ fontSize: 32, marginBottom: 2 }}>🏪</div>
        <div style={{ fontSize: 24, fontWeight: 900, color: "white", letterSpacing: "-0.5px" }}>Bubbry Shop</div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.65)", marginTop: 4, marginBottom: 12 }}>Sell to customers near you</div>
        <div className="step-dots">
          {[1,2,3,4,5].map(i => <div key={i} className={`dot ${i === stepNum ? "active" : i < stepNum ? "done" : ""}`} />)}
        </div>
      </div>
      <div style={{ padding: "32px 24px 60px", maxWidth: 420, margin: "0 auto" }}>
        <div style={{ background: "white", borderRadius: 20, padding: 24, boxShadow: "0 8px 40px rgba(26,107,255,0.1)", border: "1.5px solid #E4EAFF" }}>

          {step === "details" && <>
            <div style={{ fontSize: 17, fontWeight: 800, color: "#0D1B3E", marginBottom: 20 }}>Shop Details</div>
            <div style={{ marginBottom: 14 }}><label className="field-label">Your Full Name</label><input className="auth-input" placeholder="Rahul Sharma" value={fullName} onChange={e => setFullName(e.target.value)} /></div>
            <div style={{ marginBottom: 14 }}><label className="field-label">Shop Name</label><input className="auth-input" placeholder="e.g. Sharma General Store" value={shopName} onChange={e => setShopName(e.target.value)} /></div>
            <div style={{ marginBottom: 14 }}><label className="field-label">Email</label><input type="email" className="auth-input" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} /></div>
            <div style={{ marginBottom: 20 }}><label className="field-label">Password</label><input type="password" className="auth-input" placeholder="Min. 6 characters" value={password} onChange={e => setPassword(e.target.value)} /></div>
            <button className="auth-btn" onClick={() => { if (!fullName||!shopName||!email||password.length<6){alert("Fill all fields");return;} setStep("phone"); }}>Next →</button>
          </>}

          {step === "phone" && <>
            <div style={{ fontSize: 17, fontWeight: 800, color: "#0D1B3E", marginBottom: 6 }}>Verify Phone</div>
            <div style={{ fontSize: 13, color: "#8A96B5", marginBottom: 20 }}>We'll send you a one-time code</div>
            <div style={{ marginBottom: 20 }}><label className="field-label">Phone Number</label>
              <div className="phone-row"><div className="phone-prefix">🇮🇳 +91</div><input className="auth-input" placeholder="9876543210" type="tel" maxLength={10} value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g,""))} style={{ flex: 1 }} /></div>
            </div>
            {/* Legal Consent */}
            <div className="consent-box">
              <div className="consent-row" onClick={() => setConsentChecked(!consentChecked)}>
                <div className={`cbox ${consentChecked ? "on" : ""}`}>
                  {consentChecked && <span style={{color:"white",fontSize:13,fontWeight:900}}>✓</span>}
                </div>
                <div className="ctext">
                  I have read and agree to the <a href="/terms" target="_blank">Seller Terms & Conditions</a>, <a href="/privacy" target="_blank">Privacy Policy</a>, and <a href="/refund-policy" target="_blank">Refund Policy</a>. I confirm I am the authorized owner of this business. Verifying my OTP constitutes my legally binding electronic signature under the Information Technology Act, 2000.
                </div>
              </div>
              <div className="legal-links">
                <a href="/terms" target="_blank" className="legal-link">📄 Seller Terms</a>
                <a href="/privacy" target="_blank" className="legal-link">🔒 Privacy Policy</a>
                <a href="/refund-policy" target="_blank" className="legal-link">↩️ Refund Policy</a>
              </div>
            </div>

            <button className="auth-btn" onClick={sendOtp} disabled={loading || !consentChecked} style={{opacity: consentChecked ? 1 : 0.5}}>{loading ? "Sending OTP..." : "Send OTP & Agree →"}</button>
            {!consentChecked && <div style={{textAlign:"center",fontSize:11,color:"#E53E3E",fontWeight:600,marginTop:8}}>Please read and accept the terms above to continue</div>}
            <button className="auth-btn secondary" style={{ marginTop: 10 }} onClick={() => setStep("details")}>← Back</button>
          </>}

          {step === "otp" && <>
            <div style={{ fontSize: 17, fontWeight: 800, color: "#0D1B3E", marginBottom: 6 }}>Enter OTP</div>
            <div style={{ fontSize: 13, color: "#8A96B5", marginBottom: 12 }}>Sent to +91 {phone}</div>
            <div style={{ background:"#E6FAF4", border:"1.5px solid #B8E8D4", borderRadius:10, padding:"10px 12px", marginBottom:16, fontSize:12, color:"#00875A", fontWeight:600 }}>
              ✓ By verifying this OTP, you digitally sign and agree to Bubbry&apos;s Seller Terms, Privacy Policy, and Refund Policy as a registered Seller
            </div>
            <div style={{ marginBottom: 20 }}><input className="otp-input" placeholder="------" type="number" value={otp} onChange={e => setOtp(e.target.value.slice(0,6))} /></div>
            <button className="auth-btn" onClick={verifyOtp} disabled={loading||otp.length<4}>{loading ? "Verifying..." : "Verify & Continue →"}</button>
            <div style={{ textAlign: "center", marginTop: 14 }}><button className="resend-btn" onClick={sendOtp} disabled={resendTimer>0||loading}>{resendTimer>0 ? `Resend in ${resendTimer}s` : "Resend OTP"}</button></div>
            <button className="auth-btn secondary" style={{ marginTop: 10 }} onClick={() => { setStep("phone"); setOtp(""); }}>← Change Number</button>
          </>}

          {step === "location" && (
            <LocationStep
              onConfirm={async (lat, lng, addr, instructions) => {
                setShopLat(lat); setShopLng(lng); setShopAddress(addr);
                setShopInstructions(instructions);
                // Save location immediately to DB — this is the critical step
                if (userId) {
                  const { error: locErr } = await supabase.from("profiles").update({
                    latitude: lat,
                    longitude: lng,
                    default_address: addr,
                    delivery_instructions: instructions,
                  }).eq("id", userId);
                  if (locErr) {
                    alert("Failed to save location: " + locErr.message);
                    return;
                  }
                }
                setStep("shopfront");
              }}
            />
          )}
          {step === "shopfront" && <>
            <div style={{ fontSize: 17, fontWeight: 800, color: "#0D1B3E", marginBottom: 6 }}>Shop Photo</div>
            <div className="info-banner">⚠️ Upload a clear photo of your shopfront. An admin will review and approve it before you can go live.</div>
            <div style={{ marginBottom: 20 }}>
              <div className={`img-upload-box ${shopfrontPreview ? "has-img" : ""}`} onClick={() => fileInputRef.current?.click()}>
                {shopfrontPreview
                  ? <img src={shopfrontPreview} alt="Shopfront" className="img-preview" />
                  : <><div style={{ fontSize: 36, marginBottom: 8 }}>🏪</div><div style={{ fontSize: 14, fontWeight: 700, color: "#4A5880" }}>Tap to upload shopfront photo</div></>}
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" capture="environment" style={{ display: "none" }} onChange={e => { const f = e.target.files?.[0]; if (!f) return; setShopfrontFile(f); const r = new FileReader(); r.onload = () => setShopfrontPreview(r.result as string); r.readAsDataURL(f); }} />
            </div>
            <button className="auth-btn" onClick={uploadShopfront} disabled={loading||!shopfrontFile}>{loading ? "Uploading..." : "Submit for Review →"}</button>
            <button className="auth-btn secondary" style={{ marginTop: 10 }} onClick={() => { setStep("done"); }} disabled={loading}>Skip for now</button>
          </>}

          {step === "done" && <div style={{ textAlign: "center", padding: "10px 0" }}>
            <div style={{ fontSize: 52, marginBottom: 12 }}>🎉</div>
            <div style={{ fontSize: 20, fontWeight: 900, color: "#0D1B3E", marginBottom: 8 }}>Shop Created!</div>
            <div style={{ fontSize: 13, color: "#8A96B5", marginBottom: 24, lineHeight: 1.6 }}>Your shopfront photo is under review. You can set up your inventory now and go live once approved.</div>
            <button className="auth-btn" onClick={() => router.push("/shop-dashboard")}>Go to Shop Dashboard →</button>
          </div>}
        </div>
        <p style={{ textAlign: "center", marginTop: 24, fontSize: 14, color: "#8A96B5", fontWeight: 500 }}>
          Already have an account? <a href="/login" style={{ color: "#1A6BFF", fontWeight: 700, textDecoration: "none" }}>Login</a>
        </p>
        <p style={{ textAlign: "center", marginTop: 12, fontSize: 13, color: "#B0BACC", fontWeight: 500 }}>
          Looking to shop? <a href="https://bubbry.in" style={{ color: "#1A6BFF", fontWeight: 700, textDecoration: "none" }}>Open Bubbry →</a>
        </p>
      </div>
    </div>
  );
}
