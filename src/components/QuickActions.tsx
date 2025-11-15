import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calculator, Calendar, Rocket } from "lucide-react";

interface QuickActionsProps {
  onboardingUrl?: string;
  discoveryUrl?: string;
}

export const QuickActions = ({ 
  onboardingUrl = "https://onboarding.gfunnel.com/paid-advertisement",
  discoveryUrl = "https://www.gfunnel.com/discover?services=paid-advertisement"
}: QuickActionsProps) => {
  const scrollToROI = () => {
    // Scroll to FAQ accordion and open the ROI item (item-3)
    const faqSection = document.querySelector('[value="item-3"]');
    if (faqSection) {
      faqSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Trigger click to open the accordion
      const trigger = faqSection.querySelector('button');
      if (trigger) {
        setTimeout(() => trigger.click(), 500);
      }
    }
  };

  return (
    <Card className="sticky top-6 p-6 shadow-lg border-border">
      <h3 className="text-lg font-bold mb-4 text-foreground">Quick Actions</h3>
      <div className="space-y-3">
        <Button 
          className="w-full justify-start" 
          size="lg"
          asChild
        >
          <a href={onboardingUrl} target="_blank" rel="noopener noreferrer">
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
          <a href={discoveryUrl} target="_blank" rel="noopener noreferrer">
            <Calendar className="w-5 h-5 mr-2" />
            Schedule Discovery
          </a>
        </Button>
      </div>

      <div className="mt-6 pt-6 border-t border-border">
        <div className="text-center mb-3">
          <div className="text-3xl font-bold text-primary mb-1">24/7</div>
          <div className="text-sm text-muted-foreground">Support Available</div>
        </div>
        <p className="text-xs text-muted-foreground text-center">
          Get started today and see leads within 48 hours
        </p>
      </div>
    </Card>
  );
};