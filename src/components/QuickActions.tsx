import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar, Rocket } from "lucide-react";
import { QuickActionContent } from "@/lib/serviceConfigs";

interface QuickActionsProps {
  onboardingUrl?: string;
  discoveryUrl?: string;
  quickActionContent?: QuickActionContent;
}

export const QuickActions = ({ 
  onboardingUrl = "https://onboarding.gfunnel.com/paid-advertisement",
  discoveryUrl = "https://www.gfunnel.com/discover?services=paid-advertisement",
  quickActionContent = {
    statValue: "24/7",
    statLabel: "Support Available",
    description: "Get started today and see leads within 48 hours"
  }
}: QuickActionsProps) => {
  const scrollToROI = () => {
    const faqSection = document.querySelector('[value="item-3"]');
    if (faqSection) {
      faqSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
      const trigger = faqSection.querySelector('button');
      if (trigger) {
        setTimeout(() => trigger.click(), 500);
      }
    }
  };

  return (
    <Card className="relative p-6 md:p-8">
      <h3 className="text-card-title mb-4 text-foreground">Quick Actions</h3>
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
          className="w-full justify-start text-muted-foreground hover:text-accent"
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
          <div className="text-3xl font-bold gradient-text mb-1">{quickActionContent.statValue}</div>
          <div className="text-sm text-muted-foreground">{quickActionContent.statLabel}</div>
        </div>
        <p className="text-xs text-muted-foreground text-center leading-relaxed">
          {quickActionContent.description}
        </p>
      </div>
    </Card>
  );
};