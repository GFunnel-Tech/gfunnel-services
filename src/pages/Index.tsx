import { getAllServices } from "@/lib/serviceConfigs";
import { ServiceCard } from "@/components/ServiceCard";
import { Navigation } from "@/components/Navigation";
import { HomeFAQ } from "@/components/HomeFAQ";
import { HomeCTA } from "@/components/HomeCTA";

const Index = () => {
  const services = getAllServices();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative py-16 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-background to-background" />
        <div className="container mx-auto relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <h1 className="text-3xl md:text-5xl font-bold text-foreground tracking-tight">
              Choose Your Growth Service
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Professional marketing, design, and automation services to scale your business. 
              Select a service below to learn more and get started.
            </p>
          </div>
        </div>
      </section>

      {/* Service Directory */}
      <section className="py-8 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {services.map((service) => (
              <ServiceCard key={service.slug} service={service} />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <HomeFAQ />

      {/* CTA Section */}
      <HomeCTA />

    </div>
  );
};

export default Index;