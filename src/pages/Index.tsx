import { HeroSection } from "@/components/HeroSection";
import { FAQAccordion } from "@/components/FAQAccordion";
import { BudgetProposals } from "@/components/BudgetProposals";
import { QuickActions } from "@/components/QuickActions";
import { SocialMediaCTA } from "@/components/SocialMediaCTA";
import { SuccessRoadmap } from "@/components/SuccessRoadmap";
const Index = () => {
  return <div className="min-h-screen">
      <HeroSection />

      <div className="container mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-[1fr,300px] gap-8 max-w-7xl mx-auto">
          <div>
            <FAQAccordion />
          </div>
          <aside className="hidden lg:block">
            <QuickActions />
          </aside>
        </div>
      </div>

      <SocialMediaCTA />

      

      <div id="budget-section" className="relative">
        
      </div>

      {/* Mobile Quick Actions - Fixed Bottom */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4 shadow-lg z-50">
        <div className="flex gap-2">
          <a href="https://onboarding.gfunnel.com/paid-advertisement" target="_blank" rel="noopener noreferrer" className="flex-1 bg-primary text-primary-foreground px-4 py-3 rounded-md font-medium text-sm text-center">
            Get Started
          </a>
          <a href="https://www.gfunnel.com/discover?services=paid-advertisement" target="_blank" rel="noopener noreferrer" className="flex-1 bg-secondary text-secondary-foreground px-4 py-3 rounded-md font-medium text-sm text-center">
            Schedule Discovery
          </a>
        </div>
      </div>
    </div>;
};
export default Index;