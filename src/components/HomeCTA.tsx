import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar } from "lucide-react";
import { Eyebrow } from "./ui/eyebrow";
import { GradientText } from "./ui/gradient-text";

export const HomeCTA = () => {
  return (
    <section className="py-16 md:py-24 px-4 relative overflow-hidden bg-gradient-to-br from-primary to-secondary">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTItMTZ2Mmgydi0yaC0yem0wIDR2Mmgydi0yaC0yem0wIDR2Mmgydi0yaC0yem0wIDR2Mmgydi0yaC0yem0wIDR2Mmgydi0yaC0yem0tNCAwdjJoMnYtMmgtMnptLTQgMHYyaDJ2LTJoLTJ6bS00IDB2Mmgydi0yaC0yem0tNCAwdjJoMnYtMmgtMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20"></div>
      
      <div className="container mx-auto max-w-4xl relative z-10">
        <div className="text-center space-y-6">
          <Eyebrow className="bg-white/10 border-white/20 text-white">Get Started</Eyebrow>
          
          <h2 className="text-headline text-primary-foreground">
            Ready to <GradientText>Grow</GradientText> Your Business?
          </h2>
          <p className="text-body-lg text-primary-foreground/90 max-w-2xl mx-auto">
            Join hundreds of successful businesses using GFunnel to scale their growth. 
            Get started today or schedule a free discovery call to learn more.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button 
              variant="gradient" 
              size="xl"
              asChild
            >
              <a href="https://www.gfunnel.com/create-account" target="_parent" rel="noopener noreferrer">
                Create Your Account
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
            
            <Button 
              variant="gradient-secondary"
              size="xl"
              asChild
            >
              <a href="https://www.gfunnel.com/discover" target="_parent" rel="noopener noreferrer">
                <Calendar className="mr-2 h-5 w-5" />
                Schedule a Discovery Call
              </a>
            </Button>
          </div>

          <p className="text-sm text-primary-foreground/70 pt-4 font-medium">
            No credit card required • Free consultation • 24/7 support
          </p>
        </div>
      </div>
    </section>
  );
};