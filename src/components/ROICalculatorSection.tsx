import { useState, useEffect } from "react";
import { BusinessMetrics } from "@/lib/schemas";
import { budgetTiers, calculateTierMetrics, TierCalculations } from "@/lib/calculators";
import { industryPresets } from "@/lib/industryPresets";
import { BusinessMetricsForm } from "./BusinessMetricsForm";
import { CalculatorResults } from "./CalculatorResults";
import { Calculator } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const ROICalculatorSection = () => {
  const [results, setResults] = useState<TierCalculations[] | null>(null);
  const [allIndustryResults, setAllIndustryResults] = useState<Record<string, TierCalculations[]>>({});
  const [selectedIndustry, setSelectedIndustry] = useState<string>("home-security");


  // Auto-calculate all industries on mount
  useEffect(() => {
    const calculatedResults: Record<string, TierCalculations[]> = {};
    
    Object.entries(industryPresets).forEach(([key, preset]) => {
      if (key !== "custom") {
        const metrics: BusinessMetrics = {
          contractValue: preset.contractValue,
          monthlyRecurring: preset.monthlyRecurring,
          serviceDeliveryCosts: preset.serviceDeliveryCosts,
          monthlyServiceCosts: preset.monthlyServiceCosts,
          retentionMonths: preset.retentionMonths,
          closeRate: preset.closeRate,
          estimatedCPL: preset.estimatedCPL,
        };
        calculatedResults[key] = budgetTiers.map((tier) => calculateTierMetrics(tier, metrics));
      }
    });
    
    setAllIndustryResults(calculatedResults);
  }, []);

  const handleCalculate = (metrics: BusinessMetrics) => {
    const calculations = budgetTiers.map((tier) => calculateTierMetrics(tier, metrics));
    setResults(calculations);
    setSelectedIndustry("custom");
    
    // Scroll to results
    setTimeout(() => {
      const resultsElement = document.getElementById("calculator-results");
      if (resultsElement) {
        resultsElement.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  const handleIndustrySelect = (industry: string) => {
    setSelectedIndustry(industry);
    if (industry === "custom") {
      // Show custom results if available
      if (results) {
        setTimeout(() => {
          const resultsElement = document.getElementById("calculator-results");
          if (resultsElement) {
            resultsElement.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }, 100);
      }
    } else {
      // Scroll to industry results
      setTimeout(() => {
        const resultsElement = document.getElementById("calculator-results");
        if (resultsElement) {
          resultsElement.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    }
  };

  const displayedResults = selectedIndustry === "custom" ? results : allIndustryResults[selectedIndustry];
  const industryTabs = Object.entries(industryPresets)
    .filter(([key]) => key !== "custom")
    .map(([key, preset]) => ({ key, name: preset.name }));

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
            View pre-calculated ROI for different industries or enter your custom business metrics
          </p>
        </div>

        {/* Industry Results Tabs */}
        {Object.keys(allIndustryResults).length > 0 && (
          <div id="calculator-results" className="scroll-mt-20 mb-12">
            <Tabs value={selectedIndustry} onValueChange={handleIndustrySelect} className="w-full">
              <div className="flex justify-center mb-8">
                <TabsList className="flex-wrap h-auto gap-2 bg-muted p-2">
                  {industryTabs.map(({ key, name }) => (
                    <TabsTrigger key={key} value={key} className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                      {name}
                    </TabsTrigger>
                  ))}
                  {results && (
                    <TabsTrigger value="custom" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                      Custom
                    </TabsTrigger>
                  )}
                </TabsList>
              </div>

              {industryTabs.map(({ key, name }) => (
                <TabsContent key={key} value={key}>
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-foreground mb-2">{name} ROI Analysis</h3>
                    <p className="text-sm text-muted-foreground">
                      {industryPresets[key].description}
                    </p>
                  </div>
                  {allIndustryResults[key] && <CalculatorResults results={allIndustryResults[key]} />}
                </TabsContent>
              ))}

              {results && (
                <TabsContent value="custom">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-foreground mb-2">Your Custom ROI Analysis</h3>
                    <p className="text-sm text-muted-foreground">
                      Based on your business metrics
                    </p>
                  </div>
                  <CalculatorResults results={results} />
                </TabsContent>
              )}
            </Tabs>
          </div>
        )}

        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-foreground mb-2">Custom Calculator</h3>
            <p className="text-sm text-muted-foreground">
              Enter your specific business metrics for a personalized ROI calculation
            </p>
          </div>
          <BusinessMetricsForm onCalculate={handleCalculate} />
        </div>
      </div>
    </section>
  );
};
