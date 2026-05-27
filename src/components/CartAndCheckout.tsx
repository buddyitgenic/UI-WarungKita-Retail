/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { X, Trash2, ShoppingBag, Send, Phone, User, MapPin, Truck, Landmark, Mail, ArrowRight, ClipboardEdit, AlertCircle } from "lucide-react";
import { CartItem, OrderDetails } from "../types";
import { COMPANY_INFO } from "../data/products";

interface CartAndCheckoutProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onOrderTriggered?: (
    details: OrderDetails, 
    items: { productName: string; quantity: number; price: number }[],
    subtotal: number,
    shippingFee: number,
    grandTotal: number
  ) => void;
  companyConfig: typeof COMPANY_INFO;
}

export default function CartAndCheckout({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onOrderTriggered,
  companyConfig,
}: CartAndCheckoutProps) {
  if (!isOpen) return null;

  // Checkout Form states
  const [formData, setFormData] = useState<OrderDetails>({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    customerAddress: "",
    shippingMethod: "Kurir Lokal (Yogyakarta)",
    paymentMethod: "BCA Transfer",
    notes: "",
  });

  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const [placedOrderSummary, setPlacedOrderSummary] = useState<string>("");

  // Calculate prices
  const getSubtotal = () => {
    return cartItems.reduce((acc, item) => {
      const price = item.product.discountPrice || item.product.price;
      return acc + price * item.quantity;
    }, 0);
  };

  const getShippingFee = () => {
    if (cartItems.length === 0) return 0;
    if (formData.shippingMethod === "Ambil di Toko (Self-Pickup)") return 0;
    if (formData.shippingMethod === "Kurir Lokal (Yogyakarta)") return 15000;
    return 30000; // Ekspedisi Reguler (JNE, J&T, Sicepat)
  };

  const getGrandTotal = () => {
    return getSubtotal() + getShippingFee();
  };

  // Format IDR Price
  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Validate form
  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    if (!formData.customerName.trim()) errors.customerName = "Nama lengkap wajib diisi";
    if (!formData.customerPhone.trim()) {
      errors.customerPhone = "Nomor WhatsApp aktif wajib diisi";
    } else if (!/^\+?[0-9]{9,15}$/.test(formData.customerPhone.replace(/\s/g, ""))) {
      errors.customerPhone = "Format nomor HP/WhatsApp tidak valid (contoh: 081234567890)";
    }
    if (!formData.customerAddress.trim()) errors.customerAddress = "Alamat pengiriman wajib diisi";
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Process & create Whatsapp redirection link
  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const subtotal = getSubtotal();
    const shippingFee = getShippingFee();
    const grandTotal = getGrandTotal();

    const subtotalStr = formatPrice(subtotal);
    const shippingStr = formatPrice(shippingFee);
    const grandTotalStr = formatPrice(grandTotal);

    // Generate neat text receipt for WhatsApp
    let itemReceipt = "";
    cartItems.forEach((item, index) => {
      const finalPrice = item.product.discountPrice || item.product.price;
      itemReceipt += `${index + 1}. *${item.product.name}*\n   💬 Jumlah: ${item.quantity} x ${formatPrice(finalPrice)} = ${formatPrice(finalPrice * item.quantity)}\n`;
    });

    const receiptMessage = `*PESANAN BARU - WEBSITE WARUNGKITA* 🛍️\n` +
      `----------------------------------------\n` +
      `👤 *Data Pelanggan:*\n` +
      `• Nama: ${formData.customerName}\n` +
      `• No. WA: ${formData.customerPhone}\n` +
      `• Email: ${formData.customerEmail || "-"}\n` +
      `• Alamat Kirim: ${formData.customerAddress}\n\n` +
      `📦 *Pilihan Kurir & Bayar:*\n` +
      `• Kirim: ${formData.shippingMethod} (${shippingStr})\n` +
      `• Bayar: ${formData.paymentMethod}\n` +
      `• Catatan: ${formData.notes || "-"}\n\n` +
      `🛒 *Daftar Belanjaan:*\n` +
      `${itemReceipt}\n` +
      `💵 *Rincian Keuangan:*\n` +
      `• Subtotal: ${subtotalStr}\n` +
      `• Ongkos Kirim: ${shippingStr}\n` +
      `• *TOTAL TAGIHAN: ${grandTotalStr}*\n` +
      `----------------------------------------\n` +
      `Mohon dibantu Kak untuk rincian transfer dan nomor resi pengirimannya. Terima kasih! 🙏`;

    setPlacedOrderSummary(receiptMessage);
    setIsOrderPlaced(true);

    // Track order in dynamic stats
    if (onOrderTriggered) {
      const orderItems = cartItems.map((item) => ({
        productName: item.product.name,
        quantity: item.quantity,
        price: item.product.discountPrice || item.product.price,
      }));
      onOrderTriggered(formData, orderItems, subtotal, shippingFee, grandTotal);
    }

    // Redirect to whatsapp
    const cleanWhatsAppPhone = companyConfig.whatsappNumber.replace(/[^0-9]/g, "");
    const waUrl = `https://wa.me/${cleanWhatsAppPhone}?text=${encodeURIComponent(receiptMessage)}`;
    
    // Automatically open in a new tab
    window.open(waUrl, "_blank");
  };

  const handleResetCheckout = () => {
    onClearCart();
    setIsOrderPlaced(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" id="cart-drawer-overlay">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-stone-900/50 backdrop-blur-xs transition-opacity" 
        onClick={onClose}
      ></div>

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div id="cart-drawer-card" className="w-screen max-w-2xl bg-white flex flex-col shadow-2xl h-full animate-in slide-in-from-right duration-300">
          
          {/* Header */}
          <div className="px-4 py-5 bg-stone-50 border-b border-stone-200 sm:px-6 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <ShoppingBag className="w-5.5 h-5.5 text-emerald-700" />
              <h2 className="text-lg font-bold text-stone-900">
                {isOrderPlaced ? "Pesanan Terkirim! 🌱" : "Keranjang Belanja Anda"}
              </h2>
            </div>
            <button
              id="btn-close-cart"
              onClick={onClose}
              className="p-1.5 -m-1 bg-stone-100 hover:bg-stone-200 text-stone-500 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Kondisi Sukses Order Placed */}
          {isOrderPlaced ? (
            <div className="flex-1 overflow-y-auto p-6 space-y-6 flex flex-col justify-between">
              <div className="space-y-4 text-center py-6">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
                  ✓
                </div>
                <h3 className="text-xl font-bold text-stone-900">Terima Kasih atas Pesanan Anda!</h3>
                <p className="text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
                  Detail pesanan Anda telah tersusun rapi dan dialihkan secara otomatis ke nomor WhatsApp admin kami di <span className="font-semibold text-stone-900">{companyConfig.phone}</span>.
                </p>
                <p className="text-xs text-amber-600 font-medium bg-amber-50 p-2.5 rounded-xl inline-block">
                  💡 Jika halaman chat Whatsapp tidak muncul otomatis, mohon salin formulir di bawah lalu kirim ke admin kami.
                </p>

                {/* Salinan Struk Kode Pesanan */}
                <div className="bg-stone-50 text-left border border-stone-200 p-4 rounded-xl text-xs font-mono whitespace-pre-line leading-relaxed max-h-72 overflow-y-auto text-stone-800">
                  {placedOrderSummary}
                </div>
              </div>

              {/* Action reset */}
              <div className="p-4 border-t border-stone-100 bg-stone-50 -mx-6 -mb-6 space-y-3">
                <a
                  href={`https://wa.me/${companyConfig.whatsappNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(placedOrderSummary)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center space-x-2 px-4 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl transition-all text-sm cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Kirim Ulang ke WhatsApp Admin</span>
                </a>
                <button
                  id="btn-reset-order-state"
                  onClick={handleResetCheckout}
                  className="w-full inline-flex items-center justify-center py-2 text-stone-600 hover:text-stone-900 text-xs font-semibold hover:underline cursor-pointer"
                >
                  Selesaikan & Belanja Lagi
                </button>
              </div>
            </div>
          ) : (
            // Alur Berbelanja Standar 
            <div className="flex-1 flex flex-col overflow-hidden">
              {cartItems.length === 0 ? (
                // Keranjang Kosong
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
                  <div className="p-4 bg-stone-50 rounded-full text-stone-300">
                    <ShoppingBag className="w-12 h-12" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-stone-800">Keranjang Masih Kosong</h3>
                    <p className="text-xs text-stone-500 max-w-xs mx-auto mt-1 leading-relaxed">
                      Jelajahi produk sehat terkurasi kami di katalog, lalu klik tombol tambah untuk memulai pesanan belanja Anda.
                    </p>
                  </div>
                  <button
                    id="btn-draw-shop-now"
                    onClick={onClose}
                    className="inline-flex items-center space-x-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
                  >
                    <span>Mulai Belanja</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                // Keranjang Isi + Form Checkout
                <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-stone-100">
                  
                  {/* PANEL KIRI: Review Barang */}
                  <div id="review-panel" className="p-4 sm:p-6 space-y-4 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-3">Tinjau Barang ({cartItems.length})</h3>
                      
                      <div className="space-y-3.5 divide-y divide-stone-100 max-h-[45vh] md:max-h-[58vh] overflow-y-auto pr-1">
                        {cartItems.map((item, idx) => {
                          const hasDisc = item.product.discountPrice && item.product.discountPrice < item.product.price;
                          const effectivePrice = hasDisc ? item.product.discountPrice! : item.product.price;
                          return (
                            <div 
                              key={item.product.id} 
                              className={`flex items-start space-x-3.5 pt-3 first:pt-0`}
                            >
                              <img
                                src={item.product.gallery[0]}
                                alt={item.product.name}
                                className="w-14 h-14 rounded-xl object-cover border border-stone-200/60 bg-stone-50 flex-shrink-0"
                                referrerPolicy="no-referrer"
                              />

                              <div className="flex-1 min-w-0">
                                <h4 className="text-xs font-bold text-stone-900 truncate leading-snug">
                                  {item.product.name}
                                </h4>
                                <p className="text-[10px] text-stone-400 leading-none mb-1.5">{item.product.category}</p>
                                
                                <span className="text-xs font-bold text-stone-800">
                                  {formatPrice(effectivePrice)}
                                </span>

                                {/* Stepper & Remove */}
                                <div className="flex items-center justify-between mt-2">
                                  {/* Stepper qty */}
                                  <div className="flex items-center space-x-2 border border-stone-200 rounded-lg px-2 py-0.5 bg-white scale-90 -origin-left">
                                    <button
                                      id={`dec-draw-qty-${item.product.id}`}
                                      onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                                      className="text-[11px] font-bold text-stone-500 hover:text-stone-800 font-mono cursor-pointer w-4 text-center"
                                    >
                                      -
                                    </button>
                                    <span className="text-xs font-bold text-stone-900 font-mono w-4 text-center">{item.quantity}</span>
                                    <button
                                      id={`inc-draw-qty-${item.product.id}`}
                                      onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                                      className="text-[11px] font-bold text-stone-500 hover:text-stone-800 font-mono cursor-pointer w-4 text-center"
                                    >
                                      +
                                    </button>
                                  </div>

                                  <button
                                    id={`remove-draw-item-${item.product.id}`}
                                    onClick={() => onRemoveItem(item.product.id)}
                                    className="p-1 text-stone-400 hover:text-rose-600 rounded transition-colors cursor-pointer"
                                    title="Hapus"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Ringkasan Subtotal */}
                    <div className="border-t border-stone-100 pt-4 mt-4 space-y-2 text-xs">
                      <div className="flex justify-between items-center text-stone-500">
                        <span>Jumlah Belanja (Subtotal)</span>
                        <span className="font-semibold text-stone-800">{formatPrice(getSubtotal())}</span>
                      </div>
                      <div className="flex justify-between items-center text-stone-500">
                        <span>Estimasi Ongkos Kirim</span>
                        <span className="font-semibold text-stone-800">
                          {getShippingFee() === 0 ? "Gratis / Di Toko" : formatPrice(getShippingFee())}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-[13px] font-bold text-stone-950 pt-2 border-t border-stone-100 border-dashed">
                        <span>Total Biaya</span>
                        <span>{formatPrice(getGrandTotal())}</span>
                      </div>
                    </div>
                  </div>

                  {/* PANEL KANAN: Form Pengiriman / Order Checkout */}
                  <form 
                    id="checkout-form"
                    onSubmit={handleSubmitOrder}
                    className="p-4 sm:p-6 space-y-4 bg-stone-50/50 flex flex-col justify-between"
                  >
                    <div className="space-y-3.5">
                      <div className="flex items-center space-x-1.5 border-b border-stone-100 pb-2 mb-1">
                        <ClipboardEdit className="w-4.5 h-4.5 text-emerald-800" />
                        <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider">Form Pengiriman Resmi</h3>
                      </div>

                      {/* Nama Pelanggan */}
                      <div>
                        <label className="block text-[11px] font-bold text-stone-600 uppercase mb-1">Nama Penerima *</label>
                        <div className="relative">
                          <input
                            type="text"
                            name="customerName"
                            value={formData.customerName}
                            onChange={handleInputChange}
                            placeholder="Contoh: Rian Saputra"
                            className={`w-full pl-8 pr-3 py-1.5 bg-white border rounded-lg text-xs focus:outline-none focus:border-emerald-500 text-stone-800 ${
                              formErrors.customerName ? "border-rose-400" : "border-stone-200"
                            }`}
                          />
                          <User className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                        </div>
                        {formErrors.customerName && (
                          <span className="text-[10px] text-rose-600 mt-1 block">{formErrors.customerName}</span>
                        )}
                      </div>

                      {/* No Whatsapp */}
                      <div>
                        <label className="block text-[11px] font-bold text-stone-600 uppercase mb-1">No. WhatsApp Aktif *</label>
                        <div className="relative">
                          <input
                            type="text"
                            name="customerPhone"
                            value={formData.customerPhone}
                            onChange={handleInputChange}
                            placeholder="Contoh: 081234567890"
                            className={`w-full pl-8 pr-3 py-1.5 bg-white border rounded-lg text-xs focus:outline-none focus:border-emerald-500 text-stone-800 ${
                              formErrors.customerPhone ? "border-rose-400" : "border-stone-200"
                            }`}
                          />
                          <Phone className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                        </div>
                        {formErrors.customerPhone && (
                          <span className="text-[10px] text-rose-600 mt-1 block">{formErrors.customerPhone}</span>
                        )}
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-[11px] font-bold text-stone-600 uppercase mb-1">Email Penerima (Opsional)</label>
                        <div className="relative">
                          <input
                            type="email"
                            name="customerEmail"
                            value={formData.customerEmail}
                            onChange={handleInputChange}
                            placeholder="rian@email.com"
                            className="w-full pl-8 pr-3 py-1.5 bg-white border border-stone-200 rounded-lg text-xs focus:outline-none focus:border-emerald-500 text-stone-800"
                          />
                          <Mail className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                        </div>
                      </div>

                      {/* Alamat Kirim */}
                      <div>
                        <label className="block text-[11px] font-bold text-stone-600 uppercase mb-1">Alamat Lengkap Pengiriman *</label>
                        <div className="relative">
                          <textarea
                            name="customerAddress"
                            value={formData.customerAddress}
                            onChange={handleInputChange}
                            rows={2}
                            placeholder="Tulis nama jalan, nomor rumah, RT/RW, gang, kelurahan/kecamatan, kota secara rinci..."
                            className={`w-full pl-8 pr-3 py-1.5 bg-white border rounded-lg text-xs focus:outline-none focus:border-emerald-500 text-stone-800 font-sans ${
                              formErrors.customerAddress ? "border-rose-400" : "border-stone-200"
                            }`}
                          ></textarea>
                          <MapPin className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-3" />
                        </div>
                        {formErrors.customerAddress && (
                          <span className="text-[10px] text-rose-600 mt-1 block">{formErrors.customerAddress}</span>
                        )}
                      </div>

                      {/* Metode Pengiriman */}
                      <div className="grid grid-cols-2 gap-2.5">
                        <div>
                          <label className="block text-[11px] font-bold text-stone-600 uppercase mb-1">Kurir Kirim</label>
                          <div className="relative">
                            <select
                              name="shippingMethod"
                              value={formData.shippingMethod}
                              onChange={handleInputChange}
                              className="w-full pl-2 pr-2 py-1.5 bg-white border border-stone-200 rounded-lg text-xs focus:outline-none focus:border-emerald-500 text-stone-800"
                            >
                              <option value="Kurir Lokal (Yogyakarta)">Kurir Lokal DIY (Rp15k)</option>
                              <option value="Ambil di Toko (Self-Pickup)">Ambil di Toko (Gratis)</option>
                              <option value="Ekspedisi JNE Reguler">JNE Reguler (Rp30k)</option>
                              <option value="Ekspedisi J&T Reguler">J&T Reguler (Rp30k)</option>
                            </select>
                          </div>
                        </div>

                        {/* Metode Pembayaran */}
                        <div>
                          <label className="block text-[11px] font-bold text-stone-600 uppercase mb-1">Metode Bayar</label>
                          <div className="relative">
                            <select
                              name="paymentMethod"
                              value={formData.paymentMethod}
                              onChange={handleInputChange}
                              className="w-full pl-2 pr-2 py-1.5 bg-white border border-stone-200 rounded-lg text-xs focus:outline-none focus:border-emerald-500 text-stone-800"
                            >
                              <option value="BCA Transfer">BCA Transfer</option>
                              <option value="Mandiri Transfer">Mandiri Transfer</option>
                              <option value="BRI Transfer">BRI Transfer</option>
                              <option value="Tunai / COD (Yogyakarta saja)">Tunai / COD DIY</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Catatan Tambahan */}
                      <div>
                        <label className="block text-[11px] font-bold text-stone-600 uppercase mb-1">Catatan Pesanan (Opsional)</label>
                        <textarea
                          name="notes"
                          value={formData.notes || ""}
                          onChange={handleInputChange}
                          rows={1}
                          placeholder="Contoh: Titip tetangga jika rumah kosong, kirim bubuk kasar..."
                          className="w-full px-2.5 py-1.5 bg-white border border-stone-200 rounded-lg text-xs focus:outline-none focus:border-emerald-500 text-stone-800 font-sans"
                        ></textarea>
                      </div>
                    </div>

                    {/* Submit checkout CTA */}
                    <div className="pt-4 border-t border-stone-200 mt-4 space-y-2.5">
                      <div className="flex items-center space-x-1.5 text-amber-700 bg-amber-50 p-2 rounded-lg text-[10px] leading-relaxed">
                        <AlertCircle className="w-4.5 h-4.5 flex-shrink-0" />
                        <span>Dengan menekan tombol di bawah, struk pesanan akan digaet ke WhatsApp admin untuk dikonfirmasi.</span>
                      </div>
                      
                      <button
                        id="btn-submitting-checkout"
                        type="submit"
                        className="w-full inline-flex items-center justify-center space-x-2 px-4 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-emerald-700/10 cursor-pointer"
                      >
                        <Send className="w-4 h-4" />
                        <span>Kirim Pesanan Ke WhatsApp Admin</span>
                      </button>
                    </div>
                  </form>

                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
