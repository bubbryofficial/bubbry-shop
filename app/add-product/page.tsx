"use client";
import { supabase } from "../../lib/supabase";

import { useEffect, useState, useRef } from "react";


const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Plus Jakarta Sans', sans-serif; background: #F4F6FB; }
.page { min-height: 100vh; background: #F4F6FB; font-family: 'Plus Jakarta Sans', sans-serif; padding-bottom: 90px; }
.top-bar { background: #1A6BFF; padding: 16px 20px 20px; position: sticky; top: 0; z-index: 100; box-shadow: 0 4px 20px rgba(26,107,255,0.25); }
.top-row { display: flex; align-items: center; gap: 12px; margin-bottom: 14px; }
.back-btn { width: 36px; height: 36px; background: rgba(255,255,255,0.18); border-radius: 10px; display: flex; align-items: center; justify-content: center; text-decoration: none; font-size: 18px; color: white; flex-shrink: 0; }
.page-title { font-size: 18px; font-weight: 800; color: white; }
.search-bar { display: flex; align-items: center; gap: 10px; background: white; border-radius: 12px; padding: 12px 14px; }
.search-bar input { border: none; outline: none; font-size: 15px; font-weight: 500; color: #0D1B3E; background: transparent; width: 100%; font-family: 'Plus Jakarta Sans', sans-serif; }
.search-bar input::placeholder { color: #B0BACC; }

.content { padding: 16px; max-width: 480px; margin: 0 auto; }
.results-label { font-size: 12px; font-weight: 700; color: #8A96B5; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px; }

.product-row { background: white; border-radius: 14px; border: 1.5px solid #E4EAFF; padding: 14px; margin-bottom: 10px; box-shadow: 0 2px 8px rgba(26,107,255,0.05); }
.product-top { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
.product-img { width: 56px; height: 56px; border-radius: 10px; object-fit: cover; flex-shrink: 0; background: #EBF1FF; display: flex; align-items: center; justify-content: center; font-size: 24px; overflow: hidden; }
.product-img img { width: 100%; height: 100%; object-fit: cover; }
.product-details { flex: 1; }
.product-name { font-size: 14px; font-weight: 800; color: #0D1B3E; margin-bottom: 3px; line-height: 1.3; }
.product-cat { font-size: 11px; color: #1A6BFF; font-weight: 700; padding: 2px 8px; background: #EBF1FF; border-radius: 20px; display: inline-block; }
.product-size { font-size: 12px; color: #8A96B5; font-weight: 600; margin-top: 3px; }

/* IMAGE UPLOAD */
.img-upload-row { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; padding: 10px; background: #F4F6FB; border-radius: 10px; border: 1.5px solid #E4EAFF; cursor: pointer; transition: border-color 0.2s; }
.img-upload-row:hover { border-color: #1A6BFF; }
.img-upload-row.locked { cursor: default; background: #E6FAF4; border-color: #00B37E; }
.img-thumb { width: 40px; height: 40px; border-radius: 8px; object-fit: cover; background: #DDEAFF; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 18px; overflow: hidden; }
.img-thumb img { width: 100%; height: 100%; object-fit: cover; }
.img-upload-text { font-size: 12px; font-weight: 700; color: #4A5880; flex: 1; }
.img-upload-sub { font-size: 10px; color: #8A96B5; font-weight: 500; margin-top: 2px; }
.img-exists-label { font-size: 12px; font-weight: 700; color: #00875A; flex: 1; }

.input-row { display: grid; grid-template-columns: 1fr 1fr auto; gap: 8px; align-items: end; }
.mini-field { }
.mini-label { font-size: 10px; font-weight: 800; color: #8A96B5; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 5px; }
.mini-input { width: 100%; padding: 10px 12px; border: 2px solid #E4EAFF; border-radius: 10px; font-size: 14px; font-weight: 600; color: #0D1B3E; background: #F4F6FB; font-family: 'Plus Jakarta Sans', sans-serif; outline: none; transition: all 0.2s; }
.mini-input:focus { border-color: #1A6BFF; background: white; }
.add-btn { padding: 10px 16px; background: #1A6BFF; color: white; border: none; border-radius: 10px; font-size: 13px; font-weight: 800; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; white-space: nowrap; transition: all 0.2s; }
.add-btn.added { background: #00B37E; }
.add-btn:disabled { opacity: 0.6; cursor: not-allowed; }

.loading-state { text-align: center; padding: 40px 24px; color: #8A96B5; font-weight: 600; }
.empty-state { text-align: center; padding: 60px 24px; }
.empty-icon { font-size: 48px; margin-bottom: 12px; }
.empty-title { font-size: 17px; font-weight: 800; color: #0D1B3E; margin-bottom: 6px; }
.empty-sub { font-size: 13px; color: #8A96B5; }

.bottom-nav { position: fixed; bottom: 0; left: 0; right: 0; height: 70px; background: white; border-top: 1.5px solid #E4EAFF; display: flex; align-items: center; box-shadow: 0 -4px 20px rgba(26,107,255,0.07); z-index: 100; }
.nav-item { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 3px; padding: 8px 0; text-decoration: none; color: #B0BACC; font-size: 10px; font-weight: 700; transition: color 0.15s; }
.nav-item.active { color: #1A6BFF; }
.nav-icon { font-size: 22px; line-height: 1; }
`;

export default function AddProduct() {
  const [products, setProducts] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [priceMap, setPriceMap] = useState<Record<string, string>>({});
  const [mrpMap, setMrpMap] = useState<Record<string, string>>({});
  const [stockMap, setStockMap] = useState<Record<string, string>>({});
  const [addedMap, setAddedMap] = useState<Record<string, boolean>>({});
  const [uploadingMap, setUploadingMap] = useState<Record<string, boolean>>({});
  const [imgFileMap, setImgFileMap] = useState<Record<string, File>>({});
  const [imgPreviewMap, setImgPreviewMap] = useState<Record<string, string>>({});
  // Multi-photo (up to 5) gallery photos pending admin approval, per product.
  const [photoCountMap, setPhotoCountMap] = useState<Record<string, number>>({});
  const [galleryUploadingMap, setGalleryUploadingMap] = useState<Record<string, boolean>>({});
  const [galleryDoneMap, setGalleryDoneMap] = useState<Record<string, number>>({});
  const galleryInputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  useEffect(() => {
    const timer = setTimeout(fetchProducts, 300);
    return () => clearTimeout(timer);
  }, [search]);

  async function fetchProducts() {
    setLoading(true);
    let query = supabase.from("master_products").select("*").limit(50);
    if (search.trim()) {
      query = supabase.from("master_products").select("*").ilike("name", `%${search}%`).limit(50);
    }
    const { data } = await query;
    setProducts(data || []);
    setLoading(false);
    // Load how many gallery photos (approved + pending) each product already has,
    // so we can enforce the up-to-5 limit.
    const ids = (data || []).map((p: any) => p.id);
    if (ids.length > 0) {
      const { data: photoRows } = await supabase
        .from("product_photos")
        .select("master_product_id, status")
        .in("master_product_id", ids)
        .in("status", ["approved", "pending"]);
      const counts: Record<string, number> = {};
      (photoRows || []).forEach((r: any) => {
        counts[r.master_product_id] = (counts[r.master_product_id] || 0) + 1;
      });
      setPhotoCountMap(counts);
    }
  }

  const MAX_PHOTOS = 5;

  async function handleGallerySelect(productId: string, e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    e.target.value = ""; // allow re-selecting same files later

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { alert("Please log in first."); return; }

    const already = photoCountMap[productId] || 0;
    const remaining = MAX_PHOTOS - already;
    if (remaining <= 0) { alert("This product already has the maximum of 5 photos (approved or pending)."); return; }

    const toUpload = files.slice(0, remaining);
    if (files.length > remaining) {
      alert(`You can add ${remaining} more photo${remaining !== 1 ? "s" : ""} (max 5 total). Uploading the first ${remaining}.`);
    }

    setGalleryUploadingMap((p) => ({ ...p, [productId]: true }));
    let success = 0;
    for (let i = 0; i < toUpload.length; i++) {
      const file = toUpload[i];
      try {
        const ext = file.name.split(".").pop() || "jpg";
        const path = `gallery/${productId}/${Date.now()}_${i}.${ext}`;
        const { error: upErr } = await supabase.storage.from("product-images").upload(path, file, { upsert: true });
        if (upErr) throw new Error(upErr.message);
        const { data: pub } = supabase.storage.from("product-images").getPublicUrl(path);
        const { error: insErr } = await supabase.from("product_photos").insert({
          master_product_id: productId,
          url: pub.publicUrl,
          status: "pending",
          uploaded_by: user.id,
        });
        if (insErr) throw new Error(insErr.message);
        success++;
      } catch (err: any) {
        console.error("Gallery photo upload failed:", err?.message);
      }
    }
    setGalleryUploadingMap((p) => ({ ...p, [productId]: false }));
    setPhotoCountMap((p) => ({ ...p, [productId]: (p[productId] || 0) + success }));
    setGalleryDoneMap((p) => ({ ...p, [productId]: success }));
    setTimeout(() => setGalleryDoneMap((p) => ({ ...p, [productId]: 0 })), 3000);
    if (success > 0) {
      alert(`✓ ${success} photo${success !== 1 ? "s" : ""} uploaded! They'll appear once an admin approves them.`);
    }
  }

  function handleImgSelect(productId: string, e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImgFileMap((p) => ({ ...p, [productId]: file }));
    const reader = new FileReader();
    reader.onload = () => setImgPreviewMap((p) => ({ ...p, [productId]: reader.result as string }));
    reader.readAsDataURL(file);
  }

  async function uploadImage(file: File, productId: string): Promise<string> {
    const ext = file.name.split(".").pop() || "jpg";
    const path = `products/${productId}.${ext}`;
    const { error } = await supabase.storage.from("product-images").upload(path, file, { upsert: true });
    if (error) throw new Error(error.message);
    const { data } = supabase.storage.from("product-images").getPublicUrl(path);
    return data.publicUrl;
  }

  async function addProduct(product: any) {
    const price = priceMap[product.id];
    const stock = stockMap[product.id];
    if (!price || !stock) { alert("Enter price and stock"); return; }
    const mrpVal = mrpMap[product.id];
    const mrpNum = mrpVal ? Number(mrpVal) : Number(price);
    if (Number(price) > mrpNum) { alert("Discounted price cannot be higher than MRP."); return; }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { alert("Login first"); return; }

    // Upload image if selected and product has no approved image
    const imgFile = imgFileMap[product.id];
    if (imgFile && !product.image_url) {
      setUploadingMap((p) => ({ ...p, [product.id]: true }));
      try {
        const publicUrl = await uploadImage(imgFile, product.id);
        // Save to pending_image_url — admin must approve before it shows as image_url
        await supabase.from("master_products").update({ pending_image_url: publicUrl }).eq("id", product.id);
        setProducts((prev) => prev.map((p) => p.id === product.id ? { ...p, pending_image_url: publicUrl } : p));
      } catch (err) {
        console.error("Upload failed");
      }
      setUploadingMap((p) => ({ ...p, [product.id]: false }));
    }

    const { error } = await supabase.from("shop_products").upsert({
      shop_id: user.id,
      product_id: product.id,
      price: Number(price),
      mrp: mrpNum,
      stock: Number(stock),
      name: product.name ?? "",
      size: product.size ?? "",
    }, { onConflict: "shop_id,product_id" });
    if (error) { alert(error.message); return; }

    setAddedMap((p) => ({ ...p, [product.id]: true }));
    setTimeout(() => setAddedMap((p) => ({ ...p, [product.id]: false })), 2500);
    setPriceMap((p) => ({ ...p, [product.id]: "" }));
    setMrpMap((p) => ({ ...p, [product.id]: "" }));
    setStockMap((p) => ({ ...p, [product.id]: "" }));
  }

  return (
    <div className="page">
      <style>{CSS}</style>

      <div className="top-bar">
        <div className="top-row">
          <a href="/shop-dashboard" className="back-btn">←</a>
          <div className="page-title">Add Products</div>
          <a href="/bulk-upload" style={{display:"flex",alignItems:"center",gap:5,background:"rgba(255,255,255,0.18)",padding:"6px 10px",borderRadius:9,textDecoration:"none",color:"white",fontSize:12,fontWeight:800,flexShrink:0}}>
            📊 Bulk
          </a>
        </div>
        <div className="search-bar">
          <span style={{ fontSize: 16 }}>🔍</span>
          <input placeholder="Search product catalog..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      {/* Loose product banner */}
      <div style={{padding:"12px 16px 0",maxWidth:560,margin:"0 auto"}}>
        <a href="/add-loose-product" style={{display:"flex",alignItems:"center",gap:10,padding:"14px 16px",background:"linear-gradient(135deg,#EBF1FF,#F4F7FF)",border:"1.5px solid #C5D5FF",borderRadius:14,textDecoration:"none",marginBottom:2}}>
          <span style={{fontSize:26}}>🧺</span>
          <div>
            <div style={{fontSize:14,fontWeight:800,color:"#1A6BFF"}}>Add Loose / Bulk Product</div>
            <div style={{fontSize:12,color:"#8A96B5",fontWeight:500}}>Atta, Rice, Dal, Oil — sold by kg or litre</div>
          </div>
          <span style={{marginLeft:"auto",color:"#1A6BFF",fontSize:18}}>→</span>
        </a>
        <div style={{textAlign:"center",fontSize:11,color:"#B0BACC",fontWeight:600,margin:"8px 0 0px"}}>— or search packaged products below —</div>
      </div>

      <div className="content">
        {loading ? (
          <div className="loading-state">Searching products...</div>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <div className="empty-title">No products found</div>
            <div className="empty-sub">Try a different search term</div>
          </div>
        ) : (
          <>
            <div className="results-label">{products.length} products found</div>
            {products.map((product) => {
              const previewUrl = imgPreviewMap[product.id] || product.image_url || product.pending_image_url || "";
              const hasExistingImg = !!product.image_url;
              const hasPendingImg = !!product.pending_image_url && !product.image_url;
              const isUploading = uploadingMap[product.id];

              return (
                <div key={product.id} className="product-row">
                  <div className="product-top">
                    <div className="product-img" style={{position:"relative"}}>
                      {previewUrl
                        ? <img src={previewUrl} alt={product.name} />
                        : "🛍️"}
                      {hasPendingImg && (
                        <div style={{position:"absolute",bottom:0,left:0,right:0,background:"rgba(255,180,0,0.92)",fontSize:9,fontWeight:800,color:"white",textAlign:"center",padding:"2px 0",borderRadius:"0 0 6px 6px"}}>⏳ Pending</div>
                      )}
                    </div>
                    <div className="product-details">
                      <div className="product-name">{product.name ?? "Unnamed"}</div>
                      {product.size && <div className="product-size">{product.size}</div>}
                      {product.category && <span className="product-cat">{product.category}</span>}
                      {hasPendingImg && <div style={{fontSize:10,color:"#946200",fontWeight:700,marginTop:3}}>📸 Photo pending admin approval</div>}
                    </div>
                  </div>

                  {/* Image upload */}
                  <div
                    className={`img-upload-row ${hasExistingImg ? "locked" : ""}`}
                    onClick={() => { if (!hasExistingImg) fileInputRefs.current[product.id]?.click(); }}
                  >
                    <div className="img-thumb">
                      {previewUrl ? <img src={previewUrl} alt="" /> : "📷"}
                    </div>
                    {hasExistingImg ? (
                      <div className="img-exists-label">✅ Photo saved — shared with all shopkeepers</div>
                    ) : imgFileMap[product.id] ? (
                      <div>
                        <div className="img-upload-text">📷 Photo selected</div>
                        <div className="img-upload-sub">Will upload when you add to inventory</div>
                      </div>
                    ) : (
                      <div>
                        <div className="img-upload-text">📷 Add product photo</div>
                        <div className="img-upload-sub">Saves for all shopkeepers</div>
                      </div>
                    )}
                  </div>
                  <input
                    ref={(el) => { fileInputRefs.current[product.id] = el; }}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    style={{ display: "none" }}
                    onChange={(e) => handleImgSelect(product.id, e)}
                  />

                  {/* Multi-photo gallery (up to 5, admin-approved) */}
                  {(() => {
                    const count = photoCountMap[product.id] || 0;
                    const full = count >= 5;
                    const uploading = galleryUploadingMap[product.id];
                    const justDone = galleryDoneMap[product.id] || 0;
                    return (
                      <div style={{marginBottom:12,padding:"10px 12px",background:"#F7F9FF",border:"1.5px solid #E4EAFF",borderRadius:10}}>
                        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:8}}>
                          <div>
                            <div style={{fontSize:12,fontWeight:800,color:"#0D1B3E"}}>🖼️ Product photos ({count}/5)</div>
                            <div style={{fontSize:10,color:"#8A96B5",fontWeight:500,marginTop:2}}>
                              {full ? "Maximum reached" : "Add photos — shown after admin approval"}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => { if (!full && !uploading) galleryInputRefs.current[product.id]?.click(); }}
                            disabled={full || uploading}
                            style={{padding:"8px 12px",background:full?"#E4EAFF":"#1A6BFF",color:full?"#8A96B5":"white",border:"none",borderRadius:9,fontSize:12,fontWeight:800,cursor:full||uploading?"default":"pointer",fontFamily:"'Plus Jakarta Sans',sans-serif",whiteSpace:"nowrap",flexShrink:0}}
                          >
                            {uploading ? "⏳ Uploading..." : justDone > 0 ? `✓ +${justDone}` : full ? "Full" : "+ Add photos"}
                          </button>
                        </div>
                        {count > 0 && (
                          <div style={{fontSize:10,color:"#946200",fontWeight:700,marginTop:6}}>📸 Newly added photos stay pending until an admin approves them.</div>
                        )}
                        <input
                          ref={(el) => { galleryInputRefs.current[product.id] = el; }}
                          type="file"
                          accept="image/*"
                          multiple
                          style={{ display: "none" }}
                          onChange={(e) => handleGallerySelect(product.id, e)}
                        />
                      </div>
                    );
                  })()}

                  <div className="input-row">
                    <div className="mini-field">
                      <div className="mini-label">MRP (₹)</div>
                      <input className="mini-input" placeholder="0.00" type="number" min="0" value={mrpMap[product.id] ?? ""} onChange={(e) => setMrpMap((p) => ({ ...p, [product.id]: e.target.value }))} />
                    </div>
                    <div className="mini-field">
                      <div className="mini-label">Selling (₹)</div>
                      <input className="mini-input" placeholder="0.00" type="number" min="0" value={priceMap[product.id] ?? ""} onChange={(e) => setPriceMap((p) => ({ ...p, [product.id]: e.target.value }))} />
                    </div>
                    <div className="mini-field">
                      <div className="mini-label">Stock</div>
                      <input className="mini-input" placeholder="0" type="number" min="0" value={stockMap[product.id] ?? ""} onChange={(e) => setStockMap((p) => ({ ...p, [product.id]: e.target.value }))} />
                    </div>
                    <button
                      className={`add-btn ${addedMap[product.id] ? "added" : ""}`}
                      onClick={() => addProduct(product)}
                      disabled={isUploading}
                    >
                      {isUploading ? "⏳" : addedMap[product.id] ? "✓ Added" : "+ Add"}
                    </button>
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>

      <nav className="bottom-nav">
        <a href="/shop-dashboard" className="nav-item"><div className="nav-icon">🏠</div>Home</a>
        <a href="/add-product" className="nav-item active"><div className="nav-icon">➕</div>Add</a>
        <a href="/shop-orders" className="nav-item"><div className="nav-icon">📋</div>Orders</a>
      </nav>
    </div>
  );
}
