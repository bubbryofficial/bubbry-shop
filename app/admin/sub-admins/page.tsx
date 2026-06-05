"use client";
import { supabase } from "../../../lib/supabase";
import { useState, useEffect } from "react";

const ADMIN_PASSWORD = "bubbry-admin-2024";

const STATES_CITIES: Record<string, string[]> = {
  "Uttar Pradesh": ["Meerut","Lucknow","Agra","Kanpur","Varanasi","Prayagraj","Ghaziabad","Noida","Bareilly","Aligarh","Moradabad","Saharanpur","Gorakhpur","Mathura","Firozabad","Muzaffarnagar","Hapur","Rampur","Shahjahanpur","Sambhal"],
  "Delhi": ["New Delhi","North Delhi","South Delhi","East Delhi","West Delhi","Central Delhi","Dwarka","Rohini","Janakpuri","Laxmi Nagar"],
  "Maharashtra": ["Mumbai","Pune","Nagpur","Nashik","Aurangabad","Solapur","Kolhapur","Amravati","Nanded","Thane","Pimpri-Chinchwad"],
  "Karnataka": ["Bangalore","Mysore","Hubli","Mangalore","Belgaum","Gulbarga","Davanagere","Bellary","Shimoga","Tumkur"],
  "Tamil Nadu": ["Chennai","Coimbatore","Madurai","Tiruchirappalli","Salem","Tirunelveli","Vellore","Erode","Tiruppur","Dindigul"],
  "Rajasthan": ["Jaipur","Jodhpur","Udaipur","Kota","Ajmer","Bikaner","Alwar","Bharatpur","Sikar","Pali"],
  "Gujarat": ["Ahmedabad","Surat","Vadodara","Rajkot","Bhavnagar","Jamnagar","Gandhinagar","Junagadh","Anand","Navsari"],
  "West Bengal": ["Kolkata","Howrah","Durgapur","Asansol","Siliguri","Bardhaman","Kharagpur","Haldia","Malda","Raiganj"],
  "Madhya Pradesh": ["Indore","Bhopal","Jabalpur","Gwalior","Ujjain","Sagar","Ratlam","Satna","Dewas","Murwara"],
  "Haryana": ["Faridabad","Gurgaon","Panipat","Ambala","Yamunanagar","Rohtak","Hisar","Karnal","Sonipat","Panchkula"],
  "Punjab": ["Ludhiana","Amritsar","Jalandhar","Patiala","Bathinda","Mohali","Firozpur","Hoshiarpur","Batala","Moga"],
  "Bihar": ["Patna","Gaya","Bhagalpur","Muzaffarpur","Purnia","Darbhanga","Bihar Sharif","Arrah","Begusarai","Katihar"],
  "Telangana": ["Hyderabad","Warangal","Nizamabad","Karimnagar","Khammam","Ramagundam","Mahbubnagar","Nalgonda","Adilabad","Suryapet"],
  "Andhra Pradesh": ["Visakhapatnam","Vijayawada","Guntur","Nellore","Kurnool","Rajahmundry","Kadapa","Kakinada","Tirupati","Anantapur"],
  "Odisha": ["Bhubaneswar","Cuttack","Rourkela","Berhampur","Sambalpur","Puri","Balasore","Bhadrak","Baripada","Jharsuguda"],
  "Kerala": ["Thiruvananthapuram","Kochi","Kozhikode","Thrissur","Kollam","Palakkad","Alappuzha","Malappuram","Kannur","Kasargod"],
  "Jharkhand": ["Ranchi","Jamshedpur","Dhanbad","Bokaro","Deoghar","Hazaribag","Giridih","Ramgarh","Medininagar","Phusro"],
  "Assam": ["Guwahati","Silchar","Dibrugarh","Jorhat","Nagaon","Tinsukia","Tezpur","Bongaigaon","Dhubri","Lakhimpur"],
  "Uttarakhand": ["Dehradun","Haridwar","Roorkee","Haldwani","Rudrapur","Kashipur","Rishikesh","Nainital","Almora","Mussoorie"],
  "Himachal Pradesh": ["Shimla","Dharamshala","Solan","Mandi","Palampur","Baddi","Nahan","Paonta Sahib","Sundarnagar","Chamba"],
  "Chhattisgarh": ["Raipur","Bhilai","Bilaspur","Korba","Durg","Rajnandgaon","Jagdalpur","Ambikapur","Dhamtari","Chirmiri"],
  "Chandigarh": ["Chandigarh"],
  "Goa": ["Panaji","Margao","Vasco da Gama","Mapusa","Ponda","Bicholim","Curchorem","Sanquelim"],
  "Other": ["Other City"],
};

