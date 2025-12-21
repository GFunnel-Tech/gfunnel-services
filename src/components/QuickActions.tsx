import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar, Rocket } from "lucide-react";
import { QuickActionContent, ServiceConfig } from "@/lib/serviceConfigs";
import { ServiceIntakeForm } from "./ServiceIntakeForm";

interface QuickActionsProps {
  onboardingUrl?: string;
  discoveryUrl?: string;
  quickActionContent?: QuickActionContent;
  service?: ServiceConfig;
}

export const QuickActions = ({ 
  onboardingUrl = "https://onboarding.gfunnel.com/paid-advertisement",
  discoveryUrl = "https://www.gfunnel.com/discover?services=paid-advertisement",
  quickActionContent = {
    statValue: "24/7",
    statLabel: "Support Available",
    description: "Get started today and see leads within 48 hours"
  },
  service
}: QuickActionsProps) => {
  return (
    <div className="space-y-6">
      {/* Intake Form */}
      {service && <ServiceIntakeForm service={service} />}

      {/* Quick Actions Card */}
      <Card className="relative p-6 shadow-lg border-border">
        <h3 className="text-lg font-bold mb-4 text-foreground">Quick Actions</h3>
        <div className="space-y-3">
          <Button 
            variant="gradient"
            className="w-full justify-start" 
            size="lg"
            asChild
          >
            <a href={onboardingUrl} target="_parent" rel="noopener noreferrer">
              <Rocket className="w-5 h-5 mr-2" />
              Get Started
            </a>
          </Button>

          <Button 
            variant="ghost" 
            className="w-full justify-start"
            size="lg"
            asChild
          >
            <a href={discoveryUrl} target="_parent" rel="noopener noreferrer">
              <Calendar className="w-5 h-5 mr-2" />
              Schedule Discovery
            </a>
          </Button>
        </div>

        <div className="mt-6 pt-6 border-t border-border">
          <div className="text-center mb-3">
            <div className="text-3xl font-bold text-accent mb-1">{quickActionContent.statValue}</div>
            <div className="text-sm text-muted-foreground">{quickActionContent.statLabel}</div>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            {quickActionContent.description}
          </p>
        </div>
      </Card>
    </div>
  );
};