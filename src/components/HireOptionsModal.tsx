import React, { useState } from "react";
import { User, Bot, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export type ProfileType = 'human' | 'ai' | 'both';

export type AIAddon = 'voice' | 'sms' | 'integration';

export interface HireFormData {
  profileType: ProfileType;
  // Human fields
  humanName?: string;
  humanEmail?: string;
  humanPhone?: string;
  humanPhotoUrl?: string;
  googleMeetLink?: string;
  // AI fields
  aiName?: string;
  aiType?: string; // Will be "Chat" + selected addons
  aiAddons?: AIAddon[];
  aiAgentId?: string;
  aiEmbedUrl?: string;
}

interface HireOptionsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  roleTitle: string;
  departmentName: string;
  onSubmit: (data: HireFormData) => Promise<void>;
  defaultType?: 'human' | 'ai' | null;
}

export const HireOptionsModal = ({ 
  open, 
  onOpenChange, 
  roleTitle,
  departmentName,
  onSubmit,
  defaultType = null
}: HireOptionsModalProps) => {
  const [step, setStep] = useState<'select' | 'form'>('select');
  const [profileType, setProfileType] = useState<ProfileType | null>(null);
  const [formData, setFormData] = useState<Partial<HireFormData>>({});
  const [aiAddons, setAiAddons] = useState<AIAddon[]>([]);
  const [saving, setSaving] = useState(false);

  // Auto-select type when defaultType is provided and modal opens
  React.useEffect(() => {
    if (open && defaultType) {
      setProfileType(defaultType);
      setStep('form');
    }
  }, [open, defaultType]);

  const handleTypeSelect = (type: ProfileType) => {
    setProfileType(type);
    setStep('form');
  };

  const handleSubmit = async () => {
    if (!profileType) return;
    
    setSaving(true);
    try {
      // Build AI type string: "Chat" + any selected addons
      const aiTypeString = aiAddons.length > 0 
        ? `Chat, ${aiAddons.map(a => a.charAt(0).toUpperCase() + a.slice(1)).join(', ')}`
        : 'Chat';
      
      await onSubmit({ 
        profileType, 
        ...formData,
        aiType: (profileType === 'ai' || profileType === 'both') ? aiTypeString : formData.aiType,
        aiAddons 
      });
      onOpenChange(false);
      resetForm();
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setStep('select');
    setProfileType(null);
    setFormData({});
    setAiAddons([]);
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) resetForm();
    onOpenChange(newOpen);
  };

  const updateField = (key: keyof HireFormData, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const toggleAddon = (addon: AIAddon) => {
    setAiAddons(prev => 
      prev.includes(addon) 
        ? prev.filter(a => a !== addon)
        : [...prev, addon]
    );
  };

  const addonOptions: { id: AIAddon; label: string; costNote: string }[] = [
    { id: 'voice', label: 'Voice', costNote: 'Phone number + usage fees' },
    { id: 'sms', label: 'SMS', costNote: 'Phone number + per-message fees' },
    { id: 'integration', label: 'Integration', costNote: 'API access + usage fees' },
  ];

  const typeOptions = [
    { 
      type: 'human' as ProfileType, 
      icon: User, 
      label: 'Human', 
      description: 'Assign a team member to this role' 
    },
    { 
      type: 'ai' as ProfileType, 
      icon: Bot, 
      label: 'AI Agent', 
      description: 'Use an AI assistant for this role' 
    },
    { 
      type: 'both' as ProfileType, 
      icon: Users, 
      label: 'Both', 
      description: 'Human lead with AI support' 
    },
  ];

  const isFormValid = () => {
    if (!profileType) return false;
    
    if (profileType === 'human' || profileType === 'both') {
      if (!formData.humanName?.trim()) return false;
    }
    if (profileType === 'ai' || profileType === 'both') {
      if (!formData.aiName?.trim()) return false;
    }
    return true;
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {step === 'select' ? 'Fill This Role' : `Add ${profileType === 'both' ? 'Team' : profileType === 'ai' ? 'AI Agent' : 'Team Member'}`}
          </DialogTitle>
          <DialogDescription>
            {step === 'select' 
              ? `Choose how to fill the ${roleTitle} role in ${departmentName}` 
              : `Enter details for ${roleTitle}`
            }
          </DialogDescription>
        </DialogHeader>

        {step === 'select' ? (
          <div className="grid gap-3 py-4">
            {typeOptions.map((option) => (
              <button
                key={option.type}
                onClick={() => handleTypeSelect(option.type)}
                className={cn(
                  "flex items-center gap-4 p-4 rounded-lg border text-left transition-all",
                  "hover:bg-muted/50 hover:border-primary/50"
                )}
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <option.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{option.label}</p>
                  <p className="text-sm text-muted-foreground">{option.description}</p>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="space-y-6 py-4">
            {/* Human Fields */}
            {(profileType === 'human' || profileType === 'both') && (
              <div className="space-y-4">
                {profileType === 'both' && (
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <User className="w-4 h-4" />
                    Human Team Member
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="humanName">Name *</Label>
                  <Input 
                    id="humanName"
                    placeholder="John Doe"
                    value={formData.humanName || ''}
                    onChange={(e) => updateField('humanName', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="humanEmail">Email</Label>
                  <Input 
                    id="humanEmail"
                    type="email"
                    placeholder="john@company.com"
                    value={formData.humanEmail || ''}
                    onChange={(e) => updateField('humanEmail', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="humanPhone">Phone</Label>
                  <Input 
                    id="humanPhone"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    value={formData.humanPhone || ''}
                    onChange={(e) => updateField('humanPhone', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="googleMeetLink">Google Meet Link</Label>
                  <Input 
                    id="googleMeetLink"
                    placeholder="https://meet.google.com/..."
                    value={formData.googleMeetLink || ''}
                    onChange={(e) => updateField('googleMeetLink', e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* AI Fields */}
            {(profileType === 'ai' || profileType === 'both') && (
              <div className="space-y-4">
                {profileType === 'both' && (
                  <>
                    <div className="border-t my-4" />
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                      <Bot className="w-4 h-4" />
                      AI Agent
                    </div>
                  </>
                )}
                <div className="space-y-2">
                  <Label htmlFor="aiName">AI Name *</Label>
                  <Input 
                    id="aiName"
                    placeholder="Sales Assistant"
                    value={formData.aiName || ''}
                    onChange={(e) => updateField('aiName', e.target.value)}
                  />
                </div>
                <div className="space-y-3">
                  <Label>AI Type</Label>
                  <div className="p-3 rounded-lg bg-muted/50 border">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      <span className="font-medium text-sm">Chat</span>
                      <span className="text-xs text-muted-foreground">(included)</span>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground mb-2">Optional add-ons (additional cost):</p>
                      {addonOptions.map((addon) => (
                        <div 
                          key={addon.id}
                          className="flex items-start gap-3 p-2 rounded-md hover:bg-muted/50 transition-colors"
                        >
                          <Checkbox
                            id={addon.id}
                            checked={aiAddons.includes(addon.id)}
                            onCheckedChange={() => toggleAddon(addon.id)}
                          />
                          <div className="flex-1">
                            <label 
                              htmlFor={addon.id} 
                              className="text-sm font-medium cursor-pointer"
                            >
                              {addon.label}
                            </label>
                            <p className="text-xs text-muted-foreground">{addon.costNote}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="aiAgentId">Agent ID (optional)</Label>
                  <Input 
                    id="aiAgentId"
                    placeholder="agent-12345"
                    value={formData.aiAgentId || ''}
                    onChange={(e) => updateField('aiAgentId', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="aiEmbedUrl">Chat Widget URL (optional)</Label>
                  <Input 
                    id="aiEmbedUrl"
                    placeholder="https://...apiii.co/api/widget/..."
                    value={formData.aiEmbedUrl || ''}
                    onChange={(e) => updateField('aiEmbedUrl', e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    The embed URL for the AI chat widget
                  </p>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <Button 
                variant="outline" 
                onClick={() => setStep('select')}
                className="flex-1"
              >
                Back
              </Button>
              <Button 
                onClick={handleSubmit}
                disabled={!isFormValid() || saving}
                className="flex-1"
              >
                {saving ? 'Saving...' : 'Save Role'}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
