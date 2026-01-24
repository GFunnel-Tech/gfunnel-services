import { useState } from "react";
import { RefreshCw, Clock, TrendingUp, Zap, Plus, ArrowUpRight, ExternalLink, Star, Infinity, Pencil, CalendarCheck, ChevronRight, FolderOpen, FileText, Users, UserCog } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { WalletAccessItems } from "./WalletAccessItems";
import { UserProjectRequests } from "./UserProjectRequests";
import { ROTIChart } from "./ROTIChart";
import { TeamRolesSection } from "./TeamRolesSection";
import { TeamMembersModal } from "./TeamMembersModal";
import { WalletData, PLAN_DETAILS, PAYMENT_LINKS, TIME_MULTIPLIER, VA_HOURLY_RATE } from "@/lib/walletTypes";
import {
  formatCurrency,
  getPercentageUsed,
  getTimeUntilReset,
  isUnlimitedPlan,
  getRelativeTime,
} from "@/lib/walletService";
import { supabase } from "@/integrations/supabase/client";
import { departmentConfigs } from "@/lib/departmentConfigs";

interface UsageWalletProps {
  data: WalletData;
  onRefresh: () => void;
  isRefreshing?: boolean;
  isAdmin?: boolean;
  onUpdateHours?: (hours: number) => Promise<void>;
}

