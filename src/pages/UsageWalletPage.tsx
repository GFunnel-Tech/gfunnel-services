import { useState, useEffect, useCallback } from "react";
import { ArrowLeft, Shield } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { WalletLookup } from "@/components/WalletLookup";
import { UsageWallet } from "@/components/UsageWallet";
import { WalletWarning } from "@/components/WalletWarning";
import { WalletData } from "@/lib/walletTypes";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  fetchWalletData,
  fetchWalletByCompanyId,
  calculateWarningLevel,
  getStoredEmail,
  storeEmail,
  clearStoredEmail,
} from "@/lib/walletService";

const UsageWalletPage = () => {
  const navigate = useNavigate();
  const [isImpersonating, setIsImpersonating] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  // Check for admin impersonation or stored email on mount
  useEffect(() => {
    const impersonateCompanyId = sessionStorage.getItem('admin_impersonate_company');
    
    if (impersonateCompanyId) {
      // Admin is impersonating a company
      setIsImpersonating(true);
      handleFetchWalletByCompany(impersonateCompanyId);
    } else {
      // Normal user flow
      const storedEmail = getStoredEmail();
      if (storedEmail) {
        setEmail(storedEmail);
        handleFetchWallet(storedEmail);
      }
    }
  }, []);

  const handleFetchWalletByCompany = useCallback(async (companyId: string) => {
    setIsLoading(true);
    setError(undefined);

    const result = await fetchWalletByCompanyId(companyId);

    if (result.success && result.data) {
      setWalletData(result.data);
    } else {
      setError(result.error || "Unable to load company data.");
      setWalletData(null);
    }

    setIsLoading(false);
  }, []);

  const handleFetchWallet = useCallback(async (userEmail: string) => {
    setIsLoading(true);
    setError(undefined);

    const result = await fetchWalletData(userEmail);

    if (result.success && result.data) {
      setWalletData(result.data);
      storeEmail(userEmail);
      setEmail(userEmail);
    } else {
      setError(result.error || "Unable to find account. Please check your email and try again.");
      setWalletData(null);
    }

    setIsLoading(false);
  }, []);

  const handleEmailSubmit = (userEmail: string) => {
    handleFetchWallet(userEmail);
  };

  const handleRefresh = () => {
    const impersonateCompanyId = sessionStorage.getItem('admin_impersonate_company');
    if (impersonateCompanyId) {
      handleFetchWalletByCompany(impersonateCompanyId);
    } else if (email) {
      handleFetchWallet(email);
    }
  };

  const handleLogout = () => {
    clearStoredEmail();
    sessionStorage.removeItem('admin_impersonate_company');
    setEmail(null);
    setWalletData(null);
    setError(undefined);
    setIsImpersonating(false);
  };

  const handleExitImpersonation = () => {
    sessionStorage.removeItem('admin_impersonate_company');
    setIsImpersonating(false);
    setWalletData(null);
    navigate('/admin/companies');
  };

  const warningLevel = walletData
    ? calculateWarningLevel(walletData.hours_remaining, walletData.hours_included)
    : "none";

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" asChild>
                <Link to="/service-hub">
                  <ArrowLeft className="w-5 h-5" />
                </Link>
              </Button>
              <div>
                <h1 className="text-xl font-semibold">Usage Wallet</h1>
                <p className="text-sm text-muted-foreground">Track your hours and savings</p>
              </div>
            </div>
            {walletData && (
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                Switch Account
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Admin Impersonation Banner */}
          {isImpersonating && (
            <Alert className="border-amber-500/50 bg-amber-500/10">
              <Shield className="h-4 w-4 text-amber-500" />
              <AlertDescription className="flex items-center justify-between">
                <span className="text-amber-500 font-medium">
                  Admin View: Viewing wallet as {walletData?.company_name || 'company'}
                </span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleExitImpersonation}
                  className="border-amber-500/50 text-amber-500 hover:bg-amber-500/10"
                >
                  Exit View
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {/* Warning Alert (if applicable) */}
          {walletData && warningLevel !== "none" && (
            <WalletWarning
              level={warningLevel}
              hoursRemaining={walletData.hours_remaining}
              overageRate={walletData.overage_rate}
            />
          )}

          {/* Main Content */}
          {!walletData && !isImpersonating ? (
            <WalletLookup
              onEmailSubmit={handleEmailSubmit}
              isLoading={isLoading}
              error={error}
            />
          ) : (
            <UsageWallet
              data={walletData}
              onRefresh={handleRefresh}
              isRefreshing={isLoading}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default UsageWalletPage;
