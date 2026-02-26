import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, User, Building2, CheckCircle2, LayoutGrid, BarChart3 } from "lucide-react";
import { ImmersionStageIndicator } from "./ImmersionStageIndicator";
import { SESSION_TYPE_LABELS, STAGE_CONFIG } from "@/lib/immersionTypes";
import type { EngagementWithAggregates, ImmersionStage } from "@/lib/immersionTypes";

interface ImmersionOverviewProps {
  engagement: EngagementWithAggregates;
}

function getNextAction(stage: ImmersionStage): { label: string; description: string } | null {
  switch (stage) {
    case "pre":
      return { label: "Complete Checklist", description: "Finish all pre-session prep items" };
    case "active":
      return { label: "Session In Progress", description: "Your Immersion is happening today" };
    case "post":
      return { label: "Review Build Status", description: "Check department progress and deliverables" };
    case "optimizing":
      return { label: "Schedule Check-in", description: "Book your 30-day optimization call" };
    default:
      return null;
  }
}

export function ImmersionOverview({ engagement }: ImmersionOverviewProps) {
  const nextAction = getNextAction(engagement.stage);
  const stageConfig = STAGE_CONFIG[engagement.stage];

  return (
    <div className="space-y-6">
      {/* Stage Banner */}
      <Card className="p-6 border-l-4" style={{ borderLeftColor: stageConfig.color.includes("blue") ? "#3B82F6" : stageConfig.color.includes("amber") ? "#F59E0B" : stageConfig.color.includes("green") ? "#10B981" : stageConfig.color.includes("purple") ? "#8B5CF6" : "#64748B" }}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <ImmersionStageIndicator stage={engagement.stage} />
            </div>
            <p className="text-muted-foreground">{stageConfig.description}</p>
          </div>
          {nextAction && (
            <Button variant="gradient" size="sm">
              {nextAction.label}
            </Button>
          )}
        </div>
      </Card>

      {/* Session Details */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Session Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm text-muted-foreground">Session Date</p>
              <p className="font-medium">
                {engagement.session_date
                  ? new Date(engagement.session_date).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "Not scheduled"}
              </p>
              {engagement.session_confirmed && (
                <Badge variant="outline" className="mt-1 bg-green-500/10 text-green-600 border-green-500/20 text-xs">
                  Confirmed
                </Badge>
              )}
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Building2 className="w-5 h-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm text-muted-foreground">Session Type</p>
              <p className="font-medium">{SESSION_TYPE_LABELS[engagement.session_type]}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <User className="w-5 h-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm text-muted-foreground">Advisor</p>
              <p className="font-medium">{engagement.advisor_name}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm text-muted-foreground">Location</p>
              <p className="font-medium">{engagement.location || "Virtual"}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Progress Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Checklist</p>
              <p className="text-xl font-bold">
                {engagement.checklist_completed}/{engagement.checklist_total}
              </p>
            </div>
          </div>
          <Progress
            value={engagement.checklist_total > 0
              ? (engagement.checklist_completed / engagement.checklist_total) * 100
              : 0}
            className="h-2"
          />
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
              <LayoutGrid className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Departments Live</p>
              <p className="text-xl font-bold">
                {engagement.departments_live}/{engagement.departments_total}
              </p>
            </div>
          </div>
          <Progress
            value={engagement.departments_total > 0
              ? (engagement.departments_live / engagement.departments_total) * 100
              : 0}
            className="h-2"
          />
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Overall Build</p>
              <p className="text-xl font-bold">{engagement.overall_progress}%</p>
            </div>
          </div>
          <Progress value={engagement.overall_progress} className="h-2" />
        </Card>
      </div>
    </div>
  );
}
