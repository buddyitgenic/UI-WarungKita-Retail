/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { ArrowRight, Sparkles, CheckCircle, Award, Leaf } from "lucide-react";
import { COMPANY_INFO } from "../data/products";

interface HeroProps {
  onGoToCatalog: () => void;
  onGoToAbout: () => void;
}

export default function Hero({ onGoToCatalog, onGoToAbout }: HeroProps) {
  return (
    <section id="hero-section" className="relative bg-gradient-to-br from-stone-50 via-emerald-50/20 to-stone-50 border-b border-stone-100 overflow-hidden py-12 md:py-20 lg:py-24">
      {/* Background blobs for premium depth */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-emerald-100/30 rounded-full filter blur-3xl opacity-60"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-100/20 rounded-full filter blur-3xl opacity-60"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Sisi Kiri: Teks Promosi */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center space-x-2 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full text-emerald-800 text-xs font-semibold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>100% Organik & Hasil Karya Artisan Nusantara</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-sans font-bold text-stone-900 tracking-tight leading-tight">
              Gaya Hidup Alami, <br className="hidden sm:inline" />
              <span className="text-emerald-700 bg-gradient-to-r from-emerald-800 to-emerald-600 bg-clip-text text-transparent">
                Cintai Produk Bumi Sendiri
              </span>
            </h2>

            <p className="text-sm sm:text-base text-stone-600 font-sans max-w-xl mx-auto lg:mx-0 leading-relaxed">
              {COMPANY_INFO.shortDesc} Nikmati kemudahan memesan kebutuhan sehat secara terintegrasi dan aman langsung terhubung dengan Whatsapp tim pelayanan kami.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                id="hero-cta-catalog"
                onClick={onGoToCatalog}
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-sm rounded-xl transition-all shadow-md shadow-emerald-700/10 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer"
              >
                <span>Jelajahi Katalog Toko</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="hero-cta-about"
                onClick={onGoToAbout}
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3 bg-white border border-stone-200 hover:bg-stone-50 text-stone-800 font-medium text-sm rounded-xl transition-all hover:border-stone-400 cursor-pointer"
              >
                <span>Tentang WarungKita</span>
              </button>
            </div>

            {/* Keuntungan Cepat */}
            <div className="grid grid-cols-3 gap-3 pt-6 border-t border-stone-100 max-w-lg mx-auto lg:mx-0">
              <div className="text-center lg:text-left">
                <p className="text-xl sm:text-2xl font-bold text-emerald-800 font-mono">150+</p>
                <p className="text-[10px] text-stone-400 font-semibold tracking-wider uppercase">Petani & Pengrajin</p>
              </div>
              <div className="text-center lg:text-left">
                <p className="text-xl sm:text-2xl font-bold text-emerald-800 font-mono">3,000+</p>
                <p className="text-[10px] text-stone-400 font-semibold tracking-wider uppercase">Kiriman Sukses</p>
              </div>
              <div className="text-center lg:text-left">
                <p className="text-xl sm:text-2xl font-bold text-emerald-800 font-mono">100%</p>
                <p className="text-[10px] text-stone-400 font-semibold tracking-wider uppercase">Bahan Alami</p>
              </div>
            </div>
          </div>

          {/* Sisi Kanan: Kolase Gambar Visual Menarik */}
          <div className="lg:col-span-5 relative mt-6 lg:mt-0 flex justify-center">
            <div className="relative w-full max-w-[360px] sm:max-w-[420px] aspect-[4/5] sm:aspect-square">
              
              {/* Floating Badge Eco */}
              <div className="absolute top-4 -left-6 z-20 bg-white/95 backdrop-blur-sm p-3 rounded-xl border border-stone-100 flex items-center space-x-2 shadow-md animate-bounce">
                <div className="bg-emerald-50 p-1.5 rounded-lg text-emerald-700">
                  <Leaf className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] text-stone-400 leading-none">Kemasan Hijau</p>
                  <p className="text-xs font-bold text-stone-800">Biodegradable</p>
                </div>
              </div>

              {/* Floating Badge Kualitas */}
              <div className="absolute bottom-6 -right-6 z-20 bg-white/95 backdrop-blur-sm p-3 rounded-xl border border-stone-100 flex items-center space-x-2 shadow-md">
                <div className="bg-amber-50 p-1.5 rounded-lg text-amber-600">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] text-stone-400 leading-none">Garansi Rasa</p>
                  <p className="text-xs font-bold text-stone-800">Spesialis Lokal</p>
                </div>
              </div>

              {/* Central Premium Image Showcase */}
              <div className="w-full h-full rounded-2xl overflow-hidden border-4 border-white shadow-xl bg-stone-100 relative group">
                <img
                  src="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=800"
                  alt="Curated local goods show"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                
                {/* Gradient banner */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent flex items-end p-6">
                  <div className="text-white">
                    <p className="text-[10px] text-emerald-300 font-semibold tracking-wider uppercase">Kurasi Pilihan</p>
                    <h3 className="text-lg font-bold">Kopi Gayo & Teh Bunga Telang</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
