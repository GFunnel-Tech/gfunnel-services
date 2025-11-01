import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ExternalLink, Calculator, Phone, DollarSign } from "lucide-react";

export const QuickActions = () => {
  const scrollToCalculator = () => {
    const calculatorSection = document.querySelector('#roi-calculator-section');
    if (calculatorSection) {
      calculatorSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <Card className="sticky top-6 p-6 shadow-lg border-border">
      <h3 className="text-lg font-bold mb-4 text-foreground">Quick Actions</h3>
      <div className="space-y-3">
        <Button 
          className="w-full justify-start" 
          size="lg"
          onClick={scrollToCalculator}
        >
          <Calculator className="w-5 h-5 mr-2" />
          Calculate Your ROI
        </Button>
        
        <Button 
          variant="outline" 
          className="w-full justify-start"
          size="lg"
          asChild
        >
          <a href="#budget-section">
            <DollarSign className="w-5 h-5 mr-2" />
            View Pricing
          </a>
        </Button>

        <Button 
          variant="outline" 
          className="w-full justify-start"
          size="lg"
          asChild
        >
          <a href="tel:+1234567890">
            <Phone className="w-5 h-5 mr-2" />
            Call Us Now
          </a>
        </Button>

        <Button 
          variant="ghost" 
          className="w-full justify-start"
          size="lg"
          asChild
        >
          <a href="https://yourwebsite.com" target="_blank" rel="noopener noreferrer">
            <ExternalLink className="w-5 h-5 mr-2" />
            Visit Our Website
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