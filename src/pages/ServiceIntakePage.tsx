import { useParams, Navigate, Link } from "react-router-dom";
import { ServiceIntakeForm } from "@/components/ServiceIntakeForm";
import { getServiceBySlug } from "@/lib/serviceConfigs";
import { Navigation } from "@/components/Navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const ServiceIntakePage = () => {
  const { slug } = useParams<{ slug: string }>();
  
  if (!slug) {
    return <Navigate to="/" replace />;
  }

  const service = getServiceBySlug(slug);

  if (!service) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Back link */}
          <Link to={`/${slug}`}>
            <Button variant="ghost" className="mb-6 -ml-2">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to {service.name}
            </Button>
          </Link>
          
          {/* Page header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Get Started with {service.name}
            </h1>
            <p className="text-muted-foreground">
              Tell us about your project and we'll get back to you within 24 hours.
            </p>
          </div>
          
          {/* Intake Form */}
          <ServiceIntakeForm service={service} />
        </div>
      </div>
    </div>
  );
};

export default ServiceIntakePage;
