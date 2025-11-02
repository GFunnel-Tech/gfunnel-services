import { useState, useRef } from "react";
import { BusinessMetrics } from "@/lib/schemas";
import { budgetTiers, calculateTierMetrics, TierCalculations } from "@/lib/calculators";
import { industryPresets } from "@/lib/industryPresets";
import { BusinessMetricsForm, BusinessMetricsFormRef } from "./BusinessMetricsForm";
import { CalculatorResults } from "./CalculatorResults";
import { Calculator } from "lucide-react";
import { Button } from "./ui/button";

export const ROICalculatorSection = () => {
  const [results, setResults] = useState<TierCalculations[] | null>(null);
  const [selectedIndustry, setSelectedIndustry] = useState<string>("custom");
  const formRef = useRef<BusinessMetricsFormRef>(null);

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

  const handleIndustryClick = (industryKey: string) => {
    setSelectedIndustry(industryKey);
    formRef.current?.setIndustry(industryKey);
  };

  const industryButtons = Object.entries(industryPresets)
    .filter(([key]) => key !== "custom")
    .map(([key, preset]) => ({
      key,
      name: preset.name,
    }));

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
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Select your industry to see instant ROI calculations, or customize the metrics below
          </p>

          {/* Industry Switcher Buttons */}
          <div className="flex flex-wrap gap-3 justify-center max-w-4xl mx-auto">
            {industryButtons.map(({ key, name }) => (
              <Button
                key={key}
                onClick={() => handleIndustryClick(key)}
                variant={selectedIndustry === key ? "default" : "outline"}
                className="transition-all"
              >
                {name}
              </Button>
            ))}
            <Button
              onClick={() => handleIndustryClick("custom")}
              variant={selectedIndustry === "custom" ? "default" : "outline"}
              className="transition-all"
            >
              Custom
            </Button>
          </div>
        </div>

        <div className="max-w-4xl mx-auto mb-12">
          <BusinessMetricsForm ref={formRef} onCalculate={handleCalculate} />
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
