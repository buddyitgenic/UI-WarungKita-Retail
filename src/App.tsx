/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  Compass, 
  Store, 
  Info, 
  Phone, 
  ShieldCheck, 
  Truck, 
  MessageSquare, 
  Heart, 
  Award, 
  Clock, 
  Star, 
  Plus, 
  Eye, 
  ShoppingCart, 
  MessageCircle, 
  Search,
  CheckCircle,
  ThumbsUp,
  MapPin,
  HelpCircle,
  TrendingUp,
  SlidersHorizontal,
  ArrowRight,
  BookOpen
} from "lucide-react";

import { Product, CartItem, OrderRecord, OrderDetails } from "./types";
import { PRODUCTS, COMPANY_INFO } from "./data/products";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ProductCard from "./components/ProductCard";
import ProductDetailModal from "./components/ProductDetailModal";
import CartAndCheckout from "./components/CartAndCheckout";
import Footer from "./components/Footer";
import AdminPanel from "./components/AdminPanel";

const STARTER_ORDERS: OrderRecord[] = [
  {
    id: "ORD-93821",
    date: "26 Mei 2026, 14:30 WIB",
    details: {
      customerName: "Rian Saputra",
      customerPhone: "081234567890",
      customerEmail: "rian@email.com",
      customerAddress: "Dusun Condongcatur, Sleman, Yogyakarta",
      shippingMethod: "Kurir Lokal (Yogyakarta)",
      paymentMethod: "BCA Transfer",
      notes: "Kirim setelah jam kantor ya Kak, terima kasih!"
    },
    items: [
      { productName: "Madu Hutan Sumbawa Murni", quantity: 2, price: 120000 },
      { productName: "Kopi Gayo Specialty Arabika", quantity: 1, price: 95000 }
    ],
    subtotal: 335000,
    shippingFee: 15000,
    grandTotal: 350000,
    status: "Selesai"
  },
  {
    id: "ORD-82741",
    date: "27 Mei 2026, 09:15 WIB",
    details: {
      customerName: "Siti Rahma",
      customerPhone: "087798765432",
      customerEmail: "siti.rahma@zero-waste.id",
      customerAddress: "Kebayoran Baru, Jakarta Selatan",
      shippingMethod: "Ekspedisi J&T Reguler",
      paymentMethod: "Mandiri Transfer",
      notes: ""
    },
    items: [
      { productName: "Tas Jinjing Linen Alami", quantity: 1, price: 125000 },
      { productName: "Sabun Batang Alami Lemon & Mint", quantity: 3, price: 38000 }
    ],
    subtotal: 239000,
    shippingFee: 30000,
    grandTotal: 269000,
    status: "Diproses"
  }
];

