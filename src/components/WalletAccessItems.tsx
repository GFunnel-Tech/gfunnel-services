import { Video, Folder, FileText, HelpCircle, ExternalLink, Settings, BarChart3, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { AccessItem } from "@/lib/walletTypes";

interface WalletAccessItemsProps {
  items: AccessItem[];
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  video: Video,
  folder: Folder,
  file: FileText,
  help: HelpCircle,
  settings: Settings,
  chart: BarChart3,
  users: Users,
};

export const WalletAccessItems = ({ items }: WalletAccessItemsProps) => {
  if (!items || items.length === 0) return null;

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
        <Folder className="w-4 h-4" />
        My Workspace
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {items.map((item) => {
          const IconComponent = iconMap[item.icon] || FileText;
          
          return (
            <a
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group"
            >
              <Card className="h-full transition-all duration-200 hover:border-primary/50 hover:shadow-md hover:-translate-y-0.5">
                <CardContent className="p-4 flex flex-col items-center text-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <IconComponent className="w-5 h-5 text-primary" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium flex items-center gap-1">
                      {item.label}
                      <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </p>
                    {item.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {item.description}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </a>
          );
        })}
      </div>
    </div>
  );
};
