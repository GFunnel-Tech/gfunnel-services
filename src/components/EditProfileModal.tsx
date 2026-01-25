import React, { useState, useEffect } from "react";
import { User, Bot } from "lucide-react";
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
import { CompanyRole } from "@/lib/walletTypes";
import { AIAddon, HireFormData, ProfileType } from "@/components/HireOptionsModal";

interface EditProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  roleData: CompanyRole;
  onSubmit: (data: HireFormData) => Promise<void>;
}

export const EditProfileModal = ({ 
  open, 
  onOpenChange, 
  roleData,
  onSubmit 
}: EditProfileModalProps) => {
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<HireFormData>>({});
  const [aiAddons, setAiAddons] = useState<AIAddon[]>([]);

  // Initialize form data when modal opens or roleData changes
  useEffect(() => {
    if (open && roleData) {
      // Parse AI addons from aiType string
      const parsedAddons: AIAddon[] = [];
      if (roleData.ai_type) {
        if (roleData.ai_type.toLowerCase().includes('voice')) parsedAddons.push('voice');
        if (roleData.ai_type.toLowerCase().includes('sms')) parsedAddons.push('sms');
        if (roleData.ai_type.toLowerCase().includes('integration')) parsedAddons.push('integration');
      }
      
      setFormData({
        humanName: roleData.assigned_name || '',
        humanEmail: roleData.assigned_email || '',
        humanPhone: roleData.assigned_phone || '',
        humanPhotoUrl: roleData.assigned_photo_url || '',
        googleMeetLink: roleData.google_meet_link || '',
        aiName: roleData.ai_name || '',
        aiAgentId: roleData.ai_agent_id || '',
        aiEmbedUrl: roleData.ai_embed_url || '',
      });
      setAiAddons(parsedAddons);
    }
  }, [open, roleData]);

  const profileType = roleData?.profile_type as ProfileType || 'human';
  const hasHuman = profileType === 'human' || profileType === 'both';
  const hasAI = profileType === 'ai' || profileType === 'both';

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const aiTypeString = aiAddons.length > 0 
        ? `Chat, ${aiAddons.map(a => a.charAt(0).toUpperCase() + a.slice(1)).join(', ')}`
        : 'Chat';

      await onSubmit({ 
        profileType, 
        ...formData,
        aiType: hasAI ? aiTypeString : formData.aiType,
        aiAddons 
      });
      onOpenChange(false);
    } finally {
      setSaving(false);
    }
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

  const isFormValid = () => {
    if (hasHuman && !formData.humanName?.trim()) return false;
    if (hasAI && !formData.aiName?.trim()) return false;
    return true;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Update {roleData?.role_title} role details
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Human Fields */}
          {hasHuman && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium text-blue-600">
                <User className="w-4 h-4" />
                Human Team Member
              </div>
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
                <Label htmlFor="humanPhotoUrl">Photo URL</Label>
                <Input 
                  id="humanPhotoUrl"
                  placeholder="https://example.com/photo.jpg"
                  value={formData.humanPhotoUrl || ''}
                  onChange={(e) => updateField('humanPhotoUrl', e.target.value)}
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
          {hasAI && (
            <div className="space-y-4">
              {hasHuman && <div className="border-t my-4" />}
              <div className="flex items-center gap-2 text-sm font-medium text-purple-600">
                <Bot className="w-4 h-4" />
                AI Agent
              </div>
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
                    <p className="text-xs text-muted-foreground mb-2">Optional add-ons:</p>
                    {addonOptions.map((addon) => (
                      <div 
                        key={addon.id}
                        className="flex items-start gap-3 p-2 rounded-md hover:bg-muted/50 transition-colors"
                      >
                        <Checkbox
                          id={`edit-${addon.id}`}
                          checked={aiAddons.includes(addon.id)}
                          onCheckedChange={() => toggleAddon(addon.id)}
                        />
                        <div className="flex-1">
                          <label 
                            htmlFor={`edit-${addon.id}`} 
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
                <Label htmlFor="aiAgentId">Agent ID</Label>
                <Input 
                  id="aiAgentId"
                  placeholder="agent-12345"
                  value={formData.aiAgentId || ''}
                  onChange={(e) => updateField('aiAgentId', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="aiEmbedUrl">Chat Widget URL</Label>
                <Input 
                  id="aiEmbedUrl"
                  placeholder="https://...apiii.co/api/widget/..."
                  value={formData.aiEmbedUrl || ''}
                  onChange={(e) => updateField('aiEmbedUrl', e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  The embed URL for the AI chat widget (from your AI agent provider)
                </p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={!isFormValid() || saving}
              className="flex-1"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
