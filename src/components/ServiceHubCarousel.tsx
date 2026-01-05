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

const slideGradients: Record<string, string> = {
  blue: 'from-[hsl(200,80%,45%)] to-[hsl(180,70%,40%)]',
  purple: 'from-[hsl(270,70%,50%)] to-[hsl(290,60%,45%)]',
  green: 'from-[hsl(150,60%,40%)] to-[hsl(170,50%,35%)]',
  orange: 'from-[hsl(30,80%,50%)] to-[hsl(15,70%,45%)]',
  teal: 'from-[hsl(180,60%,40%)] to-[hsl(200,50%,35%)]',
  pink: 'from-[hsl(330,70%,55%)] to-[hsl(350,60%,50%)]',
};

const slideTaglines: Record<string, string> = {
  'sales-marketing': 'Drive Growth with Strategic Marketing',
  'product-development': 'Build & Innovate with Product',
  'operations': 'Streamline Your Operations',
  'finance-admin': 'Manage Finance & Administration',
  'strategy-analytics': 'Data-Driven Strategy & Analytics',
  'people-culture': 'Empower Your People & Culture',
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
    <div className="relative">
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
                className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${slideGradients[dept.color]} p-8 md:p-12 min-h-[280px] md:min-h-[320px]`}
              >
                {/* Wave pattern overlay */}
                <div className="absolute inset-0 opacity-10">
                  <svg
                    className="absolute bottom-0 left-0 w-full"
                    viewBox="0 0 1440 320"
                    preserveAspectRatio="none"
                  >
                    <path
                      fill="white"
                      d="M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,138.7C672,128,768,160,864,181.3C960,203,1056,213,1152,197.3C1248,181,1344,139,1392,117.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                    />
                  </svg>
                </div>

                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div className="flex items-start gap-4 md:gap-6">
                    {/* Icon */}
                    <div className="flex-shrink-0 w-14 h-14 md:w-16 md:h-16 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl md:text-4xl">
                      {dept.icon}
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                        {dept.name}
                      </h2>
                      <p className="text-white/90 text-lg md:text-xl font-medium">
                        {slideTaglines[dept.slug]}
                      </p>
                      <p className="text-white/70 mt-2 text-sm md:text-base max-w-xl hidden sm:block">
                        {dept.shortDescription}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-6">
                    <Link to={`/service-hub/${dept.slug}`}>
                      <Button
                        variant="secondary"
                        className="bg-white text-foreground hover:bg-white/90 font-semibold gap-2"
                      >
                        Get Started
                        <span>→</span>
                      </Button>
                    </Link>

                    {/* Dot indicators */}
                    <div className="flex gap-2">
                      {departmentConfigs.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => scrollTo(index)}
                          className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                            index === current
                              ? 'bg-white scale-110'
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
    </div>
  );
};
