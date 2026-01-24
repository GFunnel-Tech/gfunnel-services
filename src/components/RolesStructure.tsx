import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DepartmentConfig, Role, HiringType, getDepartmentColorClasses } from '@/lib/departmentConfigs';
import { UserPlus, ChevronDown, ChevronUp, User, Bot, Users, Pencil } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CompanyRole } from '@/lib/walletTypes';
import { ProfileCard, ProfileData } from '@/components/ProfileCard';
import { HireOptionsModal, HireFormData } from '@/components/HireOptionsModal';

interface RolesStructureProps {
  department: DepartmentConfig;
  companyRoles: CompanyRole[];
  onHireClick: (role: Role) => void;
  onAssignRole: (departmentSlug: string, roleTitle: string, data: HireFormData) => Promise<void>;
}

const colorHoverClasses: Record<string, string> = {
  blue: 'hover:border-blue-500/30',
  purple: 'hover:border-purple-500/30',
  green: 'hover:border-green-500/30',
  orange: 'hover:border-orange-500/30',
  teal: 'hover:border-teal-500/30',
  pink: 'hover:border-pink-500/30',
};

const colorBgClasses: Record<string, string> = {
  blue: 'bg-blue-500/10',
  purple: 'bg-purple-500/10',
  green: 'bg-green-500/10',
  orange: 'bg-orange-500/10',
  teal: 'bg-teal-500/10',
  pink: 'bg-pink-500/10',
};

const colorTextClasses: Record<string, string> = {
  blue: 'text-blue-500',
  purple: 'text-purple-500',
  green: 'text-green-500',
  orange: 'text-orange-500',
  teal: 'text-teal-500',
  pink: 'text-pink-500',
};

const getHiringTypeConfig = (hiringType: HiringType = 'both') => {
  switch (hiringType) {
    case 'human':
      return { label: 'Human', icon: User, bgClass: 'bg-blue-500/10', textClass: 'text-blue-600' };
    case 'ai':
      return { label: 'AI', icon: Bot, bgClass: 'bg-purple-500/10', textClass: 'text-purple-600' };
    case 'both':
    default:
      return { label: 'Human or AI', icon: Users, bgClass: 'bg-emerald-500/10', textClass: 'text-emerald-600' };
  }
};

// Helper to build ProfileData from CompanyRole
const buildHumanProfile = (roleData: CompanyRole): ProfileData | null => {
  if (roleData.assigned_name) {
    return {
      name: roleData.assigned_name,
      email: roleData.assigned_email,
      phone: roleData.assigned_phone,
      photoUrl: roleData.assigned_photo_url,
      googleMeetLink: roleData.google_meet_link,
      type: 'human',
    };
  }
  return null;
};

const buildAIProfile = (roleData: CompanyRole): ProfileData | null => {
  if (roleData.ai_name) {
    return {
      name: roleData.ai_name,
      type: 'ai',
      aiType: roleData.ai_type,
      aiAgentId: roleData.ai_agent_id,
    };
  }
  return null;
};

