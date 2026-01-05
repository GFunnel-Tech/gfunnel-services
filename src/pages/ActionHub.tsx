import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DepartmentCard } from '@/components/DepartmentCard';
import { ServiceHubCarousel } from '@/components/ServiceHubCarousel';
import { departmentConfigs } from '@/lib/departmentConfigs';
import { Calendar, ChevronDown, Lightbulb, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getAllServices } from '@/lib/serviceConfigs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const ActionHub = () => {
  const services = getAllServices();

  return (
    <div className="min-h-screen bg-background">
      {/* Header with CTAs */}
      <header className="border-b border-border/50 py-4">
        <div className="container mx-auto px-4 flex items-center justify-end">
          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  Services
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 max-h-80 overflow-y-auto bg-popover">
                <DropdownMenuItem asChild>
                  <Link to="/services" className="font-medium">
                    View All Services
                  </Link>
                </DropdownMenuItem>
                {services.map(service => (
                  <DropdownMenuItem key={service.slug} asChild>
                    <Link to={`/${service.slug}`}>{service.name}</Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Link to="/vision-intake">
              <Button variant="gradient" className="gap-2">
                <Lightbulb className="w-4 h-4" />
                <span className="hidden sm:inline">Submit New Vision</span>
                <span className="sm:hidden">New Vision</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <section className="py-6 md:py-10">
        <div className="container mx-auto px-4">
          {/* Hero Carousel */}
          <ServiceHubCarousel />

          {/* Section Title */}
          <div className="mt-10 mb-6">
            <h1 className="text-xl md:text-2xl font-bold text-foreground">
              Service Hub Dashboard
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Submit requests, delegate tasks, and access resources across all departments.
            </p>
          </div>

          {/* Department Grid - 2 columns on tablet, 3-4 on desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {departmentConfigs.map(department => (
              <DepartmentCard key={department.slug} department={department} />
            ))}
          </div>

          {/* Bottom Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            {/* Active Projects Card */}
            <a 
              href="https://gitscrum.com/workspace" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block group"
            >
              <Card className="relative overflow-hidden p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg bg-gradient-to-br from-[hsl(230,70%,55%)] to-[hsl(260,60%,50%)] border-0">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                      <span className="text-xl text-white">✓</span>
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">
                        Active Projects & Tasks
                      </h3>
                      <p className="text-white/80 text-xs hidden sm:block">
                        View and manage all your active projects
                      </p>
                    </div>
                  </div>
                  <ExternalLink className="w-5 h-5 text-white/70 group-hover:text-white transition-colors" />
                </div>
              </Card>
            </a>

            {/* Custom Request Card */}
            <Card 
              className="relative overflow-hidden p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg bg-gradient-to-br from-primary to-secondary border-0 cursor-pointer"
              onClick={() => window.open('https://www.GFunnel.com/discover', '_blank')}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-primary-foreground">
                      Have a Custom Request?
                    </h3>
                    <p className="text-primary-foreground/80 text-xs hidden sm:block">
                      Schedule a discovery call for unique needs
                    </p>
                  </div>
                </div>
                <Button 
                  variant="secondary" 
                  size="sm"
                  className="bg-white text-primary hover:bg-white/90 font-medium whitespace-nowrap"
                >
                  Schedule Call
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ActionHub;
