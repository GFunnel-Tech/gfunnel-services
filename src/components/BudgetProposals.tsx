import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

const budgetTiers = [
  {
    name: "Starter",
    budget: "$2,000/mo",
    platform: "Facebook Ads",
    features: [
      "Facebook & Instagram placement",
      "Local targeting (30-mile radius)",
      "AI lead response system",
      "Basic ad creative variations",
      "Monthly performance reports",
      "Expected: 40-60 qualified leads/mo"
    ],
    recommended: false
  },
  {
    name: "Growth",
    budget: "$5,000/mo",
    platform: "Facebook + Google",
    features: [
      "Facebook, Instagram & Google Search",
      "Extended targeting (50-mile radius)",
      "AI + Voice assistant callbacks",
      "Advanced ad creative testing",
      "Bi-weekly optimization calls",
      "CRM integration support",
      "Expected: 120-180 qualified leads/mo"
    ],
    recommended: true
  },
  {
    name: "Premium",
    budget: "$10,000/mo",
    platform: "Multi-Channel",
    features: [
      "All platforms + Display Network",
      "Multi-region campaign coverage",
      "Priority AI response queue",
      "Video ad campaigns included",
      "Weekly strategy sessions",
      "Dedicated account manager",
      "Custom landing page optimization",
      "Expected: 300-400 qualified leads/mo"
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
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-foreground">Ad Spend:</span>
              <span className="ml-2 text-muted-foreground">75% of total budget</span>
            </div>
            <div>
              <span className="font-medium text-foreground">Platform Management:</span>
              <span className="ml-2 text-muted-foreground">15% of total budget</span>
            </div>
            <div>
              <span className="font-medium text-foreground">Creative Production:</span>
              <span className="ml-2 text-muted-foreground">7% of total budget</span>
            </div>
            <div>
              <span className="font-medium text-foreground">Analytics & Reporting:</span>
              <span className="ml-2 text-muted-foreground">3% of total budget</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
