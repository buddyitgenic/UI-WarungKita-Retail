/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Store, Instagram, Mail, Phone, MapPin, Clock, Heart, Award } from "lucide-react";
import { COMPANY_INFO } from "../data/products";

interface FooterProps {
  companyConfig?: typeof COMPANY_INFO;
}

export default function Footer({ companyConfig = COMPANY_INFO }: FooterProps) {
  return (
    <footer id="app-footer" className="bg-stone-900 text-stone-300 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          
          {/* Kolom 1: Profil Ringkas */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-emerald-600 text-white flex items-center justify-center rounded-lg font-bold">
                WK
              </div>
              <div>
                <h4 className="text-white text-sm font-semibold tracking-wider uppercase">{companyConfig.name}</h4>
                <p className="text-[10px] text-emerald-400 font-bold leading-none tracking-wider">MODERN RETAIL</p>
              </div>
            </div>
            
            <p className="text-xs text-stone-400 font-sans leading-relaxed max-w-sm">
              {companyConfig.tagline}. Menyajikan makanan sehat organik dan artisan homeware lokal yang ramah lingkungan langsung dari perajin Indonesia.
            </p>

            <div className="flex items-center space-x-1 text-stone-500 text-[11px] pt-1">
              <Award className="w-3.5 h-3.5 text-emerald-600" />
              <span>Pemenang Penghargaan Retail Lokal Berkelanjutan DIY - 2024</span>
            </div>
          </div>

          {/* Kolom 2: Jam Operasional & Kontak */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="text-white text-xs font-bold uppercase tracking-widest border-b border-stone-800 pb-2">
              Jam Operasional & Kontak
            </h4>
            
            <ul className="space-y-2.5 text-xs text-stone-400 font-sans">
              <li className="flex items-start space-x-2.5">
                <Clock className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-stone-300">Senin - Sabtu (Hari Kerja)</p>
                  <p className="text-[11px]">Pukul 09:00 - 18:00 WIB (Minggu Libur)</p>
                </div>
              </li>
              
              <li className="flex items-center space-x-2.5">
                <Phone className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span className="text-stone-300 transition-colors hover:text-white">
                  {companyConfig.phone} (WhatsApp/Call)
                </span>
              </li>

              <li className="flex items-center space-x-2.5">
                <Mail className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span className="text-stone-300 transition-colors hover:text-white">
                  {companyConfig.email}
                </span>
              </li>
            </ul>
          </div>

          {/* Kolom 3: Alamat Toko */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-white text-xs font-bold uppercase tracking-widest border-b border-stone-800 pb-2">
              Alamat Kedai
            </h4>
            
            <div className="space-y-3">
              <p className="text-xs text-stone-400 font-sans leading-relaxed flex items-start space-x-2">
                <MapPin className="w-4.5 h-4.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span>{companyConfig.address}</span>
              </p>

              {/* Tautan Media Sosial */}
              <div className="flex items-center space-x-3 pt-1">
                <a 
                  href={`https://instagram.com/${companyConfig.socials.instagram.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 bg-stone-800 hover:bg-emerald-700 text-stone-300 hover:text-white rounded-lg transition-colors cursor-pointer"
                  title="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <span className="text-xs text-stone-500 font-medium">
                  {companyConfig.socials.instagram}
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Hak cipta & Tambahan Informasi */}
        <div className="mt-12 pt-6 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-500">
          <p>© {new Date().getFullYear()} {companyConfig.name}. Hak Cipta Dilindungi Undang-Undang.</p>
          <p className="flex items-center mt-2 sm:mt-0">
            Dibuat dengan <Heart className="w-3 h-3 text-red-500 mx-1 fill-red-500" /> untuk Mendukung Kemajuan Produk Lokal Indonesia
          </p>
        </div>
      </div>
    </footer>
  );
}
