import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { departmentConfigs } from "@/lib/departmentConfigs";
import { submitForm, buildActionPayload } from "@/lib/webhookService";
import { actionRequestSchema } from "@/lib/formSchemas";
import { isFreePlan } from "@/lib/walletTypes";
import { Loader2, Send, CheckCircle2, ArrowRight } from "lucide-react";
import { UpgradePlansModal } from "./UpgradePlansModal";

interface QuickSubmitModalProps {
  isOpen: boolean;
  onClose: (wasSubmitted?: boolean) => void;
  userEmail?: string;
  companyId?: string;
  companyName?: string;
  planName?: string;
}

export const QuickSubmitModal = ({
  isOpen,
  onClose,
  userEmail,
  companyId,
  companyName,
  planName,
}: QuickSubmitModalProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // Check if user needs to upgrade (on Free plan)
  const needsUpgrade = isFreePlan(planName);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // If user is on free plan, show upgrade modal instead
    if (needsUpgrade) {
      setShowUpgradeModal(true);
      return;
    }

    setIsSubmitting(true);

    const formElement = e.currentTarget;
    const formDataRaw = new FormData(formElement);
    const data = Object.fromEntries(formDataRaw.entries()) as Record<string, string>;

    const department = departmentConfigs.find(d => d.slug === selectedDepartment);
    if (!department) {
      toast({
        title: "Please select a department",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    // Build the payload with company_id to ensure request is linked to correct company
    const payload = buildActionPayload(
      "action_request",
      department.name,
      department.slug,
      data.title || "Quick Request",
      {
        ...data,
        request_type: "done_for_you",
        company_id: companyId, // Pass company_id to link request correctly
      }
    );

    try {
      const result = await submitForm(payload, actionRequestSchema);

      if (!result.success) {
        toast({
          title: "Submission Error",
          description: result.error || "Please check your inputs and try again.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      setIsSuccess(true);
      toast({
        title: "Request Submitted!",
        description: "We'll review your request and get back to you soon.",
      });

      // Close after brief delay and notify parent of successful submission
      setTimeout(() => {
        setIsSuccess(false);
        onClose(true);
      }, 2000);
    } catch (error) {
      toast({
        title: "Submission Error",
        description: "There was an error submitting your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setIsSuccess(false);
      setSelectedDepartment("");
      onClose();
    }
  };

  if (isSuccess) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8 text-primary" />
            </div>
            <DialogTitle className="text-xl mb-2">Request Submitted!</DialogTitle>
            <DialogDescription>
              We'll review your request and follow up within 24 hours.
            </DialogDescription>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Submit New Request</DialogTitle>
          <DialogDescription>
            {companyName ? (
              <>Submitting on behalf of <span className="font-medium text-foreground">{companyName}</span></>
            ) : (
              "Quickly submit a new request to our team"
            )}
          </DialogDescription>
        </DialogHeader>

        {/* Submitter Info Banner */}
        {userEmail && (
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border/50">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
              {userEmail.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              {companyName && (
                <p className="text-sm font-medium truncate">{companyName}</p>
              )}
              <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {/* Hidden Email Field - always submit the prefilled email */}
          <input type="hidden" name="email" value={userEmail || ""} />

          {/* Department Selection */}
          <div className="space-y-2">
            <Label htmlFor="department">Department *</Label>
            <Select
              value={selectedDepartment}
              onValueChange={setSelectedDepartment}
              required
            >
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                {departmentConfigs.map((dept) => (
                  <SelectItem key={dept.slug} value={dept.slug}>
                    {dept.icon} {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Request Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Request Title *</Label>
            <Input
              id="title"
              name="title"
              placeholder="Brief summary of your request"
              required
              maxLength={200}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Provide details about what you need..."
              rows={4}
              required
              maxLength={2000}
            />
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <Select name="priority" defaultValue="medium">
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low - No rush</SelectItem>
                <SelectItem value="medium">Medium - Normal timeline</SelectItem>
                <SelectItem value="high">High - Urgent</SelectItem>
                <SelectItem value="urgent">Urgent - ASAP</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Video Link */}
          <div className="space-y-2">
            <Label htmlFor="videoLink">Video Explanation (Optional)</Label>
            <Input
              id="videoLink"
              name="videoLink"
              type="url"
              placeholder="Paste your Loom or Onscreen video link..."
              maxLength={500}
            />
            <div className="flex flex-wrap gap-2 text-xs">
              <a 
                href="https://www.loom.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-primary hover:underline"
              >
                Record with Loom →
              </a>
              <span className="text-muted-foreground">or</span>
              <a 
                href="https://onscreen.gfunnel.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-primary hover:underline"
              >
                Record with Onscreen →
              </a>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !selectedDepartment}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Submit Request
                </>
              )}
            </Button>
          </div>
        </form>

        {/* Link to full Service Hub */}
        <div className="text-center pt-2 border-t mt-4">
          <a
            href="/service-hub"
            className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1"
            onClick={handleClose}
          >
            Browse all departments for more options
            <ArrowRight className="w-3 h-3" />
          </a>
        </div>
      </DialogContent>

      {/* Upgrade Plans Modal */}
      <UpgradePlansModal 
        isOpen={showUpgradeModal} 
        onClose={() => setShowUpgradeModal(false)}
        currentPlan={planName}
      />
    </Dialog>
  );
};
