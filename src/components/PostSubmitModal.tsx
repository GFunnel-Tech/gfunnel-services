import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Calendar, ArrowRight, Mail, Users, ExternalLink } from 'lucide-react';
import { ServiceRequestType } from '@/components/ServiceTypeModal';

interface PostSubmitModalProps {
  isOpen: boolean;
  onClose: () => void;
  requestType: ServiceRequestType | null;
  onScheduleMeeting: () => void;
  onSkip: () => void;
  serviceName?: string;
  delegateName?: string;
  delegateEmail?: string;
}

export const PostSubmitModal = ({
  isOpen,
  onClose,
  requestType,
  onScheduleMeeting,
  onSkip,
  serviceName,
  delegateName,
  delegateEmail,
}: PostSubmitModalProps) => {
  // Delegated flow - different confirmation without meeting prompt
  if (requestType === 'delegated') {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-blue-500" />
            </div>
            <DialogTitle className="text-2xl">Delegation Sent!</DialogTitle>
            <DialogDescription className="text-base">
              Your delegate will receive everything they need
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="bg-muted/50 rounded-lg p-4 space-y-3">
              <p className="text-sm font-medium text-foreground">
                {delegateName || 'Your delegate'} will receive:
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <Mail className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span>Email with project details {delegateEmail && `at ${delegateEmail}`}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span>Access to complete the request</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span>Instructions you provided</span>
                </li>
              </ul>
            </div>

            <p className="text-sm text-muted-foreground text-center">
              You'll be notified when they take action.
            </p>
          </div>

          <Button onClick={onSkip} className="w-full" size="lg">
            Done
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </DialogContent>
      </Dialog>
    );
  }

  // Done for you / Self service - show meeting scheduler prompt
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <CheckCircle2 className="w-8 h-8 text-primary" />
          </div>
          <DialogTitle className="text-2xl">Request Submitted!</DialogTitle>
          <DialogDescription className="text-base">
            {requestType === 'self_service' 
              ? "You're all set! Check your email for resources."
              : "We'll be in touch soon with next steps."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-4">
          <p className="text-center text-foreground font-medium">
            Would you like to schedule a discovery meeting to discuss your project?
          </p>

          {/* Schedule Meeting Button */}
          <Button
            onClick={onScheduleMeeting}
            variant="default"
            size="lg"
            className="w-full"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Yes, Schedule a Meeting
            <ExternalLink className="w-3 h-3 ml-2 opacity-60" />
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            Get 1-on-1 time with our team to discuss your goals
          </p>

          {/* Skip Button */}
          <Button
            onClick={onSkip}
            variant="outline"
            size="lg"
            className="w-full"
          >
            <CheckCircle2 className="w-4 h-4 mr-2" />
            No Thanks, I'm Good
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            We'll follow up via email within 24 hours
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
