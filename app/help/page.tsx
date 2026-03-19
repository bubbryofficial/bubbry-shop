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
.top-bar { background: #1A6BFF; padding: 16px 20px 20px; position: sticky; top: 0; z-index: 100; box-shadow: 0 4px 20px rgba(26,107,255,0.25); }
.top-row { display: flex; align-items: center; gap: 12px; }
.back-btn { background: rgba(255,255,255,0.18); border: 1.5px solid rgba(255,255,255,0.28); color: white; width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 16px; cursor: pointer; text-decoration: none; flex-shrink: 0; }
.top-title { font-size: 18px; font-weight: 900; color: white; letter-spacing: -0.3px; }
.top-sub { font-size: 12px; color: rgba(255,255,255,0.7); font-weight: 500; margin-top: 1px; }
.online-dot { width: 8px; height: 8px; border-radius: 50%; background: #4ADE80; box-shadow: 0 0 0 2px rgba(74,222,128,0.3); flex-shrink: 0; animation: pulse 2s infinite; }
@keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }
.chat-area { flex: 1; overflow-y: auto; padding: 16px; display: flex; flex-direction: column; gap: 12px; padding-bottom: 100px; }
.msg { max-width: 82%; display: flex; flex-direction: column; gap: 3px; }
.msg.bot { align-self: flex-start; }
.msg.user { align-self: flex-end; }
.bubble { padding: 12px 15px; border-radius: 18px; font-size: 14px; font-weight: 500; line-height: 1.55; }
.bubble.bot { background: white; color: #0D1B3E; border-bottom-left-radius: 5px; box-shadow: 0 2px 10px rgba(26,107,255,0.08); border: 1.5px solid #E4EAFF; }
.bubble.user { background: #1A6BFF; color: white; border-bottom-right-radius: 5px; }
.msg-time { font-size: 10px; color: #B0BACC; font-weight: 600; padding: 0 4px; }
.msg.user .msg-time { text-align: right; }
.typing-bubble { background: white; border: 1.5px solid #E4EAFF; border-radius: 18px; border-bottom-left-radius: 5px; padding: 14px 18px; display: flex; gap: 5px; align-items: center; box-shadow: 0 2px 10px rgba(26,107,255,0.08); }
.typing-dot { width: 7px; height: 7px; border-radius: 50%; background: #B0BACC; animation: typing 1.2s infinite; }
.typing-dot:nth-child(2) { animation-delay: 0.2s; }
.typing-dot:nth-child(3) { animation-delay: 0.4s; }
@keyframes typing { 0%,60%,100% { transform: translateY(0); opacity: 0.4; } 30% { transform: translateY(-5px); opacity: 1; } }
.input-area { position: fixed; bottom: 68px; left: 0; right: 0; background: white; border-top: 1.5px solid #E4EAFF; padding: 10px 14px; display: flex; gap: 10px; align-items: flex-end; box-shadow: 0 -4px 20px rgba(26,107,255,0.06); z-index: 50; }
.chat-input { flex: 1; padding: 12px 14px; border: 2px solid #E4EAFF; border-radius: 14px; font-size: 14px; font-weight: 500; color: #0D1B3E; font-family: 'Plus Jakarta Sans', sans-serif; outline: none; resize: none; min-height: 44px; max-height: 100px; transition: border-color 0.2s; line-height: 1.4; }
.chat-input:focus { border-color: #1A6BFF; }
.send-btn { width: 44px; height: 44px; border-radius: 12px; background: #1A6BFF; border: none; color: white; font-size: 18px; cursor: pointer; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: all 0.2s; }
.send-btn:hover:not(:disabled) { background: #1255CC; transform: scale(1.05); }
.send-btn:disabled { opacity: 0.45; cursor: not-allowed; transform: none; }
.quick-chips { display: flex; gap: 8px; overflow-x: auto; padding: 0 16px 12px; scrollbar-width: none; }
.quick-chips::-webkit-scrollbar { display: none; }
.chip { background: white; border: 1.5px solid #E4EAFF; border-radius: 20px; padding: 8px 14px; font-size: 12px; font-weight: 700; color: #1A6BFF; cursor: pointer; white-space: nowrap; font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.2s; flex-shrink: 0; }
.chip:hover { background: #EBF1FF; border-color: #1A6BFF; }
.avatar { width: 28px; height: 28px; border-radius: 50%; background: linear-gradient(135deg, #1A6BFF, #6B35FF); display: flex; align-items: center; justify-content: center; font-size: 14px; flex-shrink: 0; }
.msg-row { display: flex; align-items: flex-end; gap: 8px; }
.msg-row.user { flex-direction: row-reverse; }
.bottom-nav { position: fixed; bottom: 0; left: 0; right: 0; height: 68px; background: white; border-top: 1.5px solid #E4EAFF; display: flex; align-items: center; box-shadow: 0 -4px 20px rgba(26,107,255,0.07); z-index: 100; }
.nav-item { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 3px; padding: 8px 0; text-decoration: none; color: #B0BACC; font-size: 10px; font-weight: 700; transition: color 0.15s; }
.nav-item.active { color: #1A6BFF; }
.nav-icon { font-size: 20px; }
.welcome-card { background: linear-gradient(135deg, #1A6BFF 0%, #6B35FF 100%); border-radius: 18px; padding: 20px; margin: 0 0 4px; color: white; }
.welcome-card-title { font-size: 16px; font-weight: 900; margin-bottom: 4px; }
.welcome-card-sub { font-size: 12px; opacity: 0.8; font-weight: 500; line-height: 1.5; }
`;

type Message = { role: "user" | "bot"; text: string; time: string };

const QUICK_CHIPS_CUSTOMER = [
  "Track my order",
  "How to place an order?",
  "Payment failed",
  "Wrong item delivered",
  "How to cancel order?",
  "Change delivery address",
];

const QUICK_CHIPS_SHOPKEEPER = [
  "How to go live?",
  "Add products to stock",
  "Order not showing",
  "How to accept orders?",
  "Shopfront approval",
  "Update my inventory",
];

function getTime() {
  return new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
}

const SYSTEM_PROMPT_CUSTOMER = `You are Bubble, a friendly and helpful AI support assistant for Bubbry — a hyperlocal quick-commerce app in India where customers can order everyday products from nearby local shops for fast delivery or pickup.

You help customers with:
- Placing and tracking orders
- Delivery and pickup queries
- Payment issues
- Cancellations and returns
- Finding products and shops nearby
- Account and login issues

Keep responses short, friendly, and helpful. Use simple English. Add emojis occasionally to keep it warm. If you can't resolve something, say "I'll connect you with our support team" and ask them to email support@bubbry.in. Never make up order details — ask the customer to share their order ID if needed.`;

const SYSTEM_PROMPT_SHOPKEEPER = `You are Bubble, a friendly and helpful AI support assistant for Bubbry — a hyperlocal quick-commerce app in India where local shopkeepers list their products and receive orders from nearby customers.

You help shopkeepers with:
- Going live / offline on the platform
- Adding and managing products and inventory
- Accepting, managing and completing orders
- Shopfront photo verification process
- Delivery and pickup settings
- Account, profile and payment issues
- Using the shop dashboard features

Keep responses short, practical, and friendly. Use simple English. Add emojis occasionally. If you can't resolve something, ask them to email support@bubbry.in. For the shopfront verification: shopkeepers upload a photo during signup, an admin reviews it (usually within 24 hours), and only after approval can they go live.`;

export default function HelpPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<"customer" | "shopkeeper">("customer");
  const [history, setHistory] = useState<{ role: string; content: string }[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // Detect role from profile
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const { data } = await supabase.from("profiles").select("role").eq("id", session.user.id).single();
        const userRole = data?.role === "shopkeeper" ? "shopkeeper" : "customer";
        setRole(userRole);
        const greeting = userRole === "shopkeeper"
          ? "Hey there! 👋 I'm **Bubble**, your Bubbry support assistant.\n\nI can help you with managing your shop, adding products, orders, going live, and more. What do you need help with?"
          : "Hey there! 👋 I'm **Bubble**, your Bubbry support assistant.\n\nI can help you with your orders, deliveries, payments, and anything else. What can I help you with today?";
        setMessages([{ role: "bot", text: greeting, time: getTime() }]);
      } else {
        setMessages([{ role: "bot", text: "Hey there! 👋 I'm **Bubble**, your Bubbry support assistant. How can I help you today?", time: getTime() }]);
      }
    });
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage(text?: string) {
    const msgText = (text || input).trim();
    if (!msgText || loading) return;
    setInput("");

    const userMsg: Message = { role: "user", text: msgText, time: getTime() };
    setMessages((prev) => [...prev, userMsg]);

    const newHistory = [...history, { role: "user", content: msgText }];
    setHistory(newHistory);
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: SYSTEM_PROMPT_SHOPKEEPER,
          messages: newHistory,
        }),
      });
      const data = await response.json();
      // Surface API errors clearly
      if (data.error) {
        const errMsg = typeof data.error === "string" ? data.error : JSON.stringify(data.error);
        setMessages((prev) => [...prev, { role: "bot", text: "⚠️ API Error: " + errMsg, time: getTime() }]);
        setLoading(false);
        return;
      }
      if (data.type === "error") {
        setMessages((prev) => [...prev, { role: "bot", text: "⚠️ " + (data.error?.message || "Unknown error from Anthropic"), time: getTime() }]);
        setLoading(false);
        return;
      }
      const reply = data.content?.[0]?.text || "Sorry, I couldn't get a response. Please try again.";
      const botMsg: Message = { role: "bot", text: reply, time: getTime() };
      setMessages((prev) => [...prev, botMsg]);
      setHistory((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (err: any) {
      setMessages((prev) => [...prev, { role: "bot", text: "⚠️ Network error: " + err.message, time: getTime() }]);
    }
    setLoading(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  function renderText(text: string) {
    // Simple bold markdown support
    return text.split("\n").map((line, i) => (
      <span key={i}>
        {line.split(/\*\*(.*?)\*\*/g).map((part, j) =>
          j % 2 === 1 ? <strong key={j}>{part}</strong> : part
        )}
        {i < text.split("\n").length - 1 && <br />}
      </span>
    ));
  }

  const chips = role === "shopkeeper" ? QUICK_CHIPS_SHOPKEEPER : QUICK_CHIPS_CUSTOMER;
  const backHref = "/shop-dashboard";

  return (
    <div style={{ minHeight: "100vh", background: "#F4F6FB", fontFamily: "'Plus Jakarta Sans', sans-serif", display: "flex", flexDirection: "column" }}>
      <style>{CSS}</style>

      {/* Header */}
      <div className="top-bar">
        <div className="top-row">
          <a href={backHref} className="back-btn">←</a>
          <div className="avatar">🫧</div>
          <div style={{ flex: 1 }}>
            <div className="top-title">Bubble Support</div>
            <div className="top-sub" style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div className="online-dot" />
              Always online · AI Assistant
            </div>
          </div>
        </div>
      </div>

      {/* Quick chips */}
      <div className="quick-chips" style={{ paddingTop: 14 }}>
        {chips.map((chip) => (
          <button key={chip} className="chip" onClick={() => sendMessage(chip)}>{chip}</button>
        ))}
      </div>

      {/* Chat messages */}
      <div className="chat-area">
        {messages.map((msg, i) => (
          <div key={i} className={`msg-row ${msg.role === "user" ? "user" : ""}`}>
            {msg.role === "bot" && <div className="avatar">🫧</div>}
            <div className={`msg ${msg.role === "bot" ? "bot" : "user"}`}>
              <div className={`bubble ${msg.role === "bot" ? "bot" : "user"}`}>
                {renderText(msg.text)}
              </div>
              <div className="msg-time">{msg.time}</div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="msg-row">
            <div className="avatar">🫧</div>
            <div className="typing-bubble">
              <div className="typing-dot" />
              <div className="typing-dot" />
              <div className="typing-dot" />
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <div className="input-area">
        <textarea
          ref={inputRef}
          className="chat-input"
          placeholder="Type your question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
        />
        <button className="send-btn" onClick={() => sendMessage()} disabled={!input.trim() || loading}>
          ➤
        </button>
      </div>

      {/* Bottom nav */}
      <nav className="bottom-nav">
            <a href="/shop-dashboard" className="nav-item"><div className="nav-icon">🏠</div>Home</a>
            <a href="/add-product" className="nav-item"><div className="nav-icon">➕</div>Add</a>
            <a href="/shop-orders" className="nav-item"><div className="nav-icon">📋</div>Orders</a>
            <a href="/help" className="nav-item active"><div className="nav-icon">💬</div>Help</a>
      </nav>
    </div>
  );
}
