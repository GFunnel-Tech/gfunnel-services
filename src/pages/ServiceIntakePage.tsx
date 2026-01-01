import { useState } from "react";
import { useParams, Navigate, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { getServiceBySlug } from "@/lib/serviceConfigs";
import { getFormFieldsForService } from "@/lib/serviceFormFields";
import { Navigation } from "@/components/Navigation";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Send, CheckCircle, Sparkles, Target, Clock, MessageSquare } from "lucide-react";

const WEBHOOK_URL = "https://apihub.gfunnel.com/webhook-test/e996d857-0666-4224-b63c-31ab5296b067";

const ServiceIntakePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  
  if (!slug) {
    return <Navigate to="/" replace />;
  }

  const service = getServiceBySlug(slug);

  if (!service) {
    return <Navigate to="/" replace />;
  }

  const serviceFields = getFormFieldsForService(slug);

  const [formData, setFormData] = useState<Record<string, string>>({
    email: "",
    companyName: "",
    budget: "",
    timeline: "",
    goals: "",
    currentChallenges: "",
    additionalInfo: "",
  });

  const handleFieldChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

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
          form_type: `service_intake_${service.slug}`,
          form_category: "service_intake",
          service_name: service.name,
          service_slug: service.slug,
          submitted_at: new Date().toISOString(),
          source_url: window.location.href,
          ...formData,
        }),
      });

      toast({
        title: "Request submitted!",
        description: "Redirecting to your confirmation...",
      });

      navigate("/service-confirmation", {
        state: {
          serviceName: service.name,
          serviceSlug: service.slug,
        },
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

  const renderField = (field: { name: string; label: string; type: string; placeholder?: string; options?: { value: string; label: string }[]; required?: boolean }) => {
    if (field.type === "select" && field.options) {
      return (
        <div key={field.name} className="space-y-2">
          <Label htmlFor={field.name}>{field.label}</Label>
          <Select
            value={formData[field.name] || ""}
            onValueChange={(value) => handleFieldChange(field.name, value)}
          >
            <SelectTrigger className="bg-background">
              <SelectValue placeholder={field.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {field.options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      );
    }

    if (field.type === "textarea") {
      return (
        <div key={field.name} className="space-y-2">
          <Label htmlFor={field.name}>{field.label}</Label>
          <Textarea
            id={field.name}
            placeholder={field.placeholder}
            value={formData[field.name] || ""}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            rows={2}
            className="bg-background"
          />
        </div>
      );
    }

    return (
      <div key={field.name} className="space-y-2">
        <Label htmlFor={field.name}>{field.label}</Label>
        <Input
          id={field.name}
          placeholder={field.placeholder}
          value={formData[field.name] || ""}
          onChange={(e) => handleFieldChange(field.name, e.target.value)}
          className="bg-background"
        />
      </div>
    );
  };

  const step1Complete = formData.email && formData.companyName;
  const step2Complete = serviceFields.length === 0 || serviceFields.some(f => formData[f.name]);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/service-hub">Service Hub</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to={`/${slug}`}>{service.name}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Get Started</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            {service.name}
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-3">
            Let's Build Something Great Together
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Tell us about your project and goals. We'll create a tailored plan just for you.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-2 md:gap-4 mb-10">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
              step1Complete ? 'bg-primary/20 text-primary' : 'bg-primary text-primary-foreground'
            }`}>
              {step1Complete ? <CheckCircle className="w-5 h-5" /> : '1'}
            </div>
            <span className={`text-sm hidden sm:inline ${step1Complete ? 'text-muted-foreground' : 'font-medium text-foreground'}`}>
              Your Info
            </span>
          </div>
          <div className={`w-8 md:w-12 h-px transition-colors ${step1Complete ? 'bg-primary' : 'bg-border'}`} />
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
              step2Complete ? 'bg-primary/20 text-primary' : step1Complete ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
            }`}>
              {step2Complete ? <CheckCircle className="w-5 h-5" /> : '2'}
            </div>
            <span className={`text-sm hidden sm:inline ${step1Complete ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>
              Project Details
            </span>
          </div>
          <div className={`w-8 md:w-12 h-px transition-colors ${step2Complete ? 'bg-primary' : 'bg-border'}`} />
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
              step2Complete ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
            }`}>
              3
            </div>
            <span className="text-sm text-muted-foreground hidden sm:inline">Submit</span>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-card border border-border rounded-xl p-6 md:p-8 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Section 1: Contact Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 pb-2 border-b border-border">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <MessageSquare className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h2 className="font-semibold text-foreground">Contact Information</h2>
                  <p className="text-sm text-muted-foreground">How can we reach you?</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Your Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@company.com"
                    value={formData.email}
                    onChange={(e) => handleFieldChange("email", e.target.value)}
                    className="bg-background"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    placeholder="Your company name"
                    value={formData.companyName}
                    onChange={(e) => handleFieldChange("companyName", e.target.value)}
                    className="bg-background"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Service-Specific Fields */}
            {serviceFields.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 pb-2 border-b border-border">
                  <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-foreground">{service.name} Details</h2>
                    <p className="text-sm text-muted-foreground">Tell us more about your specific needs</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {serviceFields.map((field) => renderField(field))}
                </div>
              </div>
            )}

            {/* Section 3: Budget & Timeline */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 pb-2 border-b border-border">
                <div className="w-8 h-8 rounded-lg bg-secondary/50 flex items-center justify-center">
                  <Clock className="w-4 h-4 text-foreground" />
                </div>
                <div>
                  <h2 className="font-semibold text-foreground">Budget & Timeline</h2>
                  <p className="text-sm text-muted-foreground">Help us understand your constraints</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="budget">Monthly Budget</Label>
                  <Select
                    value={formData.budget}
                    onValueChange={(value) => handleFieldChange("budget", value)}
                  >
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Select budget range" />
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
                    onValueChange={(value) => handleFieldChange("timeline", value)}
                  >
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="When do you want to start?" />
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
            </div>

            {/* Section 4: Goals */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 pb-2 border-b border-border">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Target className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h2 className="font-semibold text-foreground">Goals & Challenges</h2>
                  <p className="text-sm text-muted-foreground">What are you trying to achieve?</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="goals">What are your goals? *</Label>
                  <Textarea
                    id="goals"
                    placeholder="Describe what success looks like for this project..."
                    value={formData.goals}
                    onChange={(e) => handleFieldChange("goals", e.target.value)}
                    rows={3}
                    className="bg-background"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currentChallenges">Current Challenges</Label>
                  <Textarea
                    id="currentChallenges"
                    placeholder="What obstacles are you facing right now?"
                    value={formData.currentChallenges}
                    onChange={(e) => handleFieldChange("currentChallenges", e.target.value)}
                    rows={2}
                    className="bg-background"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="additionalInfo">Additional Information</Label>
                  <Textarea
                    id="additionalInfo"
                    placeholder="Anything else we should know about your project?"
                    value={formData.additionalInfo}
                    onChange={(e) => handleFieldChange("additionalInfo", e.target.value)}
                    rows={2}
                    className="bg-background"
                  />
                </div>
              </div>
            </div>

            {/* What happens next */}
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-sm font-medium text-foreground mb-2">What happens next?</p>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  We'll review your request within 24 hours
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  A specialist will reach out with a tailored proposal
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  No commitment required — just a conversation
                </li>
              </ul>
            </div>

            {/* Submit */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(`/${slug}`)}
                className="sm:flex-1"
              >
                ← Back to {service.name}
              </Button>
              <Button 
                type="submit" 
                variant="gradient"
                size="lg"
                disabled={isSubmitting} 
                className="sm:flex-1"
              >
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
        </div>

        {/* Footer note */}
        <p className="text-xs text-muted-foreground text-center mt-6">
          We respect your privacy. No spam, ever. Your information is secure.
        </p>
      </div>
    </div>
  );
};

export default ServiceIntakePage;
