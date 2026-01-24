import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { DepartmentConfig, Role, HiringType } from '@/lib/departmentConfigs';
import { ServiceRequestType } from '@/components/ServiceTypeModal';
import { PostSubmitModal } from '@/components/PostSubmitModal';
import { Building2, User, Users, BookOpen, CheckCircle2, Bot } from 'lucide-react';
import { 
  submitForm, 
  buildActionPayload,
  WEBHOOKS 
} from '@/lib/webhookService';
import {
  actionRequestSchema,
  actionIdeaSchema,
  actionDelegateSchema,
  actionHireSchema,
} from '@/lib/formSchemas';

type FormType = 'request' | 'idea' | 'delegate' | 'hire';

interface ActionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  formType: FormType;
  department: DepartmentConfig;
  actionTitle?: string;
  selectedRole?: Role;
  serviceRequestType?: ServiceRequestType | null;
}

const getRequestTypeLabel = (type: ServiceRequestType | null | undefined) => {
  switch (type) {
    case 'done_for_you':
      return { label: 'Do It For Me', icon: Building2, color: 'text-primary' };
    case 'self_service':
      return { label: "I'll Do It Myself", icon: User, color: 'text-emerald-500' };
    case 'delegated':
      return { label: 'Delegate to Someone', icon: Users, color: 'text-blue-500' };
    default:
      return null;
  }
};

const getHiringTypeConfig = (hiringType: HiringType = 'both') => {
  switch (hiringType) {
    case 'human':
      return { label: 'Hiring: Human', icon: User, bgClass: 'bg-blue-500/10', textClass: 'text-blue-600' };
    case 'ai':
      return { label: 'Hiring: AI Agent', icon: Bot, bgClass: 'bg-purple-500/10', textClass: 'text-purple-600' };
    case 'both':
    default:
      return { label: 'Hiring: Human or AI', icon: Users, bgClass: 'bg-emerald-500/10', textClass: 'text-emerald-600' };
  }
};

