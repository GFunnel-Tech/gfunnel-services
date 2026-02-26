import { Badge } from "@/components/ui/badge";
import { STAGE_CONFIG } from "@/lib/immersionTypes";
import type { ImmersionStage } from "@/lib/immersionTypes";

interface ImmersionStageIndicatorProps {
  stage: ImmersionStage;
  size?: "sm" | "default";
}

export function ImmersionStageIndicator({ stage, size = "default" }: ImmersionStageIndicatorProps) {
  const config = STAGE_CONFIG[stage];

  return (
    <Badge
      variant="outline"
      className={`${config.color} ${size === "sm" ? "text-xs px-2 py-0.5" : "text-sm px-3 py-1"}`}
    >
      {config.label}
    </Badge>
  );
}
