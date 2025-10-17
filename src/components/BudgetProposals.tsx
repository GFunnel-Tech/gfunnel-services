import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

const budgetTiers = [
  {
    name: "Starter",
    budget: "$2,000/mo",
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
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-foreground">Proposed Ad Spend Budgets</h2>
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
