"use client";
const DATE = "18 March 2026";
const EMAIL = "support@bubbry.in";
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
.warn { background: #FFF8E6; border: 1.5px solid #FFB800; border-radius: 12px; padding: 14px; margin: 12px 0; }
.warn p { color: #946200; font-weight: 600; margin: 0; }
.info { background: #EBF1FF; border: 1.5px solid #C5D5FF; border-radius: 12px; padding: 14px; margin: 12px 0; }
.info p { color: #0D1B3E; font-weight: 600; margin: 0; }
.dark { background: #0D1B3E; border-radius: 16px; padding: 20px; margin-top: 24px; }
strong { color: #0D1B3E; font-weight: 700; }
`;
export default function ShopRefundPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#F4F6FB", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <style>{CSS}</style>
      <div className="top-bar">
        <a href="javascript:history.back()" className="back-btn">←</a>
        <div className="title">Seller Refund Policy</div>
      </div>
      <div className="page">
        <h1>Seller Refund &amp; Dispute Policy</h1>
        <div className="badge">Last updated: {DATE}</div>
        <div className="warn"><p>⚠️ As a Seller on Bubbry, you are the primary party responsible for resolving customer refund requests. Bubbry acts as a facilitator only.</p></div>

        <div className="card">
          <h2>1. Seller Refund Obligations</h2>
          <p>As a registered Seller, you agree to handle refunds in the following cases:</p>
          <ul>
            <li>Wrong product delivered (different from what customer ordered)</li>
            <li>Significantly damaged product at time of delivery</li>
            <li>Expired or unfit-for-consumption product delivered</li>
            <li>Order paid for but not fulfilled by you</li>
          </ul>
          <p>Refunds must be initiated within <strong>5-7 business days</strong> of a valid claim being raised by the customer.</p>
        </div>

        <div className="card">
          <h2>2. How Refunds Must Be Processed</h2>
          <ul>
            <li>Refunds must be returned to the customer's original payment method (UPI)</li>
            <li>For COD orders — the 20% UPI advance must be refunded if you fail to fulfill the order</li>
            <li>Cash payments are to be refunded in cash at the point of pickup or via UPI transfer</li>
            <li>Keep records of all refund transactions for your own tax and legal compliance</li>
          </ul>
          <div className="info"><p>💡 You are encouraged to resolve refund disputes promptly. Consistent refusal to process valid refunds will result in account suspension and may be reported to consumer protection authorities.</p></div>
        </div>

        <div className="card">
          <h2>3. Non-Refundable Situations</h2>
          <p>You are NOT required to issue refunds in these cases:</p>
          <ul>
            <li>Customer changes their mind after order is fulfilled</li>
            <li>Perishable items (dairy, cooked food, bread) — unless clearly defective</li>
            <li>Customer fails to collect a pickup order after confirmation</li>
            <li>Damage caused by customer after delivery</li>
            <li>Complaints raised more than 24 hours after delivery</li>
          </ul>
        </div>

        <div className="card">
          <h2>4. COD Advance Policy for Sellers</h2>
          <ul>
            <li>When a customer places a COD order, they pay 20% upfront via UPI to your account</li>
            <li>This 20% advance is to secure the order and reduce cancellations</li>
            <li>If YOU cancel or fail to fulfill a confirmed COD order, you must refund the 20% advance to the customer</li>
            <li>Refusal to refund the advance for your own non-fulfillment may result in account action</li>
          </ul>
        </div>

        <div className="card">
          <h2>5. Dispute Escalation</h2>
          <ul>
            <li>Unresolved disputes may be escalated to Bubbry by the customer</li>
            <li>Bubbry will attempt to mediate but cannot compel refunds</li>
            <li>Repeated unresolved disputes are grounds for account suspension</li>
            <li>Serious fraud complaints may be referred to law enforcement</li>
          </ul>
        </div>

        <div className="card">
          <h2>6. Bubbry's Role</h2>
          <div className="warn"><p>⚠️ Bubbry is a technology platform only. We do not hold funds, process payments, or guarantee refunds. All payment and refund responsibility lies entirely with the Seller.</p></div>
        </div>

        <div className="dark">
          <h2 style={{color:"white",borderColor:"rgba(255,255,255,0.3)"}}>Contact Seller Support</h2>
          <p style={{color:"rgba(255,255,255,0.7)",marginTop:8}}>For disputes or escalations:</p>
          <p style={{color:"rgba(255,255,255,0.7)"}}>Email: <a href={"mailto:"+EMAIL} style={{color:"#60A5FA"}}>{EMAIL}</a></p>
          <p style={{color:"rgba(255,255,255,0.7)"}}>Response time: Within 24 business hours</p>
        </div>
      </div>
    </div>
  );
}
