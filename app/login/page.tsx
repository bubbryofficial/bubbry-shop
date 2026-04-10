"use client";
import { supabase } from "../../lib/supabase";

import { useState } from "react";
import { useRouter } from "next/navigation";


const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Plus Jakarta Sans', sans-serif; }
.auth-input { width: 100%; padding: 14px 16px; border: 2px solid #E4EAFF; border-radius: 12px; font-size: 15px; font-weight: 500; color: #0D1B3E; background: white; font-family: 'Plus Jakarta Sans', sans-serif; outline: none; transition: all 0.2s; }
.auth-input:focus { border-color: #1A6BFF; box-shadow: 0 0 0 4px rgba(26,107,255,0.1); }
.auth-btn { width: 100%; padding: 16px; background: #1A6BFF; color: white; border: none; border-radius: 14px; font-size: 16px; font-weight: 800; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.2s; margin-top: 8px; }
.auth-btn:hover:not(:disabled) { background: #1255CC; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(26,107,255,0.35); }
.auth-btn:disabled { opacity: 0.6; cursor: not-allowed; }
.auth-btn.secondary { background: white; color: #1A6BFF; border: 2px solid #E4EAFF; margin-top: 10px; }
.field-label { display: block; font-size: 12px; font-weight: 700; color: #8A96B5; text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 7px; }
.tab-row { display: flex; background: #F4F6FB; border-radius: 12px; padding: 4px; margin-bottom: 24px; }
.tab-btn { flex: 1; padding: 10px; border: none; border-radius: 9px; font-size: 13px; font-weight: 700; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; background: transparent; color: #8A96B5; transition: all 0.2s; }
.tab-btn.active { background: white; color: #1A6BFF; box-shadow: 0 2px 8px rgba(26,107,255,0.12); }
.phone-row { display: flex; gap: 8px; }
.phone-prefix { padding: 14px 12px; border: 2px solid #E4EAFF; border-radius: 12px; font-size: 15px; font-weight: 700; color: #0D1B3E; background: #F4F6FB; white-space: nowrap; }
.otp-input { width: 100%; padding: 16px; border: 2px solid #E4EAFF; border-radius: 12px; font-size: 22px; font-weight: 800; color: #0D1B3E; text-align: center; letter-spacing: 6px; font-family: 'Plus Jakarta Sans', sans-serif; outline: none; transition: all 0.2s; }
.otp-input:focus { border-color: #1A6BFF; box-shadow: 0 0 0 4px rgba(26,107,255,0.1); }
.resend-btn { background: none; border: none; color: #1A6BFF; font-size: 13px; font-weight: 700; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; padding: 4px 0; }
.resend-btn:disabled { color: #B0BACC; cursor: not-allowed; }
`;

export default function Login() {
  const router = useRouter();
  const [loginMode, setLoginMode] = useState<"email" | "phone">("phone");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  const fullPhone = "+91" + phone.replace(/\D/g, "");

  function startResendTimer() {
    setResendTimer(30);
    const interval = setInterval(() => {
      setResendTimer((t) => { if (t <= 1) { clearInterval(interval); return 0; } return t - 1; });
    }, 1000);
  }

  async function redirectByRole(userId: string) {
    router.push("/shop-dashboard");
  }

  async function handleEmailLogin() {
    if (!email || !password) { alert("Fill all fields"); return; }
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { alert(error.message); setLoading(false); return; }
    if (data.user) await redirectByRole(data.user.id);
    setLoading(false);
  }

  async function sendPhoneOtp() {
    if (phone.replace(/\D/g, "").length < 10) { alert("Enter a valid 10-digit number"); return; }
    setLoading(true);
    // Check all profiles with this phone
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, role")
      .eq("phone", fullPhone);
    if (!profiles || profiles.length === 0) {
      alert("This number is not registered. Please sign up first.");
      setLoading(false);
      return;
    }
    const shopProfile = profiles.find((p: any) => p.role === "shopkeeper");
    if (!shopProfile) {
      // Has customer account but no shopkeeper — offer to create shopkeeper account
      if (confirm("This number has a customer account but no shopkeeper account.\n\nDo you want to register as a shopkeeper with this number?")) {
        router.push("/signup");
      }
      setLoading(false);
      return;
    }
    const { error } = await supabase.auth.signInWithOtp({ phone: fullPhone });
    if (error) { alert("Could not send OTP: " + error.message); setLoading(false); return; }
    setLoading(false);
    setOtpSent(true);
    startResendTimer();
  }

  async function verifyPhoneOtp() {
    if (otp.length < 4) { alert("Enter the OTP"); return; }
    setLoading(true);
    const { data, error } = await supabase.auth.verifyOtp({ phone: fullPhone, token: otp, type: "sms" });
    if (error) { alert("Invalid OTP: " + error.message); setLoading(false); return; }
    if (data.user) await redirectByRole(data.user.id);
    setLoading(false);
  }

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(160deg, #EBF1FF 0%, #F4F6FB 60%)", display: "flex", flexDirection: "column", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <style>{CSS}</style>

      <div style={{ background: "#1A6BFF", height: 200, borderBottomLeftRadius: "50% 40px", borderBottomRightRadius: "50% 40px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", paddingBottom: 28, marginBottom: -20, boxShadow: "0 8px 30px rgba(26,107,255,0.3)" }}>
        <div style={{ fontSize: 36, marginBottom: 4 }}>🏪</div>
        <div style={{ fontSize: 28, fontWeight: 900, color: "white", letterSpacing: "-1px" }}>Bubbry Shop</div>
        <div style={{ fontSize: 14, color: "rgba(255,255,255,0.65)", fontWeight: 500, marginTop: 4 }}>Manage your shop & orders</div>
      </div>

      <div style={{ flex: 1, padding: "36px 24px 48px", maxWidth: 420, margin: "0 auto", width: "100%" }}>
        <div style={{ background: "white", borderRadius: 20, padding: 24, boxShadow: "0 8px 40px rgba(26,107,255,0.1)", border: "1.5px solid #E4EAFF" }}>

          {/* Mode tabs */}
          <div className="tab-row">
            <button className={`tab-btn ${loginMode === "phone" ? "active" : ""}`} onClick={() => { setLoginMode("phone"); setOtpSent(false); setOtp(""); }}>
              📱 Phone OTP
            </button>
            <button className={`tab-btn ${loginMode === "email" ? "active" : ""}`} onClick={() => setLoginMode("email")}>
              ✉️ Email
            </button>
          </div>

          {/* Phone OTP login */}
          {loginMode === "phone" && !otpSent && (
            <>
              <div style={{ marginBottom: 20 }}>
                <label className="field-label">Phone Number</label>
                <div className="phone-row">
                  <div className="phone-prefix">🇮🇳 +91</div>
                  <input className="auth-input" placeholder="9876543210" type="tel" maxLength={10} value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))} style={{ flex: 1 }} />
                </div>
              </div>
              <button className="auth-btn" onClick={sendPhoneOtp} disabled={loading}>
                {loading ? "Sending OTP..." : "Send OTP →"}
              </button>
            </>
          )}

          {loginMode === "phone" && otpSent && (
            <>
              <div style={{ fontSize: 14, color: "#8A96B5", fontWeight: 600, marginBottom: 16 }}>
                OTP sent to +91 {phone}
              </div>
              <div style={{ marginBottom: 20 }}>
                <label className="field-label">Enter OTP</label>
                <input className="otp-input" placeholder="------" type="number" value={otp} onChange={(e) => setOtp(e.target.value.slice(0, 6))} />
              </div>
              <button className="auth-btn" onClick={verifyPhoneOtp} disabled={loading || otp.length < 4}>
                {loading ? "Verifying..." : "Verify & Login →"}
              </button>
              <div style={{ textAlign: "center", marginTop: 12 }}>
                <button className="resend-btn" onClick={sendPhoneOtp} disabled={resendTimer > 0 || loading}>
                  {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend OTP"}
                </button>
              </div>
              <button className="auth-btn secondary" onClick={() => { setOtpSent(false); setOtp(""); }}>← Change Number</button>
            </>
          )}

          {/* Email login */}
          {loginMode === "email" && (
            <>
              <div style={{ marginBottom: 16 }}>
                <label className="field-label">Email</label>
                <input type="email" className="auth-input" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div style={{ marginBottom: 24 }}>
                <label className="field-label">Password</label>
                <input type="password" className="auth-input" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleEmailLogin()} />
              </div>
              <button className="auth-btn" onClick={handleEmailLogin} disabled={loading}>
                {loading ? "Logging in..." : "Login →"}
              </button>
            </>
          )}
        </div>

        <p style={{ textAlign: "center", marginTop: 24, fontSize: 14, color: "#8A96B5", fontWeight: 500 }}>
          Don&apos;t have an account?{" "}
          <a href="/signup" style={{ color: "#1A6BFF", fontWeight: 700, textDecoration: "none" }}>Sign up</a>
        </p>
        <p style={{ textAlign: "center", marginTop: 12, fontSize: 13, color: "#B0BACC", fontWeight: 500 }}>
          Looking to shop?{" "}
          <a href="https://bubbry.in" style={{ color: "#1A6BFF", fontWeight: 700, textDecoration: "none" }}>Open Bubbry →</a>
        </p>
      </div>
    </div>
  );
}
