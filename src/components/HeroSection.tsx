import { Shield, TrendingUp, Zap } from "lucide-react";
import { VideoShowcase } from "./VideoShowcase";

export const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary to-primary/80 text-primary-foreground py-20">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTItMTZ2Mmgydi0yaC0yem0wIDR2Mmgydi0yaC0yem0wIDR2Mmgydi0yaC0yem0wIDR2Mmgydi0yaC0yem0wIDR2Mmgydi0yaC0yem0tNCAwdjJoMnYtMmgtMnptLTQgMHYyaDJ2LTJoLTJ6bS00IDB2Mmgydi0yaC0yem0tNCAwdjJoMnYtMmgtMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
          {/* Left Column - Content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <Shield className="w-4 h-4" />
              <span className="text-sm font-medium">Paid Advertising Strategy 2025</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              <span className="block text-accent">Paid Advertisement</span>
            </h1>
            
            <p className="text-lg md:text-xl mb-8 text-primary-foreground/90 leading-relaxed">
              Strategic launch your business campaigns powered by AI-driven lead response in under 5 minutes
            </p>

            {/* Key Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <div className="text-3xl font-bold text-accent mb-1">3-5x</div>
                <div className="text-xs text-primary-foreground/80">Avg ROAS</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <div className="text-3xl font-bold text-secondary mb-1">&lt;5min</div>
                <div className="text-xs text-primary-foreground/80">Response</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <div className="text-3xl font-bold text-accent mb-1">24/7</div>
                <div className="text-xs text-primary-foreground/80">AI Support</div>
              </div>
            </div>

            {/* Feature Pills */}
            <div className="hidden lg:grid lg:grid-cols-3 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <TrendingUp className="w-6 h-6 mb-2 text-accent mx-auto lg:mx-0" />
                <h3 className="font-semibold text-sm mb-1">Multi-Platform</h3>
                <p className="text-xs text-primary-foreground/80">Facebook & Google optimized</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <Zap className="w-6 h-6 mb-2 text-secondary mx-auto lg:mx-0" />
                <h3 className="font-semibold text-sm mb-1">AI-Powered</h3>
                <p className="text-xs text-primary-foreground/80">Automated lead response</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <Shield className="w-6 h-6 mb-2 text-accent mx-auto lg:mx-0" />
                <h3 className="font-semibold text-sm mb-1">5-Min Response</h3>
                <p className="text-xs text-primary-foreground/80">Voice AI calls instantly</p>
              </div>
            </div>
          </div>

          {/* Right Column - Video */}
          <div className="w-full">
            <VideoShowcase />
          </div>
        </div>
      </div>
    </section>
  );
};
