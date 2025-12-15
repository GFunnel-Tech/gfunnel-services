import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle, Loader2 } from "lucide-react";
import { useEffect } from "react";

const VisionProcessing = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const visionTitle = location.state?.visionTitle || "Your Vision";

  useEffect(() => {
    // Load the video player script
    const script = document.createElement("script");
    script.src = "https://videosuite-player-wrapper.vercel.app/assets";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/action-hub")}
          className="mb-6 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Action Hub
        </Button>

        <div className="text-center mb-8">
          <p className="text-sm font-medium text-primary mb-2">Vision Intake</p>
          <h1 className="text-3xl font-bold text-foreground mb-3">Share Your Vision</h1>
          <p className="text-muted-foreground">
            Tell us about your goals, and we'll help you break them down into actionable workflows.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-4 mb-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center">
              <CheckCircle className="w-5 h-5" />
            </div>
            <span className="text-sm text-muted-foreground">Vision Details</span>
          </div>
          <div className="w-12 h-px bg-primary" />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
              2
            </div>
            <span className="text-sm font-medium text-foreground">Access Projects</span>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Your Projects Are Being Created!</h2>
          <p className="text-muted-foreground mb-6">
            We're breaking down your vision into actionable tasks and organizing them in Projects.
          </p>

          <div className="bg-muted/50 rounded-lg p-4 mb-8">
            <p className="text-sm text-muted-foreground mb-1">Your Vision:</p>
            <p className="font-medium text-foreground">{visionTitle}</p>
          </div>

          <p className="text-sm font-medium text-foreground mb-4">Watch how your tasks are being organized</p>

          {/* Video Player */}
          <div 
            className="iv-player_responsive_padding relative mb-8" 
            style={{ paddingTop: "56.25%" }}
            data-hash="69408612ef0b6"
          >
            <div className="iv-player_responsive_wrapper absolute inset-0">
              <div 
                className="iv-player_embed iv-player_async_p2z7746nud videoFoam=true relative w-full h-full"
              >
                <div className="iv-player_swatch absolute inset-0 opacity-0 overflow-hidden">
                  <img 
                    src="https://vz-5b49b1a0-718.b-cdn.net/2ae60c8d-780f-4126-baeb-71f6b6354cb1/thumbnail.jpg" 
                    className="w-full h-full object-contain blur-sm"
                    alt="" 
                    aria-hidden="true" 
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="text-left bg-muted/30 rounded-lg p-4 mb-8">
            <p className="text-sm font-medium text-foreground mb-3">What's happening now:</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                AI is analyzing your vision and breaking it into actionable tasks
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                Tasks are being categorized into Chores, Projects, and Asks/Needs
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                Priority and revenue scores are being calculated
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                Everything is being added to your Projects dashboard
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <Button 
              className="w-full bg-primary hover:bg-primary/90"
              onClick={() => window.open("https://gitscrum.com/workspace", "_parent")}
            >
              Access Projects
            </Button>
            
            <p className="text-sm text-muted-foreground">or</p>
            
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => window.open("https://www.gfunnel.com/software-plan", "_parent")}
            >
              Start a Software Plan for $1 Today
            </Button>

            <Button
              variant="ghost"
              className="text-sm text-muted-foreground hover:text-foreground"
              onClick={() => navigate("/vision-intake")}
            >
              ← Submit another vision
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisionProcessing;
