import { useParams, Navigate } from "react-router-dom";
import { ServiceHero } from "@/components/ServiceHero";
import { ServiceFAQ } from "@/components/ServiceFAQ";
import { QuickActions } from "@/components/QuickActions";
import { SocialMediaCTA } from "@/components/SocialMediaCTA";
import { getServiceBySlug } from "@/lib/serviceConfigs";
import { getFAQsByServiceSlug } from "@/lib/serviceFAQs";
import { Navigation } from "@/components/Navigation";

const ServicePage = () => {
  const { slug } = useParams<{ slug: string }>();
  
  if (!slug) {
    return <Navigate to="/" replace />;
  }

  const service = getServiceBySlug(slug);
  const faqs = getFAQsByServiceSlug(slug);

  if (!service) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      <ServiceHero service={service} />

      <div id="features-benefits" className="container mx-auto px-6 py-16 scroll-smooth-section">
        <div className="max-w-7xl mx-auto">
          {/* Quick Actions - floated right on desktop */}
          <div className="hidden lg:block float-right ml-8 mb-6 w-[300px]">
            <QuickActions 
              onboardingUrl={service.onboardingUrl}
              discoveryUrl={service.discoveryUrl}
            />
          </div>
          
          {/* FAQ Content */}
          <div className="lg:max-w-[calc(100%-340px)]">
            <ServiceFAQ faqs={faqs} />
          </div>
          
          {/* Clear float */}
          <div className="clear-both" />
        </div>
      </div>

      <SocialMediaCTA />

      {/* Mobile Quick Actions - Fixed Bottom */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4 shadow-lg z-50">
        <div className="flex gap-2">
          <a 
            href={service.onboardingUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex-1 bg-primary text-primary-foreground px-4 py-3 rounded-md font-medium text-sm text-center"
          >
            Get Started
          </a>
          <a 
            href={service.discoveryUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex-1 bg-secondary text-secondary-foreground px-4 py-3 rounded-md font-medium text-sm text-center"
          >
            Schedule Discovery
          </a>
        </div>
      </div>
    </div>
  );
};

export default ServicePage;