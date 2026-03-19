"use client";
const COMPANY = "Bubbry Technologies Private Limited";
const APP = "Bubbry Shop";
const EMAIL = "legal@bubbry.in";
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
.card { background: white; border-radius: 16px; border: 1.5px solid #E4EAFF; padding: 20px; margin-bottom: 16px; box-shadow: 0 2px 8px rgba(26,107,255,0.05); }
.info { background: #EBF1FF; border: 1.5px solid #C5D5FF; border-radius: 12px; padding: 14px; margin: 12px 0; }
.info p { color: #0D1B3E; font-weight: 600; margin: 0; }
.warn { background: #FFF8E6; border: 1.5px solid #FFB800; border-radius: 12px; padding: 14px; margin: 12px 0; }
.warn p { color: #946200; font-weight: 600; margin: 0; }
.dark { background: #0D1B3E; border-radius: 16px; padding: 20px; margin-top: 24px; }
strong { color: #0D1B3E; font-weight: 700; }
`;
export default function ShopTermsPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#F4F6FB", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <style>{CSS}</style>
      <div className="top-bar">
        <a href="javascript:history.back()" className="back-btn">←</a>
        <div className="title">Seller Terms & Conditions</div>
      </div>
      <div className="page">
        <h1>Seller Terms and Conditions</h1>
        <div className="badge">Last updated: {DATE} · Effective immediately upon account creation and OTP verification</div>

        <div className="warn"><p>⚠️ By creating a Bubbry Shop account and verifying your phone number via OTP, you confirm that you have read, understood, and agreed to these Seller Terms. This constitutes a legally binding agreement between you ("Seller") and {COMPANY}.</p></div>

        <div className="card">
          <h2>1. Acceptance of Terms</h2>
          <p>These Seller Terms govern your registration and use of the <strong>{APP}</strong> platform operated by <strong>{COMPANY}</strong> ("Company", "we", "us"). By completing OTP verification during signup, you acknowledge:</p>
          <ul>
            <li>You are at least 18 years of age and legally competent to contract</li>
            <li>You are the owner or authorized representative of the shop/business</li>
            <li>You accept these Terms without modification</li>
            <li>Your OTP verification is your electronic signature under the IT Act, 2000</li>
            <li>You have obtained all necessary licenses, permits, and registrations required to operate your business</li>
          </ul>
          <div className="info"><p>📱 Your OTP verification constitutes a legally valid digital consent and electronic signature under the Information Technology Act, 2000 and the Electronic Signatures Rules, 2015.</p></div>
        </div>

        <div className="card">
          <h2>2. Seller Eligibility and Onboarding</h2>
          <p>To become a Seller on {APP}, you must:</p>
          <ul>
            <li>Have a valid physical shop or business location in India</li>
            <li>Submit a clear photograph of your shopfront for verification</li>
            <li>Provide a valid UPI ID for receiving payments</li>
            <li>Provide accurate business and personal information</li>
            <li>Comply with all local, state, and national laws including GST, FSSAI (for food items), and Shop and Establishment Act</li>
          </ul>
          <p>The Company reserves the right to reject or revoke any Seller account at its sole discretion without assigning any reason.</p>
        </div>

        <div className="card">
          <h2>3. Shopfront Verification</h2>
          <ul>
            <li>Your shopfront photo will be reviewed and approved by a Bubbry admin before you can go live</li>
            <li>Submitting false, misleading, or stock photos will result in immediate account termination</li>
            <li>Approval is at the Company's sole discretion and may be revoked at any time</li>
            <li>You must notify us of any significant change to your shop's physical location or appearance</li>
          </ul>
        </div>

        <div className="card">
          <h2>4. Product Listings and Inventory</h2>
          <p>As a Seller, you are solely responsible for:</p>
          <ul>
            <li>The accuracy of all product names, descriptions, prices, and stock quantities</li>
            <li>Ensuring all listed products are genuine, legal, and fit for sale</li>
            <li>Not listing counterfeit, expired, banned, or hazardous products</li>
            <li>Maintaining accurate stock levels to prevent order failures</li>
            <li>Complying with all applicable product safety and labeling laws</li>
            <li>Obtaining required licenses for regulated products (medicines, alcohol, etc.)</li>
          </ul>
          <div className="warn"><p>⚠️ Listing counterfeit, expired, or illegal products is grounds for immediate termination and may result in legal action.</p></div>
        </div>

        <div className="card">
          <h2>5. Order Fulfillment Obligations</h2>
          <p>Upon receiving an order, you agree to:</p>
          <ul>
            <li>Acknowledge orders within a reasonable time</li>
            <li>Fulfill accepted orders promptly and accurately</li>
            <li>Deliver the exact products ordered in proper condition</li>
            <li>Maintain records of handoff with photo proof where required</li>
            <li>Handle customer queries and complaints professionally</li>
            <li>Not cancel orders without valid reason after acceptance</li>
          </ul>
          <p>Consistent order failures, cancellations, or complaints may result in account suspension.</p>
        </div>

        <div className="card">
          <h2>6. Payments and UPI</h2>
          <ul>
            <li>All customer payments go directly to your registered UPI ID</li>
            <li>The Company does not collect, hold, or process any payments on your behalf</li>
            <li>You are solely responsible for managing your UPI account and payment disputes</li>
            <li>You must provide valid UPI details and keep them updated</li>
            <li>The Company charges no commission currently but reserves the right to introduce service fees with 30 days' notice</li>
            <li>You are responsible for all applicable taxes including GST on your sales</li>
          </ul>
          <div className="info"><p>💳 Bubbry does not take any cut from your sales. 100% of customer payments go directly to your UPI ID.</p></div>
        </div>

        <div className="card">
          <h2>7. Refunds and Customer Disputes</h2>
          <ul>
            <li>You are solely responsible for handling refund requests from customers</li>
            <li>Refunds must be processed within 5-7 business days where applicable</li>
            <li>The Company may mediate disputes but cannot compel refunds on your behalf</li>
            <li>Consistent refusal to process valid refunds may result in account suspension</li>
            <li>The Company is not liable for any payment disputes between you and customers</li>
          </ul>
        </div>

        <div className="card">
          <h2>8. Prohibited Conduct</h2>
          <p>You must NOT:</p>
          <ul>
            <li>List or sell illegal, banned, or regulated substances without proper licensing</li>
            <li>Engage in price gouging or deceptive pricing</li>
            <li>Harass, threaten, or abuse customers</li>
            <li>Manipulate reviews or ratings</li>
            <li>Use the platform for money laundering or fraudulent transactions</li>
            <li>Share customer data with third parties</li>
            <li>Operate multiple accounts without written permission</li>
          </ul>
        </div>

        <div className="card">
          <h2>9. Limitation of Liability</h2>
          <p>The Company shall NOT be liable for:</p>
          <ul>
            <li>Customer disputes arising from your products or services</li>
            <li>Payment disputes between you and customers or banks</li>
            <li>Loss of business or revenue due to platform downtime</li>
            <li>Any indirect, consequential, or punitive damages</li>
            <li>Actions by customers on the platform</li>
          </ul>
          <p>Our maximum aggregate liability shall not exceed ₹500 or the amount of any disputed transaction, whichever is lower.</p>
        </div>

        <div className="card">
          <h2>10. Indemnification</h2>
          <p>You agree to indemnify and hold harmless {COMPANY}, its officers, directors, and employees from any claims, losses, liabilities, or expenses arising from:</p>
          <ul>
            <li>Your products causing harm, injury, or loss to customers</li>
            <li>Your violation of any applicable law or regulation</li>
            <li>False or misleading product information</li>
            <li>Your breach of these Terms</li>
            <li>Any third-party claims related to your business operations</li>
          </ul>
        </div>

        <div className="card">
          <h2>11. Intellectual Property</h2>
          <p>By uploading product images and content to the platform, you grant {COMPANY} a non-exclusive, royalty-free license to display such content on the platform. You represent that you own or have rights to all content you upload.</p>
        </div>

        <div className="card">
          <h2>12. Termination</h2>
          <p>The Company may suspend or terminate your Seller account without notice for:</p>
          <ul>
            <li>Violation of these Terms</li>
            <li>Fraudulent or deceptive activity</li>
            <li>Consistent poor performance or customer complaints</li>
            <li>Legal or regulatory non-compliance</li>
            <li>Any conduct harmful to customers or the platform</li>
          </ul>
          <p>You may terminate your account by contacting {EMAIL} with 7 days' written notice.</p>
        </div>

        <div className="card">
          <h2>13. Governing Law and Dispute Resolution</h2>
          <p>These Terms are governed by the laws of <strong>India</strong>. Disputes shall be:</p>
          <ul>
            <li>First attempted amicably through written notice to {EMAIL}</li>
            <li>If unresolved in 30 days, submitted to binding arbitration under the Arbitration and Conciliation Act, 1996</li>
            <li>Seat of arbitration: <strong>Haldwani, Uttarakhand, India — 263139</strong></li>
            <li>Conducted in English</li>
            <li>Courts in <strong>Haldwani, Uttarakhand</strong> shall have exclusive jurisdiction</li>
          </ul>
          <div className="warn"><p>⚠️ By accepting these Terms, you waive your right to participate in class action lawsuits or class-wide arbitration against the Company.</p></div>
        </div>

        <div className="dark">
          <h2 style={{color:"white",borderColor:"rgba(255,255,255,0.3)"}}>Contact — Legal</h2>
          <p style={{color:"rgba(255,255,255,0.7)",marginTop:8}}><strong style={{color:"white"}}>{COMPANY}</strong></p>
          <p style={{color:"rgba(255,255,255,0.7)"}}>Haldwani, Uttarakhand — 263139, India</p>
          <p style={{color:"rgba(255,255,255,0.7)"}}>Email: <a href={"mailto:"+EMAIL} style={{color:"#60A5FA"}}>{EMAIL}</a></p>
        </div>
      </div>
    </div>
  );
}
