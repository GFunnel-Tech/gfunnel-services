import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Check, Zap, Star, Crown, Rocket, Phone, MessageCircle, X } from "lucide-react";
import { PLAN_DETAILS, PLAN_CHECKOUT_LINKS } from "@/lib/walletTypes";

interface UpgradePlansModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlan?: string;
}

const planIcons: Record<string, React.ElementType> = {
  Starter: Zap,
  Pro: Star,
  Scale: Crown,
  Unlimited: Rocket,
};

const planFeatures: Record<string, string[]> = {
  Starter: [
    "40 Expert Hours/Month",
    "Up to 48hr Turnaround",
    "Dedicated Success Manager",
    "Build 2-3 complete sales funnels",
    "Full CRM automation setup",
    "Create 10+ landing pages",
    "Priority email support",
  ],
  Pro: [
    "80 Expert Hours/Month",
    "24-48hr Turnaround",
    "Dedicated Account Manager",
    "5-6 advanced funnels with A/B testing",
    "Complex automation workflows",
    "Phone + Email + Slack support",
    "Bi-weekly strategy calls",
  ],
  Scale: [
    "140 Expert Hours/Month",
    "24hr or less Turnaround",
    "Full team support (unlimited members)",
    "Enterprise integrations",
    "Weekly strategy sessions",
    "White-glove support",
    "VIP Slack channel",
  ],
  Unlimited: [
    "Unlimited Hours/Month",
    "Same-day priority turnaround",
    "2 Managers (Account + PM)",
    "Business Elite Software Included",
    "C-Suite Strategy Sessions",
    "AI Automation Setup",
    "24/7 dedicated support",
  ],
};

export const UpgradePlansModal = ({ isOpen, onClose, currentPlan = "Free" }: UpgradePlansModalProps) => {
  const paidPlans = ["Starter", "Pro", "Scale", "Unlimited"];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl">Choose Your Plan</DialogTitle>
              <DialogDescription className="mt-1">
                Select a service plan to start submitting requests to our expert team.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="p-6 pt-4">
          {/* Plans Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {paidPlans.map((planName) => {
              const plan = PLAN_DETAILS[planName];
              const features = planFeatures[planName];
              const Icon = planIcons[planName];
              const checkoutUrl = PLAN_CHECKOUT_LINKS[planName];
              const isPopular = plan.popular;
              const isCurrentPlan = currentPlan === planName;

              return (
                <Card 
                  key={planName} 
                  className={`relative flex flex-col ${isPopular ? 'border-primary shadow-lg ring-2 ring-primary/20' : ''} ${isCurrentPlan ? 'opacity-60' : ''}`}
                >
                  {isPopular && (
                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground">
                      Most Popular
                    </Badge>
                  )}
                  
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`p-2 rounded-lg ${isPopular ? 'bg-primary/10' : 'bg-muted'}`}>
                        <Icon className={`w-5 h-5 ${isPopular ? 'text-primary' : 'text-muted-foreground'}`} />
                      </div>
                      <CardTitle className="text-lg">{planName}</CardTitle>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold">${plan.price.toLocaleString()}</span>
                      <span className="text-muted-foreground">/mo</span>
                    </div>
                    <CardDescription className="text-xs">
                      {plan.hours === -1 ? 'Unlimited hours' : `${plan.hours} hours/month`}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="flex-1 flex flex-col">
                    <ul className="space-y-2 flex-1 mb-4">
                      {features.slice(0, 5).map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                          <span className="text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                      {features.length > 5 && (
                        <li className="text-xs text-muted-foreground pl-6">
                          +{features.length - 5} more benefits
                        </li>
                      )}
                    </ul>

                    <Button 
                      className="w-full" 
                      variant={isPopular ? "default" : "outline"}
                      disabled={isCurrentPlan}
                      asChild={!isCurrentPlan}
                    >
                      {isCurrentPlan ? (
                        <span>Current Plan</span>
                      ) : (
                        <a href={checkoutUrl} target="_blank" rel="noopener noreferrer">
                          Get {planName}
                        </a>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Guarantee & Support */}
          <div className="mt-6 p-4 rounded-lg bg-muted/50 border border-border/50">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-primary/10">
                  <Check className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">14-Day Money-Back Guarantee</p>
                  <p className="text-xs text-muted-foreground">Cancel anytime • No long-term commitment</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <a 
                  href="https://www.gfunnel.com/schedule" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 hover:text-primary transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  Schedule Discovery
                </a>
                <span className="flex items-center gap-1.5">
                  <Phone className="w-4 h-4" />
                  +1 833 455 5538
                </span>
              </div>
            </div>
          </div>

          {/* Custom Solutions CTA */}
          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">
              Need a custom solution?{" "}
              <a 
                href="https://www.gfunnel.com/discover" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline font-medium"
              >
                One-time projects starting at $297 →
              </a>
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
