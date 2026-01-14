export interface Company {
  id: string;
  name: string;
  slug: string;
  plan_name: string;
  plan_price: number;
  plan_value: number;
  savings_percentage: number;
  response_time: string;
  hours_included: number;
  hours_used: number;
  billing_cycle_end: string | null;
  overage_rate: number;
  created_at: string;
  updated_at: string;
}

export interface CompanyUser {
  id: string;
  company_id: string;
  email: string;
  display_name: string | null;
  role: string;
  is_primary: boolean;
  created_at: string;
}

export interface AccessItem {
  id: string;
  company_id: string;
  label: string;
  icon: string;
  url: string;
  description: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  role: 'admin' | 'moderator' | 'user';
}

export type AppRole = 'admin' | 'moderator' | 'user';

export const PLAN_OPTIONS = [
  { name: 'Starter', label: 'Starter', hours: 40, price: 1497, planValue: 7500, savings: 80, response: 'Up to 48 hrs' },
  { name: 'Pro', label: 'Pro', hours: 80, price: 2497, planValue: 13720, savings: 82, response: '24-48 hrs' },
  { name: 'Scale', label: 'Scale', hours: 140, price: 3997, planValue: 25000, savings: 84, response: '24 hrs or less' },
  { name: 'Unlimited', label: 'Unlimited', hours: -1, price: 5997, planValue: 40000, savings: 85, response: 'Same-day possible' },
] as const;

export const ICON_OPTIONS = [
  'folder', 'file', 'video', 'image', 'link', 'globe', 'settings', 'user', 
  'calendar', 'mail', 'phone', 'message-circle', 'bookmark', 'star', 'heart',
  'home', 'briefcase', 'database', 'cloud', 'download', 'upload', 'external-link'
] as const;
