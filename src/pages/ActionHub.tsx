import { Eyebrow } from '@/components/ui/eyebrow';
import { Button } from '@/components/ui/button';
import { DepartmentCard } from '@/components/DepartmentCard';
import { departmentConfigs } from '@/lib/departmentConfigs';
import { Calendar, ChevronDown, Lightbulb } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getAllServices } from '@/lib/serviceConfigs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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
                {services.map((service) => (
                  <DropdownMenuItem key={service.slug} asChild>
                    <Link to={`/${service.slug}`}>{service.name}</Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Link to="/vision-intake">
              <Button className="gap-2 bg-primary hover:bg-primary/90">
                <Lightbulb className="w-4 h-4" />
                <span className="hidden sm:inline">Submit New Vision</span>
                <span className="sm:hidden">New Vision</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <Eyebrow>Organizational Hub</Eyebrow>
            <h1 className="text-4xl md:text-5xl font-bold mt-4 mb-6">
              GFunnel <span className="gradient-text">Action Hub</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Your organizational operating system. Submit requests, delegate tasks, and access
              resources across all departments.
            </p>
          </div>

          {/* Department Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {departmentConfigs.map((department) => (
              <DepartmentCard key={department.slug} department={department} />
            ))}
          </div>
        </div>
      </section>

      {/* Custom Request Banner */}
      <section className="py-12 bg-gradient-to-br from-primary to-secondary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-3">
            Have a Custom Request?
          </h2>
          <p className="text-primary-foreground/80 mb-6 max-w-xl mx-auto">
            Don't see what you're looking for? Schedule a discovery call and let's discuss your unique needs.
          </p>
          <a href="https://www.GFunnel.com/discover" target="_parent">
            <Button variant="secondary" size="lg" className="gap-2">
              <Calendar className="w-5 h-5" />
              Schedule Discovery Call
            </Button>
          </a>
        </div>
      </section>
    </div>
  );
};

export default ActionHub;
