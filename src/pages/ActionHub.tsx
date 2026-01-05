import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DepartmentCard } from "@/components/DepartmentCard";
import { ServiceHubCarousel } from "@/components/ServiceHubCarousel";
import { departmentConfigs } from "@/lib/departmentConfigs";
import { Calendar, ChevronDown, Lightbulb, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { getAllServices } from "@/lib/serviceConfigs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4 space-y-10">
          {/* Hero Banner */}
          <ServiceHubCarousel />

          {/* Section Title */}
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">Browse Departments</h2>
            <p className="text-muted-foreground mt-2">
              Submit requests, delegate tasks, and access resources across all departments.
            </p>
          </div>

          {/* Department Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {departmentConfigs.map((department) => (
              <DepartmentCard key={department.slug} department={department} />
            ))}
          </div>

          {/* Resource Links Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Left Column - Stacked Cards */}
            <div className="flex flex-col gap-4 h-full">
              {/* Active Projects Card */}
              <a
                href="https://gitscrum.com/workspace"
                target="_blank"
                rel="noopener noreferrer"
                className="block group flex-1"
              >
                <Card className="h-full p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl border border-emerald-500/30 bg-gradient-to-br from-emerald-600/30 via-teal-600/25 to-cyan-600/30 flex items-center relative overflow-hidden">
                  {/* Decorative elements */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-400/25 rounded-full -translate-y-1/2 translate-x-1/2" />
                  <div className="absolute bottom-0 left-0 w-16 h-16 bg-cyan-400/20 rounded-full translate-y-1/2 -translate-x-1/2" />

                  <div className="flex items-center justify-between gap-4 w-full relative z-10">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-emerald-500/40 flex items-center justify-center flex-shrink-0">
                        <span className="text-lg">✓</span>
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-foreground">Active Projects & Tasks</h3>
                        <p className="text-muted-foreground text-sm">View and manage your projects</p>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-emerald-500 group-hover:text-emerald-400 transition-colors" />
                  </div>
                </Card>
              </a>

              {/* Custom Request Card */}
              <Card
                className="flex-1 relative overflow-hidden p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg bg-gradient-to-r from-primary via-primary to-secondary border-0 cursor-pointer flex items-center"
                onClick={() => window.open("https://www.GFunnel.com/discover", "_blank")}
              >
                <div className="flex items-center justify-between gap-4 w-full">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-primary-foreground">Have a Custom Request?</h3>
                      <p className="text-primary-foreground/80 text-sm">Schedule a discovery call</p>
                    </div>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="bg-white text-primary hover:bg-white/90 font-semibold whitespace-nowrap"
                  >
                    Schedule Discovery
                  </Button>
                </div>
              </Card>
            </div>

            {/* Right Column - Learning Hub Feature Card */}
            <a
              href="https://www.gfunnel.com/learning-hub"
              target="_blank"
              rel="noopener noreferrer"
              className="block group h-full"
            >
              <Card className="h-full p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl border-0 bg-gradient-to-br from-amber-500/15 via-orange-500/10 to-rose-500/15 overflow-hidden relative">
                {/* Decorative background elements */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-rose-500/10 rounded-full translate-y-1/2 -translate-x-1/2" />

                <div className="relative z-10 flex flex-col h-full">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
                      <span className="text-2xl">📚</span>
                    </div>
                    <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-amber-600 transition-colors" />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-foreground mb-2">Learning Hub</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Courses, workshops & training to grow your business
                  </p>

                  {/* Preview Topics */}
                  <div className="grid grid-cols-2 gap-2 mt-auto">
                    <div className="flex items-center gap-2 text-xs text-foreground/80 bg-amber-500/10 rounded-md px-2 py-1.5">
                      <span>🚀</span>
                      <span>Starting a Business</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-foreground/80 bg-orange-500/10 rounded-md px-2 py-1.5">
                      <span>📈</span>
                      <span>Marketing & Sales</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-foreground/80 bg-rose-500/10 rounded-md px-2 py-1.5">
                      <span>💰</span>
                      <span>Finance</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-foreground/80 bg-amber-500/10 rounded-md px-2 py-1.5">
                      <span>⚙️</span>
                      <span>Operations</span>
                    </div>
                  </div>

                  {/* CTA hint */}
                  <div className="mt-4 pt-3 border-t border-amber-500/20">
                    <span className="text-sm font-medium text-amber-600 group-hover:underline">
                      Explore Learning Hub →
                    </span>
                  </div>
                </div>
              </Card>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ActionHub;
