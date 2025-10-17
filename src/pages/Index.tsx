import { HeroSection } from "@/components/HeroSection";
import { PlatformComparison } from "@/components/PlatformComparison";
import { BudgetProposals } from "@/components/BudgetProposals";
import { ROICalculatorSection } from "@/components/ROICalculatorSection";
import { SocialMediaCTA } from "@/components/SocialMediaCTA";
import { AdExamples } from "@/components/AdExamples";
import { AIFeatures } from "@/components/AIFeatures";
import { KeyMetrics } from "@/components/KeyMetrics";

const Index = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <PlatformComparison />
      <BudgetProposals />
      <ROICalculatorSection />
      <SocialMediaCTA />
      <AdExamples />
      <AIFeatures />
      <KeyMetrics />
    </div>
  );
};

export default Index;
