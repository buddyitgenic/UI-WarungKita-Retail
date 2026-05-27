/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Star, Plus, Eye, ShoppingCart } from "lucide-react";
import { Product } from "../types";

interface ProductCardProps {
  product: Product;
  onViewDetail: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  key?: React.Key;
}

export default function ProductCard({
  product,
  onViewDetail,
  onAddToCart,
}: ProductCardProps) {
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

  return (
    <div 
      id={`product-card-${product.id}`}
      className="group relative bg-white border border-stone-100 rounded-2xl overflow-hidden hover:border-emerald-200 hover:shadow-lg transition-all duration-300 flex flex-col h-full"
    >
      {/* Gambar Thumbnail */}
      <div className="relative aspect-square overflow-hidden bg-stone-50">
        <img
          src={product.gallery[0]}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />

        {/* Badge Diskon */}
        {hasDiscount && (
          <span className="absolute top-3 left-3 bg-red-500 text-white font-mono text-[10px] sm:text-xs font-bold px-2 py-1 rounded-lg shadow-sm z-10 animate-pulse">
            Promo {Math.round(((product.price - product.discountPrice!) / product.price) * 100)}%
          </span>
        )}

        {/* Badge Category */}
        <span className="absolute top-3 right-3 bg-stone-900/70 backdrop-blur-sm text-stone-100 font-medium text-[9px] sm:text-[10px] tracking-wide px-2 py-0.5 rounded-md z-10">
          {product.category}
        </span>

        {/* Overlay Hover Actions */}
        <div className="absolute inset-0 bg-stone-900/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-2.5 z-15">
          <button
            id={`btn-quick-view-${product.id}`}
            onClick={() => onViewDetail(product)}
            className="p-2.5 bg-white text-stone-900 hover:bg-emerald-50 hover:text-emerald-800 rounded-xl transition-all shadow-md cursor-pointer"
            title="Lihat Detail"
          >
            <Eye className="w-4.5 h-4.5" />
          </button>
          
          {product.stock > 0 && (
            <button
              id={`btn-add-quick-${product.id}`}
              onClick={() => onAddToCart(product)}
              className="p-2.5 bg-emerald-700 text-white hover:bg-emerald-800 rounded-xl transition-all shadow-md cursor-pointer"
              title="Tambah ke Keranjang"
            >
              <ShoppingCart className="w-4.5 h-4.5" />
            </button>
          )}
        </div>
      </div>

      {/* Informasi Produk */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Rating */}
        <div className="flex items-center space-x-1 mb-1.5">
          <div className="flex items-center text-amber-500">
            <Star className="w-3.5 h-3.5 fill-amber-500" />
          </div>
          <span className="text-xs font-bold text-stone-700">{product.rating}</span>
          <span className="text-[10px] text-stone-400">({product.reviewsCount})</span>
        </div>

        {/* Nama Produk */}
        <h3 
          onClick={() => onViewDetail(product)}
          className="text-sm font-semibold text-stone-900 leading-snug tracking-tight mb-1 group-hover:text-emerald-700 cursor-pointer line-clamp-2"
        >
          {product.name}
        </h3>

        {/* Deskripsi Singkat */}
        <p className="text-xs text-stone-500 line-clamp-2 mb-3 font-sans">
          {product.shortDescription}
        </p>

        {/* Bagian Bawah: Harga & Tombol Beli */}
        <div className="mt-auto pt-3 border-t border-stone-100 flex items-end justify-between">
          <div className="flex flex-col">
            {hasDiscount && (
              <span className="text-[10px] text-stone-400 line-through leading-tight">
                {formatPrice(product.price)}
              </span>
            )}
            <span className="text-sm font-bold text-stone-900 leading-none">
              {formatPrice(currentPrice)}
            </span>
          </div>

          <div>
            {product.stock <= 0 ? (
              <span className="text-[10px] text-rose-600 bg-rose-50 font-bold px-2 py-1 rounded-lg">
                Habis Toko
              </span>
            ) : product.stock < 15 ? (
              <button
                id={`btn-card-add-${product.id}`}
                onClick={() => onAddToCart(product)}
                className="inline-flex items-center justify-center space-x-1 px-2.5 py-1.5 bg-emerald-700/10 hover:bg-emerald-700 hover:text-white text-emerald-800 text-[11px] font-semibold rounded-lg transition-all cursor-pointer"
              >
                <span>Sisa {product.stock}</span>
                <Plus className="w-3 h-3 text-current" />
              </button>
            ) : (
              <button
                id={`btn-card-add-std-${product.id}`}
                onClick={() => onAddToCart(product)}
                className="inline-flex items-center justify-center bg-emerald-50 hover:bg-emerald-700 text-emerald-800 hover:text-white p-2 rounded-lg transition-all cursor-pointer"
                title="Beli sekarang"
              >
                <Plus className="w-4 h-4 text-current" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
