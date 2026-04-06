"use client";
import { useState, useRef, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Plus Jakarta Sans', sans-serif; background: #F4F6FB; }
.top-bar { background: linear-gradient(135deg, #0B1F5C, #1A6BFF); padding: 14px 16px 16px; display: flex; align-items: center; gap: 12px; }
.back-btn { width: 36px; height: 36px; background: rgba(255,255,255,0.18); border: none; border-radius: 10px; color: white; font-size: 18px; cursor: pointer; display: flex; align-items: center; justify-content: center; }
.page-title { font-size: 18px; font-weight: 900; color: white; }
.page { padding: 16px 16px 100px; max-width: 640px; margin: 0 auto; }
.card { background: white; border-radius: 16px; border: 1.5px solid #E4EAFF; padding: 20px; margin-bottom: 16px; box-shadow: 0 2px 10px rgba(26,107,255,0.05); }
.card-title { font-size: 15px; font-weight: 800; color: #0D1B3E; margin-bottom: 4px; }
.card-sub { font-size: 12px; color: #8A96B5; font-weight: 500; margin-bottom: 16px; line-height: 1.5; }
.drop-zone { border: 2px dashed #C5D5FF; border-radius: 14px; padding: 36px 20px; text-align: center; cursor: pointer; transition: all 0.2s; background: #F8FAFF; margin-bottom: 14px; }
.drop-zone:hover, .drop-zone.drag { border-color: #1A6BFF; background: #EBF1FF; }
.drop-zone.has-file { border-color: #00B37E; background: #E6FAF4; border-style: solid; }
.drop-icon { font-size: 40px; margin-bottom: 10px; }
.drop-title { font-size: 15px; font-weight: 800; color: #0D1B3E; margin-bottom: 4px; }
.drop-sub { font-size: 12px; color: #8A96B5; font-weight: 500; }
.template-btn { display: flex; align-items: center; gap: 8px; padding: 12px 16px; background: #EBF1FF; border: 1.5px solid #C5D5FF; border-radius: 12px; color: #1A6BFF; font-size: 13px; font-weight: 800; cursor: pointer; font-family: inherit; width: 100%; margin-bottom: 12px; transition: all 0.2s; text-decoration: none; }
.template-btn:hover { background: #D6E4FF; }
.col-map { margin-bottom: 14px; }
.col-map-title { font-size: 12px; font-weight: 800; color: #8A96B5; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 10px; }
.col-row { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
.col-label { font-size: 13px; font-weight: 700; color: #0D1B3E; width: 120px; flex-shrink: 0; }
.col-select { flex: 1; padding: 8px 12px; border: 1.5px solid #E4EAFF; border-radius: 8px; font-size: 13px; font-weight: 600; color: #0D1B3E; font-family: inherit; outline: none; background: white; }
.col-select:focus { border-color: #1A6BFF; }
.col-required { font-size: 10px; color: #E53E3E; font-weight: 800; margin-left: 4px; }
.preview-table { width: 100%; border-collapse: collapse; font-size: 12px; margin-bottom: 14px; }
.preview-table th { background: #F4F6FB; padding: 8px 10px; text-align: left; font-weight: 800; color: #8A96B5; font-size: 11px; text-transform: uppercase; letter-spacing: 0.4px; border-bottom: 1.5px solid #E4EAFF; }
.preview-table td { padding: 8px 10px; border-bottom: 1px solid #F4F6FB; color: #0D1B3E; font-weight: 600; }
.preview-table tr:last-child td { border-bottom: none; }
.row-ok { background: #F0FBF7; }
.row-err { background: #FFF5F5; }
.row-warn { background: #FFFBEB; }
.badge { display: inline-block; font-size: 10px; font-weight: 800; padding: 2px 6px; border-radius: 4px; }
.badge-ok { background: #E6FAF4; color: #00875A; }
.badge-err { background: #FFF0F0; color: #E53E3E; }
.badge-warn { background: #FFF8E6; color: #946200; }
.upload-btn { width: 100%; padding: 15px; background: #1A6BFF; color: white; border: none; border-radius: 14px; font-size: 16px; font-weight: 800; cursor: pointer; font-family: inherit; transition: all 0.2s; margin-bottom: 10px; }
.upload-btn:hover:not(:disabled) { background: #1255CC; transform: translateY(-1px); }
.upload-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
.progress-bar { height: 8px; background: #E4EAFF; border-radius: 4px; overflow: hidden; margin-bottom: 8px; }
.progress-fill { height: 100%; background: #1A6BFF; border-radius: 4px; transition: width 0.3s; }
.result-summary { background: #F4F6FB; border-radius: 12px; padding: 14px; }
.result-row { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; font-size: 13px; font-weight: 700; }
.result-row:last-child { margin-bottom: 0; }
.format-tip { background: #EBF1FF; border-radius: 10px; padding: 12px 14px; font-size: 12px; color: #4A5880; font-weight: 600; line-height: 1.6; margin-bottom: 14px; }
.format-tip strong { color: #1A6BFF; }
`;

const REQUIRED_COLS = ["name", "price", "stock"];
const OPTIONAL_COLS = ["category", "size", "brand"];
const ALL_COLS = [...REQUIRED_COLS, ...OPTIONAL_COLS];

function downloadTemplate() {
  const headers = ["name", "price", "stock", "category", "size", "brand"];
  const examples = [
    ["Amul Gold Full Cream Milk", "69", "50", "Dairy", "1L", "Amul"],
    ["Britannia Good Day Butter", "30", "30", "Biscuits", "150g", "Britannia"],
    ["Surf Excel Easy Wash", "55", "20", "Detergent", "500g", "Surf Excel"],
  ];
  const csvContent = [headers, ...examples].map(r => r.join(",")).join("\n");
  const blob = new Blob([csvContent], { type: "text/csv" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "bubbry_stock_template.csv";
  a.click();
}

export default function BulkUploadPage() {
  const [step, setStep] = useState<"upload"|"map"|"preview"|"done">("upload");
  const [file, setFile] = useState<File|null>(null);
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<any[][]>([]);
  const [colMap, setColMap] = useState<Record<string,string>>({});
  const [preview, setPreview] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<{ok:number,skipped:number,errors:string[]}>({ok:0,skipped:0,errors:[]});
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Load SheetJS
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js";
    document.head.appendChild(script);
  }, []);

  function handleFile(f: File) {
    setFile(f);
    const reader = new FileReader();
    reader.onload = (e) => {
      const XLSX = (window as any).XLSX;
      if (!XLSX) { alert("Processing library not ready, please try again in a second"); return; }
      const data = new Uint8Array(e.target!.result as ArrayBuffer);
      const wb = XLSX.read(data, { type: "array" });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const json: any[][] = XLSX.utils.sheet_to_json(ws, { header: 1, defval: "" });
      if (json.length < 2) { alert("File appears empty. Please check the file."); return; }
      const hdrs = json[0].map((h: any) => String(h).trim());
      const dataRows = json.slice(1).filter((r: any[]) => r.some(c => String(c).trim() !== ""));
      setHeaders(hdrs);
      setRows(dataRows);
      // Auto-detect column mapping
      const autoMap: Record<string,string> = {};
      ALL_COLS.forEach(col => {
        const match = hdrs.find((h: string) =>
          h.toLowerCase().replace(/[^a-z0-9]/g,"").includes(col.toLowerCase()) ||
          col.toLowerCase().includes(h.toLowerCase().replace(/[^a-z0-9]/g,""))
        );
        if (match) autoMap[col] = match;
      });
      setColMap(autoMap);
      setStep("map");
    };
    reader.readAsArrayBuffer(f);
  }

  function buildPreview() {
    const built = rows.map((row, i) => {
      const get = (col: string) => {
        const h = colMap[col];
        if (!h) return "";
        const idx = headers.indexOf(h);
        return idx >= 0 ? String(row[idx] ?? "").trim() : "";
      };
      const name = get("name");
      const price = parseFloat(get("price"));
      const stock = parseInt(get("stock"));
      const errors: string[] = [];
      if (!name) errors.push("Name missing");
      if (isNaN(price) || price < 0) errors.push("Invalid price");
      if (isNaN(stock) || stock < 0) errors.push("Invalid stock");
      return {
        rowNum: i + 2,
        name, price, stock,
        category: get("category") || "Other",
        size: get("size") || "",
        brand: get("brand") || "",
        errors,
        status: errors.length > 0 ? "error" : "ok",
      };
    });
    setPreview(built);
    setStep("preview");
  }

  async function doUpload() {
    setUploading(true);
    setProgress(0);
    const { data: { session } } = await supabase.auth.getSession();
    const shopId = session?.user?.id;
    if (!shopId) { alert("Please login"); setUploading(false); return; }

    const validRows = preview.filter(r => r.status === "ok");
    let ok = 0, skipped = 0;
    const errors: string[] = [];

    for (let i = 0; i < validRows.length; i++) {
      const item = validRows[i];
      setProgress(Math.round((i / validRows.length) * 100));
      try {
        // Check if product already exists in master_products by name
        const { data: existing } = await supabase
          .from("master_products")
          .select("id, name")
          .ilike("name", item.name.trim())
          .limit(1);

        let productId: string;
        if (existing && existing.length > 0) {
          productId = existing[0].id;
        } else {
          // Create in master_products
          const { data: newMp, error: mpErr } = await supabase
            .from("master_products")
            .insert({ name: item.name, category: item.category, size: item.size, brand: item.brand })
            .select("id").single();
          if (mpErr || !newMp) { errors.push(`Row ${item.rowNum}: ${mpErr?.message || "Failed to create product"}`); continue; }
          productId = newMp.id;
        }

        // Upsert in shop_products
        const { error: spErr } = await supabase.from("shop_products").upsert({
          shop_id: shopId,
          product_id: productId,
          name: item.name,
          price: item.price,
          stock: item.stock,
          size: item.size,
          category: item.category,
        }, { onConflict: "shop_id,product_id" });

        if (spErr) { errors.push(`Row ${item.rowNum} (${item.name}): ${spErr.message}`); }
        else ok++;
      } catch (e: any) {
        errors.push(`Row ${item.rowNum}: ${e.message}`);
      }
    }

    skipped = preview.filter(r => r.status === "error").length;
    setProgress(100);
    setResults({ ok, skipped, errors });
    setUploading(false);
    setStep("done");
  }

  const validCount = preview.filter(r => r.status === "ok").length;
  const errorCount = preview.filter(r => r.status === "error").length;

  return (
    <div style={{ minHeight: "100vh", background: "#F4F6FB", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <style>{CSS}</style>
      <div className="top-bar">
        <a href="/add-product" className="back-btn">←</a>
        <div className="page-title">📦 Bulk Stock Upload</div>
      </div>

      <div className="page">

        {/* Step 1: Upload */}
        {step === "upload" && (
          <>
            <div className="card">
              <div className="card-title">Upload your stock file</div>
              <div className="card-sub">Upload an Excel (.xlsx) or CSV file with your product inventory. Download the template below to get started.</div>

              <button className="template-btn" onClick={downloadTemplate}>
                📥 Download Template (CSV)
              </button>

              <div className="format-tip">
                <strong>Required columns:</strong> name, price, stock<br/>
                <strong>Optional columns:</strong> category, size, brand<br/>
                Column names don't need to match exactly — you can map them in the next step.
              </div>

              <div
                className={`drop-zone ${dragging ? "drag" : ""} ${file ? "has-file" : ""}`}
                onDragOver={e => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={e => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
                onClick={() => fileRef.current?.click()}
              >
                <div className="drop-icon">{file ? "✅" : "📂"}</div>
                <div className="drop-title">{file ? file.name : "Tap to select file"}</div>
                <div className="drop-sub">{file ? `${rows.length} rows detected` : "Excel (.xlsx) or CSV (.csv) — drag & drop or tap"}</div>
              </div>
              <input ref={fileRef} type="file" accept=".xlsx,.xls,.csv" style={{display:"none"}}
                onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
            </div>
          </>
        )}

        {/* Step 2: Column Mapping */}
        {step === "map" && (
          <div className="card">
            <div className="card-title">Map your columns</div>
            <div className="card-sub">Match your spreadsheet columns to the required fields. We've auto-detected what we can.</div>

            <div className="col-map">
              <div className="col-map-title">Column Mapping</div>
              {ALL_COLS.map(col => (
                <div key={col} className="col-row">
                  <div className="col-label">
                    {col.charAt(0).toUpperCase() + col.slice(1)}
                    {REQUIRED_COLS.includes(col) && <span className="col-required">*</span>}
                  </div>
                  <select className="col-select" value={colMap[col] || ""} onChange={e => setColMap(m => ({...m, [col]: e.target.value}))}>
                    <option value="">— not mapped —</option>
                    {headers.map(h => <option key={h} value={h}>{h}</option>)}
                  </select>
                </div>
              ))}
            </div>

            <div style={{fontSize:12,color:"#8A96B5",marginBottom:14,fontWeight:600}}>
              {rows.length} rows found in file
            </div>

            <button className="upload-btn"
              disabled={!colMap.name || !colMap.price || !colMap.stock}
              onClick={buildPreview}>
              {(!colMap.name || !colMap.price || !colMap.stock) ? "Map required columns first (*)" : `Preview ${rows.length} products →`}
            </button>
            <button style={{width:"100%",padding:12,background:"none",border:"none",color:"#8A96B5",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}} onClick={() => setStep("upload")}>← Change file</button>
          </div>
        )}

        {/* Step 3: Preview */}
        {step === "preview" && (
          <div className="card">
            <div className="card-title">Preview — {validCount} ready, {errorCount} skipped</div>
            <div className="card-sub">Review before uploading. Rows with errors will be skipped automatically.</div>

            <div style={{overflowX:"auto",marginBottom:14}}>
              <table className="preview-table">
                <thead>
                  <tr>
                    <th>#</th><th>Name</th><th>Price</th><th>Stock</th><th>Category</th><th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {preview.slice(0, 50).map(r => (
                    <tr key={r.rowNum} className={r.status === "ok" ? "row-ok" : "row-err"}>
                      <td style={{color:"#B0BACC"}}>{r.rowNum}</td>
                      <td style={{maxWidth:120,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.name||"—"}</td>
                      <td>₹{r.price}</td>
                      <td>{r.stock}</td>
                      <td style={{color:"#8A96B5"}}>{r.category}</td>
                      <td>
                        {r.status === "ok"
                          ? <span className="badge badge-ok">✓ Ready</span>
                          : <span className="badge badge-err" title={r.errors.join(", ")}>✗ {r.errors[0]}</span>
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {preview.length > 50 && <div style={{fontSize:12,color:"#8A96B5",textAlign:"center",padding:"8px 0"}}>Showing first 50 of {preview.length} rows</div>}
            </div>

            {uploading && (
              <div style={{marginBottom:12}}>
                <div style={{fontSize:13,fontWeight:700,color:"#1A6BFF",marginBottom:6}}>Uploading... {progress}%</div>
                <div className="progress-bar"><div className="progress-fill" style={{width:`${progress}%`}} /></div>
              </div>
            )}

            <button className="upload-btn" onClick={doUpload} disabled={uploading || validCount === 0}>
              {uploading ? `Uploading... ${progress}%` : `📦 Upload ${validCount} Products`}
            </button>
            <button style={{width:"100%",padding:12,background:"none",border:"none",color:"#8A96B5",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit",marginTop:4}} onClick={() => setStep("map")} disabled={uploading}>← Back to mapping</button>
          </div>
        )}

        {/* Step 4: Done */}
        {step === "done" && (
          <div className="card">
            <div style={{textAlign:"center",marginBottom:20}}>
              <div style={{fontSize:52,marginBottom:10}}>{results.ok > 0 ? "✅" : "⚠️"}</div>
              <div style={{fontSize:20,fontWeight:900,color:"#0D1B3E"}}>Upload Complete</div>
            </div>

            <div className="result-summary">
              <div className="result-row"><span style={{fontSize:18}}>✅</span> <span>{results.ok} products uploaded successfully</span></div>
              {results.skipped > 0 && <div className="result-row"><span style={{fontSize:18}}>⏭️</span> <span>{results.skipped} rows skipped (invalid data)</span></div>}
              {results.errors.length > 0 && (
                <div style={{marginTop:8,borderTop:"1px solid #E4EAFF",paddingTop:8}}>
                  <div style={{fontSize:12,fontWeight:800,color:"#E53E3E",marginBottom:6}}>Errors:</div>
                  {results.errors.slice(0,5).map((e,i) => <div key={i} style={{fontSize:11,color:"#E53E3E",marginBottom:4}}>• {e}</div>)}
                  {results.errors.length > 5 && <div style={{fontSize:11,color:"#8A96B5"}}>...and {results.errors.length - 5} more</div>}
                </div>
              )}
            </div>

            <div style={{display:"flex",gap:10,marginTop:16}}>
              <a href="/shop-dashboard" style={{flex:1,padding:14,background:"#1A6BFF",color:"white",border:"none",borderRadius:12,fontSize:14,fontWeight:800,cursor:"pointer",fontFamily:"inherit",textAlign:"center",textDecoration:"none",display:"flex",alignItems:"center",justifyContent:"center"}}>Go to Dashboard</a>
              <button style={{flex:1,padding:14,background:"#F4F6FB",color:"#1A6BFF",border:"1.5px solid #E4EAFF",borderRadius:12,fontSize:14,fontWeight:800,cursor:"pointer",fontFamily:"inherit"}} onClick={() => { setStep("upload"); setFile(null); setHeaders([]); setRows([]); setColMap({}); setPreview([]); setResults({ok:0,skipped:0,errors:[]}); }}>Upload Another</button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
