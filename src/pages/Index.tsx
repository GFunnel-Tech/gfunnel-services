import { HeroSection } from "@/components/HeroSection";
import { FAQAccordion } from "@/components/FAQAccordion";
import { BudgetProposals } from "@/components/BudgetProposals";
import { ROICalculatorSection } from "@/components/ROICalculatorSection";
import { QuickActions } from "@/components/QuickActions";

const Index = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <FAQAccordion />
      
      <div id="roi-calculator-section">
        <ROICalculatorSection />
      </div>
      
      <div id="budget-section" className="relative">
        <div className="container mx-auto px-6 py-16">
          <div className="grid lg:grid-cols-[1fr,300px] gap-8 max-w-7xl mx-auto">
            <div>
              <BudgetProposals />
            </div>
            <aside className="hidden lg:block">
              <QuickActions />
            </aside>
          </div>
        </div>
      </div>

      {/* Mobile Quick Actions - Fixed Bottom */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4 shadow-lg z-50">
        <div className="flex gap-2">
          <button 
            onClick={() => {
              const calculator = document.querySelector('#roi-calculator-section');
              calculator?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="flex-1 bg-primary text-primary-foreground px-4 py-3 rounded-md font-medium text-sm"
          >
            Calculate ROI
          </button>
          <a 
            href="tel:+1234567890"
            className="flex-1 bg-secondary text-secondary-foreground px-4 py-3 rounded-md font-medium text-sm text-center"
          >
            Call Now
          </a>
        </div>
      </div>
    </div>
  );
};

export default Index;
