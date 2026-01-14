import { useState } from "react";
import { RefreshCw, Clock, TrendingUp, Zap, Plus, ArrowUpRight, ExternalLink, Star, Infinity, Pencil, CalendarCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { WalletAccessItems } from "./WalletAccessItems";
import { UserProjectRequests } from "./UserProjectRequests";
import { WalletData, PLAN_DETAILS, PAYMENT_LINKS } from "@/lib/walletTypes";
import {
  formatCurrency,
  getPercentageUsed,
  getTimeUntilReset,
  isUnlimitedPlan,
  getRelativeTime,
} from "@/lib/walletService";

interface UsageWalletProps {
  data: WalletData;
  onRefresh: () => void;
  isRefreshing?: boolean;
  isAdmin?: boolean;
  onUpdateHours?: (hours: number) => Promise<void>;
}

export const UsageWallet = ({ data, onRefresh, isRefreshing, isAdmin, onUpdateHours }: UsageWalletProps) => {
  const [isEditingHours, setIsEditingHours] = useState(false);
  const [editHoursValue, setEditHoursValue] = useState(data.hours_used.toString());
  const [isSaving, setIsSaving] = useState(false);
  
  const unlimited = isUnlimitedPlan(data.hours_included);
  const percentageUsed = unlimited ? 0 : getPercentageUsed(data.hours_used, data.hours_included);
  const planDetails = PLAN_DETAILS[data.plan_name];
  const isPro = data.plan_name === "Pro";
  
  // Get plan values - prefer data from API, fallback to static config
  const planPrice = data.plan_price || planDetails?.price || 0;
  const planValue = data.plan_value || planDetails?.value || 0;
  const savingsPercent = data.savings_percentage || planDetails?.savings || 0;
  const responseTime = data.response_time || planDetails?.response || "";

  const handleOpenEditHours = () => {
    setEditHoursValue(data.hours_used.toString());
    setIsEditingHours(true);
  };

  const handleSaveHours = async () => {
    if (!onUpdateHours) return;
    
    const hours = parseFloat(editHoursValue);
    if (isNaN(hours) || hours < 0) return;
    
    setIsSaving(true);
    try {
      await onUpdateHours(hours);
      setIsEditingHours(false);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Usage Dashboard</h2>
          <p className="text-sm text-muted-foreground">{data.user_email}</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onRefresh}
          disabled={isRefreshing}
          className="h-8 w-8"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
        </Button>
      </div>

      {/* Plan Card */}
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold">{data.plan_name} Plan</h3>
                {isPro && (
                  <Badge variant="secondary" className="text-xs">
                    <Star className="w-3 h-3 mr-1" />
                    Most Popular
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  {unlimited ? (
                    <>
                      <Infinity className="w-4 h-4" />
                      Unlimited hours
                    </>
                  ) : (
                    <>
                      <Clock className="w-4 h-4" />
                      {data.hours_included} hours/month
                    </>
                  )}
                </span>
                <span>•</span>
                <span>{responseTime}</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">{formatCurrency(planPrice)}</p>
              <p className="text-xs text-muted-foreground">/month</p>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-border/50">
            <p className="text-xs text-muted-foreground">
              {getTimeUntilReset(data.billing_cycle_end)}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Hours Usage */}
      {!unlimited ? (
        <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              Hours This Cycle
            </span>
            {isAdmin && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleOpenEditHours}
                className="h-7 px-2 text-muted-foreground hover:text-foreground"
              >
                <Pencil className="w-3 h-3 mr-1" />
                Edit
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {data.hours_used} of {data.hours_included} hours used
              </span>
              <span className="font-medium">{Math.round(percentageUsed)}%</span>
            </div>
            <Progress value={percentageUsed} className="h-2" />
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Remaining</span>
            <span className="font-semibold text-primary">{data.hours_remaining} hours</span>
          </div>
        </CardContent>
        </Card>
      ) : (
        <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Infinity className="w-4 h-4 text-primary" />
              Unlimited Hours
            </span>
            {isAdmin && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleOpenEditHours}
                className="h-7 px-2 text-muted-foreground hover:text-foreground"
              >
                <Pencil className="w-3 h-3 mr-1" />
                Edit
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-2xl font-bold">{data.hours_used} hrs</p>
              <p className="text-sm text-muted-foreground">used this cycle</p>
            </div>
            <Badge variant="outline" className="text-xs">
              <Zap className="w-3 h-3 mr-1" />
              5 active tasks max
            </Badge>
          </div>
        </CardContent>
        </Card>
      )}

      {/* Savings Card */}
      <Card className="bg-accent/5 border-accent/20">
        <CardContent className="p-5">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
              <TrendingUp className="w-5 h-5 text-accent" />
            </div>
            <div className="space-y-1">
              <h4 className="font-semibold">Your Savings</h4>
              <p className="text-sm text-muted-foreground">
                You're saving <span className="font-bold text-accent">{savingsPercent}%</span> vs. traditional agencies
              </p>
              <p className="text-xs text-muted-foreground">
                {formatCurrency(planValue)}/mo value → {formatCurrency(planPrice)}/mo your price
              </p>
              <p className="text-sm font-medium text-accent mt-2">
                That's {formatCurrency(planValue - planPrice)} saved every month!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Quick Access Items */}
      {data.access_items && data.access_items.length > 0 && (
        <>
          <WalletAccessItems items={data.access_items} />
          <Separator />
        </>
      )}

      {/* Project Requests */}
      <UserProjectRequests requests={data.project_requests || []} />

      <Separator />

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <Button asChild variant="outline" className="h-12">
          <a href={PAYMENT_LINKS.scheduleMeeting} target="_blank" rel="noopener noreferrer">
            <CalendarCheck className="w-4 h-4 mr-2" />
            Schedule Meeting
          </a>
        </Button>
        {!unlimited ? (
          <Button asChild variant="outline" className="h-12">
            <a href={PAYMENT_LINKS.addHours} target="_blank" rel="noopener noreferrer">
              <Plus className="w-4 h-4 mr-2" />
              Add Hours
            </a>
          </Button>
        ) : (
          <Button asChild className="h-12">
            <a href={PAYMENT_LINKS.upgradePlan} target="_blank" rel="noopener noreferrer">
              <ArrowUpRight className="w-4 h-4 mr-2" />
              View Plan Options
            </a>
          </Button>
        )}
      </div>
      
      {/* Upgrade Button for non-unlimited */}
      {!unlimited && (
        <Button asChild className="w-full h-12">
          <a href={PAYMENT_LINKS.upgradePlan} target="_blank" rel="noopener noreferrer">
            <ArrowUpRight className="w-4 h-4 mr-2" />
            Upgrade Plan
          </a>
        </Button>
      )}

      {/* View Billing Link */}
      <div className="text-center">
        <a
          href={PAYMENT_LINKS.viewBilling}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
        >
          View Billing History
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {/* Last Updated */}
      <p className="text-center text-xs text-muted-foreground">
        Last updated: {getRelativeTime(data.last_updated)}
      </p>

      {/* Edit Hours Dialog */}
      <Dialog open={isEditingHours} onOpenChange={setIsEditingHours}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Edit Hours Used</DialogTitle>
            <DialogDescription>
              Adjust the hours used for this billing cycle.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-2">
              <label htmlFor="hours" className="text-sm font-medium">
                Hours Used
              </label>
              <Input
                id="hours"
                type="number"
                step="0.5"
                min="0"
                value={editHoursValue}
                onChange={(e) => setEditHoursValue(e.target.value)}
                placeholder="Enter hours"
              />
              {!unlimited && (
                <p className="text-xs text-muted-foreground">
                  Plan includes {data.hours_included} hours
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditingHours(false)} disabled={isSaving}>
              Cancel
            </Button>
            <Button onClick={handleSaveHours} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