export default function App() {
  // Navigation & UI States
  const [activeTab, setActiveTab] = useState<string>("home");
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Dynamic Products State
  const [productsList, setProductsList] = useState<Product[]>(() => {
    try {
      const savedProds = localStorage.getItem("warungkita_products");
      return savedProds ? JSON.parse(savedProds) : PRODUCTS;
    } catch {
      return PRODUCTS;
    }
  });

  // Dynamic Company Profile Config State
  const [companyConfig, setCompanyConfig] = useState<typeof COMPANY_INFO>(() => {
    try {
      const savedConfig = localStorage.getItem("warungkita_config");
      return savedConfig ? JSON.parse(savedConfig) : COMPANY_INFO;
    } catch {
      return COMPANY_INFO;
    }
  });

  // Dynamic Order Tracks State
  const [orders, setOrders] = useState<OrderRecord[]>(() => {
    try {
      const savedOrders = localStorage.getItem("warungkita_orders");
      return savedOrders ? JSON.parse(savedOrders) : STARTER_ORDERS;
    } catch {
      return STARTER_ORDERS;
    }
  });

  // Cart Management States
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const savedCart = localStorage.getItem("warungkita_cart");
      return savedCart ? JSON.parse(savedCart) : [];
    } catch {
      return [];
    }
  });

  // Catalog Filters States
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua");
  const [searchQuery, setSearchQuery] = useState<string>(" ");
  const [sortBy, setSortBy] = useState<string>("popular");

  // Synchronise Cart to LocalStorage
  useEffect(() => {
    localStorage.setItem("warungkita_cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // Sync Products, Config, & Orders to storage
  useEffect(() => {
    localStorage.setItem("warungkita_products", JSON.stringify(productsList));
  }, [productsList]);

  useEffect(() => {
    localStorage.setItem("warungkita_config", JSON.stringify(companyConfig));
  }, [companyConfig]);

  useEffect(() => {
    localStorage.setItem("warungkita_orders", JSON.stringify(orders));
  }, [orders]);

  // Clean empty searches on startup
  useEffect(() => {
    setSearchQuery("");
  }, []);

  // Filter and Sort products
  const getFilteredProducts = () => {
    let result = [...productsList];

    // Search filter
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) => 
          p.name.toLowerCase().includes(query) || 
          p.shortDescription.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (selectedCategory !== "Semua") {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Sorting block
    if (sortBy === "popular") {
      result.sort((a, b) => b.rating - a.rating); // Sort by highest rating
    } else if (sortBy === "priceAsc") {
      result.sort((a, b) => {
        const pA = a.discountPrice || a.price;
        const pB = b.discountPrice || b.price;
        return pA - pB;
      });
    } else if (sortBy === "priceDesc") {
      result.sort((a, b) => {
        const pA = a.discountPrice || a.price;
        const pB = b.discountPrice || b.price;
        return pB - pA;
      });
    }

    return result;
  };

  // Cart functions
  const handleAddToCart = (product: Product, quantity: number = 1) => {
    setCartItems((prevItems) => {
      const existing = prevItems.find((item) => item.product.id === product.id);
      if (existing) {
        // Limit max to stock limit
        const newQty = Math.min(existing.quantity + quantity, product.stock);
        return prevItems.map((item) => 
          item.product.id === product.id ? { ...item, quantity: newQty } : item
        );
      }
      return [...prevItems, { product, quantity: Math.min(quantity, product.stock) }];
    });
  };

  const handleUpdateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(productId);
      return;
    }
    setCartItems((prevItems) => {
      return prevItems.map((item) => {
        if (item.product.id === productId) {
          const maxStock = item.product.stock;
          return { ...item, quantity: Math.min(quantity, maxStock) };
        }
        return item;
      });
    });
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // Admin dynamic helper functions
  const handleAddProduct = (newProd: Product) => {
    setProductsList((prev) => [newProd, ...prev]);
  };

  const handleUpdateProduct = (updatedProd: Product) => {
    setProductsList((prev) =>
      prev.map((p) => (p.id === updatedProd.id ? updatedProd : p))
    );
  };

  const handleDeleteProduct = (productId: string) => {
    setProductsList((prev) => prev.filter((p) => p.id !== productId));
  };

  const handleUpdateOrderStatus = (orderId: string, status: OrderRecord["status"]) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
  };

  const handleOrderTriggered = (
    details: OrderDetails,
    items: { productName: string; quantity: number; price: number }[],
    subtotal: number,
    shippingFee: number,
    grandTotal: number
  ) => {
    const newRecord: OrderRecord = {
      id: "ORD-" + Math.floor(10000 + Math.random() * 90000),
      date: new Date().toLocaleString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      }) + " WIB",
      details,
      items,
      subtotal,
      shippingFee,
      grandTotal,
      status: "Diproses"
    };
    setOrders((prev) => [...prev, newRecord]);
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Quick categories
  const categories = ["Semua", "Pantry", "Home & Decor", "Eco-Lifestyle"];

  // Feedback/Reviews Section
  const clientReviews = [
    {
      name: "Andini Putri",
      role: "Pelanggan Setia Yogyakarta",
      text: "Madu Hutan Sumbawanya benar-benar mantap dan murni! Pengiriman kurir lokal Jogja cepat sekali, dikemas steril menggunakan stoppbox kardus ramah lingkungan. Pelayanan CS WhatsApp ramah dan informatif.",
      rating: 5,
    },
    {
      name: "Budi Santoso",
      role: "Home Coffee Brewer",
      text: "Kopi Arabika Gayo medium roast-nya sangat konsisten. Biji kopinya utuh tanpa cacat gosong, pas diseduh aroma buah eksotisnya keluar wangi abis. Cangkir keramik buminya juga sangat nyaman digenggam hangat.",
      rating: 5,
    },
    {
      name: "Siti Rahma",
      role: "Pegiat Zero-Waste Jakarta",
      text: "Sangat jarang ada retail modern lokal yang se-kurasi ini dalam melestarikan lingkungan. Tas jinjing rami rami-nya tebal sekali, jahitannya sangat presisi rapi. Senang bisa berbelanja produk lokal berkualitas di sini.",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-900 flex flex-col justify-between">
      
      {/* 1. Header/Navbar */}
      <Navbar
        cartCount={totalCartCount}
        onCartClick={() => setIsCartOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* 2. Main Content Wrapper */}
      <main className="flex-grow">
        
        {/* TAB: BERANDA */}
        {activeTab === "home" && (
          <div className="space-y-16 pb-16">
            {/* Hero Section */}
            <Hero 
              onGoToCatalog={() => setActiveTab("catalog")} 
              onGoToAbout={() => setActiveTab("about")} 
            />

            {/* Section: Mengapa Memilih WarungKita (Core Values) */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-3xl mx-auto space-y-3">
                <p className="text-xs font-bold text-emerald-700 uppercase tracking-widest">Estetika & Tanggung Jawab</p>
                <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900">
                  Mengapa Orang Menyukai WarungKita?
                </h3>
                <p className="text-sm text-stone-500">
                  Setiap langkah kurasi barang harian di platform kami berakar pada cinta tanah air dan penjagaan kualitas hayati bumi nusantara.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
                {companyConfig.values.map((v, i) => (
                  <div 
                    key={i} 
                    className="bg-white border border-stone-100 p-6 sm:p-8 rounded-2xl shadow-xs flex flex-col items-center text-center space-y-3.5 hover:border-emerald-100 transition-all group"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold text-lg group-hover:bg-emerald-700 group-hover:text-white transition-colors">
                      {i === 0 ? <Store className="w-6 h-6" /> : i === 1 ? <ShieldCheck className="w-6 h-6" /> : <Award className="w-6 h-6" />}
                    </div>
                    <h4 className="text-base font-bold text-stone-900 group-hover:text-emerald-800 transition-colors">
                      {v.title}
                    </h4>
                    <p className="text-xs text-stone-500 font-sans leading-relaxed">
                      {v.desc}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Section: Unggulan Kurasi (Featured items) */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row items-center justify-between border-b border-stone-200/60 pb-5 mb-8">
                <div>
                  <h3 className="text-2xl font-bold font-sans tracking-tight text-stone-900 leading-none">
                    Produk Rekomendasi Hari Ini
                  </h3>
                  <p className="text-xs text-stone-500 mt-1 font-medium">
                    Kurasi barang harian & organik terfavorit pilihan langsung dari pelanggan setia
                  </p>
                </div>
                <button
                  id="btn-goto-all-catalog"
                  onClick={() => {
                    setSelectedCategory("Semua");
                    setActiveTab("catalog");
                  }}
                  className="mt-3 sm:mt-0 text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center space-x-1 hover:underline cursor-pointer"
                >
                  <span>Lihat Semua Katalog</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Grid 4 featured items */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                {productsList.filter((p) => p.isFeatured).slice(0, 4).map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onViewDetail={setSelectedProduct}
                    onAddToCart={(p) => handleAddToCart(p, 1)}
                  />
                ))}
              </div>
            </section>

            {/* Big Promo / Highlight Banner */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-gradient-to-r from-emerald-800 to-emerald-950 text-white rounded-3xl p-6 sm:p-10 lg:p-12 relative overflow-hidden shadow-xl">
                {/* Visual detail elements */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-700/20 rounded-full filter blur-3xl opacity-50"></div>
                
                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-8 space-y-4">
                    <span className="bg-stone-100/10 text-emerald-300 font-bold text-xs px-2.5 py-1 rounded-md tracking-wider uppercase inline-block">
                      Promo Spesial Minggu Ini
                    </span>
                    <h3 className="text-2xl sm:text-3xl md:text-3xl lg:text-4xl font-sans font-bold leading-tight">
                      Dapatkan Hemat Rp15.000 untuk Madu Hutan & Lilin Aromaterapi Lavender
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-300 max-w-xl font-sans leading-relaxed">
                      Kami memotong langsung harga madu premium Sumbawa dan lilin organik wangi kedelai kami demi memberikan momen rileksasi terbaik di rumah Anda.
                    </p>
                    
                    <div className="flex items-center space-x-6 text-xs text-stone-300 pt-2 font-mono">
                      <div className="flex items-center space-x-1.5">
                        <CheckCircle className="w-4 h-4 text-emerald-300" />
                        <span>Tanpa Minimum Ambil</span>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <CheckCircle className="w-4 h-4 text-emerald-300" />
                        <span>Klaim Instan di Checkout</span>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-4 flex justify-center lg:justify-end">
                    <button
                      id="btn-claim-promo-catalog"
                      onClick={() => {
                        setSelectedCategory("Semua");
                        setActiveTab("catalog");
                      }}
                      className="inline-flex items-center justify-center space-x-2 px-6 py-3.5 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-sm rounded-xl transition-all hover:scale-105 shadow-lg shadow-amber-500/10 cursor-pointer"
                    >
                      <span>Belanja Koleksi Promo</span>
                      <ShoppingCart className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Client Reviews Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-2xl mx-auto space-y-2.5 mb-10">
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Testimoni Jujur</span>
                <h3 className="text-2xl font-bold tracking-tight text-stone-900">Kata Mereka Yang Peduli Kualitas</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {clientReviews.map((review, i) => (
                  <div key={i} className="bg-white border border-stone-100/80 p-6 rounded-2xl shadow-xs flex flex-col justify-between">
                    <div className="space-y-3">
                      {/* Bintang */}
                      <div className="flex text-amber-500">
                        {[...Array(review.rating)].map((_, idx) => (
                          <Star key={idx} className="w-3.5 h-3.5 fill-amber-500" />
                        ))}
                      </div>
                      <p className="text-xs text-stone-600 leading-relaxed font-sans italic">
                        "{review.text}"
                      </p>
                    </div>
                    
                    <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                      <div>
                        <h5 className="text-xs font-bold text-stone-900">{review.name}</h5>
                        <p className="text-[10px] text-stone-400 font-medium">{review.role}</p>
                      </div>
                      <ThumbsUp className="w-3.5 h-3.5 text-emerald-700" />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Cepat Tanya / Whatsapp Chat Widget card */}
            <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-white border border-stone-100 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
                <div className="flex items-start space-x-4">
                  <div className="w-11 h-11 bg-emerald-50 text-emerald-800 rounded-xl flex items-center justify-center flex-shrink-0">
                    <HelpCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-stone-900">Butuh Bantuan Lebih Lanjut?</h4>
                    <p className="text-xs text-stone-500 mt-0.5 leading-relaxed max-w-sm">
                      Punya pertanyaan khusus tentang ketersediaan produk partai besar, kerjasama kemitraan, atau kendala pemesanan? Hubungi admin fast-response kami.
                    </p>
                  </div>
                </div>

                <a
                  id="cta-whatsapp-general-banner"
                  href={`https://wa.me/${companyConfig.whatsappNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent("Halo Kak, saya mengunjungi website WarungKita dan ingin berkonsultasi mengenai produk.")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-5 py-2.5 bg-stone-900 hover:bg-stone-950 text-stone-100 font-bold text-xs rounded-xl shadow-sm transition-colors cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  <span>Konsultasi WA Admin</span>
                </a>
              </div>
            </section>
          </div>
        )}

        {/* TAB: KATALOG PRODUK INTERAKTIF */}
        {activeTab === "catalog" && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8" id="catalog-section">
            
            {/* Header pencarian & filter */}
            <div className="flex flex-col space-y-4">
              <div>
                <h3 className="text-3xl font-bold tracking-tight text-stone-900 font-sans leading-none">Katalog Produk Terkurasi</h3>
                <p className="text-xs text-stone-500 mt-1">
                  Pilih opsi di bawah untuk menyaring koleksi bahan pokok alam sehat & kerajinan tangan lokal.
                </p>
              </div>

              {/* Bar Filter & Cari */}
              <div className="bg-white border border-stone-100 p-4 rounded-2xl shadow-xs grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                
                {/* Search query box */}
                <div className="md:col-span-5 relative w-full">
                  <input
                    id="catalog-input-search"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Masukkan nama barang, rasa, atau kategori..."
                    className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-sans placeholder-stone-400 focus:outline-none focus:border-emerald-500 focus:bg-white text-stone-800 transition-all"
                  />
                  <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>

                {/* Categories selector */}
                <div className="md:col-span-4 flex flex-wrap gap-1">
                  {categories.map((cat) => (
                    <button
                      id={`btn-filter-cat-${cat.replace(/\s+/g, '-').toLowerCase()}`}
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        selectedCategory === cat
                          ? "bg-emerald-700 text-white"
                          : "bg-stone-100/80 hover:bg-stone-100 text-stone-600 hover:text-stone-900"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Sorter */}
                <div className="md:col-span-3 flex items-center justify-end space-x-2">
                  <SlidersHorizontal className="w-4 h-4 text-stone-400" />
                  <select
                    id="catalog-sorter-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="pl-2 pr-2 py-1.5 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-emerald-500 text-stone-700 bg-white"
                  >
                    <option value="popular">Terpopuler ⭐</option>
                    <option value="priceAsc">Harga Terendah</option>
                    <option value="priceDesc">Harga Tertinggi</option>
                  </select>
                </div>

              </div>
            </div>

            {/* List Tampilan Catalog Grid */}
            {getFilteredProducts().length === 0 ? (
              <div className="bg-white border border-stone-100 rounded-2xl p-12 text-center max-w-md mx-auto space-y-4">
                <p className="text-3xl font-mono text-stone-300">🔍</p>
                <div>
                  <h4 className="text-sm font-bold text-stone-800">Produk Tidak Ditemukan</h4>
                  <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto leading-relaxed">
                    Maaf, saringan kata kunci pencarian <span className="font-semibold text-stone-950">"{searchQuery}"</span> atau kategori yang Anda pilih tidak memiliki kecocokan produk di katalog kami.
                  </p>
                </div>
                <button
                  id="btn-reset-catalog-filter"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("Semua");
                  }}
                  className="px-3.5 py-2 border border-stone-200 text-stone-700 font-bold text-xs rounded-xl hover:bg-stone-50 cursor-pointer"
                >
                  Reset Saringan & Selesaikan Pencarian
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                {getFilteredProducts().map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onViewDetail={setSelectedProduct}
                    onAddToCart={(p) => handleAddToCart(p, 1)}
                  />
                ))}
              </div>
            )}
          </section>
        )}

        {/* TAB: TENTANG KAMI / COMPANY PROFILE */}
        {activeTab === "about" && (
          <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12" id="about-section">
            
            {/* Sejarah & Identitas */}
            <div className="space-y-4">
              <div className="inline-flex items-center space-x-2 bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full text-xs font-semibold">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Profil Resmi Perusahaan</span>
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-stone-900 font-sans leading-none">Kisah Kami & {companyConfig.name}</h2>
              <p className="text-sm text-stone-600 font-sans leading-relaxed whitespace-pre-line">
                {companyConfig.history}
              </p>
            </div>

            {/* Visual Call-Out */}
            <div className="relative aspect-[16/9] md:aspect-[21/9] rounded-2xl overflow-hidden shadow border-4 border-white bg-stone-100">
              <img
                src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=1200"
                alt="Workspace local gallery"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-stone-950/40 flex items-center justify-center p-6 text-center">
                <div className="text-stone-100 space-y-2">
                  <p className="text-lg font-bold font-serif italic text-emerald-300">"Setiap Pembelian Melestarikan Kehidupan Petani Lokal"</p>
                  <p className="text-[11px] font-medium tracking-wide">YOGYAKARTA - SLEMAN, INDONESIA</p>
                </div>
              </div>
            </div>

            {/* Nilai-Nilai filosofis */}
            <div className="space-y-4 pt-6 border-t border-stone-200/60">
              <h3 className="text-lg font-bold text-stone-900">3 Nilai Dasar Kedai Kami</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="space-y-2 bg-white p-4.5 rounded-xl border border-stone-100">
                  <span className="text-emerald-700 text-xs font-bold font-mono">01. KEADILAN BELANJA</span>
                  <p className="text-xs text-stone-500 leading-relaxed font-sans">
                    Kami menjamin pembagian persentase harga beli yang adil bagi petani kecil sehingga meningkatkan taraf hidup mereka secara mandiri.
                  </p>
                </div>
                <div className="space-y-2 bg-white p-4.5 rounded-xl border border-stone-100">
                  <span className="text-emerald-700 text-xs font-bold font-mono">02. NIKMAT YANG HIGIENIS</span>
                  <p className="text-xs text-stone-500 leading-relaxed font-sans">
                    Fokus utama kami adalah rasa pangan asli yang bebas kontaminasi pengawet sintetis sehingga aman dinikmati keluarga.
                  </p>
                </div>
                <div className="space-y-2 bg-white p-4.5 rounded-xl border border-stone-100">
                  <span className="text-emerald-700 text-xs font-bold font-mono">03. HIJAU BERLANJUT</span>
                  <p className="text-xs text-stone-500 leading-relaxed font-sans">
                    Kami mengemas kiriman luar kota dengan kertas serut daur ulang serta tape kertas bebas timbal (eco-friendly packing).
                  </p>
                </div>
              </div>
            </div>

            {/* Tim & Lokasi Kami */}
            <div className="space-y-4 pt-6 border-t border-stone-200/60">
              <h3 className="text-lg font-bold text-stone-900">Keanggotaan Mitra Kami</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div className="space-y-3">
                  <p className="text-xs text-stone-600 leading-relaxed font-sans">
                    Hingga kuartal kedua tahun ini, WarungKita resmi bermitra dengan lebih dari <span className="font-bold text-stone-900">12 kelompok usaha mikro desa</span>, 8 kelompok wanita tani mandiri, serta 5 studio seni kriya tanah liat tradisional di pulau Jawa dan Nusa Tenggara.
                  </p>
                  <p className="text-xs text-stone-600 leading-relaxed font-sans">
                    Kami terus mencari kemitraan sehat baru. Hubungi tim kemitraan kami jika Anda memiliki ketahanan pertanian pangan bersih yang ingin didistribusikan.
                  </p>
                </div>

                {/* Info Box */}
                <div className="bg-emerald-50/50 border border-emerald-100 p-6 rounded-2xl space-y-3 text-stone-800">
                  <div className="flex items-center space-x-2 text-emerald-800">
                    <MapPin className="w-5 h-5 flex-shrink-0" />
                    <span className="text-sm font-bold">Kunjungi Office & Hub Kami</span>
                  </div>
                  <p className="text-xs font-medium font-sans leading-relaxed">
                    {companyConfig.address}
                  </p>
                  <div className="text-[11px] text-stone-500">
                    <p className="font-bold text-stone-700">Jam Layanan Tamu:</p>
                    <p>Senin-Jumat, 10:00 - 16:00 WIB (Mohon janji temu terlebih dahulu melalui Whatsapp)</p>
                  </div>
                </div>
              </div>
            </div>

          </section>
        )}

        {/* TAB: ADMIN PANEL CONTROL */}
        {activeTab === "admin" && (
          <AdminPanel
            products={productsList}
            onAddProduct={handleAddProduct}
            onUpdateProduct={handleUpdateProduct}
            onDeleteProduct={handleDeleteProduct}
            orders={orders}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            companyConfig={companyConfig}
            onUpdateCompanyConfig={setCompanyConfig}
          />
        )}

      </main>

      {/* 3. Footer */}
      <Footer companyConfig={companyConfig} />

      {/* 4. MODAL DETAIL PRODUK */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
      />

      {/* 5. DRAWER / SLIDE OVER KERANJANG BELANJA & CHECKOUT */}
      <CartAndCheckout
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        onOrderTriggered={handleOrderTriggered}
        companyConfig={companyConfig}
      />

    </div>
  );
}
