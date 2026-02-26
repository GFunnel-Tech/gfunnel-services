import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Video, FileText, Brain, Clock, Play, Loader2 } from "lucide-react";
import { useRecordings } from "@/hooks/useImmersion";
import type { RecordingType } from "@/lib/immersionTypes";

interface ImmersionRecordingsProps {
  engagementId: string;
}

const TYPE_ICONS: Record<RecordingType, typeof Video> = {
  full_session: Video,
  segment: Video,
  transcript: FileText,
  ai_summary: Brain,
};

const TYPE_LABELS: Record<RecordingType, string> = {
  full_session: "Full Session",
  segment: "Segment",
  transcript: "Transcript",
  ai_summary: "AI Summary",
};

function formatDuration(seconds: number | null): string {
  if (!seconds) return "";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

function formatFileSize(bytes: number | null): string {
  if (!bytes) return "";
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

export function ImmersionRecordings({ engagementId }: ImmersionRecordingsProps) {
  const { data: recordings, isLoading } = useRecordings(engagementId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!recordings || recordings.length === 0) {
    return (
      <Card className="p-12 text-center">
        <Video className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No Recordings Yet</h3>
        <p className="text-muted-foreground">
          Session recordings will appear here after your Immersion session is complete.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {recordings.map((recording) => {
        const Icon = TYPE_ICONS[recording.type as RecordingType] || Video;
        const typeLabel = TYPE_LABELS[recording.type as RecordingType] || recording.type;

        return (
          <Card key={recording.id} className="p-5">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Icon className="w-6 h-6 text-primary" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h4 className="font-semibold">{recording.title}</h4>
                  <Badge variant="outline" className="text-xs">{typeLabel}</Badge>
                  {recording.segment_label && (
                    <Badge variant="outline" className="text-xs bg-blue-500/10 text-blue-600 border-blue-500/20">
                      {recording.segment_label}
                    </Badge>
                  )}
                  <Badge
                    variant="outline"
                    className={`text-xs ${
                      recording.status === "ready"
                        ? "bg-green-500/10 text-green-600 border-green-500/20"
                        : recording.status === "processing"
                        ? "bg-yellow-500/10 text-yellow-600 border-yellow-500/20"
                        : "bg-red-500/10 text-red-600 border-red-500/20"
                    }`}
                  >
                    {recording.status}
                  </Badge>
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  {recording.duration_seconds && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {formatDuration(recording.duration_seconds)}
                    </span>
                  )}
                  {recording.file_size_bytes && (
                    <span>{formatFileSize(recording.file_size_bytes)}</span>
                  )}
                  {recording.recorded_at && (
                    <span>
                      {new Date(recording.recorded_at).toLocaleDateString()}
                    </span>
                  )}
                </div>

                {/* Transcript preview */}
                {recording.type === "transcript" && recording.transcript_text && (
                  <div className="mt-3 p-3 bg-muted/50 rounded-md max-h-40 overflow-y-auto">
                    <p className="text-sm whitespace-pre-wrap">{recording.transcript_text.slice(0, 500)}
                      {recording.transcript_text.length > 500 && "..."}
                    </p>
                  </div>
                )}

                {/* AI Summary preview */}
                {recording.type === "ai_summary" && recording.ai_summary_json && (
                  <div className="mt-3 p-3 bg-muted/50 rounded-md">
                    <p className="text-sm text-muted-foreground">
                      AI-generated summary available
                    </p>
                  </div>
                )}
              </div>

              {/* Actions */}
              {recording.status === "ready" && recording.storage_url && (
                <Button variant="outline" size="sm" className="gap-2 flex-shrink-0" asChild>
                  <a href={recording.storage_url} target="_blank" rel="noopener noreferrer">
                    <Play className="w-4 h-4" />
                    {recording.type === "transcript" ? "View" : "Play"}
                  </a>
                </Button>
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
}
