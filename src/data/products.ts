/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product } from "../types";

export const COMPANY_INFO = {
  name: "WarungKita Modern Retail",
  tagline: "Kurasi Produk Lokal Berkualitas untuk Gaya Hidup Modern & Berkelanjutan",
  shortDesc: "WarungKita adalah sebuah modern concept store yang mengkurasi produk pangan organik unggulan, kerajinan tangan artisan lokal, serta barang kebutuhan harian ramah lingkungan untuk gaya hidup sehat Anda.",
  history: "Didirikan pada tahun 2021 di jantung kota Yogyakarta, WarungKita lahir dari sebuah mimpi sederhana: mendekatkan produk terbaik dari petani, perajin, dan komunitas lokal ke genggaman masyarakat urban. Kami percaya bahwa setiap produk memiliki cerita, dan setiap pembelian adalah bentuk dukungan nyata untuk roda ekonomi lokal. Kini kami bangga melayani ribuan pelanggan yang peduli akan kualitas dan kesinambungan hayati.",
  values: [
    {
      title: "100% Produk Lokal",
      desc: "Kami bermitra langsung dengan petani, koperasi desa, dan perajin lokal Indonesia tanpa perantara berlebihan."
    },
    {
      title: "Kualitas Terkurasi",
      desc: "Setiap produk melalui uji kelayakan rasa, keamanan konsumsi, estetika tinggi, dan kemasan higienis sebelum didistribusikan."
    },
    {
      title: "Ramah Lingkungan",
      desc: "Berusaha meminimalkan jejak karbon dengan kemasan biodegradable/reusable dan menolak plastik sekali pakai."
    }
  ],
  whatsappNumber: "6281234567890", // Example Indonesian number
  whatsappMessageTemplate: "Halo WarungKita! Saya ingin memesan produk-produk berikut dari katalog website:\n\n",
  address: "Jl. Kaliurang Km. 5, No. 42, Sleman, Daerah Istimewa Yogyakarta 55281",
  email: "halo@warungkita.id",
  phone: "+62 812-3456-7890",
  socials: {
    instagram: "@warungkita.retail",
    tokopedia: "warungkita-official",
    shopee: "warungkita.id"
  }
};