export const RolesStructure = ({ department, companyRoles, onHireClick, onAssignRole }: RolesStructureProps) => {
  const [expandedRole, setExpandedRole] = useState<number | null>(null);
  const [hireModalOpen, setHireModalOpen] = useState(false);
  const [selectedRoleForHire, setSelectedRoleForHire] = useState<Role | null>(null);
  const [preSelectedHireType, setPreSelectedHireType] = useState<'human' | 'ai' | null>(null);
  
  const colorClasses = getDepartmentColorClasses(department.color);
  const hoverClass = colorHoverClasses[department.color] || colorHoverClasses.blue;
  const bgClass = colorBgClasses[department.color] || colorBgClasses.blue;
  const textClass = colorTextClasses[department.color] || colorTextClasses.blue;

  const toggleRole = (index: number) => {
    setExpandedRole(expandedRole === index ? null : index);
  };

  // Find company role data for a given role
  const getRoleData = (roleTitle: string): CompanyRole | undefined => {
    return companyRoles.find(
      r => r.department_slug === department.slug && r.role_title === roleTitle
    );
  };

  const handleOpenHireModal = (role: Role) => {
    setSelectedRoleForHire(role);
    setHireModalOpen(true);
  };

  const handleHireSubmit = async (data: HireFormData) => {
    if (!selectedRoleForHire) return;
    await onAssignRole(department.slug, selectedRoleForHire.title, data);
  };

  return (
    <div className="space-y-4">
      {/* Placeholder Profile Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {/* Human Employee Placeholder */}
        <div className="rounded-xl border border-dashed border-blue-300 bg-blue-50/50 dark:bg-blue-950/20 p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
              <User className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <h4 className="font-medium text-foreground">Human Employee</h4>
              <p className="text-xs text-muted-foreground">Traditional team member</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            Hire skilled professionals who bring creativity, critical thinking, and interpersonal skills to your team.
          </p>
          <div className="flex flex-wrap gap-1.5">
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/50">Creative Problem Solving</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/50">Relationship Building</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/50">Strategic Thinking</span>
          </div>
        </div>

        {/* AI Employee Placeholder */}
        <div className="rounded-xl border border-dashed border-purple-300 bg-purple-50/50 dark:bg-purple-950/20 p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center">
              <Bot className="w-6 h-6 text-purple-500" />
            </div>
            <div>
              <h4 className="font-medium text-foreground">AI Employee</h4>
              <p className="text-xs text-muted-foreground">Automated AI agent</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            Deploy AI agents that work 24/7, handle repetitive tasks, and scale instantly without additional overhead.
          </p>
          <div className="flex flex-wrap gap-1.5">
            <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900/50">24/7 Availability</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900/50">Instant Scaling</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900/50">Consistent Output</span>
          </div>
        </div>
      </div>

      {/* Section Divider */}
      <div className="flex items-center gap-3 pb-2">
        <h3 className="text-sm font-medium text-muted-foreground">Available Roles</h3>
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* Role Cards */}
      <div className="space-y-3">
        {department.roles.map((role, index) => {
          const hiringConfig = getHiringTypeConfig(role.hiringType);
          const HiringIcon = hiringConfig.icon;
          const roleData = getRoleData(role.title);
          const isFilled = roleData?.status === 'filled';
          const isHiring = roleData?.status === 'hiring';
          const isBothType = roleData?.profile_type === 'both';
          const humanProfile = roleData ? buildHumanProfile(roleData) : null;
          const aiProfile = roleData ? buildAIProfile(roleData) : null;
          
          return (
            <div
              key={index}
              className={cn(
                'rounded-lg border border-border/50 bg-card/50 transition-all duration-200',
                hoverClass
              )}
            >
              {/* Role Header */}
              <div
                className="flex items-center justify-between p-4 cursor-pointer"
                onClick={() => toggleRole(index)}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div
                    className={cn(
                      'w-2 h-2 rounded-full flex-shrink-0',
                      isFilled ? 'bg-green-500' : isHiring ? 'bg-amber-500' : 'bg-muted-foreground/30'
                    )}
                  />
                  <span className="text-foreground font-medium truncate">{role.title}</span>
                  {/* Status Badge */}
                  {isFilled ? (
                    <span className="hidden sm:inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-600">
                      Filled
                    </span>
                  ) : isHiring ? (
                    <span className="hidden sm:inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600">
                      Hiring in progress
                    </span>
                  ) : (
                    <span className={cn(
                      'hidden sm:inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full flex-shrink-0',
                      hiringConfig.bgClass,
                      hiringConfig.textClass
                    )}>
                      <HiringIcon className="w-3 h-3" />
                      {hiringConfig.label}
                    </span>
                  )}
                  {expandedRole === index ? (
                    <ChevronUp className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  )}
                </div>
                {isFilled ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenHireModal(role);
                    }}
                    className={cn('gap-2 flex-shrink-0 ml-2', textClass)}
                  >
                    <Pencil className="w-4 h-4" />
                    <span className="hidden sm:inline">Edit</span>
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenHireModal(role);
                    }}
                    className={cn('gap-2 flex-shrink-0 ml-2', textClass)}
                  >
                    <UserPlus className="w-4 h-4" />
                    <span className="hidden sm:inline">Hire</span>
                  </Button>
                )}
              </div>

              {/* Expanded Details */}
              {expandedRole === index && (
                <div className="px-4 pb-4 pt-0 space-y-4 border-t border-border/30">
                  {/* Show Placeholder Cards if NOT filled */}
                  {!isFilled && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
                      {/* AI Hire Card - Left Side */}
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedRoleForHire(role);
                          setPreSelectedHireType('ai');
                          setHireModalOpen(true);
                        }}
                        className="rounded-xl border-2 border-dashed border-purple-300 bg-purple-50/50 dark:bg-purple-950/20 p-4 text-left hover:border-purple-500 hover:bg-purple-100/50 dark:hover:bg-purple-900/30 transition-all group"
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Bot className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-foreground">Hire AI</h4>
                            <p className="text-xs text-muted-foreground">Deploy an AI agent</p>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          Click to deploy an AI assistant for this role
                        </p>
                      </button>

                      {/* Human Hire Card - Right Side */}
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedRoleForHire(role);
                          setPreSelectedHireType('human');
                          setHireModalOpen(true);
                        }}
                        className="rounded-xl border-2 border-dashed border-blue-300 bg-blue-50/50 dark:bg-blue-950/20 p-4 text-left hover:border-blue-500 hover:bg-blue-100/50 dark:hover:bg-blue-900/30 transition-all group"
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <User className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-foreground">Hire Human</h4>
                            <p className="text-xs text-muted-foreground">Assign a team member</p>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          Click to add a human employee to this role
                        </p>
                      </button>
                    </div>
                  )}

                  {/* Profile Card(s) if Filled */}
                  {isFilled && (humanProfile || aiProfile) && (
                    <div className={cn("pt-4", isBothType && "grid grid-cols-1 sm:grid-cols-2 gap-4")}>
                      {/* AI Profile - Left side when both */}
                      {aiProfile && (
                        <ProfileCard 
                          profile={aiProfile} 
                          roleTitle={role.title}
                          departmentColor={department.color}
                        />
                      )}
                      {/* Human Profile - Right side when both, or full width when human only */}
                      {humanProfile && (
                        <ProfileCard 
                          profile={humanProfile} 
                          roleTitle={role.title}
                          departmentColor={department.color}
                        />
                      )}
                    </div>
                  )}

                  {/* Description */}
                  <div>
                    <p className="text-sm text-muted-foreground">{role.description}</p>
                  </div>

                  {/* Responsibilities */}
                  <div>
                    <h4 className={cn('text-sm font-medium mb-2', textClass)}>Responsibilities</h4>
                    <ul className="space-y-1">
                      {role.responsibilities.map((resp, i) => (
                        <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className={cn('mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0', bgClass)} />
                          {resp}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Skills */}
                  <div>
                    <h4 className={cn('text-sm font-medium mb-2', textClass)}>Skills & Characteristics</h4>
                    <div className="flex flex-wrap gap-2">
                      {role.skills.map((skill, i) => (
                        <span
                          key={i}
                          className={cn(
                            'text-xs px-2 py-1 rounded-full',
                            bgClass,
                            textClass
                          )}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Hire Modal */}
      <HireOptionsModal
        open={hireModalOpen}
        onOpenChange={(open) => {
          setHireModalOpen(open);
          if (!open) setPreSelectedHireType(null);
        }}
        roleTitle={selectedRoleForHire?.title || ''}
        departmentName={department.name}
        onSubmit={handleHireSubmit}
        defaultType={preSelectedHireType}
      />
    </div>
  );
};
