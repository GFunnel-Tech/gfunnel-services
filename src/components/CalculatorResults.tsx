import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TierCalculations, getRatioColor, getRatioLabel } from "@/lib/calculators";
import { MetricHelpTooltip } from "./MetricHelpTooltip";
import { ContextualAdvice } from "./ContextualAdvice";
import { DollarSign, TrendingUp, Users, Target, Percent, Clock } from "lucide-react";

interface CalculatorResultsProps {
  results: TierCalculations[];
}

export const CalculatorResults = ({ results }: CalculatorResultsProps) => {
  const bestTierIndex = results.reduce(
    (bestIdx, curr, idx, arr) => (curr.ltgpCacRatio > arr[bestIdx].ltgpCacRatio ? idx : bestIdx),
    0
  );

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatNumber = (value: number, decimals: number = 0) => {
    return value.toFixed(decimals);
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-3xl font-bold text-foreground mb-2">Your ROI Analysis</h3>
        <p className="text-muted-foreground">
          Compare profitability across all three budget tiers
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {results.map((result, idx) => {
          const ratioColor = getRatioColor(result.ltgpCacRatio);
          const ratioLabel = getRatioLabel(result.ltgpCacRatio);
          const isBest = idx === bestTierIndex;

          const colorClasses = {
            green: "text-secondary",
            yellow: "text-accent",
            red: "text-destructive",
          };

          const bgColorClasses = {
            green: "bg-secondary/10",
            yellow: "bg-accent/10",
            red: "bg-destructive/10",
          };

          return (
            <Card
              key={result.tierName}
              className={`relative p-6 ${isBest ? "border-2 border-primary shadow-lg" : "border border-border"}`}
            >
              {isBest && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground">
                  Best Value
                </Badge>
              )}

              <div className="text-center mb-6">
                <h4 className="text-2xl font-bold text-foreground mb-1">{result.tierName}</h4>
                <p className="text-3xl font-bold text-primary">{formatCurrency(result.budget)}/mo</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {result.platforms.join(" + ")}
                </p>
              </div>

              <div className={`p-4 rounded-lg ${bgColorClasses[ratioColor]} mb-6`}>
                <div className="text-center">
                  <p className="text-sm font-medium text-muted-foreground mb-1 flex items-center justify-center">
                    LTGP:CAC Ratio
                    <MetricHelpTooltip metricKey="ltgpCacRatio" />
                  </p>
                  <p className={`text-4xl font-bold ${colorClasses[ratioColor]}`}>
                    {formatNumber(result.ltgpCacRatio, 1)}:1
                  </p>
                  <p className={`text-sm font-semibold mt-1 ${colorClasses[ratioColor]}`}>
                    {ratioLabel}
                  </p>
                </div>
                <div className="mt-3">
                  <Progress
                    value={Math.min((result.ltgpCacRatio / 5) * 100, 100)}
                    className="h-2"
                  />
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <Target className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-muted-foreground">Expected Leads/mo</p>
                    <p className="font-semibold text-foreground">{formatNumber(result.expectedLeadsAvg)} leads @ {formatCurrency(result.cplAvg)} CPL</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Users className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-muted-foreground">Expected Customers/mo</p>
                    <p className="font-semibold text-foreground">{formatNumber(result.expectedCustomers, 1)} customers</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <DollarSign className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <div className="flex-1 flex items-center">
                    <div>
                      <p className="text-muted-foreground flex items-center">
                        CAC per Customer
                        <MetricHelpTooltip metricKey="cac" />
                      </p>
                      <p className="font-semibold text-foreground">{formatCurrency(result.cac)}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <TrendingUp className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-muted-foreground flex items-center">
                      LTV per Customer
                      <MetricHelpTooltip metricKey="ltv" />
                    </p>
                    <p className="font-semibold text-foreground">{formatCurrency(result.ltv)}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-border">
                  <div className="flex items-start gap-2 mb-2">
                    <DollarSign className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-muted-foreground flex items-center">
                        LTGP per Customer
                        <MetricHelpTooltip metricKey="ltgp" />
                      </p>
                      <p className="text-lg font-bold text-secondary">{formatCurrency(result.ltgp)}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <DollarSign className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-muted-foreground">Net Profit per Customer</p>
                    <p className="font-semibold text-foreground">{formatCurrency(result.netProfitPerCustomer)}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Percent className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-muted-foreground">ROI</p>
                    <p className="font-semibold text-foreground">{formatNumber(result.roi)}%</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <TrendingUp className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-muted-foreground">Monthly Gross Profit Potential</p>
                    <p className="font-semibold text-foreground">
                      {formatCurrency(result.monthlyGrossProfitPotential)}
                    </p>
                  </div>
                </div>

                {result.breakEvenMonths > 0 && (
                  <div className="flex items-start gap-2">
                    <Clock className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-muted-foreground">Break-Even Time</p>
                      <p className="font-semibold text-foreground">
                        {formatNumber(result.breakEvenMonths, 1)} months
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      <div className="mt-16">
        <h3 className="text-2xl font-bold mb-6 text-center text-foreground">Your Business Health Assessment</h3>
        <ContextualAdvice 
          ltgpCacRatio={results[bestTierIndex].ltgpCacRatio} 
          bestTierName={results[bestTierIndex].tierName}
        />
      </div>
    </div>
  );
};
