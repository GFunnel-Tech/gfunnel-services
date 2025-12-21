import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Send, CheckCircle } from "lucide-react";
import { ServiceConfig } from "@/lib/serviceConfigs";

interface ServiceIntakeFormProps {
  service: ServiceConfig;
}

const WEBHOOK_URL = "https://apihub.gfunnel.com/webhook-test/e996d857-0666-4224-b63c-31ab5296b067";

export const ServiceIntakeForm = ({ service }: ServiceIntakeFormProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    companyName: "",
    projectType: "",
    budget: "",
    timeline: "",
    goals: "",
    currentChallenges: "",
    additionalInfo: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.goals) {
      toast({
        title: "Required fields missing",
        description: "Please fill in your email and project goals.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        mode: "no-cors",
        body: JSON.stringify({
          formType: "service-intake",
          service: service.name,
          serviceSlug: service.slug,
          submittedAt: new Date().toISOString(),
          ...formData,
        }),
      });

      setIsSubmitted(true);
      toast({
        title: "Request submitted!",
        description: "We'll be in touch within 24 hours.",
      });
    } catch (error) {
      toast({
        title: "Submission failed",
        description: "Please try again or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <Card className="p-6 text-center">
        <CheckCircle className="w-12 h-12 mx-auto text-primary mb-4" />
        <h3 className="text-lg font-semibold mb-2">Request Submitted!</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Thank you for your interest in {service.name}. Our team will review your request and contact you within 24 hours.
        </p>
        <Button
          variant="outline"
          onClick={() => {
            setIsSubmitted(false);
            setFormData({
              email: "",
              companyName: "",
              projectType: "",
              budget: "",
              timeline: "",
              goals: "",
              currentChallenges: "",
              additionalInfo: "",
            });
          }}
        >
          Submit Another Request
        </Button>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Get Started with {service.name}</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Your Email *</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@company.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="companyName">Company Name</Label>
          <Input
            id="companyName"
            placeholder="Your company name"
            value={formData.companyName}
            onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="budget">Monthly Budget</Label>
            <Select
              value={formData.budget}
              onValueChange={(value) => setFormData({ ...formData, budget: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select budget" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="under-1k">Under $1,000</SelectItem>
                <SelectItem value="1k-5k">$1,000 - $5,000</SelectItem>
                <SelectItem value="5k-10k">$5,000 - $10,000</SelectItem>
                <SelectItem value="10k-25k">$10,000 - $25,000</SelectItem>
                <SelectItem value="25k-plus">$25,000+</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="timeline">Timeline</Label>
            <Select
              value={formData.timeline}
              onValueChange={(value) => setFormData({ ...formData, timeline: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="When to start" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asap">ASAP</SelectItem>
                <SelectItem value="this-month">This month</SelectItem>
                <SelectItem value="next-month">Next month</SelectItem>
                <SelectItem value="next-quarter">Next quarter</SelectItem>
                <SelectItem value="exploring">Just exploring</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="goals">What are your goals? *</Label>
          <Textarea
            id="goals"
            placeholder="Describe what you're trying to achieve..."
            value={formData.goals}
            onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
            rows={3}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="currentChallenges">Current Challenges</Label>
          <Textarea
            id="currentChallenges"
            placeholder="What obstacles are you facing?"
            value={formData.currentChallenges}
            onChange={(e) => setFormData({ ...formData, currentChallenges: e.target.value })}
            rows={2}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="additionalInfo">Additional Information</Label>
          <Textarea
            id="additionalInfo"
            placeholder="Anything else we should know?"
            value={formData.additionalInfo}
            onChange={(e) => setFormData({ ...formData, additionalInfo: e.target.value })}
            rows={2}
          />
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
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

        <p className="text-xs text-muted-foreground text-center">
          We'll respond within 24 hours. No spam, ever.
        </p>
      </form>
    </Card>
  );
};
