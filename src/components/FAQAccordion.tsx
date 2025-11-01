import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CheckCircle, TrendingUp, Clock, Package, Award } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const faqItems = [
  {
    number: 1,
    icon: CheckCircle,
    title: "Why Should I Care?",
    content: (
      <div className="space-y-4">
        <p className="text-muted-foreground leading-relaxed">
          Traditional advertising agencies charge premium fees with slow response times, resulting in lost leads and wasted budget. Our AI-powered platform combines enterprise-level campaign management with instant lead response—all at a fraction of the cost.
        </p>
        <div className="bg-muted/50 rounded-lg p-4 space-y-2">
          <h4 className="font-semibold text-foreground">Key Problems We Solve:</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
              <span>Slow lead response times (industry average: 42 hours → we do 5 minutes)</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
              <span>High cost per lead ($75-150 → we achieve $28-42)</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
              <span>Lost leads during off-hours (24/7 AI coverage)</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
              <span>Inconsistent campaign performance (AI optimization)</span>
            </li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    number: 2,
    icon: TrendingUp,
    title: "What's My ROI Potential?",
    content: (
      <div className="space-y-4">
        <p className="text-muted-foreground leading-relaxed">
          Calculate your exact profitability using our ROI Calculator below. Based on security industry benchmarks and AI-enhanced conversion rates.
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg p-4 border border-primary/20">
            <div className="text-3xl font-bold text-primary mb-1">3-5x</div>
            <div className="text-sm text-muted-foreground">Conservative ROAS</div>
            <p className="text-xs text-muted-foreground mt-2">After 90-day optimization period</p>
          </div>
          <div className="bg-gradient-to-br from-secondary/10 to-secondary/5 rounded-lg p-4 border border-secondary/20">
            <div className="text-3xl font-bold text-secondary mb-1">$28-42</div>
            <div className="text-sm text-muted-foreground">Cost Per Lead</div>
            <p className="text-xs text-muted-foreground mt-2">44% below industry average</p>
          </div>
        </div>
        <div className="bg-accent/10 rounded-lg p-4 border border-accent/20">
          <h4 className="font-semibold text-foreground mb-2">Example ROI Scenario:</h4>
          <p className="text-sm text-muted-foreground">
            $5,000/mo budget → 120-180 leads → 4-7% conversion → 5-12 customers → Average customer value $2,000 → <span className="font-semibold text-accent">$10,000-24,000 revenue</span> (2-5x ROI)
          </p>
        </div>
      </div>
    ),
  },
  {
    number: 3,
    icon: Clock,
    title: "How Soon Will I See Results?",
    content: (
      <div className="space-y-4">
        <div className="grid md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <div className="bg-primary/10 text-primary rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3 text-2xl font-bold">
              30
            </div>
            <h4 className="font-semibold mb-2 text-foreground">Days 1-30</h4>
            <p className="text-sm text-muted-foreground">Campaign launch, initial testing, audience refinement. Expect first leads within 48 hours.</p>
          </div>
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <div className="bg-secondary/10 text-secondary rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3 text-2xl font-bold">
              60
            </div>
            <h4 className="font-semibold mb-2 text-foreground">Days 31-60</h4>
            <p className="text-sm text-muted-foreground">Optimization phase, scale winning ads, expand reach. CPL typically drops 20-30%.</p>
          </div>
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <div className="bg-accent/10 text-accent rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3 text-2xl font-bold">
              90
            </div>
            <h4 className="font-semibold mb-2 text-foreground">Days 61-90</h4>
            <p className="text-sm text-muted-foreground">Peak performance, predictable lead flow, data-driven scaling decisions.</p>
          </div>
        </div>
        <div className="bg-muted/50 rounded-lg p-4">
          <h4 className="font-semibold text-foreground mb-2">Quick Wins Timeline:</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><span className="font-medium text-foreground">Day 1-7:</span> Campaign setup, creative approval, launch</li>
            <li><span className="font-medium text-foreground">Day 8-14:</span> First leads, AI learning phase</li>
            <li><span className="font-medium text-foreground">Day 15-30:</span> Consistent lead flow, initial conversions</li>
            <li><span className="font-medium text-foreground">Day 31+:</span> Optimized performance, scaling opportunities</li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    number: 4,
    icon: Package,
    title: "What's Included?",
    content: (
      <div className="space-y-4">
        <div className="space-y-3">
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline">Starter</Badge>
              <span className="text-sm font-medium text-muted-foreground">&lt;$2,000/mo</span>
            </div>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                <span>Meta Suite (Facebook, Instagram, Messenger, WhatsApp)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                <span>AI lead response within 5 minutes</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                <span>Basic campaign optimization</span>
              </li>
            </ul>
          </div>

          <div className="bg-muted/50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline">Growth</Badge>
              <span className="text-sm font-medium text-muted-foreground">$2,000-10,000/mo</span>
            </div>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                <span>Meta + Google Suite + YouTube</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                <span>Advanced AI optimization</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                <span>Multi-platform remarketing</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                <span>Weekly performance reports</span>
              </li>
            </ul>
          </div>

          <div className="bg-muted/50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline">Premium</Badge>
              <span className="text-sm font-medium text-muted-foreground">$10,000/mo +</span>
            </div>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                <span>All platforms (Meta, Google, YouTube, LinkedIn, TikTok, Local Service Ads, Direct Mail)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                <span>Dedicated account strategist</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                <span>Custom audience development</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                <span>Priority support & optimization</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg p-4 border border-primary/20">
          <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
            <Package className="w-5 h-5 text-primary" />
            All Tiers Include:
          </h4>
          <ul className="grid md:grid-cols-2 gap-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <CheckCircle className="w-3 h-3 text-secondary shrink-0" />
              <span>Plai.io campaign management</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-3 h-3 text-secondary shrink-0" />
              <span>Flows AI voice assistant</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-3 h-3 text-secondary shrink-0" />
              <span>Lead Connector CRM integration</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-3 h-3 text-secondary shrink-0" />
              <span>24/7 lead monitoring</span>
            </li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    number: 5,
    icon: Award,
    title: "Proof It Works",
    content: (
      <div className="space-y-4">
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg p-4 border border-primary/20 text-center">
            <div className="text-4xl font-bold text-primary mb-2">9x</div>
            <div className="text-sm text-muted-foreground">Higher conversion rate with 5-min response vs 1hr+</div>
          </div>
          <div className="bg-gradient-to-br from-secondary/10 to-secondary/5 rounded-lg p-4 border border-secondary/20 text-center">
            <div className="text-4xl font-bold text-secondary mb-2">44%</div>
            <div className="text-sm text-muted-foreground">Lower CPL than industry average</div>
          </div>
          <div className="bg-gradient-to-br from-accent/10 to-accent/5 rounded-lg p-4 border border-accent/20 text-center">
            <div className="text-4xl font-bold text-accent mb-2">73%</div>
            <div className="text-sm text-muted-foreground">Higher conversion with AI follow-up</div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="bg-muted/50 rounded-lg p-4 border-l-4 border-primary">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h4 className="font-semibold text-foreground">Home Security Company - Austin, TX</h4>
                <p className="text-xs text-muted-foreground">3-month campaign, $4,500/mo budget</p>
              </div>
              <Badge variant="outline">Growth Tier</Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              "Within 60 days, our cost per lead dropped from $85 to $31. The AI response system caught leads we would have lost to competitors. We're now booking 40% more installations."
            </p>
            <div className="flex gap-4 text-xs">
              <span className="text-secondary font-medium">143 leads/month</span>
              <span className="text-secondary font-medium">$31 CPL</span>
              <span className="text-secondary font-medium">4.2x ROAS</span>
            </div>
          </div>

          <div className="bg-muted/50 rounded-lg p-4 border-l-4 border-secondary">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h4 className="font-semibold text-foreground">Commercial Security Solutions - Dallas, TX</h4>
                <p className="text-xs text-muted-foreground">6-month campaign, $12,000/mo budget</p>
              </div>
              <Badge variant="outline">Premium Tier</Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              "The multi-platform approach brought us qualified commercial leads we never accessed before. LinkedIn + Google combo was a game-changer for B2B. Revenue up 215%."
            </p>
            <div className="flex gap-4 text-xs">
              <span className="text-secondary font-medium">89 qualified leads/month</span>
              <span className="text-secondary font-medium">$135 CPL</span>
              <span className="text-secondary font-medium">8.3x ROAS</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground rounded-lg p-6">
          <h4 className="font-semibold text-lg mb-3 text-center">Industry Benchmarks vs Our Results</h4>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
              <div className="text-sm opacity-80 mb-1">Industry Avg Response Time</div>
              <div className="text-2xl font-bold">42 hours</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 ring-2 ring-white/40">
              <div className="text-sm opacity-80 mb-1">Our AI Response Time</div>
              <div className="text-2xl font-bold">&lt; 5 minutes</div>
            </div>
          </div>
        </div>
      </div>
    ),
  },
];

export const FAQAccordion = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible defaultValue="item-1" className="space-y-4">
            {faqItems.map((item, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index + 1}`}
                className="border border-border rounded-lg px-6 bg-card shadow-sm hover:shadow-md transition-shadow"
              >
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-4">
                    <div className="bg-primary text-primary-foreground rounded-full w-10 h-10 flex items-center justify-center font-bold shrink-0">
                      {item.number}
                    </div>
                    <div className="flex items-center gap-3">
                      <item.icon className="w-5 h-5 text-primary shrink-0" />
                      <span className="text-lg font-semibold text-foreground text-left">
                        {item.title}
                      </span>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-4 pb-2 pl-14">
                  {item.content}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};