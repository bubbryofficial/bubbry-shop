"use client";
const COMPANY = "Bubbry Technologies Private Limited";
const EMAIL = "privacy@bubbry.in";
const DATE = "18 March 2026";
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
* { box-sizing: border-box; margin: 0; padding: 0; }
.top-bar { background: #1A6BFF; padding: 16px 20px; display: flex; align-items: center; gap: 12px; position: sticky; top: 0; z-index: 100; }
.back-btn { width: 36px; height: 36px; background: rgba(255,255,255,0.18); border-radius: 10px; display: flex; align-items: center; justify-content: center; text-decoration: none; font-size: 18px; color: white; }
.title { font-size: 18px; font-weight: 900; color: white; }
.page { max-width: 720px; margin: 0 auto; padding: 28px 20px 60px; font-family: 'Plus Jakarta Sans', sans-serif; }
.badge { font-size: 12px; color: #8A96B5; font-weight: 600; margin-bottom: 24px; background: white; border-radius: 10px; padding: 10px 14px; border: 1.5px solid #E4EAFF; }
h1 { font-size: 22px; font-weight: 900; color: #0D1B3E; margin-bottom: 6px; }
h2 { font-size: 16px; font-weight: 800; color: #0D1B3E; margin: 0 0 10px; padding-left: 12px; border-left: 4px solid #1A6BFF; }
p { font-size: 14px; color: #4A5880; font-weight: 500; line-height: 1.75; margin-bottom: 12px; }
ul { padding-left: 20px; margin-bottom: 12px; }
li { font-size: 14px; color: #4A5880; font-weight: 500; line-height: 1.75; margin-bottom: 6px; }
.card { background: white; border-radius: 16px; border: 1.5px solid #E4EAFF; padding: 20px; margin-bottom: 16px; }
.info { background: #EBF1FF; border: 1.5px solid #C5D5FF; border-radius: 12px; padding: 14px; margin: 12px 0; }
.info p { color: #0D1B3E; font-weight: 600; margin: 0; }
.dark { background: #0D1B3E; border-radius: 16px; padding: 20px; margin-top: 24px; }
strong { color: #0D1B3E; font-weight: 700; }
`;
export default function ShopPrivacyPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#F4F6FB", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <style>{CSS}</style>
      <div className="top-bar">
        <a href="javascript:history.back()" className="back-btn">←</a>
        <div className="title">Seller Privacy Policy</div>
      </div>
      <div className="page">
        <h1>Seller Privacy Policy</h1>
        <div className="badge">Last updated: {DATE} · Compliant with IT Act 2000 &amp; PDPB 2023</div>
        <div className="card">
          <h2>1. Information We Collect from Sellers</h2>
          <ul>
            <li><strong>Identity:</strong> Full name, phone number, email address</li>
            <li><strong>Business Data:</strong> Shop name, shopfront photo, business address</li>
            <li><strong>Financial Data:</strong> UPI ID (not bank passwords or PINs)</li>
            <li><strong>Location:</strong> Shop GPS coordinates for customer discovery</li>
            <li><strong>Product Data:</strong> Product names, prices, images, stock levels</li>
            <li><strong>Order Data:</strong> Order history, handoff photos, transaction records</li>
            <li><strong>Device Data:</strong> Device type, OS, IP address, app version</li>
          </ul>
        </div>
        <div className="card">
          <h2>2. How We Use Your Information</h2>
          <ul>
            <li>To verify your shop and approve your account</li>
            <li>To display your shop and products to nearby customers</li>
            <li>To process and route orders to you</li>
            <li>To send OTP verification and operational notifications via SMS</li>
            <li>To resolve disputes and investigate complaints</li>
            <li>To comply with legal and regulatory obligations</li>
            <li>To prevent fraud and ensure platform integrity</li>
          </ul>
          <div className="info"><p>🔒 We do NOT sell your business or personal data to third parties for marketing.</p></div>
        </div>
        <div className="card">
          <h2>3. Data Shared with Customers</h2>
          <p>The following information is visible to customers on the platform:</p>
          <ul>
            <li>Shop name and shopfront photo</li>
            <li>Shop location (approximate distance)</li>
            <li>Product listings, prices, and images</li>
            <li>Delivery and pickup availability status</li>
          </ul>
          <p>The following is shared only with customers who place orders:</p>
          <ul>
            <li>Your UPI ID (for payment)</li>
            <li>Your phone number (for order coordination)</li>
          </ul>
        </div>
        <div className="card">
          <h2>4. Data Sharing with Third Parties</h2>
          <ul>
            <li><strong>Supabase:</strong> Secure cloud database storage</li>
            <li><strong>Twilio:</strong> OTP SMS delivery</li>
            <li><strong>Law Enforcement:</strong> When required by Indian law or court order</li>
          </ul>
        </div>
        <div className="card">
          <h2>5. Data Retention</h2>
          <ul>
            <li>Account data deleted within 30 days of account closure</li>
            <li>Order and transaction records retained for 7 years for legal/tax compliance</li>
            <li>Shopfront photos retained until account deletion</li>
            <li>Request deletion by emailing {EMAIL}</li>
          </ul>
        </div>
        <div className="card">
          <h2>6. Your Rights</h2>
          <ul>
            <li>Access and review personal data we hold</li>
            <li>Correct inaccurate information</li>
            <li>Request data deletion (subject to legal retention obligations)</li>
            <li>Withdraw consent by closing your account</li>
            <li>File a complaint with India's Data Protection Board</li>
          </ul>
        </div>
        <div className="card">
          <h2>7. Security</h2>
          <p>We use SSL/TLS encryption, secure database access controls, OTP authentication, and role-based access. We never store UPI PINs, bank passwords, or sensitive financial credentials. Despite best efforts, no system is 100% secure.</p>
        </div>
        <div className="dark">
          <h2 style={{color:"white",borderColor:"rgba(255,255,255,0.3)"}}>Data Protection Officer</h2>
          <p style={{color:"rgba(255,255,255,0.7)",marginTop:8}}>{COMPANY}</p>
          <p style={{color:"rgba(255,255,255,0.7)"}}>Haldwani, Uttarakhand — 263139, India</p>
          <p style={{color:"rgba(255,255,255,0.7)"}}>Email: <a href={"mailto:"+EMAIL} style={{color:"#60A5FA"}}>{EMAIL}</a></p>
        </div>
      </div>
    </div>
  );
}
