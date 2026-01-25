import { useState } from "react";
import { User, Mail, Phone, Video, ExternalLink, MessageSquare, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface ProfileData {
  name: string;
  email?: string;
  phone?: string;
  photoUrl?: string;
  googleMeetLink?: string;
  profileLink?: string;
  type: 'human' | 'ai';
  aiType?: string;
  aiAgentId?: string;
  aiEmbedUrl?: string;
  roleId?: string;
}

interface ProfileCardProps {
  profile: ProfileData;
  roleTitle: string;
  departmentColor?: string;
  compact?: boolean;
  onChat?: () => void;
  onViewProfile?: () => void;
}

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export const ProfileCard = ({ 
  profile, 
  roleTitle, 
  departmentColor = 'blue',
  compact = false,
  onChat,
  onViewProfile
}: ProfileCardProps) => {
  const [imageError, setImageError] = useState(false);
  const isAI = profile.type === 'ai';

  const colorClasses: Record<string, string> = {
    blue: 'bg-blue-500/10 border-blue-500/20',
    purple: 'bg-purple-500/10 border-purple-500/20',
    green: 'bg-green-500/10 border-green-500/20',
    orange: 'bg-orange-500/10 border-orange-500/20',
    teal: 'bg-teal-500/10 border-teal-500/20',
    pink: 'bg-pink-500/10 border-pink-500/20',
  };

  const bgClass = colorClasses[departmentColor] || colorClasses.blue;

  if (compact) {
    return (
      <div className={cn("flex items-center gap-3 p-2 rounded-lg", bgClass)}>
        <Avatar className="h-8 w-8">
          {!imageError && profile.photoUrl ? (
            <AvatarImage src={profile.photoUrl} alt={profile.name} onError={() => setImageError(true)} />
          ) : null}
          <AvatarFallback className={isAI ? "bg-accent text-accent-foreground" : ""}>
            {isAI ? <Bot className="w-4 h-4" /> : getInitials(profile.name)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{profile.name}</p>
          <p className="text-xs text-muted-foreground truncate">{roleTitle}</p>
        </div>
        {isAI && (
          <Badge variant="secondary" className="text-[10px] shrink-0">
            <Bot className="w-2.5 h-2.5 mr-0.5" />
            AI
          </Badge>
        )}
      </div>
    );
  }

  return (
    <Card 
      className={cn(
        "overflow-hidden cursor-pointer transition-all hover:shadow-md", 
        bgClass
      )}
      onClick={onViewProfile}
    >
      <CardContent className="p-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <Avatar className="h-14 w-14">
            {!imageError && profile.photoUrl ? (
              <AvatarImage src={profile.photoUrl} alt={profile.name} onError={() => setImageError(true)} />
            ) : null}
            <AvatarFallback className={cn("text-lg", isAI && "bg-accent text-accent-foreground")}>
              {isAI ? <Bot className="w-6 h-6" /> : getInitials(profile.name)}
            </AvatarFallback>
          </Avatar>

          {/* Info */}
          <div className="flex-1 min-w-0 space-y-1">
            <div className="flex items-center gap-2">
              <h4 className="font-semibold truncate">{profile.name}</h4>
              {isAI && (
                <Badge variant="secondary" className="text-[10px] shrink-0">
                  <Bot className="w-2.5 h-2.5 mr-0.5" />
                  {profile.aiType || 'AI'}
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{roleTitle}</p>

            {/* Contact Info for Human */}
            {!isAI && (
              <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground mt-2">
                {profile.email && (
                  <a 
                    href={`mailto:${profile.email}`}
                    className="flex items-center gap-1 hover:text-foreground transition-colors"
                  >
                    <Mail className="w-3 h-3" />
                    <span className="truncate max-w-[140px]">{profile.email}</span>
                  </a>
                )}
                {profile.phone && (
                  <a 
                    href={`tel:${profile.phone}`}
                    className="flex items-center gap-1 hover:text-foreground transition-colors"
                  >
                    <Phone className="w-3 h-3" />
                    <span>{profile.phone}</span>
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-4">
          {isAI ? (
            <Button 
              variant="default" 
              size="sm" 
              className="flex-1"
              onClick={onChat}
            >
              <MessageSquare className="w-4 h-4 mr-1.5" />
              Chat Now
            </Button>
          ) : (
            <>
              {profile.googleMeetLink && (
                <Button variant="outline" size="sm" className="flex-1" asChild>
                  <a href={profile.googleMeetLink} target="_blank" rel="noopener noreferrer">
                    <Video className="w-4 h-4 mr-1.5" />
                    Meet
                  </a>
                </Button>
              )}
              {profile.email && (
                <Button variant="outline" size="sm" className="flex-1" asChild>
                  <a href={`mailto:${profile.email}`}>
                    <Mail className="w-4 h-4 mr-1.5" />
                    Email
                  </a>
                </Button>
              )}
            </>
          )}
          {profile.profileLink && (
            <Button variant="ghost" size="sm" asChild>
              <a href={profile.profileLink} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4" />
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
