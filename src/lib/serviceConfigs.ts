import { LucideIcon, Shield, Settings, FileText, Palette, DollarSign, MessageSquare, Presentation, Share2, Video, Sparkles, Plug, Database, Bot } from "lucide-react";

export interface ServiceStat {
  value: string;
  label: string;
}

export interface ServiceFeature {
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface ServiceVideo {
  id: string;
  title: string;
  thumbnail: string;
  embedUrl: string;
}

export interface QuickActionContent {
  statValue: string;
  statLabel: string;
  description: string;
}

export interface ServiceConfig {
  slug: string;
  name: string;
  title: string;
  badgeText: string;
  badgeIcon: LucideIcon;
  description: string;
  stats: ServiceStat[];
  features: ServiceFeature[];
  videos: ServiceVideo[];
  onboardingUrl: string;
  discoveryUrl: string;
  relatedServices: string[];
  quickActionContent?: QuickActionContent;
}

// Default videos - can be customized per service
const defaultVideos: ServiceVideo[] = [
  {
    id: "video1",
    title: "Service Overview",
    thumbnail: "https://img.youtube.com/vi/0nI1JjB43BI/maxresdefault.jpg",
    embedUrl: "https://www.youtube.com/embed/0nI1JjB43BI"
  },
  {
    id: "video2",
    title: "Features Demo",
    thumbnail: "https://img.youtube.com/vi/iVoFm1886Go/maxresdefault.jpg",
    embedUrl: "https://www.youtube.com/embed/iVoFm1886Go"
  },
  {
    id: "video3",
    title: "Case Study",
    thumbnail: "https://img.youtube.com/vi/y4fFta7C7Uc/maxresdefault.jpg",
    embedUrl: "https://www.youtube.com/embed/y4fFta7C7Uc"
  }
];

export const serviceConfigs: Record<string, ServiceConfig> = {
  "paid-ads": {
    slug: "paid-ads",
    name: "Paid Ads Management",
    title: "Paid Advertisement",
    badgeText: "AI Enhanced",
    badgeIcon: Shield,
    description: "Strategic launch your business campaigns powered by AI-driven lead response in under 5 minutes",
    stats: [
      { value: "3-5x", label: "Avg ROAS" },
      { value: "<5min", label: "Response" },
      { value: "24/7", label: "AI Support" }
    ],
    features: [
      { icon: Shield, title: "Multi-Platform", description: "Facebook & Google optimized" },
      { icon: Sparkles, title: "AI-Powered", description: "Automated lead response" },
      { icon: Shield, title: "5-Min Response", description: "Voice AI calls instantly" }
    ],
    videos: defaultVideos,
    onboardingUrl: "https://onboarding.gfunnel.com/paid-advertisement",
    discoveryUrl: "https://www.gfunnel.com/discover?services=paid-advertisement",
    relatedServices: ["social-media-management", "funnel-website-design", "copywriting"],
    quickActionContent: {
      statValue: "24/7",
      statLabel: "AI Support",
      description: "Get started today and see leads within 48 hours"
    }
  },
  
  "administrative-services": {
    slug: "administrative-services",
    name: "Administrative Services",
    title: "Administrative Services",
    badgeText: "Streamlined Operations",
    badgeIcon: Settings,
    description: "Professional administrative support to streamline your operations and free up your time for strategic work",
    stats: [
      { value: "40%", label: "Time Saved" },
      { value: "24/7", label: "Support" },
      { value: "99%", label: "Accuracy" }
    ],
    features: [
      { icon: Settings, title: "Task Management", description: "Efficient scheduling & organization" },
      { icon: FileText, title: "Documentation", description: "Professional record keeping" },
      { icon: Shield, title: "Secure", description: "Confidential data handling" }
    ],
    videos: [
      {
        id: "video1",
        title: "Administrative Services Overview",
        thumbnail: "https://img.youtube.com/vi/V5kCFv5b4VY/maxresdefault.jpg",
        embedUrl: "https://www.youtube.com/embed/V5kCFv5b4VY"
      },
      {
        id: "video2",
        title: "Features & Benefits",
        thumbnail: "https://img.youtube.com/vi/mhbXN_noOb0/maxresdefault.jpg",
        embedUrl: "https://www.youtube.com/embed/mhbXN_noOb0"
      },
      {
        id: "video3",
        title: "Service Demonstration",
        thumbnail: "https://img.youtube.com/vi/atq2fORTtEs/maxresdefault.jpg",
        embedUrl: "https://www.youtube.com/embed/atq2fORTtEs"
      }
    ],
    onboardingUrl: "https://onboarding.gfunnel.com/administrative-services",
    discoveryUrl: "https://www.gfunnel.com/discover?services=administrative-services",
    relatedServices: ["automation", "integration-services", "migration-services"],
    quickActionContent: {
      statValue: "40%",
      statLabel: "Time Freed",
      description: "Start delegating tasks today"
    }
  },

  "automation": {
    slug: "automation",
    name: "Automation Creation",
    title: "Automation Creation",
    badgeText: "AI Powered",
    badgeIcon: Sparkles,
    description: "Build intelligent workflows that run your business on autopilot, saving time and reducing errors",
    stats: [
      { value: "80%", label: "Time Saved" },
      { value: "10x", label: "Faster" },
      { value: "24/7", label: "Running" }
    ],
    features: [
      { icon: Sparkles, title: "Smart Workflows", description: "AI-driven automation" },
      { icon: Plug, title: "Integrations", description: "Connect all your tools" },
      { icon: Bot, title: "Custom Bots", description: "Tailored to your needs" }
    ],
    videos: [
      {
        id: "video1",
        title: "Automation Creation Overview",
        thumbnail: "https://img.youtube.com/vi/MM20QXEGdAc/maxresdefault.jpg",
        embedUrl: "https://www.youtube.com/embed/MM20QXEGdAc"
      },
      {
        id: "video2",
        title: "Features & Benefits",
        thumbnail: "https://img.youtube.com/vi/xV-bOHvfbPQ/maxresdefault.jpg",
        embedUrl: "https://www.youtube.com/embed/xV-bOHvfbPQ"
      },
      {
        id: "video3",
        title: "Service Demonstration",
        thumbnail: "https://img.youtube.com/vi/nMGnEoSM9vY/maxresdefault.jpg",
        embedUrl: "https://www.youtube.com/embed/nMGnEoSM9vY"
      }
    ],
    onboardingUrl: "https://onboarding.gfunnel.com/automation-creation",
    discoveryUrl: "https://www.gfunnel.com/discover?services=automation-creation",
    relatedServices: ["integration-services", "ai-employee", "administrative-services"],
    quickActionContent: {
      statValue: "80%",
      statLabel: "Time Saved",
      description: "Automate repetitive tasks and focus on growth"
    }
  },

  "copywriting": {
    slug: "copywriting",
    name: "Copywriting",
    title: "Professional Copywriting",
    badgeText: "Conversion Focused",
    badgeIcon: FileText,
    description: "Compelling copy that converts browsers into buyers with proven messaging frameworks",
    stats: [
      { value: "2-3x", label: "Conversion" },
      { value: "48hrs", label: "Delivery" },
      { value: "100%", label: "Original" }
    ],
    features: [
      { icon: FileText, title: "Sales Copy", description: "High-converting content" },
      { icon: MessageSquare, title: "Email Sequences", description: "Nurture campaigns" },
      { icon: Sparkles, title: "AI Enhanced", description: "Data-driven messaging" }
    ],
    videos: defaultVideos,
    onboardingUrl: "https://onboarding.gfunnel.com/copywriting",
    discoveryUrl: "https://www.gfunnel.com/discover?services=copywriting",
    relatedServices: ["slide-decks", "funnel-website-design", "paid-ads"],
    quickActionContent: {
      statValue: "48hrs",
      statLabel: "Delivery",
      description: "Get compelling copy that converts"
    }
  },

  "funnel-website-design": {
    slug: "funnel-website-design",
    name: "Funnel & Website Design",
    title: "Funnel & Website Design",
    badgeText: "Conversion Optimized",
    badgeIcon: Palette,
    description: "High-converting funnels and websites designed to turn visitors into customers",
    stats: [
      { value: "3-5x", label: "Conversion" },
      { value: "5 Days", label: "Launch" },
      { value: "Mobile", label: "Optimized" }
    ],
    features: [
      { icon: Palette, title: "Custom Design", description: "Branded & beautiful" },
      { icon: Shield, title: "Fast Loading", description: "Optimized performance" },
      { icon: Sparkles, title: "CRO Built-in", description: "Conversion focused" }
    ],
    videos: defaultVideos,
    onboardingUrl: "https://onboarding.gfunnel.com/funnel-website-design",
    discoveryUrl: "https://www.gfunnel.com/discover?services=funnel-website-design",
    relatedServices: ["paid-ads", "copywriting", "graphic-design"],
    quickActionContent: {
      statValue: "5 Days",
      statLabel: "To Launch",
      description: "Your high-converting funnel, delivered fast"
    }
  },

  "graphic-design": {
    slug: "graphic-design",
    name: "Graphic Design",
    title: "Professional Graphic Design",
    badgeText: "Brand Focused",
    badgeIcon: Palette,
    description: "Eye-catching designs that capture attention and communicate your brand message effectively",
    stats: [
      { value: "24-48hr", label: "Turnaround" },
      { value: "Unlimited", label: "Revisions" },
      { value: "All Formats", label: "Files" }
    ],
    features: [
      { icon: Palette, title: "Brand Assets", description: "Logos, banners, graphics" },
      { icon: FileText, title: "Print Ready", description: "High-resolution files" },
      { icon: Sparkles, title: "Modern Style", description: "On-trend designs" }
    ],
    videos: defaultVideos,
    onboardingUrl: "https://onboarding.gfunnel.com/graphic-design",
    discoveryUrl: "https://www.gfunnel.com/discover?services=graphic-design",
    relatedServices: ["slide-decks", "social-media-management", "funnel-website-design"],
    quickActionContent: {
      statValue: "24-48hr",
      statLabel: "Turnaround",
      description: "Professional designs delivered quickly"
    }
  },

  "prospect-outreach": {
    slug: "prospect-outreach",
    name: "Prospect Outreach",
    title: "Prospect Outreach",
    badgeText: "AI Powered",
    badgeIcon: MessageSquare,
    description: "Automated prospecting campaigns that fill your pipeline with qualified leads",
    stats: [
      { value: "40%", label: "Response Rate" },
      { value: "1000+", label: "Contacts/mo" },
      { value: "24/7", label: "Outreach" }
    ],
    features: [
      { icon: MessageSquare, title: "Multi-Channel", description: "Email, LinkedIn, SMS" },
      { icon: Bot, title: "AI Personalization", description: "Tailored messaging" },
      { icon: Shield, title: "Compliance", description: "CAN-SPAM compliant" }
    ],
    videos: defaultVideos,
    onboardingUrl: "https://onboarding.gfunnel.com/prospect-outreach",
    discoveryUrl: "https://www.gfunnel.com/discover?services=prospect-outreach",
    relatedServices: ["automation", "ai-employee", "copywriting"],
    quickActionContent: {
      statValue: "1000+",
      statLabel: "Contacts/Month",
      description: "Start filling your pipeline with qualified leads"
    }
  },

  "slide-decks": {
    slug: "slide-decks",
    name: "Slide Decks",
    title: "Professional Slide Decks",
    badgeText: "Presentation Ready",
    badgeIcon: Presentation,
    description: "Stunning presentations that engage audiences and communicate your message with impact",
    stats: [
      { value: "24-48hr", label: "Delivery" },
      { value: "Custom", label: "Branded" },
      { value: "Editable", label: "Formats" }
    ],
    features: [
      { icon: Presentation, title: "Sales Decks", description: "Persuasive presentations" },
      { icon: Palette, title: "Custom Design", description: "Your brand, elevated" },
      { icon: FileText, title: "Storytelling", description: "Compelling narratives" }
    ],
    videos: defaultVideos,
    onboardingUrl: "https://onboarding.gfunnel.com/slide-decks",
    discoveryUrl: "https://www.gfunnel.com/discover?services=slide-decks",
    relatedServices: ["copywriting", "graphic-design", "vsl-creation"],
    quickActionContent: {
      statValue: "24-48hr",
      statLabel: "Delivery",
      description: "Stunning presentations, ready fast"
    }
  },

  "social-media-management": {
    slug: "social-media-management",
    name: "Social Media Management",
    title: "Social Media Management",
    badgeText: "Content Strategy",
    badgeIcon: Share2,
    description: "Strategic social media presence that builds community and drives engagement",
    stats: [
      { value: "3-5x", label: "Engagement" },
      { value: "Daily", label: "Posting" },
      { value: "Multi", label: "Platform" }
    ],
    features: [
      { icon: Share2, title: "Content Creation", description: "Posts, stories, reels" },
      { icon: MessageSquare, title: "Community Mgmt", description: "Engage your audience" },
      { icon: Sparkles, title: "Analytics", description: "Performance tracking" }
    ],
    videos: defaultVideos,
    onboardingUrl: "https://onboarding.gfunnel.com/social-media-management",
    discoveryUrl: "https://www.gfunnel.com/discover?services=social-media-management",
    relatedServices: ["paid-ads", "graphic-design", "video-editing"],
    quickActionContent: {
      statValue: "Daily",
      statLabel: "Engagement",
      description: "Build your audience and drive organic traffic"
    }
  },

  "video-editing": {
    slug: "video-editing",
    name: "Video Editing",
    title: "Professional Video Editing",
    badgeText: "Cinematic Quality",
    badgeIcon: Video,
    description: "Professional video editing that captivates audiences and delivers your message powerfully",
    stats: [
      { value: "2-3 Days", label: "Turnaround" },
      { value: "4K", label: "Quality" },
      { value: "All", label: "Platforms" }
    ],
    features: [
      { icon: Video, title: "Pro Editing", description: "Color, sound, effects" },
      { icon: Sparkles, title: "Motion Graphics", description: "Animations & titles" },
      { icon: FileText, title: "Optimized", description: "For each platform" }
    ],
    videos: defaultVideos,
    onboardingUrl: "https://onboarding.gfunnel.com/video-editing",
    discoveryUrl: "https://www.gfunnel.com/discover?services=video-editing",
    relatedServices: ["vsl-creation", "social-media-management", "graphic-design"],
    quickActionContent: {
      statValue: "2-3 Days",
      statLabel: "Turnaround",
      description: "Professional edits delivered on time"
    }
  },

  "vsl-creation": {
    slug: "vsl-creation",
    name: "VSL Creation",
    title: "Video Sales Letter Creation",
    badgeText: "High Converting",
    badgeIcon: Video,
    description: "Persuasive video sales letters that convert cold traffic into paying customers",
    stats: [
      { value: "5-10%", label: "Conversion" },
      { value: "Script+Edit", label: "Complete" },
      { value: "Proven", label: "Framework" }
    ],
    features: [
      { icon: Video, title: "Full Production", description: "Script to final cut" },
      { icon: FileText, title: "Copywriting", description: "Proven formulas" },
      { icon: Sparkles, title: "CRO Tested", description: "Optimized for sales" }
    ],
    videos: defaultVideos,
    onboardingUrl: "https://onboarding.gfunnel.com/vsl-creation",
    discoveryUrl: "https://www.gfunnel.com/discover?services=vsl-creation",
    relatedServices: ["copywriting", "video-editing", "paid-ads"],
    quickActionContent: {
      statValue: "Proven",
      statLabel: "Framework",
      description: "High-converting video sales letters"
    }
  },

  "ai-employee": {
    slug: "ai-employee",
    name: "AI Employee Creation",
    title: "AI Employee Creation",
    badgeText: "Next Generation",
    badgeIcon: Bot,
    description: "Custom AI assistants that work 24/7 to handle tasks and serve your customers",
    stats: [
      { value: "24/7", label: "Available" },
      { value: "90%", label: "Automation" },
      { value: "Instant", label: "Response" }
    ],
    features: [
      { icon: Bot, title: "Custom AI", description: "Tailored to your business" },
      { icon: MessageSquare, title: "Multi-Task", description: "Support, sales, service" },
      { icon: Sparkles, title: "Learning", description: "Gets smarter over time" }
    ],
    videos: defaultVideos,
    onboardingUrl: "https://onboarding.gfunnel.com/ai-employee-creation",
    discoveryUrl: "https://www.gfunnel.com/discover?services=ai-employee-creation",
    relatedServices: ["automation", "integration-services", "prospect-outreach"],
    quickActionContent: {
      statValue: "24/7",
      statLabel: "AI Working",
      description: "Your AI employee starts working immediately"
    }
  },

  "integration-services": {
    slug: "integration-services",
    name: "Integration Services",
    title: "Integration Services",
    badgeText: "Seamless Connection",
    badgeIcon: Plug,
    description: "Connect all your tools and platforms for seamless data flow and automation",
    stats: [
      { value: "1000+", label: "Apps" },
      { value: "Fast", label: "Setup" },
      { value: "Secure", label: "Sync" }
    ],
    features: [
      { icon: Plug, title: "API Integration", description: "Connect any platform" },
      { icon: Database, title: "Data Sync", description: "Real-time updates" },
      { icon: Shield, title: "Secure", description: "Encrypted connections" }
    ],
    videos: defaultVideos,
    onboardingUrl: "https://onboarding.gfunnel.com/integration-services",
    discoveryUrl: "https://www.gfunnel.com/discover?services=integration-services",
    relatedServices: ["automation", "migration-services", "administrative-services"],
    quickActionContent: {
      statValue: "1000+",
      statLabel: "Apps",
      description: "Connect your tools within 24-48 hours"
    }
  },

  "migration-services": {
    slug: "migration-services",
    name: "Migration Services",
    title: "Migration Services",
    badgeText: "Zero Downtime",
    badgeIcon: Database,
    description: "Seamless platform migrations with zero data loss and minimal downtime",
    stats: [
      { value: "100%", label: "Data Integrity" },
      { value: "Zero", label: "Downtime" },
      { value: "Expert", label: "Support" }
    ],
    features: [
      { icon: Database, title: "Data Transfer", description: "Complete migration" },
      { icon: Shield, title: "Secure Process", description: "Encrypted transfer" },
      { icon: Settings, title: "Setup & Config", description: "Full configuration" }
    ],
    videos: defaultVideos,
    onboardingUrl: "https://onboarding.gfunnel.com/migration-services",
    discoveryUrl: "https://www.gfunnel.com/discover?services=migration-services",
    relatedServices: ["integration-services", "automation", "administrative-services"],
    quickActionContent: {
      statValue: "Zero",
      statLabel: "Downtime",
      description: "Seamless migration with full data integrity"
    }
  }
};

export const getAllServices = () => Object.values(serviceConfigs);

export const getServiceBySlug = (slug: string) => serviceConfigs[slug];