/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { ShoppingBag, Search, Compass, Info, Store, LayoutDashboard } from "lucide-react";
import { COMPANY_INFO } from "../data/products";

interface NavbarProps {
  cartCount: number;
  onCartClick: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function Navbar({
  cartCount,
  onCartClick,
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
}: NavbarProps) {
  return (
    <header id="app-header" className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Brand */}
          <div 
            id="brand-logo"
            onClick={() => setActiveTab("home")}
            className="flex items-center space-x-2 cursor-pointer"
          >
            <div className="w-9 h-9 bg-emerald-700 text-stone-100 flex items-center justify-center rounded-xl font-bold text-lg hover:bg-emerald-800 transition-colors">
              WK
            </div>
            <div>
              <h1 className="text-sm font-semibold text-stone-900 tracking-tight leading-none sm:text-base">
                WarungKita
              </h1>
              <p className="text-[10px] text-emerald-700 font-medium tracking-wide">
                MODERN RETAIL
              </p>
            </div>
          </div>

          {/* Navigasi Desktop */}
          <nav id="desktop-nav" className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {[
              { id: "home", label: "Beranda", icon: Store },
              { id: "catalog", label: "Katalog Produk", icon: Compass },
              { id: "about", label: "Tentang Kami", icon: Info },
              { id: "admin", label: "Admin Office", icon: LayoutDashboard },
            ].map((tab) => {
              const IconComp = tab.icon;
              const isActive = activeTab === tab.id;
              const isAdminTab = tab.id === "admin";
              return (
                <button
                  id={`nav-tab-${tab.id}`}
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? isAdminTab 
                        ? "bg-stone-900 text-stone-50" 
                        : "bg-emerald-50 text-emerald-800"
                      : "text-stone-600 hover:text-stone-900 hover:bg-stone-50"
                  }`}
                >
                  <IconComp className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Kolom Pencarian & Keranjang Belanja */}
          <div id="nav-actions" className="flex items-center space-x-3 w-full md:w-auto max-w-xs md:max-w-none justify-end">
            <div className="relative hidden sm:block w-48 lg:w-64">
              <input
                id="navbar-search"
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (activeTab !== "catalog") setActiveTab("catalog");
                }}
                placeholder="Cari produk terkurasi..."
                className="w-full pl-8 pr-3 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-xs font-sans placeholder-stone-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all text-stone-800"
              />
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            </div>

            {/* Tombol Keranjang Belanja */}
            <button
              id="navbar-cart-btn"
              onClick={onCartClick}
              className="relative p-2 text-stone-700 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-all"
              aria-label="Keranjang belanja font-sans"
            >
              <ShoppingBag className="w-5.5 h-5.5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-emerald-600 text-white font-mono text-[9px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center animate-bounce shadow-sm">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Navigasi Mobile (Bawah) */}
      <div id="mobile-nav" className="md:hidden border-t border-stone-100 bg-white">
        <div className="flex justify-around items-center h-12 px-2">
          {[
            { id: "home", label: "Beranda", icon: Store },
            { id: "catalog", label: "Katalog", icon: Compass },
            { id: "about", label: "Tentang Kami", icon: Info },
            { id: "admin", label: "Admin", icon: LayoutDashboard },
          ].map((tab) => {
            const IconComp = tab.icon;
            const isActive = activeTab === tab.id;
            const isAdminTab = tab.id === "admin";
            return (
              <button
                id={`mobile-nav-tab-${tab.id}`}
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center justify-center w-full h-full py-1 text-[10px] font-medium transition-colors ${
                  isActive 
                    ? isAdminTab 
                      ? "text-stone-950 font-bold" 
                      : "text-emerald-700 font-semibold" 
                    : "text-stone-500 hover:text-stone-800"
                }`}
              >
                <IconComp className="w-4.5 h-4.5 mb-0.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
