/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { createClient } from '@supabase/supabase-js';
import {
  ShieldCheck, Phone, KeyRound, ArrowRight, Crown, UserCheck,
  LayoutDashboard, Bike, PhoneCall, Receipt, MapPin, Sliders,
  Users, LogOut, Search, Plus, RefreshCw, TrendingUp,
  ArrowUpRight, IndianRupee, UserPlus, CheckCircle, AlertCircle,
  Bell, MessageCircle, PackageOpen, Pencil, Trash2, Printer,
  X, Save, Copy, Database, Menu, Navigation, Eye, EyeOff,
  Upload, Image as ImageIcon, Camera, FolderOpen, Download,
  FileText, FileCheck, Zap, Check, ExternalLink, Sparkles, Car, FileBadge,
  History, Fuel, Calendar, Gauge, Timer, Layers, ChevronLeft, ChevronRight,
  Settings2, SlidersHorizontal, Info, Award, CheckCheck, Compass, Eye as EyeIcon, Cog,
  CheckCircle2
} from 'lucide-react';

// SUPABASE CONFIGURATION
const SUPABASE_URL = "https://nwdgayanhwzxivqlspdd.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im53ZGdheWFuaHd6eGl2cWxzcGRkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMwMTI0NTYsImV4cCI6MjEwODU4ODQ1Nn0.gGkuKEWZaTwC9xKbKvx_2sLMIY-r8haThicjgK4vP20";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const OWNER_PHONE = "9014540489";
const OWNER_PINS = ["1234", "9014540489"];

interface UserSession {
  name: string;
  phone: string;
  role: 'owner' | 'staff';
  permissions: string[];
}

export interface BikeColorway {
  name: string;
  hex: string;
}

export interface BikeItem {
  id: number;
  name: string;
  brand: string;
  category: string;
  price: number;
  year: number;
  km: number;
  image_url: string;
  gallery_urls?: string[];
  status: 'Available' | 'Booked' | 'Sold';
  // Specifications from customer showroom website (Screenshots 1, 2, 3)
  displacement_cc?: string; // e.g. "1158 cc", "948 cc", "999 cc"
  engine_type?: string;     // e.g. "V4 Granturismo", "Inline-4", "ShiftCam Boxer"
  max_power?: string;       // e.g. "168 hp", "205 hp", "125 hp"
  acceleration?: string;    // e.g. "3.1s", "2.9s", "3.4s"
  fuel_type?: string;       // e.g. "Petrol", "Unleaded Super 98", "Electric"
  location?: string;        // e.g. "Hyderabad – Main Showroom", "Hyderabad – Banjara Hills", "Bengaluru Branch"
  tagline?: string;         // e.g. "Muscular stance with superbike heart."
  colorways?: BikeColorway[];
  addon_gear_name?: string; // e.g. "Ducati Corse Riding Leather"
  addon_gear_price?: number;// e.g. 38500
  warranty_badge?: string;  // e.g. "Adarsh Verified: 120-Point Inspection, Clear Title & 1-Year Engine Warranty."
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  staff_name: string;
  staff_phone: string;
  role: 'owner' | 'staff';
  action_type: 'login' | 'lead_view' | 'lead_status' | 'inventory_add' | 'inventory_edit' | 'inventory_delete' | 'billing_create' | 'settings_edit' | 'staff_edit' | 'branch_edit';
  module: 'Auth' | 'Leads CRM' | 'Inventory' | 'Billing' | 'Branches' | 'CMS Settings' | 'Staff Access';
  description: string;
  target_id?: string | number;
  target_name?: string;
  details?: {
    field?: string;
    before?: any;
    after?: any;
    notes?: string;
  };
}

interface LeadItem {
  id: number;
  customer_name: string;
  phone: string;
  bike_interested: string;
  service_type?: string;
  message: string;
  status: 'New' | 'Contacted' | 'Closed' | 'Follow-up';
  created_at: string;
}

export interface InvoiceDoc {
  id?: string;
  name: string;
  url: string;
  type: string; // 'rc' | 'insurance' | 'puc' | 'photo' | 'echarger' | 'other'
  size?: string;
}

export interface InvoiceItem {
  id: number;
  invoice_number: string;
  customer_name: string;
  mobile: string;
  vehicle: string;
  reg_number: string; // MANDATORY: Permanent / Temporary Vehicle Registration Number
  price: number;
  payment_mode: string;
  has_echarger?: boolean;
  echarger_details?: string;
  documents?: InvoiceDoc[];
  notes: string;
  created_at: string;
}

interface BranchItem {
  id: number;
  city: string;
  branch_name: string;
  address: string;
  phone: string;
  maps_url: string;
  status: string;
}

interface StaffItem {
  id: number;
  name: string;
  phone: string;
  pin: string;
  role: string;
  permissions: string[];
  status: string;
}

const SEED_BIKES: BikeItem[] = [
  {
    id: 1,
    name: "Ducati Diavel V4",
    brand: "Ducati",
    category: "Superbikes",
    price: 2890000,
    year: 2024,
    km: 1112,
    image_url: "/public/assets/aistudio/Screenshot_2026-10-27_171108_18bf6569.png",
    gallery_urls: [
      "/public/assets/aistudio/Screenshot_2026-10-27_171108_18bf6569.png",
      "/public/assets/aistudio/Screenshot_2026-10-27_171056_6ccfcea2.png",
      "/public/assets/aistudio/Screenshot_2026-10-27_171123_5ece9d25.png"
    ],
    status: "Available",
    displacement_cc: "1158 cc",
    engine_type: "V4 1158 cc Granturismo",
    max_power: "168 hp",
    acceleration: "3.1s",
    fuel_type: "Petrol",
    location: "Hyderabad – Main Showroom",
    tagline: "Muscular stance with superbike heart.",
    colorways: [
      { name: "Solar Orange", hex: "#EA580C" },
      { name: "Ducati Red", hex: "#DC2626" },
      { name: "Dark Stealth", hex: "#334155" },
      { name: "Pearl White", hex: "#F8FAFC" },
      { name: "Racing Blue", hex: "#2563EB" }
    ],
    addon_gear_name: "Ducati Corse Riding Leather",
    addon_gear_price: 38500,
    warranty_badge: "Adarsh Verified: 120-Point Inspection, Clear Title & 1-Year Engine Warranty."
  },
  {
    id: 2,
    name: "Kawasaki Ninja Z900",
    brand: "Kawasaki",
    category: "Superbikes",
    price: 920000,
    year: 2024,
    km: 1456,
    image_url: "/public/assets/aistudio/image_f4045ab9.png",
    gallery_urls: [
      "/public/assets/aistudio/image_f4045ab9.png",
      "/public/assets/aistudio/Screenshot_2026-10-27_171056_6ccfcea2.png"
    ],
    status: "Available",
    displacement_cc: "948 cc",
    engine_type: "948 cc Inline-4",
    max_power: "125 hp",
    acceleration: "3.4s",
    fuel_type: "Petrol",
    location: "Hyderabad – Main Showroom",
    tagline: "Aggressive sugomi streetfighter presence with screaming 4-cylinder acoustics.",
    colorways: [
      { name: "Lime Green", hex: "#16A34A" },
      { name: "Metallic Spark Black", hex: "#0F172A" },
      { name: "Candy Crimson", hex: "#DC2626" }
    ],
    addon_gear_name: "KRT Dainese Racing Gloves",
    addon_gear_price: 14500,
    warranty_badge: "Adarsh Verified: 120-Point Inspection, Clear Title & 1-Year Engine Warranty."
  },
  {
    id: 3,
    name: "BMW S1000RR M-Sport",
    brand: "BMW",
    category: "Superbikes",
    price: 2350000,
    year: 2024,
    km: 3200,
    image_url: "/public/assets/aistudio/image_f4045ab9.png",
    gallery_urls: [
      "/public/assets/aistudio/image_f4045ab9.png",
      "/public/assets/aistudio/Screenshot_2026-10-27_171056_6ccfcea2.png"
    ],
    status: "Available",
    displacement_cc: "999 cc",
    engine_type: "999 cc ShiftCam",
    max_power: "205 hp",
    acceleration: "2.9s",
    fuel_type: "Petrol",
    location: "Hyderabad – Banjara Hills",
    tagline: "Motorsport winglets and dynamic traction with racetrack apex telemetry.",
    colorways: [
      { name: "M Light White Motorsport", hex: "#F8FAFC" },
      { name: "Black Storm Metallic", hex: "#1E293B" },
      { name: "Racing Red", hex: "#EF4444" }
    ],
    addon_gear_name: "BMW Motorrad Carbon Full Face Helmet",
    addon_gear_price: 52000,
    warranty_badge: "Adarsh Verified: 120-Point Inspection, Clear Title & 1-Year Engine Warranty."
  },
  {
    id: 4,
    name: "KTM 1290 Super Duke R",
    brand: "KTM",
    category: "Superbikes",
    price: 1850000,
    year: 2023,
    km: 1845,
    image_url: "/public/assets/aistudio/image_f4045ab9.png",
    gallery_urls: [
      "/public/assets/aistudio/image_f4045ab9.png",
      "/public/assets/aistudio/Screenshot_2026-10-27_171056_6ccfcea2.png"
    ],
    status: "Available",
    displacement_cc: "1301 cc",
    engine_type: "1301 cc LC8 V-Twin",
    max_power: "180 hp",
    acceleration: "3.2s",
    fuel_type: "Unleaded",
    location: "Bengaluru Branch",
    tagline: "The Beast: uncompromising torque with ultra-light trellis frame.",
    colorways: [
      { name: "Electric Orange", hex: "#F97316" },
      { name: "Stealth Matt Black", hex: "#18181B" }
    ],
    addon_gear_name: "KTM PowerParts Carbon Akrapovič Slip-On",
    addon_gear_price: 68000,
    warranty_badge: "Adarsh Verified: 120-Point Inspection, Clear Title & 1-Year Engine Warranty."
  },
  {
    id: 5,
    name: "Ducati Panigale V2",
    brand: "Ducati",
    category: "Superbikes",
    price: 2000000,
    year: 2024,
    km: 1800,
    image_url: "/public/assets/aistudio/image_f4045ab9.png",
    gallery_urls: ["/public/assets/aistudio/image_f4045ab9.png"],
    status: "Available",
    displacement_cc: "955 cc",
    engine_type: "Superquadro Twin 955 cc",
    max_power: "155 hp",
    acceleration: "3.3s",
    fuel_type: "Petrol",
    location: "Hyderabad – Main Showroom",
    tagline: "Unmistakable Italian aerodynamic silhouette with pure cornering poise.",
    colorways: [
      { name: "Ducati Red", hex: "#DC2626" },
      { name: "White Star Silk", hex: "#F1F5F9" }
    ],
    addon_gear_name: "Ducati Corse Alpinestars Boots",
    addon_gear_price: 26000,
    warranty_badge: "Adarsh Verified: 120-Point Inspection, Clear Title & 1-Year Engine Warranty."
  },
  {
    id: 6,
    name: "Honda Activa 6G Premium",
    brand: "Honda",
    category: "Scooter",
    price: 85000,
    year: 2026,
    km: 1800,
    image_url: "/public/assets/aistudio/image_f4045ab9.png",
    gallery_urls: ["/public/assets/aistudio/image_f4045ab9.png"],
    status: "Sold",
    displacement_cc: "110 cc",
    engine_type: "PGM-FI 4-Stroke",
    max_power: "7.8 hp",
    acceleration: "7.9s",
    fuel_type: "Petrol",
    location: "Hyderabad – Main Showroom",
    tagline: "India's highest selling reliable smart scooter with eSP technology.",
    colorways: [
      { name: "Matte Axis Grey", hex: "#475569" },
      { name: "Pearl Siren Blue", hex: "#1E40AF" },
      { name: "Decent Blue", hex: "#3B82F6" }
    ],
    addon_gear_name: "Studds Ninja Elite Flip-up Helmet",
    addon_gear_price: 2400,
    warranty_badge: "Adarsh Verified: 50-Point Inspection & 6-Month Dealership Warranty."
  }
];

const SEED_AUDIT_LOGS: AuditLogItem[] = [
  {
    id: "log_1",
    timestamp: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    staff_name: "Suresh Kumar",
    staff_phone: "9876543210",
    role: "staff",
    action_type: "lead_status",
    module: "Leads CRM",
    description: "Changed lead Kiran Varma status from 'New' to 'Contacted'",
    target_id: 1,
    target_name: "Kiran Varma",
    details: { field: "status", before: "New", after: "Contacted", notes: "Called customer regarding Kawasaki Ninja Z900 green color availability." }
  },
  {
    id: "log_2",
    timestamp: new Date(Date.now() - 28 * 60 * 1000).toISOString(),
    staff_name: "Suresh Kumar",
    staff_phone: "9876543210",
    role: "staff",
    action_type: "lead_view",
    module: "Leads CRM",
    description: "Inspected customer personal phone number & enquiry note for Kiran Varma",
    target_id: 1,
    target_name: "Kiran Varma (9848012345)",
    details: { notes: "Customer requested down payment and immediate delivery details." }
  },
  {
    id: "log_3",
    timestamp: new Date(Date.now() - 55 * 60 * 1000).toISOString(),
    staff_name: "Ramesh Naidu",
    staff_phone: "9849112233",
    role: "staff",
    action_type: "billing_create",
    module: "Billing",
    description: "Generated official GST Invoice #AM-2026-101 for Ananya Deshmukh",
    target_id: "AM-2026-101",
    target_name: "TS 09 EQ 4200 (₹85,000 via UPI)",
    details: { notes: "Uploaded 4 vehicle documents including RC Card, Insurance & E-Charger warranty." }
  },
  {
    id: "log_4",
    timestamp: new Date(Date.now() - 95 * 60 * 1000).toISOString(),
    staff_name: "Suresh Kumar",
    staff_phone: "9876543210",
    role: "staff",
    action_type: "inventory_edit",
    module: "Inventory",
    description: "Updated technical specifications for Ducati Diavel V4 (1158 cc Granturismo, 168 hp)",
    target_id: 1,
    target_name: "Ducati Diavel V4",
    details: { field: "specifications", before: "Basic Listing", after: "1158 cc, 168 hp, 3.1s 0-100, Riding Gear add-on ₹38,500" }
  },
  {
    id: "log_5",
    timestamp: new Date(Date.now() - 140 * 60 * 1000).toISOString(),
    staff_name: "Ramesh Naidu",
    staff_phone: "9849112233",
    role: "staff",
    action_type: "login",
    module: "Auth",
    description: "Staff member Ramesh Naidu authenticated via PIN into Digital Billing",
    details: { notes: "Session started from showroom iPad / counter desktop." }
  },
  {
    id: "log_6",
    timestamp: new Date(Date.now() - 180 * 60 * 1000).toISOString(),
    staff_name: "Suresh Kumar",
    staff_phone: "9876543210",
    role: "staff",
    action_type: "login",
    module: "Auth",
    description: "Staff member Suresh Kumar authenticated via PIN into Leads CRM & Inventory",
    details: { notes: "Showroom morning duty check-in." }
  },
  {
    id: "log_7",
    timestamp: new Date(Date.now() - 360 * 60 * 1000).toISOString(),
    staff_name: "Pavan Kumar (Owner)",
    staff_phone: "9014540489",
    role: "owner",
    action_type: "settings_edit",
    module: "CMS Settings",
    description: "Updated showroom promotional banner text: Festive Superbike Carnival 0% processing fee",
    details: { field: "bannerText", before: "Standard Welcome", after: "⚡ Festive Superbike Carnival: 0% Processing Fee" }
  }
];

const SEED_LEADS: LeadItem[] = [
  {
    id: 1,
    customer_name: "Kiran Varma",
    phone: "9848012345",
    bike_interested: "Kawasaki Ninja Z900",
    service_type: "Test Ride & Finance",
    message: "Enquiring about down payment and immediate delivery for green color.",
    status: "New",
    created_at: new Date(Date.now() - 15 * 60 * 1000).toISOString()
  },
  {
    id: 2,
    customer_name: "Siddharth Rao",
    phone: "9000123456",
    bike_interested: "BMW G310 GS",
    service_type: "Exchange Quotation",
    message: "Wants to exchange 2021 Dominar 400. Requested showroom callback.",
    status: "Contacted",
    created_at: new Date(Date.now() - 3 * 3600 * 1000).toISOString()
  },
  {
    id: 3,
    customer_name: "Ananya Deshmukh",
    phone: "9123456789",
    bike_interested: "Honda Activa 6G",
    service_type: "Purchase Booking",
    message: "Token paid via UPI, scheduled delivery for Saturday at Jubilee Hills.",
    status: "Closed",
    created_at: new Date(Date.now() - 24 * 3600 * 1000).toISOString()
  },
  {
    id: 4,
    customer_name: "Mohammed Farhan",
    phone: "9885544332",
    bike_interested: "Ducati Panigale V2",
    service_type: "Superbike Inspection",
    message: "Requested mechanic inspection report before transferring balance.",
    status: "Follow-up",
    created_at: new Date(Date.now() - 48 * 3600 * 1000).toISOString()
  }
];

const SEED_INVOICES: InvoiceItem[] = [
  {
    id: 1,
    invoice_number: "AM-2026-101",
    customer_name: "Ananya Deshmukh",
    mobile: "9123456789",
    vehicle: "Honda Activa 6G Premium (Matte Axis Grey)",
    reg_number: "TS 09 EQ 4200",
    price: 85000,
    payment_mode: "UPI",
    has_echarger: true,
    echarger_details: "Activa Smart Fast Charger (3.3kW Portable Kit)",
    documents: [
      { name: "RC_Card_TS09EQ4200.jpg", url: "/public/assets/aistudio/image_f4045ab9.png", type: "rc", size: "380 KB" },
      { name: "Bajaj_Allianz_Policy_2026.pdf", url: "/public/assets/aistudio/image_f4045ab9.png", type: "insurance", size: "620 KB" },
      { name: "Vehicle_Handover_Keys_Photo.jpg", url: "/public/assets/aistudio/image_b40a39bd.png", type: "photo", size: "910 KB" },
      { name: "ECharger_Warranty_Card.jpg", url: "/public/assets/aistudio/image_f4045ab9.png", type: "echarger", size: "290 KB" }
    ],
    notes: "Full payment received. Delivery kit, EV charger & helmet provided.",
    created_at: new Date(Date.now() - 24 * 3600 * 1000).toISOString()
  },
  {
    id: 2,
    invoice_number: "AM-2026-102",
    customer_name: "Rajesh Goud",
    mobile: "9440122334",
    vehicle: "Royal Enfield Hunter 350 Dapper Ash",
    reg_number: "TS 07 HK 1122",
    price: 175000,
    payment_mode: "Bank Transfer",
    has_echarger: false,
    documents: [
      { name: "RTO_Form_29_30_SmartRC.pdf", url: "/public/assets/aistudio/image_f4045ab9.png", type: "rc", size: "450 KB" },
      { name: "National_Comprehensive_Insurance.pdf", url: "/public/assets/aistudio/image_f4045ab9.png", type: "insurance", size: "510 KB" },
      { name: "Delivery_Ceremony_Photo.jpg", url: "/public/assets/aistudio/image_b40a39bd.png", type: "photo", size: "840 KB" }
    ],
    notes: "RTGS verified. RTO transfer process initiated.",
    created_at: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString()
  },
  {
    id: 3,
    invoice_number: "AM-2026-103",
    customer_name: "Gautam Kashyap",
    mobile: "9849556677",
    vehicle: "Kawasaki Ninja 650 KRT Edition",
    reg_number: "TS 08 FJ 8899",
    price: 680000,
    payment_mode: "Finance",
    has_echarger: false,
    documents: [
      { name: "Kawasaki_Original_RC.jpg", url: "/public/assets/aistudio/image_f4045ab9.png", type: "rc", size: "410 KB" },
      { name: "HDFC_Finance_NOC_Approval.pdf", url: "/public/assets/aistudio/image_f4045ab9.png", type: "other", size: "320 KB" }
    ],
    notes: "HDFC Two Wheeler Finance sanctioned.",
    created_at: new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString()
  }
];

const SEED_BRANCHES: BranchItem[] = [
  {
    id: 1,
    city: "Hyderabad",
    branch_name: "Hyderabad — Main Flagship Showroom",
    address: "Plot 42, Road No. 36, Jubilee Hills, Hyderabad, Telangana 500033",
    phone: "+91 9014540489",
    maps_url: "https://maps.google.com/?q=Jubilee+Hills+Hyderabad",
    status: "Active"
  },
  {
    id: 2,
    city: "Hyderabad",
    branch_name: "Hyderabad — Madhapur Tech-Hub Studio",
    address: "Opp. Cyber Towers, Hitec City, Madhapur, Hyderabad, Telangana 500081",
    phone: "+91 9014540489",
    maps_url: "https://maps.google.com/?q=Madhapur+Hyderabad",
    status: "Active"
  },
  {
    id: 3,
    city: "Bengaluru",
    branch_name: "Bengaluru — Indiranagar Experience Center",
    address: "100ft Road, HAL 2nd Stage, Indiranagar, Bengaluru, Karnataka 560038",
    phone: "+91 9876543210",
    maps_url: "https://maps.google.com/?q=Indiranagar+Bengaluru",
    status: "Active"
  },
  {
    id: 4,
    city: "Mumbai",
    branch_name: "Mumbai — Bandra West Studio",
    address: "Hill Road, Bandra West, Mumbai, Maharashtra 400050",
    phone: "+91 9876543210",
    maps_url: "https://maps.google.com/?q=Bandra+West+Mumbai",
    status: "Coming Soon"
  }
];

const SEED_STAFF: StaffItem[] = [
  {
    id: 1,
    name: "Suresh Kumar",
    phone: "9876543210",
    pin: "2026",
    role: "staff",
    permissions: ["leads", "inventory"],
    status: "Active"
  },
  {
    id: 2,
    name: "Ramesh Naidu",
    phone: "9849112233",
    pin: "4321",
    role: "staff",
    permissions: ["leads", "billing"],
    status: "Active"
  }
];

