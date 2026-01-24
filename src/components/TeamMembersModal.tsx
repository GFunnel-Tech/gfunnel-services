import { useState } from "react";
import { UserPlus, Trash2, Crown, Mail, User } from "lucide-react";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface CompanyMember {
  id: string;
  email: string;
  display_name: string | null;
  role: string;
  is_primary: boolean;
}

interface TeamMembersModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  companyId: string;
  companyName: string;
  members: CompanyMember[];
  currentUserEmail: string;
  onMembersChange: () => void;
}

export const TeamMembersModal = ({
  open,
  onOpenChange,
  companyId,
  companyName,
  members,
  currentUserEmail,
  onMembersChange,
}: TeamMembersModalProps) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newName, setNewName] = useState("");
  const [newRole, setNewRole] = useState("member");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleAddMember = async () => {
    if (!newEmail.trim()) return;
    
    setIsSubmitting(true);
    try {
      const { error } = await supabase.functions.invoke('manage-company-users', {
        body: {
          action: 'add',
          company_id: companyId,
          email: newEmail.toLowerCase().trim(),
          display_name: newName.trim() || null,
          role: newRole,
          requester_email: currentUserEmail,
        }
      });

      if (error) throw error;
      
      toast.success(`Added ${newEmail} to the team`);
      setNewEmail("");
      setNewName("");
      setNewRole("member");
      setShowAddForm(false);
      onMembersChange();
    } catch (err: any) {
      toast.error(err.message || "Failed to add team member");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveMember = async () => {
    if (!deleteId) return;
    
    try {
      const { error } = await supabase.functions.invoke('manage-company-users', {
        body: {
          action: 'remove',
          company_id: companyId,
          user_id: deleteId,
          requester_email: currentUserEmail,
        }
      });

      if (error) throw error;
      
      toast.success("Team member removed");
      setDeleteId(null);
      onMembersChange();
    } catch (err: any) {
      toast.error(err.message || "Failed to remove team member");
    }
  };

  const getRoleBadgeColor = (role: string, isPrimary: boolean) => {
    if (isPrimary) return "bg-amber-500/10 text-amber-600 border-amber-500/20";
    if (role === "owner" || role === "admin") return "bg-purple-500/10 text-purple-600 border-purple-500/20";
    return "bg-muted text-muted-foreground";
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Manage Team</DialogTitle>
            <DialogDescription>
              Add or remove team members who can access {companyName}'s service account
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Member List */}
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {members.map((member) => (
                <div
                  key={member.id}
                  className={cn(
                    "flex items-center justify-between p-3 rounded-lg border",
                    member.is_primary && "bg-amber-500/5 border-amber-500/20"
                  )}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center shrink-0">
                      {member.is_primary ? (
                        <Crown className="w-4 h-4 text-amber-500" />
                      ) : (
                        <User className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">
                        {member.display_name || member.email.split('@')[0]}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">{member.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant="outline" className={cn("text-xs", getRoleBadgeColor(member.role, member.is_primary))}>
                      {member.is_primary ? "Primary" : member.role}
                    </Badge>
                    {!member.is_primary && member.email.toLowerCase() !== currentUserEmail.toLowerCase() && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => setDeleteId(member.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Add Member Form */}
            {showAddForm ? (
              <div className="space-y-3 p-3 rounded-lg border border-dashed bg-muted/30">
                <div className="space-y-2">
                  <Label htmlFor="newEmail">Email *</Label>
                  <Input
                    id="newEmail"
                    type="email"
                    placeholder="team@company.com"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newName">Display Name</Label>
                  <Input
                    id="newName"
                    placeholder="John Doe"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newRole">Role</Label>
                  <Select value={newRole} onValueChange={setNewRole}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="member">Member</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setShowAddForm(false);
                      setNewEmail("");
                      setNewName("");
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={handleAddMember}
                    disabled={!newEmail.trim() || isSubmitting}
                  >
                    {isSubmitting ? "Adding..." : "Add Member"}
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setShowAddForm(true)}
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Add Team Member
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove team member?</AlertDialogTitle>
            <AlertDialogDescription>
              This person will no longer have access to the service account. You can add them back later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleRemoveMember} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
