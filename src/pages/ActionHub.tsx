import { Eyebrow } from '@/components/ui/eyebrow';
import { Button } from '@/components/ui/button';
import { DepartmentCard } from '@/components/DepartmentCard';
import { departmentConfigs } from '@/lib/departmentConfigs';
import { Calendar, ChevronDown, Lightbulb } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getAllServices } from '@/lib/serviceConfigs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
const ActionHub = () => {
  const services = getAllServices();
  return <div className="min-h-screen bg-background pb-32">
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
                {services.map(service => <DropdownMenuItem key={service.slug} asChild>
                    <Link to={`/${service.slug}`}>{service.name}</Link>
                  </DropdownMenuItem>)}
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

      {/* Hero Section */}
      <section className="relative py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <Eyebrow>Organizational Hub</Eyebrow>
            <h1 className="text-4xl md:text-5xl font-bold mt-4 mb-6">
              <span className="gradient-text">Service Hub</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Your organizational operating system. Submit requests, delegate tasks, and access
              resources across all departments.
            </p>
          </div>

          {/* Department Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {departmentConfigs.map(department => <DepartmentCard key={department.slug} department={department} />)}
          </div>

          {/* Active Projects Banner */}
          <div className="max-w-4xl mx-auto mt-10">
            <a 
              href="https://gitscrum.com/workspace" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block group"
            >
              <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-[hsl(230,70%,55%)] via-[hsl(260,60%,55%)] to-[hsl(280,50%,60%)] px-6 py-4 md:px-8 md:py-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
                {/* Top accent bar on hover */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-white/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0 group-hover:bg-white/30 transition-colors duration-300">
                      <span className="text-xl text-white">✓</span>
                    </div>
                    <div>
                      <h3 className="text-lg md:text-xl font-bold text-white">
                        Active Projects & Tasks
                      </h3>
                      <p className="text-white/80 text-sm hidden sm:block">
                        View and manage all your active projects and tasks
                      </p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="bg-white text-[hsl(250,60%,50%)] border-0 hover:bg-[hsl(250,60%,95%)] hover:text-[hsl(250,70%,45%)] font-medium whitespace-nowrap shadow-md transition-all duration-200"
                  >
                    Go to Workspace →
                  </Button>
                </div>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* Custom Request Banner - Sticky to bottom */}
      <section className="fixed bottom-0 left-0 right-0 z-50 py-6 bg-gradient-to-br from-primary to-secondary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-xl md:text-2xl font-bold text-primary-foreground mb-2">
            Have a Custom Request?
          </h2>
          <p className="text-primary-foreground/80 mb-4 max-w-xl mx-auto text-sm md:text-base">
            Don't see what you're looking for? Schedule a discovery call and let's discuss your unique needs.
          </p>
          <Button 
            variant="gradient-secondary" 
            size="lg" 
            className="gap-2"
            onClick={() => window.open('https://www.GFunnel.com/discover', '_blank')}
          >
            <Calendar className="w-5 h-5" />
            Schedule Discovery Call
          </Button>
        </div>
      </section>
    </div>;
};
export default ActionHub;