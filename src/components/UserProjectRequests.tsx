import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { FileText, ChevronDown, ChevronUp, Video, Calendar, Plus, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import { QuickSubmitModal } from "./QuickSubmitModal";

export interface UserProjectRequest {
  id: string;
  form_type: string;
  form_category: string;
  request_title: string | null;
  description: string | null;
  video_link: string | null;
  status: string;
  priority: string;
  submitted_at: string;
}

interface UserProjectRequestsProps {
  requests: UserProjectRequest[];
  userEmail?: string;
}

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  pending: { label: "Pending", variant: "secondary" },
  in_progress: { label: "In Progress", variant: "default" },
  completed: { label: "Completed", variant: "outline" },
  cancelled: { label: "Cancelled", variant: "destructive" },
};

const priorityConfig: Record<string, { label: string; className: string }> = {
  low: { label: "Low", className: "text-muted-foreground" },
  medium: { label: "Medium", className: "text-yellow-500" },
  high: { label: "High", className: "text-orange-500" },
  urgent: { label: "Urgent", className: "text-red-500" },
};

export function UserProjectRequests({ requests, userEmail }: UserProjectRequestsProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showQuickSubmit, setShowQuickSubmit] = useState(false);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <>
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              My Requests
            </CardTitle>
            <Button variant="outline" size="sm" onClick={() => setShowQuickSubmit(true)}>
              <Plus className="mr-1.5 h-3 w-3" />
              Submit New Request
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {requests.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-10 w-10 mx-auto mb-3 opacity-50" />
              <p>No requests submitted yet</p>
              <Button variant="link" className="mt-2" onClick={() => setShowQuickSubmit(true)}>
                Submit your first request →
              </Button>
            </div>
          ) : (
          requests.map((request) => {
            const status = statusConfig[request.status] || statusConfig.pending;
            const priority = priorityConfig[request.priority] || priorityConfig.medium;
            const isExpanded = expandedId === request.id;

            return (
              <Collapsible key={request.id} open={isExpanded} onOpenChange={() => toggleExpand(request.id)}>
                <div className="rounded-lg border border-border/50 bg-card/50 overflow-hidden">
                  <CollapsibleTrigger asChild>
                    <button className="w-full p-4 flex items-center justify-between hover:bg-muted/30 transition-colors text-left">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium truncate">
                            {request.request_title || request.form_type}
                          </span>
                          <Badge variant={status.variant} className="text-xs">
                            {status.label}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {format(new Date(request.submitted_at), "MMM d, yyyy")}
                          </span>
                          <span className={priority.className}>
                            {priority.label} Priority
                          </span>
                          <span className="capitalize">{request.form_category}</span>
                        </div>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      )}
                    </button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="px-4 pb-4 pt-0 border-t border-border/30 mt-0">
                      <div className="pt-3 space-y-3">
                        {request.description && (
                          <div>
                            <span className="text-xs font-medium text-muted-foreground">Description</span>
                            <p className="text-sm mt-1">{request.description}</p>
                          </div>
                        )}
                        {request.video_link && (
                          <div>
                            <span className="text-xs font-medium text-muted-foreground">Video</span>
                            <a
                              href={request.video_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 text-sm text-primary hover:underline mt-1"
                            >
                              <Video className="h-4 w-4" />
                              View attached video
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2">
                          <span>Request ID: {request.id.slice(0, 8)}</span>
                        </div>
                      </div>
                    </div>
                  </CollapsibleContent>
                </div>
              </Collapsible>
            );
          })
        )}
        </CardContent>
      </Card>

      <QuickSubmitModal
        isOpen={showQuickSubmit}
        onClose={() => setShowQuickSubmit(false)}
        userEmail={userEmail}
      />
    </>
  );
}
