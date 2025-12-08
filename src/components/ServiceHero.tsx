import { ServiceConfig } from "@/lib/serviceConfigs";
import { VideoShowcase } from "./VideoShowcase";
import { Eyebrow } from "./ui/eyebrow";
import { GradientText } from "./ui/gradient-text";

interface ServiceHeroProps {
  service: ServiceConfig;
}

export const ServiceHero = ({ service }: ServiceHeroProps) => {
  const BadgeIcon = service.badgeIcon;

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary to-secondary text-primary-foreground py-16 md:py-24">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTItMTZ2Mmgydi0yaC0yem0wIDR2Mmgydi0yaC0yem0wIDR2Mmgydi0yaC0yem0wIDR2Mmgydi0yaC0yem0wIDR2Mmgydi0yaC0yem0tNCAwdjJoMnYtMmgtMnptLTQgMHYyaDJ2LTJoLTJ6bS00IDB2Mmgydi0yaC0yem0tNCAwdjJoMnYtMmgtMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
          {/* Left Column - Content */}
          <div className="text-center lg:text-left">
            <Eyebrow className="mb-6 bg-white/10 border-white/20 text-white">
              <BadgeIcon className="w-4 h-4 inline mr-2" />
              {service.badgeText}
            </Eyebrow>
            
            <h1 className="text-headline mb-6">
              <GradientText>{service.title}</GradientText>
            </h1>
            
            <p className="text-body-lg mb-8 text-primary-foreground/90">
              {service.description}
            </p>

            {/* Key Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              {service.stats.map((stat, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-card p-4 border border-white/20 transition-all duration-400 hover:-translate-y-1">
                  <div className="text-2xl md:text-3xl font-bold text-accent mb-1">{stat.value}</div>
                  <div className="text-xs text-primary-foreground/80 whitespace-nowrap overflow-hidden text-ellipsis">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Feature Pills */}
            <div className="hidden lg:grid lg:grid-cols-3 gap-4">
              {service.features.map((feature, index) => {
                const FeatureIcon = feature.icon;
                return (
                  <div key={index} className="bg-white/10 backdrop-blur-sm rounded-card p-4 border border-white/20 transition-all duration-400 hover:-translate-y-1">
                    <FeatureIcon className="w-6 h-6 mb-2 text-accent mx-auto lg:mx-0" />
                    <h3 className="font-semibold text-sm mb-1">{feature.title}</h3>
                    <p className="text-xs text-primary-foreground/80">{feature.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column - Video */}
          <div className="w-full">
            <VideoShowcase videos={service.videos} />
          </div>
        </div>
      </div>
    </section>
  );
};