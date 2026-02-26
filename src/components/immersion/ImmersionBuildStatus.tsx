import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Loader2, CheckCircle2, Circle } from "lucide-react";
import { useDepartments } from "@/hooks/useImmersion";
import { DEPARTMENT_STATUS_CONFIG } from "@/lib/immersionTypes";
import type { DepartmentStatus, BuildItem, PortalRole } from "@/lib/immersionTypes";

interface ImmersionBuildStatusProps {
  engagementId: string;
  userRole: PortalRole;
}

export function ImmersionBuildStatus({ engagementId }: ImmersionBuildStatusProps) {
  const { data: departments, isLoading } = useDepartments(engagementId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!departments || departments.length === 0) {
    return (
      <Card className="p-12 text-center">
        <p className="text-muted-foreground">No departments found.</p>
      </Card>
    );
  }

  const overallProgress = Math.round(
    departments.reduce((sum, d) => sum + (d.progress || 0), 0) / departments.length
  );

  return (
    <div className="space-y-6">
      {/* Overall Progress */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">Overall Build Progress</h3>
          <span className="text-lg font-bold">{overallProgress}%</span>
        </div>
        <Progress value={overallProgress} className="h-3" />
        <p className="text-sm text-muted-foreground mt-2">
          {departments.filter((d) => d.status === "live").length} of {departments.length} departments live
        </p>
      </Card>

      {/* Department Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {departments.map((dept) => {
          const statusConfig = DEPARTMENT_STATUS_CONFIG[dept.status as DepartmentStatus] || DEPARTMENT_STATUS_CONFIG.pending;
          const buildItems = (dept.build_items || []) as BuildItem[];

          return (
            <Card
              key={dept.id}
              className="overflow-hidden"
              style={{ borderLeftWidth: "4px", borderLeftColor: dept.dept_color }}
            >
              <div className="p-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                      style={{ backgroundColor: dept.dept_color }}
                    >
                      {dept.dept_number}
                    </span>
                    <h4 className="font-semibold text-sm">{dept.dept_name}</h4>
                  </div>
                  <Badge variant="outline" className={`text-xs ${statusConfig.color}`}>
                    {statusConfig.label}
                  </Badge>
                </div>

                {/* Progress */}
                <div className="mb-3">
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>Progress</span>
                    <span>{dept.progress}%</span>
                  </div>
                  <Progress value={dept.progress} className="h-2" />
                </div>

                {/* Build Items */}
                {buildItems.length > 0 && (
                  <div className="space-y-1.5 mt-3 pt-3 border-t border-border">
                    {buildItems.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs">
                        {item.done ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                        ) : (
                          <Circle className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                        )}
                        <span className={item.done ? "text-muted-foreground line-through" : ""}>
                          {item.label}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Notes */}
                {dept.advisor_notes && (
                  <div className="mt-3 pt-3 border-t border-border">
                    <p className="text-xs text-muted-foreground">{dept.advisor_notes}</p>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
