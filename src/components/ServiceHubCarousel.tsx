import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel';
import { departmentConfigs } from '@/lib/departmentConfigs';
import Autoplay from 'embla-carousel-autoplay';
import { useEffect, useState, useRef } from 'react';
import { ArrowRight } from 'lucide-react';

const slideGradients: Record<string, string> = {
  blue: 'from-[hsl(210,80%,50%)] to-[hsl(230,70%,45%)]',
  pink: 'from-[hsl(330,70%,55%)] to-[hsl(350,60%,50%)]',
  purple: 'from-[hsl(270,70%,50%)] to-[hsl(290,60%,45%)]',
  green: 'from-[hsl(150,60%,40%)] to-[hsl(170,50%,35%)]',
  orange: 'from-[hsl(30,80%,50%)] to-[hsl(15,70%,45%)]',
  teal: 'from-[hsl(180,60%,40%)] to-[hsl(200,50%,35%)]',
  cyan: 'from-[hsl(190,70%,45%)] to-[hsl(210,60%,40%)]',
};

const slideTaglines: Record<string, string> = {
  'revenue-generation': 'Drive Growth & Build Partnerships',
  'creative-content': 'Design, Video & Copywriting',
  'technology': 'Build, Automate & Integrate',
  'operations': 'Streamline Workflows & Processes',
  'finance': 'Billing, Budgets & Reporting',
  'strategy-analytics': 'Business Intelligence & KPIs',
  'team-support': 'HR, Training & Customer Success',
};

export const ServiceHubCarousel = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const autoplayPlugin = useRef(
    Autoplay({ delay: 5000, stopOnInteraction: false })
  );

  useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());
    api.on('select', () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const scrollTo = (index: number) => {
    api?.scrollTo(index);
  };

  return (
    <Carousel
      setApi={setApi}
      plugins={[autoplayPlugin.current]}
      className="w-full"
      opts={{ loop: true }}
    >
      <CarouselContent>
        {departmentConfigs.map((dept) => (
          <CarouselItem key={dept.slug}>
            <div
              className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${slideGradients[dept.color]} p-6 md:p-8 min-h-[200px] md:min-h-[220px]`}
            >
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl md:text-3xl">
                    {dept.icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h2 className="text-xl md:text-2xl font-bold text-white mb-1">
                      {dept.name}
                    </h2>
                    <p className="text-white/90 text-base md:text-lg font-medium">
                      {slideTaglines[dept.slug] || dept.shortDescription}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <Link to={`/service-hub/${dept.slug}`}>
                    <Button
                      size="sm"
                      className="bg-white text-foreground hover:bg-white/90 font-semibold gap-2"
                    >
                      Get Started
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>

                  {/* Dot indicators */}
                  <div className="flex gap-1.5">
                    {departmentConfigs.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => scrollTo(index)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          index === current
                            ? 'bg-white w-6'
                            : 'bg-white/40 hover:bg-white/60'
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
};
