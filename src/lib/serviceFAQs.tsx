import { CheckCircle, TrendingUp, Clock, Package, Award, Calculator, DollarSign, Settings, FileText, Zap, Palette, MessageSquare, Presentation, Share2, Video, Sparkles, Bot, Plug, Database, Shield } from "lucide-react";
import { LucideIcon } from "lucide-react";

export interface FAQItem {
  number: number;
  icon: LucideIcon;
  title: string;
  content: React.ReactNode;
}

export const paidAdsFAQs: FAQItem[] = [
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
              <span>High cost per lead (Industry avg: $75-150 → Our target: $35-65)</span>
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
          Our AI-optimized campaigns deliver 3-5x ROAS with lower cost per lead through instant response times and predictive optimization.
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg p-4 border border-primary/20">
            <div className="text-3xl font-bold text-primary mb-1">3-5x</div>
            <div className="text-sm text-muted-foreground">Conservative ROAS</div>
            <p className="text-xs text-muted-foreground mt-2">After 90-day optimization period</p>
          </div>
          <div className="bg-gradient-to-br from-secondary/10 to-secondary/5 rounded-lg p-4 border border-secondary/20">
            <div className="text-3xl font-bold text-secondary mb-1">$35-65</div>
            <div className="text-sm text-muted-foreground">Target CPL Range</div>
            <p className="text-xs text-muted-foreground mt-2">Competitive with AI optimization</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    number: 3,
    icon: Clock,
    title: "How Long Until I See Results?",
    content: (
      <div className="space-y-4">
        <p className="text-muted-foreground leading-relaxed">
          Campaigns launch within 5-7 business days, with first leads typically arriving within 48 hours of go-live.
        </p>
      </div>
    ),
  }
];

