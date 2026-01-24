import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Loader2, ShieldCheck, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface EmailVerificationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onVerify: (email: string) => Promise<boolean>;
  title?: string;
  description?: string;
}

export const EmailVerificationModal = ({
  open,
  onOpenChange,
  onVerify,
  title = "Verify Your Email",
  description = "Enter your email to access your personalized content."
}: EmailVerificationModalProps) => {
  const [email, setEmail] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError("Please enter your email");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setError(null);
    setIsVerifying(true);

    try {
      const success = await onVerify(email.trim().toLowerCase());
      if (!success) {
        setError("Email not found. Please check and try again.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" data-email-modal>
        <DialogHeader>
          <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
            <ShieldCheck className="w-6 h-6 text-primary" />
          </div>
          <DialogTitle className="text-center">{title}</DialogTitle>
          <DialogDescription className="text-center">
            {description}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError(null);
                }}
                className="pl-10"
                disabled={isVerifying}
                autoFocus
              />
            </div>
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
          </div>

          <Button 
            type="submit" 
            className="w-full"
            disabled={isVerifying || !email.trim()}
          >
            {isVerifying ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Verifying...
              </>
            ) : (
              "Continue"
            )}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Your email is used to identify your account and personalize your experience.
          </p>

          {/* Admin/Staff Login Section */}
          <div className="pt-4 border-t border-border">
            <Link 
              to="/admin/login"
              className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <KeyRound className="w-4 h-4" />
              Admin or Staff Login
            </Link>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
