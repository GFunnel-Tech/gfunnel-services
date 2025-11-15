import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { FAQItem } from "@/lib/serviceFAQs";

interface ServiceFAQProps {
  faqs: FAQItem[];
}

export const ServiceFAQ = ({ faqs }: ServiceFAQProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <Badge variant="secondary" className="mb-4">
          Frequently Asked Questions
        </Badge>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground">
          Everything You Need to Know
        </h2>
      </div>

      <Accordion type="single" collapsible className="w-full space-y-4">
        {faqs.map((item) => {
          const Icon = item.icon;
          return (
            <AccordionItem
              key={item.number}
              value={`item-${item.number}`}
              className="border border-border rounded-lg px-6 bg-card hover:bg-accent/5 transition-colors"
            >
              <AccordionTrigger className="hover:no-underline py-6">
                <div className="flex items-center gap-4 text-left">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 shrink-0">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">
                      Question {item.number}
                    </div>
                    <div className="font-semibold text-foreground">
                      {item.title}
                    </div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-2 pb-6 pl-14">
                {item.content}
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
};