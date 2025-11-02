import { Card } from "@/components/ui/card";
import { Bot, Clock, TrendingUp, Phone, Zap, Users } from "lucide-react";

const features = [
  {
    icon: Clock,
    title: "5-Minute Response Time",
    description: "AI voice assistants contact leads within 5 minutes of form submission, maximizing conversion rates when interest is highest.",
    stat: "73% higher conversion vs 1hr+ response"
  },
  {
    icon: Bot,
    title: "AI Campaign Management",
    description: "Advanced AI platform manages ad campaigns across all platforms, optimizes bidding strategies, and provides real-time performance insights.",
    stat: "40% lower cost per acquisition"
  },
  {
    icon: Phone,
    title: "Flows AI Voice Assistant",
    description: "Natural language AI assistants qualify leads, answer questions, and schedule appointments automatically with human-like conversation.",
    stat: "24/7 availability, never miss a lead"
  },
  {
    icon: TrendingUp,
    title: "Predictive Optimization",
    description: "Machine learning algorithms continuously improve ad performance by analyzing conversion patterns and user behavior.",
    stat: "Average 30% monthly improvement"
  },
  {
    icon: Users,
    title: "Lead Connector CRM Integration",
    description: "Seamlessly integrate with Lead Connector CRM. AI prioritizes high-value prospects and routes them to appropriate sales team members based on service type and urgency.",
    stat: "2x faster sales cycle"
  },
  {
    icon: Zap,
    title: "Automated Follow-Up",
    description: "Smart nurture sequences keep prospects engaged with personalized content until they're ready to convert.",
    stat: "45% increase in eventual conversions"
  }
];

export const AIFeatures = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full mb-4">
            <Zap className="w-4 h-4" />
            <span className="text-sm font-medium">AI-Powered Advantage</span>
          </div>
          <h2 className="text-4xl font-bold mb-4 text-foreground">
            Why AI Makes The Difference
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Automated intelligence that turns more clicks into customers
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {features.map((feature) => (
            <Card key={feature.title} className="p-6 hover:shadow-lg transition-all border-border">
              <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">{feature.title}</h3>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                {feature.description}
              </p>
              <div className="pt-4 border-t border-border">
                <p className="text-xs font-semibold text-secondary">
                  {feature.stat}
                </p>
              </div>
            </Card>
          ))}
        </div>
        
        <div className="mt-12 max-w-4xl mx-auto bg-gradient-to-br from-primary to-primary/80 text-primary-foreground rounded-lg p-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-3">The Speed Advantage</h3>
            <p className="text-lg mb-6 opacity-90">
              Research shows that businesses responding within 5 minutes are 9x more likely to convert leads compared to those who wait an hour or more.
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-3xl font-bold mb-1">9x</div>
                <div className="text-sm opacity-80">Higher Conversion Rate</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-3xl font-bold mb-1">100%</div>
                <div className="text-sm opacity-80">Leads Contacted</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-3xl font-bold mb-1">24/7</div>
                <div className="text-sm opacity-80">Availability</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
