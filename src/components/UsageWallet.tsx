import { RefreshCw, Clock, TrendingUp, Calendar, CreditCard, Zap, ExternalLink } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";
import { WalletData, PAYMENT_LINKS, PLAN_COLORS } from "@/lib/walletTypes";
import { formatCurrency, getPercentageUsed } from "@/lib/walletService";

interface UsageWalletProps {
  data: WalletData;
  onRefresh: () => void;
  isRefreshing?: boolean;
}

export const UsageWallet = ({ data, onRefresh, isRefreshing }: UsageWalletProps) => {
  const percentUsed = getPercentageUsed(data.hours_used, data.hours_included);
  const billingDate = new Date(data.billing_cycle_end).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const getProgressColor = () => {
    if (percentUsed >= 90) return "bg-destructive";
    if (percentUsed >= 80) return "bg-yellow-500";
    return "bg-accent";
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-accent" />
          </div>
          <div>
            <CardTitle className="text-xl">Your Usage Wallet</CardTitle>
            <p className="text-sm text-muted-foreground">{data.user_email}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onRefresh}
          disabled={isRefreshing}
          className="shrink-0"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
        </Button>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Hours Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">Hours This Cycle</span>
            </div>
            <span className="text-sm text-muted-foreground">
              {data.hours_used} / {data.hours_included} hrs
            </span>
          </div>
          <div className="relative">
            <Progress value={percentUsed} className="h-3" />
            <div 
              className={`absolute top-0 left-0 h-3 rounded-full transition-all ${getProgressColor()}`}
              style={{ width: `${percentUsed}%` }}
            />
          </div>
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{data.hours_remaining} hours</span> remaining
          </p>
        </div>

        <Separator />

        {/* Savings Section */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="font-medium">Development Savings</span>
          </div>
          <div className="bg-green-500/10 rounded-lg p-4 border border-green-500/20">
            <p className="text-2xl font-bold text-green-600">
              {formatCurrency(data.total_savings)}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              saved vs. market rates ({formatCurrency(data.market_rate)}/hr vs {formatCurrency(data.hourly_rate)}/hr)
            </p>
          </div>
        </div>

        <Separator />

        {/* Plan Details */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium">Plan Details</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge 
                variant="secondary" 
                className={`${PLAN_COLORS[data.plan_name] || "bg-muted"} text-white`}
              >
                {data.plan_name} Plan
              </Badge>
            </div>
            <span className="text-sm text-muted-foreground">
              Renews {billingDate}
            </span>
          </div>
          {data.overage_rate > 0 && (
            <p className="text-xs text-muted-foreground">
              Overage rate: {formatCurrency(data.overage_rate)}/hr after included hours
            </p>
          )}
        </div>

        <Separator />

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button variant="outline" className="flex-1" asChild>
            <a 
              href={PAYMENT_LINKS.addHours} 
              target="_parent" 
              rel="noopener noreferrer"
            >
              <Clock className="w-4 h-4 mr-2" />
              Add Hours
            </a>
          </Button>
          <Button variant="gradient" className="flex-1" asChild>
            <a 
              href={PAYMENT_LINKS.upgradePlan} 
              target="_parent" 
              rel="noopener noreferrer"
            >
              <Zap className="w-4 h-4 mr-2" />
              Upgrade to {data.plan_name === "Premium" ? "Enterprise" : "Premium"}
            </a>
          </Button>
        </div>

        {/* View Billing Link */}
        <div className="text-center">
          <a 
            href={PAYMENT_LINKS.viewBilling} 
            target="_parent" 
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
          >
            View Billing History
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </CardContent>
    </Card>
  );
};
