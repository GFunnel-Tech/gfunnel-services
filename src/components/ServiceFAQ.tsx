import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FAQItem } from "@/lib/serviceFAQs";
import { budgetTiers, calculateTierMetrics, TierCalculations } from "@/lib/calculators";
import { BusinessMetrics } from "@/lib/schemas";
import { Check } from "lucide-react";

interface ServiceFAQProps {
  faqs: FAQItem[];
}

export const ServiceFAQ = ({ faqs }: ServiceFAQProps) => {
  const [customBudget, setCustomBudget] = useState<string>("");
  const [showCustomResults, setShowCustomResults] = useState(false);

  const calculateCustomBudgetResults = (budget: number) => {
    let tierAlignment = "";
    let expectedLeads = 0;
    let cplRange = "";
    let platforms = "";
    let recommendation = "";

    if (budget < 3000) {
      tierAlignment = "Below our minimum recommended budget";
      expectedLeads = Math.round(budget / 50);
      cplRange = "$40-60";
      platforms = "Facebook only (limited)";
      recommendation = "We recommend starting at $3,000/mo for optimal results with our AI-powered system.";
    } else if (budget >= 3000 && budget < 5000) {
      tierAlignment = "Starter Tier";
      expectedLeads = Math.round(budget / 50);
      cplRange = "$45-65";
      platforms = "Facebook Ads";
      recommendation = "Good starting point. Consider Growth tier ($5,000) for multi-platform reach.";
    } else if (budget >= 5000 && budget < 8000) {
      tierAlignment = "Growth Tier (Recommended)";
      expectedLeads = Math.round(budget / 45);
      cplRange = "$35-55";
      platforms = "Facebook + Google Ads";
      recommendation = "Ideal budget for most businesses. Multi-platform coverage with strong ROI potential.";
    } else {
      tierAlignment = "Premium Tier";
      expectedLeads = Math.round(budget / 40);
      cplRange = "$30-50";
      platforms = "Facebook + Google + YouTube";
      recommendation = "Enterprise-level reach. Maximum lead volume with lowest CPL and dedicated support.";
    }

    return { tierAlignment, expectedLeads, cplRange, platforms, recommendation };
  };

  const handleCalculateCustomBudget = () => {
    const budget = parseFloat(customBudget);
    if (!isNaN(budget) && budget > 0) {
      setShowCustomResults(true);
    }
  };

  const customResults = customBudget && !isNaN(parseFloat(customBudget)) && parseFloat(customBudget) > 0
    ? calculateCustomBudgetResults(parseFloat(customBudget))
    : null;

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <Badge variant="secondary" className="mb-4">
          Frequently Asked Questions
        </Badge>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground">
          Everything You Need to Know
        </h2>
      </div>

      <Accordion type="single" collapsible className="w-full space-y-4">
        {faqs.map((item) => {
          const Icon = item.icon;
          
          // Handle the calculator item dynamically
          if (item.content === null && item.title === "Custom Budget Calculator") {
            return (
              <AccordionItem
                key={item.number}
                value={`item-${item.number}`}
                className="border border-border rounded-lg px-6 bg-card hover:bg-accent/5 transition-colors"
              >
                <AccordionTrigger className="hover:no-underline py-6">
                  <div className="flex items-center gap-4 text-left">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 shrink-0">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">
                        Question {item.number}
                      </div>
                      <div className="font-semibold text-foreground">
                        {item.title}
                      </div>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-2 pb-6 pl-14">
                  <div className="space-y-6">
                    <p className="text-muted-foreground leading-relaxed">
                      Enter your monthly advertising budget below to see what tier you'd fall into and estimated results.
                    </p>

                    <Card className="p-6 bg-muted/30">
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-foreground mb-2 block">
                            Monthly Advertising Budget
                          </label>
                          <div className="flex gap-3">
                            <div className="relative flex-1">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                $
                              </span>
                              <Input
                                type="number"
                                placeholder="5000"
                                value={customBudget}
                                onChange={(e) => setCustomBudget(e.target.value)}
                                className="pl-7"
                              />
                            </div>
                            <Button onClick={handleCalculateCustomBudget} className="shrink-0">
                              Calculate
                            </Button>
                          </div>
                        </div>

                        {showCustomResults && customResults && (
                          <div className="space-y-4 pt-4 border-t border-border">
                            <div className="grid md:grid-cols-2 gap-4">
                              <div className="bg-background rounded-lg p-4 border border-border">
                                <div className="text-xs text-muted-foreground mb-1">Tier Alignment</div>
                                <div className="text-lg font-bold text-foreground">{customResults.tierAlignment}</div>
                              </div>
                              <div className="bg-background rounded-lg p-4 border border-border">
                                <div className="text-xs text-muted-foreground mb-1">Expected Monthly Leads</div>
                                <div className="text-lg font-bold text-primary">{customResults.expectedLeads} leads</div>
                              </div>
                              <div className="bg-background rounded-lg p-4 border border-border">
                                <div className="text-xs text-muted-foreground mb-1">Estimated CPL</div>
                                <div className="text-lg font-bold text-foreground">{customResults.cplRange}</div>
                              </div>
                              <div className="bg-background rounded-lg p-4 border border-border">
                                <div className="text-xs text-muted-foreground mb-1">Platforms Included</div>
                                <div className="text-lg font-bold text-foreground">{customResults.platforms}</div>
                              </div>
                            </div>

                            <div className="bg-primary/10 rounded-lg p-4 border border-primary/20">
                              <div className="flex items-start gap-3">
                                <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                <div>
                                  <h4 className="font-semibold text-foreground mb-1">Recommendation</h4>
                                  <p className="text-sm text-muted-foreground">{customResults.recommendation}</p>
                                </div>
                              </div>
                            </div>

                            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                              <h4 className="font-semibold text-foreground text-sm">What's Included:</h4>
                              <ul className="space-y-1 text-sm text-muted-foreground">
                                <li className="flex items-center gap-2">
                                  <Check className="w-4 h-4 text-secondary" />
                                  <span>24/7 AI-powered lead response (&lt;5 min response time)</span>
                                </li>
                                <li className="flex items-center gap-2">
                                  <Check className="w-4 h-4 text-secondary" />
                                  <span>Campaign management and optimization</span>
                                </li>
                                <li className="flex items-center gap-2">
                                  <Check className="w-4 h-4 text-secondary" />
                                  <span>Monthly performance reporting and strategy calls</span>
                                </li>
                                <li className="flex items-center gap-2">
                                  <Check className="w-4 h-4 text-secondary" />
                                  <span>AI voice calling and SMS follow-up system</span>
                                </li>
                              </ul>
                            </div>
                          </div>
                        )}
                      </div>
                    </Card>
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          }

          // Regular FAQ items
          return (
            <AccordionItem
              key={item.number}
              value={`item-${item.number}`}
              className="border border-border rounded-lg px-6 bg-card hover:bg-accent/5 transition-colors"
            >
              <AccordionTrigger className="hover:no-underline py-6">
                <div className="flex items-center gap-4 text-left">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 shrink-0">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">
                      Question {item.number}
                    </div>
                    <div className="font-semibold text-foreground">
                      {item.title}
                    </div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-2 pb-6 pl-14">
                {item.content}
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
};