export const administrativeFAQs: FAQItem[] = [
  {
    number: 1,
    icon: CheckCircle,
    title: "Why Should I Care?",
    content: (
      <div className="space-y-4">
        <p className="text-muted-foreground leading-relaxed">
          Business owners spend 40% of their time on administrative tasks instead of revenue-generating activities. Our professional administrative services free you up to focus on growth.
        </p>
        <div className="bg-muted/50 rounded-lg p-4 space-y-2">
          <h4 className="font-semibold text-foreground">Key Problems We Solve:</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
              <span>Time wasted on scheduling, email management, and data entry</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
              <span>Disorganized documents and poor record keeping</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
              <span>Missed opportunities due to lack of follow-up</span>
            </li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    number: 2,
    icon: Clock,
    title: "What Tasks Can You Handle?",
    content: (
      <div className="space-y-4">
        <p className="text-muted-foreground leading-relaxed">
          Calendar management, email organization, data entry, document preparation, customer service support, travel arrangements, and general administrative tasks.
        </p>
      </div>
    ),
  },
  {
    number: 3,
    icon: TrendingUp,
    title: "What's the ROI?",
    content: (
      <div className="space-y-4">
        <p className="text-muted-foreground leading-relaxed">
          Save 15-20 hours per week at a fraction of the cost of hiring a full-time assistant. Invest that time into strategic activities that grow your business.
        </p>
      </div>
    ),
  }
];

export const automationFAQs: FAQItem[] = [
  {
    number: 1,
    icon: CheckCircle,
    title: "Why Should I Care?",
    content: (
      <div className="space-y-4">
        <p className="text-muted-foreground leading-relaxed">
          Manual processes waste time, create errors, and limit scalability. Automation runs your business 24/7 with perfect consistency, freeing your team for high-value work.
        </p>
        <div className="bg-muted/50 rounded-lg p-4 space-y-2">
          <h4 className="font-semibold text-foreground">Key Problems We Solve:</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
              <span>Repetitive tasks consuming staff time</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
              <span>Human errors in data entry and processing</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
              <span>Inability to scale without hiring more people</span>
            </li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    number: 2,
    icon: Zap,
    title: "What Can Be Automated?",
    content: (
      <div className="space-y-4">
        <p className="text-muted-foreground leading-relaxed">
          Lead nurturing, data sync between tools, invoice generation, appointment reminders, social media posting, reporting, customer onboarding, and virtually any repetitive workflow.
        </p>
      </div>
    ),
  },
  {
    number: 3,
    icon: TrendingUp,
    title: "What's the ROI?",
    content: (
      <div className="space-y-4">
        <p className="text-muted-foreground leading-relaxed">
          Most clients save 20-40 hours per week and eliminate 95% of process errors, typically seeing ROI within 30 days.
        </p>
      </div>
    ),
  }
];

export const copywritingFAQs: FAQItem[] = [
  {
    number: 1,
    icon: CheckCircle,
    title: "Why Should I Care?",
    content: (
      <div className="space-y-4">
        <p className="text-muted-foreground leading-relaxed">
          Poor copy costs you customers. Professional, conversion-focused copy can 2-3x your conversion rates across all marketing channels.
        </p>
        <div className="bg-muted/50 rounded-lg p-4 space-y-2">
          <h4 className="font-semibold text-foreground">Key Problems We Solve:</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
              <span>Generic messaging that doesn't resonate</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
              <span>Weak calls-to-action and value propositions</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
              <span>Inconsistent brand voice across channels</span>
            </li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    number: 2,
    icon: FileText,
    title: "What Types of Copy Do You Write?",
    content: (
      <div className="space-y-4">
        <p className="text-muted-foreground leading-relaxed">
          Sales pages, email sequences, ad copy, landing pages, product descriptions, website content, social media posts, and video scripts.
        </p>
      </div>
    ),
  },
  {
    number: 3,
    icon: TrendingUp,
    title: "What Results Can I Expect?",
    content: (
      <div className="space-y-4">
        <p className="text-muted-foreground leading-relaxed">
          Clients typically see 2-3x improvements in conversion rates, with some campaigns achieving 5x+ increases after professional copy optimization.
        </p>
      </div>
    ),
  }
];

export const funnelWebsiteFAQs: FAQItem[] = [
  {
    number: 1,
    icon: CheckCircle,
    title: "Why Should I Care?",
    content: (
      <div className="space-y-4">
        <p className="text-muted-foreground leading-relaxed">
          Your website is often the first impression. A professionally designed, conversion-optimized site can increase sales by 200-400% compared to DIY templates.
        </p>
        <div className="bg-muted/50 rounded-lg p-4 space-y-2">
          <h4 className="font-semibold text-foreground">Key Problems We Solve:</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
              <span>Low conversion rates from traffic</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
              <span>Confusing navigation and poor user experience</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
              <span>Slow loading times and mobile issues</span>
            </li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    number: 2,
    icon: Palette,
    title: "What's Included in the Design?",
    content: (
      <div className="space-y-4">
        <p className="text-muted-foreground leading-relaxed">
          Custom design, mobile optimization, SEO foundation, fast hosting setup, analytics integration, and conversion rate optimization (CRO) elements.
        </p>
      </div>
    ),
  },
  {
    number: 3,
    icon: Clock,
    title: "How Long Does It Take?",
    content: (
      <div className="space-y-4">
        <p className="text-muted-foreground leading-relaxed">
          Most funnels and websites launch within 5-10 business days, depending on complexity and content readiness.
        </p>
      </div>
    ),
  }
];

// Add similar FAQ sets for other services...
export const graphicDesignFAQs: FAQItem[] = [
  {
    number: 1,
    icon: Palette,
    title: "Why Professional Design Matters",
    content: (
      <div className="space-y-4">
        <p className="text-muted-foreground leading-relaxed">
          People judge your brand in milliseconds. Professional design builds credibility, increases engagement by 80%, and directly impacts purchasing decisions.
        </p>
      </div>
    ),
  },
  {
    number: 2,
    icon: Clock,
    title: "Turnaround Time",
    content: (
      <div className="space-y-4">
        <p className="text-muted-foreground leading-relaxed">
          Most projects delivered within 24-48 hours. Rush projects available. Unlimited revisions until you're satisfied.
        </p>
      </div>
    ),
  },
  {
    number: 3,
    icon: Package,
    title: "What File Formats?",
    content: (
      <div className="space-y-4">
        <p className="text-muted-foreground leading-relaxed">
          All source files plus print-ready PDFs, web-optimized PNGs/JPGs, and vector formats (AI, EPS, SVG) for maximum flexibility.
        </p>
      </div>
    ),
  }
];

export const prospectOutreachFAQs: FAQItem[] = [
  {
    number: 1,
    icon: MessageSquare,
    title: "Why Automated Outreach?",
    content: (
      <div className="space-y-4">
        <p className="text-muted-foreground leading-relaxed">
          Manual prospecting limits you to 20-30 contacts per day. Our AI-powered system reaches 1,000+ qualified prospects monthly with personalized messaging.
        </p>
      </div>
    ),
  },
  {
    number: 2,
    icon: TrendingUp,
    title: "Response Rates",
    content: (
      <div className="space-y-4">
        <p className="text-muted-foreground leading-relaxed">
          Clients average 30-40% open rates and 10-15% response rates with our AI-personalized campaigns across email and LinkedIn.
        </p>
      </div>
    ),
  },
  {
    number: 3,
    icon: CheckCircle,
    title: "Is It Compliant?",
    content: (
      <div className="space-y-4">
        <p className="text-muted-foreground leading-relaxed">
          100% CAN-SPAM and GDPR compliant. We handle unsubscribes, maintain proper opt-out lists, and follow all platform policies.
        </p>
      </div>
    ),
  }
];

export const slidedecksFAQs: FAQItem[] = [
  {
    number: 1,
    icon: Presentation,
    title: "Why Professional Slides?",
    content: (
      <div className="space-y-4">
        <p className="text-muted-foreground leading-relaxed">
          Your presentation represents your brand and expertise. Professional slides increase audience engagement by 67% and improve message retention.
        </p>
      </div>
    ),
  },
  {
    number: 2,
    icon: Palette,
    title: "What's Included?",
    content: (
      <div className="space-y-4">
        <p className="text-muted-foreground leading-relaxed">
          Custom-branded design, data visualization, animations, editable PowerPoint/Google Slides files, and presenter notes.
        </p>
      </div>
    ),
  },
  {
    number: 3,
    icon: Clock,
    title: "Delivery Time",
    content: (
      <div className="space-y-4">
        <p className="text-muted-foreground leading-relaxed">
          Standard delivery in 2-3 business days. Rush service available for presentations needed within 24 hours.
        </p>
      </div>
    ),
  }
];

export const socialMediaFAQs: FAQItem[] = [
  {
    number: 1,
    icon: Share2,
    title: "Why Outsource Social Media?",
    content: (
      <div className="space-y-4">
        <p className="text-muted-foreground leading-relaxed">
          Consistent social media presence requires 15-20 hours weekly. Our team handles content creation, scheduling, and engagement so you can focus on your business.
        </p>
      </div>
    ),
  },
  {
    number: 2,
    icon: TrendingUp,
    title: "What Results to Expect?",
    content: (
      <div className="space-y-4">
        <p className="text-muted-foreground leading-relaxed">
          Clients see 3-5x engagement increase within 90 days, with steady follower growth and improved brand awareness.
        </p>
      </div>
    ),
  },
  {
    number: 3,
    icon: MessageSquare,
    title: "What Platforms?",
    content: (
      <div className="space-y-4">
        <p className="text-muted-foreground leading-relaxed">
          Facebook, Instagram, LinkedIn, Twitter/X, TikTok, YouTube. We customize strategy based on where your audience is most active.
        </p>
      </div>
    ),
  }
];

export const videoEditingFAQs: FAQItem[] = [
  {
    number: 1,
    icon: Video,
    title: "Why Professional Editing?",
    content: (
      <div className="space-y-4">
        <p className="text-muted-foreground leading-relaxed">
          Video content gets 1200% more shares than text and images combined. Professional editing ensures your message is clear, engaging, and on-brand.
        </p>
      </div>
    ),
  },
  {
    number: 2,
    icon: Sparkles,
    title: "What's Included?",
    content: (
      <div className="space-y-4">
        <p className="text-muted-foreground leading-relaxed">
          Color correction, sound design, motion graphics, captions, music licensing, and platform-optimized exports (YouTube, Instagram, TikTok, etc.).
        </p>
      </div>
    ),
  },
  {
    number: 3,
    icon: Clock,
    title: "Turnaround Time",
    content: (
      <div className="space-y-4">
        <p className="text-muted-foreground leading-relaxed">
          Simple edits: 24-48 hours. Complex projects with graphics and effects: 3-5 business days.
        </p>
      </div>
    ),
  }
];

export const vslFAQs: FAQItem[] = [
  {
    number: 1,
    icon: Video,
    title: "What is a VSL?",
    content: (
      <div className="space-y-4">
        <p className="text-muted-foreground leading-relaxed">
          A Video Sales Letter is a persuasive video designed to sell your product/service. VSLs convert 5-10% of cold traffic compared to 1-2% for traditional pages.
        </p>
      </div>
    ),
  },
  {
    number: 2,
    icon: FileText,
    title: "Full Production Included?",
    content: (
      <div className="space-y-4">
        <p className="text-muted-foreground leading-relaxed">
          Yes! Script writing using proven frameworks, voiceover recording, video editing, graphics, music, and final delivery in all needed formats.
        </p>
      </div>
    ),
  },
  {
    number: 3,
    icon: TrendingUp,
    title: "Expected Conversion Rate?",
    content: (
      <div className="space-y-4">
        <p className="text-muted-foreground leading-relaxed">
          Well-crafted VSLs typically achieve 5-10% conversion rates on cold traffic, with some campaigns reaching 15%+ after optimization.
        </p>
      </div>
    ),
  }
];

export const aiEmployeeFAQs: FAQItem[] = [
  {
    number: 1,
    icon: Bot,
    title: "What is an AI Employee?",
    content: (
      <div className="space-y-4">
        <p className="text-muted-foreground leading-relaxed">
          A custom AI assistant trained on your business to handle customer service, sales calls, appointment booking, and more—working 24/7 without breaks.
        </p>
      </div>
    ),
  },
  {
    number: 2,
    icon: Sparkles,
    title: "What Can It Do?",
    content: (
      <div className="space-y-4">
        <p className="text-muted-foreground leading-relaxed">
          Answer FAQs, qualify leads, book appointments, process orders, provide product recommendations, handle support tickets, and follow up with customers.
        </p>
      </div>
    ),
  },
  {
    number: 3,
    icon: TrendingUp,
    title: "ROI and Cost Savings?",
    content: (
      <div className="space-y-4">
        <p className="text-muted-foreground leading-relaxed">
          Replace the cost of 2-3 full-time employees while providing instant 24/7 service. Most clients see ROI within 30 days.
        </p>
      </div>
    ),
  }
];

export const integrationFAQs: FAQItem[] = [
  {
    number: 1,
    icon: Plug,
    title: "Why Integration Matters?",
    content: (
      <div className="space-y-4">
        <p className="text-muted-foreground leading-relaxed">
          Disconnected tools create data silos and manual work. Integrations automate data flow, eliminate double-entry, and give you a single source of truth.
        </p>
      </div>
    ),
  },
  {
    number: 2,
    icon: Database,
    title: "What Can You Connect?",
    content: (
      <div className="space-y-4">
        <p className="text-muted-foreground leading-relaxed">
          CRMs, payment processors, email platforms, calendars, e-commerce, marketing tools—over 1,000+ apps. Custom API integrations for unique needs.
        </p>
      </div>
    ),
  },
  {
    number: 3,
    icon: Clock,
    title: "Setup Time?",
    content: (
      <div className="space-y-4">
        <p className="text-muted-foreground leading-relaxed">
          Simple integrations: 1-2 days. Complex multi-platform setups: 5-7 days. All include testing and documentation.
        </p>
      </div>
    ),
  }
];

export const migrationFAQs: FAQItem[] = [
  {
    number: 1,
    icon: Database,
    title: "Why Professional Migration?",
    content: (
      <div className="space-y-4">
        <p className="text-muted-foreground leading-relaxed">
          DIY migrations risk data loss, downtime, and broken integrations. Our team ensures 100% data integrity with zero business disruption.
        </p>
      </div>
    ),
  },
  {
    number: 2,
    icon: Shield,
    title: "Is My Data Safe?",
    content: (
      <div className="space-y-4">
        <p className="text-muted-foreground leading-relaxed">
          All data transfers are encrypted. We maintain backups throughout the process and never delete source data until you confirm success.
        </p>
      </div>
    ),
  },
  {
    number: 3,
    icon: Clock,
    title: "Downtime Expected?",
    content: (
      <div className="space-y-4">
        <p className="text-muted-foreground leading-relaxed">
          Zero downtime for most migrations. We work during off-hours and use parallel running to ensure seamless transition.
        </p>
      </div>
    ),
  }
];

export const getFAQsByServiceSlug = (slug: string): FAQItem[] => {
  const faqMap: Record<string, FAQItem[]> = {
    "paid-ads": paidAdsFAQs,
    "administrative-services": administrativeFAQs,
    "automation": automationFAQs,
    "copywriting": copywritingFAQs,
    "funnel-website-design": funnelWebsiteFAQs,
    "graphic-design": graphicDesignFAQs,
    "prospect-outreach": prospectOutreachFAQs,
    "slide-decks": slidedecksFAQs,
    "social-media-management": socialMediaFAQs,
    "video-editing": videoEditingFAQs,
    "vsl-creation": vslFAQs,
    "ai-employee": aiEmployeeFAQs,
    "integration-services": integrationFAQs,
    "migration-services": migrationFAQs,
  };

  return faqMap[slug] || paidAdsFAQs;
};