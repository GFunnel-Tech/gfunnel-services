import { AlertTriangle, Clock, Zap } from "lucide-react";
import { Button } from "./ui/button";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { WarningLevel, PAYMENT_LINKS } from "@/lib/walletTypes";

interface WalletWarningProps {
  level: WarningLevel;
  hoursRemaining: number;
  overageRate: number;
}

export const WalletWarning = ({ level, hoursRemaining, overageRate }: WalletWarningProps) => {
  if (level === "none") return null;

  const isCritical = level === "critical";

  return (
    <Alert 
      variant="destructive" 
      className={
        isCritical 
          ? "border-destructive bg-destructive/10" 
          : "border-yellow-500 bg-yellow-500/10"
      }
    >
      <AlertTriangle className={`h-4 w-4 ${isCritical ? "text-destructive" : "text-yellow-500"}`} />
      <AlertTitle className={isCritical ? "text-destructive" : "text-yellow-600"}>
        {isCritical ? "Critical: Almost Out of Hours" : "Low Hours Alert"}
      </AlertTitle>
      <AlertDescription className="mt-3">
        <p className="mb-4 text-muted-foreground">
          {isCritical 
            ? `You have only ${hoursRemaining} hour${hoursRemaining !== 1 ? "s" : ""} remaining. Any additional work will be billed at $${overageRate}/hr.`
            : `You have ${hoursRemaining} hours remaining this cycle. Consider adding hours or upgrading your plan.`
          }
        </p>
        <div className="flex flex-wrap gap-2">
          <Button 
            variant={isCritical ? "default" : "outline"} 
            size="sm" 
            asChild
          >
            <a 
              href={PAYMENT_LINKS.addHours} 
              target="_parent" 
              rel="noopener noreferrer"
            >
              <Clock className="w-4 h-4 mr-2" />
              Pay As You Go - ${overageRate}/hr
            </a>
          </Button>
          <Button 
            variant="gradient" 
            size="sm" 
            asChild
          >
            <a 
              href={PAYMENT_LINKS.upgradePlan} 
              target="_parent" 
              rel="noopener noreferrer"
            >
              <Zap className="w-4 h-4 mr-2" />
              Upgrade Plan
            </a>
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
};
