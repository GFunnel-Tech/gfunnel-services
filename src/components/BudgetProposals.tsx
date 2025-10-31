import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Calculator } from "lucide-react";

const budgetTiers = [
  {
    name: "Starter",
    budget: "<$2,000/mo",
    platform: "Meta Platforms",
    features: [
      "Meta (Facebook + Instagram + Messenger)",
      "Local targeting (30-mile radius)",
      "Plai.io platform management",
      "Flows AI voice callbacks (standard queue)",
      "Lead Connector CRM integration",
      "2-3 ad creative variations",
      "Monthly performance reports",
      "Monthly strategy sessions",
      "Expected: 50-70 qualified leads/mo @ $28-40 CPL"
    ],
    recommended: false
  },
  {
    name: "Growth",
    budget: "$5,000/mo",
    platform: "Multi-Platform",
    features: [
      "Meta + Google (Search + Pmax) + YouTube",
      "Extended targeting (50-mile radius)",
      "Plai.io advanced automation",
      "Flows AI priority queue + advanced routing",
      "Lead Connector with automation workflows",
      "5-7 ad creative variations",
      "Bi-weekly performance reports",
      "Bi-weekly optimization calls",
      "Expected: 120-180 qualified leads/mo @ $28-42 CPL"
    ],
    recommended: true
  },
  {
    name: "Premium",
    budget: "$10,000/mo",
    platform: "Full Multi-Channel",
    features: [
      "Meta, Google Suite, YouTube, LinkedIn, Local Service Ads, Direct Mail",
      "Multi-region campaign coverage",
      "Plai.io enterprise features + dedicated support",
      "Flows AI VIP queue + white-glove service",
      "Lead Connector advanced automation + custom integrations",
      "10+ ad creative variations",
      "Weekly performance reports + custom dashboards",
      "Weekly strategy sessions + dedicated account manager",
      "Expected: 300-400 qualified leads/mo @ $25-35 CPL"
    ],
    recommended: false
  }
];

