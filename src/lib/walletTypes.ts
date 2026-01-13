export interface WalletData {
  user_email: string;
  plan_name: "Starter" | "Growth" | "Premium" | string;
  hours_included: number;
  hours_used: number;
  hours_remaining: number;
  hourly_rate: number;
  market_rate: number;
  total_savings: number;
  billing_cycle_end: string;
  overage_rate: number;
  last_updated: string;
}

export type WarningLevel = "none" | "low" | "critical";

export interface WalletLookupResponse {
  success: boolean;
  data?: WalletData;
  error?: string;
}

export const PLAN_COLORS: Record<string, string> = {
  Starter: "bg-blue-500",
  Growth: "bg-accent",
  Premium: "bg-gradient-to-r from-amber-500 to-yellow-400",
};

export const PAYMENT_LINKS = {
  addHours: "https://www.gfunnel.com/add-hours",
  upgradePlan: "https://www.gfunnel.com/software-plans",
  viewBilling: "https://www.gfunnel.com/billing",
} as const;
