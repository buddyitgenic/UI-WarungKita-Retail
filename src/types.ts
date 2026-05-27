/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  discountPrice?: number;
  shortDescription: string;
  description: string;
  gallery: string[];
  specs: { label: string; value: string }[];
  rating: number;
  reviewsCount: number;
  stock: number;
  isFeatured?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderDetails {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerAddress: string;
  shippingMethod: string;
  paymentMethod: string;
  notes?: string;
}

export interface OrderRecord {
  id: string;
  date: string;
  details: OrderDetails;
  items: { productName: string; quantity: number; price: number }[];
  subtotal: number;
  shippingFee: number;
  grandTotal: number;
  status: "Diproses" | "Selesai" | "Dibatalkan";
}

