import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Download, ExternalLink, Loader2 } from "lucide-react";
import { useDocuments } from "@/hooks/useImmersion";
import { DOCUMENT_CATEGORIES } from "@/lib/immersionTypes";
import type { DocumentCategory } from "@/lib/immersionTypes";

interface ImmersionDocumentsProps {
  engagementId: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  Blueprint: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  SOP: "bg-purple-500/10 text-purple-600 border-purple-500/20",
  Technical: "bg-cyan-500/10 text-cyan-600 border-cyan-500/20",
  Legal: "bg-slate-500/10 text-slate-600 border-slate-500/20",
  Finance: "bg-green-500/10 text-green-600 border-green-500/20",
};

export function ImmersionDocuments({ engagementId }: ImmersionDocumentsProps) {
  const [activeCategory, setActiveCategory] = useState<DocumentCategory | undefined>(undefined);
  const { data: documents, isLoading } = useDocuments(engagementId, activeCategory);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filter Buttons */}
      <div className="flex gap-2 flex-wrap">
        <Button
          variant={!activeCategory ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveCategory(undefined)}
        >
          All
        </Button>
        {DOCUMENT_CATEGORIES.map((cat) => (
          <Button
            key={cat}
            variant={activeCategory === cat ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </Button>
        ))}
      </div>

      {/* Document List */}
      {!documents || documents.length === 0 ? (
        <Card className="p-12 text-center">
          <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Documents Yet</h3>
          <p className="text-muted-foreground">
            Documents, SOPs, and blueprints will appear here as they are delivered.
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {documents.map((doc) => {
            const categoryColor = CATEGORY_COLORS[doc.category] || CATEGORY_COLORS.Technical;
            const url = doc.external_url || doc.storage_url;

            return (
              <Card key={doc.id} className="p-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                    {doc.icon ? (
                      <span className="text-lg">{doc.icon}</span>
                    ) : (
                      <FileText className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-medium text-sm">{doc.title}</h4>
                      <Badge variant="outline" className={`text-xs ${categoryColor}`}>
                        {doc.category}
                      </Badge>
                      {doc.is_final && (
                        <Badge variant="outline" className="text-xs bg-green-500/10 text-green-600 border-green-500/20">
                          Final
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                      <span>{doc.file_type.toUpperCase()}</span>
                      {doc.page_count && <span>{doc.page_count} pages</span>}
                      <span>v{doc.version}</span>
                    </div>
                  </div>

                  {url && (
                    <Button variant="outline" size="sm" className="gap-2 flex-shrink-0" asChild>
                      <a href={url} target="_blank" rel="noopener noreferrer">
                        {doc.external_url ? (
                          <>
                            <ExternalLink className="w-4 h-4" />
                            Open
                          </>
                        ) : (
                          <>
                            <Download className="w-4 h-4" />
                            Download
                          </>
                        )}
                      </a>
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
