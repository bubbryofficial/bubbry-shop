"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import { setCurrentSession } from "../../lib/session";

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
.otp-input { width: 100%; padding: 16px; border: 2px solid #E4EAFF; border-radius: 12px; font-size: 22px; font-weight: 800; color: #0D1B3E; text-align: center; letter-spacing: 6px; font-family: 'Plus Jakarta Sans', sans-serif; outline: none; transition: all 0.2s; }
.otp-input:focus { border-color: #1A6BFF; box-shadow: 0 0 0 4px rgba(26,107,255,0.1); }
.resend-btn { background: none; border: none; color: #1A6BFF; font-size: 13px; font-weight: 700; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; padding: 4px 0; }
.resend-btn:disabled { color: #B0BACC; cursor: not-allowed; }
.link-btn { background: none; border: none; color: #1A6BFF; font-size: 13px; font-weight: 700; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; padding: 0; }
`;

type Mode = "otp" | "password";

export default function Login() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("otp");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [forgot, setForgot] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  const cleanEmail = email.trim().toLowerCase();

  function startResendTimer() {
    setResendTimer(30);
    const interval = setInterval(() => {
      setResendTimer((t) => { if (t <= 1) { clearInterval(interval); return 0; } return t - 1; });
    }, 1000);
  }

  async function ensureShopkeeper(): Promise<boolean> {
    const { data: profiles } = await supabase.from("profiles").select("id, role").eq("email", cleanEmail);
    if (!profiles || profiles.length === 0) { alert("This email is not registered. Please sign up first."); return false; }
    const shop = profiles.find((p: any) => p.role === "shopkeeper");
    if (!shop) {
      if (confirm("This email has a customer account but no shopkeeper account.\n\nRegister as a shopkeeper?")) router.push("/signup");
      return false;
    }
    return true;
  }

  async function loginWithPassword() {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) { alert("Enter a valid email address"); return; }
    if (!password) { alert("Enter your password"); return; }
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email: cleanEmail, password });
    if (error || !data?.user) {
      alert(error?.message === "Invalid login credentials"
        ? "Wrong email or password. If you've never set a password, use Email OTP or tap 'Forgot password'."
        : (error?.message || "Login failed"));
      setLoading(false); return;
    }
    localStorage.setItem("bubbry_shop_uid", data.user.id);
    await setCurrentSession(data.user.id);
    setLoading(false);
    router.push("/shop-dashboard");
  }

  async function sendEmailOtp() {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) { alert("Enter a valid email address"); return; }
    setLoading(true);
    if (!(await ensureShopkeeper())) { setLoading(false); return; }
    const { error } = await supabase.auth.signInWithOtp({ email: cleanEmail, options: { shouldCreateUser: false } });
    if (error) { alert(error.message || "Failed to send OTP"); setLoading(false); return; }
    setLoading(false); setOtpSent(true); startResendTimer();
  }

  async function verifyEmailOtp() {
    if (otp.length < 6) { alert("Enter the 6-digit OTP"); return; }
    setLoading(true);
    const { data, error } = await supabase.auth.verifyOtp({ email: cleanEmail, token: otp, type: "email" });
    if (error || !data?.user) { alert(error?.message || "Invalid OTP"); setLoading(false); return; }

    if (forgot) {
      if (!newPassword || newPassword.length < 6) { alert("Enter a new password (at least 6 characters)"); setLoading(false); return; }
      const { error: upErr } = await supabase.auth.updateUser({ password: newPassword });
      if (upErr) { alert("Could not set password: " + upErr.message); setLoading(false); return; }
      alert("✓ Password updated. You're now logged in.");
    }

    localStorage.setItem("bubbry_shop_uid", data.user.id);
    await setCurrentSession(data.user.id);
    setLoading(false);
    router.push("/shop-dashboard");
  }

  async function startForgot() {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) { alert("Enter your email first, then tap Forgot password"); return; }
    setLoading(true);
    if (!(await ensureShopkeeper())) { setLoading(false); return; }
    const { error } = await supabase.auth.signInWithOtp({ email: cleanEmail, options: { shouldCreateUser: false } });
    if (error) { alert(error.message || "Failed to send OTP"); setLoading(false); return; }
    setLoading(false);
    setForgot(true); setMode("otp"); setOtpSent(true); startResendTimer();
  }

  function resetToStart() { setOtpSent(false); setOtp(""); setForgot(false); setNewPassword(""); }

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

          {!otpSent && (
            <div className="tab-row">
              <button className={`tab-btn ${mode === "otp" ? "active" : ""}`} onClick={() => { setMode("otp"); resetToStart(); }}>Email OTP</button>
              <button className={`tab-btn ${mode === "password" ? "active" : ""}`} onClick={() => { setMode("password"); resetToStart(); }}>Password</button>
            </div>
          )}

          {mode === "password" && !otpSent && (
            <>
              <div style={{ marginBottom: 16 }}>
                <label className="field-label">Email Address</label>
                <input className="auth-input" placeholder="you@example.com" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div style={{ marginBottom: 14 }}>
                <label className="field-label">Password</label>
                <input className="auth-input" placeholder="Your password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <div style={{ textAlign: "right", marginBottom: 8 }}>
                <button className="link-btn" onClick={startForgot} disabled={loading}>Forgot password?</button>
              </div>
              <button className="auth-btn" onClick={loginWithPassword} disabled={loading}>
                {loading ? "Logging in..." : "Login →"}
              </button>
            </>
          )}

          {mode === "otp" && !otpSent && (
            <>
              <div style={{ marginBottom: 20 }}>
                <label className="field-label">Email Address</label>
                <input className="auth-input" placeholder="you@example.com" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <button className="auth-btn" onClick={sendEmailOtp} disabled={loading}>
                {loading ? "Sending OTP..." : "Send OTP →"}
              </button>
            </>
          )}

          {otpSent && (
            <>
              <div style={{ fontSize: 14, color: "#8A96B5", fontWeight: 600, marginBottom: 16 }}>
                {forgot ? "Reset password — " : ""}OTP sent to {cleanEmail}
              </div>
              <div style={{ marginBottom: forgot ? 16 : 20 }}>
                <label className="field-label">Enter OTP</label>
                <input className="otp-input" placeholder="------" type="number" value={otp} onChange={(e) => setOtp(e.target.value.slice(0, 6))} />
              </div>
              {forgot && (
                <div style={{ marginBottom: 16 }}>
                  <label className="field-label">New Password</label>
                  <input className="auth-input" placeholder="At least 6 characters" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                </div>
              )}
              <button className="auth-btn" onClick={verifyEmailOtp} disabled={loading || otp.length < 6}>
                {loading ? "Verifying..." : forgot ? "Set password & Login →" : "Verify & Login →"}
              </button>
              <div style={{ textAlign: "center", marginTop: 12 }}>
                <button className="resend-btn" onClick={forgot ? startForgot : sendEmailOtp} disabled={resendTimer > 0 || loading}>
                  {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend OTP"}
                </button>
              </div>
              <button className="auth-btn secondary" onClick={() => resetToStart()}>← Back</button>
            </>
          )}
        </div>

        <p style={{ textAlign: "center", marginTop: 24, fontSize: 14, color: "#8A96B5", fontWeight: 500 }}>
          Don&apos;t have an account?{" "}
          <a href="/signup" style={{ color: "#1A6BFF", fontWeight: 700, textDecoration: "none" }}>Sign up</a>
        </p>
        <p style={{ textAlign: "center", marginTop: 12, fontSize: 13, color: "#B0BACC", fontWeight: 500 }}>
          Looking to shop?{" "}
          <a href="https://bubbry.co.in" style={{ color: "#1A6BFF", fontWeight: 700, textDecoration: "none" }}>Open Bubbry →</a>
        </p>
      </div>
    </div>
  );
}
