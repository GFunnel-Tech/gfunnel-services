import { 
  Video, Folder, FileText, HelpCircle, ExternalLink, Settings, BarChart3, Users,
  Image, Link, Globe, User, Calendar, Mail, Phone, MessageCircle, Bookmark, 
  Star, Heart, Home, Briefcase, Database, Cloud, Download, Upload, File
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { AccessItem } from "@/lib/walletTypes";

interface WalletAccessItemsProps {
  items: AccessItem[];
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  video: Video,
  folder: Folder,
  file: File,
  'file-text': FileText,
  help: HelpCircle,
  settings: Settings,
  chart: BarChart3,
  users: Users,
  image: Image,
  link: Link,
  globe: Globe,
  user: User,
  calendar: Calendar,
  mail: Mail,
  phone: Phone,
  'message-circle': MessageCircle,
  bookmark: Bookmark,
  star: Star,
  heart: Heart,
  home: Home,
  briefcase: Briefcase,
  database: Database,
  cloud: Cloud,
  download: Download,
  upload: Upload,
  'external-link': ExternalLink,
};

export const WalletAccessItems = ({ items }: WalletAccessItemsProps) => {
  if (!items || items.length === 0) return null;

  return (
    <div className="grid grid-cols-2 gap-3">
        {items.map((item) => {
          const IconComponent = iconMap[item.icon] || Folder;
          
          return (
            <a
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group"
            >
              <Card className="h-full transition-all duration-200 hover:border-primary/50 hover:shadow-md hover:-translate-y-0.5">
                <CardContent className="p-4 flex flex-col items-center text-center gap-2 min-h-[120px] justify-center">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    <IconComponent className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-tight">
                      {item.label}
                    </p>
                    {item.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
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
  );
};