export const PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "Madu Hutan Sumbawa Murni",
    category: "Pantry",
    price: 135000,
    discountPrice: 120000,
    shortDescription: "Madu liar murni yang dipanen dari pohon sialang di pedalaman hutan Sumbawa. Manis alami dan kaya antioksidan.",
    description: "Madu Hutan Sumbawa kami dipanen secara lestari oleh pemburu madu tradisional langsung dari sarang lebah Apis dorsata liar di pedalaman hutan Sumbawa. Proses ekstraksi dingin (cold process) yang higienis menjamin seluruh enzim alami, propolis, dan royal jelly tetap terjaga utuh. Tanpa tambahan air, saringan mikro, atau gula tambahan.\n\nSangat baik dikonsumsi setiap pagi untuk menjaga ketahanan tubuh, meredakan peradangan tenggorokan, atau sebagai pengganti pemanis alami masakan dan minuman Anda.",
    gallery: [
      "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1471253733331-98953bc86ec7?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1587049352851-8d4e89134292?auto=format&fit=crop&q=80&w=800"
    ],
    specs: [
      { label: "Volume", value: "350 ml" },
      { label: "Kemasan", value: "Botol Kaca Premium" },
      { label: "Asal Daerah", value: "Sumbawa Besar, NTB" },
      { label: "Komposisi", value: "100% Madu Liar Murni" }
    ],
    rating: 4.9,
    reviewsCount: 142,
    stock: 25,
    isFeatured: true
  },
  {
    id: "p2",
    name: "Kopi Gayo Specialty Arabika",
    category: "Pantry",
    price: 95000,
    shortDescription: "Biji kopi Arabika Gayo proses basah (wet-hulled) kelas satu dengan profil rasa cokelat hitam, rempah mewah, dan keasaman sedang.",
    description: "Nikmati kehangatan dan keharuman Kopi Arabika Gayo Specialty yang tumbuh subur di ketinggian 1.400 mdpl di Tanah Gayo, Aceh. Dipanen hanya buah merah matang sempurna, diproses secara tradisional basah (semi-washed/wet-hulled) yang menjadi ciri khas kopi Nusantara, lalu disangrai dengan tingkat kematangan medium roast oleh roaster lokal ahli.\n\nMemiliki bodi tebal, keasaman buah segar yang seimbang, serta sentuhan akhir berupa cokelat hitam murni yang manis dan aroma rempah-rempah yang menenangkan.",
    gallery: [
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-151097252790b-af4f42d914a9?auto=format&fit=crop&q=80&w=800"
    ],
    specs: [
      { label: "Berat Bersih", value: "250 gram" },
      { label: "Bentuk produk", value: "Biji Utuh / Bubuk Halus / Bubuk Kasar (bisa request)" },
      { label: "Ketinggian", value: "1.400 mdpl" },
      { label: "Roast Level", value: "Medium Roast" }
    ],
    rating: 4.8,
    reviewsCount: 88,
    stock: 40,
    isFeatured: true
  },
  {
    id: "p3",
    name: "Cangkir Keramik Bumi",
    category: "Home & Decor",
    price: 110000,
    shortDescription: "Cangkir minum hangat bertekstur tanah liat alami yang dibentuk manual dengan roda putar oleh pengrajin lokal Bantul.",
    description: "Ciptakan momen minum kopi atau teh yang lebih khidmat dengan Cangkir Keramik Bumi. Setiap cangkir dikerjakan secara individual menggunakan teknik slab dan putar oleh studio keramik independen di Bantul, Yogyakarta. Bagian luar dibiarkan semi-matte memancarkan kehangatan tekstur tanah liat asli, sedangkan bagian dalam dilapisi glasir tahan panas berwarna off-white.\n\nKarena dikerjakan sepenuhnya dengan tangan, setiap unit memiliki keunikan gradasi warna dan goresan jari artistik yang menjadikannya tidak ada duanya.",
    gallery: [
      "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1565192647048-f997ded87958?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1534353436294-0dbd4bdac845?auto=format&fit=crop&q=80&w=800"
    ],
    specs: [
      { label: "Kapasitas", value: "250 ml" },
      { label: "Dimensi", value: "Diameter 8 cm, Tinggi 9 cm" },
      { label: "Material", value: "Stoneware Clay & Food-safe Glaze" },
      { label: "Ketahanan", value: "Aman untuk Microwave & Dishwasher" }
    ],
    rating: 5.0,
    reviewsCount: 56,
    stock: 12,
    isFeatured: true
  },
  {
    id: "p4",
    name: "Lilin Aromaterapi Lavender & Cedar",
    category: "Home & Decor",
    price: 85000,
    discountPrice: 75000,
    shortDescription: "Lilin kedelai alami dengan sumbu kayu organik yang mengeluarkan aroma lavender rileks dan kesegaran kayu cedar.",
    description: "Lahirkan suasana spa premium di kamar tidur Anda dengan Lilin Aromaterapi Lavender & Cedarwood kami. Dibuat menggunakan 100% natural soy wax (lilin kedelai) bebas toksin sehingga menghasilkan pembakaran yang bersih bebas minyak jelantah. Sumbu kayu (wooden wick) memberikan suara letupan halus bagaikan kayu bakar di perapian musim dingin.\n\nPerpaduan minyak atsiri esensial Lavender bunga alami yang menenangkan serta Cedarwood aromatik hutan, terbukti efektif menurunkan hormon stres dan membantu tidur lebih nyenyak (anti-insomnia).",
    gallery: [
      "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1602872030219-cbf9fd8ab29c?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1528826063941-df0c3798f116?auto=format&fit=crop&q=80&w=800"
    ],
    specs: [
      { label: "Berat Netto", value: "120 gram" },
      { label: "Daya Bakar", value: "Hingga 24 jam terus-menerus" },
      { label: "Bahan Lilin", value: "100% Soy Wax (Soya Alami)" },
      { label: "Wadah", value: "Gelas Amber dengan Tutup Aluminium" }
    ],
    rating: 4.7,
    reviewsCount: 104,
    stock: 18,
    isFeatured: false
  },
  {
    id: "p5",
    name: "Tas Jinjing Linen Alami",
    category: "Eco-Lifestyle",
    price: 125000,
    shortDescription: "Tote bag premium multifungsi berbahan kain rami dan katun linen tebal dengan finishing jahitan rapi untuk belanja harian.",
    description: "Kurangi kantong plastik dengan gaya elegan menggunakan Tas Jinjing Linen Alami kami. Tas ini dijahit apik menggunakan kombinasi serat rami alami (jute) yang kokoh di bagian bawah dan linen halus berkualitas ekspor di bagian atas. Dilengkapi dengan lapisan pelindung anti air tipis di bagian dalam dan kantong zipper tersembunyi untuk menyimpan kunci, dompet, atau ponsel.\n\nSangat lapang untuk membawa laptop ukuran 15 inci, buku, tumbler air minum, dan belanaan harian Anda. Menawarkan tampilan minimalis fungsional modern bagi Anda pecinta konsep zero-waste.",
    gallery: [
      "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&q=80&w=800"
    ],
    specs: [
      { label: "Ukuran", value: "Panjang 38 cm, Tinggi 30 cm, Lebar 12 cm" },
      { label: "Bahan", value: "Serat Rami Gading & Linen Premium" },
      { label: "Tali Pegangan", value: "Katun Kanvas Bulat Lembut (Nyaman di Bahu)" },
      { label: "Kapasitas Beban", value: "Hingga 12 kg" }
    ],
    rating: 4.9,
    reviewsCount: 65,
    stock: 15,
    isFeatured: true
  },
  {
    id: "p6",
    name: "Piring Saji Artisan Terakota",
    category: "Home & Decor",
    price: 135000,
    shortDescription: "Piring saji datar berbahan tanah terakota berglasi halus yang menghadirkan kehangatan mediterania di atas meja makan.",
    description: "Sajikan hidangan pembuka atau kudapan kue terlezat dengan Piring Saji Artisan Terakota. Dibuat dengan tanah liat lokal pilihan yang dibakar dalam suhu 1200°C sehingga padat dan tidak mudah retak. Mengedepankan paduan warna alami terakota jingga kecokelatan yang hangat, dilapisi glasir mengilap food-grade di bagian tengah guna memudahkan pencucian.\n\nPiring saji ini memberikan sentuhan rasa 'piring pedesaan modern' pada penyajian kuliner lokal maupun internasional di rumah atau kafe Anda.",
    gallery: [
      "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1576016770956-debb63d900bf?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1526406915894-7bcd65f60845?auto=format&fit=crop&q=80&w=800"
    ],
    specs: [
      { label: "Diameter", value: "22 cm" },
      { label: "Ketebalan", value: "0.8 cm" },
      { label: "Bahan", value: "Terracotta Clay Premium" },
      { label: "Keamanan", value: "100% Bebas Timbal (Lead-free)" }
    ],
    rating: 4.6,
    reviewsCount: 22,
    stock: 8,
    isFeatured: false
  },
  {
    id: "p7",
    name: "Teh Bunga Telang Kering Organik",
    category: "Pantry",
    price: 45000,
    shortDescription: "Bunga telang (butterfly pea) kering organik asli Klaten. Menyeduh air biru neon alami yang menenangkan dan kaya zat antioksidan.",
    description: "Teh Bunga Telang Kering Organik kami dipanen secara teliti dari perkebunan tanaman toga di Klaten, Jawa Tengah yang dikelola bebas pestisida kimia. Hanya kuncup bunga mekar prima bermahkota ganda yang dipetik di pagi hari, lalu dikeringkan secara steril menggunakan lemari pengering khusus (bukan dijemur di pinggir jalan umum) untuk mempertahankan nutrisi alami dan kebersihan tanaman.\n\nSeduhan bunga telang menghasilkan warna biru tua berkilau yang kaya antosianin (antioksidan pelindung sel). Tambahkan beberapa tetes jus lemon periang atau jeruk nipis untuk melihat keajaiban reaksi alami yang mengubah warna biru menjadi ungu fuchsia cerah yang cantik!",
    gallery: [
      "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1563822249548-9a72b6353cd1?auto=format&fit=crop&q=80&w=800"
    ],
    specs: [
      { label: "Isi Bersih", value: "35 gram (sekitar 70-80 kali seduh)" },
      { label: "Masa Simpan", value: "12 Bulan" },
      { label: "Manfaat", value: "Meningkatkan daya ingat, anti stress, merawat kecantikan kulit" },
      { label: "Saran Penyajian", value: "3-5 kuntum bunga diseduh air panas 200 ml selama 5 menit" }
    ],
    rating: 4.9,
    reviewsCount: 74,
    stock: 50,
    isFeatured: false
  },
  {
    id: "p8",
    name: "Sabun Batang Alami Lemon & Mint",
    category: "Eco-Lifestyle",
    price: 38000,
    shortDescription: "Sabun mandi mandi alami cold-process dengan minyak kelapa dara, ekstrak lemon segar dan hembusan minyak mint dingin.",
    description: "Kembalikan kesegaran sejati tubuh Anda setelah beraktivitas seharian dengan Sabun Batang Alami Lemon & Mint. Berbeda dari sabun komersial berbahan detergen sintetis (SLS) yang mengikis kelembapan kulit, sabun artisan kami dibuat secara manual menggunakan metode cold-process selama 4-6 minggu agar menghasilkan minyak gliserin alami berlimpah.\n\nMemanfaatkan minyak kelapa murni (virgin coconut oil) dan minyak zaitun dasar yang melembapkan, serta ditambahkan sari buah lemon segar pembersih kulit berminyak, serta minyak esensial Peppermint asli yang menghadirkan efek dingin segar tahan lama di tubuh. Cocok untuk semua jenis kulit, terutama kulit sensitif.",
    gallery: [
      "https://images.unsplash.com/photo-1607006342411-91f11c751611?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1605264964528-06403738d6dc?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=800"
    ],
    specs: [
      { label: "Berat Bersih", value: "100 gram" },
      { label: "Formula", value: "Zero SLS, Zero Paraben, Free Palm Oil" },
      { label: "Keunggulan", value: "Biodegradable (busa sabun aman bagi selokan tanah)" },
      { label: "Aroma", value: "Citrusy segar dengan mint dingin" }
    ],
    rating: 4.8,
    reviewsCount: 39,
    stock: 22,
    isFeatured: false
  }
];
