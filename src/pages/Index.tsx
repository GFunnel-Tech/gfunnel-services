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
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="container mx-auto relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-accent/20 bg-accent/5">
              <span className="text-accent">🚀</span>
              <span className="text-sm font-medium tracking-widest uppercase text-accent">Service Selection Hub</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground tracking-tight">
              Choose Your Growth Service...{" "}
              <span className="gradient-text">And Start Growing</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover tailored marketing solutions for your business. Select a service below to get started with GFunnel.
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