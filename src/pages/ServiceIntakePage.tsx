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
import { Loader2, Send, CheckCircle, Sparkles, Target, Clock, MessageSquare, Users, BookOpen, CheckCircle2, Building2, User } from "lucide-react";
import { ServiceTypeModal, ServiceRequestType } from "@/components/ServiceTypeModal";
import { PostSubmitModal } from "@/components/PostSubmitModal";
import { submitForm, buildServiceIntakePayload } from "@/lib/webhookService";
import { serviceIntakeSchema } from "@/lib/formSchemas";

const ServiceIntakePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [showTypeModal, setShowTypeModal] = useState(true);
  const [requestType, setRequestType] = useState<ServiceRequestType | null>(null);
  const [showPostSubmit, setShowPostSubmit] = useState(false);
  
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
    // Self-service fields
    experience: "",
    // Delegation fields
    delegateName: "",
    delegateEmail: "",
    delegateRole: "",
    projectTitle: "",
    instructions: "",
    delegatePriority: "",
    dueDate: "",
  });

  const handleFieldChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate based on request type
    if (requestType === 'delegated') {
      if (!formData.email || !formData.delegateName || !formData.delegateEmail || !formData.instructions) {
        toast({
          title: "Required fields missing",
          description: "Please fill in all required delegation fields.",
          variant: "destructive",
        });
        return;
      }
    } else {
      if (!formData.email || !formData.goals) {
        toast({
          title: "Required fields missing",
          description: "Please fill in your email and project goals.",
          variant: "destructive",
        });
        return;
      }
    }

    setIsSubmitting(true);

    try {
      // Build standardized payload with snake_case field names
      const payload = buildServiceIntakePayload(
        service.name,
        service.slug,
        requestType,
        formData
      );

      const result = await submitForm(payload, serviceIntakeSchema);

      if (!result.success) {
        toast({
          title: "Validation Error",
          description: result.error || "Please check your inputs.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      // Show post-submit modal instead of navigating immediately
      setShowPostSubmit(true);
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

  const handleScheduleMeeting = () => {
    window.open('https://gfunnel.com/discover', '_blank');
    setShowPostSubmit(false);
    navigate("/service-confirmation", {
      state: {
        serviceName: service.name,
        serviceSlug: service.slug,
        requestType: requestType,
      },
    });
  };

  const handleSkipMeeting = () => {
    setShowPostSubmit(false);
    navigate("/service-confirmation", {
      state: {
        serviceName: service.name,
        serviceSlug: service.slug,
        requestType: requestType,
      },
    });
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

  const handleTypeSelect = (type: ServiceRequestType) => {
    setRequestType(type);
    setShowTypeModal(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Service Type Selection Modal */}
      <ServiceTypeModal
        isOpen={showTypeModal}
        onSelect={handleTypeSelect}
        serviceName={service.name}
        onClose={() => navigate(-1)}
      />
      
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

        {/* Request Type Badge */}
        {requestType && (
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium w-fit mx-auto mb-6 ${
            requestType === 'done_for_you' ? 'bg-primary/10 text-primary' :
            requestType === 'self_service' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' :
            'bg-blue-500/10 text-blue-600 dark:text-blue-400'
          }`}>
            {requestType === 'done_for_you' && <Building2 className="w-4 h-4" />}
            {requestType === 'self_service' && <User className="w-4 h-4" />}
            {requestType === 'delegated' && <Users className="w-4 h-4" />}
            {requestType === 'done_for_you' && 'Do It For Me'}
            {requestType === 'self_service' && "I'll Do It Myself"}
            {requestType === 'delegated' && 'Delegate to Someone'}
          </div>
        )}

        {/* Progress Steps - Hide for delegated (simpler flow) */}
        {requestType !== 'delegated' && (
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
        )}

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

            {/* Request Type Specific Content */}
            {requestType === 'delegated' ? (
              <>
                {/* Delegation Form */}
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 space-y-4">
                  <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                    <Users className="w-4 h-4" />
                    <span className="font-medium text-sm">Delegate Information</span>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="delegateName">Delegate's Name *</Label>
                    <Input
                      id="delegateName"
                      placeholder="John Smith"
                      value={formData.delegateName}
                      onChange={(e) => handleFieldChange("delegateName", e.target.value)}
                      className="bg-background"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="delegateEmail">Delegate's Email *</Label>
                    <Input
                      id="delegateEmail"
                      type="email"
                      placeholder="delegate@company.com"
                      value={formData.delegateEmail}
                      onChange={(e) => handleFieldChange("delegateEmail", e.target.value)}
                      className="bg-background"
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      We'll send them project details and access information
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="delegateRole">Delegate's Role/Relationship</Label>
                    <Select
                      value={formData.delegateRole}
                      onValueChange={(value) => handleFieldChange("delegateRole", value)}
                    >
                      <SelectTrigger className="bg-background">
                        <SelectValue placeholder="Select relationship" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="team-member">Team Member</SelectItem>
                        <SelectItem value="contractor">Contractor / Freelancer</SelectItem>
                        <SelectItem value="agency">Agency Partner</SelectItem>
                        <SelectItem value="va">Virtual Assistant</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Project Instructions */}
                <div className="space-y-2">
                  <Label htmlFor="projectTitle">Project Title *</Label>
                  <Input
                    id="projectTitle"
                    placeholder="Brief title for this project"
                    value={formData.projectTitle}
                    onChange={(e) => handleFieldChange("projectTitle", e.target.value)}
                    className="bg-background"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="instructions">Instructions for Delegate *</Label>
                  <Textarea
                    id="instructions"
                    placeholder="Provide clear instructions and expectations..."
                    value={formData.instructions}
                    onChange={(e) => handleFieldChange("instructions", e.target.value)}
                    rows={4}
                    className="bg-background"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dueDate">Due Date</Label>
                    <Input 
                      id="dueDate" 
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => handleFieldChange("dueDate", e.target.value)}
                      className="bg-background"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="delegatePriority">Priority</Label>
                    <Select
                      value={formData.delegatePriority}
                      onValueChange={(value) => handleFieldChange("delegatePriority", value)}
                    >
                      <SelectTrigger className="bg-background">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="additionalInfo">Additional Notes</Label>
                  <Textarea
                    id="additionalInfo"
                    placeholder="Any additional context or resources to share..."
                    value={formData.additionalInfo}
                    onChange={(e) => handleFieldChange("additionalInfo", e.target.value)}
                    rows={2}
                    className="bg-background"
                  />
                </div>

                {/* What happens next for delegation */}
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-sm font-medium text-foreground mb-2">What happens next?</p>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-0.5">•</span>
                      Your delegate will receive an email with project details
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-0.5">•</span>
                      They'll have access to complete the request
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-0.5">•</span>
                      You'll be notified of progress and completion
                    </li>
                  </ul>
                </div>
              </>
            ) : requestType === 'self_service' ? (
              <>
                {/* Self-service simplified form */}
                {/* Section 2: Service-Specific Fields - still show for self_service */}
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

                <div className="space-y-2">
                  <Label htmlFor="goals">What are you trying to achieve? *</Label>
                  <Textarea
                    id="goals"
                    placeholder="Describe your goals for this project..."
                    value={formData.goals}
                    onChange={(e) => handleFieldChange("goals", e.target.value)}
                    rows={3}
                    className="bg-background"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="experience">Your Experience Level</Label>
                  <Select
                    value={formData.experience}
                    onValueChange={(value) => handleFieldChange("experience", value)}
                  >
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Select your experience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner - New to this</SelectItem>
                      <SelectItem value="intermediate">Intermediate - Some experience</SelectItem>
                      <SelectItem value="advanced">Advanced - Very experienced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timeline">When do you want to complete this?</Label>
                  <Select
                    value={formData.timeline}
                    onValueChange={(value) => handleFieldChange("timeline", value)}
                  >
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Select timeline" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="this-week">This week</SelectItem>
                      <SelectItem value="this-month">This month</SelectItem>
                      <SelectItem value="next-month">Next month</SelectItem>
                      <SelectItem value="flexible">Flexible / No rush</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Resources Preview */}
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                    <BookOpen className="w-4 h-4" />
                    <span className="font-medium text-sm">What you'll receive:</span>
                  </div>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                      <span>Step-by-step project checklist</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                      <span>Curated resources and templates</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                      <span>Best practices guide</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                      <span>Access to community support</span>
                    </li>
                  </ul>
                </div>

                {/* What happens next for self-service */}
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-sm font-medium text-foreground mb-2">What happens next?</p>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-500 mt-0.5">•</span>
                      You'll receive an email with your DIY resources
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-500 mt-0.5">•</span>
                      Access our templates and guides immediately
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-500 mt-0.5">•</span>
                      Join our community for support
                    </li>
                  </ul>
                </div>
              </>
            ) : (
              <>
                {/* Done for you - Full form (existing) */}
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
              </>
            )}

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

        <p className="text-xs text-muted-foreground text-center mt-6">
          We respect your privacy. No spam, ever. Your information is secure.
        </p>
      </div>

      {/* Post-Submit Modal */}
      <PostSubmitModal
        isOpen={showPostSubmit}
        onClose={() => {
          setShowPostSubmit(false);
          navigate("/service-confirmation", {
            state: {
              serviceName: service.name,
              serviceSlug: service.slug,
              requestType: requestType,
            },
          });
        }}
        requestType={requestType}
        onScheduleMeeting={handleScheduleMeeting}
        onSkip={handleSkipMeeting}
        serviceName={service.name}
        delegateName={formData.delegateName}
        delegateEmail={formData.delegateEmail}
      />
    </div>
  );
};

export default ServiceIntakePage;
