import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Building2, User, Users, ArrowRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export type ServiceRequestType = "done_for_you" | "self_service" | "delegated";

interface ServiceTypeOption {
  id: ServiceRequestType;
  icon: React.ElementType;
  title: string;
  description: string;
}

const options: ServiceTypeOption[] = [
  {
    id: "done_for_you",
    icon: Building2,
    title: "Do It For Me",
    description: "I want GFunnel's team to handle this project completely",
  },
  {
    id: "self_service",
    icon: User,
    title: "I'll Do It Myself",
    description: "I'm handling this myself and need resources to get started",
  },
  {
    id: "delegated",
    icon: Users,
    title: "Delegate to Someone",
    description: "I'm having my team member or contractor complete this",
  },
];

interface ServiceTypeModalProps {
  isOpen: boolean;
  onSelect: (type: ServiceRequestType) => void;
  serviceName: string;
  onClose?: () => void;
}

export const ServiceTypeModal = ({
  isOpen,
  onSelect,
  serviceName,
  onClose,
}: ServiceTypeModalProps) => {
  const [selectedType, setSelectedType] = useState<ServiceRequestType | null>(null);

  const handleContinue = () => {
    if (selectedType) {
      onSelect(selectedType);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose?.()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="text-center pb-2">
          <div className="flex justify-center mb-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              {serviceName}
            </div>
          </div>
          <DialogTitle className="text-xl font-semibold text-center">
            How would you like to proceed?
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3 py-4">
          {options.map((option) => {
            const Icon = option.icon;
            const isSelected = selectedType === option.id;

            return (
              <button
                key={option.id}
                onClick={() => setSelectedType(option.id)}
                className={cn(
                  "w-full flex items-start gap-4 p-4 rounded-lg border-2 transition-all text-left",
                  "hover:border-primary/50 hover:bg-primary/5",
                  isSelected
                    ? "border-primary bg-primary/10"
                    : "border-border bg-card"
                )}
              >
                <div
                  className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors",
                    isSelected
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0",
                        isSelected ? "border-primary" : "border-muted-foreground"
                      )}
                    >
                      {isSelected && (
                        <span className="w-2 h-2 rounded-full bg-primary" />
                      )}
                    </span>
                    <h3 className="font-medium text-foreground">{option.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 ml-6">
                    {option.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        <div className="flex justify-end pt-2">
          <Button
            onClick={handleContinue}
            disabled={!selectedType}
            variant="gradient"
            size="lg"
            className="min-w-[140px]"
          >
            Continue
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
