import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const HomeFAQ = () => {
  return (
    <section className="py-12 px-4 bg-muted/30">
      <div className="container mx-auto max-w-3xl">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground">
            Everything you need to know about our services
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-3">
          <AccordionItem value="item-1" className="bg-card rounded-lg px-5 border-border shadow-sm">
            <AccordionTrigger className="text-left hover:no-underline text-sm font-medium">
              How do I get started with GFunnel services?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground text-sm">
              Getting started is simple! Choose the service that fits your needs, click "Get Started" 
              to create your account, and our team will guide you through the onboarding process. 
              You can also schedule a discovery call to discuss your specific requirements.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2" className="bg-card rounded-lg px-5 border-border shadow-sm">
            <AccordionTrigger className="text-left hover:no-underline text-sm font-medium">
              Can I use multiple services together?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground text-sm">
              Absolutely! Many of our clients combine multiple services for maximum impact. 
              For example, you might pair Paid Ads with Funnel Design, or Social Media Management 
              with Copywriting. Our services are designed to work seamlessly together.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3" className="bg-card rounded-lg px-5 border-border shadow-sm">
            <AccordionTrigger className="text-left hover:no-underline text-sm font-medium">
              What's included in each service?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground text-sm">
              Each service page provides detailed information about what's included, deliverables, 
              and timelines. Generally, all services include dedicated account management, regular 
              reporting, and ongoing optimization.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4" className="bg-card rounded-lg px-5 border-border shadow-sm">
            <AccordionTrigger className="text-left hover:no-underline text-sm font-medium">
              How quickly can I see results?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground text-sm">
              Results vary by service and your specific goals. Some services like Paid Ads can 
              generate leads within 48 hours of launch, while others like SEO build momentum 
              over weeks and months.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-5" className="bg-card rounded-lg px-5 border-border shadow-sm">
            <AccordionTrigger className="text-left hover:no-underline text-sm font-medium">
              What if I need help choosing a service?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground text-sm">
              We're here to help! Schedule a free discovery call with our team, and we'll discuss 
              your business goals, current challenges, and budget. There's no obligation.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  );
};