const PERMISSIONS = [
  { key: "manage_shops", label: "Manage Shops", desc: "Approve/reject shops in their city", icon: "🏪" },
  { key: "manage_products", label: "Manage Products", desc: "Approve product images, edit master products", icon: "📦" },
  { key: "manage_disputes", label: "Manage Disputes", desc: "Review and resolve disputes", icon: "⚖️" },
  { key: "manage_ads", label: "Manage Ads", desc: "Approve/reject advertisement requests", icon: "📢" },
  { key: "view_orders", label: "View Orders", desc: "View all orders in their city", icon: "📋" },
  { key: "manage_riders", label: "Manage Riders", desc: "Add/remove riders, view delivery stats", icon: "🛵" },
];

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Plus Jakarta Sans', sans-serif; background: #F4F6FB; min-height: 100vh; }
.header { background: linear-gradient(135deg,#0D1B3E,#1A3A8F); padding: 16px 20px; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 100; box-shadow: 0 4px 20px rgba(13,27,62,0.3); }
.back-btn { width:36px; height:36px; background:rgba(255,255,255,0.15); border-radius:10px; border:none; color:white; font-size:18px; cursor:pointer; display:flex; align-items:center; justify-content:center; text-decoration:none; }
.badge { background:#1A6BFF; color:white; font-size:10px; font-weight:800; padding:3px 9px; border-radius:20px; }
.page { max-width:600px; margin:0 auto; padding:20px 16px 100px; }
.section-title { font-size:11px; font-weight:800; color:#8A96B5; text-transform:uppercase; letter-spacing:0.6px; margin:20px 0 10px; }
.inp { width:100%; padding:12px 14px; border:1.5px solid #E4EAFF; border-radius:11px; font-size:14px; font-family:inherit; color:#0D1B3E; outline:none; transition:border-color 0.2s; background:#FAFBFF; }
.inp:focus { border-color:#1A6BFF; background:white; }
.inp-label { font-size:11px; font-weight:700; color:#8A96B5; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:6px; display:block; }
.select { width:100%; padding:12px 14px; border:1.5px solid #E4EAFF; border-radius:11px; font-size:14px; font-family:inherit; color:#0D1B3E; outline:none; background:#FAFBFF; cursor:pointer; }
.select:focus { border-color:#1A6BFF; }
.select:disabled { opacity:0.5; cursor:not-allowed; background:#F4F6FB; }
.perm-grid { display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-top:8px; }
.perm-item { padding:10px 12px; border:1.5px solid #E4EAFF; border-radius:10px; cursor:pointer; transition:all 0.15s; display:flex; align-items:flex-start; gap:8px; }
.perm-item.checked { border-color:#1A6BFF; background:#EBF1FF; }
.perm-icon { font-size:18px; flex-shrink:0; }
.perm-name { font-size:12px; font-weight:800; color:#0D1B3E; margin-bottom:2px; }
.perm-item.checked .perm-name { color:#1A6BFF; }
.perm-desc { font-size:10px; color:#8A96B5; line-height:1.4; }
.perm-check { width:16px; height:16px; border-radius:4px; border:1.5px solid #C5D5FF; background:white; flex-shrink:0; margin-left:auto; margin-top:1px; display:flex; align-items:center; justify-content:center; font-size:10px; font-weight:900; color:white; }
.perm-item.checked .perm-check { background:#1A6BFF; border-color:#1A6BFF; }
.btn-primary { background:#1A6BFF; color:white; width:100%; padding:14px; font-size:15px; border-radius:13px; border:none; font-weight:800; cursor:pointer; font-family:inherit; }
.btn-primary:disabled { opacity:0.5; cursor:not-allowed; }
.btn-danger { background:white; color:#E53E3E; border:1.5px solid #FFCDD2; font-size:12px; padding:6px 12px; border-radius:8px; cursor:pointer; font-family:inherit; font-weight:800; }
.btn-edit { background:#EBF1FF; color:#1A6BFF; border:1.5px solid #C5D5FF; font-size:12px; padding:6px 12px; border-radius:8px; cursor:pointer; font-family:inherit; font-weight:800; }
.btn-sm { font-size:11px; padding:5px 11px; border-radius:7px; cursor:pointer; font-family:inherit; font-weight:800; border:1.5px solid; }
.btn-activate { background:#E6FAF4; color:#00875A; border-color:#B8E8D4; }
.btn-deactivate { background:#FFF0F0; color:#E53E3E; border-color:#FFCDD2; }
.sub-card { background:white; border-radius:14px; border:1.5px solid #E4EAFF; padding:16px; margin-bottom:10px; box-shadow:0 2px 8px rgba(26,107,255,0.04); }
.sub-card.inactive { opacity:0.65; border-style:dashed; }
.sub-name { font-size:15px; font-weight:900; color:#0D1B3E; }
.sub-meta { font-size:12px; color:#8A96B5; font-weight:600; margin-top:2px; }
.location-pill { display:inline-flex; align-items:center; gap:4px; background:#EBF1FF; color:#1A6BFF; font-size:11px; font-weight:800; padding:3px 10px; border-radius:20px; margin:8px 4px 8px 0; }
.state-pill { display:inline-flex; align-items:center; gap:4px; background:#F4F6FB; color:#4A5880; font-size:10px; font-weight:700; padding:3px 9px; border-radius:20px; }
.perm-tags { display:flex; flex-wrap:wrap; gap:5px; }
.perm-tag { background:#F4F6FB; border:1px solid #E4EAFF; border-radius:6px; padding:3px 8px; font-size:10px; font-weight:700; color:#4A5880; }
.sub-actions { display:flex; gap:6px; flex-wrap:wrap; margin-top:12px; padding-top:12px; border-top:1px solid #F4F6FB; }
.status-dot { width:8px; height:8px; border-radius:50%; flex-shrink:0; margin-top:5px; }
.dot-active { background:#00B37E; }
.dot-inactive { background:#B0BACC; }
.stats-row { display:grid; grid-template-columns:repeat(3,1fr); gap:10px; margin-bottom:20px; }
.stat-box { background:white; border-radius:12px; border:1.5px solid #E4EAFF; padding:14px; text-align:center; }
.stat-num { font-size:24px; font-weight:900; color:#1A6BFF; }
.stat-label { font-size:11px; font-weight:700; color:#8A96B5; margin-top:2px; }
.toast { position:fixed; bottom:24px; left:50%; transform:translateX(-50%); background:#0D1B3E; color:white; padding:12px 24px; border-radius:12px; font-size:13px; font-weight:700; z-index:999; white-space:nowrap; }
.modal-overlay { position:fixed; inset:0; background:rgba(13,27,62,0.55); z-index:200; display:flex; align-items:flex-end; justify-content:center; }
.modal { background:white; border-radius:24px 24px 0 0; width:100%; max-width:600px; max-height:92vh; overflow-y:auto; padding:24px 20px 40px; }
.modal-handle { width:40px; height:4px; background:#E4EAFF; border-radius:2px; margin:0 auto 20px; }
.modal-title { font-size:18px; font-weight:900; color:#0D1B3E; margin-bottom:20px; }
.field { margin-bottom:14px; }
.divider { height:1px; background:#E4EAFF; margin:18px 0; }
.login-wrap { min-height:100vh; display:flex; align-items:center; justify-content:center; padding:24px; background:linear-gradient(160deg,#EBF1FF,#F4F6FB); }
.login-card { background:white; border-radius:24px; padding:36px 28px; box-shadow:0 8px 40px rgba(26,107,255,0.12); border:1.5px solid #E4EAFF; width:100%; max-width:380px; }
.auth-inp { width:100%; padding:14px 16px; border:2px solid #E4EAFF; border-radius:12px; font-size:15px; font-family:inherit; outline:none; margin-bottom:10px; }
.auth-inp:focus { border-color:#1A6BFF; }
.filter-row { display:flex; gap:6px; flex-wrap:wrap; margin-bottom:14px; }
.filter-btn { padding:5px 12px; border:1.5px solid #E4EAFF; border-radius:20px; background:white; font-size:12px; font-weight:700; cursor:pointer; font-family:inherit; color:#8A96B5; }
.filter-btn.active { background:#1A6BFF; border-color:#1A6BFF; color:white; }
.portal-banner { display:flex; align-items:center; gap:12px; background:linear-gradient(135deg,#1A6BFF,#0D3FAD); border-radius:14px; padding:16px; margin-top:20px; margin-bottom:20px; text-decoration:none; }
`;

export default function SubAdminsPage() {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState("");
  const [subAdmins, setSubAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");
  const [stateFilter, setStateFilter] = useState("All");
  const [form, setForm] = useState({ name:"", email:"", phone:"", state:"", city:"", password:"", permissions:[] as string[], notes:"" });

  useEffect(() => { if (authed) fetchSubAdmins(); }, [authed]);

  async function fetchSubAdmins() {
    setLoading(true);
    const { data } = await supabase.from("sub_admins").select("*").order("created_at", { ascending: false });
    setSubAdmins(data || []);
    setLoading(false);
  }

  function showToast(msg: string) { setToast(msg); setTimeout(() => setToast(""), 3000); }

  function openAdd() {
    setEditingAdmin(null);
    setForm({ name:"", email:"", phone:"", state:"", city:"", password:"", permissions:[], notes:"" });
    setShowModal(true);
  }

  function openEdit(admin: any) {
    setEditingAdmin(admin);
    setForm({ name:admin.name||"", email:admin.email||"", phone:admin.phone||"", state:admin.state||"", city:admin.city||"", password:"", permissions:admin.permissions||[], notes:admin.notes||"" });
    setShowModal(true);
  }

  function togglePerm(key: string) {
    setForm(f => ({ ...f, permissions: f.permissions.includes(key) ? f.permissions.filter(p => p!==key) : [...f.permissions, key] }));
  }

  async function saveSubAdmin() {
    if (!form.name.trim()) { alert("Enter name"); return; }
    if (!form.email.trim()) { alert("Enter email"); return; }
    if (!form.state) { alert("Select a state"); return; }
    if (!form.city) { alert("Select a city"); return; }
    if (!editingAdmin && !form.password.trim()) { alert("Set a login password"); return; }
    if (form.permissions.length === 0) { alert("Select at least one permission"); return; }
    setSaving(true);
    try {
      if (editingAdmin) {
        const upd: any = { name:form.name.trim(), email:form.email.trim().toLowerCase(), phone:form.phone.trim(), state:form.state, city:form.city, permissions:form.permissions, notes:form.notes.trim(), updated_at:new Date().toISOString() };
        if (form.password.trim()) upd.password_hash = form.password.trim();
        const { error } = await supabase.from("sub_admins").update(upd).eq("id", editingAdmin.id);
        if (error) throw error;
        showToast("✓ Updated successfully");
      } else {
        const { data: ex } = await supabase.from("sub_admins").select("id").eq("email", form.email.trim().toLowerCase()).single();
        if (ex) { alert("This email is already registered"); setSaving(false); return; }
        const { error } = await supabase.from("sub_admins").insert({ name:form.name.trim(), email:form.email.trim().toLowerCase(), phone:form.phone.trim(), state:form.state, city:form.city, password_hash:form.password.trim(), permissions:form.permissions, notes:form.notes.trim(), is_active:true, created_at:new Date().toISOString(), updated_at:new Date().toISOString() });
        if (error) throw error;
        showToast("✓ Sub-admin added for " + form.city + ", " + form.state);
      }
      setShowModal(false);
      fetchSubAdmins();
    } catch (e: any) { alert("Error: " + e.message); }
    setSaving(false);
  }

  async function toggleActive(admin: any) {
    await supabase.from("sub_admins").update({ is_active:!admin.is_active, updated_at:new Date().toISOString() }).eq("id", admin.id);
    showToast(admin.is_active ? "Deactivated" : "Activated");
    fetchSubAdmins();
  }

  async function deleteSubAdmin(admin: any) {
    if (!confirm("Remove " + admin.name + "? This cannot be undone.")) return;
    await supabase.from("sub_admins").delete().eq("id", admin.id);
    showToast("Removed");
    fetchSubAdmins();
  }

  async function resetPassword(admin: any) {
    const np = prompt("New password for " + admin.name + ":");
    if (!np?.trim()) return;
    await supabase.from("sub_admins").update({ password_hash:np.trim(), updated_at:new Date().toISOString() }).eq("id", admin.id);
    showToast("✓ Password updated");
  }

  const availableStates = ["All", ...Array.from(new Set(subAdmins.map(a => a.state).filter(Boolean))).sort()];
  const filtered = stateFilter === "All" ? subAdmins : subAdmins.filter(a => a.state === stateFilter);
  const cities = form.state ? (STATES_CITIES[form.state] || []) : [];

  if (!authed) {
    return (
      <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
        <style>{CSS}</style>
        <div className="login-wrap">
          <div className="login-card">
            <div style={{ textAlign:"center", marginBottom:24 }}>
              <div style={{ fontSize:48, marginBottom:8 }}>🛡️</div>
              <div style={{ fontSize:22, fontWeight:900, color:"#0D1B3E" }}>Admin Access</div>
              <div style={{ fontSize:13, color:"#8A96B5", marginTop:4 }}>Sub-Admin Management</div>
            </div>
            <input className="auth-inp" type="password" placeholder="Admin password" value={pw}
              onChange={e => setPw(e.target.value)}
              onKeyDown={e => { if (e.key==="Enter") { if (pw===ADMIN_PASSWORD) setAuthed(true); else alert("Wrong password"); } }} />
            <button className="btn-primary" onClick={() => { if (pw===ADMIN_PASSWORD) setAuthed(true); else alert("Wrong password"); }}>Login →</button>
            <div style={{ textAlign:"center", marginTop:16 }}>
              <a href="/admin" style={{ fontSize:13, color:"#8A96B5", fontWeight:600 }}>← Back to Admin</a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", minHeight:"100vh", background:"#F4F6FB" }}>
      <style>{CSS}</style>

      <div className="header">
        <div style={{ display:"flex", alignItems:"center" }}>
          <a href="/admin" className="back-btn">←</a>
          <div style={{ marginLeft:10 }}>
            <div style={{ fontSize:17, fontWeight:900, color:"white" }}>Sub-Admin Management</div>
            <div style={{ fontSize:11, color:"rgba(255,255,255,0.6)", fontWeight:600 }}>Delegate city management</div>
          </div>
        </div>
        <span className="badge">SUPER ADMIN</span>
      </div>

      <div className="page">

        {/* Portal link banner */}
        <a href="/admin/sub-admin-portal" className="portal-banner">
          <span style={{ fontSize:36 }}>👥</span>
          <div>
            <div style={{ fontSize:15, fontWeight:900, color:"white" }}>Sub-Admin Login Portal →</div>
            <div style={{ fontSize:12, color:"rgba(255,255,255,0.8)", marginTop:2 }}>
              shop.bubbry.co.in/admin/sub-admin-portal — share with sub-admins
            </div>
          </div>
        </a>

        {/* Stats */}
        <div className="stats-row">
          <div className="stat-box"><div className="stat-num">{subAdmins.length}</div><div className="stat-label">Total</div></div>
          <div className="stat-box"><div className="stat-num" style={{ color:"#00B37E" }}>{subAdmins.filter(a=>a.is_active).length}</div><div className="stat-label">Active</div></div>
          <div className="stat-box"><div className="stat-num" style={{ color:"#946200" }}>{new Set(subAdmins.map(a=>a.state).filter(Boolean)).size}</div><div className="stat-label">States</div></div>
        </div>

        <button className="btn-primary" onClick={openAdd} style={{ marginBottom:20 }}>+ Add Sub-Admin</button>

        {availableStates.length > 2 && (
          <>
            <div className="section-title">Filter by State</div>
            <div className="filter-row">
              {availableStates.map(s => (
                <button key={s} className={"filter-btn"+(stateFilter===s?" active":"")} onClick={() => setStateFilter(s)}>{s}</button>
              ))}
            </div>
          </>
        )}

        <div className="section-title">Sub-Admins ({filtered.length})</div>

        {loading ? (
          <div style={{ textAlign:"center", padding:40, color:"#8A96B5", fontWeight:600 }}>Loading...</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign:"center", padding:"48px 24px", color:"#B0BACC" }}>
            <div style={{ fontSize:48, marginBottom:12 }}>👥</div>
            <div style={{ fontSize:14, fontWeight:700 }}>No sub-admins yet</div>
            <div style={{ fontSize:12, marginTop:6 }}>Add a sub-admin to delegate city management</div>
          </div>
        ) : filtered.map(admin => (
          <div key={admin.id} className={"sub-card"+(admin.is_active?"":" inactive")}>
            <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between" }}>
              <div style={{ display:"flex", alignItems:"flex-start", gap:10 }}>
                <div className={"status-dot "+(admin.is_active?"dot-active":"dot-inactive")} />
                <div>
                  <div className="sub-name">{admin.name}</div>
                  <div className="sub-meta">{admin.email}</div>
                  {admin.phone && <div className="sub-meta">📱 {admin.phone}</div>}
                </div>
              </div>
              <button className={"btn-sm "+(admin.is_active?"btn-deactivate":"btn-activate")} onClick={() => toggleActive(admin)}>
                {admin.is_active?"Deactivate":"Activate"}
              </button>
            </div>

            <div style={{ marginTop:8 }}>
              <span className="location-pill">📍 {admin.city}</span>
              <span className="state-pill">🏛️ {admin.state}</span>
            </div>

            <div style={{ fontSize:11, fontWeight:700, color:"#8A96B5", marginBottom:6, textTransform:"uppercase", letterSpacing:"0.4px" }}>Permissions</div>
            <div className="perm-tags">
              {(admin.permissions||[]).map((p: string) => {
                const perm = PERMISSIONS.find(x=>x.key===p);
                return <span key={p} className="perm-tag">{perm?.icon} {perm?.label||p}</span>;
              })}
              {(!admin.permissions||admin.permissions.length===0) && <span style={{ fontSize:11, color:"#B0BACC" }}>No permissions</span>}
            </div>

            {admin.notes && <div style={{ marginTop:10, fontSize:12, color:"#8A96B5", background:"#F4F6FB", borderRadius:8, padding:"8px 10px" }}>📝 {admin.notes}</div>}

            <div style={{ fontSize:10, color:"#C5D5FF", marginTop:8, fontWeight:600 }}>
              Added {new Date(admin.created_at).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})}
            </div>

            <div className="sub-actions">
              <button className="btn-edit" onClick={() => openEdit(admin)}>✏️ Edit</button>
              <button className="btn-edit" onClick={() => resetPassword(admin)}>🔑 Password</button>
              <button className="btn-danger" onClick={() => deleteSubAdmin(admin)}>🗑 Remove</button>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={e => { if (e.target===e.currentTarget) setShowModal(false); }}>
          <div className="modal">
            <div className="modal-handle" />
            <div className="modal-title">{editingAdmin?"Edit Sub-Admin":"Add Sub-Admin"}</div>

            <div className="field">
              <label className="inp-label">Full Name *</label>
              <input className="inp" placeholder="e.g. Rahul Sharma" value={form.name} onChange={e => setForm(f=>({...f,name:e.target.value}))} />
            </div>
            <div className="field">
              <label className="inp-label">Email *</label>
              <input className="inp" type="email" placeholder="admin@example.com" value={form.email} onChange={e => setForm(f=>({...f,email:e.target.value}))} />
            </div>
            <div className="field">
              <label className="inp-label">Phone</label>
              <input className="inp" type="tel" placeholder="10-digit mobile" value={form.phone} onChange={e => setForm(f=>({...f,phone:e.target.value}))} />
            </div>

            <div className="divider" />

            {/* State → City */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:14 }}>
              <div>
                <label className="inp-label">State *</label>
                <select className="select" value={form.state}
                  onChange={e => setForm(f=>({...f,state:e.target.value,city:""}))}>
                  <option value="">Select state...</option>
                  {Object.keys(STATES_CITIES).sort().map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="inp-label">City *</label>
                <select className="select" value={form.city} disabled={!form.state}
                  onChange={e => setForm(f=>({...f,city:e.target.value}))}>
                  <option value="">{form.state?"Select city...":"Select state first"}</option>
                  {cities.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div className="field">
              <label className="inp-label">{editingAdmin?"New Password (blank = keep current)":"Login Password *"}</label>
              <input className="inp" type="password" placeholder={editingAdmin?"Leave blank to keep current":"Set a strong password"} value={form.password} onChange={e => setForm(f=>({...f,password:e.target.value}))} />
            </div>

            <div className="divider" />

            <div className="field">
              <label className="inp-label">Permissions * — what can this admin manage?</label>
              <div className="perm-grid">
                {PERMISSIONS.map(p => (
                  <div key={p.key} className={"perm-item"+(form.permissions.includes(p.key)?" checked":"")} onClick={() => togglePerm(p.key)}>
                    <div className="perm-icon">{p.icon}</div>
                    <div style={{ flex:1 }}>
                      <div className="perm-name">{p.label}</div>
                      <div className="perm-desc">{p.desc}</div>
                    </div>
                    <div className="perm-check">{form.permissions.includes(p.key)?"✓":""}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="field">
              <label className="inp-label">Notes (optional)</label>
              <input className="inp" placeholder="e.g. Handles Meerut west zone only" value={form.notes} onChange={e => setForm(f=>({...f,notes:e.target.value}))} />
            </div>

            <button className="btn-primary" onClick={saveSubAdmin} disabled={saving}>
              {saving?"Saving...":(editingAdmin?"Save Changes":"Add Sub-Admin")}
            </button>
            <button style={{ width:"100%", padding:12, marginTop:8, background:"transparent", border:"none", color:"#8A96B5", fontWeight:700, cursor:"pointer", fontFamily:"inherit" }} onClick={() => setShowModal(false)}>Cancel</button>
          </div>
        </div>
      )}

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
