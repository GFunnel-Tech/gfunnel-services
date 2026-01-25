import { useEffect, useRef, useState } from "react";
import { Bot, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface AIEmbedWidgetProps {
  embedUrl: string;
  className?: string;
}

export const AIEmbedWidget = ({ embedUrl, className }: AIEmbedWidgetProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!embedUrl) {
      setError("No embed URL provided");
      setIsLoading(false);
      return;
    }

    // Validate URL pattern for security
    const isValidUrl = embedUrl.includes('apiii.co') || embedUrl.includes('widget');
    if (!isValidUrl) {
      setError("Invalid widget URL format");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    const script = document.createElement("script");
    script.src = embedUrl;
    script.defer = true;
    script.async = true;

    script.onload = () => {
      setIsLoading(false);
    };

    script.onerror = () => {
      setError("Failed to load AI chat widget");
      setIsLoading(false);
    };

    document.head.appendChild(script);

    // Cleanup on unmount
    return () => {
      try {
        document.head.removeChild(script);
      } catch (e) {
        // Script may have already been removed
      }
    };
  }, [embedUrl]);

  if (error) {
    return (
      <div className={cn(
        "flex flex-col items-center justify-center min-h-[400px] rounded-lg border border-dashed border-destructive/30 bg-destructive/5 p-8",
        className
      )}>
        <AlertCircle className="w-12 h-12 text-destructive/50 mb-4" />
        <p className="text-destructive font-medium mb-2">Widget Error</p>
        <p className="text-sm text-muted-foreground text-center">{error}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={cn(
        "flex flex-col items-center justify-center min-h-[400px] rounded-lg border border-dashed border-purple-300 bg-purple-50/50 dark:bg-purple-950/20 p-8",
        className
      )}>
        <div className="relative">
          <div className="w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center mb-4">
            <Bot className="w-8 h-8 text-purple-500" />
          </div>
          <Loader2 className="w-6 h-6 text-purple-500 animate-spin absolute -bottom-1 -right-1" />
        </div>
        <p className="text-sm text-muted-foreground mt-4">Loading AI chat...</p>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className={cn(
        "min-h-[400px] rounded-lg border border-border bg-card overflow-hidden",
        className
      )}
    >
      {/* The widget will inject itself here or create a floating button */}
    </div>
  );
};
