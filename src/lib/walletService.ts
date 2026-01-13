import { supabase } from "@/integrations/supabase/client";
import { WalletData, WalletLookupResponse, WarningLevel } from "./walletTypes";

export async function fetchWalletData(email: string): Promise<WalletLookupResponse> {
  try {
    const { data, error } = await supabase.functions.invoke("wallet-proxy", {
      body: { email: email.toLowerCase().trim() },
    });

    if (error) {
      throw new Error(error.message);
    }

    return data as WalletLookupResponse;
  } catch (error) {
    console.error("Error fetching wallet data:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch wallet data",
    };
  }
}

export function calculateWarningLevel(
  hoursRemaining: number,
  hoursIncluded: number
): WarningLevel {
  // Unlimited plans don't have warnings
  if (hoursIncluded <= 0 || hoursRemaining < 0) return "none";
  
  const percentRemaining = (hoursRemaining / hoursIncluded) * 100;
  
  if (percentRemaining <= 10) return "critical";
  if (percentRemaining <= 20) return "low";
  return "none";
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getPercentageUsed(hoursUsed: number, hoursIncluded: number): number {
  if (hoursIncluded <= 0) return 0;
  return Math.min((hoursUsed / hoursIncluded) * 100, 100);
}

export function getTimeUntilReset(resetDate: string): string {
  const now = new Date();
  const reset = new Date(resetDate);
  const diff = reset.getTime() - now.getTime();
  
  if (diff <= 0) return "Resetting soon";
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (days > 0) return `Resets in ${days}d ${hours}h`;
  if (hours > 0) return `Resets in ${hours}h ${minutes}m`;
  return `Resets in ${minutes}m`;
}

export function isUnlimitedPlan(hoursIncluded: number): boolean {
  return hoursIncluded < 0;
}

export function getRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  
  if (diffMins < 1) return "less than a minute ago";
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
}

// Session storage helpers for email persistence
const WALLET_EMAIL_KEY = "wallet_user_email";

export function getStoredEmail(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(WALLET_EMAIL_KEY);
}

export function storeEmail(email: string): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(WALLET_EMAIL_KEY, email.toLowerCase().trim());
}

export function clearStoredEmail(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(WALLET_EMAIL_KEY);
}
