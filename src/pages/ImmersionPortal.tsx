import { useParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { AlertCircle, LayoutDashboard, CheckSquare, Video, LayoutGrid, FileText, MessageCircle, Receipt } from "lucide-react";
import { useEngagement } from "@/hooks/useImmersion";
import { ImmersionStageIndicator } from "@/components/immersion/ImmersionStageIndicator";
import { ImmersionOverview } from "@/components/immersion/ImmersionOverview";
import { ImmersionChecklist } from "@/components/immersion/ImmersionChecklist";
import { ImmersionRecordings } from "@/components/immersion/ImmersionRecordings";
import { ImmersionBuildStatus } from "@/components/immersion/ImmersionBuildStatus";
import { ImmersionDocuments } from "@/components/immersion/ImmersionDocuments";
import { ImmersionMessages } from "@/components/immersion/ImmersionMessages";
import { ImmersionInvoices } from "@/components/immersion/ImmersionInvoices";
import type { ImmersionStage, PortalRole } from "@/lib/immersionTypes";

function PortalSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-12 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      </div>
    </div>
  );
}

function PortalError({ message }: { message: string }) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Card className="p-8 max-w-md text-center">
        <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">Unable to Load Portal</h2>
        <p className="text-muted-foreground">{message}</p>
      </Card>
    </div>
  );
}

const ImmersionPortal = () => {
  const { id } = useParams<{ id: string }>();
  const { data: engagement, isLoading, error } = useEngagement(id);

  if (isLoading) return <PortalSkeleton />;
  if (error || !engagement) {
    return <PortalError message={error?.message || "Engagement not found or you don't have access."} />;
  }

  const showRecordings = engagement.stage !== "pre";
  const userRole = engagement.user_role as PortalRole;

  return (
    <div className="min-h-screen bg-background">
      {/* Portal Header */}
      <header className="border-b border-border/50 bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-bold">{engagement.client_org}</h1>
                <ImmersionStageIndicator stage={engagement.stage as ImmersionStage} />
              </div>
              <p className="text-muted-foreground">
                {engagement.client_name} &middot; Immersion Portal
              </p>
            </div>
            {engagement.unread_messages > 0 && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
                <MessageCircle className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">
                  {engagement.unread_messages} unread message{engagement.unread_messages > 1 ? "s" : ""}
                </span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Portal Content */}
      <div className="container mx-auto px-4 py-6">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="w-full flex flex-wrap h-auto gap-1 bg-muted/50 p-1">
            <TabsTrigger value="overview" className="gap-2 text-xs sm:text-sm">
              <LayoutDashboard className="w-4 h-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="checklist" className="gap-2 text-xs sm:text-sm">
              <CheckSquare className="w-4 h-4" />
              <span className="hidden sm:inline">Checklist</span>
            </TabsTrigger>
            {showRecordings && (
              <TabsTrigger value="recordings" className="gap-2 text-xs sm:text-sm">
                <Video className="w-4 h-4" />
                <span className="hidden sm:inline">Recordings</span>
              </TabsTrigger>
            )}
            <TabsTrigger value="build" className="gap-2 text-xs sm:text-sm">
              <LayoutGrid className="w-4 h-4" />
              <span className="hidden sm:inline">Build Status</span>
            </TabsTrigger>
            <TabsTrigger value="documents" className="gap-2 text-xs sm:text-sm">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Documents</span>
            </TabsTrigger>
            <TabsTrigger value="messages" className="gap-2 text-xs sm:text-sm relative">
              <MessageCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Messages</span>
              {engagement.unread_messages > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-primary-foreground text-[10px] rounded-full flex items-center justify-center">
                  {engagement.unread_messages}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="invoices" className="gap-2 text-xs sm:text-sm">
              <Receipt className="w-4 h-4" />
              <span className="hidden sm:inline">Invoices</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <ImmersionOverview engagement={engagement} />
          </TabsContent>

          <TabsContent value="checklist">
            <ImmersionChecklist engagementId={engagement.id} userRole={userRole} />
          </TabsContent>

          {showRecordings && (
            <TabsContent value="recordings">
              <ImmersionRecordings engagementId={engagement.id} />
            </TabsContent>
          )}

          <TabsContent value="build">
            <ImmersionBuildStatus engagementId={engagement.id} userRole={userRole} />
          </TabsContent>

          <TabsContent value="documents">
            <ImmersionDocuments engagementId={engagement.id} />
          </TabsContent>

          <TabsContent value="messages">
            <ImmersionMessages engagementId={engagement.id} userRole={userRole} />
          </TabsContent>

          <TabsContent value="invoices">
            <ImmersionInvoices engagementId={engagement.id} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ImmersionPortal;
