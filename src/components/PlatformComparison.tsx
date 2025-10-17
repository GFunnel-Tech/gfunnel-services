import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Facebook, Globe, Target, DollarSign, Users, BarChart } from "lucide-react";

const platforms = [
  {
    name: "Facebook & Instagram Ads",
    icon: Facebook,
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-950/20",
    strengths: [
      { icon: Target, text: "Precise demographic & interest targeting" },
      { icon: Users, text: "Large local audience reach" },
      { icon: DollarSign, text: "Lower cost per click ($1.50 - $3.00)" }
    ],
    bestFor: "Brand awareness, visual storytelling, engagement",
    avgCPC: "$1.50 - $3.00",
    avgCTR: "2.5% - 4.0%",
    conversionRate: "3% - 6%"
  },
  {
    name: "Google Search & Display",
    icon: Globe,
    color: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-50 dark:bg-green-950/20",
    strengths: [
      { icon: Target, text: "High-intent keyword targeting" },
      { icon: BarChart, text: "Search + display network reach" },
      { icon: DollarSign, text: "Better conversion rates" }
    ],
    bestFor: "Capturing active searchers, immediate leads",
    avgCPC: "$3.00 - $8.00",
    avgCTR: "3.5% - 6.0%",
    conversionRate: "5% - 10%"
  }
];

export const PlatformComparison = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-foreground">Platform Strategy</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Multi-platform approach combining awareness and high-intent targeting
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto mb-12">
          {platforms.map((platform) => (
            <Card key={platform.name} className="p-8 border-border">
              <div className="flex items-center gap-4 mb-6">
                <div className={`p-3 rounded-lg ${platform.bgColor}`}>
                  <platform.icon className={`w-8 h-8 ${platform.color}`} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-foreground">{platform.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">Best for: {platform.bestFor}</p>
                </div>
              </div>
              
              <div className="space-y-4 mb-6">
                {platform.strengths.map((strength, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <strength.icon className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                    <span className="text-sm text-foreground">{strength.text}</span>
                  </div>
                ))}
              </div>
              
              <div className="pt-6 border-t border-border grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Avg CPC</p>
                  <p className="font-semibold text-foreground">{platform.avgCPC}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Avg CTR</p>
                  <p className="font-semibold text-foreground">{platform.avgCTR}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Conv. Rate</p>
                  <p className="font-semibold text-secondary">{platform.conversionRate}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
        
        <div className="max-w-4xl mx-auto">
          <Card className="p-8 bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/20">
            <h3 className="text-xl font-bold mb-4 text-foreground">Recommended Strategy: Hybrid Approach</h3>
            <div className="space-y-3 text-sm text-foreground">
              <p className="flex items-start gap-2">
                <Badge className="bg-primary text-primary-foreground shrink-0">Phase 1</Badge>
                <span>Launch Facebook campaigns for brand awareness and local market penetration (60% of budget)</span>
              </p>
              <p className="flex items-start gap-2">
                <Badge className="bg-primary text-primary-foreground shrink-0">Phase 2</Badge>
                <span>Introduce Google Search to capture high-intent queries (30% of budget)</span>
              </p>
              <p className="flex items-start gap-2">
                <Badge className="bg-primary text-primary-foreground shrink-0">Phase 3</Badge>
                <span>Add retargeting campaigns across both platforms (10% of budget)</span>
              </p>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};
