import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Facebook, Globe } from "lucide-react";
import vivintAd from "@/assets/vivint-ad.jpg";
import alarmDotComAd from "@/assets/alarm-dot-com-ad.jpg";
import adtAd from "@/assets/adt-ad.jpg";

const adExamples = [
  {
    platform: "Facebook",
    icon: Facebook,
    type: "Residential Security",
    headline: "Protect Your Home 24/7 with Security Pro",
    body: "Professional home security systems installed in 24 hours. Get a FREE security assessment today!",
    cta: "Get Free Quote",
    targeting: "Homeowners, 35-65, within 30 miles",
    bgColor: "bg-blue-50 dark:bg-blue-950/20",
    accentColor: "text-blue-600 dark:text-blue-400"
  },
  {
    platform: "Facebook",
    icon: Facebook,
    type: "Commercial Security",
    headline: "Business Security That Never Sleeps",
    body: "Enterprise-grade security systems with 24/7 monitoring. Protect your business assets with cutting-edge technology.",
    cta: "Schedule Consultation",
    targeting: "Business owners, property managers, 30-60",
    bgColor: "bg-blue-50 dark:bg-blue-950/20",
    accentColor: "text-blue-600 dark:text-blue-400"
  },
  {
    platform: "Google Search",
    icon: Globe,
    type: "High-Intent Search",
    headline: "Security Systems Installation | Security Pro",
    body: "Professional installation in 24hrs. Free quote. A+ rated security company serving residential & commercial clients.",
    cta: "Call Now",
    targeting: "Keywords: 'security system installation', 'home security'",
    bgColor: "bg-green-50 dark:bg-green-950/20",
    accentColor: "text-green-600 dark:text-green-400"
  },
  {
    platform: "Google Display",
    icon: Globe,
    type: "Retargeting Campaign",
    headline: "Still Thinking About Security? We're Here to Help",
    body: "Limited time: Save 20% on professional security installation. Our experts are standing by.",
    cta: "Claim Offer",
    targeting: "Website visitors, engaged users",
    bgColor: "bg-green-50 dark:bg-green-950/20",
    accentColor: "text-green-600 dark:text-green-400"
  }
];

export const AdExamples = () => {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-foreground">Example Ad Creatives</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Proven ad formats designed to maximize engagement and conversions
          </p>
        </div>

        {/* Competitor Examples Section */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold mb-6 text-center text-foreground">Industry Examples</h3>
          <p className="text-center text-muted-foreground mb-8 max-w-3xl mx-auto">
            Successful ad campaigns from leading security companies for reference and inspiration
          </p>
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-8">
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <img src={vivintAd} alt="Vivint Smart Home Ad Example" className="w-full h-48 object-cover" />
              <div className="p-4">
                <Badge variant="outline" className="mb-2">Vivint Smart Home</Badge>
                <p className="text-sm text-muted-foreground">
                  Focus: Smart home integration with lifestyle imagery
                </p>
              </div>
            </Card>
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <img src={alarmDotComAd} alt="Alarm.com Ad Example" className="w-full h-48 object-cover" />
              <div className="p-4">
                <Badge variant="outline" className="mb-2">Alarm.com</Badge>
                <p className="text-sm text-muted-foreground">
                  Focus: Professional product display with control emphasis
                </p>
              </div>
            </Card>
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <img src={adtAd} alt="ADT Ad Example" className="w-full h-48 object-cover" />
              <div className="p-4">
                <Badge variant="outline" className="mb-2">ADT</Badge>
                <p className="text-sm text-muted-foreground">
                  Focus: Trust and family safety, emotional connection
                </p>
              </div>
            </Card>
          </div>
        </div>

        {/* Security Pro Proposed Ads */}
        <div>
          <h3 className="text-2xl font-bold mb-6 text-center text-foreground">Proposed Security Pro Ads</h3>
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {adExamples.map((ad, idx) => (
              <Card key={idx} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-2 rounded-lg ${ad.bgColor}`}>
                    <ad.icon className={`w-5 h-5 ${ad.accentColor}`} />
                  </div>
                  <div className="flex-1">
                    <Badge variant="outline" className="mb-1">{ad.platform}</Badge>
                    <p className="text-sm font-medium text-muted-foreground">{ad.type}</p>
                  </div>
                </div>
                
                <div className="space-y-3 mb-4">
                  <h3 className="text-xl font-bold text-foreground">{ad.headline}</h3>
                  <p className="text-sm text-foreground leading-relaxed">{ad.body}</p>
                  <div className="inline-block">
                    <div className="bg-primary text-primary-foreground px-6 py-2 rounded-md font-semibold text-sm">
                      {ad.cta}
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground">
                    <span className="font-medium">Target Audience:</span> {ad.targeting}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground italic">
            All ad creatives will be A/B tested with multiple variations to optimize performance
          </p>
        </div>
      </div>
    </section>
  );
};