export default function App() {
  // Session State
  const [currentUser, setCurrentUser] = useState<UserSession | null>(() => {
    try {
      const saved = sessionStorage.getItem('adarsh_session');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Navigation State
  const [activeTab, setActiveTab] = useState<'overview' | 'inventory' | 'leads' | 'billing' | 'branches' | 'settings' | 'staff' | 'audit'>('overview');

  // Login Form State
  const [loginPhone, setLoginPhone] = useState('');
  const [loginPin, setLoginPin] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Helper to ensure all rich specs exist on any bike
  const mergeBikeDefaults = (b: any): BikeItem => ({
    id: b.id || Date.now(),
    name: b.name || "Custom Superbike",
    brand: b.brand || "Ducati",
    category: b.category || "Superbikes",
    price: Number(b.price) || 920000,
    year: Number(b.year) || 2024,
    km: Number(b.km) || 1200,
    image_url: b.image_url || "/public/assets/aistudio/Screenshot_2026-10-27_171108_18bf6569.png",
    gallery_urls: b.gallery_urls || [
      b.image_url || "/public/assets/aistudio/Screenshot_2026-10-27_171108_18bf6569.png",
      "/public/assets/aistudio/Screenshot_2026-10-27_171056_6ccfcea2.png",
      "/public/assets/aistudio/Screenshot_2026-10-27_171123_5ece9d25.png"
    ],
    status: b.status || "Available",
    displacement_cc: b.displacement_cc || (b.name?.includes('900') ? "948 cc" : b.name?.includes('1000') ? "999 cc" : "1158 cc"),
    engine_type: b.engine_type || (b.name?.includes('900') ? "948 cc Inline-4" : b.name?.includes('1000') ? "999 cc ShiftCam" : "V4 1158 cc Granturismo"),
    max_power: b.max_power || (b.name?.includes('1000') ? "205 hp" : b.name?.includes('900') ? "125 hp" : "168 hp"),
    acceleration: b.acceleration || (b.name?.includes('1000') ? "2.9s" : b.name?.includes('900') ? "3.4s" : "3.1s"),
    fuel_type: b.fuel_type || "Petrol",
    location: b.location || "Hyderabad – Main Showroom",
    tagline: b.tagline || (b.name?.includes('900') ? "Aggressive sugomi streetfighter presence." : "Muscular stance with superbike heart."),
    colorways: (b.colorways && b.colorways.length > 0) ? b.colorways : [
      { name: "Solar Orange", hex: "#EA580C" },
      { name: "Ducati Red", hex: "#DC2626" },
      { name: "Dark Stealth", hex: "#334155" },
      { name: "Pearl White", hex: "#F8FAFC" },
      { name: "Racing Blue", hex: "#2563EB" }
    ],
    addon_gear_name: b.addon_gear_name || "Ducati Corse Riding Leather",
    addon_gear_price: Number(b.addon_gear_price) || 38500,
    warranty_badge: b.warranty_badge || "Adarsh Verified: 120-Point Inspection, Clear Title & 1-Year Engine Warranty."
  });

  // Data States
  const [bikes, setBikes] = useState<BikeItem[]>(() => {
    try {
      const saved = localStorage.getItem('adarsh_bikes');
      if (saved) {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) && parsed.length > 0 ? parsed.map(mergeBikeDefaults) : SEED_BIKES;
      }
      return SEED_BIKES;
    } catch {
      return SEED_BIKES;
    }
  });

  const [leads, setLeads] = useState<LeadItem[]>(() => {
    try {
      const saved = localStorage.getItem('adarsh_leads');
      return saved ? JSON.parse(saved) : SEED_LEADS;
    } catch {
      return SEED_LEADS;
    }
  });

  const [invoices, setInvoices] = useState<InvoiceItem[]>(() => {
    try {
      const saved = localStorage.getItem('adarsh_invoices');
      return saved ? JSON.parse(saved) : SEED_INVOICES;
    } catch {
      return SEED_INVOICES;
    }
  });

  const [branches, setBranches] = useState<BranchItem[]>(() => {
    try {
      const saved = localStorage.getItem('adarsh_branches');
      return saved ? JSON.parse(saved) : SEED_BRANCHES;
    } catch {
      return SEED_BRANCHES;
    }
  });

  const [staff, setStaff] = useState<StaffItem[]>(() => {
    try {
      const saved = localStorage.getItem('adarsh_staff');
      return saved ? JSON.parse(saved) : SEED_STAFF;
    } catch {
      return SEED_STAFF;
    }
  });

  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('adarsh_settings');
      return saved ? JSON.parse(saved) : {
        instagram: "adarshmotors.in",
        whatsapp: "9014540489",
        salesPhone: "+91 9014540489",
        email: "contact@adarshmotors.in",
        address: "Plot 42, Road No. 36, Jubilee Hills, Hyderabad, Telangana 500033",
        tagline: "PERFORMANCE. REFINED. Hyderabad's premier certified pre-owned superbike hub.",
        bannerActive: true,
        bannerText: "⚡ Festive Superbike Carnival: 0% Processing Fee on Kawasaki & BMW models this week! Visit Hyderabad showroom."
      };
    } catch {
      return {
        instagram: "adarshmotors.in",
        whatsapp: "9014540489",
        salesPhone: "+91 9014540489",
        email: "contact@adarshmotors.in",
        address: "Plot 42, Road No. 36, Jubilee Hills, Hyderabad, Telangana 500033",
        tagline: "PERFORMANCE. REFINED.",
        bannerActive: true,
        bannerText: "⚡ Festive Superbike Carnival: 0% Processing Fee on Kawasaki & BMW models this week!"
      };
    }
  });

  const [alerts, setAlerts] = useState<{ id: number; type: string; title: string; detail: string; time: string }[]>([
    { id: 1, type: 'lead', title: 'New enquiry received', detail: 'Kiran Varma for Kawasaki Ninja Z900', time: '15m ago' },
    { id: 2, type: 'inventory', title: 'Stock status updated', detail: 'KTM Duke 390 marked as Booked', time: '1h ago' },
    { id: 3, type: 'invoice', title: 'Invoice #AM-2026-101 billed', detail: '₹85,000 via UPI (Ananya Deshmukh)', time: '1d ago' }
  ]);

  // Modals & UI Controls
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showSqlModal, setShowSqlModal] = useState(false);
  const [showBikeModal, setShowBikeModal] = useState(false);
  const [editingBike, setEditingBike] = useState<BikeItem | null>(null);
  const [bikeModalImage, setBikeModalImage] = useState<string>('');
  const [showGalleryPicker, setShowGalleryPicker] = useState<boolean>(false);
  const [useUrlFallback, setUseUrlFallback] = useState<boolean>(false);

  const handleImageFileUpload = (file: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      const img = new window.Image();
      img.onload = () => {
        const maxDim = 1200;
        let w = img.width;
        let h = img.height;
        if (w > maxDim || h > maxDim) {
          if (w > h) {
            h = Math.round((h * maxDim) / w);
            w = maxDim;
          } else {
            w = Math.round((w * maxDim) / h);
            h = maxDim;
          }
          const canvas = document.createElement('canvas');
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, w, h);
          setBikeModalImage(canvas.toDataURL('image/jpeg', 0.85));
        } else {
          setBikeModalImage(dataUrl);
        }
        showToast('Photo uploaded from device!');
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showPrintInvoiceModal, setShowPrintInvoiceModal] = useState<InvoiceItem | null>(null);
  const [showBranchModal, setShowBranchModal] = useState(false);
  const [editingBranch, setEditingBranch] = useState<BranchItem | null>(null);
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffItem | null>(null);
  const [showPinId, setShowPinId] = useState<number | null>(null);

  // Digital Billing States & Document Uploads
  const [invoiceFormDocs, setInvoiceFormDocs] = useState<InvoiceDoc[]>([]);
  const [invoiceHasEcharger, setInvoiceHasEcharger] = useState<boolean>(false);
  const [invoiceEchargerDetails, setInvoiceEchargerDetails] = useState<string>('7.4kW Fast Home Charging Unit (S/N: CHG-2026-904)');
  const [invoiceDocType, setInvoiceDocType] = useState<string>('rc');
  const [billingSearch, setBillingSearch] = useState<string>('');

  // Customer / Buyer Ownership Portal States
  const [authViewMode, setAuthViewMode] = useState<'admin' | 'customer'>('admin');
  const [customerSearchInput, setCustomerSearchInput] = useState<string>('');
  const [customerLookupResult, setCustomerLookupResult] = useState<InvoiceItem | null>(null);
  const [customerLookupError, setCustomerLookupError] = useState<string>('');
  const [showCustomerHubModal, setShowCustomerHubModal] = useState<InvoiceItem | null>(null);
  const [previewDocModal, setPreviewDocModal] = useState<InvoiceDoc | null>(null);

  // Staff Activity & Audit Log States
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(() => {
    try {
      const saved = localStorage.getItem('adarsh_audit_logs');
      return saved ? JSON.parse(saved) : SEED_AUDIT_LOGS;
    } catch {
      return SEED_AUDIT_LOGS;
    }
  });
  const [selectedAuditLog, setSelectedAuditLog] = useState<AuditLogItem | null>(null);
  const [auditSearch, setAuditSearch] = useState<string>('');
  const [auditStaffFilter, setAuditStaffFilter] = useState<string>('ALL');
  const [auditModuleFilter, setAuditModuleFilter] = useState<string>('ALL');

  // Customer Showroom Live Preview States (Exact Customer Website View from Screenshots)
  const [inventoryViewMode, setInventoryViewMode] = useState<'table' | 'showroom'>('showroom');
  const [customerPreviewBike, setCustomerPreviewBike] = useState<BikeItem | null>(null);
  const [previewAngleIndex, setPreviewAngleIndex] = useState<number>(0);
  const [previewColorwayIndex, setPreviewColorwayIndex] = useState<number>(0);
  const [previewAddonSelected, setPreviewAddonSelected] = useState<boolean>(true);

  // Expanded Bike Modal Specification Form States (Matching Screenshots 1, 2, 3)
  const [activeBikeModalTab, setActiveBikeModalTab] = useState<'core' | 'specs' | 'marketing' | 'photos'>('core');
  const [bikeModalDisplacement, setBikeModalDisplacement] = useState<string>('1158 cc');
  const [bikeModalEngineType, setBikeModalEngineType] = useState<string>('V4 1158 cc Granturismo');
  const [bikeModalPower, setBikeModalPower] = useState<string>('168 hp');
  const [bikeModalAcceleration, setBikeModalAcceleration] = useState<string>('3.1s');
  const [bikeModalFuel, setBikeModalFuel] = useState<string>('Petrol');
  const [bikeModalLocation, setBikeModalLocation] = useState<string>('Hyderabad – Main Showroom');
  const [bikeModalTagline, setBikeModalTagline] = useState<string>('Muscular stance with superbike heart.');
  const [bikeModalColorways, setBikeModalColorways] = useState<BikeColorway[]>([
    { name: "Solar Orange", hex: "#EA580C" },
    { name: "Ducati Red", hex: "#DC2626" },
    { name: "Dark Stealth", hex: "#334155" },
    { name: "Pearl White", hex: "#F8FAFC" },
    { name: "Racing Blue", hex: "#2563EB" }
  ]);
  const [bikeModalAddonName, setBikeModalAddonName] = useState<string>('Ducati Corse Riding Leather');
  const [bikeModalAddonPrice, setBikeModalAddonPrice] = useState<number>(38500);
  const [bikeModalWarranty, setBikeModalWarranty] = useState<string>('Adarsh Verified: 120-Point Inspection, Clear Title & 1-Year Engine Warranty.');
  const [bikeModalAngleImages, setBikeModalAngleImages] = useState<string[]>([
    '/public/assets/aistudio/Screenshot_2026-10-27_171108_18bf6569.png',
    '/public/assets/aistudio/Screenshot_2026-10-27_171056_6ccfcea2.png',
    '/public/assets/aistudio/Screenshot_2026-10-27_171123_5ece9d25.png'
  ]);

  // Open Bike Add Modal with rich defaults
  const openAddBikeModal = () => {
    setEditingBike(null);
    setBikeModalImage('/public/assets/aistudio/Screenshot_2026-10-27_171108_18bf6569.png');
    setBikeModalDisplacement('1158 cc');
    setBikeModalEngineType('V4 1158 cc Granturismo');
    setBikeModalPower('168 hp');
    setBikeModalAcceleration('3.1s');
    setBikeModalFuel('Petrol');
    setBikeModalLocation(branches[0]?.branch_name || 'Hyderabad – Main Showroom');
    setBikeModalTagline('Muscular stance with superbike heart.');
    setBikeModalColorways([
      { name: "Solar Orange", hex: "#EA580C" },
      { name: "Ducati Red", hex: "#DC2626" },
      { name: "Dark Stealth", hex: "#334155" },
      { name: "Pearl White", hex: "#F8FAFC" },
      { name: "Racing Blue", hex: "#2563EB" }
    ]);
    setBikeModalAddonName('Ducati Corse Riding Leather');
    setBikeModalAddonPrice(38500);
    setBikeModalWarranty('Adarsh Verified: 120-Point Inspection, Clear Title & 1-Year Engine Warranty.');
    setBikeModalAngleImages([
      '/public/assets/aistudio/Screenshot_2026-10-27_171108_18bf6569.png',
      '/public/assets/aistudio/Screenshot_2026-10-27_171056_6ccfcea2.png',
      '/public/assets/aistudio/Screenshot_2026-10-27_171123_5ece9d25.png'
    ]);
    setActiveBikeModalTab('core');
    setShowGalleryPicker(false);
    setUseUrlFallback(false);
    setShowBikeModal(true);
  };

  // Open Bike Edit Modal preloaded with existing specs
  const openEditBikeModal = (b: BikeItem) => {
    setEditingBike(b);
    setBikeModalImage(b.image_url || '/public/assets/aistudio/Screenshot_2026-10-27_171108_18bf6569.png');
    setBikeModalDisplacement(b.displacement_cc || '1158 cc');
    setBikeModalEngineType(b.engine_type || 'V4 1158 cc Granturismo');
    setBikeModalPower(b.max_power || '168 hp');
    setBikeModalAcceleration(b.acceleration || '3.1s');
    setBikeModalFuel(b.fuel_type || 'Petrol');
    setBikeModalLocation(b.location || 'Hyderabad – Main Showroom');
    setBikeModalTagline(b.tagline || 'Muscular stance with superbike heart.');
    setBikeModalColorways(b.colorways && b.colorways.length > 0 ? b.colorways : [
      { name: "Solar Orange", hex: "#EA580C" },
      { name: "Ducati Red", hex: "#DC2626" },
      { name: "Dark Stealth", hex: "#334155" }
    ]);
    setBikeModalAddonName(b.addon_gear_name || 'Ducati Corse Riding Leather');
    setBikeModalAddonPrice(b.addon_gear_price || 38500);
    setBikeModalWarranty(b.warranty_badge || 'Adarsh Verified: 120-Point Inspection, Clear Title & 1-Year Engine Warranty.');
    setBikeModalAngleImages(b.gallery_urls && b.gallery_urls.length > 0 ? b.gallery_urls : [b.image_url]);
    setActiveBikeModalTab('core');
    setShowGalleryPicker(false);
    setUseUrlFallback(false);
    setShowBikeModal(true);
  };

  // Open Customer Modal Preview
  const openCustomerPreview = (b: BikeItem) => {
    setCustomerPreviewBike(b);
    setPreviewAngleIndex(0);
    setPreviewColorwayIndex(0);
    setPreviewAddonSelected(true);
  };

  // Centralized Staff Activity Logger
  const logAuditAction = (
    action_type: AuditLogItem['action_type'],
    module: AuditLogItem['module'],
    description: string,
    target_id?: string | number,
    target_name?: string,
    details?: AuditLogItem['details']
  ) => {
    const newEntry: AuditLogItem = {
      id: 'log_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      timestamp: new Date().toISOString(),
      staff_name: currentUser ? currentUser.name : 'Pavan Kumar (Owner)',
      staff_phone: currentUser ? currentUser.phone : '9014540489',
      role: currentUser ? currentUser.role : 'owner',
      action_type,
      module,
      description,
      target_id,
      target_name,
      details
    };
    setAuditLogs(prev => [newEntry, ...prev]);
  };

  // Export Audit Logs to CSV
  const exportAuditCsv = () => {
    const headers = ['Log ID', 'Timestamp (UTC)', 'Staff Name', 'Staff Phone', 'Role', 'Module', 'Action Type', 'Description', 'Target Name', 'Notes'];
    const rows = auditLogs.map(l => [
      `"${l.id}"`,
      `"${l.timestamp}"`,
      `"${l.staff_name}"`,
      `"${l.staff_phone}"`,
      `"${l.role}"`,
      `"${l.module}"`,
      `"${l.action_type}"`,
      `"${l.description.replace(/"/g, '""')}"`,
      `"${(l.target_name || '').replace(/"/g, '""')}"`,
      `"${(l.details?.notes || l.details?.field || '').replace(/"/g, '""')}"`
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Adarsh_Motors_Staff_Audit_Log_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Exported Staff Activity & Audit history to CSV!');
  };

  const handleInvoiceFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        const newDoc: InvoiceDoc = {
          id: 'doc_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
          name: file.name,
          url: dataUrl,
          type: invoiceDocType,
          size: (file.size / 1024).toFixed(1) + ' KB'
        };
        setInvoiceFormDocs(prev => [...prev, newDoc]);
        showToast(`Document attached: ${file.name}`);
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const addSampleInvoiceDocs = () => {
    const samples: InvoiceDoc[] = [
      { id: 'sample_rc', name: "Official_RC_SmartCard.jpg", url: "/public/assets/aistudio/image_f4045ab9.png", type: "rc", size: "380 KB" },
      { id: 'sample_ins', name: "Comprehensive_Vehicle_Insurance.pdf", url: "/public/assets/aistudio/image_f4045ab9.png", type: "insurance", size: "520 KB" },
      { id: 'sample_del', name: "Delivery_Ceremony_Handover.jpg", url: "/public/assets/aistudio/image_b40a39bd.png", type: "photo", size: "850 KB" }
    ];
    setInvoiceFormDocs(prev => [...prev, ...samples]);
    showToast("Added sample showroom vehicle documents!");
  };

  const downloadInvoice = (inv: InvoiceItem) => {
    const invoiceHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Tax Invoice - ${inv.invoice_number} - Adarsh Motors</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; margin: 0; padding: 28px; color: #0f172a; background: #ffffff; }
    .invoice-card { max-width: 820px; margin: 0 auto; border: 1.5px solid #cbd5e1; border-radius: 12px; padding: 32px; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.08); }
    .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2.5px solid #0f172a; padding-bottom: 20px; }
    .brand { font-size: 26px; font-weight: 900; letter-spacing: -0.5px; text-transform: uppercase; color: #0f172a; }
    .brand span { color: #dc2626; }
    .tagline { font-size: 11px; font-weight: 800; letter-spacing: 2.5px; color: #64748b; margin-top: 2px; }
    .reg-plate { display: inline-block; background: #fef2f2; color: #991b1b; border: 1.5px solid #ef4444; font-family: "Courier New", monospace; font-weight: 900; padding: 5px 12px; border-radius: 6px; font-size: 14px; margin-top: 8px; letter-spacing: 1.5px; }
    .tax-badge { background: #fee2e2; color: #b91c1c; font-weight: 900; padding: 4px 12px; border-radius: 6px; font-size: 11px; display: inline-block; margin-bottom: 8px; }
    .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 24px 0; padding: 18px; background: #f8fafc; border-radius: 10px; border: 1px solid #e2e8f0; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 13px; }
    th { background: #f1f5f9; padding: 10px 14px; text-align: left; font-size: 11px; font-weight: 800; text-transform: uppercase; color: #475569; border-bottom: 2px solid #cbd5e1; }
    td { padding: 14px; border-bottom: 1px solid #e2e8f0; }
    .total-box { margin-top: 24px; display: flex; justify-content: space-between; align-items: flex-end; border-top: 2px solid #e2e8f0; padding-top: 18px; }
    .paid-stamp { border: 2px solid #16a34a; color: #15803d; font-weight: 900; text-transform: uppercase; padding: 6px 14px; border-radius: 6px; font-size: 13px; display: inline-flex; align-items: center; letter-spacing: 1px; }
    .footer-note { margin-top: 36px; padding-top: 18px; border-top: 1px dashed #cbd5e1; font-size: 11px; color: #64748b; display: flex; justify-content: space-between; }
    @media print {
      body { padding: 0; background: transparent; }
      .invoice-card { border: none; box-shadow: none; padding: 0; }
    }
  </style>
</head>
<body>
  <div class="invoice-card">
    <div class="header">
      <div>
        <div class="brand">ADARSH <span>MOTORS</span></div>
        <div class="tagline">PERFORMANCE. REFINED.</div>
        <div style="font-size: 12px; color: #475569; margin-top: 8px;">${settings.address}</div>
        <div style="font-size: 12px; color: #475569;">Tel: ${settings.salesPhone} · GSTIN: 36AADCA1234F1Z8</div>
      </div>
      <div style="text-align: right;">
        <div class="tax-badge">OFFICIAL GST TAX INVOICE</div>
        <div style="font-size: 11px; color: #64748b;">INVOICE NUMBER</div>
        <div style="font-size: 18px; font-weight: 900; font-family: monospace; color: #0f172a;">${inv.invoice_number}</div>
        <div style="font-size: 11px; color: #64748b; margin-top: 3px;">DATE: ${new Date(inv.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
        <div class="reg-plate">REG #: ${inv.reg_number}</div>
      </div>
    </div>

    <div class="meta-grid">
      <div>
        <div style="font-size: 10px; font-weight: 800; color: #64748b; text-transform: uppercase; margin-bottom: 4px;">BUYER (CUSTOMER) DETAILS</div>
        <div style="font-size: 15px; font-weight: 900; color: #0f172a;">${inv.customer_name}</div>
        <div style="font-size: 13px; font-family: monospace; color: #334155; margin-top: 2px;">+91 ${inv.mobile}</div>
        <div style="font-size: 11px; color: #64748b; margin-top: 4px;">State of Supply: Telangana (36)</div>
      </div>
      <div>
        <div style="font-size: 10px; font-weight: 800; color: #64748b; text-transform: uppercase; margin-bottom: 4px;">PAYMENT & FULFILLMENT</div>
        <div style="font-size: 13px; color: #334155;">Payment Mode: <strong style="color: #0f172a;">${inv.payment_mode}</strong></div>
        <div style="font-size: 13px; color: #334155; margin-top: 2px;">Status: <strong style="color: #16a34a;">PAID IN FULL</strong></div>
        ${inv.has_echarger ? `<div style="font-size: 12px; color: #b45309; margin-top: 4px; font-weight: 700;">⚡ E-Charger: ${inv.echarger_details || 'Fast Home Charging Kit Included'}</div>` : ''}
        ${inv.notes ? `<div style="font-size: 11px; color: #64748b; margin-top: 4px;">Delivery Remarks: ${inv.notes}</div>` : ''}
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>DESCRIPTION OF VEHICLE & REGISTRATION</th>
          <th style="text-align: center;">HSN CODE</th>
          <th style="text-align: right;">QTY</th>
          <th style="text-align: right;">AMOUNT (INR)</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style="font-family: monospace;">01</td>
          <td>
            <div style="font-weight: 900; font-size: 14px; color: #0f172a;">${inv.vehicle}</div>
            <div style="font-family: monospace; font-size: 12px; color: #dc2626; font-weight: 800; margin-top: 3px;">
              Permanent Reg No: ${inv.reg_number}
            </div>
            ${inv.has_echarger ? `<div style="font-size: 12px; color: #b45309; margin-top: 2px; font-weight: 600;">⚡ E-Charger Kit: ${inv.echarger_details}</div>` : ''}
            <div style="font-size: 11px; color: #64748b; margin-top: 3px;">Certified Showroom Pre-Delivery Inspection Passed</div>
          </td>
          <td style="text-align: center; font-family: monospace;">8711</td>
          <td style="text-align: right; font-family: monospace;">1</td>
          <td style="text-align: right; font-family: monospace; font-weight: 800; font-size: 15px; color: #0f172a;">
            ₹${Number(inv.price).toLocaleString('en-IN')}
          </td>
        </tr>
      </tbody>
    </table>

    <div class="total-box">
      <div>
        <div class="paid-stamp">✓ OFFICIALLY SETTLED & DELIVERED</div>
        <div style="font-size: 10px; color: #64748b; margin-top: 6px;">Computer generated tax invoice. Subject to Hyderabad jurisdiction.</div>
      </div>
      <div style="text-align: right; width: 260px; font-size: 13px;">
        <div style="display: flex; justify-content: space-between; color: #64748b; margin-bottom: 4px;">
          <span>Taxable Value:</span>
          <span style="font-family: monospace;">₹${Math.round(inv.price / 1.18).toLocaleString('en-IN')}</span>
        </div>
        <div style="display: flex; justify-content: space-between; color: #64748b; margin-bottom: 6px;">
          <span>CGST + SGST (18%):</span>
          <span style="font-family: monospace;">₹${Math.round(inv.price - (inv.price / 1.18)).toLocaleString('en-IN')}</span>
        </div>
        <div style="display: flex; justify-content: space-between; font-weight: 900; font-size: 18px; color: #dc2626; border-top: 2.5px solid #0f172a; padding-top: 6px;">
          <span>Grand Total:</span>
          <span style="font-family: monospace;">₹${Number(inv.price).toLocaleString('en-IN')}</span>
        </div>
      </div>
    </div>

    ${inv.documents && inv.documents.length > 0 ? `
    <div style="margin-top: 24px; padding: 14px; background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0;">
      <div style="font-size: 11px; font-weight: 800; color: #334155; text-transform: uppercase; margin-bottom: 8px;">
        ATTACHED VEHICLE PAPERS & VERIFIED DOCUMENTS (${inv.documents.length})
      </div>
      <div style="display: flex; flex-wrap: wrap; gap: 8px;">
        ${inv.documents.map(d => `<span style="font-size: 11px; padding: 4px 10px; background: #e2e8f0; border-radius: 6px; font-family: monospace; font-weight: 700;">📄 ${d.name} [${d.type.toUpperCase()}]</span>`).join('')}
      </div>
    </div>
    ` : ''}

    <div class="footer-note">
      <div>Authorized Signatory: <strong>Adarsh Motors Dealership Pvt Ltd</strong></div>
      <div>Customer Verification Phone: <strong>+91 ${inv.mobile}</strong></div>
    </div>
  </div>
</body>
</html>`;

    const blob = new Blob([invoiceHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Adarsh_Motors_Invoice_${inv.invoice_number}_${inv.reg_number.replace(/\s+/g, '_')}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(`Downloaded Invoice ${inv.invoice_number}!`);
  };

  const handleCustomerLookup = (query: string) => {
    const cleanQ = query.trim().toUpperCase();
    const rawQPhone = cleanPhone(query);

    if (!cleanQ) {
      setCustomerLookupError('Please enter your Mobile Number or Vehicle Reg Number');
      return;
    }

    const match = invoices.find(inv => {
      const matchPhone = cleanPhone(inv.mobile) === rawQPhone;
      const matchReg = inv.reg_number && inv.reg_number.toUpperCase().replace(/\s+/g, '') === cleanQ.replace(/\s+/g, '');
      const matchInv = inv.invoice_number.toUpperCase() === cleanQ;
      return matchPhone || matchReg || matchInv;
    });

    if (match) {
      setCustomerLookupResult(match);
      setCustomerLookupError('');
      showToast(`Vehicle & invoice retrieved for ${match.customer_name}!`);
    } else {
      setCustomerLookupError(`No record found for "${query}". Check your 10-digit mobile number or vehicle reg number.`);
      setCustomerLookupResult(null);
    }
  };

  // Filters & Search
  const [globalSearch, setGlobalSearch] = useState('');
  const [inventorySearch, setInventorySearch] = useState('');
  const [inventoryCatFilter, setInventoryCatFilter] = useState('ALL');
  const [inventoryStatusFilter, setInventoryStatusFilter] = useState('ALL');
  const [leadsSearch, setLeadsSearch] = useState('');
  const [leadsStatusFilter, setLeadsStatusFilter] = useState('ALL');
  const [trendRange, setTrendRange] = useState<7 | 15 | 30>(30);

  // Toast Trigger
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Sync to localStorage
  useEffect(() => {
    try { localStorage.setItem('adarsh_bikes', JSON.stringify(bikes)); } catch {}
  }, [bikes]);
  useEffect(() => {
    try { localStorage.setItem('adarsh_leads', JSON.stringify(leads)); } catch {}
  }, [leads]);
  useEffect(() => {
    try { localStorage.setItem('adarsh_invoices', JSON.stringify(invoices)); } catch {}
  }, [invoices]);
  useEffect(() => {
    try { localStorage.setItem('adarsh_branches', JSON.stringify(branches)); } catch {}
  }, [branches]);
  useEffect(() => {
    try { localStorage.setItem('adarsh_staff', JSON.stringify(staff)); } catch {}
  }, [staff]);
  useEffect(() => {
    try { localStorage.setItem('adarsh_settings', JSON.stringify(settings)); } catch {}
  }, [settings]);
  useEffect(() => {
    try { localStorage.setItem('adarsh_audit_logs', JSON.stringify(auditLogs)); } catch {}
  }, [auditLogs]);

  // Strict Access Guard: If current activeTab is not permitted for the user, auto-redirect to first permitted module
  useEffect(() => {
    if (currentUser) {
      if (!hasAccess(activeTab)) {
        const priorityTabs: ('leads' | 'inventory' | 'billing' | 'branches' | 'settings' | 'overview')[] = [
          'leads', 'inventory', 'billing', 'branches', 'settings', 'overview'
        ];
        const nextAllowed = priorityTabs.find(tab => hasAccess(tab));
        if (nextAllowed) {
          setActiveTab(nextAllowed);
        } else if (currentUser.permissions && currentUser.permissions.length > 0) {
          const first = currentUser.permissions[0];
          if (['inventory', 'leads', 'billing', 'branches', 'settings', 'overview'].includes(first)) {
            setActiveTab(first as any);
          }
        }
      }
    }
  }, [currentUser, activeTab]);

  // Try background Supabase Sync on Mount
  useEffect(() => {
    const fetchSupabase = async () => {
      try {
        const { data: bData } = await supabase.from('bikes').select('*');
        if (bData && bData.length > 0) setBikes(bData as BikeItem[]);

        const { data: lData } = await supabase.from('leads').select('*').order('created_at', { ascending: false });
        if (lData && lData.length > 0) setLeads(lData as LeadItem[]);

        const { data: iData } = await supabase.from('invoices').select('*').order('created_at', { ascending: false });
        if (iData && iData.length > 0) setInvoices(iData as InvoiceItem[]);

        const { data: brData } = await supabase.from('branches').select('*');
        if (brData && brData.length > 0) setBranches(brData as BranchItem[]);

        const { data: stData } = await supabase.from('staff_users').select('*');
        if (stData && stData.length > 0) setStaff(stData as StaffItem[]);
      } catch (err) {
        console.warn("Supabase query sync notice", err);
      }
    };
    fetchSupabase();
  }, []);

  // Format INR Currency
  const formatINR = (val: number) => {
    return '₹' + Number(val || 0).toLocaleString('en-IN');
  };

  // Clean phone helper
  const cleanPhone = (p: string) => p.replace(/\D/g, '').slice(-10);

  // Authentication Handler
  const handleAuth = async (inputPhone: string, inputPin: string) => {
    const rawP = cleanPhone(inputPhone);
    const pin = inputPin.trim();

    if (!rawP || !pin) {
      setLoginError('Please enter both phone number and PIN.');
      return;
    }

    setIsLoggingIn(true);
    setLoginError('');

    // 1. OWNER LOGIN CHECK
    if (rawP === OWNER_PHONE && OWNER_PINS.includes(pin)) {
      const ownerSession: UserSession = {
        name: "Pavan Kumar",
        phone: OWNER_PHONE,
        role: "owner",
        permissions: ["all"]
      };
      setCurrentUser(ownerSession);
      try { sessionStorage.setItem('adarsh_session', JSON.stringify(ownerSession)); } catch {}
      setActiveTab('overview');
      logAuditAction(
        'login',
        'Auth',
        `Owner Pavan Kumar authenticated into master portal (${window.innerWidth < 768 ? 'Mobile Phone' : 'Desktop'})`,
        undefined,
        'Pavan Kumar (Owner)',
        { notes: `Master admin credentials authorized from ${window.innerWidth < 768 ? 'Mobile Browser' : 'Desktop Browser'}` }
      );
      showToast('Authenticated as Owner / Super Admin');
      setIsLoggingIn(false);
      return;
    }

    // 2. STAFF LOGIN CHECK (Supabase with fast timeout fallback)
    let staffMatch: StaffItem | undefined;

    try {
      const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 1500));
      const supabaseQuery = supabase.from('staff_users').select('*').eq('phone', rawP).eq('pin', pin).single();
      const res: any = await Promise.race([supabaseQuery, timeoutPromise]);
      if (res?.data) {
        staffMatch = {
          id: res.data.id,
          name: res.data.name,
          phone: res.data.phone,
          pin: res.data.pin,
          role: 'staff',
          permissions: Array.isArray(res.data.permissions) ? res.data.permissions : JSON.parse(res.data.permissions || '[]'),
          status: res.data.status || 'Active'
        };
      }
    } catch {}

    // Fallback to local staff array
    if (!staffMatch) {
      staffMatch = staff.find(s => cleanPhone(s.phone) === rawP && s.pin === pin);
    }

    if (staffMatch) {
      const staffSession: UserSession = {
        name: staffMatch.name,
        phone: staffMatch.phone,
        role: "staff",
        permissions: staffMatch.permissions || []
      };
      setCurrentUser(staffSession);
      try { sessionStorage.setItem('adarsh_session', JSON.stringify(staffSession)); } catch {}
      
      // STRICT TAB ROUTING: Navigate only to their permitted module (NEVER default to Overview unless explicitly granted)
      const allowed = staffMatch.permissions || [];
      if (allowed.includes('leads')) setActiveTab('leads');
      else if (allowed.includes('inventory')) setActiveTab('inventory');
      else if (allowed.includes('billing')) setActiveTab('billing');
      else if (allowed.includes('branches')) setActiveTab('branches');
      else if (allowed.includes('settings')) setActiveTab('settings');
      else if (allowed.includes('overview')) setActiveTab('overview');
      else if (allowed.length > 0) setActiveTab(allowed[0] as any);

      logAuditAction(
        'login',
        'Auth',
        `Staff member ${staffMatch.name} signed in (${window.innerWidth < 768 ? 'Mobile Phone' : 'Desktop'})`,
        staffMatch.id,
        `${staffMatch.name} (+91 ${staffMatch.phone})`,
        { notes: `Granted modules: ${allowed.join(', ') || 'None'}` }
      );

      showToast(`Welcome back, ${staffMatch.name}!`);
    } else {
      setLoginError('Invalid phone number or PIN. Check credentials.');
    }
    setIsLoggingIn(false);
  };

  const handleLogout = () => {
    if (currentUser) {
      logAuditAction(
        'login',
        'Auth',
        `${currentUser.name} (${currentUser.role === 'owner' ? 'Owner' : 'Staff'}) logged out from admin portal`,
        undefined,
        currentUser.name,
        { notes: 'Session ended by user' }
      );
    }
    setCurrentUser(null);
    try { sessionStorage.removeItem('adarsh_session'); } catch {}
    setLoginPhone('');
    setLoginPin('');
    showToast('Signed out successfully.');
  };

  // Permission Checker - Strict Multi-Role Enforcement
  const hasAccess = (module: string) => {
    if (!currentUser) return false;
    // Owner has master authority over all sections
    if (currentUser.role === 'owner') return true;

    // Staff / Worker can NEVER access Staff Access or the Audit History
    if (module === 'staff' || module === 'audit') return false;

    // Overview is strictly gated: only visible if explicitly in staff permissions
    if (module === 'overview') {
      return currentUser.permissions.includes('overview');
    }

    // Workers only see explicitly granted permissions (e.g., ['leads'] or ['inventory', 'leads'])
    return currentUser.permissions.includes(module) || currentUser.permissions.includes('all');
  };

  // Overview metrics
  const activeBikesCount = useMemo(() => bikes.filter(b => b.status === 'Available').length, [bikes]);
  const totalRevenue = useMemo(() => invoices.reduce((acc, curr) => acc + Number(curr.price || 0), 0), [invoices]);
  const newLeadsCount = useMemo(() => leads.filter(l => l.status === 'New').length, [leads]);

  // Inventory Filtering
  const filteredBikes = useMemo(() => {
    const q = inventorySearch.toLowerCase();
    return bikes.filter(b => {
      const matchesSearch = b.name.toLowerCase().includes(q) || b.brand.toLowerCase().includes(q);
      const matchesCat = inventoryCatFilter === 'ALL' || b.category === inventoryCatFilter;
      const matchesStatus = inventoryStatusFilter === 'ALL' || b.status === inventoryStatusFilter;
      return matchesSearch && matchesCat && matchesStatus;
    });
  }, [bikes, inventorySearch, inventoryCatFilter, inventoryStatusFilter]);

  // Leads Filtering
  const filteredLeads = useMemo(() => {
    const q = leadsSearch.toLowerCase();
    return leads.filter(l => {
      const matchesSearch = l.customer_name.toLowerCase().includes(q) || l.phone.includes(q) || (l.bike_interested && l.bike_interested.toLowerCase().includes(q));
      const matchesStatus = leadsStatusFilter === 'ALL' || l.status === leadsStatusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [leads, leadsSearch, leadsStatusFilter]);

  // Audit Logs Filtering
  const filteredAuditLogs = useMemo(() => {
    const q = auditSearch.toLowerCase().trim();
    return auditLogs.filter(log => {
      const matchesSearch = !q ||
        log.staff_name.toLowerCase().includes(q) ||
        log.staff_phone.includes(q) ||
        log.description.toLowerCase().includes(q) ||
        log.module.toLowerCase().includes(q) ||
        (log.target_name && log.target_name.toLowerCase().includes(q)) ||
        (log.details?.notes && log.details.notes.toLowerCase().includes(q));
      const matchesStaff = auditStaffFilter === 'ALL' || log.staff_name.includes(auditStaffFilter);
      const matchesModule = auditModuleFilter === 'ALL' || log.module === auditModuleFilter;
      return matchesSearch && matchesStaff && matchesModule;
    });
  }, [auditLogs, auditSearch, auditStaffFilter, auditModuleFilter]);

  // WhatsApp Link Helper
  const getWhatsAppLink = (phone: string, name: string, bike: string) => {
    const p = cleanPhone(phone);
    const finalPhone = p.startsWith('91') ? p : '91' + p;
    const msg = encodeURIComponent(`Hello ${name || 'Sir/Madam'}, thank you for contacting Adarsh Motors regarding the ${bike || 'vehicle'}. I'm following up on your enquiry. When would be a good time for a test ride or showroom visit?`);
    return `https://wa.me/${finalPhone}?text=${msg}`;
  };

  // ==============================================================
  // RENDER AUTH MODAL (IF NOT LOGGED IN)
  // ==============================================================
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#080E17] text-slate-200 flex items-center justify-center p-4 relative overflow-hidden font-sans">
        {/* Glow Spheres */}
        <div className="absolute -top-32 -left-32 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="w-full max-w-lg bg-[#0B1320]/90 backdrop-blur-xl border border-white/10 p-6 sm:p-8 rounded-2xl shadow-2xl relative z-10">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-red-600/15 border border-red-500/30 text-red-500 mb-3 shadow-lg shadow-red-600/20">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white uppercase">
              ADARSH <span className="text-red-500">MOTORS</span>
            </h1>
            <p className="text-[11px] font-bold tracking-widest text-slate-400 uppercase mt-0.5">
              OPERATIONS & CUSTOMER OWNERSHIP PORTAL
            </p>
          </div>

          {/* Mode Selector Tabs */}
          <div className="grid grid-cols-2 p-1 bg-[#080E17] border border-white/10 rounded-xl mb-6">
            <button
              type="button"
              onClick={() => { setAuthViewMode('admin'); setCustomerLookupError(''); }}
              className={`py-2 text-xs font-bold rounded-lg transition flex items-center justify-center gap-2 ${
                authViewMode === 'admin'
                  ? 'bg-red-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Crown className="w-3.5 h-3.5" />
              <span>Staff / Owner</span>
            </button>
            <button
              type="button"
              onClick={() => { setAuthViewMode('customer'); setLoginError(''); }}
              className={`py-2 text-xs font-bold rounded-lg transition flex items-center justify-center gap-2 ${
                authViewMode === 'customer'
                  ? 'bg-red-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Car className="w-3.5 h-3.5" />
              <span>Customer / Buyer</span>
            </button>
          </div>

          {authViewMode === 'admin' ? (
            <>
              <p className="text-xs text-slate-400 text-center mb-4">
                Sign in with your authorized dealership Phone Number and secure PIN
              </p>

              <form onSubmit={(e) => { e.preventDefault(); handleAuth(loginPhone, loginPin); }} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">Phone Number</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                      <Phone className="w-4 h-4" />
                    </span>
                    <input
                      type="tel"
                      required
                      value={loginPhone}
                      onChange={(e) => setLoginPhone(e.target.value)}
                      placeholder="e.g. 9014540489"
                      className="w-full pl-10 pr-4 py-2.5 bg-[#0F1A2C] border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500 font-mono transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">Security PIN</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                      <KeyRound className="w-4 h-4" />
                    </span>
                    <input
                      type="password"
                      required
                      value={loginPin}
                      onChange={(e) => setLoginPin(e.target.value)}
                      placeholder="Enter PIN"
                      className="w-full pl-10 pr-4 py-2.5 bg-[#0F1A2C] border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500 font-mono transition"
                    />
                  </div>
                </div>

                {loginError && (
                  <div className="text-xs text-red-400 bg-red-950/40 border border-red-500/30 p-2.5 rounded-lg flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                    <span>{loginError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoggingIn}
                  className="w-full py-3 px-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-semibold rounded-xl text-sm tracking-wide shadow-lg shadow-red-600/30 transition flex items-center justify-center gap-2 active:scale-[0.98]"
                >
                  <span>{isLoggingIn ? 'Verifying...' : 'Authorize Access'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Quick Demo Fill Buttons */}
              <div className="mt-6 pt-5 border-t border-white/10">
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2.5 text-center">
                  1-Tap Staff / Owner Quick Access
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setLoginPhone('9014540489');
                      setLoginPin('1234');
                      handleAuth('9014540489', '1234');
                    }}
                    className="p-2.5 rounded-xl bg-[#0F1A2C] hover:bg-[#16243C] border border-white/10 text-left transition flex flex-col group"
                  >
                    <span className="font-bold text-red-400 flex items-center gap-1 group-hover:text-red-300">
                      <Crown className="w-3.5 h-3.5" /> Owner Login
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono mt-0.5">9014540489 · 1234</span>
                    <span className="text-[10px] text-slate-500 mt-0.5">All 7 Modules</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setLoginPhone('9876543210');
                      setLoginPin('2026');
                      handleAuth('9876543210', '2026');
                    }}
                    className="p-2.5 rounded-xl bg-[#0F1A2C] hover:bg-[#16243C] border border-white/10 text-left transition flex flex-col group"
                  >
                    <span className="font-bold text-cyan-400 flex items-center gap-1 group-hover:text-cyan-300">
                      <UserCheck className="w-3.5 h-3.5" /> Staff Login
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono mt-0.5">9876543210 · 2026</span>
                    <span className="text-[10px] text-slate-500 mt-0.5">Billing & Inventory</span>
                  </button>
                </div>
              </div>
            </>
          ) : (
            /* CUSTOMER VEHICLE & DOCUMENT LOOKUP */
            <div className="space-y-4">
              <p className="text-xs text-slate-400 text-center">
                Purchased a vehicle? View your vehicle details, RC papers, insurance copies, E-charger details, and official tax invoices anytime.
              </p>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleCustomerLookup(customerSearchInput);
                }}
                className="space-y-3"
              >
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Mobile Number OR Vehicle Registration #
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                      <Search className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      required
                      value={customerSearchInput}
                      onChange={(e) => setCustomerSearchInput(e.target.value)}
                      placeholder="e.g. 9123456789 or TS 09 EQ 4200"
                      className="w-full pl-10 pr-4 py-2.5 bg-[#0F1A2C] border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500 font-mono transition uppercase"
                    />
                  </div>
                </div>

                {customerLookupError && (
                  <div className="text-xs text-red-400 bg-red-950/40 border border-red-500/30 p-2.5 rounded-lg flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                    <span>{customerLookupError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-semibold rounded-xl text-sm tracking-wide shadow-lg shadow-red-600/30 transition flex items-center justify-center gap-2"
                >
                  <Car className="w-4 h-4" />
                  <span>Lookup Vehicle & Documents</span>
                </button>
              </form>

              {/* Customer Quick Lookup Demos */}
              <div className="pt-4 border-t border-white/10">
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 text-center">
                  Quick Customer Lookup Demo
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setCustomerSearchInput('TS 09 EQ 4200');
                      handleCustomerLookup('TS 09 EQ 4200');
                    }}
                    className="p-2 rounded-xl bg-[#0F1A2C] hover:bg-[#16243C] border border-white/10 text-left transition"
                  >
                    <div className="font-bold text-white truncate">Ananya Deshmukh</div>
                    <div className="text-[10px] text-red-400 font-mono">TS 09 EQ 4200</div>
                    <div className="text-[9px] text-slate-400">Activa 6G + E-Charger</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setCustomerSearchInput('9440122334');
                      handleCustomerLookup('9440122334');
                    }}
                    className="p-2 rounded-xl bg-[#0F1A2C] hover:bg-[#16243C] border border-white/10 text-left transition"
                  >
                    <div className="font-bold text-white truncate">Rajesh Goud</div>
                    <div className="text-[10px] text-red-400 font-mono">TS 07 HK 1122</div>
                    <div className="text-[9px] text-slate-400">Hunter 350 + RC Papers</div>
                  </button>
                </div>
              </div>

              {/* Retrieved Customer Vehicle Record Card */}
              {customerLookupResult && (
                <div className="mt-4 p-4 rounded-xl bg-[#080E17] border border-emerald-500/30 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                        Verified Purchase
                      </span>
                      <h3 className="text-sm font-bold text-white mt-1.5">{customerLookupResult.vehicle}</h3>
                      <div className="text-xs text-slate-400 font-mono">Owner: {customerLookupResult.customer_name} (+91 {customerLookupResult.mobile})</div>
                    </div>
                    <div className="text-right">
                      <span className="px-2.5 py-1 rounded bg-red-950/80 border border-red-800 text-red-400 font-mono font-bold text-xs">
                        {customerLookupResult.reg_number}
                      </span>
                    </div>
                  </div>

                  {customerLookupResult.has_echarger && (
                    <div className="p-2 rounded bg-amber-950/40 border border-amber-800/40 text-[11px] text-amber-300 flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{customerLookupResult.echarger_details || 'Fast Home Charger Included'}</span>
                    </div>
                  )}

                  {/* Documents Section */}
                  {customerLookupResult.documents && customerLookupResult.documents.length > 0 && (
                    <div>
                      <div className="text-[11px] font-semibold text-slate-400 mb-1.5 flex items-center gap-1">
                        <FileText className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Uploaded Documents & Vehicle Photos ({customerLookupResult.documents.length})</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {customerLookupResult.documents.map((doc, idx) => (
                          <div
                            key={idx}
                            onClick={() => setPreviewDocModal(doc)}
                            className="p-2 rounded-lg bg-[#0F1A2C] border border-white/10 hover:border-red-500/50 cursor-pointer transition flex items-center gap-2"
                          >
                            <div className="w-8 h-8 rounded bg-[#080E17] flex items-center justify-center shrink-0 text-slate-400">
                              {doc.type === 'photo' ? <Camera className="w-4 h-4 text-cyan-400" /> : <FileText className="w-4 h-4 text-amber-400" />}
                            </div>
                            <div className="truncate text-left">
                              <div className="text-[11px] font-medium text-slate-200 truncate">{doc.name}</div>
                              <div className="text-[9px] uppercase font-bold text-red-400">{doc.type}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons: View, Download & Print */}
                  <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => setShowPrintInvoiceModal(customerLookupResult)}
                      className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-semibold flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Tax Invoice</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => downloadInvoice(customerLookupResult)}
                      className="px-3 py-1.5 rounded-lg bg-[#0F1A2C] hover:bg-[#16243C] text-slate-200 border border-white/10 text-xs font-semibold flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Download Invoice</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ==============================================================
  // MAIN APPLICATION SHELL (AUTHENTICATED)
  // ==============================================================
  return (
    <div className="min-h-screen bg-[#080E17] text-slate-200 flex flex-col md:flex-row relative font-sans selection:bg-red-600 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 p-3.5 rounded-xl bg-[#0F1A2C] border border-red-500/30 shadow-2xl flex items-center gap-2.5 text-xs text-white animate-fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex flex-col w-64 bg-[#0B1320]/80 backdrop-blur-xl border-r border-white/10 shrink-0 sticky top-0 h-screen overflow-y-auto">
        {/* Brand Lockup */}
        <div className="p-5 border-b border-white/10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center text-white shadow-md shadow-red-600/30 font-extrabold text-lg">
            AM
          </div>
          <div>
            <div className="font-extrabold text-base tracking-tight text-white leading-tight">
              ADARSH <span className="text-red-500">MOTORS</span>
            </div>
            <div className="text-[10px] tracking-widest text-slate-400 font-semibold uppercase">
              OPERATIONS PORTAL
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-3 space-y-1.5">
          {hasAccess('overview') && (
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
                activeTab === 'overview'
                  ? 'bg-red-600/15 border border-red-500/30 text-red-400 font-semibold'
                  : 'text-slate-400 hover:text-white hover:bg-[#0F1A2C]'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Overview</span>
            </button>
          )}

          {hasAccess('inventory') && (
            <button
              onClick={() => setActiveTab('inventory')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
                activeTab === 'inventory'
                  ? 'bg-red-600/15 border border-red-500/30 text-red-400 font-semibold'
                  : 'text-slate-400 hover:text-white hover:bg-[#0F1A2C]'
              }`}
            >
              <Bike className="w-4 h-4" />
              <span>Inventory Manager</span>
              <span className="ml-auto text-xs font-mono px-2 py-0.5 rounded-md bg-[#0F1A2C] text-slate-300">
                {bikes.length}
              </span>
            </button>
          )}

          {hasAccess('leads') && (
            <button
              onClick={() => setActiveTab('leads')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
                activeTab === 'leads'
                  ? 'bg-red-600/15 border border-red-500/30 text-red-400 font-semibold'
                  : 'text-slate-400 hover:text-white hover:bg-[#0F1A2C]'
              }`}
            >
              <PhoneCall className="w-4 h-4" />
              <span>Leads CRM</span>
              <span className="ml-auto text-xs font-mono px-2 py-0.5 rounded-md bg-red-950 text-red-400 border border-red-900">
                {newLeadsCount}
              </span>
            </button>
          )}

          {hasAccess('billing') && (
            <button
              onClick={() => setActiveTab('billing')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
                activeTab === 'billing'
                  ? 'bg-red-600/15 border border-red-500/30 text-red-400 font-semibold'
                  : 'text-slate-400 hover:text-white hover:bg-[#0F1A2C]'
              }`}
            >
              <Receipt className="w-4 h-4" />
              <span>Digital Billing</span>
            </button>
          )}

          {hasAccess('branches') && (
            <button
              onClick={() => setActiveTab('branches')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
                activeTab === 'branches'
                  ? 'bg-red-600/15 border border-red-500/30 text-red-400 font-semibold'
                  : 'text-slate-400 hover:text-white hover:bg-[#0F1A2C]'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>Branch Manager</span>
            </button>
          )}

          {hasAccess('settings') && (
            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
                activeTab === 'settings'
                  ? 'bg-red-600/15 border border-red-500/30 text-red-400 font-semibold'
                  : 'text-slate-400 hover:text-white hover:bg-[#0F1A2C]'
              }`}
            >
              <Sliders className="w-4 h-4" />
              <span>CMS & Social Links</span>
            </button>
          )}

          {/* Owner Only: Staff Activity & Forensic Audit Log */}
          {currentUser.role === 'owner' && (
            <button
              onClick={() => setActiveTab('audit')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
                activeTab === 'audit'
                  ? 'bg-red-600/15 border border-red-500/30 text-red-400 font-semibold shadow-lg shadow-red-950/40'
                  : 'text-slate-400 hover:text-white hover:bg-[#0F1A2C]'
              }`}
            >
              <History className="w-4 h-4 text-amber-400" />
              <span>Staff Activity & Audit</span>
              <span className="ml-auto text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-red-500/15 text-red-400 border border-red-500/25">
                Owner
              </span>
            </button>
          )}

          {/* Owner Only: Staff Access */}
          {currentUser.role === 'owner' && (
            <button
              onClick={() => setActiveTab('staff')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
                activeTab === 'staff'
                  ? 'bg-red-600/15 border border-red-500/30 text-red-400 font-semibold'
                  : 'text-slate-400 hover:text-white hover:bg-[#0F1A2C]'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Staff Access</span>
              <span className="ml-auto text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                Owner
              </span>
            </button>
          )}
        </nav>

        {/* Supabase Status & SQL Schema Helper */}
        <div className="px-4 py-3 mx-3 mb-3 rounded-xl bg-[#0F1A2C]/80 border border-white/5 text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-slate-300 font-medium">Supabase Backend</span>
            </div>
            <button onClick={() => setShowSqlModal(true)} className="text-[11px] text-cyan-400 hover:underline">
              SQL
            </button>
          </div>
          <div className="text-[11px] text-slate-500 mt-1 font-mono truncate">
            nwdgayanhwzxivqlspdd
          </div>
        </div>

        {/* User Profile Card & Sign Out */}
        <div className="p-4 border-t border-white/10 bg-[#080E17]/50 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-slate-800 border border-white/10 flex items-center justify-center font-bold text-white text-xs shrink-0">
              {currentUser.name.slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-white truncate">{currentUser.name}</div>
              <div className="text-[10px] text-red-400 truncate">
                {currentUser.role === 'owner' ? 'Owner / Super Admin' : 'Showroom Staff'}
              </div>
            </div>
          </div>
          <button onClick={handleLogout} title="Sign Out" className="p-2 text-slate-400 hover:text-white hover:bg-[#0F1A2C] rounded-lg transition">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* MOBILE TOP BAR */}
      <header className="md:hidden bg-[#0B1320] border-b border-white/10 p-3.5 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center font-extrabold text-white text-sm shadow-md shadow-red-600/30">
            AM
          </div>
          <div>
            <span className="font-extrabold text-sm text-white tracking-tight">
              ADARSH <span className="text-red-500">MOTORS</span>
            </span>
            <div className="text-[9px] text-slate-400 font-medium leading-none">
              {currentUser.name} · <span className="text-red-400 font-bold uppercase">{currentUser.role}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-950 text-red-400 border border-red-900">
            {currentUser.role === 'owner' ? 'Owner' : 'Staff'}
          </span>
          <button onClick={handleLogout} className="p-1.5 text-slate-400 hover:text-white" title="Sign Out">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* MOBILE HORIZONTAL TAB SELECTOR */}
      <div className="md:hidden bg-[#080E17]/95 border-b border-white/10 px-3 py-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth sticky top-[57px] z-20 backdrop-blur-md">
        {hasAccess('overview') && (
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 flex items-center gap-1.5 transition ${
              activeTab === 'overview'
                ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                : 'bg-[#0F1A2C] text-slate-400 hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Overview</span>
          </button>
        )}

        {hasAccess('inventory') && (
          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 flex items-center gap-1.5 transition ${
              activeTab === 'inventory'
                ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                : 'bg-[#0F1A2C] text-slate-400 hover:text-white'
            }`}
          >
            <Bike className="w-3.5 h-3.5" />
            <span>Inventory</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-black/40 text-slate-300 font-mono">{bikes.length}</span>
          </button>
        )}

        {hasAccess('leads') && (
          <button
            onClick={() => setActiveTab('leads')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 flex items-center gap-1.5 transition ${
              activeTab === 'leads'
                ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                : 'bg-[#0F1A2C] text-slate-400 hover:text-white'
            }`}
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Leads CRM</span>
            {newLeadsCount > 0 && (
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-red-950 text-red-300 font-mono">{newLeadsCount}</span>
            )}
          </button>
        )}

        {hasAccess('billing') && (
          <button
            onClick={() => setActiveTab('billing')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 flex items-center gap-1.5 transition ${
              activeTab === 'billing'
                ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                : 'bg-[#0F1A2C] text-slate-400 hover:text-white'
            }`}
          >
            <Receipt className="w-3.5 h-3.5" />
            <span>Billing</span>
          </button>
        )}

        {currentUser.role === 'owner' && (
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 flex items-center gap-1.5 transition ${
              activeTab === 'audit'
                ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                : 'bg-[#0F1A2C] text-amber-400 hover:text-white border border-amber-500/20'
            }`}
          >
            <History className="w-3.5 h-3.5 text-amber-400" />
            <span>Staff Activity & Audit</span>
          </button>
        )}

        {currentUser.role === 'owner' && (
          <button
            onClick={() => setActiveTab('staff')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 flex items-center gap-1.5 transition ${
              activeTab === 'staff'
                ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                : 'bg-[#0F1A2C] text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Staff Access</span>
          </button>
        )}

        {hasAccess('branches') && (
          <button
            onClick={() => setActiveTab('branches')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 flex items-center gap-1.5 transition ${
              activeTab === 'branches'
                ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                : 'bg-[#0F1A2C] text-slate-400 hover:text-white'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Branches</span>
          </button>
        )}

        {hasAccess('settings') && (
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 flex items-center gap-1.5 transition ${
              activeTab === 'settings'
                ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                : 'bg-[#0F1A2C] text-slate-400 hover:text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>CMS</span>
          </button>
        )}
      </div>

      {/* MAIN VIEWPORT */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto pb-24 md:pb-8">
        {/* DESKTOP TOP BAR */}
        <header className="hidden md:flex items-center justify-between px-8 py-4 bg-[#0B1320]/60 backdrop-blur-md border-b border-white/10">
          <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
            Operations <span className="mx-1 text-slate-600">/</span>{' '}
            <span className="text-white capitalize font-bold">{activeTab}</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative w-64">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                <Search className="w-3.5 h-3.5" />
              </span>
              <input
                type="text"
                value={globalSearch}
                onChange={(e) => {
                  setGlobalSearch(e.target.value);
                  if (e.target.value.trim()) {
                    setInventorySearch(e.target.value);
                    setLeadsSearch(e.target.value);
                  }
                }}
                placeholder="Search vehicles, leads, bills..."
                className="w-full pl-9 pr-4 py-1.5 bg-[#0F1A2C] border border-white/10 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
              />
            </div>

            {hasAccess('inventory') && (
              <button
                onClick={() => { setEditingBike(null); setBikeModalImage(''); setShowGalleryPicker(false); setUseUrlFallback(false); setShowBikeModal(true); }}
                className="px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-red-600/30 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Bike</span>
              </button>
            )}

            {hasAccess('billing') && (
              <button
                onClick={() => setShowInvoiceModal(true)}
                className="px-3.5 py-1.5 rounded-lg bg-[#0F1A2C] hover:bg-[#16243C] border border-white/10 text-white text-xs font-semibold flex items-center gap-1.5 transition"
              >
                <Receipt className="w-3.5 h-3.5" />
                <span>Log Bill</span>
              </button>
            )}
          </div>
        </header>

        {/* CONTENT SECTIONS */}
        <div className="p-4 md:p-8 space-y-6">

          {/* ============================================================== */}
          {/* TAB 1: OVERVIEW DASHBOARD                                      */}
          {/* ============================================================== */}
          {activeTab === 'overview' && hasAccess('overview') && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-black text-white tracking-tight">Operations Dashboard</h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Live telemetry, inventory statistics, showroom leads and monthly revenue summary.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-mono">
                    {new Date().toLocaleTimeString('en-IN', { hour12: false })} IST
                  </span>
                  <button
                    onClick={() => showToast('Synced with Supabase & local state.')}
                    className="px-3 py-1.5 rounded-lg bg-[#0F1A2C] hover:bg-[#16243C] border border-white/10 text-xs font-medium text-slate-300 flex items-center gap-1.5 transition"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Sync Live</span>
                  </button>
                </div>
              </div>

              {/* 4 GLOWING STAT CARDS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Active Inventory */}
                <div className="bg-gradient-to-br from-[#0F1A2C] to-[#0B1320] rounded-2xl p-5 border border-cyan-500/25 shadow-lg shadow-cyan-500/10">
                  <div className="flex items-center justify-between text-slate-400 mb-2.5">
                    <span className="text-xs font-semibold uppercase tracking-wider">Active Inventory</span>
                    <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20">
                      <Bike className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-3xl font-extrabold text-white font-mono">{activeBikesCount}</div>
                  <div className="flex items-center gap-1 mt-2 text-xs text-cyan-400 font-medium">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>Available in showroom</span>
                    <span className="text-slate-500 ml-auto">{bikes.length} Total</span>
                  </div>
                </div>

                {/* Monthly Revenue */}
                <div className="bg-gradient-to-br from-[#0F1A2C] to-[#0B1320] rounded-2xl p-5 border border-emerald-500/25 shadow-lg shadow-emerald-500/10">
                  <div className="flex items-center justify-between text-slate-400 mb-2.5">
                    <span className="text-xs font-semibold uppercase tracking-wider">Total Revenue</span>
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                      <IndianRupee className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-3xl font-extrabold text-white font-mono">{formatINR(totalRevenue)}</div>
                  <div className="flex items-center gap-1 mt-2 text-xs text-emerald-400 font-medium">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                    <span>{invoices.length} Invoices logged</span>
                  </div>
                </div>

                {/* New Leads */}
                <div className="bg-gradient-to-br from-[#0F1A2C] to-[#0B1320] rounded-2xl p-5 border border-purple-500/25 shadow-lg shadow-purple-500/10">
                  <div className="flex items-center justify-between text-slate-400 mb-2.5">
                    <span className="text-xs font-semibold uppercase tracking-wider">New Leads</span>
                    <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
                      <UserPlus className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-3xl font-extrabold text-white font-mono">{newLeadsCount}</div>
                  <div className="flex items-center gap-1 mt-2 text-xs text-purple-400 font-medium">
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Requires callback</span>
                  </div>
                </div>

                {/* Showrooms */}
                <div className="bg-gradient-to-br from-[#0F1A2C] to-[#0B1320] rounded-2xl p-5 border border-amber-500/25 shadow-lg shadow-amber-500/10">
                  <div className="flex items-center justify-between text-slate-400 mb-2.5">
                    <span className="text-xs font-semibold uppercase tracking-wider">Pan-India Showrooms</span>
                    <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
                      <MapPin className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-3xl font-extrabold text-white font-mono">{branches.length}</div>
                  <div className="flex items-center gap-1 mt-2 text-xs text-amber-400 font-medium">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>HQ: Hyderabad Main</span>
                  </div>
                </div>
              </div>

              {/* VELOCITY CHART & LIVE ALERTS */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-[#0B1320]/80 rounded-2xl p-6 border border-white/10">
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <h3 className="text-base font-bold text-white">Sales & Enquiry Velocity</h3>
                      <p className="text-xs text-slate-400">Interactive enquiry traffic over time</p>
                    </div>
                    <div className="flex items-center gap-1 p-1 bg-[#0F1A2C] rounded-lg border border-white/5 text-xs">
                      <button
                        onClick={() => setTrendRange(7)}
                        className={`px-2.5 py-1 rounded-md text-xs font-medium transition ${trendRange === 7 ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'}`}
                      >
                        7D
                      </button>
                      <button
                        onClick={() => setTrendRange(15)}
                        className={`px-2.5 py-1 rounded-md text-xs font-medium transition ${trendRange === 15 ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'}`}
                      >
                        15D
                      </button>
                      <button
                        onClick={() => setTrendRange(30)}
                        className={`px-2.5 py-1 rounded-md text-xs font-medium transition ${trendRange === 30 ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'}`}
                      >
                        30D
                      </button>
                    </div>
                  </div>

                  {/* SVG Chart */}
                  <div className="w-full h-56 flex flex-col justify-between">
                    <svg className="w-full h-44 overflow-visible" viewBox="0 0 700 180" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#DC2626" stopOpacity="0.35" />
                          <stop offset="100%" stopColor="#DC2626" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      <path
                        d="M 0 130 C 100 110, 150 70, 230 85 C 310 100, 380 40, 460 55 C 540 70, 620 20, 700 35 L 700 180 L 0 180 Z"
                        fill="url(#areaGrad)"
                      />
                      <path
                        d="M 0 130 C 100 110, 150 70, 230 85 C 310 100, 380 40, 460 55 C 540 70, 620 20, 700 35"
                        fill="none"
                        stroke="#EF4444"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                      <circle cx="230" cy="85" r="4.5" fill="#EF4444" stroke="#080E17" strokeWidth="2" />
                      <circle cx="460" cy="55" r="4.5" fill="#EF4444" stroke="#080E17" strokeWidth="2" />
                      <circle cx="700" cy="35" r="4.5" fill="#EF4444" stroke="#080E17" strokeWidth="2" />
                    </svg>
                    <div className="flex justify-between text-[11px] font-mono text-slate-400 pt-2 border-t border-white/5">
                      <span>Day 1</span>
                      <span>Day {Math.floor(trendRange / 3)}</span>
                      <span>Day {Math.floor((trendRange * 2) / 3)}</span>
                      <span>Day {trendRange} (Latest)</span>
                    </div>
                  </div>
                </div>

                {/* Alerts Feed */}
                <div className="bg-[#0B1320]/80 rounded-2xl p-6 border border-white/10 flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
                      <h3 className="text-base font-bold text-white">Live Activity Alerts</h3>
                    </div>
                    <button onClick={() => setAlerts([])} className="text-[11px] text-slate-500 hover:text-white">
                      Clear
                    </button>
                  </div>

                  <div className="flex-1 space-y-3 overflow-y-auto max-h-64">
                    {alerts.map((alt) => (
                      <div key={alt.id} className="p-3 rounded-xl bg-[#0F1A2C]/80 border border-white/5 flex items-start gap-2.5 text-xs">
                        <div className="p-1.5 rounded-lg bg-white/5 text-red-400 shrink-0">
                          <Bell className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-semibold text-white truncate">{alt.title}</div>
                          <div className="text-[11px] text-slate-400 truncate mt-0.5">{alt.detail}</div>
                        </div>
                        <span className="text-[10px] font-mono text-slate-500 shrink-0">{alt.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Latest Leads Table */}
              <div className="bg-[#0B1320]/80 rounded-2xl p-6 border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-base font-bold text-white">Latest Customer Inquiries</h3>
                    <p className="text-xs text-slate-400">High-intent buyers awaiting immediate response</p>
                  </div>
                  {hasAccess('leads') && (
                    <button
                      onClick={() => setActiveTab('leads')}
                      className="px-3 py-1.5 rounded-lg bg-[#0F1A2C] hover:bg-[#16243C] border border-white/10 text-xs font-semibold text-slate-300 flex items-center gap-1 transition"
                    >
                      <span>Open CRM</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="text-slate-400 border-b border-white/10 pb-2 font-semibold">
                        <th className="py-2.5 pr-4">CUSTOMER</th>
                        <th className="py-2.5 px-4">VEHICLE</th>
                        <th className="py-2.5 px-4">STATUS</th>
                        <th className="py-2.5 pl-4 text-right">ONE-TAP CONNECT</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {leads.slice(0, 4).map((l) => (
                        <tr key={l.id} className="hover:bg-white/[0.02] transition">
                          <td className="py-3 pr-4">
                            <div className="font-bold text-white">{l.customer_name}</div>
                            <div className="text-[11px] text-slate-400 font-mono">{l.phone}</div>
                          </td>
                          <td className="py-3 px-4 font-semibold text-slate-200">{l.bike_interested}</td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-950 text-red-400 border border-red-900">
                              {l.status}
                            </span>
                          </td>
                          <td className="py-3 pl-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <a
                                href={`tel:${l.phone}`}
                                className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 transition"
                                title="Call Customer"
                              >
                                <Phone className="w-3.5 h-3.5" />
                              </a>
                              <a
                                href={getWhatsAppLink(l.phone, l.customer_name, l.bike_interested)}
                                target="_blank"
                                rel="noreferrer"
                                className="p-1.5 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20 border border-green-500/20 transition"
                                title="Chat on WhatsApp"
                              >
                                <MessageCircle className="w-3.5 h-3.5" />
                              </a>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 2: INVENTORY MANAGER                                       */}
          {/* ============================================================== */}
          {activeTab === 'inventory' && hasAccess('inventory') && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-black text-white tracking-tight">Showroom & Gear Inventory</h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Manage motorcycles, superbikes, scooters and certified riding gear in the Supabase 'bikes' table.
                  </p>
                </div>
                <button
                  onClick={() => { setEditingBike(null); setBikeModalImage(''); setShowGalleryPicker(false); setUseUrlFallback(false); setShowBikeModal(true); }}
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-sm flex items-center gap-2 shadow-lg shadow-red-600/30 transition self-start sm:self-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Vehicle / Gear</span>
                </button>
              </div>

              {/* Filters */}
              <div className="bg-[#0B1320]/80 p-4 rounded-xl border border-white/10 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
                <div className="flex-1 relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                    <Search className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    value={inventorySearch}
                    onChange={(e) => setInventorySearch(e.target.value)}
                    placeholder="Search by vehicle name, brand (Kawasaki, BMW)..."
                    className="w-full pl-9 pr-4 py-2 bg-[#0F1A2C] border border-white/10 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
                  />
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <select
                    value={inventoryCatFilter}
                    onChange={(e) => setInventoryCatFilter(e.target.value)}
                    className="px-3 py-2 bg-[#0F1A2C] border border-white/10 rounded-lg text-xs text-slate-300 focus:outline-none"
                  >
                    <option value="ALL">All Categories</option>
                    <option value="Superbike">Superbike</option>
                    <option value="Commuter">Commuter</option>
                    <option value="Scooter">Scooter</option>
                    <option value="Adventure">Adventure</option>
                    <option value="Cruiser">Cruiser</option>
                    <option value="Riding Gear">Riding Gear</option>
                  </select>
                  <select
                    value={inventoryStatusFilter}
                    onChange={(e) => setInventoryStatusFilter(e.target.value)}
                    className="px-3 py-2 bg-[#0F1A2C] border border-white/10 rounded-lg text-xs text-slate-300 focus:outline-none"
                  >
                    <option value="ALL">All Statuses</option>
                    <option value="Available">Available</option>
                    <option value="Booked">Booked</option>
                    <option value="Sold">Sold</option>
                  </select>
                </div>
              </div>

              {/* RESPONSIVE INVENTORY VIEW CONTAINER */}
              <div className="bg-[#0B1320]/80 rounded-2xl border border-white/10 overflow-hidden">
                {/* 1. MOBILE CARDS VIEW (< sm) */}
                <div className="block sm:hidden divide-y divide-white/10 p-3 space-y-3">
                  {filteredBikes.length === 0 ? (
                    <div className="p-8 text-center text-xs text-slate-400">
                      No vehicles found matching your criteria.
                    </div>
                  ) : (
                    filteredBikes.map((b) => (
                      <div key={b.id} className="pt-3 first:pt-0 space-y-2.5">
                        <div className="flex gap-3">
                          {b.image_url ? (
                            <img
                              src={b.image_url}
                              alt={b.name}
                              className="w-16 h-16 object-cover rounded-xl border border-white/10 bg-[#080E17] shrink-0"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '/public/assets/aistudio/image_f4045ab9.png';
                              }}
                            />
                          ) : (
                            <div className="w-16 h-16 rounded-xl bg-[#0F1A2C] border border-white/10 flex items-center justify-center text-slate-500 shrink-0">
                              <Bike className="w-7 h-7" />
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-1">
                              <div>
                                <div className="text-xs font-bold text-white leading-tight truncate">{b.name}</div>
                                <div className="text-[10px] text-slate-400 mt-0.5">{b.brand} · {b.category}</div>
                              </div>
                              <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded border shrink-0 ${
                                b.status === 'Available'
                                  ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800/60'
                                  : b.status === 'Booked'
                                  ? 'bg-amber-950/80 text-amber-300 border-amber-800/60'
                                  : 'bg-red-950/80 text-red-300 border-red-800/60'
                              }`}>
                                {b.status}
                              </span>
                            </div>
                            <div className="flex items-baseline justify-between mt-1">
                              <div className="text-sm font-extrabold text-white font-mono">{formatINR(b.price)}</div>
                              <div className="text-[10px] text-slate-400 font-mono">{b.year} · {b.km ? b.km.toLocaleString('en-IN') + ' km' : 'New'}</div>
                            </div>
                          </div>
                        </div>

                        {/* Specs strip */}
                        <div className="flex items-center justify-between text-[10px] bg-[#080E17] px-2.5 py-1.5 rounded-lg border border-white/5 font-mono text-slate-300">
                          <span>⚡ {b.displacement_cc || '1000 cc'}</span>
                          <span>🚀 {b.max_power || '160 hp'}</span>
                          <span>⏱️ {b.acceleration || '3.2s'}</span>
                          <span className="text-slate-400">ID: #{b.id}</span>
                        </div>

                        {/* Mobile Action Controls */}
                        <div className="flex items-center justify-between gap-2 pt-1">
                          <select
                            value={b.status}
                            onChange={(e) => {
                              const newSt = e.target.value as any;
                              const prevSt = b.status;
                              setBikes(prev => prev.map(item => item.id === b.id ? { ...item, status: newSt } : item));
                              showToast(`${b.name} marked as ${newSt}`);
                              logAuditAction(
                                'inventory_edit',
                                'Inventory',
                                `${currentUser?.name || 'Staff'} changed status of ${b.name} to '${newSt}'`,
                                b.id,
                                b.name,
                                { field: 'status', before: prevSt, after: newSt, notes: 'Quick status change via mobile card' }
                              );
                              supabase.from('bikes').update({ status: newSt }).eq('id', b.id).then();
                            }}
                            className="text-xs bg-[#0F1A2C] border border-white/10 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none flex-1 font-medium"
                          >
                            <option value="Available">Available</option>
                            <option value="Booked">Booked</option>
                            <option value="Sold">Sold</option>
                          </select>

                          <button
                            type="button"
                            onClick={() => openCustomerPreview(b)}
                            className="p-1.5 rounded-lg bg-cyan-950/40 hover:bg-cyan-900/60 text-cyan-300 border border-cyan-800/40 transition"
                            title="Customer Showroom View"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => openEditBikeModal(b)}
                            className="p-1.5 rounded-lg bg-[#0F1A2C] hover:bg-[#16243C] text-slate-300 border border-white/10 transition"
                            title="Edit Vehicle"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`Delete ${b.name}?`)) {
                                setBikes(prev => prev.filter(item => item.id !== b.id));
                                showToast(`Deleted ${b.name}`);
                                logAuditAction(
                                  'inventory_delete',
                                  'Inventory',
                                  `${currentUser?.name || 'Staff'} deleted vehicle ${b.name} (ID: #${b.id})`,
                                  b.id,
                                  b.name,
                                  { notes: 'Vehicle removed from showroom stock' }
                                );
                                supabase.from('bikes').delete().eq('id', b.id).then();
                              }
                            }}
                            className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-900/30 transition"
                            title="Delete Vehicle"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* 2. DESKTOP TABLE VIEW (sm:block) */}
                <div className="hidden sm:block overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="text-slate-400 bg-[#080E17]/60 border-b border-white/10 font-semibold uppercase text-[11px]">
                        <th className="py-3 px-4">VEHICLE / PRODUCT</th>
                        <th className="py-3 px-4">BRAND</th>
                        <th className="py-3 px-4">CATEGORY</th>
                        <th className="py-3 px-4">YEAR & KM</th>
                        <th className="py-3 px-4">PRICE</th>
                        <th className="py-3 px-4">STATUS</th>
                        <th className="py-3 px-4 text-right">ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {filteredBikes.map((b) => (
                        <tr key={b.id} className="hover:bg-white/[0.02] transition">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              {b.image_url ? (
                                <img
                                  src={b.image_url}
                                  alt={b.name}
                                  className="w-12 h-12 object-cover rounded-lg border border-white/10 bg-[#080E17]"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = '/public/assets/aistudio/image_f4045ab9.png';
                                  }}
                                />
                              ) : (
                                <div className="w-12 h-12 rounded-lg bg-[#0F1A2C] border border-white/10 flex items-center justify-center text-slate-500">
                                  <Bike className="w-6 h-6" />
                                </div>
                              )}
                              <div>
                                <div className="font-bold text-white">{b.name}</div>
                                <div className="text-[11px] text-slate-400">ID: #{b.id}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 font-semibold text-slate-300">{b.brand}</td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded bg-[#0F1A2C] text-slate-300 text-[11px] border border-white/5">
                              {b.category}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-mono text-slate-300">
                            {b.year} · <span className="text-slate-400">{b.km ? b.km.toLocaleString('en-IN') + ' km' : 'New'}</span>
                          </td>
                          <td className="py-3 px-4 font-mono font-bold text-white">{formatINR(b.price)}</td>
                          <td className="py-3 px-4">
                            <select
                              value={b.status}
                              onChange={(e) => {
                                const newSt = e.target.value as any;
                                const prevSt = b.status;
                                setBikes(prev => prev.map(item => item.id === b.id ? { ...item, status: newSt } : item));
                                showToast(`${b.name} marked as ${newSt}`);
                                logAuditAction(
                                  'inventory_edit',
                                  'Inventory',
                                  `${currentUser?.name || 'Staff'} changed status of ${b.name} to '${newSt}'`,
                                  b.id,
                                  b.name,
                                  { field: 'status', before: prevSt, after: newSt, notes: 'Quick status change via inventory table' }
                                );
                                supabase.from('bikes').update({ status: newSt }).eq('id', b.id).then();
                              }}
                              className="text-xs bg-[#0F1A2C] border border-white/10 rounded px-2 py-1 text-slate-200 focus:outline-none"
                            >
                              <option value="Available">Available</option>
                              <option value="Booked">Booked</option>
                              <option value="Sold">Sold</option>
                            </select>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => openCustomerPreview(b)}
                                className="p-1.5 rounded-lg bg-cyan-950/40 hover:bg-cyan-900/60 text-cyan-300 border border-cyan-800/40 transition"
                                title="Customer Showroom View"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => openEditBikeModal(b)}
                                className="p-1.5 rounded-lg bg-[#0F1A2C] hover:bg-[#16243C] text-slate-300 transition"
                                title="Edit Vehicle"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`Delete ${b.name}?`)) {
                                    setBikes(prev => prev.filter(item => item.id !== b.id));
                                    showToast(`Deleted ${b.name}`);
                                    logAuditAction(
                                      'inventory_delete',
                                      'Inventory',
                                      `${currentUser?.name || 'Staff'} deleted vehicle ${b.name} (ID: #${b.id})`,
                                      b.id,
                                      b.name,
                                      { notes: 'Vehicle deleted from showroom stock' }
                                    );
                                    supabase.from('bikes').delete().eq('id', b.id).then();
                                  }
                                }}
                                className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-900/30 transition"
                                title="Delete Vehicle"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 3: LEADS CRM                                               */}
          {/* ============================================================== */}
          {activeTab === 'leads' && hasAccess('leads') && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-black text-white tracking-tight">Leads & Enquiries CRM</h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Customer enquiries from website test-ride bookings and sell-your-bike valuation submissions.
                  </p>
                </div>
                <button
                  onClick={() => setShowLeadModal(true)}
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-sm flex items-center gap-2 shadow-lg shadow-red-600/30 transition self-start sm:self-auto"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Log Walk-in Lead</span>
                </button>
              </div>

              {/* Filters */}
              <div className="bg-[#0B1320]/80 p-4 rounded-xl border border-white/10 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
                <div className="flex-1 relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                    <Search className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    value={leadsSearch}
                    onChange={(e) => setLeadsSearch(e.target.value)}
                    placeholder="Search by customer name, phone number, vehicle..."
                    className="w-full pl-9 pr-4 py-2 bg-[#0F1A2C] border border-white/10 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
                  />
                </div>
                <select
                  value={leadsStatusFilter}
                  onChange={(e) => setLeadsStatusFilter(e.target.value)}
                  className="px-3 py-2 bg-[#0F1A2C] border border-white/10 rounded-lg text-xs text-slate-300 focus:outline-none"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Closed">Closed</option>
                  <option value="Follow-up">Follow-up</option>
                </select>
              </div>

              {/* RESPONSIVE LEADS CRM VIEW CONTAINER */}
              <div className="bg-[#0B1320]/80 rounded-2xl border border-white/10 overflow-hidden">
                {/* 1. MOBILE CARDS VIEW (< sm) */}
                <div className="block sm:hidden divide-y divide-white/10 p-3 space-y-3">
                  {filteredLeads.length === 0 ? (
                    <div className="p-8 text-center text-xs text-slate-400">
                      No customer leads found matching your criteria.
                    </div>
                  ) : (
                    filteredLeads.map((l) => (
                      <div key={l.id} className="pt-3 first:pt-0 space-y-2.5">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="text-xs font-bold text-white flex items-center gap-1.5">
                              <span>{l.customer_name}</span>
                              <span className="text-[10px] text-slate-500 font-normal">#{l.id}</span>
                            </div>
                            <div className="text-xs font-mono text-cyan-400 mt-0.5 font-semibold">
                              +91 {l.phone}
                            </div>
                          </div>
                          <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded border shrink-0 ${
                            l.status === 'New'
                              ? 'bg-red-950/80 text-red-300 border-red-800/60'
                              : l.status === 'Contacted'
                              ? 'bg-cyan-950/80 text-cyan-300 border-cyan-800/60'
                              : l.status === 'Follow-up'
                              ? 'bg-amber-950/80 text-amber-300 border-amber-800/60'
                              : 'bg-emerald-950/80 text-emerald-300 border-emerald-800/60'
                          }`}>
                            {l.status}
                          </span>
                        </div>

                        {/* Interested vehicle badge */}
                        <div className="flex items-center justify-between text-xs bg-[#080E17] px-2.5 py-1.5 rounded-lg border border-white/5">
                          <span className="text-slate-400 font-medium">Interested Vehicle:</span>
                          <span className="font-bold text-slate-200">{l.bike_interested}</span>
                        </div>

                        {/* Customer Message */}
                        {l.message && (
                          <div className="text-[11px] text-slate-300 bg-[#0F1A2C] p-2 rounded-lg border border-white/5">
                            "{l.message}"
                          </div>
                        )}

                        {/* Status Select & Quick Connect Actions */}
                        <div className="space-y-2 pt-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] text-slate-400 shrink-0 font-medium">Status:</span>
                            <select
                              value={l.status}
                              onChange={(e) => {
                                const newSt = e.target.value as any;
                                const prevSt = l.status;
                                setLeads(prev => prev.map(item => item.id === l.id ? { ...item, status: newSt } : item));
                                showToast(`Lead status updated to ${newSt}`);
                                logAuditAction(
                                  'lead_status',
                                  'Leads CRM',
                                  `${currentUser?.name || 'Staff'} updated lead status for ${l.customer_name} to '${newSt}'`,
                                  l.id,
                                  `${l.customer_name} (${l.bike_interested})`,
                                  { field: 'status', before: prevSt, after: newSt, notes: 'Status changed on mobile card' }
                                );
                                supabase.from('leads').update({ status: newSt }).eq('id', l.id).then();
                              }}
                              className="text-xs bg-[#0F1A2C] border border-white/10 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none flex-1 font-medium"
                            >
                              <option value="New">New</option>
                              <option value="Contacted">Contacted</option>
                              <option value="Follow-up">Follow-up</option>
                              <option value="Closed">Closed</option>
                            </select>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <a
                              href={`tel:${l.phone}`}
                              onClick={() => {
                                logAuditAction(
                                  'lead_view',
                                  'Leads CRM',
                                  `${currentUser?.name || 'Staff'} called ${l.customer_name} (+91 ${l.phone})`,
                                  l.id,
                                  l.customer_name,
                                  { notes: `Direct voice call initiated for ${l.bike_interested}` }
                                );
                              }}
                              className="py-2 px-3 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                            >
                              <Phone className="w-3.5 h-3.5" />
                              <span>Call Client</span>
                            </a>
                            <a
                              href={getWhatsAppLink(l.phone, l.customer_name, l.bike_interested)}
                              target="_blank"
                              rel="noreferrer"
                              onClick={() => {
                                logAuditAction(
                                  'lead_view',
                                  'Leads CRM',
                                  `${currentUser?.name || 'Staff'} opened WhatsApp conversation with ${l.customer_name} (+91 ${l.phone})`,
                                  l.id,
                                  l.customer_name,
                                  { notes: `WhatsApp chat opened for ${l.bike_interested}` }
                                );
                              }}
                              className="py-2 px-3 rounded-lg bg-green-500/15 hover:bg-green-500/25 border border-green-500/30 text-green-400 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                              <span>WhatsApp</span>
                            </a>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* 2. DESKTOP TABLE VIEW (sm:block) */}
                <div className="hidden sm:block overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="text-slate-400 bg-[#080E17]/60 border-b border-white/10 font-semibold uppercase text-[11px]">
                        <th className="py-3 px-4">CUSTOMER NAME</th>
                        <th className="py-3 px-4">PHONE NUMBER</th>
                        <th className="py-3 px-4">VEHICLE INTEREST</th>
                        <th className="py-3 px-4">CUSTOMER NOTE</th>
                        <th className="py-3 px-4">STATUS</th>
                        <th className="py-3 px-4 text-right">ONE-TAP CONNECT</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {filteredLeads.map((l) => (
                        <tr key={l.id} className="hover:bg-white/[0.02] transition">
                          <td className="py-3 px-4 font-bold text-white">{l.customer_name}</td>
                          <td className="py-3 px-4 font-mono text-cyan-400">{l.phone}</td>
                          <td className="py-3 px-4 font-semibold text-slate-200">{l.bike_interested}</td>
                          <td className="py-3 px-4 text-slate-400 max-w-xs truncate">{l.message || '—'}</td>
                          <td className="py-3 px-4">
                            <select
                              value={l.status}
                              onChange={(e) => {
                                const newSt = e.target.value as any;
                                const prevSt = l.status;
                                setLeads(prev => prev.map(item => item.id === l.id ? { ...item, status: newSt } : item));
                                showToast(`Lead status updated to ${newSt}`);
                                logAuditAction(
                                  'lead_status',
                                  'Leads CRM',
                                  `${currentUser?.name || 'Staff'} updated lead status for ${l.customer_name} to '${newSt}'`,
                                  l.id,
                                  `${l.customer_name} (${l.bike_interested})`,
                                  { field: 'status', before: prevSt, after: newSt, notes: 'Status changed on CRM table' }
                                );
                                supabase.from('leads').update({ status: newSt }).eq('id', l.id).then();
                              }}
                              className="text-xs bg-[#0F1A2C] border border-white/10 rounded px-2 py-1 text-slate-200 focus:outline-none"
                            >
                              <option value="New">New</option>
                              <option value="Contacted">Contacted</option>
                              <option value="Closed">Closed</option>
                              <option value="Follow-up">Follow-up</option>
                            </select>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <a
                                href={`tel:${l.phone}`}
                                onClick={() => {
                                  logAuditAction(
                                    'lead_view',
                                    'Leads CRM',
                                    `${currentUser?.name || 'Staff'} called ${l.customer_name} (+91 ${l.phone})`,
                                    l.id,
                                    l.customer_name,
                                    { notes: `Voice call initiated for ${l.bike_interested}` }
                                  );
                                }}
                                className="px-2.5 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 text-xs font-semibold flex items-center gap-1 transition"
                              >
                                <Phone className="w-3.5 h-3.5" />
                                <span>Call</span>
                              </a>
                              <a
                                href={getWhatsAppLink(l.phone, l.customer_name, l.bike_interested)}
                                target="_blank"
                                rel="noreferrer"
                                onClick={() => {
                                  logAuditAction(
                                    'lead_view',
                                    'Leads CRM',
                                    `${currentUser?.name || 'Staff'} opened WhatsApp chat with ${l.customer_name} (+91 ${l.phone})`,
                                    l.id,
                                    l.customer_name,
                                    { notes: `WhatsApp conversation opened for ${l.bike_interested}` }
                                  );
                                }}
                                className="px-2.5 py-1.5 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20 border border-green-500/20 text-xs font-semibold flex items-center gap-1 transition"
                              >
                                <MessageCircle className="w-3.5 h-3.5" />
                                <span>WhatsApp</span>
                              </a>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 4: DIGITAL BILLING & INVOICES                              */}
          {/* ============================================================== */}
          {activeTab === 'billing' && hasAccess('billing') && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-black text-white tracking-tight">Digital Billing & Vehicle Invoices</h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Log sales bills with mandatory vehicle registration numbers, upload RC/Insurance documents, and print or download official GST invoices.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (invoices.length > 0) {
                        setShowCustomerHubModal(invoices[0]);
                      }
                    }}
                    className="px-3.5 py-2 rounded-xl bg-[#0F1A2C] hover:bg-[#16243C] text-slate-200 border border-white/10 font-semibold text-xs flex items-center gap-2 transition"
                  >
                    <Car className="w-4 h-4 text-cyan-400" />
                    <span>Customer Portal View</span>
                  </button>
                  <button
                    onClick={() => {
                      setInvoiceFormDocs([]);
                      setInvoiceHasEcharger(false);
                      setShowInvoiceModal(true);
                    }}
                    className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-sm flex items-center gap-2 shadow-lg shadow-red-600/30 transition"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Generate New Bill</span>
                  </button>
                </div>
              </div>

              {/* Billing Quick Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl bg-[#0B1320]/80 border border-white/10">
                  <div className="text-[10px] font-bold uppercase text-slate-400">Total Billed Revenue</div>
                  <div className="text-lg font-black text-emerald-400 font-mono mt-0.5">{formatINR(totalRevenue)}</div>
                </div>
                <div className="p-3.5 rounded-xl bg-[#0B1320]/80 border border-white/10">
                  <div className="text-[10px] font-bold uppercase text-slate-400">Total Vehicles Sold</div>
                  <div className="text-lg font-black text-white font-mono mt-0.5">{invoices.length} Registered</div>
                </div>
                <div className="p-3.5 rounded-xl bg-[#0B1320]/80 border border-white/10">
                  <div className="text-[10px] font-bold uppercase text-slate-400">Vehicles With Docs</div>
                  <div className="text-lg font-black text-cyan-400 font-mono mt-0.5">
                    {invoices.filter(i => i.documents && i.documents.length > 0).length} Uploaded
                  </div>
                </div>
                <div className="p-3.5 rounded-xl bg-[#0B1320]/80 border border-white/10">
                  <div className="text-[10px] font-bold uppercase text-slate-400">E-Chargers Supplied</div>
                  <div className="text-lg font-black text-amber-400 font-mono mt-0.5">
                    {invoices.filter(i => i.has_echarger).length} EV Units
                  </div>
                </div>
              </div>

              {/* Invoices Search Bar */}
              <div className="bg-[#0B1320]/80 p-3 rounded-xl border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="relative w-full sm:w-80">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <Search className="w-3.5 h-3.5" />
                  </span>
                  <input
                    type="text"
                    value={billingSearch}
                    onChange={(e) => setBillingSearch(e.target.value)}
                    placeholder="Search by customer, reg #, or invoice..."
                    className="w-full pl-9 pr-3 py-1.5 bg-[#0F1A2C] border border-white/10 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500 font-mono"
                  />
                </div>
                <div className="text-xs text-slate-400">
                  Showing <span className="text-white font-bold">{invoices.filter(inv => {
                    const q = billingSearch.toLowerCase().trim();
                    if (!q) return true;
                    return inv.customer_name.toLowerCase().includes(q) ||
                      inv.mobile.includes(q) ||
                      inv.vehicle.toLowerCase().includes(q) ||
                      (inv.reg_number || '').toLowerCase().includes(q) ||
                      inv.invoice_number.toLowerCase().includes(q);
                  }).length}</span> invoices
                </div>
              </div>

              {/* RESPONSIVE INVOICES VIEW CONTAINER */}
              <div className="bg-[#0B1320]/80 rounded-2xl border border-white/10 overflow-hidden">
                {/* 1. MOBILE CARDS VIEW (< sm) */}
                <div className="block sm:hidden divide-y divide-white/10 p-3 space-y-3">
                  {invoices
                    .filter(inv => {
                      const q = billingSearch.toLowerCase().trim();
                      if (!q) return true;
                      return inv.customer_name.toLowerCase().includes(q) ||
                        inv.mobile.includes(q) ||
                        inv.vehicle.toLowerCase().includes(q) ||
                        (inv.reg_number || '').toLowerCase().includes(q) ||
                        inv.invoice_number.toLowerCase().includes(q);
                    })
                    .length === 0 ? (
                    <div className="p-8 text-center text-xs text-slate-400">
                      No invoices found matching your search.
                    </div>
                  ) : (
                    invoices
                      .filter(inv => {
                        const q = billingSearch.toLowerCase().trim();
                        if (!q) return true;
                        return inv.customer_name.toLowerCase().includes(q) ||
                          inv.mobile.includes(q) ||
                          inv.vehicle.toLowerCase().includes(q) ||
                          (inv.reg_number || '').toLowerCase().includes(q) ||
                          inv.invoice_number.toLowerCase().includes(q);
                      })
                      .map((inv) => (
                      <div key={inv.id} className="pt-3 first:pt-0 space-y-2.5">
                        {/* Header: Invoice # and Reg Number Badge */}
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-mono font-bold text-red-400 text-xs">
                            {inv.invoice_number}
                          </span>
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-[#080E17] border border-red-500/40 text-red-400 font-mono font-bold text-[11px] uppercase tracking-wider">
                            <span className="text-[9px] text-blue-400 font-black">IND</span>
                            <span>{inv.reg_number || 'TS 09 EQ 4200'}</span>
                          </span>
                        </div>

                        {/* Customer & Vehicle Info */}
                        <div className="bg-[#080E17] p-2.5 rounded-xl border border-white/5 space-y-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="text-xs font-bold text-white">{inv.customer_name}</div>
                              <div className="text-[11px] font-mono text-slate-400 mt-0.5">+91 {inv.mobile}</div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-extrabold text-emerald-400 font-mono">{formatINR(inv.price)}</div>
                              <div className="text-[10px] text-slate-400">{inv.payment_mode}</div>
                            </div>
                          </div>

                          <div className="pt-1.5 border-t border-white/5 flex items-center justify-between text-xs">
                            <span className="font-medium text-slate-300">{inv.vehicle}</span>
                            {inv.documents && inv.documents.length > 0 ? (
                              <button
                                type="button"
                                onClick={() => setShowCustomerHubModal(inv)}
                                className="px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-800/40 font-mono text-[10px] flex items-center gap-1"
                              >
                                <FileText className="w-3 h-3 text-cyan-400" />
                                <span>{inv.documents.length} Docs</span>
                              </button>
                            ) : (
                              <span className="text-[10px] text-slate-500 italic">No files</span>
                            )}
                          </div>

                          {inv.has_echarger && (
                            <div className="text-[10px] text-amber-400 flex items-center gap-1 pt-1 font-medium">
                              <Zap className="w-3 h-3 text-amber-400 shrink-0" />
                              <span className="truncate">{inv.echarger_details || 'Fast Home Charger Kit Included'}</span>
                            </div>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="grid grid-cols-3 gap-2 pt-0.5">
                          <button
                            type="button"
                            onClick={() => {
                              setShowPrintInvoiceModal(inv);
                              logAuditAction(
                                'billing_create',
                                'Billing',
                                `${currentUser?.name || 'Staff'} previewed invoice ${inv.invoice_number} (${inv.reg_number})`,
                                inv.id,
                                inv.invoice_number,
                                { notes: `Customer: ${inv.customer_name}` }
                              );
                            }}
                            className="py-1.5 px-2 rounded-lg bg-red-600/15 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/30 text-xs font-semibold flex items-center justify-center gap-1 transition"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span>Print</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              downloadInvoice(inv);
                              logAuditAction(
                                'billing_create',
                                'Billing',
                                `${currentUser?.name || 'Staff'} downloaded tax invoice ${inv.invoice_number} (${inv.reg_number})`,
                                inv.id,
                                inv.invoice_number,
                                { notes: `Customer: ${inv.customer_name}` }
                              );
                            }}
                            className="py-1.5 px-2 rounded-lg bg-[#0F1A2C] hover:bg-[#16243C] text-cyan-400 border border-white/10 text-xs font-semibold flex items-center justify-center gap-1 transition"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Download</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setShowCustomerHubModal(inv)}
                            className="py-1.5 px-2 rounded-lg bg-[#0F1A2C] hover:bg-[#16243C] text-slate-300 border border-white/10 text-xs font-semibold flex items-center justify-center gap-1 transition"
                          >
                            <Car className="w-3.5 h-3.5" />
                            <span>Hub</span>
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* 2. DESKTOP TABLE VIEW (sm:block) */}
                <div className="hidden sm:block overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="text-slate-400 bg-[#080E17]/60 border-b border-white/10 font-semibold uppercase text-[11px]">
                        <th className="py-3 px-4">INVOICE #</th>
                        <th className="py-3 px-4">REGISTRATION #</th>
                        <th className="py-3 px-4">CUSTOMER NAME</th>
                        <th className="py-3 px-4">VEHICLE SOLD</th>
                        <th className="py-3 px-4">DOCS & RC</th>
                        <th className="py-3 px-4">PAYMENT</th>
                        <th className="py-3 px-4">AMOUNT</th>
                        <th className="py-3 px-4 text-right">ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {invoices
                        .filter(inv => {
                          const q = billingSearch.toLowerCase().trim();
                          if (!q) return true;
                          return inv.customer_name.toLowerCase().includes(q) ||
                            inv.mobile.includes(q) ||
                            inv.vehicle.toLowerCase().includes(q) ||
                            (inv.reg_number || '').toLowerCase().includes(q) ||
                            inv.invoice_number.toLowerCase().includes(q);
                        })
                        .map((inv) => (
                        <tr key={inv.id} className="hover:bg-white/[0.02] transition">
                          <td className="py-3 px-4 font-mono font-bold text-red-400">{inv.invoice_number}</td>
                          <td className="py-3 px-4">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#080E17] border border-red-500/40 text-red-400 font-mono font-bold text-xs uppercase tracking-wider">
                              <span className="text-[9px] text-blue-400 font-black">IND</span>
                              <span>{inv.reg_number || 'TS 09 EQ 4200'}</span>
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-bold text-white">{inv.customer_name}</div>
                            <div className="font-mono text-[11px] text-slate-400">+91 {inv.mobile}</div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-semibold text-slate-200">{inv.vehicle}</div>
                            {inv.has_echarger && (
                              <div className="text-[10px] text-amber-400 flex items-center gap-1 mt-0.5 font-medium">
                                <Zap className="w-3 h-3 text-amber-400" />
                                <span>{inv.echarger_details || 'Fast Home Charger Kit'}</span>
                              </div>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            {inv.documents && inv.documents.length > 0 ? (
                              <button
                                type="button"
                                onClick={() => setShowCustomerHubModal(inv)}
                                className="px-2 py-1 rounded bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-800/50 text-cyan-300 font-mono text-[11px] flex items-center gap-1.5 transition"
                              >
                                <FileText className="w-3 h-3 text-cyan-400" />
                                <span>{inv.documents.length} Docs</span>
                              </button>
                            ) : (
                              <span className="text-[11px] text-slate-500 italic">No files</span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded bg-[#0F1A2C] text-slate-300 text-[11px]">
                              {inv.payment_mode}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-mono font-bold text-emerald-400">{formatINR(inv.price)}</td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => {
                                  setShowPrintInvoiceModal(inv);
                                  logAuditAction(
                                    'billing_create',
                                    'Billing',
                                    `${currentUser?.name || 'Staff'} previewed invoice ${inv.invoice_number} (${inv.reg_number})`,
                                    inv.id,
                                    inv.invoice_number,
                                    { notes: `Customer: ${inv.customer_name}` }
                                  );
                                }}
                                title="View & Print Official GST Invoice"
                                className="px-2 py-1.5 rounded-lg bg-red-600/15 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/30 text-xs font-semibold flex items-center gap-1 transition"
                              >
                                <Printer className="w-3.5 h-3.5" />
                                <span>View / Print</span>
                              </button>
                              <button
                                onClick={() => {
                                  downloadInvoice(inv);
                                  logAuditAction(
                                    'billing_create',
                                    'Billing',
                                    `${currentUser?.name || 'Staff'} downloaded tax invoice ${inv.invoice_number} (${inv.reg_number})`,
                                    inv.id,
                                    inv.invoice_number,
                                    { notes: `Customer: ${inv.customer_name}` }
                                  );
                                }}
                                title="Download Standalone Tax Invoice"
                                className="p-1.5 rounded-lg bg-[#0F1A2C] hover:bg-[#16243C] text-cyan-400 border border-white/10 transition"
                              >
                                <Download className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => setShowCustomerHubModal(inv)}
                                title="Customer Ownership Hub Preview"
                                className="p-1.5 rounded-lg bg-[#0F1A2C] hover:bg-[#16243C] text-slate-300 border border-white/10 transition"
                              >
                                <Car className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 5: PAN-INDIA SHOWROOM BRANCHES                             */}
          {/* ============================================================== */}
          {activeTab === 'branches' && hasAccess('branches') && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-black text-white tracking-tight">Pan-India Showrooms & Studios</h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Manage physical dealership locations in Supabase 'branches'. Automatically updates live on the website.
                  </p>
                </div>
                <button
                  onClick={() => { setEditingBranch(null); setShowBranchModal(true); }}
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-sm flex items-center gap-2 shadow-lg shadow-red-600/30 transition self-start sm:self-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Showroom Branch</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {branches.map((br) => (
                  <div key={br.id} className="bg-[#0B1320]/80 p-5 rounded-2xl border border-white/10 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-red-950 text-red-400 border border-red-900">
                          {br.city}
                        </span>
                        <span className={`text-xs font-semibold ${br.status === 'Active' ? 'text-emerald-400' : 'text-amber-400'}`}>
                          ● {br.status}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-white mt-1">{br.branch_name}</h3>
                      <p className="text-xs text-slate-400 mt-2 flex items-start gap-1.5 leading-relaxed">
                        <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                        <span>{br.address}</span>
                      </p>
                      <p className="text-xs text-slate-300 font-mono mt-2 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span>{br.phone}</span>
                      </p>
                    </div>

                    <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between">
                      {br.maps_url ? (
                        <a
                          href={br.maps_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold"
                        >
                          <Navigation className="w-3.5 h-3.5" />
                          <span>Google Maps</span>
                        </a>
                      ) : (
                        <span className="text-xs text-slate-500">Maps link pending</span>
                      )}

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => { setEditingBranch(br); setShowBranchModal(true); }}
                          className="p-1.5 rounded-lg bg-[#0F1A2C] hover:bg-[#16243C] text-slate-300 transition"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Remove ${br.branch_name}?`)) {
                              setBranches(prev => prev.filter(item => item.id !== br.id));
                              showToast('Branch removed');
                              supabase.from('branches').delete().eq('id', br.id).then();
                            }
                          }}
                          className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-900/30 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 6: DYNAMIC CMS & SOCIAL SETTINGS                           */}
          {/* ============================================================== */}
          {activeTab === 'settings' && hasAccess('settings') && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-black text-white tracking-tight">Dynamic CMS & Social Media Settings</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Modify customer-facing contact numbers, Instagram handles, and top announcement banner text without code changes.
                </p>
              </div>

              <div className="bg-[#0B1320]/80 p-6 rounded-2xl border border-white/10 max-w-2xl">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    showToast('CMS settings saved & live on customer site!');
                    supabase.from('site_settings').upsert({ key: 'global_config', value: JSON.stringify(settings) }).then();
                  }}
                  className="space-y-5"
                >
                  <div className="p-4 rounded-xl bg-[#0F1A2C] border border-white/10">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-semibold text-white uppercase tracking-wider">
                        Top Promo Announcement Banner
                      </label>
                      <input
                        type="checkbox"
                        checked={settings.bannerActive}
                        onChange={(e) => setSettings({ ...settings, bannerActive: e.target.checked })}
                        className="rounded bg-slate-700 text-red-600 focus:ring-0"
                      />
                    </div>
                    <textarea
                      rows={2}
                      value={settings.bannerText}
                      onChange={(e) => setSettings({ ...settings, bannerText: e.target.value })}
                      className="w-full px-3 py-2 bg-[#080E17] border border-white/10 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 uppercase mb-1">Instagram Handle</label>
                      <input
                        type="text"
                        value={settings.instagram}
                        onChange={(e) => setSettings({ ...settings, instagram: e.target.value })}
                        className="w-full px-3 py-2 bg-[#0F1A2C] border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-red-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-300 uppercase mb-1">WhatsApp Official</label>
                      <input
                        type="text"
                        value={settings.whatsapp}
                        onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                        className="w-full px-3 py-2 bg-[#0F1A2C] border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-red-500 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-300 uppercase mb-1">Sales Hotline Phone</label>
                      <input
                        type="text"
                        value={settings.salesPhone}
                        onChange={(e) => setSettings({ ...settings, salesPhone: e.target.value })}
                        className="w-full px-3 py-2 bg-[#0F1A2C] border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-red-500 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-300 uppercase mb-1">Support Email</label>
                      <input
                        type="email"
                        value={settings.email}
                        onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                        className="w-full px-3 py-2 bg-[#0F1A2C] border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-red-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 uppercase mb-1">Flagship Showroom Address</label>
                    <input
                      type="text"
                      value={settings.address}
                      onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                      className="w-full px-3 py-2 bg-[#0F1A2C] border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-red-500"
                    />
                  </div>

                  <div className="pt-3 border-t border-white/10 flex justify-end">
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-red-600/30 transition"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save CMS Settings</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 7: STAFF ACCESS MANAGER (OWNER ONLY)                       */}
          {/* ============================================================== */}
          {activeTab === 'staff' && currentUser.role === 'owner' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-black text-white tracking-tight">Staff & Role Permissions</h2>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/30">
                      Owner Only
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Add showroom employees, assign their 4-digit security PINs, and grant granular access to specific portal modules.
                  </p>
                </div>
                <button
                  onClick={() => { setEditingStaff(null); setShowStaffModal(true); }}
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-sm flex items-center gap-2 shadow-lg shadow-red-600/30 transition self-start sm:self-auto"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Add Staff Account</span>
                </button>
              </div>

              {/* Staff Table */}
              <div className="bg-[#0B1320]/80 rounded-2xl border border-white/10 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="text-slate-400 bg-[#080E17]/60 border-b border-white/10 font-semibold uppercase text-[11px]">
                        <th className="py-3 px-4">STAFF MEMBER</th>
                        <th className="py-3 px-4">PHONE NUMBER</th>
                        <th className="py-3 px-4">SECURITY PIN</th>
                        <th className="py-3 px-4">ALLOWED MODULES</th>
                        <th className="py-3 px-4">STATUS</th>
                        <th className="py-3 px-4 text-right">MANAGE</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {staff.map((s) => (
                        <tr key={s.id} className="hover:bg-white/[0.02] transition">
                          <td className="py-3 px-4">
                            <div className="font-bold text-white">{s.name}</div>
                            <div className="text-[11px] text-slate-400">ID: #{s.id}</div>
                          </td>
                          <td className="py-3 px-4 font-mono text-slate-300 font-semibold">{s.phone}</td>
                          <td className="py-3 px-4 font-mono text-slate-400 tracking-wider">
                            {showPinId === s.id ? (
                              <span className="text-white font-bold">{s.pin}</span>
                            ) : (
                              <span>••••</span>
                            )}
                            <button
                              onClick={() => setShowPinId(showPinId === s.id ? null : s.id)}
                              className="ml-2 text-slate-500 hover:text-slate-300 text-[11px]"
                            >
                              {showPinId === s.id ? 'Hide' : 'Show'}
                            </button>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex flex-wrap gap-1">
                              {s.permissions.map((p) => (
                                <span key={p} className="px-2 py-0.5 rounded bg-[#0F1A2C] text-cyan-300 text-[10px] font-semibold border border-cyan-500/20">
                                  {p}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-xs font-semibold text-emerald-400">● {s.status}</span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => { setEditingStaff(s); setShowStaffModal(true); }}
                                className="p-1.5 rounded-lg bg-[#0F1A2C] hover:bg-[#16243C] text-slate-300 transition"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`Delete account for ${s.name}?`)) {
                                    setStaff(prev => prev.filter(item => item.id !== s.id));
                                    showToast('Staff account deleted');
                                    supabase.from('staff_users').delete().eq('id', s.id).then();
                                  }
                                }}
                                className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-900/30 transition"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 8: STAFF ACTIVITY & FORENSIC AUDIT TRAIL (OWNER ONLY)      */}
          {/* ============================================================== */}
          {activeTab === 'audit' && currentUser.role === 'owner' && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-black text-white tracking-tight">Staff Activity & Audit Trail</h2>
                    <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded bg-red-950 text-red-400 border border-red-800">
                      Owner Only
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
                    Chronological audit log tracking every worker and owner session, login timestamps, and exact modifications made across showroom inventory, CRM leads, sales invoices, and staff privileges.
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={exportAuditCsv}
                    className="px-3.5 py-2 rounded-xl bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/30 text-xs font-semibold flex items-center gap-1.5 transition"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export CSV</span>
                  </button>
                  <button
                    onClick={() => {
                      const randomStaff = staff.length > 0 ? staff : [
                        { name: 'Suresh Kumar', phone: '9876543210' },
                        { name: 'Ramesh Naidu', phone: '9849112233' }
                      ];
                      const chosen = randomStaff[Math.floor(Math.random() * randomStaff.length)];
                      const simEntry: AuditLogItem = {
                        id: 'log_' + Date.now(),
                        timestamp: new Date().toISOString(),
                        staff_name: chosen.name,
                        staff_phone: chosen.phone,
                        role: 'staff',
                        action_type: 'lead_status',
                        module: 'Leads CRM',
                        description: `Updated customer lead status to 'Contacted' for test ride enquiry`,
                        target_id: 1,
                        target_name: 'Kiran Varma (Ninja Z900)',
                        details: { field: 'status', before: 'New', after: 'Contacted', notes: 'Simulated live worker interaction on showroom floor' }
                      };
                      setAuditLogs(prev => [simEntry, ...prev]);
                      showToast(`Simulated live activity logged for ${chosen.name}!`);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-red-600/30 transition"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>+ Log Test Event</span>
                  </button>
                </div>
              </div>

              {/* 4 KPI Metrics */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="bg-[#0B1320]/80 p-4 rounded-xl border border-white/10">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Recorded Events</div>
                  <div className="text-2xl font-black text-white font-mono mt-1">{auditLogs.length}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Stored in audit history</div>
                </div>
                <div className="bg-[#0B1320]/80 p-4 rounded-xl border border-white/10">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Login Sessions</div>
                  <div className="text-2xl font-black text-purple-400 font-mono mt-1">
                    {auditLogs.filter(l => l.action_type === 'login').length}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Staff & Owner logins</div>
                </div>
                <div className="bg-[#0B1320]/80 p-4 rounded-xl border border-white/10">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Inventory Edits</div>
                  <div className="text-2xl font-black text-cyan-400 font-mono mt-1">
                    {auditLogs.filter(l => l.module === 'Inventory').length}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Bikes & Specs updated</div>
                </div>
                <div className="bg-[#0B1320]/80 p-4 rounded-xl border border-white/10">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Leads Touched</div>
                  <div className="text-2xl font-black text-amber-400 font-mono mt-1">
                    {auditLogs.filter(l => l.module === 'Leads CRM').length}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Follow-ups & CRM updates</div>
                </div>
              </div>

              {/* Filtering & Search Bar */}
              <div className="bg-[#0B1320]/80 p-3.5 rounded-xl border border-white/10 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
                <div className="flex-1 relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                    <Search className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    value={auditSearch}
                    onChange={(e) => setAuditSearch(e.target.value)}
                    placeholder="Search by worker name, phone number, vehicle, action description..."
                    className="w-full pl-9 pr-4 py-2 bg-[#0F1A2C] border border-white/10 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500 font-mono"
                  />
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <select
                    value={auditStaffFilter}
                    onChange={(e) => setAuditStaffFilter(e.target.value)}
                    className="px-3 py-2 bg-[#0F1A2C] border border-white/10 rounded-lg text-xs text-slate-300 focus:outline-none"
                  >
                    <option value="ALL">All Staff & Owner</option>
                    <option value="Pavan Kumar">Pavan Kumar (Owner)</option>
                    {staff.map(s => (
                      <option key={s.id} value={s.name}>{s.name} (Staff)</option>
                    ))}
                  </select>

                  <select
                    value={auditModuleFilter}
                    onChange={(e) => setAuditModuleFilter(e.target.value)}
                    className="px-3 py-2 bg-[#0F1A2C] border border-white/10 rounded-lg text-xs text-slate-300 focus:outline-none"
                  >
                    <option value="ALL">All Modules</option>
                    <option value="Auth">Auth & Logins</option>
                    <option value="Inventory">Inventory</option>
                    <option value="Leads CRM">Leads CRM</option>
                    <option value="Billing">Digital Billing</option>
                    <option value="Staff Access">Staff Access</option>
                    <option value="CMS Settings">CMS Settings</option>
                    <option value="Branches">Branches</option>
                  </select>
                </div>
              </div>

              {/* RESPONSIVE AUDIT LOG ENTRIES CONTAINER */}
              <div className="bg-[#0B1320]/80 rounded-2xl border border-white/10 overflow-hidden">
                {/* 1. MOBILE CARDS VIEW (< sm) */}
                <div className="block sm:hidden divide-y divide-white/10 p-3 space-y-3">
                  {filteredAuditLogs.length === 0 ? (
                    <div className="p-8 text-center text-xs text-slate-400">
                      No audit events match your search criteria.
                    </div>
                  ) : (
                    filteredAuditLogs.map((log) => (
                      <div key={log.id} className="pt-3 first:pt-0 space-y-2">
                        {/* Top Row: User & Role Badge */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                              log.role === 'owner' ? 'bg-red-600/20 text-red-400 border border-red-500/30' : 'bg-cyan-600/20 text-cyan-400 border border-cyan-500/30'
                            }`}>
                              {log.staff_name.slice(0, 1).toUpperCase()}
                            </div>
                            <div>
                              <div className="text-xs font-bold text-white leading-tight">{log.staff_name}</div>
                              <div className="text-[10px] text-slate-400 font-mono">+91 {log.staff_phone}</div>
                            </div>
                          </div>
                          <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded border ${
                            log.role === 'owner'
                              ? 'bg-red-950 text-red-300 border-red-800'
                              : 'bg-cyan-950 text-cyan-300 border-cyan-800'
                          }`}>
                            {log.role === 'owner' ? 'Owner' : 'Staff Worker'}
                          </span>
                        </div>

                        {/* Middle Row: Module, Action Badge & Time */}
                        <div className="flex items-center justify-between gap-1 text-[10px]">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="px-2 py-0.5 rounded bg-[#0F1A2C] text-slate-300 border border-white/10 font-medium">
                              {log.module}
                            </span>
                            <span className={`px-2 py-0.5 rounded font-mono uppercase font-bold text-[9px] ${
                              log.action_type === 'login'
                                ? 'bg-purple-950 text-purple-300 border border-purple-800'
                                : log.action_type.includes('inventory')
                                ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                                : log.action_type.includes('lead')
                                ? 'bg-amber-950 text-amber-300 border border-amber-800'
                                : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            }`}>
                              {log.action_type.replace('_', ' ')}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {new Date(log.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}
                          </span>
                        </div>

                        {/* Description */}
                        <div className="text-xs text-slate-200 font-medium bg-[#080E17] p-2.5 rounded-lg border border-white/5">
                          {log.description}
                        </div>

                        {/* Diff Box if present */}
                        {log.details && (log.details.before !== undefined || log.details.notes) && (
                          <div className="text-[10px] bg-[#0F1A2C] p-2 rounded-lg border border-white/5 text-slate-300 space-y-1 font-mono">
                            {log.details.field && (
                              <div className="text-slate-400 font-sans">
                                Field: <span className="text-cyan-400 font-bold">{log.details.field}</span>
                              </div>
                            )}
                            {log.details.before !== undefined && log.details.after !== undefined && (
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="px-1.5 py-0.5 rounded bg-red-950/60 text-red-300 line-through">
                                  {typeof log.details.before === 'object' ? 'Previous State' : String(log.details.before)}
                                </span>
                                <span>➔</span>
                                <span className="px-1.5 py-0.5 rounded bg-emerald-950/60 text-emerald-300 font-bold">
                                  {typeof log.details.after === 'object' ? 'Updated State' : String(log.details.after)}
                                </span>
                              </div>
                            )}
                            {log.details.notes && (
                              <div className="text-slate-400 font-sans pt-0.5">
                                📌 {log.details.notes}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Bottom Actions */}
                        <div className="flex items-center justify-between pt-1">
                          <span className="text-[10px] text-slate-500 font-mono">
                            {new Date(log.timestamp).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </span>
                          <button
                            type="button"
                            onClick={() => setSelectedAuditLog(log)}
                            className="px-2.5 py-1 rounded bg-[#0F1A2C] hover:bg-[#16243C] text-slate-300 hover:text-white border border-white/10 text-[11px] font-semibold flex items-center gap-1"
                          >
                            <Eye className="w-3 h-3 text-cyan-400" />
                            <span>Inspect Forensic</span>
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* 2. DESKTOP / TABLET TABLE VIEW (>= sm) */}
                <div className="hidden sm:block overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="text-slate-400 bg-[#080E17]/60 border-b border-white/10 font-semibold uppercase text-[11px]">
                        <th className="py-3 px-4">TIMESTAMP (IST)</th>
                        <th className="py-3 px-4">STAFF / ACTOR</th>
                        <th className="py-3 px-4">MODULE & ACTION</th>
                        <th className="py-3 px-4">ACTIVITY DESCRIPTION</th>
                        <th className="py-3 px-4">CHANGE FORENSICS</th>
                        <th className="py-3 px-4 text-right">INSPECT</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {filteredAuditLogs.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-slate-400">
                            No audit records found matching query.
                          </td>
                        </tr>
                      ) : (
                        filteredAuditLogs.map((log) => (
                          <tr key={log.id} className="hover:bg-white/[0.02] transition">
                            {/* Timestamp */}
                            <td className="py-3 px-4 whitespace-nowrap">
                              <div className="font-mono text-slate-200 font-bold">
                                {new Date(log.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}
                              </div>
                              <div className="text-[10px] text-slate-400 font-mono">
                                {new Date(log.timestamp).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                              </div>
                            </td>

                            {/* Staff Member */}
                            <td className="py-3 px-4 whitespace-nowrap">
                              <div className="font-bold text-white flex items-center gap-1.5">
                                {log.role === 'owner' ? <Crown className="w-3.5 h-3.5 text-amber-400 shrink-0" /> : <UserCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
                                <span>{log.staff_name}</span>
                              </div>
                              <div className="text-[10px] text-slate-400 font-mono">+91 {log.staff_phone}</div>
                              <span className={`inline-block mt-0.5 text-[9px] font-bold uppercase px-1.5 py-0.2 rounded border ${
                                log.role === 'owner' ? 'bg-red-950 text-red-300 border-red-800' : 'bg-cyan-950 text-cyan-300 border-cyan-800'
                              }`}>
                                {log.role}
                              </span>
                            </td>

                            {/* Module & Action */}
                            <td className="py-3 px-4 whitespace-nowrap">
                              <div className="font-semibold text-slate-200">{log.module}</div>
                              <span className={`inline-block mt-1 text-[9px] font-mono uppercase font-bold px-2 py-0.5 rounded ${
                                log.action_type === 'login'
                                  ? 'bg-purple-950 text-purple-300 border border-purple-800'
                                  : log.action_type.includes('inventory')
                                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                                  : log.action_type.includes('lead')
                                  ? 'bg-amber-950 text-amber-300 border border-amber-800'
                                  : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                              }`}>
                                {log.action_type.replace('_', ' ')}
                              </span>
                            </td>

                            {/* Description & Target */}
                            <td className="py-3 px-4 max-w-xs">
                              <div className="text-slate-200 font-medium leading-relaxed">{log.description}</div>
                              {log.target_name && (
                                <div className="mt-1 text-[11px] text-red-400 font-mono font-semibold">
                                  Target: {log.target_name}
                                </div>
                              )}
                            </td>

                            {/* Change Forensics Diff */}
                            <td className="py-3 px-4 max-w-xs">
                              {log.details ? (
                                <div className="text-[11px] text-slate-300 space-y-1">
                                  {log.details.field && (
                                    <div className="text-slate-400 text-[10px]">
                                      Field: <span className="font-mono text-cyan-300 font-bold">{log.details.field}</span>
                                    </div>
                                  )}
                                  {log.details.before !== undefined && log.details.after !== undefined && (
                                    <div className="flex items-center gap-1 font-mono text-[10px] flex-wrap">
                                      <span className="line-through text-red-400">
                                        {typeof log.details.before === 'object' ? 'Prev State' : String(log.details.before)}
                                      </span>
                                      <span className="text-slate-500">➔</span>
                                      <span className="text-emerald-400 font-bold">
                                        {typeof log.details.after === 'object' ? 'Updated' : String(log.details.after)}
                                      </span>
                                    </div>
                                  )}
                                  {log.details.notes && (
                                    <div className="text-slate-400 text-[10px] truncate max-w-[200px]" title={log.details.notes}>
                                      📌 {log.details.notes}
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <span className="text-slate-500 italic text-[11px]">No state change</span>
                              )}
                            </td>

                            {/* Actions */}
                            <td className="py-3 px-4 text-right whitespace-nowrap">
                              <button
                                type="button"
                                onClick={() => setSelectedAuditLog(log)}
                                className="px-2.5 py-1.5 rounded-lg bg-[#0F1A2C] hover:bg-[#16243C] text-slate-300 hover:text-white border border-white/10 text-xs font-semibold inline-flex items-center gap-1 transition"
                              >
                                <Eye className="w-3.5 h-3.5 text-cyan-400" />
                                <span>Inspect</span>
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* MOBILE BOTTOM NAVIGATION */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0B1320]/95 backdrop-blur-md border-t border-white/10 z-40 px-2 py-2 flex items-center justify-around">
        {hasAccess('overview') && (
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex flex-col items-center gap-1 text-[11px] font-medium py-1 px-2 ${activeTab === 'overview' ? 'text-red-500 font-bold' : 'text-slate-400'}`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span>Overview</span>
          </button>
        )}

        {hasAccess('inventory') && (
          <button
            onClick={() => setActiveTab('inventory')}
            className={`flex flex-col items-center gap-1 text-[11px] font-medium py-1 px-2 ${activeTab === 'inventory' ? 'text-red-500 font-bold' : 'text-slate-400'}`}
          >
            <Bike className="w-5 h-5" />
            <span>Inventory</span>
          </button>
        )}

        {hasAccess('leads') && (
          <button
            onClick={() => setActiveTab('leads')}
            className={`flex flex-col items-center gap-1 text-[11px] font-medium py-1 px-2 ${activeTab === 'leads' ? 'text-red-500 font-bold' : 'text-slate-400'}`}
          >
            <PhoneCall className="w-5 h-5" />
            <span>Leads</span>
          </button>
        )}

        {hasAccess('billing') && (
          <button
            onClick={() => setActiveTab('billing')}
            className={`flex flex-col items-center gap-1 text-[11px] font-medium py-1 px-2 ${activeTab === 'billing' ? 'text-red-500 font-bold' : 'text-slate-400'}`}
          >
            <Receipt className="w-5 h-5" />
            <span>Billing</span>
          </button>
        )}

        {currentUser.role === 'owner' && (
          <button
            onClick={() => setActiveTab('audit')}
            className={`flex flex-col items-center gap-1 text-[11px] font-medium py-1 px-2 ${activeTab === 'audit' ? 'text-amber-400 font-bold' : 'text-slate-400'}`}
          >
            <History className="w-5 h-5 text-amber-400" />
            <span>Audit</span>
          </button>
        )}

        {currentUser.role === 'owner' && (
          <button
            onClick={() => setActiveTab('staff')}
            className={`flex flex-col items-center gap-1 text-[11px] font-medium py-1 px-2 ${activeTab === 'staff' ? 'text-red-500 font-bold' : 'text-slate-400'}`}
          >
            <Users className="w-5 h-5" />
            <span>Staff</span>
          </button>
        )}
      </nav>

      {/* ============================================================== */}
      {/* POPUP MODALS                                                   */}
      {/* ============================================================== */}

      {/* 1. ADD / EDIT BIKE MODAL */}
      {showBikeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-[#0B1320] p-6 rounded-2xl border border-white/10 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <h3 className="text-base font-bold text-white">
                {editingBike ? 'Edit Vehicle / Gear' : 'Add Vehicle / Riding Gear'}
              </h3>
              <button onClick={() => setShowBikeModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as any;
                const finalImg = bikeModalImage || form.bikeImageManual?.value || editingBike?.image_url || '/public/assets/aistudio/image_f4045ab9.png';
                const newBike: BikeItem = {
                  id: editingBike ? editingBike.id : Date.now(),
                  name: form.bikeName.value,
                  brand: form.bikeBrand.value,
                  category: form.bikeCategory.value,
                  price: Number(form.bikePrice.value) || 0,
                  year: Number(form.bikeYear.value) || 2026,
                  km: Number(form.bikeKm.value) || 0,
                  image_url: finalImg,
                  status: form.bikeStatus.value,
                  displacement_cc: editingBike?.displacement_cc || bikeModalDisplacement || '1000 cc',
                  engine_type: editingBike?.engine_type || bikeModalEngineType || 'Inline-4 Engine',
                  max_power: editingBike?.max_power || bikeModalPower || '160 hp',
                  acceleration: editingBike?.acceleration || bikeModalAcceleration || '3.2s',
                  fuel_type: editingBike?.fuel_type || bikeModalFuel || 'Petrol',
                  location: editingBike?.location || bikeModalLocation || 'Hyderabad – Main Showroom',
                  tagline: editingBike?.tagline || bikeModalTagline || 'Muscular stance with superbike heart.',
                  colorways: editingBike?.colorways || bikeModalColorways,
                  addon_gear_name: editingBike?.addon_gear_name || bikeModalAddonName || 'Ducati Corse Riding Leather',
                  addon_gear_price: editingBike?.addon_gear_price || bikeModalAddonPrice || 38500,
                  warranty_badge: editingBike?.warranty_badge || bikeModalWarranty || 'Adarsh Verified: 120-Point Inspection, Clear Title & 1-Year Engine Warranty.'
                };

                if (editingBike) {
                  setBikes(prev => prev.map(item => item.id === editingBike.id ? newBike : item));
                  showToast(`Updated ${newBike.name}`);
                  logAuditAction(
                    'inventory_edit',
                    'Inventory',
                    `${currentUser?.name} updated vehicle details for ${newBike.name} (₹${newBike.price.toLocaleString('en-IN')})`,
                    newBike.id,
                    newBike.name,
                    {
                      field: 'specs',
                      before: { price: editingBike.price, status: editingBike.status, km: editingBike.km },
                      after: { price: newBike.price, status: newBike.status, km: newBike.km },
                      notes: `Category: ${newBike.category}, Status: ${newBike.status}`
                    }
                  );
                  supabase.from('bikes').update(newBike).eq('id', editingBike.id).then();
                } else {
                  setBikes(prev => [newBike, ...prev]);
                  showToast(`Added ${newBike.name} to inventory!`);
                  logAuditAction(
                    'inventory_add',
                    'Inventory',
                    `${currentUser?.name} added new vehicle ${newBike.name} (${newBike.brand}, ₹${newBike.price.toLocaleString('en-IN')})`,
                    newBike.id,
                    newBike.name,
                    { notes: `Year: ${newBike.year}, KM: ${newBike.km}, Status: ${newBike.status}` }
                  );
                  supabase.from('bikes').insert([newBike]).then();
                }
                setShowBikeModal(false);
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Vehicle Name</label>
                  <input
                    name="bikeName"
                    required
                    defaultValue={editingBike?.name}
                    placeholder="e.g. Kawasaki Ninja Z900"
                    className="w-full px-3 py-2 bg-[#0F1A2C] border border-white/10 rounded-lg text-xs text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Brand</label>
                  <input
                    name="bikeBrand"
                    required
                    defaultValue={editingBike?.brand}
                    placeholder="e.g. Kawasaki / BMW"
                    className="w-full px-3 py-2 bg-[#0F1A2C] border border-white/10 rounded-lg text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Category</label>
                  <select
                    name="bikeCategory"
                    defaultValue={editingBike?.category || 'Superbike'}
                    className="w-full px-3 py-2 bg-[#0F1A2C] border border-white/10 rounded-lg text-xs text-white focus:outline-none"
                  >
                    <option value="Superbike">Superbike</option>
                    <option value="Commuter">Commuter</option>
                    <option value="Scooter">Scooter</option>
                    <option value="Adventure">Adventure</option>
                    <option value="Cruiser">Cruiser</option>
                    <option value="Riding Gear">Riding Gear</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Year</label>
                  <input
                    name="bikeYear"
                    type="number"
                    defaultValue={editingBike?.year || 2026}
                    className="w-full px-3 py-2 bg-[#0F1A2C] border border-white/10 rounded-lg text-xs text-white focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">KM Driven</label>
                  <input
                    name="bikeKm"
                    type="number"
                    defaultValue={editingBike?.km || 0}
                    className="w-full px-3 py-2 bg-[#0F1A2C] border border-white/10 rounded-lg text-xs text-white focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Price (₹ INR)</label>
                  <input
                    name="bikePrice"
                    type="number"
                    required
                    defaultValue={editingBike?.price || 920000}
                    className="w-full px-3 py-2 bg-[#0F1A2C] border border-white/10 rounded-lg text-xs text-white focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Status</label>
                  <select
                    name="bikeStatus"
                    defaultValue={editingBike?.status || 'Available'}
                    className="w-full px-3 py-2 bg-[#0F1A2C] border border-white/10 rounded-lg text-xs text-white focus:outline-none"
                  >
                    <option value="Available">Available</option>
                    <option value="Booked">Booked</option>
                    <option value="Sold">Sold</option>
                  </select>
                </div>
              </div>

              {/* CHOOSE FILES / GALLERY PICKER (REPLACING URL INPUT) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-slate-300 uppercase">
                    Vehicle Photo (Choose Files / Gallery)
                  </label>
                  {bikeModalImage && (
                    <button
                      type="button"
                      onClick={() => setBikeModalImage('')}
                      className="text-[11px] text-red-400 hover:text-red-300 flex items-center gap-1 font-normal"
                    >
                      <Trash2 className="w-3 h-3" /> Remove Photo
                    </button>
                  )}
                </div>

                {bikeModalImage ? (
                  <div className="relative rounded-xl overflow-hidden border border-white/15 bg-[#080E17] group">
                    <img
                      src={bikeModalImage}
                      alt="Vehicle preview"
                      className="w-full h-44 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2.5">
                      <label className="px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow transition">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Change from Device</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleImageFileUpload(file);
                          }}
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowGalleryPicker(!showGalleryPicker)}
                        className="px-3.5 py-1.5 rounded-lg bg-[#0F1A2C] hover:bg-[#16243C] border border-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition"
                      >
                        <ImageIcon className="w-3.5 h-3.5" />
                        <span>Gallery Presets</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const file = e.dataTransfer.files?.[0];
                      if (file) handleImageFileUpload(file);
                    }}
                    className="border-2 border-dashed border-white/15 hover:border-red-500/50 rounded-xl p-5 bg-[#080E17]/70 text-center transition flex flex-col items-center justify-center gap-3"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-red-600/10 border border-red-500/20 text-red-400 flex items-center justify-center shadow-inner">
                      <Upload className="w-6 h-6" />
                    </div>

                    <div>
                      <div className="text-xs font-bold text-white">
                        Choose photo from laptop files or phone gallery
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Direct upload · Supports camera capture, JPG, PNG & WEBP
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap justify-center">
                      <label className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-red-600/30 cursor-pointer transition active:scale-95">
                        <FolderOpen className="w-4 h-4" />
                        <span>Choose Files / Gallery</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleImageFileUpload(file);
                          }}
                        />
                      </label>

                      <button
                        type="button"
                        onClick={() => setShowGalleryPicker(!showGalleryPicker)}
                        className="px-3.5 py-2 rounded-xl bg-[#0F1A2C] hover:bg-[#16243C] border border-white/10 text-slate-300 hover:text-white font-semibold text-xs flex items-center gap-1.5 transition"
                      >
                        <ImageIcon className="w-4 h-4 text-cyan-400" />
                        <span>Showroom Stock</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Showroom Gallery Presets */}
                {showGalleryPicker && (
                  <div className="p-3 rounded-xl bg-[#080E17] border border-white/10 space-y-2 animate-fade-in">
                    <div className="flex items-center justify-between text-xs text-slate-300 font-semibold">
                      <span>Pick from Showroom Stock</span>
                      <button
                        type="button"
                        onClick={() => setShowGalleryPicker(false)}
                        className="text-slate-500 hover:text-white"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { title: 'Kawasaki Ninja Z900', url: '/public/assets/aistudio/image_f4045ab9.png' },
                        { title: 'Ducati Panigale V2', url: '/public/assets/aistudio/image_f4045ab9.png' },
                        { title: 'BMW G310 GS', url: '/public/assets/aistudio/image_f4045ab9.png' },
                        { title: 'Honda Activa 6G', url: '/public/assets/aistudio/image_f4045ab9.png' }
                      ].map((item, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setBikeModalImage(item.url);
                            setShowGalleryPicker(false);
                            showToast(`Selected ${item.title}`);
                          }}
                          className="p-1 rounded-lg bg-[#0F1A2C] hover:border-red-500 border border-white/10 text-left transition overflow-hidden group"
                        >
                          <img
                            src={item.url}
                            alt={item.title}
                            className="w-full h-12 object-cover rounded"
                          />
                          <div className="text-[10px] text-slate-300 font-medium truncate mt-1">
                            {item.title}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Optional Web URL Accordion Toggle */}
                <div className="pt-1">
                  {!useUrlFallback ? (
                    <button
                      type="button"
                      onClick={() => setUseUrlFallback(true)}
                      className="text-[11px] text-slate-500 hover:text-slate-400 underline"
                    >
                      Or enter web URL manually
                    </button>
                  ) : (
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] text-slate-400">Web Image URL</label>
                        <button
                          type="button"
                          onClick={() => setUseUrlFallback(false)}
                          className="text-[11px] text-slate-500 hover:text-slate-400"
                        >
                          Hide
                        </button>
                      </div>
                      <input
                        name="bikeImageManual"
                        defaultValue={bikeModalImage}
                        placeholder="https://..."
                        onChange={(e) => setBikeModalImage(e.target.value)}
                        className="w-full px-3 py-1.5 bg-[#0F1A2C] border border-white/10 rounded-lg text-xs text-white focus:outline-none"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowBikeModal(false)}
                  className="px-4 py-2 rounded-lg bg-[#0F1A2C] text-slate-300 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-semibold text-xs shadow-md shadow-red-600/30"
                >
                  Save Vehicle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. LOG WALK-IN LEAD MODAL */}
      {showLeadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#0B1320] p-6 rounded-2xl border border-white/10">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <h3 className="text-base font-bold text-white">Log Walk-In / Phone Lead</h3>
              <button onClick={() => setShowLeadModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as any;
                const newLead: LeadItem = {
                  id: Date.now(),
                  customer_name: form.leadName.value,
                  phone: form.leadPhone.value,
                  bike_interested: form.leadBike.value,
                  message: form.leadNotes.value,
                  status: 'New',
                  created_at: new Date().toISOString()
                };
                setLeads(prev => [newLead, ...prev]);
                showToast(`Lead logged for ${newLead.customer_name}!`);
                logAuditAction(
                  'lead_view',
                  'Leads CRM',
                  `${currentUser?.name} logged walk-in enquiry for ${newLead.customer_name} (+91 ${newLead.phone})`,
                  newLead.id,
                  `${newLead.customer_name} (${newLead.bike_interested})`,
                  { notes: `Requirement: ${newLead.message || 'Showroom consultation'}` }
                );
                supabase.from('leads').insert([newLead]).then();
                setShowLeadModal(false);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Customer Full Name</label>
                <input
                  name="leadName"
                  required
                  placeholder="e.g. Rahul Sharma"
                  className="w-full px-3 py-2 bg-[#0F1A2C] border border-white/10 rounded-lg text-xs text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Phone Number</label>
                <input
                  name="leadPhone"
                  type="tel"
                  required
                  placeholder="e.g. 9849012345"
                  className="w-full px-3 py-2 bg-[#0F1A2C] border border-white/10 rounded-lg text-xs text-white focus:outline-none font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Vehicle Interested</label>
                <input
                  name="leadBike"
                  required
                  placeholder="e.g. Kawasaki Ninja Z900 / Test Ride"
                  className="w-full px-3 py-2 bg-[#0F1A2C] border border-white/10 rounded-lg text-xs text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Customer Requirement</label>
                <textarea
                  name="leadNotes"
                  rows={2}
                  placeholder="e.g. Looking for finance options."
                  className="w-full px-3 py-2 bg-[#0F1A2C] border border-white/10 rounded-lg text-xs text-white focus:outline-none"
                />
              </div>
              <div className="pt-3 border-t border-white/10 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowLeadModal(false)}
                  className="px-4 py-2 rounded-lg bg-[#0F1A2C] text-slate-300 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-semibold text-xs shadow-md shadow-red-600/30"
                >
                  Save Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. GENERATE NEW INVOICE MODAL (MANDATORY REG # & DOCUMENT UPLOADER) */}
      {showInvoiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-xl bg-[#0B1320] p-6 rounded-2xl border border-white/10 my-8 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-red-500" />
                  <span>Generate Vehicle Sales Invoice</span>
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Vehicle Registration Number is mandatory. Documents & E-charger kit can be attached.
                </p>
              </div>
              <button onClick={() => setShowInvoiceModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as any;
                const regNum = (form.invRegNumber?.value || '').trim().toUpperCase();
                if (!regNum) {
                  showToast('Vehicle Registration Number is strictly required!');
                  return;
                }

                const autoInvNum = `AM-2026-${String(invoices.length + 101).padStart(3, '0')}`;
                const newInv: InvoiceItem = {
                  id: Date.now(),
                  invoice_number: autoInvNum,
                  customer_name: form.invCustomer.value.trim(),
                  mobile: form.invMobile.value.trim(),
                  vehicle: form.invVehicle.value.trim(),
                  reg_number: regNum,
                  price: Number(form.invPrice.value) || 0,
                  payment_mode: form.invMode.value,
                  has_echarger: invoiceHasEcharger,
                  echarger_details: invoiceHasEcharger ? invoiceEchargerDetails : undefined,
                  documents: invoiceFormDocs.length > 0 ? [...invoiceFormDocs] : undefined,
                  notes: form.invNotes.value.trim() || 'Paid in full. Official Delivery Handover Completed.',
                  created_at: new Date().toISOString()
                };

                setInvoices(prev => [newInv, ...prev]);
                showToast(`Sales Bill ${autoInvNum} generated with Reg: ${regNum}!`);
                logAuditAction(
                  'billing_create',
                  'Billing',
                  `${currentUser?.name} issued GST sales invoice ${autoInvNum} (Reg #${regNum}) for ${newInv.customer_name}`,
                  newInv.id,
                  `${newInv.customer_name} (${regNum})`,
                  {
                    notes: `Amount: ₹${newInv.price.toLocaleString('en-IN')}, Mode: ${newInv.payment_mode}, Vehicle: ${newInv.vehicle}, Docs attached: ${invoiceFormDocs.length}, EV Charger: ${invoiceHasEcharger ? 'Yes' : 'No'}`
                  }
                );
                supabase.from('invoices').insert([newInv]).then();
                setShowInvoiceModal(false);
                setInvoiceFormDocs([]);
                setInvoiceHasEcharger(false);
                setShowPrintInvoiceModal(newInv);
              }}
              className="space-y-4"
            >
              {/* Customer Info */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                    Customer Name <span className="text-red-500 font-bold">*</span>
                  </label>
                  <input
                    name="invCustomer"
                    required
                    placeholder="e.g. Vikram Reddy"
                    className="w-full px-3 py-2 bg-[#0F1A2C] border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                    Mobile Number <span className="text-red-500 font-bold">*</span>
                  </label>
                  <input
                    name="invMobile"
                    type="tel"
                    required
                    placeholder="e.g. 9876543210"
                    className="w-full px-3 py-2 bg-[#0F1A2C] border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-red-500 font-mono"
                  />
                </div>
              </div>

              {/* MANDATORY Vehicle Registration Number */}
              <div className="p-3 bg-red-950/20 border border-red-500/30 rounded-xl">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-red-400 uppercase tracking-wide flex items-center gap-1.5">
                    <FileBadge className="w-4 h-4 text-red-500" />
                    <span>Vehicle Registration Number <span className="text-red-400 font-extrabold">*</span></span>
                  </label>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-900/50 text-red-200 border border-red-700">
                    MANDATORY
                  </span>
                </div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-400 font-black text-xs pointer-events-none">
                    IND
                  </span>
                  <input
                    name="invRegNumber"
                    required
                    placeholder="e.g. TS 09 EQ 4200 (or AP / KA / MH / Temp Reg)"
                    className="w-full pl-12 pr-3 py-2 bg-[#080E17] border border-red-500/50 rounded-lg text-sm text-white focus:outline-none focus:border-red-400 font-mono uppercase tracking-widest font-black"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  Required for RTO registration transfer, tax invoice, warranty, and customer verification portal.
                </p>
              </div>

              {/* Vehicle Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Vehicle / Product Sold <span className="text-red-500 font-bold">*</span>
                </label>
                <input
                  name="invVehicle"
                  required
                  placeholder="e.g. Kawasaki Ninja Z900 (2026 Metallic Spark Black)"
                  className="w-full px-3 py-2 bg-[#0F1A2C] border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>

              {/* Price & Payment */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                    Sale Price (₹ INR) <span className="text-red-500 font-bold">*</span>
                  </label>
                  <input
                    name="invPrice"
                    type="number"
                    required
                    placeholder="e.g. 920000"
                    className="w-full px-3 py-2 bg-[#0F1A2C] border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-red-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Payment Method</label>
                  <select
                    name="invMode"
                    className="w-full px-3 py-2 bg-[#0F1A2C] border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-red-500"
                  >
                    <option value="UPI">UPI / GPay / PhonePe</option>
                    <option value="Bank Transfer">NEFT / RTGS Transfer</option>
                    <option value="Cash">Cash Deposit</option>
                    <option value="Finance">Vehicle Finance / Loan</option>
                  </select>
                </div>
              </div>

              {/* OPTIONAL: E-Charger Section */}
              <div className="p-3 bg-[#080E17]/80 rounded-xl border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-200">
                    <input
                      type="checkbox"
                      checked={invoiceHasEcharger}
                      onChange={(e) => setInvoiceHasEcharger(e.target.checked)}
                      className="rounded bg-slate-700 text-red-600 focus:ring-0"
                    />
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    <span>Include E-Charger / Home Fast Charger Unit (Optional)</span>
                  </label>
                  {invoiceHasEcharger && (
                    <span className="text-[10px] text-amber-400 font-mono font-bold">EV UNIT ACTIVE</span>
                  )}
                </div>
                {invoiceHasEcharger && (
                  <div>
                    <input
                      type="text"
                      value={invoiceEchargerDetails}
                      onChange={(e) => setInvoiceEchargerDetails(e.target.value)}
                      placeholder="e.g. 7.4kW Fast Home Charging Unit (S/N: CHG-2026-904) with 3-Year Warranty"
                      className="w-full px-3 py-1.5 bg-[#0F1A2C] border border-white/10 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500 font-mono"
                    />
                  </div>
                )}
              </div>

              {/* OPTIONAL: Upload Vehicle Documents & Delivery Photos */}
              <div className="p-3.5 bg-[#080E17]/80 rounded-xl border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-200">
                    <Upload className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Upload Vehicle Documents & Handover Photos (Optional)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={addSampleInvoiceDocs}
                      className="text-[10px] text-amber-400 hover:text-amber-300 font-semibold underline"
                    >
                      + Quick Sample Papers
                    </button>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[#0F1A2C] text-slate-300 font-mono">
                      {invoiceFormDocs.length} attached
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Document Type</label>
                    <select
                      value={invoiceDocType}
                      onChange={(e) => setInvoiceDocType(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-[#0F1A2C] border border-white/10 rounded-lg text-xs text-white"
                    >
                      <option value="rc">Registration Certificate (RC)</option>
                      <option value="insurance">Insurance Policy</option>
                      <option value="puc">PUC Pollution Certificate</option>
                      <option value="photo">Vehicle Handover Delivery Photo</option>
                      <option value="echarger">E-Charger Bill & Warranty</option>
                      <option value="other">Other Official Document</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Pick From Laptop / Camera</label>
                    <label className="flex items-center justify-center gap-2 px-3 py-1.5 bg-[#0F1A2C] hover:bg-[#16243C] border border-white/20 border-dashed rounded-lg text-xs text-slate-200 cursor-pointer transition">
                      <Camera className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Choose Multiple Files</span>
                      <input
                        type="file"
                        multiple
                        accept="image/*,application/pdf"
                        onChange={handleInvoiceFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Attached Document Preview Pills */}
                {invoiceFormDocs.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-white/10">
                    {invoiceFormDocs.map((doc, idx) => (
                      <div key={idx} className="relative group p-2 rounded-lg bg-[#0F1A2C] border border-white/10 text-[11px]">
                        {doc.url.startsWith('data:image') || doc.url.startsWith('http') || doc.url.startsWith('/public') ? (
                          <img src={doc.url} alt={doc.name} className="w-full h-12 object-cover rounded mb-1" />
                        ) : (
                          <div className="w-full h-12 flex items-center justify-center bg-[#080E17] rounded mb-1 text-slate-400">
                            <FileText className="w-5 h-5 text-cyan-400" />
                          </div>
                        )}
                        <div className="truncate font-semibold text-slate-200">{doc.name}</div>
                        <div className="text-[9px] uppercase font-bold text-red-400">{doc.type}</div>
                        <button
                          type="button"
                          onClick={() => setInvoiceFormDocs(prev => prev.filter((_, i) => i !== idx))}
                          className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-80 hover:opacity-100"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Remarks */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Delivery Remarks</label>
                <input
                  name="invNotes"
                  placeholder="e.g. Certified inspection done, helmet included, 1st service voucher given."
                  className="w-full px-3 py-2 bg-[#0F1A2C] border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="pt-3 border-t border-white/10 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowInvoiceModal(false)}
                  className="px-4 py-2 rounded-lg bg-[#0F1A2C] text-slate-300 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-semibold text-xs shadow-md shadow-red-600/30 flex items-center gap-1.5"
                >
                  <Receipt className="w-4 h-4" />
                  <span>Generate Bill & View Invoice</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. PRINTABLE & DOWNLOADABLE GST TAX INVOICE MODAL */}
      {showPrintInvoiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-2xl bg-white text-slate-900 rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
            <div className="p-3 bg-slate-100 border-b border-slate-200 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Receipt className="w-4 h-4 text-red-600" />
                Customer Tax Invoice
              </span>
              <div className="flex items-center gap-2">
                {/* Working Download Invoice Button */}
                <button
                  onClick={() => downloadInvoice(showPrintInvoiceModal)}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 shadow transition"
                >
                  <Download className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Download Invoice</span>
                </button>

                {/* Working Print Invoice Button */}
                <button
                  onClick={() => window.print()}
                  className="px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow transition"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Invoice</span>
                </button>

                <button
                  onClick={() => setShowPrintInvoiceModal(null)}
                  className="p-1.5 text-slate-500 hover:text-slate-900"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-8 overflow-y-auto flex-1 font-sans text-slate-900">
              <div className="flex justify-between items-start border-b-2 border-slate-900 pb-5">
                <div>
                  <h1 className="text-2xl font-black tracking-tight text-slate-900 uppercase">
                    ADARSH <span className="text-red-600">MOTORS</span>
                  </h1>
                  <p className="text-[11px] font-bold tracking-widest text-slate-600 uppercase">
                    PERFORMANCE. REFINED.
                  </p>
                  <p className="text-xs text-slate-600 mt-2 max-w-xs">{settings.address}</p>
                  <p className="text-xs text-slate-600">Tel: {settings.salesPhone} · GSTIN: 36AADCA1234F1Z8</p>
                </div>
                <div className="text-right">
                  <div className="inline-block px-3 py-1 bg-red-100 text-red-700 font-black text-xs uppercase tracking-widest rounded-md mb-2">
                    TAX INVOICE
                  </div>
                  <div className="text-xs text-slate-500">Invoice Number</div>
                  <div className="text-base font-bold font-mono text-slate-900">
                    {showPrintInvoiceModal.invoice_number}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    Date: {new Date(showPrintInvoiceModal.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </div>
                  <div className="inline-block mt-2 px-2.5 py-0.5 rounded bg-red-50 border border-red-300 font-mono font-bold text-red-700 text-xs">
                    REG #: {showPrintInvoiceModal.reg_number}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 my-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <div className="text-[11px] font-bold uppercase text-slate-500 mb-1">BILL TO (CUSTOMER)</div>
                  <div className="text-sm font-bold text-slate-900">{showPrintInvoiceModal.customer_name}</div>
                  <div className="text-xs text-slate-600 font-mono mt-0.5">+91 {showPrintInvoiceModal.mobile}</div>
                  <div className="text-xs text-slate-500 mt-1">Place of Supply: Telangana (36)</div>
                </div>
                <div>
                  <div className="text-[11px] font-bold uppercase text-slate-500 mb-1">PAYMENT & DISPATCH</div>
                  <div className="text-xs text-slate-700">Mode: <span className="font-bold text-slate-900">{showPrintInvoiceModal.payment_mode}</span></div>
                  <div className="text-xs text-slate-700 mt-1">Status: <span className="font-bold text-emerald-600">Paid in Full</span></div>
                  {showPrintInvoiceModal.has_echarger && (
                    <div className="text-xs text-amber-700 font-bold mt-1">
                      ⚡ E-Charger: {showPrintInvoiceModal.echarger_details || 'Fast Home Charger Included'}
                    </div>
                  )}
                  <div className="text-xs text-slate-500 mt-1">{showPrintInvoiceModal.notes}</div>
                </div>
              </div>

              <table className="w-full text-left text-xs mb-6 border border-slate-200 rounded-lg overflow-hidden">
                <thead className="bg-slate-100 text-slate-700 uppercase font-bold text-[11px]">
                  <tr>
                    <th className="p-3">#</th>
                    <th className="p-3">DESCRIPTION OF VEHICLE & REGISTRATION</th>
                    <th className="p-3 text-center">HSN</th>
                    <th className="p-3 text-right">QTY</th>
                    <th className="p-3 text-right">AMOUNT (INR)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr>
                    <td className="p-3 font-mono">01</td>
                    <td className="p-3">
                      <div className="font-bold text-slate-900">{showPrintInvoiceModal.vehicle}</div>
                      <div className="font-mono text-xs text-red-600 font-bold mt-0.5">
                        Vehicle Reg No: {showPrintInvoiceModal.reg_number}
                      </div>
                      {showPrintInvoiceModal.has_echarger && (
                        <div className="text-[11px] text-amber-700 font-medium mt-0.5">
                          Included: {showPrintInvoiceModal.echarger_details}
                        </div>
                      )}
                      <div className="text-[11px] text-slate-500 mt-0.5">Certified Pre-Owned Inspection Passed</div>
                    </td>
                    <td className="p-3 text-center font-mono">8711</td>
                    <td className="p-3 text-right font-mono">1</td>
                    <td className="p-3 text-right font-mono font-bold text-slate-900">{formatINR(showPrintInvoiceModal.price)}</td>
                  </tr>
                </tbody>
              </table>

              {/* Uploaded Documents Gallery in Printable Invoice */}
              {showPrintInvoiceModal.documents && showPrintInvoiceModal.documents.length > 0 && (
                <div className="mb-6 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center justify-between">
                    <span>Attached Vehicle Documents & Handover Papers ({showPrintInvoiceModal.documents.length})</span>
                    <span className="text-[10px] text-slate-500 font-normal">Click to view full preview</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {showPrintInvoiceModal.documents.map((d, i) => (
                      <div
                        key={i}
                        onClick={() => setPreviewDocModal(d)}
                        className="p-2 bg-white rounded-lg border border-slate-200 hover:border-red-500 cursor-pointer transition flex items-center gap-2"
                      >
                        <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center shrink-0">
                          {d.type === 'photo' ? <Camera className="w-4 h-4 text-cyan-600" /> : <FileText className="w-4 h-4 text-red-600" />}
                        </div>
                        <div className="truncate">
                          <div className="text-xs font-semibold text-slate-900 truncate">{d.name}</div>
                          <div className="text-[9px] uppercase font-bold text-red-600">{d.type}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-between items-end border-t border-slate-200 pt-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded border-2 border-emerald-600 text-emerald-700 font-extrabold uppercase text-xs">
                  <CheckCircle className="w-4 h-4" />
                  OFFICIALLY PAID
                </div>
                <div className="w-64 space-y-1 text-xs text-right">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal:</span>
                    <span className="font-mono">{formatINR(showPrintInvoiceModal.price)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>GST & RTO:</span>
                    <span className="font-mono">Included</span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-slate-900 border-t border-slate-300 pt-1.5">
                    <span>Grand Total:</span>
                    <span className="font-mono text-red-600">{formatINR(showPrintInvoiceModal.price)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. ADD / EDIT BRANCH MODAL */}
      {showBranchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#0B1320] p-6 rounded-2xl border border-white/10">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <h3 className="text-base font-bold text-white">
                {editingBranch ? 'Edit Showroom' : 'Add Showroom Branch'}
              </h3>
              <button onClick={() => setShowBranchModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as any;
                const newBranch: BranchItem = {
                  id: editingBranch ? editingBranch.id : Date.now(),
                  city: form.brCity.value,
                  branch_name: form.brName.value,
                  address: form.brAddress.value,
                  phone: form.brPhone.value,
                  maps_url: form.brMaps.value,
                  status: 'Active'
                };
                if (editingBranch) {
                  setBranches(prev => prev.map(item => item.id === editingBranch.id ? newBranch : item));
                  showToast(`Updated ${newBranch.branch_name}`);
                  supabase.from('branches').update(newBranch).eq('id', editingBranch.id).then();
                } else {
                  setBranches(prev => [...prev, newBranch]);
                  showToast(`Added showroom: ${newBranch.branch_name}`);
                  supabase.from('branches').insert([newBranch]).then();
                }
                setShowBranchModal(false);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">City</label>
                <input
                  name="brCity"
                  required
                  defaultValue={editingBranch?.city}
                  placeholder="e.g. Hyderabad / Bengaluru"
                  className="w-full px-3 py-2 bg-[#0F1A2C] border border-white/10 rounded-lg text-xs text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Showroom Branch Name</label>
                <input
                  name="brName"
                  required
                  defaultValue={editingBranch?.branch_name}
                  placeholder="e.g. Hyderabad — Main Flagship Showroom"
                  className="w-full px-3 py-2 bg-[#0F1A2C] border border-white/10 rounded-lg text-xs text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Street Address</label>
                <textarea
                  name="brAddress"
                  required
                  rows={2}
                  defaultValue={editingBranch?.address}
                  placeholder="e.g. Plot 42, Road 36, Jubilee Hills"
                  className="w-full px-3 py-2 bg-[#0F1A2C] border border-white/10 rounded-lg text-xs text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Showroom Phone</label>
                <input
                  name="brPhone"
                  required
                  defaultValue={editingBranch?.phone}
                  placeholder="+91 9014540489"
                  className="w-full px-3 py-2 bg-[#0F1A2C] border border-white/10 rounded-lg text-xs text-white focus:outline-none font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Google Maps URL</label>
                <input
                  name="brMaps"
                  defaultValue={editingBranch?.maps_url}
                  placeholder="https://maps.google.com/..."
                  className="w-full px-3 py-2 bg-[#0F1A2C] border border-white/10 rounded-lg text-xs text-white focus:outline-none"
                />
              </div>
              <div className="pt-3 border-t border-white/10 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowBranchModal(false)}
                  className="px-4 py-2 rounded-lg bg-[#0F1A2C] text-slate-300 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-semibold text-xs shadow-md shadow-red-600/30"
                >
                  Save Branch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. ADD / EDIT STAFF MODAL */}
      {showStaffModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#0B1320] p-6 rounded-2xl border border-white/10">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <h3 className="text-base font-bold text-white">
                {editingStaff ? 'Edit Staff Permissions' : 'Create Staff Account'}
              </h3>
              <button onClick={() => setShowStaffModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as any;
                const permissions: string[] = [];
                if (form.permOverview?.checked) permissions.push('overview');
                if (form.permInventory.checked) permissions.push('inventory');
                if (form.permLeads.checked) permissions.push('leads');
                if (form.permBilling.checked) permissions.push('billing');
                if (form.permBranches.checked) permissions.push('branches');
                if (form.permSettings.checked) permissions.push('settings');

                const newStaff: StaffItem = {
                  id: editingStaff ? editingStaff.id : Date.now(),
                  name: form.staffName.value.trim(),
                  phone: cleanPhone(form.staffPhone.value),
                  pin: form.staffPin.value.trim(),
                  role: 'staff',
                  permissions,
                  status: 'Active'
                };

                if (editingStaff) {
                  setStaff(prev => prev.map(item => item.id === editingStaff.id ? newStaff : item));
                  showToast(`Updated ${newStaff.name}`);
                  logAuditAction(
                    'staff_edit',
                    'Staff Access',
                    `Owner updated permissions for staff worker ${newStaff.name} (+91 ${newStaff.phone})`,
                    newStaff.id,
                    newStaff.name,
                    {
                      field: 'permissions',
                      before: editingStaff.permissions,
                      after: permissions,
                      notes: `Granted: ${permissions.length > 0 ? permissions.join(', ') : 'None'}`
                    }
                  );
                  supabase.from('staff_users').update(newStaff).eq('id', editingStaff.id).then();
                } else {
                  setStaff(prev => [...prev, newStaff]);
                  showToast(`Account created for ${newStaff.name}`);
                  logAuditAction(
                    'staff_edit',
                    'Staff Access',
                    `Owner created new staff account for ${newStaff.name} (+91 ${newStaff.phone}) with PIN ${newStaff.pin}`,
                    newStaff.id,
                    newStaff.name,
                    { notes: `Assigned modules: ${permissions.length > 0 ? permissions.join(', ') : 'None'}` }
                  );
                  supabase.from('staff_users').insert([newStaff]).then();
                }
                setShowStaffModal(false);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Staff Full Name</label>
                <input
                  name="staffName"
                  required
                  defaultValue={editingStaff?.name}
                  placeholder="e.g. Suresh Kumar"
                  className="w-full px-3 py-2 bg-[#0F1A2C] border border-white/10 rounded-lg text-xs text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Phone Number</label>
                  <input
                    name="staffPhone"
                    type="tel"
                    required
                    defaultValue={editingStaff?.phone}
                    placeholder="e.g. 9876543210"
                    className="w-full px-3 py-2 bg-[#0F1A2C] border border-white/10 rounded-lg text-xs text-white focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">4-Digit PIN</label>
                  <input
                    name="staffPin"
                    required
                    maxLength={6}
                    defaultValue={editingStaff?.pin}
                    placeholder="e.g. 2026"
                    className="w-full px-3 py-2 bg-[#0F1A2C] border border-white/10 rounded-lg text-xs text-white focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">Granted Modules</label>
                <div className="space-y-2 bg-[#0F1A2C] p-3 rounded-xl border border-white/5 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer p-1.5 rounded-lg hover:bg-white/5 transition">
                    <input
                      type="checkbox"
                      name="permOverview"
                      defaultChecked={editingStaff?.permissions.includes('overview')}
                      className="rounded bg-slate-700 text-red-600 focus:ring-0"
                    />
                    <div>
                      <span className="text-slate-200 font-semibold">Overview Dashboard</span>
                      <span className="text-[10px] text-slate-500 block">Showroom revenue metrics & financial stats (Hidden from workers by default)</span>
                    </div>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer p-1.5 rounded-lg hover:bg-white/5 transition">
                    <input
                      type="checkbox"
                      name="permInventory"
                      defaultChecked={editingStaff?.permissions.includes('inventory')}
                      className="rounded bg-slate-700 text-red-600 focus:ring-0"
                    />
                    <div>
                      <span className="text-slate-200 font-semibold">Inventory Manager</span>
                      <span className="text-[10px] text-slate-500 block">Add, edit, or delete bikes, scooters & riding gear</span>
                    </div>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer p-1.5 rounded-lg hover:bg-white/5 transition">
                    <input
                      type="checkbox"
                      name="permLeads"
                      defaultChecked={editingStaff?.permissions.includes('leads')}
                      className="rounded bg-slate-700 text-red-600 focus:ring-0"
                    />
                    <div>
                      <span className="text-slate-200 font-semibold">Leads CRM</span>
                      <span className="text-[10px] text-slate-500 block">Manage website buyer enquiries, test-ride bookings & WhatsApp/Calls</span>
                    </div>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer p-1.5 rounded-lg hover:bg-white/5 transition">
                    <input
                      type="checkbox"
                      name="permBilling"
                      defaultChecked={editingStaff?.permissions.includes('billing')}
                      className="rounded bg-slate-700 text-red-600 focus:ring-0"
                    />
                    <div>
                      <span className="text-slate-200 font-semibold">Digital Billing & Invoices</span>
                      <span className="text-[10px] text-slate-500 block">Generate tax invoices with mandatory reg # & document upload</span>
                    </div>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer p-1.5 rounded-lg hover:bg-white/5 transition">
                    <input
                      type="checkbox"
                      name="permBranches"
                      defaultChecked={editingStaff?.permissions.includes('branches')}
                      className="rounded bg-slate-700 text-red-600 focus:ring-0"
                    />
                    <div>
                      <span className="text-slate-200 font-semibold">Showrooms & Branches</span>
                      <span className="text-[10px] text-slate-500 block">Dealership location addresses & Google Maps links</span>
                    </div>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer p-1.5 rounded-lg hover:bg-white/5 transition">
                    <input
                      type="checkbox"
                      name="permSettings"
                      defaultChecked={editingStaff?.permissions.includes('settings')}
                      className="rounded bg-slate-700 text-red-600 focus:ring-0"
                    />
                    <div>
                      <span className="text-slate-200 font-semibold">CMS & Social Media Settings</span>
                      <span className="text-[10px] text-slate-500 block">Top announcement banner & customer phone lines</span>
                    </div>
                  </label>
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowStaffModal(false)}
                  className="px-4 py-2 rounded-lg bg-[#0F1A2C] text-slate-300 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-semibold text-xs shadow-md shadow-red-600/30"
                >
                  Save Staff Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 8. CUSTOMER VEHICLE OWNERSHIP & DOCUMENTS HUB MODAL */}
      {showCustomerHubModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-2xl bg-[#0B1320] p-6 rounded-2xl border border-white/10 my-8 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <div className="flex items-center gap-2">
                <Car className="w-5 h-5 text-cyan-400" />
                <div>
                  <h3 className="text-base font-bold text-white">Customer Vehicle & Ownership Hub</h3>
                  <p className="text-[11px] text-slate-400">
                    Live view for vehicle owner: {showCustomerHubModal.customer_name}
                  </p>
                </div>
              </div>
              <button onClick={() => setShowCustomerHubModal(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Vehicle Main Profile Card */}
            <div className="p-4 bg-[#080E17] rounded-xl border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                  Verified Ownership
                </span>
                <h4 className="text-lg font-black text-white mt-1.5">{showCustomerHubModal.vehicle}</h4>
                <div className="text-xs text-slate-400 font-mono mt-0.5">
                  Owner: <span className="text-white font-bold">{showCustomerHubModal.customer_name}</span> (+91 {showCustomerHubModal.mobile})
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  Invoice Ref: <span className="font-mono text-red-400">{showCustomerHubModal.invoice_number}</span> · Purchased: {new Date(showCustomerHubModal.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                </div>
              </div>

              <div className="text-left sm:text-right">
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0F1A2C] border-2 border-red-500 text-red-400 font-mono font-black text-sm uppercase tracking-wider shadow-lg shadow-red-950">
                  <span className="text-[10px] text-blue-400 font-black">IND</span>
                  <span>{showCustomerHubModal.reg_number}</span>
                </div>
                <div className="text-xs font-mono font-bold text-emerald-400 mt-2">
                  Total Paid: {formatINR(showCustomerHubModal.price)}
                </div>
              </div>
            </div>

            {/* E-Charger Specs Card if present */}
            {showCustomerHubModal.has_echarger && (
              <div className="mt-3 p-3.5 rounded-xl bg-amber-950/30 border border-amber-600/40 text-amber-200">
                <div className="flex items-center gap-2 font-bold text-xs">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>EV FAST CHARGER & HOME UNIT BUNDLE</span>
                </div>
                <div className="text-xs text-amber-100 font-mono mt-1">
                  {showCustomerHubModal.echarger_details || '7.4kW Fast Home Charging Unit with 3-Year Official Warranty'}
                </div>
              </div>
            )}

            {/* Attached Documents & Handover Photos Section */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200 uppercase tracking-wider">
                  <FileText className="w-4 h-4 text-cyan-400" />
                  <span>Verified Vehicle Documents & Delivery Photos ({showCustomerHubModal.documents?.length || 0})</span>
                </div>

                {/* Staff add document trigger */}
                <label className="text-[11px] text-cyan-400 hover:text-cyan-300 font-semibold cursor-pointer flex items-center gap-1">
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Document / Photo</span>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        const newDoc: InvoiceDoc = {
                          id: 'doc_' + Date.now(),
                          name: file.name,
                          url: event.target?.result as string,
                          type: 'photo',
                          size: (file.size / 1024).toFixed(1) + ' KB'
                        };
                        const updatedInv = {
                          ...showCustomerHubModal,
                          documents: [...(showCustomerHubModal.documents || []), newDoc]
                        };
                        setInvoices(prev => prev.map(inv => inv.id === updatedInv.id ? updatedInv : inv));
                        setShowCustomerHubModal(updatedInv);
                        showToast(`Attached ${file.name} to vehicle!`);
                      };
                      reader.readAsDataURL(file);
                    }}
                    className="hidden"
                  />
                </label>
              </div>

              {showCustomerHubModal.documents && showCustomerHubModal.documents.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {showCustomerHubModal.documents.map((doc, idx) => (
                    <div
                      key={idx}
                      onClick={() => setPreviewDocModal(doc)}
                      className="p-2.5 rounded-xl bg-[#080E17] border border-white/10 hover:border-red-500/50 cursor-pointer transition flex flex-col justify-between group"
                    >
                      {doc.url.startsWith('data:image') || doc.url.startsWith('http') || doc.url.startsWith('/public') ? (
                        <div className="relative overflow-hidden rounded-lg mb-2 h-20 bg-black/40">
                          <img src={doc.url} alt={doc.name} className="w-full h-full object-cover group-hover:scale-105 transition" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                            <Eye className="w-5 h-5 text-white" />
                          </div>
                        </div>
                      ) : (
                        <div className="h-20 flex items-center justify-center bg-[#0F1A2C] rounded-lg mb-2">
                          <FileText className="w-7 h-7 text-cyan-400" />
                        </div>
                      )}
                      <div>
                        <div className="text-xs font-semibold text-slate-200 truncate">{doc.name}</div>
                        <div className="flex items-center justify-between text-[10px] mt-1 text-slate-400">
                          <span className="uppercase text-red-400 font-bold">{doc.type}</span>
                          <span>{doc.size || 'Verified'}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center rounded-xl bg-[#080E17] border border-dashed border-white/10 text-xs text-slate-400">
                  No documents attached yet. Staff can click "+ Add Document / Photo" to upload RC papers or handover ceremony images.
                </div>
              )}
            </div>

            {/* Action Bar */}
            <div className="mt-5 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowPrintInvoiceModal(showCustomerHubModal)}
                  className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>View / Print Invoice</span>
                </button>
                <button
                  type="button"
                  onClick={() => downloadInvoice(showCustomerHubModal)}
                  className="px-3.5 py-2 rounded-xl bg-[#0F1A2C] hover:bg-[#16243C] text-cyan-400 border border-white/10 font-semibold text-xs flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Invoice</span>
                </button>
              </div>

              <a
                href={getWhatsAppLink(showCustomerHubModal.mobile, showCustomerHubModal.customer_name, showCustomerHubModal.vehicle)}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-2 rounded-xl bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 text-green-400 font-semibold text-xs flex items-center gap-1.5 transition"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp Customer Support</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* 9. DOCUMENT / IMAGE HIGH-RES PREVIEW MODAL */}
      {previewDocModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="w-full max-w-xl bg-[#0B1320] p-5 rounded-2xl border border-white/10 shadow-2xl flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
              <div className="flex items-center gap-2 truncate">
                <FileText className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="text-sm font-bold text-white truncate">{previewDocModal.name}</span>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-red-950 text-red-400 border border-red-900">
                  {previewDocModal.type}
                </span>
              </div>
              <button onClick={() => setPreviewDocModal(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 flex items-center justify-center bg-black/50 rounded-xl overflow-hidden min-h-[300px] max-h-[70vh] p-2">
              {previewDocModal.url.startsWith('data:image') || previewDocModal.url.startsWith('http') || previewDocModal.url.startsWith('/public') ? (
                <img
                  src={previewDocModal.url}
                  alt={previewDocModal.name}
                  className="max-h-[65vh] w-auto max-w-full object-contain rounded-lg"
                />
              ) : (
                <div className="text-center p-8 space-y-3">
                  <FileText className="w-16 h-16 text-cyan-400 mx-auto" />
                  <div className="text-sm text-slate-200 font-semibold">{previewDocModal.name}</div>
                  <div className="text-xs text-slate-400">PDF / Verified Document Document Object</div>
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs text-slate-400">{previewDocModal.size || 'Verified Showroom Paper'}</span>
              <div className="flex items-center gap-2">
                <a
                  href={previewDocModal.url}
                  download={previewDocModal.name}
                  className="px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs flex items-center gap-1.5 transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Document</span>
                </a>
                <button
                  onClick={() => setPreviewDocModal(null)}
                  className="px-3.5 py-1.5 rounded-lg bg-[#0F1A2C] text-slate-300 text-xs"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 10. STAFF ACTIVITY & AUDIT FORENSIC INSPECTION MODAL */}
      {selectedAuditLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-lg bg-[#0B1320] p-6 rounded-2xl border border-white/10 shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="text-base font-bold text-white">Audit Event Forensics</h3>
                  <p className="text-[10px] text-slate-400 font-mono">ID: {selectedAuditLog.id}</p>
                </div>
              </div>
              <button onClick={() => setSelectedAuditLog(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Actor & Timestamp */}
              <div className="p-3.5 rounded-xl bg-[#080E17] border border-white/5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase text-slate-400">STAFF MEMBER / ACTOR</span>
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${
                    selectedAuditLog.role === 'owner' ? 'bg-red-950 text-red-300 border-red-800' : 'bg-cyan-950 text-cyan-300 border-cyan-800'
                  }`}>
                    {selectedAuditLog.role === 'owner' ? 'Owner / Super Admin' : 'Showroom Staff Worker'}
                  </span>
                </div>
                <div className="text-sm font-bold text-white flex items-center gap-1.5">
                  {selectedAuditLog.role === 'owner' ? <Crown className="w-4 h-4 text-amber-400" /> : <UserCheck className="w-4 h-4 text-cyan-400" />}
                  <span>{selectedAuditLog.staff_name}</span>
                </div>
                <div className="text-slate-400 font-mono">Phone: +91 {selectedAuditLog.staff_phone}</div>
                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-slate-400 font-mono text-[11px]">
                  <span>Local IST:</span>
                  <span className="text-white font-bold">
                    {new Date(selectedAuditLog.timestamp).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })} at {new Date(selectedAuditLog.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-500 font-mono text-[10px]">
                  <span>ISO UTC:</span>
                  <span>{selectedAuditLog.timestamp}</span>
                </div>
              </div>

              {/* Module & Action Details */}
              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 rounded-xl bg-[#0F1A2C] border border-white/5">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">AFFECTED MODULE</div>
                  <div className="text-sm font-bold text-white mt-1">{selectedAuditLog.module}</div>
                </div>
                <div className="p-3 rounded-xl bg-[#0F1A2C] border border-white/5">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">ACTION TYPE</div>
                  <div className="text-xs font-mono font-bold text-red-400 uppercase mt-1">
                    {selectedAuditLog.action_type.replace('_', ' ')}
                  </div>
                </div>
              </div>

              {/* Action Description */}
              <div className="p-3.5 rounded-xl bg-[#0F1A2C] border border-white/5 space-y-1.5">
                <div className="text-[10px] font-bold text-slate-400 uppercase">EVENT SUMMARY</div>
                <div className="text-slate-200 font-medium leading-relaxed">{selectedAuditLog.description}</div>
                {selectedAuditLog.target_name && (
                  <div className="pt-1.5 border-t border-white/5 text-[11px] font-mono text-cyan-300">
                    Target Reference: <span className="font-bold text-white">{selectedAuditLog.target_name}</span>
                  </div>
                )}
              </div>

              {/* Forensic State Changes Diff */}
              {selectedAuditLog.details && (
                <div className="p-3.5 rounded-xl bg-[#080E17] border border-white/10 space-y-2">
                  <div className="text-[10px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5" />
                    <span>Before & After State Modification</span>
                  </div>

                  {selectedAuditLog.details.field && (
                    <div className="text-[11px] text-slate-300">
                      Modified Field: <span className="font-mono text-cyan-400 font-bold">{selectedAuditLog.details.field}</span>
                    </div>
                  )}

                  {selectedAuditLog.details.before !== undefined && selectedAuditLog.details.after !== undefined && (
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <div className="p-2.5 rounded-lg bg-red-950/30 border border-red-900/40 font-mono text-[11px]">
                        <div className="text-[9px] uppercase font-bold text-red-400 mb-1">State Before Change</div>
                        <div className="text-red-200 break-words whitespace-pre-wrap">
                          {typeof selectedAuditLog.details.before === 'object'
                            ? JSON.stringify(selectedAuditLog.details.before, null, 2)
                            : String(selectedAuditLog.details.before)}
                        </div>
                      </div>
                      <div className="p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-900/40 font-mono text-[11px]">
                        <div className="text-[9px] uppercase font-bold text-emerald-400 mb-1">State After Change</div>
                        <div className="text-emerald-200 break-words whitespace-pre-wrap">
                          {typeof selectedAuditLog.details.after === 'object'
                            ? JSON.stringify(selectedAuditLog.details.after, null, 2)
                            : String(selectedAuditLog.details.after)}
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedAuditLog.details.notes && (
                    <div className="p-2 rounded-lg bg-[#0F1A2C] border border-white/5 text-[11px] text-slate-300">
                      <span className="font-bold text-slate-400">Context Notes:</span> {selectedAuditLog.details.notes}
                    </div>
                  )}
                </div>
              )}

              <div className="pt-3 border-t border-white/10 flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedAuditLog(null)}
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-xs transition"
                >
                  Close Inspection
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showSqlModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-2xl bg-[#0B1320] p-6 rounded-2xl border border-white/10 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-white">Supabase SQL Schema DDL</h3>
              </div>
              <button onClick={() => setShowSqlModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-300 mb-3">
              Run this in your Supabase SQL editor to create the 6 tables with RLS permissions:
            </p>
            <textarea
              readOnly
              className="w-full h-64 p-3.5 bg-[#080E17] font-mono text-[11px] text-cyan-300 rounded-xl border border-white/10 focus:outline-none resize-none mb-4"
              value={`-- Adarsh Motors Database Schema
CREATE TABLE IF NOT EXISTS bikes (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  price NUMERIC NOT NULL,
  category TEXT NOT NULL,
  year INTEGER,
  km INTEGER,
  image_url TEXT,
  status TEXT DEFAULT 'Available',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS leads (
  id BIGSERIAL PRIMARY KEY,
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  bike_interested TEXT,
  service_type TEXT,
  message TEXT,
  status TEXT DEFAULT 'New',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS invoices (
  id BIGSERIAL PRIMARY KEY,
  invoice_number TEXT UNIQUE,
  customer_name TEXT NOT NULL,
  mobile TEXT NOT NULL,
  vehicle TEXT NOT NULL,
  price NUMERIC NOT NULL,
  payment_mode TEXT DEFAULT 'UPI',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS branches (
  id BIGSERIAL PRIMARY KEY,
  branch_name TEXT NOT NULL,
  city TEXT NOT NULL,
  address TEXT NOT NULL,
  phone TEXT NOT NULL,
  maps_url TEXT,
  status TEXT DEFAULT 'Active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS site_settings (
  id BIGSERIAL PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS staff_users (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT UNIQUE NOT NULL,
  pin TEXT NOT NULL,
  role TEXT DEFAULT 'staff',
  permissions JSONB DEFAULT '["leads", "inventory"]',
  status TEXT DEFAULT 'Active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE bikes ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anon for bikes" ON bikes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon for leads" ON leads FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon for invoices" ON invoices FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon for branches" ON branches FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon for site_settings" ON site_settings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon for staff_users" ON staff_users FOR ALL USING (true) WITH CHECK (true);`}
            />
            <div className="flex items-center justify-between border-t border-white/10 pt-3">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`CREATE TABLE IF NOT EXISTS bikes (id BIGSERIAL PRIMARY KEY, name TEXT NOT NULL, brand TEXT NOT NULL, price NUMERIC NOT NULL, category TEXT NOT NULL, year INTEGER, km INTEGER, image_url TEXT, status TEXT DEFAULT 'Available'); CREATE TABLE IF NOT EXISTS leads (id BIGSERIAL PRIMARY KEY, customer_name TEXT NOT NULL, phone TEXT NOT NULL, bike_interested TEXT, service_type TEXT, message TEXT, status TEXT DEFAULT 'New'); CREATE TABLE IF NOT EXISTS invoices (id BIGSERIAL PRIMARY KEY, invoice_number TEXT UNIQUE, customer_name TEXT NOT NULL, mobile TEXT NOT NULL, vehicle TEXT NOT NULL, price NUMERIC NOT NULL, payment_mode TEXT DEFAULT 'UPI', notes TEXT); CREATE TABLE IF NOT EXISTS branches (id BIGSERIAL PRIMARY KEY, branch_name TEXT NOT NULL, city TEXT NOT NULL, address TEXT NOT NULL, phone TEXT NOT NULL, maps_url TEXT, status TEXT DEFAULT 'Active'); CREATE TABLE IF NOT EXISTS site_settings (id BIGSERIAL PRIMARY KEY, key TEXT UNIQUE NOT NULL, value TEXT); CREATE TABLE IF NOT EXISTS staff_users (id BIGSERIAL PRIMARY KEY, name TEXT NOT NULL, phone TEXT UNIQUE NOT NULL, pin TEXT NOT NULL, role TEXT DEFAULT 'staff', permissions JSONB);`);
                  showToast('Copied SQL setup commands to clipboard!');
                }}
                className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs flex items-center gap-1.5 transition"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy SQL Script</span>
              </button>
              <button
                onClick={() => setShowSqlModal(false)}
                className="px-4 py-2 rounded-lg bg-[#0F1A2C] text-slate-300 text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
