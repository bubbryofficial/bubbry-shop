"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) router.replace("/shop-dashboard");
    });
  }, []);

  return (
    <main style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0D1B3E 0%, #1A3A8F 50%, #1A6BFF 100%)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "40px 24px",
      fontFamily: "'Plus Jakarta Sans', sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; }
        .bubble {
          position: absolute;
          border-radius: 50%;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
        }
        .hero-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 16px 32px;
          border-radius: 14px;
          font-size: 16px;
          font-weight: 800;
          text-decoration: none;
          transition: all 0.2s;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .hero-btn:hover { transform: translateY(-2px); }
        .feature-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.15);
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 600;
          color: rgba(255,255,255,0.85);
        }
      `}</style>

      {/* Background bubbles */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
        <div className="bubble" style={{ width: 300, height: 300, top: -80, right: -80 }} />
        <div className="bubble" style={{ width: 200, height: 200, bottom: 100, left: -60 }} />
        <div className="bubble" style={{ width: 120, height: 120, bottom: 200, right: 60 }} />
      </div>

      <div style={{ position: "relative", textAlign: "center", maxWidth: 400 }}>
        {/* Logo */}
        <div style={{ fontSize: 56, marginBottom: 16 }}>🫧</div>
        <h1 style={{
          fontSize: 52,
          fontWeight: 900,
          color: "white",
          letterSpacing: "-2px",
          lineHeight: 1,
          marginBottom: 8,
        }}>
          Bubbry
        </h1>
        <p style={{
          fontSize: 16,
          color: "rgba(255,255,255,0.6)",
          fontWeight: 500,
          marginBottom: 32,
        }}>
          Your local shop, on your phone.
        </p>

        {/* Feature pills */}
        <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", marginBottom: 44 }}>
          <div className="feature-pill">📍 Nearby shops</div>
          <div className="feature-pill">⚡ Fast delivery</div>
          <div className="feature-pill">🛒 Easy orders</div>
        </div>

        {/* CTAs */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <a href="/signup" className="hero-btn" style={{
            background: "white",
            color: "#1A6BFF",
            boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
          }}>
            Create Account
          </a>
          <a href="/login" className="hero-btn" style={{
            background: "rgba(255,255,255,0.12)",
            color: "white",
            border: "1.5px solid rgba(255,255,255,0.25)",
          }}>
            Login
          </a>
        </div>
      </div>
    </main>
  );
}