export const BudgetProposals = () => {
  const [customBudget, setCustomBudget] = useState<string>("");
  const [showCustomResults, setShowCustomResults] = useState(false);

  const calculateCustomBudgetResults = (budget: number) => {
    if (budget < 2000) {
      return {
        tierAlignment: "Below Minimum",
        expectedLeads: { min: Math.floor(budget * 0.025), max: Math.floor(budget * 0.035) },
        cplRange: { min: 28, max: 40 },
        platforms: ["Limited coverage - consider Starter tier"],
        recommendation: "We recommend starting with at least $2,000/month for effective campaign management and meaningful results."
      };
    } else if (budget < 3500) {
      return {
        tierAlignment: "Starter Tier",
        expectedLeads: { min: 50, max: 70 },
        cplRange: { min: 28, max: 40 },
        platforms: ["Meta (Facebook + Instagram + Messenger)"],
        recommendation: "Your budget aligns with our Starter tier - perfect for testing the market with focused Meta campaigns."
      };
    } else if (budget < 5000) {
      const ratio = (budget - 3500) / (5000 - 3500);
      return {
        tierAlignment: "Between Starter & Growth",
        expectedLeads: { min: Math.floor(70 + ratio * 50), max: Math.floor(90 + ratio * 90) },
        cplRange: { min: 28, max: 42 },
        platforms: ["Meta Suite", "Partial Google coverage"],
        recommendation: "Consider upgrading to $5,000/month Growth tier for full multi-platform coverage and 120-180 qualified leads/month."
      };
    } else if (budget < 7500) {
      return {
        tierAlignment: "Growth Tier",
        expectedLeads: { min: 120, max: 180 },
        cplRange: { min: 28, max: 42 },
        platforms: ["Meta", "Google (Search + Pmax)", "YouTube"],
        recommendation: "Your budget aligns perfectly with our Growth tier - optimal balance of reach and profitability."
      };
    } else if (budget < 10000) {
      const ratio = (budget - 7500) / (10000 - 7500);
      return {
        tierAlignment: "Between Growth & Premium",
        expectedLeads: { min: Math.floor(180 + ratio * 120), max: Math.floor(220 + ratio * 180) },
        cplRange: { min: 26, max: 38 },
        platforms: ["Meta", "Google Suite", "YouTube", "Partial LinkedIn"],
        recommendation: "Consider upgrading to $10,000/month Premium tier for full multi-channel coverage and dedicated account management."
      };
    } else {
      return {
        tierAlignment: "Premium Tier or Higher",
        expectedLeads: { min: 300, max: 400 },
        cplRange: { min: 25, max: 35 },
        platforms: ["All platforms activated", "Multi-region coverage"],
        recommendation: "Your budget supports our Premium tier with full multi-channel coverage, dedicated support, and maximum market penetration."
      };
    }
  };

  const handleCalculateCustomBudget = () => {
    const budget = parseFloat(customBudget);
    if (!isNaN(budget) && budget > 0) {
      setShowCustomResults(true);
    }
  };

  const customResults = showCustomResults && customBudget ? calculateCustomBudgetResults(parseFloat(customBudget)) : null;

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-foreground">Recommended Ad Spend Budgets</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Flexible investment tiers designed to scale with your growth objectives
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {budgetTiers.map((tier) => (
            <Card 
              key={tier.name}
              className={`relative p-8 ${tier.recommended ? 'border-2 border-accent shadow-lg' : 'border border-border'}`}
            >
              {tier.recommended && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground">
                  Recommended
                </Badge>
              )}
              
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2 text-foreground">{tier.name}</h3>
                <div className="text-4xl font-bold text-primary mb-2">{tier.budget}</div>
                <p className="text-sm text-muted-foreground">{tier.platform}</p>
              </div>
              
              <ul className="space-y-3">
                {tier.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                    <span className="text-sm text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>

        {/* Client's Custom Budget Section */}
        <div className="mt-16 max-w-2xl mx-auto">
          <Card className="p-8 border-2 border-primary/20">
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4">
                <Calculator className="w-4 h-4" />
                <span className="text-sm font-medium">Custom Budget</span>
              </div>
              <h3 className="text-2xl font-bold mb-2 text-foreground">Your Proposed Budget</h3>
              <p className="text-sm text-muted-foreground">
                Enter your monthly advertising budget to see what you can expect
              </p>
            </div>

            <div className="flex gap-3 mb-6">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  type="number"
                  placeholder="3500"
                  value={customBudget}
                  onChange={(e) => setCustomBudget(e.target.value)}
                  className="pl-7"
                  min="0"
                  step="100"
                />
              </div>
              <Button onClick={handleCalculateCustomBudget} disabled={!customBudget}>
                Calculate Coverage
              </Button>
            </div>

            {customResults && (
              <div className="bg-muted/50 rounded-lg p-6 border border-border">
                <h4 className="font-semibold text-lg mb-4 text-foreground">
                  With ${parseFloat(customBudget).toLocaleString()}/month you can expect:
                </h4>
                <ul className="space-y-3 mb-4">
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                    <span className="text-sm text-foreground">
                      <strong>{customResults.expectedLeads.min}-{customResults.expectedLeads.max} qualified leads/month</strong>
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                    <span className="text-sm text-foreground">
                      ${customResults.cplRange.min}-${customResults.cplRange.max} cost per lead
                    </span>
                  </li>
                  {customResults.platforms.map((platform, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                      <span className="text-sm text-foreground">{platform}</span>
                    </li>
                  ))}
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                    <span className="text-sm text-foreground">
                      Best fit: <strong>{customResults.tierAlignment}</strong>
                    </span>
                  </li>
                </ul>
                <div className="pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground">
                    💡 <strong>Recommendation:</strong> {customResults.recommendation}
                  </p>
                </div>
              </div>
            )}
          </Card>
        </div>
        
        <div className="mt-12 p-6 bg-muted rounded-lg max-w-4xl mx-auto">
          <h3 className="font-semibold text-lg mb-3 text-foreground">Budget Allocation Breakdown</h3>
          <p className="text-sm text-muted-foreground mb-4">
            How your investment is distributed across platforms and services
          </p>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-foreground">Ad Spend (Platform Costs):</span>
              <span className="ml-2 text-muted-foreground">70-75% of total budget</span>
            </div>
            <div>
              <span className="font-medium text-foreground">Platform Management (Plai.io):</span>
              <span className="ml-2 text-muted-foreground">10-12% of total budget</span>
            </div>
            <div>
              <span className="font-medium text-foreground">AI/Voice Assistant (Flows AI):</span>
              <span className="ml-2 text-muted-foreground">5-8% of total budget</span>
            </div>
            <div>
              <span className="font-medium text-foreground">CRM Integration (Lead Connector):</span>
              <span className="ml-2 text-muted-foreground">2-3% of total budget</span>
            </div>
            <div>
              <span className="font-medium text-foreground">Creative Production & Testing:</span>
              <span className="ml-2 text-muted-foreground">5-7% of total budget</span>
            </div>
            <div>
              <span className="font-medium text-foreground">Analytics & Reporting:</span>
              <span className="ml-2 text-muted-foreground">3-5% of total budget</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
