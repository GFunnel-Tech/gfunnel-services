import { WalletData, WalletLookupResponse, WarningLevel } from "./walletTypes";

const WALLET_WEBHOOK_URL = "https://apihub.gfunnel.com/webhook/wallet-lookup";

export async function fetchWalletData(email: string): Promise<WalletLookupResponse> {
  try {
    const response = await fetch(WALLET_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "get_wallet_data",
        email: email.toLowerCase().trim(),
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
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
  if (hoursIncluded <= 0) return "none";
  
  const percentRemaining = (hoursRemaining / hoursIncluded) * 100;
  
  if (percentRemaining <= 10) return "critical";
  if (percentRemaining <= 20) return "low";
  return "none";
}

export function calculateSavings(
  hoursUsed: number,
  hourlyRate: number,
  marketRate: number
): number {
  return hoursUsed * (marketRate - hourlyRate);
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
