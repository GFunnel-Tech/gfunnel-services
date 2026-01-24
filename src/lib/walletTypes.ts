export interface AccessItem {
  id: string;
  label: string;
  icon: string;
  url: string;
  description?: string;
}

export interface ProjectRequest {
  id: string;
  form_type: string;
  form_category: string;
  request_title: string | null;
  description: string | null;
  video_link: string | null;
  status: string;
  priority: string;
  submitted_at: string;
}

export interface HoursHistory {
  id: string;
  month_year: string;
  hours_used: number;
  hours_included: number;
  plan_price: number;
}

export interface CompanyRole {
  id: string;
  department_slug: string;
  role_title: string;
  status: 'filled' | 'hiring' | 'vacant';
  assigned_name?: string;
  assigned_email?: string;
  assigned_phone?: string;
  assigned_photo_url?: string;
  google_meet_link?: string;
  profile_type?: 'human' | 'ai' | 'both';
  ai_name?: string;
  ai_type?: string;
  ai_agent_id?: string;
  hire_request_id?: string;
}

export interface CompanyMember {
  id: string;
  email: string;
  display_name: string | null;
  role: string;
  is_primary: boolean;
}

export interface WalletData {
  user_email: string;
  user_id: string;
  company_name?: string;
  
  // Plan info
  plan_name: "Free" | "Starter" | "Pro" | "Scale" | "Unlimited" | string;
  plan_price: number;
  plan_value: number;
  savings_percentage: number;
  response_time: string;
  
  // Hours tracking
  hours_included: number; // -1 for unlimited
  hours_used: number;
  hours_remaining: number; // -1 for unlimited
  billing_cycle_end: string;
  
  // Overage
  overage_rate: number;
  
  // ROTI settings (company-specific)
  time_multiplier: number;
  va_hourly_rate: number;
  
  // Quick access items
  access_items: AccessItem[];
  
  // Project requests
  project_requests: ProjectRequest[];
  
  // Historical hours data for ROTI chart
  hours_history: HoursHistory[];
  
  // Company role assignments
  company_roles: CompanyRole[];
  
  // User permissions (for team management)
  is_primary?: boolean;
  user_role?: string;
  company_users?: CompanyMember[];
  
  last_updated: string;
}

export type WarningLevel = "none" | "low" | "critical";

export interface WalletLookupResponse {
  success: boolean;
  data?: WalletData;
  error?: string;
  is_admin?: boolean;
}

export const PLAN_DETAILS: Record<string, {
  hours: number;
  price: number;
  value: number;
  savings: number;
  response: string;
  popular?: boolean;
}> = {
  Free: { hours: 0, price: 0, value: 0, savings: 0, response: "N/A" },
  Starter: { hours: 40, price: 1497, value: 7500, savings: 80, response: "Up to 48 hrs" },
  Pro: { hours: 80, price: 2497, value: 13720, savings: 82, response: "24-48 hrs", popular: true },
  Scale: { hours: 140, price: 3997, value: 25000, savings: 84, response: "24 hrs or less" },
  Unlimited: { hours: -1, price: 5997, value: 40000, savings: 85, response: "Same-day possible" },
};

export const PLAN_COLORS: Record<string, string> = {
  Free: "bg-gray-400",
  Starter: "bg-blue-500",
  Pro: "bg-accent",
  Scale: "bg-purple-500",
  Unlimited: "bg-gradient-to-r from-amber-500 to-yellow-400",
};

// Checkout links for each plan
export const PLAN_CHECKOUT_LINKS: Record<string, string> = {
  Starter: "https://www.gfunnel.com/checkout/starter-services",
  Pro: "https://www.gfunnel.com/checkout/pro-services",
  Scale: "https://www.gfunnel.com/checkout/scale-services",
  Unlimited: "https://www.gfunnel.com/checkout/unlimited-services",
};

// ROTI Calculation Constants
// 3 hours of GFunnel work = 1 week (40 hours) of VA work
export const TIME_MULTIPLIER = 13; // ~40/3 rounded down for conservative estimate
export const VA_HOURLY_RATE = 15; // $15/hr - conservative middle of $5-$20 VA range

export const PAYMENT_LINKS = {
  addHours: "https://www.gfunnel.com/add-hours",
  upgradePlan: "https://www.gfunnel.com/service-plans",
  viewBilling: "https://cportal.gfunnel.com/account?activeTab=BillingSubscription",
  scheduleMeeting: "https://www.gfunnel.com/schedule",
} as const;

// Helper to check if user is on a free/unpaid plan
export const isFreePlan = (planName: string | undefined): boolean => {
  if (!planName) return true;
  return planName.toLowerCase() === 'free' || planName === '';
};
