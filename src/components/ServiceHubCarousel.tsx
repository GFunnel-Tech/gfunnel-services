import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';

export const ServiceHubCarousel = () => {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[hsl(220,80%,55%)] via-[hsl(260,70%,50%)] to-[hsl(280,65%,45%)] p-8 md:p-12">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-1/4 w-48 h-48 bg-white/5 rounded-full blur-2xl" />
      </div>

      <div className="relative z-10">
        {/* Eyebrow */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full">
            <Sparkles className="w-4 h-4 text-white" />
            <span className="text-sm font-medium text-white">Service Hub</span>
          </div>
        </div>

        {/* Main content */}
        <div className="max-w-2xl">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
            Your On-Demand
            <br />
            Business Services
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed">
            Access expert teams across marketing, technology, operations, and more. 
            Request services, track progress, and scale your business efficiently.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-wrap gap-4">
          <Button
            id="service-hub-get-started"
            data-tour="service-hub-get-started"
            size="lg"
            className="bg-white text-primary hover:bg-white/90 font-semibold gap-2 px-6 h-12"
          >
            Get Started
            <ArrowRight className="w-5 h-5" />
          </Button>
          <a href="https://www.gfunnel.com/service-plans" target="_blank" rel="noopener noreferrer">
            <Button
              size="lg"
              variant="outline"
              className="border-white/30 bg-white/10 text-white hover:bg-white/20 font-semibold px-6 h-12"
            >
              View Plans
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
};
