/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { X, Star, ShoppingCart, MessageCircle, ChevronLeft, ChevronRight, CheckCircle2, ShieldCheck, Truck } from "lucide-react";
import { Product } from "../types";
import { COMPANY_INFO } from "../data/products";

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
}

export default function ProductDetailModal({
  product,
  onClose,
  onAddToCart,
}: ProductDetailModalProps) {
  if (!product) return null;

  // State for active image within the product gallery
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedMessage, setAddedMessage] = useState(false);

  // Reset indices and values whenever a different product is opened
  useEffect(() => {
    setActiveImgIndex(0);
    setQuantity(1);
    setAddedMessage(false);
  }, [product]);

  // Handle escape key to close a modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const currentPrice = hasDiscount ? product.discountPrice! : product.price;

  // Format IDR Price
  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  // WhatsApp CTA message generation for individual product
  const getWhatsAppLink = () => {
    const cleanNumber = COMPANY_INFO.whatsappNumber.replace(/[^0-9]/g, "");
    const initialText = `Halo WarungKita! Saya tertarik dengan produk berikut:\n\n*${product.name}*\nKategori: ${product.category}\nHarga: ${formatPrice(currentPrice)}\nJumlah Minat: ${quantity} unit\n\nApakah stok masih tersedia? Terima kasih!`;
    return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(initialText)}`;
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity((q) => q - 1);
    }
  };

  const handleIncrease = () => {
    if (quantity < product.stock) {
      setQuantity((q) => q + 1);
    }
  };

  const submitAddToCart = () => {
    onAddToCart(product, quantity);
    setAddedMessage(true);
    setTimeout(() => setAddedMessage(false), 2500);
  };

  return (
    <div 
      id="product-detail-backdrop"
      className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/40 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 md:p-6"
    >
      {/* Outer Click Capturer */}
      <div className="absolute inset-0" onClick={onClose}></div>

      {/* Main Card Container */}
      <div 
        id="detail-modal-card"
        className="relative bg-white rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[92vh] md:max-h-[85vh] animate-in fade-in-50 zoom-in-95 duration-200"
      >
        {/* Close button */}
        <button
          id="close-detail-modal"
          onClick={onClose}
          className="absolute top-4 right-4 z-30 p-2 bg-white/90 hover:bg-white text-stone-700 hover:text-stone-950 rounded-full border border-stone-100 shadow-md transition-all cursor-pointer"
          aria-label="Tutup detail modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* KOLOM KIRI: Galeri Gambar Interaktif */}
        <div id="modal-gallery-column" className="w-full md:w-1/2 p-4 sm:p-6 flex flex-col justify-between bg-stone-50 border-r border-stone-100">
          <div className="space-y-4">
            {/* Visual Preview Besar */}
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-white shadow-sm border border-stone-100 flex items-center justify-center group/viewer">
              <img
                src={product.gallery[activeImgIndex]}
                alt={`${product.name} view ${activeImgIndex + 1}`}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              
              {/* Steppers over image */}
              <div className="absolute inset-x-3 bottom-3 flex justify-between opacity-0 group-hover/viewer:opacity-100 transition-opacity duration-300">
                <button
                  id="btn-gallery-prev"
                  onClick={() => setActiveImgIndex((prev) => (prev > 0 ? prev - 1 : product.gallery.length - 1))}
                  className="p-1.5 bg-white/90 hover:bg-white text-stone-800 rounded-lg shadow cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  id="btn-gallery-next"
                  onClick={() => setActiveImgIndex((prev) => (prev < product.gallery.length - 1 ? prev + 1 : 0))}
                  className="p-1.5 bg-white/90 hover:bg-white text-stone-800 rounded-lg shadow cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Thumbnail Gallery (Carousel) */}
            <div className="flex gap-2.5 overflow-x-auto pb-1">
              {product.gallery.map((img, idx) => (
                <button
                  id={`btn-thumbnail-${idx}`}
                  key={idx}
                  onClick={() => setActiveImgIndex(idx)}
                  className={`relative w-18 h-18 rounded-xl overflow-hidden border-2 bg-white flex-shrink-0 transition-all ${
                    idx === activeImgIndex
                      ? "border-emerald-600 shadow-sm"
                      : "border-stone-200 hover:border-stone-400"
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} icon ${idx}`}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Quick value tags */}
          <div className="hidden md:grid grid-cols-2 gap-3 mt-6 pt-4 border-t border-stone-200/50">
            <div className="flex items-center space-x-2 text-stone-600">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span className="text-[11px] font-sans font-medium">Lolos Kurasi ketat</span>
            </div>
            <div className="flex items-center space-x-2 text-stone-600">
              <Truck className="w-5 h-5 text-emerald-600" />
              <span className="text-[11px] font-sans font-medium">Bisa COD / Kirim Ekspedisi</span>
            </div>
          </div>
        </div>

        {/* KOLOM KANAN: Deskripsi Produk & Fitur */}
        <div id="modal-info-column" className="w-full md:w-1/2 p-4 sm:p-6 flex flex-col justify-between overflow-y-auto h-[50vh] md:h-auto">
          <div className="space-y-4">
            {/* Kategori & Stock */}
            <div className="flex items-center justify-between">
              <span className="bg-emerald-50 text-emerald-800 font-semibold text-xs px-2.5 py-1 rounded-full">
                {product.category}
              </span>
              <span className="text-xs font-medium text-stone-500">
                Status Stok:{" "}
                {product.stock > 0 ? (
                  <span className="text-emerald-700 font-bold">{product.stock} Tersedia</span>
                ) : (
                  <span className="text-rose-600 font-bold">Habis</span>
                )}
              </span>
            </div>

            {/* Judul & Rating */}
            <div>
              <h2 className="text-lg sm:text-2xl font-bold text-stone-900 tracking-tight leading-snug">
                {product.name}
              </h2>
              
              <div className="flex items-center space-x-2 mt-1.5">
                <div className="flex items-center text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating)
                          ? "fill-amber-500"
                          : "text-stone-200"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-bold text-stone-800">{product.rating}</span>
                <span className="text-xs text-stone-400">({product.reviewsCount} Ulasan Terverifikasi)</span>
              </div>
            </div>

            {/* Blok Harga */}
            <div className="bg-stone-50 p-3 sm:p-4 rounded-xl border border-stone-100 flex items-center justify-between">
              <div>
                <p className="text-[10px] text-stone-400 font-semibold uppercase tracking-wider">Harga Terbaik</p>
                <div className="flex items-center space-x-2">
                  <span className="text-xl sm:text-2xl font-bold text-stone-900">
                    {formatPrice(currentPrice)}
                  </span>
                  {hasDiscount && (
                    <span className="text-xs text-stone-400 line-through">
                      {formatPrice(product.price)}
                    </span>
                  )}
                </div>
              </div>
              {hasDiscount && (
                <span className="bg-red-50 text-red-700 font-bold text-xs px-2.5 py-1 rounded-lg">
                  Hemat {formatPrice(product.price - product.discountPrice!)}
                </span>
              )}
            </div>

            {/* Tab Deskripsi */}
            <div>
              <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-1.5">Deskripsi Produk</h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-sans whitespace-pre-line">
                {product.description}
              </p>
            </div>

            {/* Spesifikasi / Spek Teknis */}
            <div>
              <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">Spesifikasi Detail</h3>
              <div className="border border-stone-100 rounded-xl overflow-hidden text-xs">
                {product.specs.map((item, index) => (
                  <div
                    key={index}
                    className={`grid grid-cols-12 p-2 px-3 border-b border-stone-50 last:border-none ${
                      index % 2 === 0 ? "bg-stone-50/50" : "bg-white"
                    }`}
                  >
                    <span className="col-span-5 font-semibold text-stone-500">{item.label}</span>
                    <span className="col-span-7 font-sans font-medium text-stone-800">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bagian Bawah Form Pembelian (Stepper, Cart, & Whatsapp) */}
          <div className="pt-5 border-t border-stone-100 mt-6 space-y-3">
            {product.stock > 0 ? (
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                {/* Stepper Jumlah */}
                <div className="flex items-center justify-between sm:justify-start border border-stone-200 rounded-xl px-2.5 py-1 bg-white sm:h-12 h-10">
                  <span className="text-xs text-stone-400 mr-4 font-semibold hidden sm:inline">Jumlah:</span>
                  <div className="flex items-center space-x-3.5">
                    <button
                      id="btn-stepper-dec"
                      onClick={handleDecrease}
                      disabled={quantity <= 1}
                      className="w-7 h-7 bg-stone-100 hover:bg-stone-200 text-stone-800 disabled:opacity-40 rounded-lg flex items-center justify-center font-bold font-mono transition-colors cursor-pointer"
                    >
                      -
                    </button>
                    <span className="text-sm font-bold text-stone-900 font-mono w-5 text-center">{quantity}</span>
                    <button
                      id="btn-stepper-inc"
                      onClick={handleIncrease}
                      disabled={quantity >= product.stock}
                      className="w-7 h-7 bg-stone-100 hover:bg-stone-200 text-stone-800 disabled:opacity-40 rounded-lg flex items-center justify-center font-bold font-mono transition-colors cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Tambah ke Keranjang */}
                <button
                  id="btn-modal-add-to-cart"
                  onClick={submitAddToCart}
                  className="flex-1 inline-flex items-center justify-center space-x-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-sm rounded-xl transition-all shadow-md shadow-emerald-700/10 h-10 sm:h-12 cursor-pointer"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Tambah ke Keranjang ({formatPrice(currentPrice * quantity)})</span>
                </button>
              </div>
            ) : (
              <div className="bg-rose-50 text-rose-700 text-xs font-bold p-3 text-center rounded-xl border border-rose-100">
                Maaf, stok barang saat ini sedang kosong penuh di gudang. Hubungi admin untuk masa restock kembali.
              </div>
            )}

            {/* CTA Chat directly to WhatsApp */}
            <a
              id="cta-whatsapp-link"
              href={getWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center space-x-2 px-4 py-3 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs sm:text-sm rounded-xl transition-all hover:shadow-md cursor-pointer text-center"
            >
              <MessageCircle className="w-4.5 h-4.5 font-bold" />
              <span>Tanya / Order Langsung via WhatsApp Admin</span>
            </a>

            {/* Added confirmation toast alert */}
            {addedMessage && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-3 py-2 rounded-xl text-center font-medium animate-bounce">
                ✔️ {quantity} unit {product.name} dimasukkan dalam keranjang belanja!
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
