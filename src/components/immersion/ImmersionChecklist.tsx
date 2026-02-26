import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";
import { useChecklist, useToggleChecklist } from "@/hooks/useImmersion";
import type { PortalRole } from "@/lib/immersionTypes";

interface ImmersionChecklistProps {
  engagementId: string;
  userRole: PortalRole;
}

export function ImmersionChecklist({ engagementId, userRole }: ImmersionChecklistProps) {
  const [activeStage, setActiveStage] = useState<"pre" | "post">("pre");
  const { data: items, isLoading } = useChecklist(engagementId, activeStage);
  const toggleMutation = useToggleChecklist(engagementId);

  const canToggle = userRole === "client_primary" || userRole === "gf_advisor" || userRole === "gf_admin";
  const isStaff = userRole === "gf_advisor" || userRole === "gf_admin";

  const requiredItems = items?.filter((i) => i.is_required) || [];
  const completedRequired = requiredItems.filter((i) => i.is_completed);
  const progressPercent = requiredItems.length > 0
    ? Math.round((completedRequired.length / requiredItems.length) * 100)
    : 0;

  const handleToggle = (itemId: string, currentCompleted: boolean) => {
    toggleMutation.mutate({ itemId, isCompleted: !currentCompleted });
  };

  return (
    <div className="space-y-6">
      {/* Stage Toggle */}
      <div className="flex gap-2">
        <Button
          variant={activeStage === "pre" ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveStage("pre")}
        >
          Pre-Immersion
        </Button>
        <Button
          variant={activeStage === "post" ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveStage("post")}
        >
          Post-Immersion
        </Button>
      </div>

      {/* Progress */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium">
            {completedRequired.length} of {requiredItems.length} required items complete
          </p>
          <span className="text-sm text-muted-foreground">{progressPercent}%</span>
        </div>
        <Progress value={progressPercent} className="h-2" />
      </Card>

      {/* Checklist Items */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="space-y-2">
          {items?.map((item) => {
            const isGfunnelAssigned = item.assigned_to === "gfunnel";
            const itemCanToggle = canToggle && (isStaff || !isGfunnelAssigned);

            return (
              <Card key={item.id} className="p-4">
                <div className="flex items-start gap-3">
                  <Checkbox
                    checked={item.is_completed}
                    disabled={!itemCanToggle || toggleMutation.isPending}
                    onCheckedChange={() => handleToggle(item.id, item.is_completed)}
                    className="mt-0.5"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-sm font-medium ${item.is_completed ? "line-through text-muted-foreground" : ""}`}>
                        {item.label}
                      </span>
                      {isGfunnelAssigned && (
                        <Badge variant="outline" className="text-xs bg-blue-500/10 text-blue-600 border-blue-500/20">
                          Handled by GFunnel
                        </Badge>
                      )}
                      {!item.is_required && (
                        <Badge variant="outline" className="text-xs">Optional</Badge>
                      )}
                    </div>
                    {item.description && (
                      <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