export const ActionFormModal = ({
  isOpen,
  onClose,
  formType,
  department,
  actionTitle,
  selectedRole,
  serviceRequestType,
}: ActionFormModalProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPostSubmit, setShowPostSubmit] = useState(false);
  const [submittedDelegateInfo, setSubmittedDelegateInfo] = useState<{ name?: string; email?: string }>({});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formElement = e.currentTarget;
    const formDataRaw = new FormData(formElement);
    const data = Object.fromEntries(formDataRaw.entries()) as Record<string, string>;

    // Get the appropriate form type string
    const formTypeMap = {
      request: 'action_request',
      idea: 'action_idea',
      delegate: 'action_delegate',
      hire: 'action_hire',
    } as const;

    const formTypeString = formTypeMap[formType];
    const title = actionTitle || getFormTitle();

    // Build the standardized payload
    const payload = buildActionPayload(
      formTypeString,
      department.name,
      department.slug,
      title,
      {
        ...data,
        // Include request type for request forms
        ...(formType === 'request' && { request_type: serviceRequestType || null }),
      }
    );

    // Select the appropriate schema based on form type
    const schemaMap = {
      action_request: actionRequestSchema,
      action_idea: actionIdeaSchema,
      action_delegate: actionDelegateSchema,
      action_hire: actionHireSchema,
    };

    const schema = schemaMap[formTypeString];
    const useHiringWebhook = formType === 'hire';

    try {
      const result = await submitForm(payload, schema, { 
        useHiringWebhook,
        webhookUrl: useHiringWebhook ? WEBHOOKS.HIRING : WEBHOOKS.DEFAULT,
      });

      if (!result.success) {
        toast({
          title: 'Validation Error',
          description: result.error || 'Please check your inputs.',
          variant: 'destructive',
        });
        setIsSubmitting(false);
        return;
      }

      // Store delegate info for post-submit modal
      if (serviceRequestType === 'delegated') {
        setSubmittedDelegateInfo({
          name: data.delegateName,
          email: data.delegateEmail,
        });
      }

      // Show post-submit modal for request forms with a serviceRequestType
      if (formType === 'request' && serviceRequestType) {
        setShowPostSubmit(true);
      } else {
        // For other form types, show toast and close
        toast({
          title: 'Submitted Successfully',
          description: `Your ${formType} has been submitted to ${department.name}.`,
        });
        onClose();
      }
    } catch (error) {
      toast({
        title: 'Submission Error',
        description: 'There was an error submitting your request. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleScheduleMeeting = () => {
    window.open('https://gfunnel.com/discover', '_blank');
    setShowPostSubmit(false);
    onClose();
  };

  const handleSkipMeeting = () => {
    setShowPostSubmit(false);
    onClose();
  };

  const getFormTitle = () => {
    if (selectedRole) return `Hire: ${selectedRole.title}`;
    if (actionTitle) return actionTitle;
    switch (formType) {
      case 'request':
        return 'Submit Request';
      case 'idea':
        return 'Share Idea';
      case 'delegate':
        return 'Delegate Task';
      case 'hire':
        return 'Hire for Role';
      default:
        return 'Submit';
    }
  };

  const requestTypeInfo = getRequestTypeLabel(serviceRequestType);

  // Render different form content based on serviceRequestType
  const renderRequestTypeContent = () => {
    // Self-service: simplified form with resources
    if (serviceRequestType === 'self_service') {
      return (
        <>
          <div className="space-y-2">
            <Label htmlFor="goals">What are you trying to achieve? *</Label>
            <Textarea
              id="goals"
              name="goals"
              placeholder="Describe your goals for this project..."
              rows={3}
              required
              maxLength={2000}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="experience">Your Experience Level</Label>
            <Select name="experience">
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
            <Select name="timeline">
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
        </>
      );
    }

    // Delegated: form with delegate info
    if (serviceRequestType === 'delegated') {
      return (
        <>
          {/* Delegate Information Section */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 space-y-4">
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
              <Users className="w-4 h-4" />
              <span className="font-medium text-sm">Delegate Information</span>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="delegateName">Delegate's Name *</Label>
              <Input
                id="delegateName"
                name="delegateName"
                placeholder="John Smith"
                required
                maxLength={100}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="delegateEmail">Delegate's Email *</Label>
              <Input
                id="delegateEmail"
                name="delegateEmail"
                type="email"
                placeholder="delegate@company.com"
                required
                maxLength={255}
              />
              <p className="text-xs text-muted-foreground">
                We'll send them project details and access information
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="delegateRole">Delegate's Role/Relationship</Label>
              <Select name="delegateRole">
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
              name="projectTitle"
              placeholder="Brief title for this project"
              required
              maxLength={200}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="instructions">Instructions for Delegate *</Label>
            <Textarea
              id="instructions"
              name="instructions"
              placeholder="Provide clear instructions and expectations..."
              rows={4}
              required
              maxLength={2000}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input id="dueDate" name="dueDate" type="date" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="delegatePriority">Priority</Label>
              <Select name="delegatePriority">
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
            <Label htmlFor="additionalNotes">Additional Notes</Label>
            <Textarea
              id="additionalNotes"
              name="additionalNotes"
              placeholder="Any additional context or resources to share..."
              rows={2}
              maxLength={1000}
            />
          </div>
        </>
      );
    }

    // Done for you: full form (existing behavior)
    return (
      <>
        <div className="space-y-2">
          <Label htmlFor="requestType">Request Type</Label>
          <Select name="requestType" required>
            <SelectTrigger className="bg-background">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {department.quickActions.map((action, i) => (
                <SelectItem key={i} value={action.title}>
                  {action.icon} {action.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="priority">Priority</Label>
          <Select name="priority" required>
            <SelectTrigger className="bg-background">
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="title">Title / Summary</Label>
          <Input 
            id="title" 
            name="title" 
            placeholder="Brief summary of your request" 
            required 
            maxLength={200}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Detailed Description</Label>
          <Textarea
            id="description"
            name="description"
            placeholder="Provide details about your request"
            rows={4}
            required
            maxLength={2000}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="targetDate">Target Completion Date</Label>
          <Input id="targetDate" name="targetDate" type="date" />
        </div>
      </>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{getFormTitle()}</DialogTitle>
          <DialogDescription>
            {department.name} • Fill out the form below
          </DialogDescription>
        </DialogHeader>

        {/* Request Type Badge */}
        {requestTypeInfo && (
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted text-sm font-medium w-fit ${requestTypeInfo.color}`}>
            <requestTypeInfo.icon className="w-4 h-4" />
            {requestTypeInfo.label}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {/* Email field - required on all forms */}
          <div className="space-y-2">
            <Label htmlFor="email">Your Email *</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@company.com"
              required
              maxLength={255}
            />
            <p className="text-xs text-muted-foreground">
              Required for tracking and follow-up
            </p>
          </div>

          {/* Video Link field - optional on all forms */}
          <div className="space-y-2">
            <Label htmlFor="videoLink">Video Explanation (Optional)</Label>
            <Input
              id="videoLink"
              name="videoLink"
              type="url"
              placeholder="https://www.loom.com/share/... or OnScreen link"
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground">
              Add a <a href="https://www.loom.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Loom</a> or <a href="https://onscreen.gfunnel.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">OnScreen</a> video to explain your request
            </p>
          </div>

          {/* Request type specific content */}
          {formType === 'request' && renderRequestTypeContent()}

          {formType === 'idea' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="ideaTitle">Idea Title</Label>
                <Input 
                  id="ideaTitle" 
                  name="ideaTitle" 
                  placeholder="Name your idea" 
                  required 
                  maxLength={200}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="areaOfImpact">Department / Area of Impact</Label>
                <Input
                  id="areaOfImpact"
                  name="areaOfImpact"
                  defaultValue={department.name}
                  required
                  maxLength={100}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="problem">Problem Being Solved</Label>
                <Textarea
                  id="problem"
                  name="problem"
                  placeholder="What problem does this solve?"
                  rows={3}
                  required
                  maxLength={2000}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="solution">Proposed Solution</Label>
                <Textarea
                  id="solution"
                  name="solution"
                  placeholder="Describe your proposed solution"
                  rows={3}
                  required
                  maxLength={2000}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="benefits">Expected Benefits</Label>
                <Textarea
                  id="benefits"
                  name="benefits"
                  placeholder="What benefits would this bring?"
                  rows={2}
                  maxLength={1000}
                />
              </div>
            </>
          )}

          {formType === 'delegate' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="taskTitle">Task Title</Label>
                <Input 
                  id="taskTitle" 
                  name="taskTitle" 
                  placeholder="Name the task" 
                  required 
                  maxLength={200}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="assignTo">Assign To</Label>
                <Select name="assignTo" required>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Select team member" />
                  </SelectTrigger>
                  <SelectContent>
                    {department.roles.map((role, i) => (
                      <SelectItem key={i} value={role.title}>
                        {role.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="taskPriority">Priority</Label>
                <Select name="taskPriority" required>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="delegateDueDate">Due Date</Label>
                <Input id="delegateDueDate" name="delegateDueDate" type="date" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="taskDescription">Task Description</Label>
                <Textarea
                  id="taskDescription"
                  name="taskDescription"
                  placeholder="Describe the task in detail"
                  rows={3}
                  required
                  maxLength={2000}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deliverables">Deliverables Expected</Label>
                <Textarea
                  id="deliverables"
                  name="deliverables"
                  placeholder="What should be delivered?"
                  rows={2}
                  maxLength={1000}
                />
              </div>
            </>
          )}

          {formType === 'hire' && selectedRole && (
            <>
              {/* Hiring Type Badge */}
              {(() => {
                const hiringConfig = getHiringTypeConfig(selectedRole.hiringType);
                const HiringIcon = hiringConfig.icon;
                return (
                  <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium w-fit ${hiringConfig.bgClass} ${hiringConfig.textClass}`}>
                    <HiringIcon className="w-4 h-4" />
                    {hiringConfig.label}
                  </div>
                );
              })()}
              
              <div className="space-y-2">
                <Label htmlFor="roleTitle">Role Title</Label>
                <Input
                  id="roleTitle"
                  name="roleTitle"
                  defaultValue={selectedRole?.title || ''}
                  required
                  maxLength={100}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Input id="department" name="department" defaultValue={department.name} readOnly />
              </div>
              <div className="space-y-2">
                <Label htmlFor="jobDescription">Job Description</Label>
                <Textarea
                  id="jobDescription"
                  name="jobDescription"
                  placeholder="Describe the role responsibilities"
                  rows={4}
                  required
                  maxLength={3000}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date Needed</Label>
                <Input id="startDate" name="startDate" type="date" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="employmentType">Employment Type</Label>
                <Select name="employmentType" required>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full-time">Full-time</SelectItem>
                    <SelectItem value="part-time">Part-time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </Button>
          </div>
        </form>
      </DialogContent>

      {/* Post-Submit Modal */}
      <PostSubmitModal
        isOpen={showPostSubmit}
        onClose={() => {
          setShowPostSubmit(false);
          onClose();
        }}
        requestType={serviceRequestType || null}
        onScheduleMeeting={handleScheduleMeeting}
        onSkip={handleSkipMeeting}
        delegateName={submittedDelegateInfo.name}
        delegateEmail={submittedDelegateInfo.email}
      />
    </Dialog>
  );
};
