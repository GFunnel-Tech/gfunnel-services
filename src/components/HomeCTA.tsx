import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar } from "lucide-react";

export const HomeCTA = () => {
  return (
    <section className="py-20 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10" />
      
      <div className="container mx-auto max-w-4xl relative z-10">
        <div className="text-center space-y-6">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground">
            Ready to Grow Your Business?
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Join hundreds of successful businesses using GFunnel to scale their growth. 
            Get started today or schedule a free discovery call to learn more.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button 
              size="lg" 
              className="text-base px-8"
              asChild
            >
              <a href="https://www.gfunnel.com/create-account" target="_parent" rel="noopener noreferrer">
                Create Your Account
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
            
            <Button 
              size="lg" 
              variant="outline"
              className="text-base px-8 border-2"
              asChild
            >
              <a href="https://www.gfunnel.com/discover" target="_parent" rel="noopener noreferrer">
                <Calendar className="mr-2 h-5 w-5" />
                Schedule a Discovery Call
              </a>
            </Button>
          </div>

          <p className="text-sm text-muted-foreground pt-4">
            No credit card required • Free consultation • 24/7 support
          </p>
        </div>
      </div>
    </section>
  );
};
