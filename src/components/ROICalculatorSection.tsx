import { useState } from "react";
import { BusinessMetrics } from "@/lib/schemas";
import { budgetTiers, calculateTierMetrics, TierCalculations } from "@/lib/calculators";
import { BusinessMetricsForm } from "./BusinessMetricsForm";
import { CalculatorResults } from "./CalculatorResults";
import { Calculator } from "lucide-react";

export const ROICalculatorSection = () => {
  const [results, setResults] = useState<TierCalculations[] | null>(null);

  const handleCalculate = (metrics: BusinessMetrics) => {
    const calculations = budgetTiers.map((tier) => calculateTierMetrics(tier, metrics));
    setResults(calculations);
    
    // Scroll to results
    setTimeout(() => {
      const resultsElement = document.getElementById("calculator-results");
      if (resultsElement) {
        resultsElement.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4">
            <Calculator className="w-4 h-4" />
            <span className="text-sm font-medium">ROI Calculator</span>
          </div>
          <h2 className="text-4xl font-bold mb-4 text-foreground">
            Calculate Your True Profitability
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Enter your business metrics to see exactly how profitable each ad budget tier will be for your specific business
          </p>
        </div>

        <div className="max-w-4xl mx-auto mb-12">
          <BusinessMetricsForm onCalculate={handleCalculate} />
        </div>

        {results && (
          <div id="calculator-results" className="scroll-mt-20">
            <CalculatorResults results={results} />
          </div>
        )}
      </div>
    </section>
  );
};
