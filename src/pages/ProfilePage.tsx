import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Pencil, User, Bot, Mail, Phone, Video, ExternalLink, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { CompanyRole } from "@/lib/walletTypes";
import { AIEmbedWidget } from "@/components/AIEmbedWidget";
import { EditProfileModal } from "@/components/EditProfileModal";
import { HireFormData } from "@/components/HireOptionsModal";
import { getDepartmentBySlug, getDepartmentColorClasses } from "@/lib/departmentConfigs";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const ProfilePage = () => {
  const { roleId } = useParams<{ roleId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [roleData, setRoleData] = useState<CompanyRole | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    loadRoleData();
  }, [roleId]);

  const loadRoleData = async () => {
    if (!roleId) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('get-company-role', {
        body: { role_id: roleId }
      });

      if (error) throw error;
      if (data?.success && data?.data) {
        setRoleData(data.data);
      }
    } catch (err) {
      console.error('Error loading role data:', err);
      toast({
        title: "Error",
        description: "Failed to load profile data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubmit = async (formData: HireFormData) => {
    if (!roleData) return;
    
    try {
      const { error } = await supabase.functions.invoke('update-company-role', {
        body: {
          company_id: roleData.company_id,
          department_slug: roleData.department_slug,
          role_title: roleData.role_title,
          assigned_name: formData.humanName || null,
          assigned_email: formData.humanEmail || null,
          assigned_phone: formData.humanPhone || null,
          assigned_photo_url: formData.humanPhotoUrl || null,
          google_meet_link: formData.googleMeetLink || null,
          profile_type: formData.profileType,
          ai_name: formData.aiName || null,
          ai_type: formData.aiType || null,
          ai_agent_id: formData.aiAgentId || null,
          ai_embed_url: formData.aiEmbedUrl || null,
        }
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile updated successfully"
      });
      
      loadRoleData();
    } catch (err) {
      console.error('Error updating role:', err);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive"
      });
    }
  };

  const department = roleData ? getDepartmentBySlug(roleData.department_slug) : null;
  const colorClasses = department ? getDepartmentColorClasses(department.color) : null;
  
  const hasHuman = roleData?.assigned_name;
  const hasAI = roleData?.ai_name;
  const isAIProfile = roleData?.profile_type === 'ai' || (!hasHuman && hasAI);

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-8 w-48 mb-6" />
          <div className="flex gap-6">
            <Skeleton className="h-32 w-32 rounded-full" />
            <div className="flex-1 space-y-3">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-5 w-32" />
            </div>
          </div>
          <Skeleton className="h-[400px] w-full mt-8" />
        </div>
      </div>
    );
  }

  if (!roleData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Profile Not Found</h1>
          <p className="text-muted-foreground mb-4">This profile doesn't exist or has been removed.</p>
          <Button onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const displayName = isAIProfile ? roleData.ai_name : roleData.assigned_name;
  const photoUrl = roleData.assigned_photo_url;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card/50">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to {department?.name || 'Department'}</span>
            </button>
            <Button variant="outline" onClick={() => setEditModalOpen(true)}>
              <Pencil className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row gap-6 mb-8">
          <Avatar className="h-28 w-28 border-4 border-background shadow-lg">
            {photoUrl ? (
              <AvatarImage src={photoUrl} alt={displayName || 'Profile'} />
            ) : null}
            <AvatarFallback className={cn(
              "text-2xl",
              isAIProfile ? "bg-purple-100 text-purple-600 dark:bg-purple-900/50" : "bg-blue-100 text-blue-600 dark:bg-blue-900/50"
            )}>
              {isAIProfile ? <Bot className="w-10 h-10" /> : (displayName ? getInitials(displayName) : <User className="w-10 h-10" />)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <div className="flex items-start gap-3 mb-2">
              <h1 className="text-2xl font-bold">{displayName || 'Unnamed Profile'}</h1>
              {isAIProfile ? (
                <Badge variant="secondary" className="bg-purple-100 text-purple-600 dark:bg-purple-900/50">
                  <Bot className="w-3 h-3 mr-1" />
                  AI Agent
                </Badge>
              ) : (
                <Badge variant="secondary" className="bg-blue-100 text-blue-600 dark:bg-blue-900/50">
                  <User className="w-3 h-3 mr-1" />
                  Human
                </Badge>
              )}
            </div>
            <p className="text-lg text-muted-foreground mb-1">{roleData.role_title}</p>
            {department && (
              <p className={cn("text-sm", colorClasses?.text)}>{department.name}</p>
            )}

            {/* AI Capabilities */}
            {isAIProfile && roleData.ai_type && (
              <div className="flex flex-wrap gap-2 mt-4">
                {roleData.ai_type.split(',').map((cap, i) => (
                  <Badge key={i} variant="outline" className="border-purple-300 text-purple-600">
                    {cap.trim()}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        {isAIProfile ? (
          // AI Profile - Show Chat Widget
          <div className="space-y-6">
            {roleData.ai_embed_url ? (
              <>
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-5 h-5 text-purple-500" />
                  <h2 className="text-lg font-semibold">Chat with {roleData.ai_name}</h2>
                </div>
                <AIEmbedWidget embedUrl={roleData.ai_embed_url} />
              </>
            ) : (
              <Card className="border-dashed border-purple-300 bg-purple-50/50 dark:bg-purple-950/20">
                <CardContent className="py-12 text-center">
                  <Bot className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">No Chat Widget Configured</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Add a chat widget URL to enable conversations with this AI agent.
                  </p>
                  <Button variant="outline" onClick={() => setEditModalOpen(true)}>
                    <Pencil className="w-4 h-4 mr-2" />
                    Configure Widget
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          // Human Profile - Show Contact Info
          <div className="space-y-6">
            {/* Contact Information */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
                <div className="space-y-4">
                  {roleData.assigned_email && (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                        <Mail className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <a 
                          href={`mailto:${roleData.assigned_email}`}
                          className="font-medium hover:text-primary transition-colors"
                        >
                          {roleData.assigned_email}
                        </a>
                      </div>
                    </div>
                  )}
                  {roleData.assigned_phone && (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
                        <Phone className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Phone</p>
                        <a 
                          href={`tel:${roleData.assigned_phone}`}
                          className="font-medium hover:text-primary transition-colors"
                        >
                          {roleData.assigned_phone}
                        </a>
                      </div>
                    </div>
                  )}
                  {roleData.google_meet_link && (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center">
                        <Video className="w-5 h-5 text-amber-600" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Meeting Link</p>
                        <a 
                          href={roleData.google_meet_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium hover:text-primary transition-colors flex items-center gap-1"
                        >
                          Schedule a Meeting
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  )}
                  {!roleData.assigned_email && !roleData.assigned_phone && !roleData.google_meet_link && (
                    <p className="text-muted-foreground text-sm">No contact information available.</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-3">
              {roleData.assigned_email && (
                <Button asChild>
                  <a href={`mailto:${roleData.assigned_email}`}>
                    <Mail className="w-4 h-4 mr-2" />
                    Send Email
                  </a>
                </Button>
              )}
              {roleData.assigned_phone && (
                <Button variant="outline" asChild>
                  <a href={`tel:${roleData.assigned_phone}`}>
                    <Phone className="w-4 h-4 mr-2" />
                    Call
                  </a>
                </Button>
              )}
              {roleData.google_meet_link && (
                <Button variant="outline" asChild>
                  <a href={roleData.google_meet_link} target="_blank" rel="noopener noreferrer">
                    <Video className="w-4 h-4 mr-2" />
                    Schedule Meeting
                  </a>
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Both Profile Types Section */}
        {roleData.profile_type === 'both' && hasHuman && hasAI && (
          <div className="mt-8 pt-8 border-t">
            <h2 className="text-lg font-semibold mb-4">
              {isAIProfile ? 'Human Lead' : 'AI Support'}
            </h2>
            <Card className={cn(
              "p-4",
              isAIProfile ? "bg-blue-50/50 dark:bg-blue-950/20" : "bg-purple-50/50 dark:bg-purple-950/20"
            )}>
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className={cn(
                    isAIProfile ? "bg-blue-100 text-blue-600" : "bg-purple-100 text-purple-600"
                  )}>
                    {isAIProfile 
                      ? (roleData.assigned_name ? getInitials(roleData.assigned_name) : <User className="w-5 h-5" />)
                      : <Bot className="w-5 h-5" />
                    }
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">
                    {isAIProfile ? roleData.assigned_name : roleData.ai_name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {isAIProfile ? 'Human Team Lead' : `AI ${roleData.ai_type || 'Assistant'}`}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {roleData && (
        <EditProfileModal
          open={editModalOpen}
          onOpenChange={setEditModalOpen}
          roleData={roleData}
          onSubmit={handleEditSubmit}
        />
      )}
    </div>
  );
};

export default ProfilePage;
