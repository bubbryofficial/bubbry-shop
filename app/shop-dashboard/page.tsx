"use client";
import { supabase } from "../../lib/supabase";

import { useState, useEffect, useRef } from "react";
import BarcodeScanner from "@/components/BarcodeScanner";


const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
* { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
body { font-family: 'Plus Jakarta Sans', sans-serif; background: #F4F6FB; }
.page { min-height: 100vh; background: #F4F6FB; font-family: 'Plus Jakarta Sans', sans-serif; padding-bottom: 80px; }

.top-bar { background: #1A6BFF; padding: 16px 20px 20px; position: sticky; top: 0; z-index: 100; box-shadow: 0 4px 20px rgba(26,107,255,0.25); }
.top-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
.brand { font-size: 20px; font-weight: 900; color: white; letter-spacing: -0.5px; }
.orders-link { display: flex; align-items: center; gap: 6px; background: rgba(255,255,255,0.18); border: 1.5px solid rgba(255,255,255,0.28); color: white; padding: 8px 14px; border-radius: 10px; font-size: 13px; font-weight: 700; text-decoration: none; }
.stats-row { display: flex; gap: 10px; }
.stat-chip { flex: 1; background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.2); border-radius: 12px; padding: 10px 12px; }
.stat-val { font-size: 20px; font-weight: 900; color: white; line-height: 1; }
.stat-lbl { font-size: 10px; color: rgba(255,255,255,0.7); font-weight: 600; margin-top: 2px; text-transform: uppercase; letter-spacing: 0.4px; }

.tab-bar { background: white; display: flex; border-bottom: 2px solid #E4EAFF; }
.tab { flex: 1; padding: 14px 12px; font-size: 13px; font-weight: 700; color: #B0BACC; background: none; border: none; border-bottom: 3px solid transparent; margin-bottom: -2px; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.2s; }
.tab.active { color: #1A6BFF; border-bottom-color: #1A6BFF; }

.content { padding: 16px; max-width: 480px; margin: 0 auto; }
.card { background: white; border-radius: 16px; border: 1.5px solid #E4EAFF; overflow: hidden; margin-bottom: 14px; box-shadow: 0 2px 10px rgba(26,107,255,0.06); }
.card-hdr { padding: 14px 16px; border-bottom: 1px solid #F4F6FB; display: flex; align-items: center; gap: 10px; }
.card-hdr-icon { width: 34px; height: 34px; border-radius: 10px; background: #EBF1FF; display: flex; align-items: center; justify-content: center; font-size: 16px; flex-shrink: 0; }
.card-hdr-title { font-size: 15px; font-weight: 800; color: #0D1B3E; }
.card-hdr-sub { font-size: 11px; color: #8A96B5; font-weight: 500; }
.card-body { padding: 16px; }

.scanner-zone { background: linear-gradient(135deg, #EBF1FF, #DDEAFF); border: 2px dashed #1A6BFF; border-radius: 14px; padding: 20px; text-align: center; margin-bottom: 16px; }
.scan-btn { display: flex; align-items: center; justify-content: center; gap: 8px; width: 100%; padding: 13px 20px; border: none; border-radius: 12px; font-size: 15px; font-weight: 800; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.2s; color: white; }
.scan-hint { font-size: 12px; color: #1A6BFF; font-weight: 600; margin-top: 10px; }
.scanned-badge { display: flex; align-items: center; gap: 8px; background: #E6FAF4; border: 1.5px solid #00B37E; border-radius: 10px; padding: 10px 14px; margin-top: 12px; }
.scanned-text { font-size: 13px; font-weight: 700; color: #00875A; }
.scanned-code { font-size: 11px; color: #00B37E; font-weight: 600; font-family: monospace; }
.scanner-wrap { margin-top: 14px; border-radius: 12px; overflow: hidden; }

.toast { display: flex; align-items: center; gap: 8px; border-left: 4px solid; border-radius: 10px; padding: 10px 14px; margin-bottom: 14px; font-size: 13px; font-weight: 700; }
.toast-info { background: #EBF1FF; border-color: #1A6BFF; color: #1A6BFF; }
.toast-success { background: #E6FAF4; border-color: #00B37E; color: #00875A; }
.toast-warn { background: #FFF8E6; border-color: #FFB800; color: #946200; }

.field { margin-bottom: 14px; }
.field-label { display: block; font-size: 11px; font-weight: 800; color: #8A96B5; text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 7px; }
.field-input { width: 100%; padding: 13px 16px; border: 2px solid #E4EAFF; border-radius: 12px; font-size: 15px; font-weight: 500; color: #0D1B3E; background: #F4F6FB; font-family: 'Plus Jakarta Sans', sans-serif; outline: none; transition: all 0.2s; }
.field-input:focus { border-color: #1A6BFF; background: white; box-shadow: 0 0 0 4px rgba(26,107,255,0.1); }
.field-input.has-val { border-color: #1A6BFF; }
.fields-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.prefix-wrap { position: relative; }
.prefix { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); font-size: 14px; font-weight: 800; color: #8A96B5; pointer-events: none; }
.field-input.prefixed { padding-left: 28px; }

/* IMAGE UPLOAD */
.img-upload-zone { border: 2px dashed #E4EAFF; border-radius: 14px; overflow: hidden; margin-bottom: 14px; transition: border-color 0.2s; cursor: pointer; }
.img-upload-zone:hover { border-color: #1A6BFF; }
.img-upload-zone.has-img { border-color: #00B37E; border-style: solid; }
.img-upload-zone.locked { cursor: default; opacity: 0.9; }
.img-preview { width: 100%; height: 160px; object-fit: contain; background: linear-gradient(135deg, #EBF1FF, #DDEAFF); display: block; }
.img-upload-placeholder { height: 120px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; background: #F4F6FB; }
.img-upload-icon { font-size: 32px; }
.img-upload-text { font-size: 13px; font-weight: 700; color: #8A96B5; }
.img-upload-sub { font-size: 11px; color: #B0BACC; font-weight: 500; }
.img-exists-badge { display: flex; align-items: center; gap: 6px; background: #E6FAF4; padding: 6px 12px; font-size: 12px; font-weight: 700; color: #00875A; }

.submit-btn { width: 100%; padding: 15px; background: #1A6BFF; color: white; border: none; border-radius: 14px; font-size: 16px; font-weight: 800; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 8px; margin-top: 4px; }
.submit-btn:hover:not(:disabled) { background: #1255CC; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(26,107,255,0.35); }
.submit-btn:disabled { opacity: 0.55; cursor: not-allowed; }
.submit-btn.success { background: #00B37E; }

.search-bar { display: flex; align-items: center; gap: 10px; background: white; border: 2px solid #E4EAFF; border-radius: 12px; padding: 11px 14px; margin-bottom: 14px; }
.search-bar input { border: none; outline: none; font-size: 14px; font-weight: 500; color: #0D1B3E; background: transparent; width: 100%; font-family: 'Plus Jakarta Sans', sans-serif; }

.prod-card { background: white; border-radius: 14px; border: 1.5px solid #E4EAFF; padding: 14px 16px; margin-bottom: 10px; display: flex; align-items: center; gap: 12px; box-shadow: 0 1px 6px rgba(26,107,255,0.05); }
.prod-icon { width: 46px; height: 46px; border-radius: 10px; background: linear-gradient(135deg,#EBF1FF,#DDEAFF); display: flex; align-items: center; justify-content: center; font-size: 20px; flex-shrink: 0; overflow: hidden; }
.prod-icon img { width: 100%; height: 100%; object-fit: cover; }
.prod-info { flex: 1; }
.prod-name { font-size: 14px; font-weight: 700; color: #0D1B3E; margin-bottom: 3px; }
.prod-meta { display: flex; gap: 8px; align-items: center; }
.prod-price { font-size: 15px; font-weight: 900; color: #1A6BFF; }
.stock-badge { padding: 2px 8px; border-radius: 20px; font-size: 11px; font-weight: 700; }
.stock-ok { background: #E6FAF4; color: #00875A; }
.stock-low { background: #FFF8E6; color: #946200; }
.del-btn { padding: 7px 12px; background: #FFF0F0; color: #F03D3D; border: 1.5px solid #FFD6D6; border-radius: 8px; font-size: 11px; font-weight: 800; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; flex-shrink: 0; }

.empty-state { text-align: center; padding: 50px 20px; }
.empty-icon { font-size: 48px; margin-bottom: 10px; }
.empty-title { font-size: 16px; font-weight: 800; color: #0D1B3E; margin-bottom: 4px; }
.empty-sub { font-size: 13px; color: #8A96B5; }

.live-bar { background: rgba(0,0,0,0.18); border-radius: 14px; padding: 12px 14px; margin-bottom: 14px; display: flex; flex-direction: column; gap: 10px; }
.live-toggle-row { display: flex; align-items: center; justify-content: space-between; }
.live-toggle-label { display: flex; align-items: center; gap: 8px; }
.live-dot { width: 8px; height: 8px; border-radius: 50%; background: #ccc; flex-shrink: 0; }
.live-dot.on { background: #4ade80; box-shadow: 0 0 6px #4ade80; animation: pulse-dot 1.5s infinite; }
@keyframes pulse-dot { 0%,100%{opacity:1} 50%{opacity:0.5} }
.live-label-text { font-size: 14px; font-weight: 800; color: rgba(255,255,255,0.9); }
.live-label-sub { font-size: 10px; color: rgba(255,255,255,0.6); font-weight: 600; }
.toggle-switch { position: relative; width: 48px; height: 26px; flex-shrink: 0; }
.toggle-switch input { opacity: 0; width: 0; height: 0; }
.toggle-track { position: absolute; inset: 0; background: rgba(255,255,255,0.2); border-radius: 26px; cursor: pointer; transition: background 0.25s; }
.toggle-track.on { background: #4ade80; }
.toggle-thumb { position: absolute; top: 3px; left: 3px; width: 20px; height: 20px; background: white; border-radius: 50%; transition: transform 0.25s; box-shadow: 0 1px 4px rgba(0,0,0,0.2); }
.toggle-thumb.on { transform: translateX(22px); }
.delivery-row { display: flex; gap: 8px; }
.delivery-chip { flex: 1; display: flex; align-items: center; justify-content: center; gap: 6px; padding: 8px 10px; border-radius: 10px; border: 1.5px solid rgba(255,255,255,0.25); background: rgba(255,255,255,0.1); color: rgba(255,255,255,0.7); font-size: 12px; font-weight: 700; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.2s; }
.delivery-chip.on { background: rgba(255,255,255,0.95); color: #1A6BFF; border-color: white; }
.delivery-chip:disabled { opacity: 0.4; cursor: not-allowed; }
.offline-overlay { position: absolute; inset: 0; background: rgba(255,255,255,0.6); backdrop-filter: blur(2px); z-index: 10; display: flex; align-items: center; justify-content: center; border-radius: 16px; pointer-events: none; }
.offline-overlay-text { font-size: 13px; font-weight: 800; color: #8A96B5; }
.bottom-nav { position: fixed; bottom: 0; left: 0; right: 0; height: 70px; background: white; border-top: 1.5px solid #E4EAFF; display: flex; align-items: center; box-shadow: 0 -4px 20px rgba(26,107,255,0.07); z-index: 100; }
.nav-item { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 3px; padding: 8px 0; text-decoration: none; color: #B0BACC; font-size: 10px; font-weight: 700; transition: color 0.15s; }
.nav-item.active { color: #1A6BFF; }
.nav-icon { font-size: 22px; line-height: 1; }
.profile-overlay { position: fixed; inset: 0; background: rgba(13,27,62,0.55); z-index: 500; display: flex; align-items: flex-end; justify-content: center; backdrop-filter: blur(4px); }
.profile-sheet { background: white; border-radius: 24px 24px 0 0; width: 100%; max-width: 480px; padding: 0 0 48px; animation: slideUp 0.3s ease; max-height: 90vh; overflow-y: auto; }
.profile-handle { width: 40px; height: 4px; background: #E4EAFF; border-radius: 2px; margin: 16px auto 20px; }
.ph { padding: 0 20px 16px; border-bottom: 1.5px solid #F4F6FB; }
.ph-title { font-size: 18px; font-weight: 900; color: #0D1B3E; margin-bottom: 4px; }
.ph-sub { font-size: 13px; color: #8A96B5; font-weight: 500; }
.ps { padding: 16px 20px; border-bottom: 1.5px solid #F4F6FB; }
.ps:last-child { border-bottom: none; }
.ps-title { font-size: 12px; font-weight: 800; color: #8A96B5; text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 12px; }
.pfield { background: #F4F6FB; border-radius: 12px; padding: 13px 14px; margin-bottom: 10px; }
.pfield-lbl { font-size: 11px; font-weight: 700; color: #B0BACC; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 3px; }
.pfield-val { font-size: 15px; font-weight: 600; color: #0D1B3E; }
.pinput { width: 100%; padding: 13px 14px; border: 2px solid #E4EAFF; border-radius: 12px; font-size: 15px; font-weight: 600; color: #0D1B3E; font-family: 'Plus Jakarta Sans', sans-serif; outline: none; transition: all 0.2s; background: white; box-sizing: border-box; }
.pinput:focus { border-color: #1A6BFF; box-shadow: 0 0 0 3px rgba(26,107,255,0.08); }
.upi-saved-row { display: flex; align-items: center; justify-content: space-between; background: #E6FAF4; border: 1.5px solid #B8E8D4; border-radius: 12px; padding: 13px 14px; }
.upi-saved-id { font-size: 14px; font-weight: 800; color: #0D1B3E; font-family: monospace; }
.edit-upi-btn { background: none; border: none; color: #1A6BFF; font-size: 13px; font-weight: 700; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; }
.incomplete-badge { display: inline-flex; align-items: center; gap: 4px; background: rgba(255,184,0,0.25); border-radius: 6px; padding: 2px 8px; font-size: 11px; font-weight: 700; color: #FFD966; cursor: pointer; margin-top: 2px; }
.complete-badge { display: inline-flex; align-items: center; gap: 4px; background: rgba(74,222,128,0.2); border-radius: 6px; padding: 2px 8px; font-size: 11px; font-weight: 700; color: #4ADE80; margin-top: 2px; }
.save-upi-btn { width: 100%; padding: 13px; background: #1A6BFF; color: white; border: none; border-radius: 12px; font-size: 15px; font-weight: 800; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; margin-top: 10px; transition: all 0.2s; }
.save-upi-btn:disabled { opacity: 0.55; cursor: not-allowed; }

.autocomplete-wrap { position: relative; }
.suggestions-dropdown { position: absolute; top: calc(100% + 4px); left: 0; right: 0; background: white; border: 2px solid #1A6BFF; border-radius: 12px; box-shadow: 0 8px 30px rgba(26,107,255,0.15); z-index: 200; overflow: hidden; max-height: 240px; overflow-y: auto; }
.suggestion-item { display: flex; align-items: center; gap: 10px; padding: 11px 14px; cursor: pointer; transition: background 0.15s; border-bottom: 1px solid #F4F6FB; }
.suggestion-item:last-child { border-bottom: none; }
.suggestion-item:hover { background: #EBF1FF; }
.suggestion-name { font-size: 13px; font-weight: 700; color: #0D1B3E; line-height: 1.3; }
.suggestion-meta { font-size: 11px; color: #8A96B5; font-weight: 500; margin-top: 1px; }

.manual-barcode-row { display: flex; gap: 8px; align-items: center; margin-bottom: 14px; }
.manual-barcode-row .field-input { margin: 0; }
.barcode-tag { display: inline-flex; align-items: center; gap: 6px; background: #EBF1FF; border: 1.5px solid #1A6BFF; border-radius: 8px; padding: 4px 10px; font-size: 11px; font-weight: 700; color: #1A6BFF; font-family: monospace; }

.cat-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; max-height: 260px; overflow-y: auto; padding: 2px; }
.cat-grid::-webkit-scrollbar { width: 4px; }
.cat-grid::-webkit-scrollbar-thumb { background: #E4EAFF; border-radius: 4px; }
.cat-option { display: flex; align-items: center; gap: 8px; padding: 10px 12px; border: 2px solid #E4EAFF; border-radius: 10px; cursor: pointer; background: white; transition: all 0.15s; font-family: 'Plus Jakarta Sans', sans-serif; }
.cat-option:hover { border-color: #1A6BFF; background: #EBF1FF; }
.cat-option.selected { border-color: #1A6BFF; background: #EBF1FF; }
.cat-option-icon { font-size: 20px; flex-shrink: 0; }
.cat-option-name { font-size: 11px; font-weight: 700; color: #0D1B3E; line-height: 1.3; }
.new-product-notice { display: flex; align-items: center; gap: 8px; background: #EBF1FF; border: 1.5px solid #1A6BFF; border-radius: 10px; padding: 10px 14px; margin-bottom: 14px; font-size: 12px; font-weight: 700; color: #1A6BFF; }

.existing-stock-banner { background: #FFF8E6; border: 1.5px solid #FFB800; border-radius: 12px; padding: 12px 14px; margin-bottom: 14px; display: flex; align-items: center; gap: 10px; }
.existing-stock-banner-icon { font-size: 22px; flex-shrink: 0; }
.existing-stock-banner-text { flex: 1; }
.existing-stock-banner-title { font-size: 13px; font-weight: 800; color: #946200; margin-bottom: 2px; }
.existing-stock-banner-sub { font-size: 11px; color: #B07A00; font-weight: 600; }
.existing-stock-banner-btn { padding: 7px 12px; background: #FFB800; color: white; border: none; border-radius: 8px; font-size: 12px; font-weight: 800; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; flex-shrink: 0; }

.stock-ctrl-row { display: flex; align-items: center; gap: 8px; }
.stock-ctrl-btn { width: 34px; height: 34px; border: none; border-radius: 8px; font-size: 18px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.15s; flex-shrink: 0; }
.stock-ctrl-btn.minus { background: #FFF0F0; color: #F03D3D; }
.stock-ctrl-btn.minus:hover { background: #FFD6D6; }
.stock-ctrl-btn.plus { background: #E6FAF4; color: #00875A; }
.stock-ctrl-btn.plus:hover { background: #C6F0E0; }
.stock-ctrl-input { flex: 1; padding: 8px 10px; border: 2px solid #E4EAFF; border-radius: 8px; font-size: 15px; font-weight: 800; color: #0D1B3E; text-align: center; font-family: 'Plus Jakarta Sans', sans-serif; outline: none; background: #F4F6FB; }
.stock-ctrl-input:focus { border-color: #1A6BFF; background: white; }
.stock-save-btn { padding: 8px 14px; background: #1A6BFF; color: white; border: none; border-radius: 8px; font-size: 12px; font-weight: 800; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; flex-shrink: 0; transition: all 0.15s; }
.stock-save-btn:hover { background: #1255CC; }
.stock-save-btn.saved { background: #00B37E; }
.stock-delta-hint { font-size: 10px; font-weight: 700; margin-top: 4px; text-align: center; }
`;

export default function ShopDashboard() {
  const [name, setName] = useState("");
  const [size, setSize] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [manualBarcode, setManualBarcode] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [scannedBarcode, setScannedBarcode] = useState("");
  const [scanStatus, setScanStatus] = useState<"idle"|"searching"|"found"|"notfound">("idle");
  const [activeTab, setActiveTab] = useState<"add"|"inventory">("add");
  const [loading, setLoading] = useState(false);
  const [addSuccess, setAddSuccess] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [masterSearchResults, setMasterSearchResults] = useState<any[]>([]);
  const [masterSearchLoading, setMasterSearchLoading] = useState(false);
  const [quickAddId, setQuickAddId] = useState<string|null>(null);
  const [quickAddPrice, setQuickAddPrice] = useState("");
  const [quickAddStock, setQuickAddStock] = useState("");
  const [quickAddLoading, setQuickAddLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string|null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [imgFile, setImgFile] = useState<File|null>(null);
  const [imgPreview, setImgPreview] = useState<string>("");
  const [existingImgUrl, setExistingImgUrl] = useState<string>("");
  const [uploadingImg, setUploadingImg] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [deliveryRange, setDeliveryRange] = useState(2);
  const [pendingRange, setPendingRange] = useState(2);   // slider value before saving
  const [rangeSaved, setRangeSaved] = useState(false);   // show saved feedback
  const [autoOfflinedUntil, setAutoOfflinedUntil] = useState<Date|null>(null);
  const [offersDelivery, setOffersDelivery] = useState(false);
  const [offersPickup, setOffersPickup] = useState(true);
  const [togglingLive, setTogglingLive] = useState(false);
  const [shopfrontVerified, setShopfrontVerified] = useState(false);
  const [shopfrontImage, setShopfrontImage] = useState("");
  const [upiId, setUpiId] = useState("");
  const [savingUpi, setSavingUpi] = useState(false);
  const [shopName, setShopName] = useState("My Store");
  const [ownerName, setOwnerName] = useState("");
  const [showProfile, setShowProfile] = useState(false);
  const [editingUpi, setEditingUpi] = useState(false);
  const [profileComplete, setProfileComplete] = useState(true);
  // Category
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState<any[]>([]);
  const [isNewProduct, setIsNewProduct] = useState(false);
  // Existing stock detection
  const [existingShopProduct, setExistingShopProduct] = useState<any>(null);
  // Inline stock editing per product card
  const [editStockMap, setEditStockMap] = useState<Record<string, string>>({});
  const [savedStockMap, setSavedStockMap] = useState<Record<string, boolean>>({});
  const imgInputRef = useRef<HTMLInputElement>(null);
  const suggestionDebounce = useRef<any>(null);
  const scrollSaveRef = useRef<number>(0); // saves window scroll before background refresh
  const productsRef = useRef<any[]>([]); // mirrors products state — avoids search re-trigger on every poll

  useEffect(() => {
    fetchCategories();
    let initialized = false;
    let uid = "";
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!initialized && session?.user) {
        initialized = true; uid = session.user.id;
        loadShopStatus(uid); fetchProducts(uid);
      }
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!initialized && session?.user) {
        initialized = true; uid = session.user.id;
        loadShopStatus(uid); fetchProducts(uid);
      }
    });
    // Realtime — refresh inventory and shop status on any change
    const rt = supabase.channel("shop-dash-rt")
      .on("postgres_changes", { event: "*", schema: "public", table: "shop_products" }, () => {
        if (uid) fetchProducts(uid, true); // silent — don't jump scroll
      })
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "profiles" }, () => {
        if (uid) loadShopStatus(uid);
      })
      .subscribe();
    // Poll every 10s — silent so scroll position is preserved
    const poll = setInterval(() => { if (uid) fetchProducts(uid, true); }, 10000);
    return () => { subscription.unsubscribe(); supabase.removeChannel(rt); clearInterval(poll); };
  }, []);

  async function sendShopNotification(shopId: string, title: string, body: string, type: string) {
    try {
      await supabase.from("notifications").insert({
        user_id: shopId, title, body, type, read: false, created_at: new Date().toISOString()
      });
    } catch {}
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  async function saveDeliveryRange(km: number) {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return;
    await supabase.from("profiles").update({ delivery_range_km: km }).eq("id", session.user.id);
  }

  async function saveUpi() {
    setSavingUpi(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) { setSavingUpi(false); return; }
    const { error } = await supabase.from("profiles").update({ upi_id: upiId }).eq("id", session.user.id);
    setSavingUpi(false);
    if (error) { alert("Failed to save: " + error.message); } else { alert("UPI ID saved! ✓"); }
  }

  async function loadShopStatus(userId?: string) {
    let uid = userId;
    if (!uid) {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;
      uid = session.user.id;
    }
    const { data, error } = await supabase
      .from("profiles")
      .select("is_live, offers_delivery, offers_pickup, shopfront_verified, shopfront_image, upi_id, shop_name, name, auto_offlined_until, delivery_range_km")
      .eq("id", uid)
      .single();
    if (error) { console.log("loadShopStatus error:", error.message); return; }
    if (data) {
      // Check if auto-offline period has expired — if so, clear it
      if (data.auto_offlined_until) {
        const until = new Date(data.auto_offlined_until);
        if (until <= new Date()) {
          // Period over — clear the field so shop can go live again
          await supabase.from("profiles").update({ auto_offlined_until: null }).eq("id", uid);
          data.auto_offlined_until = null;
        }
      }
      setIsLive(data.is_live === true);
      const rng = data.delivery_range_km || 2;
      setDeliveryRange(rng);
      setPendingRange(rng);
      setAutoOfflinedUntil(data.auto_offlined_until ? new Date(data.auto_offlined_until) : null);
      setOffersDelivery(data.offers_delivery === true);
      setOffersPickup(data.offers_pickup === true || data.offers_pickup === null);
      setShopfrontVerified(data.shopfront_verified === true);
      setShopfrontImage(data.shopfront_image ?? "");
      setUpiId(data.upi_id ?? "");
      setShopName(data.shop_name || "My Store");
      setOwnerName(data.name || "");
      setProfileComplete(!!(data.upi_id && data.shopfront_image));
    }
  }

  async function toggleLive(val: boolean) {
    setTogglingLive(true);
    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;
    if (!user) { setTogglingLive(false); return; }

    if (val) {
      const { data: fresh } = await supabase
        .from("profiles")
        .select("shopfront_verified, auto_offlined_until")
        .eq("id", user.id)
        .single();

      // Block if auto-offlined due to too many cancellations today
      if (fresh?.auto_offlined_until && new Date(fresh.auto_offlined_until) > new Date()) {
        const until = new Date(fresh.auto_offlined_until);
        const timeLeft = `${until.getHours().toString().padStart(2,"0")}:${until.getMinutes().toString().padStart(2,"0")}`;
        alert(`⚠️ Your shop is suspended until midnight (${timeLeft}) because you cancelled 2 or more orders today.\n\nYou can go live again after midnight.`);
        setTogglingLive(false);
        return;
      }

      // Block if shopfront not approved
      if (fresh?.shopfront_verified !== true) {
        alert("Your shopfront photo is still under review. You can go live once an admin approves it.");
        setShopfrontVerified(false);
        setTogglingLive(false);
        return;
      }
      setShopfrontVerified(true);
    }

    const { error } = await supabase.from("profiles").update({ is_live: val }).eq("id", user.id);
    if (error) { alert("Failed to update live status: " + error.message); setTogglingLive(false); return; }
    const { data: check } = await supabase.from("profiles").select("is_live").eq("id", user.id).single();
    const confirmed = check?.is_live === true;
    setIsLive(confirmed);
    if (val && !confirmed) alert("Could not save live status — check your Supabase RLS policies for the profiles table.");
    setTogglingLive(false);
  }

  async function toggleDelivery(val: boolean) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { error } = await supabase.from("profiles").update({ offers_delivery: val }).eq("id", user.id);
    if (!error) setOffersDelivery(val);
  }

  async function togglePickup(val: boolean) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { error } = await supabase.from("profiles").update({ offers_pickup: val }).eq("id", user.id);
    if (!error) setOffersPickup(val);
  }

  async function fetchCategories() {
    const { data } = await supabase.from("categories").select("name").order("sort_order", { ascending: true });
    if (data) setCategories(data);
  }

  // When a product is selected, check if it already has an image
  useEffect(() => {
    if (selectedProductId) {
      checkExistingImage(selectedProductId);
    } else {
      setExistingImgUrl("");
      setImgFile(null);
      setImgPreview("");
    }
  }, [selectedProductId]);

  // Search master_products when inventory search is active
  // Uses productsRef so polling never re-triggers the Supabase fetch or shows a spinner
  useEffect(() => {
    const q = searchQuery.trim();
    if (!q) { setMasterSearchResults([]); setMasterSearchLoading(false); return; }
    // Only show spinner on a fresh search (no results yet), not on background inventory syncs
    if (masterSearchResults.length === 0) setMasterSearchLoading(true);
    const timer = setTimeout(async () => {
      const { data } = await supabase
        .from("master_products")
        .select("id, name, size, image_url, category, brand")
        .ilike("name", `%${q}%`)
        .limit(60);
      const inventoryIds = new Set(productsRef.current.map((p: any) => p.product_id));
      const newResults = (data || []).map((mp: any) => ({
        ...mp,
        inInventory: inventoryIds.has(mp.id),
        inventoryProduct: productsRef.current.find((p: any) => p.product_id === mp.id) || null,
      }));
      const savedScroll = window.scrollY;
      setMasterSearchResults(newResults);
      setMasterSearchLoading(false);
      requestAnimationFrame(() => { if (savedScroll > 0) window.scrollTo({ top: savedScroll, behavior: "instant" as ScrollBehavior }); });
    }, 300);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]); // products intentionally excluded — productsRef used instead

  // When inventory updates in the background, remap inInventory flags without re-fetching
  useEffect(() => {
    if (!searchQuery.trim() || masterSearchResults.length === 0) return;
    const inventoryIds = new Set(products.map((p: any) => p.product_id));
    setMasterSearchResults(prev => prev.map(mp => ({
      ...mp,
      inInventory: inventoryIds.has(mp.id),
      inventoryProduct: products.find((p: any) => p.product_id === mp.id) || null,
    })));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products]);

  async function checkExistingImage(productId: string) {
    const { data } = await supabase
      .from("master_products")
      .select("image_url")
      .eq("id", productId)
      .single();
    if (data?.image_url) {
      setExistingImgUrl(data.image_url);
      setImgPreview(data.image_url);
    } else {
      setExistingImgUrl("");
      setImgPreview("");
    }
  }

  async function searchByBarcode(barcode: string) {
    setScanStatus("searching");
    setExistingShopProduct(null);

    const { data: { user } } = await supabase.auth.getUser();

    // 1. Check master_products
    const { data } = await supabase
      .from("master_products")
      .select("*")
      .eq("barcode", barcode)
      .single();

    if (data?.name) {
      setName(data.name);
      setSize(data.size ?? "");
      setSelectedProductId(data.id);

      // Check if shopkeeper already has this in their inventory
      if (user) {
        const { data: sp } = await supabase
          .from("shop_products")
          .select("id, stock, price, name, size")
          .eq("shop_id", user.id)
          .eq("product_id", data.id)
          .single();
        if (sp) {
          setExistingShopProduct(sp);
          setPrice(String(sp.price ?? ""));
          setStock(String(sp.stock ?? ""));
          setScanStatus("found");
          setTimeout(() => setScanStatus("idle"), 4000);
          return;
        }
      }

      setScanStatus("found");
      setTimeout(() => setScanStatus("idle"), 4000);
      return;
    }

    // 2. Fallback: Open Food Facts
    try {
      const res = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
      const json = await res.json();
      const productName = json?.product?.product_name_en || json?.product?.product_name || "";
      const productQuantity = json?.product?.quantity || "";
      if (productName) {
        setName(productName);
        if (productQuantity) setSize(productQuantity);
        setSelectedProductId(null);
        setScanStatus("found");
        setTimeout(() => setScanStatus("idle"), 4000);
        return;
      }
    } catch (e) {}

    setIsNewProduct(true);
    setScanStatus("notfound");
    setTimeout(() => setScanStatus("idle"), 5000);
  }

  async function fetchSuggestions(query: string) {
    if (query.trim().length < 2) { setSuggestions([]); setShowSuggestions(false); return; }
    setShowSuggestions(true);
    const { data } = await supabase
      .from("master_products")
      .select("id, name, brand, size, image_url")
      .ilike("name", `%${query}%`)
      .limit(6);
    setSuggestions(data || []);
  }

  function handleNameChange(val: string) {
    setName(val);
    setSelectedProductId(null);
    setIsNewProduct(false);
    setCategory("");
    clearTimeout(suggestionDebounce.current);
    suggestionDebounce.current = setTimeout(async () => {
      await fetchSuggestions(val);
      // After suggestions load, check if val matches nothing → likely new product
    }, 250);
  }

  function selectSuggestion(item: any) {
    setName(item.name ?? "");
    setSize(item.size ?? "");
    setSelectedProductId(item.id ?? null);
    setIsNewProduct(false);
    setCategory("");
    setSuggestions([]);
    setShowSuggestions(false);
  }

  function handleImgSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImgFile(file);
    const reader = new FileReader();
    reader.onload = () => setImgPreview(reader.result as string);
    reader.readAsDataURL(file);
  }

  async function uploadImage(file: File, productId: string): Promise<string> {
    // Use jpg extension always for consistency
    const path = `products/${productId}.jpg`;
    const { error } = await supabase.storage
      .from("product-images")
      .upload(path, file, { upsert: true, contentType: file.type || "image/jpeg" });
    if (error) throw new Error("Storage upload failed: " + error.message);
    const { data } = supabase.storage.from("product-images").getPublicUrl(path);
    // Add cache-buster so browser fetches fresh image
    return data.publicUrl + "?t=" + Date.now();
  }

  // Shop location is pinned during signup and never auto-updated

  async function fetchProducts(userId?: string, silent = false) {
    let uid = userId;
    if (!uid) {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      uid = user.id;
    }
    const user = { id: uid };
    const { data: spData } = await supabase
      .from("shop_products")
      .select("id, price, stock, product_id, name, size")
      .eq("shop_id", user.id);
    if (!spData || spData.length === 0) { setProducts([]); return; }
    const productIds = spData.map((r: any) => r.product_id).filter(Boolean);
    const { data: mpData } = await supabase
      .from("master_products")
      .select("id, image_url")
      .in("id", productIds);
    const mpMap: any = {};
    (mpData || []).forEach((mp: any) => { mpMap[mp.id] = mp; });
    // Save scroll before update, restore after on silent refreshes
    if (silent) scrollSaveRef.current = window.scrollY;
    const newProducts = spData.map((r: any) => ({
      ...r,
      image_url: mpMap[r.product_id]?.image_url ?? "",
    }));
    productsRef.current = newProducts;
    setProducts(newProducts);
    if (silent && scrollSaveRef.current > 0) {
      requestAnimationFrame(() => { window.scrollTo({ top: scrollSaveRef.current, behavior: "instant" as ScrollBehavior }); });
    }
  }

  async function updateStockInline(productId: string, newStock: number) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase
      .from("shop_products")
      .update({ stock: newStock })
      .eq("id", productId)
      .eq("shop_id", user.id);
    setProducts((prev) => prev.map((p) => p.id === productId ? { ...p, stock: newStock } : p));
    setSavedStockMap((prev) => ({ ...prev, [productId]: true }));
    setTimeout(() => setSavedStockMap((prev) => ({ ...prev, [productId]: false })), 2000);
  }

  async function deleteProduct(id: string) {
    if (!confirm("Remove this product from your inventory?")) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("shop_products").delete().eq("id", id).eq("shop_id", user.id);
    fetchProducts();
  }

  async function addProduct(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { alert("Please login"); setLoading(false); return; }

    let productId = selectedProductId;
    let productName = name.trim();
    let productSize = size.trim();
    const barcodeToSave = scannedBarcode || manualBarcode.trim() || null;

    if (!productId) {
      // Try match by name
      const { data: masterData } = await supabase
        .from("master_products")
        .select("id, name, size")
        .ilike("name", "%" + productName + "%")
        .limit(1)
        .maybeSingle();

      if (masterData) {
        productId = masterData.id;
        productName = masterData.name ?? productName;
        productSize = masterData.size ?? productSize;
      } else {
        // Insert new into master_products
        const { data: newMaster, error: insertError } = await supabase
          .from("master_products")
          .insert({ name: productName, size: productSize, barcode: barcodeToSave, category: category || null })
          .select("id")
          .single();
        if (insertError || !newMaster) {
          alert("Could not save product to catalog: " + (insertError?.message ?? "unknown error"));
          setLoading(false);
          return;
        }
        productId = newMaster.id;
      }
    } else if (barcodeToSave) {
      // Update barcode on existing product if not set
      await supabase
        .from("master_products")
        .update({ barcode: barcodeToSave })
        .eq("id", productId)
        .is("barcode", null);
    }

    // Upload image if new file selected and no existing image
    if (imgFile && productId && !existingImgUrl) {
      try {
        setUploadingImg(true);
        const publicUrl = await uploadImage(imgFile, productId);
        const { error: imgUpdateError } = await supabase
          .from("master_products")
          .update({ image_url: publicUrl })
          .eq("id", productId);
        if (imgUpdateError) {
          alert("Image saved to storage but could not update product record: " + imgUpdateError.message);
        }
        setUploadingImg(false);
      } catch (err: any) {
        setUploadingImg(false);
        alert("Image upload failed: " + err.message + "\n\nMake sure the 'product-images' storage bucket exists and is public in Supabase.");
      }
    }

    const { error } = await supabase.from("shop_products").upsert({
      shop_id: user.id,
      product_id: productId,
      price: Number(price),
      stock: Number(stock),
      name: productName,
      size: productSize,
    }, { onConflict: "shop_id,product_id" });

    if (error) { alert(error.message); setLoading(false); return; }

    setName(""); setPrice(""); setStock(""); setSize("");
    setScannedBarcode(""); setManualBarcode(""); setSelectedProductId(null);
    setImgFile(null); setImgPreview(""); setExistingImgUrl(""); setExistingShopProduct(null);
    setCategory(""); setIsNewProduct(false);
    setLoading(false); setAddSuccess(true);
    setTimeout(() => setAddSuccess(false), 3000);
    fetchProducts();
  }

  async function quickAddProduct(mp: any) {
    if (!quickAddPrice || !quickAddStock) { alert("Enter price and stock"); return; }
    setQuickAddLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { alert("Please login"); setQuickAddLoading(false); return; }
    const { error } = await supabase.from("shop_products").upsert({
      shop_id: user.id,
      product_id: mp.id,
      price: Number(quickAddPrice),
      stock: Number(quickAddStock),
      name: mp.name,
      size: mp.size || "",
    }, { onConflict: "shop_id,product_id" });
    if (error) { alert(error.message); setQuickAddLoading(false); return; }
    setQuickAddId(null);
    setQuickAddPrice("");
    setQuickAddStock("");
    setQuickAddLoading(false);
    fetchProducts();
  }

  const filtered = products.filter((p) => (p.name ?? "").toLowerCase().includes(searchQuery.toLowerCase()));
  const totalStock = products.reduce((s, p) => s + (p.stock ?? 0), 0);
  const lowStock = products.filter((p) => (p.stock ?? 0) < 5).length;
  const activeBarcode = scannedBarcode || manualBarcode.trim();

  return (
    <div className="page">
      <style>{CSS}</style>

      <div className="top-bar">
        <div className="top-row">
          <div style={{display:"flex",flexDirection:"column",gap:2,cursor:"pointer"}} onClick={() => setShowProfile(true)}>
            <div className="brand">🫧 {shopName}</div>
            {profileComplete
              ? <div className="complete-badge">✓ Profile complete</div>
              : <div className="incomplete-badge">⚠️ Complete your profile</div>
            }
          </div>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            <button style={{background:"rgba(255,255,255,0.18)",border:"1.5px solid rgba(255,255,255,0.28)",color:"white",padding:"7px 12px",borderRadius:10,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"'Plus Jakarta Sans',sans-serif"}} onClick={() => setShowProfile(true)}>👤 Profile</button>
            <a href="/shop-orders" className="orders-link">📋 Orders</a>
          </div>
        </div>
        <div className="stats-row" style={{marginBottom:12}}>
          <div className="stat-chip">
            <div className="stat-val">{products.length}</div>
            <div className="stat-lbl">Products</div>
          </div>
          <div className="stat-chip">
            <div className="stat-val">{totalStock}</div>
            <div className="stat-lbl">Total Stock</div>
          </div>
          <div className="stat-chip">
            <div className="stat-val" style={{ color: lowStock > 0 ? "#FFB800" : "white" }}>{lowStock}</div>
            <div className="stat-lbl">Low Stock</div>
          </div>
        </div>

        {/* Live bar */}
        <div className="live-bar">
          {/* Auto-offline suspension banner */}
          {autoOfflinedUntil && autoOfflinedUntil > new Date() && (
            <div style={{background:"#FFF0F0",border:"1.5px solid #FFCDD2",borderRadius:10,padding:"10px 14px",marginBottom:10,display:"flex",alignItems:"center",gap:10}}>
              <div style={{fontSize:20}}>🚫</div>
              <div>
                <div style={{fontSize:13,fontWeight:800,color:"#E53E3E"}}>Shop suspended until midnight</div>
                <div style={{fontSize:11,color:"#8A96B5",fontWeight:500,marginTop:2}}>
                  You cancelled 2+ orders today. You can go live again after midnight.
                </div>
              </div>
            </div>
          )}
          <div className="live-toggle-row">
            <div className="live-toggle-label">
              <div className={`live-dot ${isLive ? "on" : ""}`} />
              <div>
                <div className="live-label-text">{isLive ? "🟢 Shop is Live" : "⚫ Shop is Offline"}</div>
                <div className="live-label-sub">{isLive ? "Customers can see your products" : "Tap to go live and start receiving orders"}</div>
              </div>
            </div>
            <label className="toggle-switch" onClick={() => !togglingLive && toggleLive(!isLive)}>
              <div className={`toggle-track ${isLive ? "on" : ""}`}>
                <div className={`toggle-thumb ${isLive ? "on" : ""}`} />
              </div>
            </label>
          </div>
          <div className="delivery-row">
            <button
              className={`delivery-chip ${offersPickup ? "on" : ""}`}
              onClick={() => togglePickup(!offersPickup)}
              disabled={!isLive}
            >
              🏪 {offersPickup ? "Pickup: ON" : "Pickup: OFF"}
            </button>
            <button
              className={`delivery-chip ${offersDelivery ? "on" : ""}`}
              onClick={() => toggleDelivery(!offersDelivery)}
              disabled={!isLive}
            >
              🛵 {offersDelivery ? "Delivery: ON" : "Delivery: OFF"}
            </button>
          </div>
        </div>
      </div>

      {/* Shopfront verification banner — only show if image uploaded but pending review */}
      {!shopfrontVerified && shopfrontImage && (
        <div className="shopfront-banner">
          <div className="shopfront-banner-icon">⏳</div>
          <div className="shopfront-banner-text">
            <div className="shopfront-banner-title">Shopfront under review</div>
            <div className="shopfront-banner-sub">Admin will approve soon. You can't go live yet.</div>
          </div>
        </div>
      )}

      <div className="tab-bar">
        <button className={`tab ${activeTab === "add" ? "active" : ""}`} onClick={() => setActiveTab("add")}>➕ Add Product</button>
        <button className={`tab ${activeTab === "inventory" ? "active" : ""}`} onClick={() => setActiveTab("inventory")}>📦 Inventory ({products.length})</button>
      </div>

      <div className="content">
        {activeTab === "add" && (
          <div className="card">
            <div className="card-hdr">
              <div className="card-hdr-icon">➕</div>
              <div>
                <div className="card-hdr-title">Add New Product</div>
                <div className="card-hdr-sub">Scan barcode or fill manually</div>
              </div>
            </div>
            <div className="card-body">

              {/* Barcode Scanner */}
              <div className="scanner-zone">
                <button
                  type="button"
                  className="scan-btn"
                  style={{ background: scannerOpen ? "#F03D3D" : "#1A6BFF" }}
                  onClick={() => setScannerOpen((p) => !p)}
                >
                  {scannerOpen ? "⏹ Stop Scanner" : "📷 Scan Barcode"}
                </button>
                {!scannerOpen && <div className="scan-hint">Point camera at barcode to auto-fill</div>}
                {scannerOpen && (
                  <div className="scanner-wrap">
                    <BarcodeScanner onScan={(code: string) => {
                      setScannedBarcode(code);
                      setManualBarcode("");
                      searchByBarcode(code);
                      setScannerOpen(false);
                    }} />
                  </div>
                )}
                {scannedBarcode && !scannerOpen && (
                  <div className="scanned-badge">
                    <span>✅</span>
                    <div>
                      <div className="scanned-text">Barcode scanned!</div>
                      <div className="scanned-code">{scannedBarcode}</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Manual Barcode Entry */}
              {!scannedBarcode && (
                <div className="field">
                  <label className="field-label">📦 Barcode (if can't scan)</label>
                  <input
                    className={`field-input${manualBarcode ? " has-val" : ""}`}
                    placeholder="Type barcode number manually..."
                    value={manualBarcode}
                    onChange={(e) => {
                      setManualBarcode(e.target.value);
                      if (e.target.value.length >= 8) {
                        searchByBarcode(e.target.value);
                      }
                    }}
                  />
                </div>
              )}
              {scannedBarcode && (
                <div style={{marginBottom:14}}>
                  <button
                    type="button"
                    style={{fontSize:11,color:"#8A96B5",fontWeight:700,background:"none",border:"none",cursor:"pointer",padding:0,fontFamily:"inherit"}}
                    onClick={() => { setScannedBarcode(""); setName(""); setSize(""); setSelectedProductId(null); }}
                  >✕ Clear scan & start over</button>
                </div>
              )}

              {/* Status toasts */}
              {scanStatus === "searching" && <div className="toast toast-info">🔍 Looking up product...</div>}
              {scanStatus === "found" && !existingShopProduct && <div className="toast toast-success">🎉 Product found automatically!</div>}
              {scanStatus === "notfound" && <div className="toast toast-warn">⚠️ Not found — please type the name below</div>}

              {/* Existing stock banner */}
              {existingShopProduct && (
                <div className="existing-stock-banner">
                  <div className="existing-stock-banner-icon">📦</div>
                  <div className="existing-stock-banner-text">
                    <div className="existing-stock-banner-title">You already have this product!</div>
                    <div className="existing-stock-banner-sub">Current stock: {existingShopProduct.stock} · Price: ₹{existingShopProduct.price}</div>
                  </div>
                  <button
                    type="button"
                    className="existing-stock-banner-btn"
                    onClick={() => { setActiveTab("inventory"); setSearchQuery(existingShopProduct.name ?? ""); setExistingShopProduct(null); }}
                  >
                    Edit Stock
                  </button>
                </div>
              )}

              <form onSubmit={addProduct}>

                {/* Active barcode indicator */}
                {activeBarcode && (
                  <div style={{marginBottom:12}}>
                    <span className="barcode-tag">📦 {activeBarcode}</span>
                  </div>
                )}

                {/* Product Name with autocomplete */}
                <div className="field autocomplete-wrap">
                  <label className="field-label">Product Name</label>
                  <input
                    className={`field-input${name ? " has-val" : ""}`}
                    placeholder="e.g. Amul Butter"
                    value={name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                    required
                  />
                  {showSuggestions && suggestions.length > 0 && (
                    <div className="suggestions-dropdown">
                      {suggestions.map((s) => (
                        <div key={s.id} className="suggestion-item" onMouseDown={() => selectSuggestion(s)}>
                          <div>
                            <div className="suggestion-name">{s.name}</div>
                            <div className="suggestion-meta">{[s.brand, s.size].filter(Boolean).join(" · ")}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Size */}
                <div className="field">
                  <label className="field-label">Size / Unit</label>
                  <input
                    className={`field-input${size ? " has-val" : ""}`}
                    placeholder="e.g. 500g, 1L, 200ml"
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                  />
                </div>

                {/* Category picker — only for new products */}
                {!selectedProductId && name.trim().length > 1 && (() => {
                  const catIcons: Record<string,string> = {
  "Dairy, Bread & Eggs":"🥛","Fruits & Vegetables":"🥦","Snacks & Munchies":"🍿",
  "Breakfast & Instant Food":"🥣","Sweet Tooth":"🍫","Bakery & Biscuits":"🍪",
  "Tea, Coffee & Milk Drinks":"☕","Atta, Rice & Dal":"🌾","Masala, Oil & More":"🫙",
  "Sauces & Spreads":"🥫","Cold Drinks & Juices":"🥤","Chicken, Meat & Fish":"🍗",
  "Baby Care":"🍼","Pharma & Wellness":"💊","Cleaning Essentials":"🧹",
  "Home & Office":"🏠","Personal Care":"🪥","Pet Care":"🐾",
  "Paan Corner":"🌿","Organic & Healthy Living":"🥗"
};
                  const catList = categories.length > 0
                    ? categories.map((c:any) => c.name)
                    : Object.keys(catIcons);
                  return (
                    <div className="field">
                      <label className="field-label">Category <span style={{color:"#F03D3D"}}>*</span></label>
                      <div className="new-product-notice">
                        🆕 New product — please select a category
                      </div>
                      <div className="cat-grid">
                        {catList.map((cat: string) => (
                          <button
                            key={cat}
                            type="button"
                            className={`cat-option ${category === cat ? "selected" : ""}`}
                            onClick={() => setCategory(cat)}
                          >
                            <span className="cat-option-icon">{catIcons[cat] ?? "🛍️"}</span>
                            <span className="cat-option-name">{cat}</span>
                          </button>
                        ))}
                      </div>
                      {category && (
                        <div style={{marginTop:8,fontSize:12,fontWeight:700,color:"#00875A"}}>
                          ✅ Selected: {category}
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* Product Image Upload */}
                <div className="field">
                  <label className="field-label">Product Photo</label>
                  <div
                    className={`img-upload-zone ${imgPreview ? "has-img" : ""} ${existingImgUrl ? "locked" : ""}`}
                    onClick={() => { if (!existingImgUrl) imgInputRef.current?.click(); }}
                  >
                    {imgPreview ? (
                      <>
                        <img src={imgPreview} alt="Product" className="img-preview" />
                        {existingImgUrl && (
                          <div className="img-exists-badge">
                            ✅ Photo already saved — visible to all shopkeepers
                          </div>
                        )}
                        {!existingImgUrl && imgFile && (
                          <div className="img-exists-badge" style={{background:"#EBF1FF", color:"#1A6BFF"}}>
                            📷 New photo selected — tap to change
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="img-upload-placeholder">
                        <div className="img-upload-icon">📷</div>
                        <div className="img-upload-text">Tap to add product photo</div>
                        <div className="img-upload-sub">Will be saved for all shopkeepers</div>
                      </div>
                    )}
                  </div>
                  <input
                    ref={imgInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    style={{ display: "none" }}
                    onChange={handleImgSelect}
                  />
                </div>

                {/* Price + Stock */}
                <div className="fields-row">
                  <div className="field">
                    <label className="field-label">Price (₹)</label>
                    <div className="prefix-wrap">
                      <span className="prefix">₹</span>
                      <input className={`field-input prefixed${price ? " has-val" : ""}`} placeholder="0.00" type="number" min="0" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} required />
                    </div>
                  </div>
                  <div className="field">
                    <label className="field-label">Stock Qty</label>
                    <input className={`field-input${stock ? " has-val" : ""}`} placeholder="0" type="number" min="0" value={stock} onChange={(e) => setStock(e.target.value)} required />
                  </div>
                </div>

                <button type="submit" className={`submit-btn${addSuccess ? " success" : ""}`} disabled={loading || uploadingImg}>
                  {uploadingImg ? "📷 Uploading photo..." : loading ? "Adding..." : addSuccess ? "✓ Added!" : "Add to Inventory"}
                </button>
              </form>
            </div>
          </div>
        )}

        {activeTab === "inventory" && (
          <>
            <div className="search-bar">
              <span>🔍</span>
              <input placeholder="Search all products..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              {searchQuery && <span style={{cursor:"pointer",color:"#B0BACC",fontSize:16,flexShrink:0}} onClick={() => setSearchQuery("")}>✕</span>}
            </div>

            {!searchQuery.trim() ? (
              /* No search — show own inventory */
              filtered.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📦</div>
                  <div className="empty-title">No products yet</div>
                  <div className="empty-sub">Add your first product above</div>
                </div>
              ) : (
                filtered.map((p) => {
                  const editVal = editStockMap[p.id] ?? String(p.stock ?? 0);
                  const delta = Number(editVal) - (p.stock ?? 0);
                  return (
                    <div key={p.id} className="prod-card" style={{flexDirection:"column",alignItems:"stretch",gap:10}}>
                      <div style={{display:"flex",alignItems:"center",gap:12}}>
                        <div className="prod-icon">
                          {p.image_url
                            ? <img src={p.image_url} alt={p.name} />
                            : (p.stock ?? 0) < 5 ? "⚠️" : "🛍️"}
                        </div>
                        <div className="prod-info">
                          <div className="prod-name">{p.name ?? "Unnamed"}</div>
                          {p.size && <div style={{fontSize:"11px",color:"#8A96B5",fontWeight:600,marginBottom:3}}>{p.size}</div>}
                          <div className="prod-meta">
                            <span className="prod-price">₹{p.price}</span>
                            <span className={`stock-badge ${(p.stock ?? 0) < 5 ? "stock-low" : "stock-ok"}`}>{p.stock ?? 0} in stock</span>
                          </div>
                        </div>
                        <button className="del-btn" onClick={() => deleteProduct(p.id)}>🗑️</button>
                      </div>
                      <div>
                        <div style={{fontSize:"10px",fontWeight:800,color:"#8A96B5",textTransform:"uppercase",letterSpacing:"0.5px",marginBottom:6}}>Update Stock</div>
                        <div className="stock-ctrl-row">
                          <button type="button" className="stock-ctrl-btn minus" onClick={() => { const cur = Number(editStockMap[p.id] ?? p.stock ?? 0); if (cur > 0) setEditStockMap((prev) => ({...prev, [p.id]: String(cur - 1)})); }}>−</button>
                          <input className="stock-ctrl-input" type="number" min="0" value={editVal} onChange={(e) => setEditStockMap((prev) => ({...prev, [p.id]: e.target.value}))} />
                          <button type="button" className="stock-ctrl-btn plus" onClick={() => { const cur = Number(editStockMap[p.id] ?? p.stock ?? 0); setEditStockMap((prev) => ({...prev, [p.id]: String(cur + 1)})); }}>+</button>
                          <button type="button" className={`stock-save-btn ${savedStockMap[p.id] ? "saved" : ""}`} onClick={() => updateStockInline(p.id, Number(editVal))}>{savedStockMap[p.id] ? "✓ Saved" : "Save"}</button>
                        </div>
                        {editStockMap[p.id] !== undefined && delta !== 0 && (
                          <div className="stock-delta-hint" style={{color: delta > 0 ? "#00875A" : "#F03D3D"}}>
                            {delta > 0 ? `+${delta} will be added` : `${delta} will be removed`}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )
            ) : (
              /* Search active — show master_products catalog results */
              masterSearchLoading ? (
                <div style={{textAlign:"center",padding:"40px 0",color:"#8A96B5",fontWeight:600}}>🔍 Searching catalog...</div>
              ) : masterSearchResults.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">🔍</div>
                  <div className="empty-title">No products found</div>
                  <div className="empty-sub">"{searchQuery}" is not in the catalog yet</div>
                </div>
              ) : (
                <>
                  {/* In inventory section */}
                  {masterSearchResults.some(p => p.inInventory) && (
                    <>
                      <div style={{padding:"10px 14px 4px",fontSize:11,fontWeight:800,color:"#00875A",textTransform:"uppercase",letterSpacing:"0.5px"}}>
                        ✅ In Your Inventory ({masterSearchResults.filter(p=>p.inInventory).length})
                      </div>
                      {masterSearchResults.filter(p => p.inInventory).map((mp) => {
                        const p = mp.inventoryProduct;
                        if (!p) return null;
                        const editVal = editStockMap[p.id] ?? String(p.stock ?? 0);
                        const delta = Number(editVal) - (p.stock ?? 0);
                        return (
                          <div key={p.id} className="prod-card" style={{flexDirection:"column",alignItems:"stretch",gap:10,borderLeft:"3px solid #00875A"}}>
                            <div style={{display:"flex",alignItems:"center",gap:12}}>
                              <div className="prod-icon">
                                {mp.image_url ? <img src={mp.image_url} alt={mp.name} /> : (p.stock ?? 0) < 5 ? "⚠️" : "🛍️"}
                              </div>
                              <div className="prod-info">
                                <div className="prod-name">{p.name ?? mp.name}</div>
                                {mp.size && <div style={{fontSize:"11px",color:"#8A96B5",fontWeight:600,marginBottom:3}}>{mp.size}</div>}
                                <div className="prod-meta">
                                  <span className="prod-price">₹{p.price}</span>
                                  <span className={`stock-badge ${(p.stock ?? 0) < 5 ? "stock-low" : "stock-ok"}`}>{p.stock ?? 0} in stock</span>
                                </div>
                              </div>
                              <button className="del-btn" onClick={() => deleteProduct(p.id)}>🗑️</button>
                            </div>
                            <div>
                              <div style={{fontSize:"10px",fontWeight:800,color:"#8A96B5",textTransform:"uppercase",letterSpacing:"0.5px",marginBottom:6}}>Update Stock</div>
                              <div className="stock-ctrl-row">
                                <button type="button" className="stock-ctrl-btn minus" onClick={() => { const cur = Number(editStockMap[p.id] ?? p.stock ?? 0); if (cur > 0) setEditStockMap((prev) => ({...prev, [p.id]: String(cur - 1)})); }}>−</button>
                                <input className="stock-ctrl-input" type="number" min="0" value={editVal} onChange={(e) => setEditStockMap((prev) => ({...prev, [p.id]: e.target.value}))} />
                                <button type="button" className="stock-ctrl-btn plus" onClick={() => { const cur = Number(editStockMap[p.id] ?? p.stock ?? 0); setEditStockMap((prev) => ({...prev, [p.id]: String(cur + 1)})); }}>+</button>
                                <button type="button" className={`stock-save-btn ${savedStockMap[p.id] ? "saved" : ""}`} onClick={() => updateStockInline(p.id, Number(editVal))}>{savedStockMap[p.id] ? "✓ Saved" : "Save"}</button>
                              </div>
                              {editStockMap[p.id] !== undefined && delta !== 0 && (
                                <div className="stock-delta-hint" style={{color: delta > 0 ? "#00875A" : "#F03D3D"}}>
                                  {delta > 0 ? `+${delta} will be added` : `${delta} will be removed`}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </>
                  )}
                  {/* Not in inventory section */}
                  {masterSearchResults.some(p => !p.inInventory) && (
                    <>
                      <div style={{padding:"10px 14px 4px",fontSize:11,fontWeight:800,color:"#8A96B5",textTransform:"uppercase",letterSpacing:"0.5px"}}>
                        📦 Catalog — Not in Your Shop ({masterSearchResults.filter(p=>!p.inInventory).length})
                      </div>
                      {masterSearchResults.filter(p => !p.inInventory).map((mp) => (
                        <div key={mp.id} className="prod-card" style={{flexDirection:"column",gap:10}}>
                          {/* Product info row */}
                          <div style={{display:"flex",alignItems:"center",gap:12}}>
                            <div className="prod-icon">
                              {mp.image_url ? <img src={mp.image_url} alt={mp.name} /> : "🛍️"}
                            </div>
                            <div className="prod-info" style={{flex:1}}>
                              <div className="prod-name">{mp.name}</div>
                              {mp.size && <div style={{fontSize:"11px",color:"#8A96B5",fontWeight:600,marginBottom:2}}>{mp.size}</div>}
                              {mp.brand && <div style={{fontSize:"11px",color:"#B0BACC",fontWeight:500}}>{mp.brand}</div>}
                              <div style={{fontSize:"11px",color:"#8A96B5",marginTop:1}}>{mp.category}</div>
                            </div>
                            {quickAddId !== mp.id && (
                              <button
                                style={{padding:"8px 14px",background:"#1A6BFF",color:"white",border:"none",borderRadius:8,fontSize:12,fontWeight:800,cursor:"pointer",fontFamily:"inherit",flexShrink:0}}
                                onClick={() => { setQuickAddId(mp.id); setQuickAddPrice(""); setQuickAddStock(""); }}
                              >+ Add</button>
                            )}
                          </div>
                          {/* Inline quick-add form — expands when + Add is clicked */}
                          {quickAddId === mp.id && (
                            <div style={{background:"#F4F6FB",borderRadius:10,padding:"12px 14px",display:"flex",flexDirection:"column",gap:10}}>
                              <div style={{fontSize:12,fontWeight:800,color:"#0D1B3E",marginBottom:2}}>Set price & stock to add to your inventory</div>
                              <div style={{display:"flex",gap:10}}>
                                <div style={{flex:1}}>
                                  <div style={{fontSize:10,fontWeight:800,color:"#8A96B5",textTransform:"uppercase",letterSpacing:"0.5px",marginBottom:4}}>Price (₹)</div>
                                  <div style={{display:"flex",alignItems:"center",background:"white",border:"1.5px solid #E4EAFF",borderRadius:8,overflow:"hidden"}}>
                                    <span style={{padding:"0 8px",color:"#8A96B5",fontWeight:700,fontSize:13}}>₹</span>
                                    <input
                                      type="number" min="0" step="0.01" placeholder="0.00"
                                      value={quickAddPrice}
                                      onChange={e => setQuickAddPrice(e.target.value)}
                                      style={{flex:1,border:"none",outline:"none",padding:"10px 8px 10px 0",fontSize:14,fontWeight:700,color:"#0D1B3E",fontFamily:"inherit",background:"transparent"}}
                                      autoFocus
                                    />
                                  </div>
                                </div>
                                <div style={{flex:1}}>
                                  <div style={{fontSize:10,fontWeight:800,color:"#8A96B5",textTransform:"uppercase",letterSpacing:"0.5px",marginBottom:4}}>Stock Qty</div>
                                  <input
                                    type="number" min="0" placeholder="0"
                                    value={quickAddStock}
                                    onChange={e => setQuickAddStock(e.target.value)}
                                    style={{width:"100%",border:"1.5px solid #E4EAFF",borderRadius:8,padding:"10px 12px",fontSize:14,fontWeight:700,color:"#0D1B3E",fontFamily:"inherit",outline:"none",boxSizing:"border-box" as const,background:"white"}}
                                  />
                                </div>
                              </div>
                              <div style={{display:"flex",gap:8}}>
                                <button
                                  style={{flex:1,padding:"11px",background:"#1A6BFF",color:"white",border:"none",borderRadius:8,fontSize:13,fontWeight:800,cursor:"pointer",fontFamily:"inherit",opacity:quickAddLoading?0.6:1}}
                                  onClick={() => quickAddProduct(mp)}
                                  disabled={quickAddLoading}
                                >
                                  {quickAddLoading ? "Saving..." : "✓ Save to Inventory"}
                                </button>
                                <button
                                  style={{padding:"11px 14px",background:"white",border:"1.5px solid #E4EAFF",borderRadius:8,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit",color:"#8A96B5"}}
                                  onClick={() => { setQuickAddId(null); setQuickAddPrice(""); setQuickAddStock(""); }}
                                >Cancel</button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </>
                  )}
                </>
              )
            )}
          </>
        )}
      </div>

      {/* Profile Sheet Modal */}
      {showProfile && (
        <div className="profile-overlay" onClick={e => { if (e.target === e.currentTarget) setShowProfile(false); }}>
          <div className="profile-sheet">
            <div className="profile-handle" />
            <div className="ph">
              <div className="ph-title">👤 Shop Profile</div>
              <div className="ph-sub">{ownerName} · {shopName}</div>
            </div>

            <div className="ps">
              <div className="ps-title">Shop Info</div>
              <div className="pfield"><div className="pfield-lbl">Shop Name</div><div className="pfield-val">{shopName}</div></div>
              <div className="pfield"><div className="pfield-lbl">Owner Name</div><div className="pfield-val">{ownerName}</div></div>
            </div>

            <div className="ps">
              <div className="ps-title">💳 UPI ID</div>
              <div style={{fontSize:12,color:"#8A96B5",marginBottom:12,fontWeight:500}}>Customers pay directly to this UPI ID for all orders</div>
              {upiId && !editingUpi ? (
                <div className="upi-saved-row">
                  <div>
                    <div style={{fontSize:11,color:"#00875A",fontWeight:700,marginBottom:3}}>✓ UPI ID Saved</div>
                    <div className="upi-saved-id">{upiId}</div>
                  </div>
                  <button className="edit-upi-btn" onClick={() => setEditingUpi(true)}>✏️ Edit</button>
                </div>
              ) : (
                <>
                  <input className="pinput" placeholder="yourname@upi or 9876543210@ybl" value={upiId} onChange={e => setUpiId(e.target.value)} />
                  <button className="save-upi-btn" disabled={savingUpi || !upiId.trim()} onClick={async () => { await saveUpi(); setEditingUpi(false); setProfileComplete(!!(upiId && shopfrontImage)); }}>
                    {savingUpi ? "Saving..." : "Save UPI ID"}
                  </button>
                  {editingUpi && <button onClick={() => setEditingUpi(false)} style={{width:"100%",marginTop:8,padding:10,background:"white",border:"1.5px solid #E4EAFF",borderRadius:12,fontSize:13,fontWeight:700,color:"#8A96B5",cursor:"pointer",fontFamily:"'Plus Jakarta Sans',sans-serif"}}>Cancel</button>}
                </>
              )}
            </div>

            <div className="ps">
              <div className="ps-title">🏪 Shopfront Photo</div>
              {shopfrontImage
                ? <>
                    <img src={shopfrontImage} alt="Shopfront" style={{width:"100%",height:160,objectFit:"cover",borderRadius:14,border:"1.5px solid #E4EAFF",display:"block",marginBottom:10}} />
                    <div style={{textAlign:"center",fontSize:13,fontWeight:700,color:shopfrontVerified?"#00875A":"#946200"}}>
                      {shopfrontVerified ? "✓ Verified by admin" : "⏳ Under review by admin"}
                    </div>
                  </>
                : <div style={{background:"#F4F6FB",borderRadius:12,padding:20,textAlign:"center",color:"#8A96B5",fontSize:13,fontWeight:600}}>No shopfront photo uploaded yet.</div>
              }
            </div>

            <div className="ps">
              <div className="ps-title">📋 Legal</div>
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {[["📄 Seller Terms & Conditions","/terms"],["🔒 Privacy Policy","/privacy"],["↩️ Refund Policy","/refund-policy"]].map(([label,href])=>(
                  <a key={href} href={href} target="_blank" style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 14px",background:"#F4F6FB",borderRadius:12,textDecoration:"none",color:"#0D1B3E",fontSize:14,fontWeight:700}}>
                    {label} <span style={{color:"#B0BACC"}}>→</span>
                  </a>
                ))}
              </div>
            </div>

            <div className="ps">
              <button onClick={() => { setShowProfile(false); handleLogout(); }} style={{width:"100%",padding:14,background:"#FFF0F0",color:"#E53E3E",border:"1.5px solid #FFCDD2",borderRadius:14,fontSize:15,fontWeight:800,cursor:"pointer",fontFamily:"'Plus Jakarta Sans',sans-serif"}}>
                🚪 Logout
              </button>
            </div>
          </div>
        </div>
      )}



        {/* Delivery Range Card */}
        {offersDelivery && (
          <div className="card">
            <div className="card-hdr">
              <div className="card-hdr-icon">📍</div>
              <div>
                <div className="card-hdr-title">Delivery Range</div>
                <div className="card-hdr-sub">Set how far you deliver</div>
              </div>
            </div>
            <div style={{padding:"0 16px 16px"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                <span style={{fontSize:13,fontWeight:600,color:"#8A96B5"}}>500m</span>
                <span style={{fontSize:18,fontWeight:900,color:"#1A6BFF"}}>{deliveryRange < 1 ? `${deliveryRange * 1000}m` : `${deliveryRange} km`}</span>
                <span style={{fontSize:13,fontWeight:600,color:"#8A96B5"}}>2 km</span>
              </div>
              {/* Preset buttons */}
              <div style={{display:"flex",justifyContent:"space-between",gap:6,marginBottom:12}}>
                {[0.5,1,1.5,2].map(v => (
                  <button key={v}
                    onClick={() => { setPendingRange(v); setRangeSaved(false); }}
                    style={{flex:1,padding:"10px 4px",borderRadius:10,border:"1.5px solid",fontSize:13,fontWeight:800,cursor:"pointer",fontFamily:"inherit",
                      borderColor: pendingRange===v ? "#1A6BFF" : "#E4EAFF",
                      background: pendingRange===v ? "#EBF1FF" : "white",
                      color: pendingRange===v ? "#1A6BFF" : "#8A96B5"}}>
                    {v < 1 ? `${v*1000}m` : `${v}km`}
                  </button>
                ))}
              </div>
              {/* Slider */}
              <input
                type="range" min={0.5} max={2} step={0.5}
                value={pendingRange}
                onChange={e => { setPendingRange(parseFloat(e.target.value)); setRangeSaved(false); }}
                style={{width:"100%",accentColor:"#1A6BFF",height:6,cursor:"pointer",marginBottom:12}}
              />
              {/* Info */}
              <div style={{fontSize:12,color:"#8A96B5",fontWeight:500,background:"#F4F6FB",borderRadius:8,padding:"8px 12px",marginBottom:12}}>
                🛵 Customers within <strong style={{color:"#0D1B3E"}}>{pendingRange < 1 ? `${pendingRange*1000}m` : `${pendingRange}km`}</strong> will see your shop and can place delivery orders.
                {pendingRange !== deliveryRange && <span style={{color:"#E53E3E",fontWeight:700}}> (unsaved)</span>}
              </div>
              {/* Save button */}
              <button
                onClick={async () => {
                  await saveDeliveryRange(pendingRange);
                  setDeliveryRange(pendingRange);
                  setRangeSaved(true);
                  setTimeout(() => setRangeSaved(false), 3000);
                }}
                disabled={pendingRange === deliveryRange && !rangeSaved}
                style={{width:"100%",padding:"12px",borderRadius:12,border:"none",fontSize:14,fontWeight:800,cursor:pendingRange===deliveryRange?"not-allowed":"pointer",fontFamily:"inherit",transition:"all 0.2s",
                  background: rangeSaved ? "#00875A" : pendingRange===deliveryRange ? "#F4F6FB" : "#1A6BFF",
                  color: pendingRange===deliveryRange && !rangeSaved ? "#B0BACC" : "white"}}>
                {rangeSaved ? "✓ Saved!" : pendingRange===deliveryRange ? "No changes" : "💾 Save Delivery Range"}
              </button>
            </div>
          </div>
        )}

      <nav className="bottom-nav">
        <a href="/shop-dashboard" className="nav-item active"><div className="nav-icon">🏠</div>Home</a>
        <a href="/add-product" className="nav-item"><div className="nav-icon">➕</div>Add</a>
        <a href="/shop-orders" className="nav-item" style={{position:"relative"}}><div className="nav-icon">📋</div>Orders</a>
        <a href="/riders" className="nav-item"><div className="nav-icon">🛵</div>Riders</a>
        <a href="/help" className="nav-item"><div className="nav-icon">💬</div>Help</a>
      </nav>
    </div>
  );
}
