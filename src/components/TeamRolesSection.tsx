import { useState } from "react";
import { ChevronDown, ChevronRight, User, UserPlus, Clock, Check, Pencil, X, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { CompanyRole } from "@/lib/walletTypes";
import { departmentConfigs, getDepartmentColorClasses } from "@/lib/departmentConfigs";
import { ProfileCard, ProfileData } from "./ProfileCard";
import { HireOptionsModal, HireFormData } from "./HireOptionsModal";

interface TeamRolesSectionProps {
  companyRoles: CompanyRole[];
  onAssignRole: (departmentSlug: string, roleTitle: string, data: HireFormData) => Promise<void>;
  onRequestHire: (departmentSlug: string, roleTitle: string) => void;
}

interface RoleAssignment {
  departmentSlug: string;
  roleTitle: string;
}

export const TeamRolesSection = ({ companyRoles, onAssignRole, onRequestHire }: TeamRolesSectionProps) => {
  const [expandedDepartments, setExpandedDepartments] = useState<string[]>([]);
  const [editingRole, setEditingRole] = useState<RoleAssignment | null>(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [hireModalOpen, setHireModalOpen] = useState(false);
  const [hireModalRole, setHireModalRole] = useState<{ departmentSlug: string; roleTitle: string; departmentName: string } | null>(null);

  const toggleDepartment = (slug: string) => {
    setExpandedDepartments(prev => 
      prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug]
    );
  };

  const getRoleStatus = (departmentSlug: string, roleTitle: string): CompanyRole | undefined => {
    return companyRoles.find(r => r.department_slug === departmentSlug && r.role_title === roleTitle);
  };

  const startEditing = (departmentSlug: string, roleTitle: string, currentName?: string, currentEmail?: string) => {
    setEditingRole({ departmentSlug, roleTitle });
    setEditName(currentName || "");
    setEditEmail(currentEmail || "");
  };

  const cancelEditing = () => {
    setEditingRole(null);
    setEditName("");
    setEditEmail("");
  };

  const handleSave = async () => {
    if (!editingRole || !editName.trim()) return;
    
    setSaving(true);
    try {
      await onAssignRole(editingRole.departmentSlug, editingRole.roleTitle, {
        profileType: 'human',
        humanName: editName.trim(),
        humanEmail: editEmail.trim(),
      });
      cancelEditing();
    } finally {
      setSaving(false);
    }
  };

  const openHireModal = (departmentSlug: string, roleTitle: string, departmentName: string) => {
    setHireModalRole({ departmentSlug, roleTitle, departmentName });
    setHireModalOpen(true);
  };

  const handleHireSubmit = async (data: HireFormData) => {
    if (!hireModalRole) return;
    await onAssignRole(hireModalRole.departmentSlug, hireModalRole.roleTitle, data);
  };

  // Build profile data from company role
  const buildProfileData = (roleData: CompanyRole): ProfileData | null => {
    if (roleData.status !== 'filled') return null;
    
    return {
      name: roleData.assigned_name || 'Unknown',
      email: roleData.assigned_email,
      phone: roleData.assigned_phone,
      photoUrl: roleData.assigned_photo_url,
      googleMeetLink: roleData.google_meet_link,
      type: (roleData.profile_type as 'human' | 'ai') || 'human',
      aiType: roleData.ai_type,
      aiAgentId: roleData.ai_agent_id,
    };
  };

  // Calculate stats
  const totalRoles = departmentConfigs.reduce((sum, dept) => sum + dept.roles.length, 0);
  const filledRoles = companyRoles.filter(r => r.status === 'filled').length;
  const hiringRoles = companyRoles.filter(r => r.status === 'hiring').length;

  const getDepartmentStats = (slug: string) => {
    const dept = departmentConfigs.find(d => d.slug === slug);
    if (!dept) return { total: 0, filled: 0, hiring: 0 };
    
    const deptRoles = companyRoles.filter(r => r.department_slug === slug);
    return {
      total: dept.roles.length,
      filled: deptRoles.filter(r => r.status === 'filled').length,
      hiring: deptRoles.filter(r => r.status === 'hiring').length,
    };
  };

  return (
    <div className="space-y-4">
      {/* Summary Stats */}
      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
        <div className="flex items-center gap-1.5">
          <Check className="w-4 h-4 text-green-500" />
          <span>{filledRoles} filled</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-amber-500" />
          <span>{hiringRoles} hiring</span>
        </div>
        <div className="flex items-center gap-1.5">
          <User className="w-4 h-4" />
          <span>{totalRoles - filledRoles - hiringRoles} vacant</span>
        </div>
      </div>

      {/* Departments */}
      <div className="space-y-2">
        {departmentConfigs.map((dept) => {
          const stats = getDepartmentStats(dept.slug);
          const isExpanded = expandedDepartments.includes(dept.slug);
          const colorClasses = getDepartmentColorClasses(dept.color);

          return (
            <div key={dept.slug} className="border rounded-lg overflow-hidden">
              {/* Department Header */}
              <button
                onClick={() => toggleDepartment(dept.slug)}
                className={cn(
                  "w-full flex items-center justify-between p-3 hover:bg-muted/50 transition-colors",
                  isExpanded && "border-b"
                )}
              >
                <div className="flex items-center gap-3">
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  )}
                  <div className={cn("w-2 h-2 rounded-full", colorClasses.bg)} />
                  <span className="font-medium text-sm">{dept.name}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  {stats.filled > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {stats.filled}/{stats.total}
                    </Badge>
                  )}
                  {stats.hiring > 0 && (
                    <Badge variant="outline" className="text-xs text-amber-600 border-amber-300">
                      {stats.hiring} hiring
                    </Badge>
                  )}
                </div>
              </button>

              {/* Roles List */}
              {isExpanded && (
                <div className="divide-y">
                  {dept.roles.map((role) => {
                    const roleData = getRoleStatus(dept.slug, role.title);
                    const isEditing = editingRole?.departmentSlug === dept.slug && editingRole?.roleTitle === role.title;
                    const profileData = roleData ? buildProfileData(roleData) : null;

                    return (
                      <div key={role.title} className="p-3 hover:bg-muted/30 transition-colors">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              {/* Status Indicator */}
                              {roleData?.status === 'filled' ? (
                                <Check className="w-4 h-4 text-green-500 shrink-0" />
                              ) : roleData?.status === 'hiring' ? (
                                <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                              ) : (
                                <User className="w-4 h-4 text-muted-foreground/50 shrink-0" />
                              )}
                              <span className="text-sm font-medium truncate">{role.title}</span>
                            </div>

                            {/* Role Content */}
                            {isEditing ? (
                              <div className="mt-2 ml-6 space-y-2">
                                <Input
                                  placeholder="Name"
                                  value={editName}
                                  onChange={(e) => setEditName(e.target.value)}
                                  className="h-8 text-sm"
                                />
                                <Input
                                  type="email"
                                  placeholder="Email (optional)"
                                  value={editEmail}
                                  onChange={(e) => setEditEmail(e.target.value)}
                                  className="h-8 text-sm"
                                />
                                <div className="flex gap-2">
                                  <Button size="sm" onClick={handleSave} disabled={saving || !editName.trim()}>
                                    <Save className="w-3 h-3 mr-1" />
                                    Save
                                  </Button>
                                  <Button size="sm" variant="ghost" onClick={cancelEditing}>
                                    <X className="w-3 h-3 mr-1" />
                                    Cancel
                                  </Button>
                                </div>
                              </div>
                            ) : profileData ? (
                              <div className="mt-3 ml-6">
                                <ProfileCard 
                                  profile={profileData} 
                                  roleTitle={role.title}
                                  departmentColor={dept.color}
                                  compact
                                />
                              </div>
                            ) : roleData?.status === 'hiring' ? (
                              <div className="mt-1 ml-6 text-sm text-amber-600">
                                Hire request submitted
                              </div>
                            ) : (
                              <p className="mt-1 ml-6 text-xs text-muted-foreground line-clamp-1">
                                {role.description}
                              </p>
                            )}
                          </div>

                          {/* Actions */}
                          {!isEditing && (
                            <div className="flex items-center gap-1 shrink-0">
                              {roleData?.status === 'filled' ? (
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  className="h-7 px-2"
                                  onClick={() => startEditing(dept.slug, role.title, roleData.assigned_name, roleData.assigned_email)}
                                >
                                  <Pencil className="w-3 h-3" />
                                </Button>
                              ) : (
                                <>
                                  <Button 
                                    size="sm" 
                                    variant="ghost" 
                                    className="h-7 px-2"
                                    onClick={() => openHireModal(dept.slug, role.title, dept.name)}
                                  >
                                    <UserPlus className="w-3 h-3" />
                                  </Button>
                                  {roleData?.status !== 'hiring' && (
                                    <Button 
                                      size="sm" 
                                      variant="outline" 
                                      className="h-7 px-2 text-xs"
                                      onClick={() => onRequestHire(dept.slug, role.title)}
                                    >
                                      Request Hire
                                    </Button>
                                  )}
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Hire Options Modal */}
      {hireModalRole && (
        <HireOptionsModal
          open={hireModalOpen}
          onOpenChange={setHireModalOpen}
          roleTitle={hireModalRole.roleTitle}
          departmentName={hireModalRole.departmentName}
          onSubmit={handleHireSubmit}
        />
      )}
    </div>
  );
};
