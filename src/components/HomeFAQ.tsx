import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const HomeFAQ = () => {
  return (
    <section className="py-16 px-4 bg-muted/30">
      <div className="container mx-auto max-w-3xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground text-lg">
            Everything you need to know about our services
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-4">
          <AccordionItem value="item-1" className="bg-card rounded-lg px-6 border-border">
            <AccordionTrigger className="text-left hover:no-underline">
              How do I get started with GFunnel services?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              Getting started is simple! Choose the service that fits your needs, click "Get Started" 
              to create your account, and our team will guide you through the onboarding process. 
              You can also schedule a discovery call to discuss your specific requirements and 
              find the perfect solution for your business.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2" className="bg-card rounded-lg px-6 border-border">
            <AccordionTrigger className="text-left hover:no-underline">
              Can I use multiple services together?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              Absolutely! Many of our clients combine multiple services for maximum impact. 
              For example, you might pair Paid Ads with Funnel Design, or Social Media Management 
              with Copywriting. Our services are designed to work seamlessly together, and we can 
              create a custom package that fits your business goals and budget.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3" className="bg-card rounded-lg px-6 border-border">
            <AccordionTrigger className="text-left hover:no-underline">
              What's included in each service?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              Each service page provides detailed information about what's included, deliverables, 
              and timelines. Generally, all services include dedicated account management, regular 
              reporting, and ongoing optimization. Click on any service card to explore the full 
              details, pricing tiers, and frequently asked questions specific to that service.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4" className="bg-card rounded-lg px-6 border-border">
            <AccordionTrigger className="text-left hover:no-underline">
              How quickly can I see results?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              Results vary by service and your specific goals. Some services like Paid Ads can 
              generate leads within 48 hours of launch, while others like SEO and Social Media 
              Management build momentum over weeks and months. During your discovery call, we'll 
              set realistic expectations and create a timeline based on your objectives.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-5" className="bg-card rounded-lg px-6 border-border">
            <AccordionTrigger className="text-left hover:no-underline">
              What if I need help choosing a service?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              We're here to help! Schedule a free discovery call with our team, and we'll discuss 
              your business goals, current challenges, and budget. Based on this conversation, 
              we'll recommend the services that will have the biggest impact on your growth. 
              There's no obligation, and you'll leave with actionable insights even if you're 
              not ready to commit.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  );
};
