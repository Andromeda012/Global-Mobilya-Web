/**
 * Global Mobilya — Public Web Sitesi Ortak CRM, Teklif & Müşteri Portalı TypeScript Tipleri
 */

export type ClerkUserRole = 'customer' | 'staff' | 'admin';

export type LeadSource =
  | 'web'
  | 'whatsapp'
  | 'instagram'
  | 'facebook'
  | 'tiktok_youtube';

export type LeadStatus =
  | 'yeni_talep'
  | 'inceleniyor'
  | 'fiyat_verildi'
  | 'onaylandi'
  | 'iptal';

export interface CustomerRecord {
  id: string;
  clerk_user_id: string | null;
  full_name: string;
  phone: string;
  email: string | null;
  city: string | null;
  instagram_handle: string | null;
  created_at: string;
}

export interface ProductDetailsPayload {
  modules?: string[];
  dimensions?: string;
  finish_color?: string;
  notes?: string;
  page_url?: string;
  category?: string;
}

export interface LeadAndQuoteRecord {
  id: string;
  reference_code: string;
  customer_id: string;
  source: LeadSource;
  collection_name: string;
  product_details: ProductDetailsPayload;
  status: LeadStatus;
  quoted_price: number | null;
  staff_note: string | null;
  ai_summary: string | null;
  assigned_staff_id: string | null;
  erp_order_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface LazyQuoteRequestPayload {
  full_name: string;
  phone: string;
  city?: string | null;
  email?: string | null;
  source?: LeadSource;
  collection_name?: string | null;
  product_details?: ProductDetailsPayload;
  clerk_user_id?: string | null;
}

export interface LazyQuoteResponse {
  ok: boolean;
  reference_code: string;
  customer: CustomerRecord;
  lead: LeadAndQuoteRecord;
  message: string;
}