export const UsageWallet = ({ data, onRefresh, isRefreshing, isAdmin, onUpdateHours }: UsageWalletProps) => {
  const [isEditingHours, setIsEditingHours] = useState(false);
  const [editHoursValue, setEditHoursValue] = useState(data.hours_used.toString());
  const [isSaving, setIsSaving] = useState(false);
  const [activeSheet, setActiveSheet] = useState<"roti" | "workspace" | "projects" | "team" | null>(null);
  const [showTeamModal, setShowTeamModal] = useState(false);
  
  // Check if user can manage team (primary or owner/admin)
  const canManageTeam = data.is_primary || data.user_role === 'owner' || data.user_role === 'admin';
  
  const unlimited = isUnlimitedPlan(data.hours_included);
  const percentageUsed = unlimited ? 0 : getPercentageUsed(data.hours_used, data.hours_included);
  const planDetails = PLAN_DETAILS[data.plan_name];
  const isPro = data.plan_name === "Pro";
  
  // Get plan values - prefer data from API, fallback to static config
  const planPrice = data.plan_price || planDetails?.price || 0;
  const savingsPercent = data.savings_percentage || planDetails?.savings || 0;
  const responseTime = data.response_time || planDetails?.response || "";

  // ROTI calculations
  const timeMultiplier = data.time_multiplier ?? TIME_MULTIPLIER;
  const vaRate = data.va_hourly_rate ?? VA_HOURLY_RATE;
  const hoursSaved = data.hours_used * timeMultiplier;
  const valueDelivered = hoursSaved * vaRate;
  const roti = planPrice > 0 ? valueDelivered / planPrice : 0;

  const handleOpenEditHours = () => {
    setEditHoursValue(data.hours_used.toString());
    setIsEditingHours(true);
  };

  const handleSaveHours = async () => {
    if (!onUpdateHours) return;
    
    const hours = parseFloat(editHoursValue);
    if (isNaN(hours) || hours < 0) return;
    
    setIsSaving(true);
    try {
      await onUpdateHours(hours);
      setIsEditingHours(false);
    } finally {
      setIsSaving(false);
    }
  };

  const projectCount = data.project_requests?.length || 0;
  const workspaceCount = data.access_items?.length || 0;
  
  // Team roles stats
  const companyRoles = data.company_roles || [];
  const totalRoles = departmentConfigs.reduce((sum, dept) => sum + dept.roles.length, 0);
  const filledRoles = companyRoles.filter(r => r.status === 'filled').length;

  const handleAssignRole = async (departmentSlug: string, roleTitle: string, formData: { profileType: string; humanName?: string; humanEmail?: string; humanPhone?: string; googleMeetLink?: string; aiName?: string; aiType?: string; aiAgentId?: string }) => {
    try {
      const { data: result, error } = await supabase.functions.invoke('update-company-role', {
        body: {
          company_id: data.user_id,
          department_slug: departmentSlug,
          role_title: roleTitle,
          assigned_name: formData.humanName || formData.aiName,
          assigned_email: formData.humanEmail,
          assigned_phone: formData.humanPhone,
          google_meet_link: formData.googleMeetLink,
          profile_type: formData.profileType,
          ai_name: formData.aiName,
          ai_type: formData.aiType,
          ai_agent_id: formData.aiAgentId,
          status: 'filled',
        }
      });

      if (error) throw error;
      
      const displayName = formData.humanName || formData.aiName || 'team member';
      toast.success(`${roleTitle} assigned to ${displayName}`);
      onRefresh();
    } catch (error) {
      console.error('Error assigning role:', error);
      toast.error('Failed to assign role');
      throw error;
    }
  };

  const handleRequestHire = (departmentSlug: string, roleTitle: string) => {
    // Navigate to service hub with pre-filled hire request
    const dept = departmentConfigs.find(d => d.slug === departmentSlug);
    if (dept) {
      window.location.href = `/department/${departmentSlug}?action=hire&role=${encodeURIComponent(roleTitle)}`;
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">My Service Account</h2>
          <p className="text-sm text-muted-foreground">{data.user_email}</p>
        </div>
        <div className="flex items-center gap-2">
          {canManageTeam && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowTeamModal(true)}
              className="h-8 gap-1.5"
            >
              <UserCog className="w-4 h-4" />
              <span className="hidden sm:inline">Manage Team</span>
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="h-8 w-8"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      {/* Plan Summary Card */}
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold">{data.plan_name} Plan</h3>
                  {isPro && (
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                      <Star className="w-2.5 h-2.5 mr-0.5" />
                      Popular
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground flex items-center gap-2">
                  {unlimited ? (
                    <><Infinity className="w-3 h-3" /> Unlimited</>
                  ) : (
                    <><Clock className="w-3 h-3" /> {data.hours_included} hrs/mo</>
                  )}
                  <span>•</span>
                  <span>{responseTime}</span>
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold">{formatCurrency(planPrice)}</p>
              <p className="text-[10px] text-muted-foreground">/month</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid - 3 cards in a row */}
      <div className="grid grid-cols-3 gap-3">
        {/* Hours Card */}
        <Card 
          className="cursor-pointer hover:bg-muted/50 transition-colors"
          onClick={isAdmin ? handleOpenEditHours : undefined}
        >
          <CardContent className="p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                {unlimited ? <Infinity className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                Hours
              </span>
              {isAdmin && <Pencil className="w-3 h-3 text-muted-foreground" />}
            </div>
            {!unlimited ? (
              <>
                <p className="text-2xl font-bold">{data.hours_used}</p>
                <Progress value={percentageUsed} className="h-1.5 mt-2" />
                <p className="text-[10px] text-muted-foreground mt-1">
                  {data.hours_remaining} of {data.hours_included} remaining
                </p>
              </>
            ) : (
              <>
                <p className="text-2xl font-bold">{data.hours_used}</p>
                <p className="text-[10px] text-muted-foreground mt-1">hours used this cycle</p>
              </>
            )}
          </CardContent>
        </Card>

        {/* ROTI Card */}
        <Card 
          className="cursor-pointer hover:bg-muted/50 transition-colors bg-accent/5 border-accent/20"
          onClick={() => setActiveSheet("roti")}
        >
          <CardContent className="p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                Time Saved
              </span>
              <ChevronRight className="w-3 h-3 text-muted-foreground" />
            </div>
            <p className="text-2xl font-bold text-accent">{Math.round(hoursSaved)}</p>
            <p className="text-[10px] text-muted-foreground mt-1">
              {roti.toFixed(1)}X return • {formatCurrency(valueDelivered)} value
            </p>
          </CardContent>
        </Card>

        {/* Projects Card */}
        <Card 
          className="cursor-pointer hover:bg-muted/50 transition-colors"
          onClick={() => setActiveSheet("projects")}
        >
          <CardContent className="p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <FileText className="w-3 h-3" />
                Projects
              </span>
              <ChevronRight className="w-3 h-3 text-muted-foreground" />
            </div>
            <p className="text-2xl font-bold">{projectCount}</p>
            <p className="text-[10px] text-muted-foreground mt-1">
              {projectCount === 0 ? "no requests yet" : "recent requests"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Team Roles Card */}
      <Card 
        className="cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={() => setActiveSheet("team")}
      >
        <CardContent className="p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">Team Roles</p>
                <p className="text-xs text-muted-foreground">
                  {filledRoles} of {totalRoles} roles filled
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </div>
        </CardContent>
      </Card>

      {/* Workspace Quick Access - shown directly */}
      {workspaceCount > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium flex items-center gap-2">
              <FolderOpen className="w-4 h-4 text-muted-foreground" />
              My Workspace
            </h3>
            <span className="text-xs text-muted-foreground">{workspaceCount} items</span>
          </div>
          <WalletAccessItems items={data.access_items || []} />
        </div>
      )}

      {/* Billing cycle note */}
      <p className="text-xs text-center text-muted-foreground">
        {getTimeUntilReset(data.billing_cycle_end)}
      </p>

      {/* Action Buttons - 3 in a row */}
      <div className="grid grid-cols-3 gap-2">
        <Button asChild variant="outline" className="h-11">
          <a href="/service-hub">
            <Plus className="w-4 h-4 mr-1.5" />
            <span className="truncate">New Request</span>
          </a>
        </Button>
        <Button asChild variant="outline" className="h-11">
          <a href={PAYMENT_LINKS.scheduleMeeting} target="_blank" rel="noopener noreferrer">
            <CalendarCheck className="w-4 h-4 mr-1.5" />
            <span className="truncate">Schedule</span>
          </a>
        </Button>
        {!unlimited ? (
          <Button asChild variant="outline" className="h-11">
            <a href={PAYMENT_LINKS.addHours} target="_blank" rel="noopener noreferrer">
              <Zap className="w-4 h-4 mr-1.5" />
              <span className="truncate">Add Hours</span>
            </a>
          </Button>
        ) : (
          <Button asChild variant="outline" className="h-11">
            <a href="/service-hub">
              <ArrowUpRight className="w-4 h-4 mr-1.5" />
              <span className="truncate">My Services</span>
            </a>
          </Button>
        )}
      </div>
      
      {/* Upgrade Button for non-unlimited */}
      {!unlimited && (
        <Button asChild className="w-full h-11">
          <a href={PAYMENT_LINKS.upgradePlan} target="_blank" rel="noopener noreferrer">
            <ArrowUpRight className="w-4 h-4 mr-2" />
            Upgrade Plan
          </a>
        </Button>
      )}

      {/* Footer Links */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <a
          href={PAYMENT_LINKS.viewBilling}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-foreground transition-colors inline-flex items-center gap-1"
        >
          Billing History
          <ExternalLink className="w-3 h-3" />
        </a>
        <span>Updated {getRelativeTime(data.last_updated)}</span>
      </div>

      {/* ROTI Detail Sheet */}
      <Sheet open={activeSheet === "roti"} onOpenChange={(open) => !open && setActiveSheet(null)}>
        <SheetContent side="bottom" className="h-[85vh] overflow-y-auto">
          <SheetHeader className="text-left mb-4">
            <SheetTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-accent" />
              Return on Time Investment
            </SheetTitle>
            <SheetDescription>
              Your time savings and value delivered this cycle
            </SheetDescription>
          </SheetHeader>
          
          <div className="space-y-6">
            {/* Summary stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-3 rounded-lg bg-accent/10">
                <p className="text-2xl font-bold text-accent">{Math.round(hoursSaved)}</p>
                <p className="text-xs text-muted-foreground">Hours Saved</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-accent/10">
                <p className="text-2xl font-bold text-accent">{formatCurrency(valueDelivered)}</p>
                <p className="text-xs text-muted-foreground">Value Delivered</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-accent/10">
                <p className="text-2xl font-bold text-accent">{roti.toFixed(1)}X</p>
                <p className="text-xs text-muted-foreground">Return</p>
              </div>
            </div>

            {/* Explanation */}
            <div className="p-4 rounded-lg bg-muted/50 space-y-2">
              <p className="text-sm">
                Your <span className="font-semibold">{data.hours_used} hours</span> of expert work 
                replaced approximately <span className="font-semibold text-accent">{Math.round(hoursSaved)} hours</span> of regular work.
              </p>
              <div className="flex justify-between items-center text-sm pt-2 border-t">
                <span className="text-muted-foreground">Your investment</span>
                <span className="font-medium">{formatCurrency(planPrice)}/mo</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Value delivered</span>
                <span className="font-bold text-accent">{formatCurrency(valueDelivered)}</span>
              </div>
              <p className="text-xs text-muted-foreground pt-2">
                Based on ${vaRate}/hr rate • {timeMultiplier}X time multiplier • {savingsPercent}% savings vs agencies
              </p>
            </div>

            {/* Chart */}
            <ROTIChart 
              history={data.hours_history || []} 
              timeMultiplier={timeMultiplier}
              vaHourlyRate={vaRate}
            />
          </div>
        </SheetContent>
      </Sheet>

      {/* Workspace Sheet */}
      <Sheet open={activeSheet === "workspace"} onOpenChange={(open) => !open && setActiveSheet(null)}>
        <SheetContent side="bottom" className="h-[70vh] overflow-y-auto">
          <SheetHeader className="text-left mb-4">
            <SheetTitle className="flex items-center gap-2">
              <FolderOpen className="w-5 h-5 text-primary" />
              My Workspace
            </SheetTitle>
            <SheetDescription>
              Quick access to your tools and resources
            </SheetDescription>
          </SheetHeader>
          <WalletAccessItems items={data.access_items || []} />
        </SheetContent>
      </Sheet>

      {/* Projects Sheet */}
      <Sheet open={activeSheet === "projects"} onOpenChange={(open) => !open && setActiveSheet(null)}>
        <SheetContent side="bottom" className="h-[85vh] overflow-y-auto">
          <SheetHeader className="text-left mb-4">
            <SheetTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Project Requests
            </SheetTitle>
            <SheetDescription>
              Your submitted requests and their status
            </SheetDescription>
          </SheetHeader>
          <UserProjectRequests 
            requests={data.project_requests || []} 
            userEmail={data.user_email}
            companyId={data.user_id}
            companyName={data.company_name}
            planName={data.plan_name}
            onRequestSubmitted={onRefresh}
          />
        </SheetContent>
      </Sheet>

      {/* Team Roles Sheet */}
      <Sheet open={activeSheet === "team"} onOpenChange={(open) => !open && setActiveSheet(null)}>
        <SheetContent side="bottom" className="h-[90vh] overflow-y-auto">
          <SheetHeader className="text-left mb-4">
            <SheetTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Team Roles
            </SheetTitle>
            <SheetDescription>
              Manage your team members and request new hires
            </SheetDescription>
          </SheetHeader>
          <TeamRolesSection 
            companyRoles={companyRoles}
            onAssignRole={handleAssignRole}
            onRequestHire={handleRequestHire}
          />
        </SheetContent>
      </Sheet>

      {/* Edit Hours Dialog */}
      <Dialog open={isEditingHours} onOpenChange={setIsEditingHours}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Edit Hours Used</DialogTitle>
            <DialogDescription>
              Adjust the hours used for this billing cycle.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-2">
              <label htmlFor="hours" className="text-sm font-medium">
                Hours Used
              </label>
              <Input
                id="hours"
                type="number"
                step="0.5"
                min="0"
                value={editHoursValue}
                onChange={(e) => setEditHoursValue(e.target.value)}
                placeholder="Enter hours"
              />
              {!unlimited && (
                <p className="text-xs text-muted-foreground">
                  Plan includes {data.hours_included} hours
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditingHours(false)} disabled={isSaving}>
              Cancel
            </Button>
            <Button onClick={handleSaveHours} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Team Members Modal */}
      {canManageTeam && (
        <TeamMembersModal
          open={showTeamModal}
          onOpenChange={setShowTeamModal}
          companyId={data.user_id}
          companyName={data.company_name || 'Your Company'}
          members={data.company_users || []}
          currentUserEmail={data.user_email}
          onMembersChange={onRefresh}
        />
      )}
    </div>
  );
};