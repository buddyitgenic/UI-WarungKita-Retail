/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  BarChart3, 
  Package, 
  Settings, 
  ShoppingBag, 
  Plus, 
  Edit3, 
  Trash2, 
  Save, 
  Undo, 
  TrendingUp, 
  DollarSign, 
  Smartphone, 
  Eye, 
  AlertCircle,
  Hash,
  Star
} from "lucide-react";
import { Product, OrderRecord } from "../types";
import { COMPANY_INFO } from "../data/products";

interface AdminPanelProps {
  products: Product[];
  onAddProduct: (product: Product) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
  orders: OrderRecord[];
  onUpdateOrderStatus: (orderId: string, status: OrderRecord["status"]) => void;
  companyConfig: typeof COMPANY_INFO;
  onUpdateCompanyConfig: (config: typeof COMPANY_INFO) => void;
}

export default function AdminPanel({
  products,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  orders,
  onUpdateOrderStatus,
  companyConfig,
  onUpdateCompanyConfig,
}: AdminPanelProps) {
  // Tabs: 'overview', 'products', 'orders', 'settings'
  const [activeSubTab, setActiveSubTab] = useState<"overview" | "products" | "orders" | "settings">("overview");

  // Product Editing state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingNew, setIsAddingNew] = useState<boolean>(false);

  // Form state for creating/editing product
  const [productForm, setProductForm] = useState<Partial<Product>>({
    name: "",
    category: "Pantry",
    price: 0,
    discountPrice: undefined,
    shortDescription: "",
    description: "",
    gallery: [""],
    specs: [{ label: "", value: "" }],
    stock: 10,
    rating: 4.8,
    reviewsCount: 15,
  });

  // Settings form state
  const [settingsForm, setSettingsForm] = useState<typeof COMPANY_INFO>({ ...companyConfig });
  const [settingsFeedback, setSettingsFeedback] = useState<string>("");

  // Handler to sync product format when clicking edit
  const startEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setProductForm({ ...prod });
    setIsAddingNew(false);
  };

  const startAddNewProduct = () => {
    setEditingProduct(null);
    setIsAddingNew(true);
    setProductForm({
      id: "p_" + Date.now(),
      name: "",
      category: "Pantry",
      price: 0,
      discountPrice: undefined,
      shortDescription: "",
      description: "",
      gallery: ["https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800"],
      specs: [
        { label: "Berat Bersih", value: "250 gram" },
        { label: "Kemasan", value: "Eco pouch" }
      ],
      stock: 30,
      rating: 4.5,
      reviewsCount: 1,
      isFeatured: false,
    });
  };

  // Form inputs handlers
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    // Parse prices/stocks to numbers
    if (name === "price" || name === "discountPrice" || name === "stock" || name === "rating" || name === "reviewsCount") {
      const numVal = value === "" ? "" : Number(value);
      setProductForm((prev) => ({ ...prev, [name]: numVal === "" ? undefined : numVal }));
    } else {
      setProductForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle Specs Update
  const handleSpecChange = (index: number, field: "label" | "value", value: string) => {
    setProductForm((prev) => {
      const newSpecs = [...(prev.specs || [])];
      newSpecs[index] = { ...newSpecs[index], [field]: value };
      return { ...prev, specs: newSpecs };
    });
  };

  const addSpecRow = () => {
    setProductForm((prev) => ({
      ...prev,
      specs: [...(prev.specs || []), { label: "", value: "" }],
    }));
  };

  const removeSpecRow = (index: number) => {
    setProductForm((prev) => {
      const newSpecs = (prev.specs || []).filter((_, idx) => idx !== index);
      return { ...prev, specs: newSpecs };
    });
  };

  // Handle Gallery URLs Update
  const handleGalleryChange = (index: number, value: string) => {
    setProductForm((prev) => {
      const newUrls = [...(prev.gallery || [])];
      newUrls[index] = value;
      return { ...prev, gallery: newUrls };
    });
  };

  const addGalleryRow = () => {
    setProductForm((prev) => ({
      ...prev,
      gallery: [...(prev.gallery || []), ""],
    }));
  };

  const removeGalleryRow = (index: number) => {
    setProductForm((prev) => {
      const newUrls = (prev.gallery || []).filter((_, idx) => idx !== index);
      return { ...prev, gallery: newUrls };
    });
  };

  // Submit product
  const saveProductFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name?.trim()) return;

    const formattedProduct: Product = {
      id: productForm.id || "p_" + Date.now(),
      name: productForm.name,
      category: productForm.category || "Pantry",
      price: Number(productForm.price) || 0,
      discountPrice: productForm.discountPrice ? Number(productForm.discountPrice) : undefined,
      shortDescription: productForm.shortDescription || "",
      description: productForm.description || "",
      gallery: (productForm.gallery || []).filter((g) => g.trim() !== ""),
      specs: (productForm.specs || []).filter((s) => s.label.trim() !== ""),
      rating: Number(productForm.rating) || 4.5,
      reviewsCount: Number(productForm.reviewsCount) || 1,
      stock: Number(productForm.stock) || 0,
      isFeatured: !!productForm.isFeatured,
    };

    if (isAddingNew) {
      onAddProduct(formattedProduct);
      setIsAddingNew(false);
    } else if (editingProduct) {
      onUpdateProduct(formattedProduct);
      setEditingProduct(null);
    }
  };

  // Change overall Company Config
  const handleCompanyConfigSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateCompanyConfig(settingsForm);
    setSettingsFeedback("✔️ Pengaturan profil & Whatsapp berhasil diperbarui secara live!");
    setTimeout(() => setSettingsFeedback(""), 4000);
  };

  // Financial statistics calculated dynamically
  const totalApprovedSales = orders
    .filter((o) => o.status === "Selesai")
    .reduce((sum, o) => sum + o.grandTotal, 0);

  const pendingSales = orders
    .filter((o) => o.status === "Diproses")
    .reduce((sum, o) => sum + o.grandTotal, 0);

  // Format money inside admin
  const formatAdminPrice = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div id="admin-panel-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* HEADER UTAMA */}
      <div className="border-b border-stone-200 pb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="bg-stone-900 text-stone-100 uppercase tracking-widest text-[10px] font-bold px-2 py-0.5 rounded">
            Panel Kontrol Admin
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-stone-950 mt-1 font-sans">
            WarungKita Office
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Ubah katalog, pantau status pesanan masuk via web, dan edit format pengalihan sistem WhatsApp.
          </p>
        </div>

        {/* Cepat Tambah button */}
        <button
          id="btn-admin-add-prod-header"
          onClick={startAddNewProduct}
          className="inline-flex items-center justify-center space-x-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-stone-100 text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Produk Baru</span>
        </button>
      </div>

      {/* NAVIGASI SUB TAB */}
      <div id="admin-subtabs" className="flex items-center space-x-1.5 border-b border-stone-200/60 pb-1 overflow-x-auto">
        {[
          { id: "overview", label: "Kinerja & Ringkasan", icon: BarChart3 },
          { id: "products", label: "Kelola Produk", icon: Package },
          { id: "orders", label: "Sistem Order WA", icon: ShoppingBag },
          { id: "settings", label: "Pengaturan Profil & WA", icon: Settings },
        ].map((tab) => {
          const IconComp = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              id={`tab-admin-${tab.id}`}
              key={tab.id}
              onClick={() => {
                setActiveSubTab(tab.id as any);
                setIsAddingNew(false);
                setEditingProduct(null);
              }}
              className={`flex items-center space-x-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                isActive
                  ? "bg-stone-950 text-white shadow-sm"
                  : "text-stone-600 hover:text-stone-950 hover:bg-stone-100"
              }`}
            >
              <IconComp className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* KONDISI EDITING ATAU TAMBAH PRODUK BARU */}
      {(isAddingNew || editingProduct) && (
        <div id="product-editor-box" className="bg-white border-2 border-emerald-600/30 rounded-3xl p-6 shadow-xl animate-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-5">
            <div className="flex items-center space-x-2">
              <span className="p-1.5 bg-emerald-50 text-emerald-800 rounded-lg">
                <Edit3 className="w-4.5 h-4.5" />
              </span>
              <h3 className="text-lg font-bold text-stone-900">
                {isAddingNew ? "Formulir Produk Baru" : `Edit Produk (${editingProduct?.name})`}
              </h3>
            </div>
            <button
              id="btn-cancel-editor"
              onClick={() => {
                setIsAddingNew(false);
                setEditingProduct(null);
              }}
              className="inline-flex items-center space-x-1 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-600 hover:text-stone-900 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              <Undo className="w-3.5 h-3.5" />
              <span>Batal</span>
            </button>
          </div>

          <form onSubmit={saveProductFormSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Kolom Form 1: Dasar */}
              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">Nama Produk *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={productForm.name || ""}
                    onChange={handleFormChange}
                    placeholder="Contoh: Madu Alami Organik"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-emerald-500 text-stone-900"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">Kategori</label>
                    <select
                      name="category"
                      value={productForm.category || "Pantry"}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-emerald-500 text-stone-800"
                    >
                      <option value="Pantry">Pantry</option>
                      <option value="Home & Decor">Home & Decor</option>
                      <option value="Eco-Lifestyle">Eco-Lifestyle</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">Stok Sisa Di Rak</label>
                    <input
                      type="number"
                      name="stock"
                      required
                      min={0}
                      value={productForm.stock === undefined ? 10 : productForm.stock}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-emerald-500 text-stone-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">Harga Retail * (Rp)</label>
                    <input
                      type="number"
                      name="price"
                      required
                      min={0}
                      value={productForm.price || 0}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-emerald-500 text-stone-900 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">Harga Diskon (Rp)</label>
                    <input
                      type="number"
                      name="discountPrice"
                      min={0}
                      value={productForm.discountPrice || ""}
                      onChange={handleFormChange}
                      placeholder="Jangan isi jika tidak promo"
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-emerald-500 text-stone-900 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">Rating Rating (1-5)</label>
                    <input
                      type="number"
                      name="rating"
                      min={1}
                      max={5}
                      step={0.1}
                      value={productForm.rating || 4.5}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-emerald-500 text-stone-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">Jumlah Ulasan Pembeli</label>
                    <input
                      type="number"
                      name="reviewsCount"
                      min={0}
                      value={productForm.reviewsCount || 10}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-emerald-500 text-stone-900"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2 pt-2">
                  <input
                    type="checkbox"
                    id="isFeatured"
                    name="isFeatured"
                    checked={!!productForm.isFeatured}
                    onChange={(e) => setProductForm((p) => ({ ...p, isFeatured: e.target.checked }))}
                    className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 border-stone-300 rounded"
                  />
                  <label htmlFor="isFeatured" className="text-xs font-bold text-stone-700 select-none">
                    Rekomendasikan di Beranda Depan
                  </label>
                </div>
              </div>

              {/* Kolom Form 2: Deskripsi & Image */}
              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">Deskripsi Ringkas (Maks 140 Huruf)</label>
                  <input
                    type="text"
                    name="shortDescription"
                    value={productForm.shortDescription || ""}
                    onChange={handleFormChange}
                    placeholder="Madu murni Sumbawa kaya enzim alami..."
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-emerald-500 text-stone-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">Penjelasan Detail Produk *</label>
                  <textarea
                    name="description"
                    required
                    rows={4}
                    value={productForm.description || ""}
                    onChange={handleFormChange}
                    placeholder="Tulis riwayat produksi, cara ekstraksi, khasiat lengkap..."
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-emerald-500 text-stone-900 font-sans"
                  ></textarea>
                </div>

                {/* Galeri Image URL */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[11px] font-bold text-stone-700 uppercase">Tautan Gambar Galeri (URLs) *</label>
                    <button
                      type="button"
                      onClick={addGalleryRow}
                      className="text-[10px] font-bold text-emerald-700 hover:text-emerald-800 flex items-center space-x-0.5 cursor-pointer"
                    >
                      <span>+ Tambah URL</span>
                    </button>
                  </div>
                  <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                    {(productForm.gallery || []).map((url, i) => (
                      <div key={i} className="flex items-center space-x-2">
                        <input
                          type="text"
                          required
                          value={url}
                          onChange={(e) => handleGalleryChange(i, e.target.value)}
                          placeholder="https://images.unsplash.com/..."
                          className="flex-1 px-2.5 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-[10px] focus:outline-none focus:border-emerald-500 text-stone-900 font-mono"
                        />
                        {(productForm.gallery || []).length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeGalleryRow(i)}
                            className="text-rose-500 hover:text-rose-700 text-xs font-semibold cursor-pointer"
                          >
                            Hapus
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Kolom Form 3: Spesifikasi */}
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[11px] font-bold text-stone-700 uppercase">Spesifikasi Detail Teknikal</label>
                    <button
                      type="button"
                      onClick={addSpecRow}
                      className="text-[10px] font-bold text-emerald-700 hover:text-emerald-800 flex items-center space-x-0.5 cursor-pointer"
                    >
                      <span>+ Tambah Baris</span>
                    </button>
                  </div>
                  <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                    {(productForm.specs || []).map((spec, i) => (
                      <div key={i} className="flex items-center space-x-2 border border-stone-100 p-2 rounded-xl bg-stone-50/50">
                        <div className="grid grid-cols-2 gap-2 flex-1">
                          <input
                            type="text"
                            required
                            placeholder="Atribut (cth: Berat)"
                            value={spec.label}
                            onChange={(e) => handleSpecChange(i, "label", e.target.value)}
                            className="px-2 py-1 bg-white border border-stone-200 rounded-lg text-[10px] text-stone-900"
                          />
                          <input
                            type="text"
                            required
                            placeholder="Isi Spek (cth: 350 gr)"
                            value={spec.value}
                            onChange={(e) => handleSpecChange(i, "value", e.target.value)}
                            className="px-2 py-1 bg-white border border-stone-200 rounded-lg text-[10px] text-stone-900 font-sans"
                          />
                        </div>
                        {(productForm.specs || []).length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeSpecRow(i)}
                            className="text-stone-400 hover:text-stone-600 text-[10px] cursor-pointer"
                          >
                            Hapus
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2 bg-stone-50 p-3 rounded-xl border border-stone-100/60 flex items-center space-x-2 text-stone-500 text-[11px] font-sans">
                  <AlertCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Pastikan URL gambar yang Anda ketik benar dan terbuka (Unsplash disarankan untuk demo).</span>
                </div>
              </div>

            </div>

            {/* Submit Action di bawah Editor */}
            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-stone-100">
              <button
                type="button"
                onClick={() => {
                  setIsAddingNew(false);
                  setEditingProduct(null);
                }}
                className="px-4 py-2 border border-stone-200 text-stone-700 font-bold text-xs rounded-xl hover:bg-stone-50 cursor-pointer animate-none"
              >
                Batalkan Perubahan
              </button>

              <button
                type="submit"
                className="inline-flex items-center justify-center space-x-2 px-6 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl transition-all shadow-md cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Produk Live</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 📊 TAB 1: KINERJA & RINGKASAN */}
      {activeSubTab === "overview" && (
        <div id="admin-overview-tab" className="space-y-8 animate-in fade-in-40 duration-200">
          
          {/* Dashboard Stats Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Card 1: Penjualan Selesai */}
            <div className="bg-white border border-stone-100 p-6 rounded-2xl flex items-center justify-between shadow-xs">
              <div className="space-y-1.5">
                <span className="text-[10px] text-stone-400 uppercase font-bold tracking-wider">Omzet Berhasil (Selesai)</span>
                <p className="text-xl sm:text-2xl font-bold font-mono text-stone-900">{formatAdminPrice(totalApprovedSales)}</p>
                <p className="text-[10px] text-stone-400">Dari total status belanjaan tuntas</p>
              </div>
              <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl">
                <TrendingUp className="w-6 h-6" />
              </div>
            </div>

            {/* Card 2: Penjualan Diproses */}
            <div className="bg-white border border-stone-100 p-6 rounded-2xl flex items-center justify-between shadow-xs">
              <div className="space-y-1.5">
                <span className="text-[10px] text-stone-400 uppercase font-bold tracking-wider">Nilai Pending (Diproses)</span>
                <p className="text-xl sm:text-2xl font-bold font-mono text-stone-900">{formatAdminPrice(pendingSales)}</p>
                <p className="text-[10px] text-emerald-700 font-medium">Lolos dialihkan ke WhatsApp</p>
              </div>
              <div className="p-3 bg-amber-50 text-amber-800 rounded-xl">
                <DollarSign className="w-6 h-6" />
              </div>
            </div>

            {/* Card 3: Total Orders */}
            <div className="bg-white border border-stone-100 p-6 rounded-2xl flex items-center justify-between shadow-xs">
              <div className="space-y-1.5">
                <span className="text-[10px] text-stone-400 uppercase font-bold tracking-wider">Jumlah Transaksi Masuk</span>
                <p className="text-xl sm:text-2xl font-bold font-mono text-stone-900">{orders.length} Order</p>
                <p className="text-[10px] text-emerald-700 font-medium">Bahan pemecah rekor lokal</p>
              </div>
              <div className="p-3 bg-stone-50 text-stone-700 rounded-xl">
                <ShoppingBag className="w-6 h-6" />
              </div>
            </div>

            {/* Card 4: Total Products */}
            <div className="bg-white border border-stone-100 p-6 rounded-2xl flex items-center justify-between shadow-xs">
              <div className="space-y-1.5">
                <span className="text-[10px] text-stone-400 uppercase font-bold tracking-wider">Varian Produk Terpasang</span>
                <p className="text-xl sm:text-2xl font-bold font-mono text-stone-900">{products.length} Varian</p>
                <p className="text-[10px] text-stone-400">Kapasitas rak toko virtual</p>
              </div>
              <div className="p-3 bg-stone-50 text-stone-700 rounded-xl">
                <Package className="w-6 h-6" />
              </div>
            </div>

          </div>

          {/* Sub Row: Informasi Kinerja Cepat */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Box 1: Panduan Alur Integrasi WhatsApp */}
            <div className="lg:col-span-1 bg-gradient-to-br from-emerald-500/10 to-stone-50 border border-emerald-500/20 p-6 rounded-2xl space-y-4">
              <span className="bg-emerald-700 text-white font-bold text-[9px] px-2 py-0.5 rounded uppercase">Metode Integrasi</span>
              <h4 className="text-base font-bold text-stone-900">Bagaimana Cara Kerja Checkout WA?</h4>
              
              <ol className="space-y-2.5 text-xs text-stone-600 font-sans list-decimal list-inside pl-1">
                <li><span className="font-semibold text-stone-900">Pembeli Mengisi Keranjang:</span> Mengurangi sisa stok secara aman di web.</li>
                <li><span className="font-semibold text-stone-900">Mengisi Form Pengiriman:</span> Mengatur metode kurir kirim & cara transfer bayar.</li>
                <li><span className="font-semibold text-stone-900">Redirect WhatsApp:</span> String struk belanja disusun rapi otomatis di HP pembeli dengan format API Whatsapp resmi.</li>
                <li><span className="font-semibold text-stone-900">Admin Melayani:</span> Anda menerima chat detail, menyepakati resi, dan meminta bukti transfer pembayaran.</li>
              </ol>

              <div className="pt-2 border-t border-emerald-500/10 flex items-center space-x-2 text-[11px] text-emerald-800">
                <Smartphone className="w-4.5 h-4.5" />
                <span>Format WA dikonfigurasi pada menu terakhir.</span>
              </div>
            </div>

            {/* Box 2: Order Masuk Terbaru */}
            <div className="lg:col-span-2 bg-white border border-stone-100 p-6 rounded-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-stone-50 pb-3">
                <h4 className="text-sm font-bold text-stone-900">Aktivitas Booking Order Terakhir (Sesi Ini)</h4>
                <button
                  id="btn-goto-tab-orders"
                  onClick={() => setActiveSubTab("orders")}
                  className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 cursor-pointer"
                >
                  Kelola Semua Order &rarr;
                </button>
              </div>

              {orders.length === 0 ? (
                <div className="py-8 text-center text-stone-400 space-y-2 text-xs">
                  <p>Belum ada order masuk di sesi ini.</p>
                  <p className="text-[10px] text-stone-400">Silakan lakukan uji coba checkout keranjang di menu pembeli depan.</p>
                </div>
              ) : (
                <div className="space-y-3.5 divide-y divide-stone-50 max-h-60 overflow-y-auto">
                  {orders.slice().reverse().map((ord) => (
                    <div key={ord.id} className="flex items-center justify-between pt-3.5 first:pt-0 text-xs">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-stone-900">{ord.details.customerName}</span>
                          <span className="text-[10px] text-stone-400 font-mono">{ord.date}</span>
                        </div>
                        <p className="text-[10px] text-stone-500 truncate max-w-sm mt-0.5">
                          {ord.items.map((it) => `${it.productName} (${it.quantity}x)`).join(", ")}
                        </p>
                      </div>

                      <div className="flex items-center space-x-3 text-right">
                        <div>
                          <p className="font-bold font-mono text-stone-900">{formatAdminPrice(ord.grandTotal)}</p>
                          <p className="text-[10px] text-stone-400">{ord.details.paymentMethod}</p>
                        </div>

                        <span className={`px-2 py-0.5 font-bold text-[9px] rounded-full uppercase ${
                          ord.status === "Selesai" 
                            ? "bg-emerald-50 text-emerald-800"
                            : ord.status === "Dibatalkan"
                            ? "bg-stone-100 text-stone-400"
                            : "bg-amber-50 text-amber-800"
                        }`}>
                          {ord.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>
      )}

      {/* 📦 TAB 2: MANAGEMENT PRODUK (TABLE) */}
      {activeSubTab === "products" && (
        <div id="admin-products-tab" className="space-y-4 animate-in fade-in-40 duration-200">
          
          <div className="bg-white border border-stone-100 rounded-2xl overflow-hidden shadow-xs">
            <div className="p-4 bg-stone-50/50 border-b border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <h4 className="text-sm font-bold text-stone-900">Semua {products.length} Koleksi Rak Toko</h4>
              
              <button
                id="btn-admin-add-prod-inline"
                onClick={startAddNewProduct}
                className="inline-flex items-center justify-center space-x-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Baru</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-stone-200 bg-stone-50 font-bold text-stone-600 uppercase tracking-wider">
                    <th className="p-3.5 px-4 font-bold text-[10px]">Gambar & Judul</th>
                    <th className="p-3.5 font-bold text-[10px]">Kategori</th>
                    <th className="p-3.5 font-bold text-[10px]">Harga (Diskon)</th>
                    <th className="p-3.5 font-bold text-[10px]">Stok Rak</th>
                    <th className="p-3.5 font-bold text-[10px]">Favorit Depan</th>
                    <th className="p-3.5 font-bold text-[10px] text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {products.map((p) => {
                    const finalPr = p.discountPrice || p.price;
                    return (
                      <tr key={p.id} className="hover:bg-stone-50/50 transition-colors">
                        
                        {/* Gambar & Judul */}
                        <td className="p-3.5 px-4 flex items-center space-x-3.5 min-w-[220px]">
                          <img
                            src={p.gallery[0]}
                            alt={p.name}
                            className="w-10 h-10 rounded-lg object-cover border border-stone-200 bg-stone-100 flex-shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <div className="min-w-0">
                            <p className="font-bold text-stone-900 truncate max-w-md">{p.name}</p>
                            <p className="text-[10px] text-stone-400 font-sans truncate max-w-xs">{p.shortDescription}</p>
                          </div>
                        </td>

                        {/* Kategori */}
                        <td className="p-3.5">
                          <span className="bg-stone-100 text-stone-700 px-2 py-0.5 rounded font-semibold text-[10px]">
                            {p.category}
                          </span>
                        </td>

                        {/* Harga */}
                        <td className="p-3.5 font-mono font-medium text-stone-800">
                          <span>{formatAdminPrice(p.price)}</span>
                          {p.discountPrice && (
                            <span className="block text-[10px] text-stone-400 line-through">
                              {formatAdminPrice(p.discountPrice)}
                            </span>
                          )}
                        </td>

                        {/* Stok */}
                        <td className="p-3.5">
                          <span className={`font-bold font-mono ${p.stock <= 0 ? "text-rose-600" : p.stock < 15 ? "text-amber-600" : "text-stone-700"}`}>
                            {p.stock} pcs
                          </span>
                        </td>

                        {/* Is Featured */}
                        <td className="p-3.5">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${p.isFeatured ? "bg-emerald-50 text-emerald-800 font-bold" : "bg-stone-100 text-stone-400"}`}>
                            {p.isFeatured ? "UTAMA" : "Standar"}
                          </span>
                        </td>

                        {/* Aksi */}
                        <td className="p-3.5 text-right space-x-1.5 whitespace-nowrap">
                          <button
                            id={`btn-admin-edit-${p.id}`}
                            onClick={() => startEditProduct(p)}
                            className="p-1 px-2.5 bg-white border border-stone-200 text-stone-700 hover:text-emerald-700 hover:border-emerald-200 rounded-lg transition-colors cursor-pointer inline-flex items-center space-x-1"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>
                          
                          <button
                            id={`btn-admin-del-${p.id}`}
                            onClick={() => {
                              if (window.confirm(`Yakin ingin menghapus produk "${p.name}" dari katalog?`)) {
                                onDeleteProduct(p.id);
                              }
                            }}
                            className="p-1 px-2.5 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg transition-colors cursor-pointer inline-flex items-center space-x-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Hapus</span>
                          </button>
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* 🛍️ TAB 3: SISTEM ORDER */}
      {activeSubTab === "orders" && (
        <div id="admin-orders-tab" className="space-y-4 animate-in fade-in-40 duration-200">
          
          <div className="bg-white border border-stone-100 rounded-2xl overflow-hidden shadow-xs">
            <div className="p-4 bg-stone-50/50 border-b border-stone-100">
              <h4 className="text-sm font-bold text-stone-900">Daftar Transaksi Struk Checkout (Sesi Aktif)</h4>
            </div>

            {orders.length === 0 ? (
              <div className="p-12 text-center text-stone-400 space-y-2 text-xs">
                <p>Belum ada order masuk di database sesi ini.</p>
                <p className="max-w-xs mx-auto text-[11px] text-stone-400">
                  Semua form pengiriman yang ditekan "Kirim" pada halaman belanja pembeli akan dicatat di daftar ini secara live.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-stone-100">
                {orders.slice().reverse().map((ord) => (
                  <div key={ord.id} className="p-4 sm:p-6 space-y-4 hover:bg-stone-50/30 transition-colors">
                    
                    {/* Baris Atas: Info Kode & Status */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs">
                      <div>
                        <div className="flex items-center space-x-2.5">
                          <span className="font-mono font-bold text-stone-900 text-sm">#{ord.id}</span>
                          <span className="text-[10px] text-stone-400">{ord.date}</span>
                        </div>
                        <p className="text-[11px] text-stone-500 mt-0.5">Metode Bayar: <span className="font-semibold text-stone-800">{ord.details.paymentMethod}</span></p>
                      </div>

                      {/* Status select changer */}
                      <div className="flex items-center space-x-2">
                        <span className="text-[11px] text-stone-400 font-semibold uppercase">Ubah Status:</span>
                        <select
                          id={`select-status-${ord.id}`}
                          value={ord.status}
                          onChange={(e) => onUpdateOrderStatus(ord.id, e.target.value as any)}
                          className="px-2 py-1 bg-stone-100 border border-stone-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-emerald-500 text-stone-700"
                        >
                          <option value="Diproses">Diproses 💬</option>
                          <option value="Selesai">Selesai ✓</option>
                          <option value="Dibatalkan">Dibatalkan X</option>
                        </select>
                      </div>
                    </div>

                    {/* Pembeli Detail */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-stone-100 pt-4 text-xs font-sans">
                      <div>
                        <p className="text-[10px] text-stone-400 uppercase font-bold tracking-wider mb-1">Identitas Penerima</p>
                        <p className="font-bold text-stone-900">{ord.details.customerName}</p>
                        <p className="text-stone-500">{ord.details.customerPhone}</p>
                        {ord.details.customerEmail && <p className="text-stone-500">{ord.details.customerEmail}</p>}
                      </div>

                      <div>
                        <p className="text-[10px] text-stone-400 uppercase font-bold tracking-wider mb-1">Tujuan Pengiriman</p>
                        <p className="font-medium text-stone-700 leading-relaxed">{ord.details.customerAddress}</p>
                        <p className="text-[10.5px] text-emerald-800 font-semibold mt-1">Kurir: {ord.details.shippingMethod}</p>
                      </div>

                      <div className="bg-stone-50 p-3 rounded-xl border border-stone-100 text-right flex flex-col justify-between">
                        <div className="text-[10px] text-stone-400 uppercase font-bold text-left mb-1">Total Tagihan Finansial</div>
                        <div className="space-y-0.5">
                          <div className="flex justify-between text-[11px] text-stone-500">
                            <span>Belanja:</span>
                            <span className="font-mono">{formatAdminPrice(ord.subtotal)}</span>
                          </div>
                          <div className="flex justify-between text-[11px] text-stone-500">
                            <span>Ongkir:</span>
                            <span className="font-mono">{formatAdminPrice(ord.shippingFee)}</span>
                          </div>
                          <div className="flex justify-between text-xs font-bold text-stone-900 pt-1 border-t border-stone-200">
                            <span>TOTAL:</span>
                            <span className="font-mono">{formatAdminPrice(ord.grandTotal)}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* List Items dibeli */}
                    <div className="border-t border-stone-100 pt-3.5">
                      <p className="text-[10px] text-stone-400 uppercase font-bold tracking-wider mb-2">Item Belanjaan ({ord.items.length})</p>
                      
                      <div className="flex flex-wrap gap-2.5">
                        {ord.items.map((item, id) => (
                          <div key={id} className="bg-stone-100 text-stone-800 text-[10.5px] px-2.5 py-1.5 rounded-lg border border-stone-200/40 flex items-center space-x-1.5 font-medium">
                            <span className="font-bold text-emerald-800">{item.quantity}x</span>
                            <span>{item.productName}</span>
                            <span className="text-stone-400 font-mono scale-90">({formatAdminPrice(item.price)})</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {ord.details.notes && (
                      <div className="bg-amber-50 border border-amber-100 text-stone-700 p-2.5 rounded-xl text-xs font-sans">
                        <span className="font-bold text-amber-900">Catatan Pelanggan:</span> "{ord.details.notes}"
                      </div>
                    )}

                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}

      {/* ⚙️ TAB 4: GENERAL PROFILE & CONFIG */}
      {activeSubTab === "settings" && (
        <div id="admin-settings-tab" className="space-y-4 animate-in fade-in-40 duration-200">
          
          <div className="bg-white border border-stone-100 rounded-2xl overflow-hidden shadow-xs">
            <div className="p-4 bg-stone-50/50 border-b border-stone-100">
              <h4 className="text-sm font-bold text-stone-900 font-sans">Sunting Identitas Toko & WhatsApp Gateway</h4>
            </div>

            <form onSubmit={handleCompanyConfigSubmit} className="p-4 sm:p-6 space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Info Dasar */}
                <div className="space-y-4">
                  <h5 className="text-xs font-bold text-stone-400 uppercase tracking-widest border-b border-stone-100 pb-1.5">A. Identitas Brand Toko</h5>
                  
                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">Nama Perusahaan / Retail</label>
                    <input
                      type="text"
                      required
                      value={settingsForm.name}
                      onChange={(e) => setSettingsForm((s) => ({ ...s, name: e.target.value }))}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-emerald-500 text-stone-900"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">Motto Slogan / Tagline</label>
                    <input
                      type="text"
                      required
                      value={settingsForm.tagline}
                      onChange={(e) => setSettingsForm((s) => ({ ...s, tagline: e.target.value }))}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-emerald-500 text-stone-900"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">Deskripsi Singkat Toko Depan</label>
                    <textarea
                      required
                      rows={3}
                      value={settingsForm.shortDesc}
                      onChange={(e) => setSettingsForm((s) => ({ ...s, shortDesc: e.target.value }))}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-emerald-500 text-stone-900 font-sans"
                    ></textarea>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">Sejarah / Tentang Kami (Panjang)</label>
                    <textarea
                      required
                      rows={4}
                      value={settingsForm.history}
                      onChange={(e) => setSettingsForm((s) => ({ ...s, history: e.target.value }))}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-emerald-500 text-stone-900 font-sans"
                    ></textarea>
                  </div>
                </div>

                {/* Info Kontak & Gateway */}
                <div className="space-y-4">
                  <h5 className="text-xs font-bold text-stone-400 uppercase tracking-widest border-b border-stone-100 pb-1.5">B. Nomor Gateway & Alamat</h5>
                  
                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">Nomor WhatsApp Admin (Kode Negara Tanpa "+" / Spasi) *</label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={settingsForm.whatsappNumber}
                        onChange={(e) => setSettingsForm((s) => ({ ...s, whatsappNumber: e.target.value }))}
                        className="w-full pl-8 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-emerald-500 text-stone-900 font-mono"
                      />
                      <Smartphone className="w-4 h-4 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    </div>
                    <span className="text-[10px] text-stone-400 mt-1 block">Contoh: Indonesia diawali 6281234567890 (bukan dengan 0812 atau +62)</span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">Alamat Kantor / Toko Fisik</label>
                    <input
                      type="text"
                      required
                      value={settingsForm.address}
                      onChange={(e) => setSettingsForm((s) => ({ ...s, address: e.target.value }))}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-emerald-500 text-stone-900"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">Email Halo Kontak</label>
                      <input
                        type="email"
                        required
                        value={settingsForm.email}
                        onChange={(e) => setSettingsForm((s) => ({ ...s, email: e.target.value }))}
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-emerald-500 text-stone-900"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">Telepon Tampil Kontak</label>
                      <input
                        type="text"
                        required
                        value={settingsForm.phone}
                        onChange={(e) => setSettingsForm((s) => ({ ...s, phone: e.target.value }))}
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-emerald-500 text-stone-900"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">Instagram (@)</label>
                      <input
                        type="text"
                        required
                        value={settingsForm.socials.instagram}
                        onChange={(e) => setSettingsForm((s) => ({ 
                          ...s, 
                          socials: { ...s.socials, instagram: e.target.value } 
                        }))}
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-emerald-500 text-stone-900"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">Toko Resmi Tokopedia</label>
                      <input
                        type="text"
                        required
                        value={settingsForm.socials.tokopedia}
                        onChange={(e) => setSettingsForm((s) => ({ 
                          ...s, 
                          socials: { ...s.socials, tokopedia: e.target.value } 
                        }))}
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-emerald-500 text-stone-900"
                      />
                    </div>
                  </div>
                </div>

              </div>

              {settingsFeedback && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-3 rounded-xl font-medium animate-pulse text-center">
                  {settingsFeedback}
                </div>
              )}

              {/* Submit settings button */}
              <div className="pt-4 border-t border-stone-100 flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center space-x-2 px-6 py-3 bg-stone-950 hover:bg-stone-900 text-stone-100 font-bold text-xs rounded-xl transition-all shadow-md cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Perbarui Pengaturan Toko & WA</span>
                </button>
              </div>

            </form>
          </div>

        </div>
      )}

    </div>
  );
}
