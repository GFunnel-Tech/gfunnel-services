import { ServiceConfig } from "@/lib/serviceConfigs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ServiceCardProps {
  service: ServiceConfig;
}

export const ServiceCard = ({ service }: ServiceCardProps) => {
  const navigate = useNavigate();
  const Icon = service.badgeIcon;

  const handleClick = () => {
    navigate(`/${service.slug}`);
  };

  return (
    <Card 
      className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 hover:border-primary/50 h-full flex flex-col"
      onClick={handleClick}
    >
      <CardHeader>
        <div className="flex items-start justify-between mb-3">
          <div className="p-3 rounded-lg bg-primary/10 text-primary">
            <Icon className="w-6 h-6" />
          </div>
          <Badge variant="secondary" className="text-xs">
            {service.badgeText}
          </Badge>
        </div>
        <CardTitle className="text-xl group-hover:text-primary transition-colors">
          {service.name}
        </CardTitle>
        <CardDescription className="line-clamp-2 h-[44px] leading-snug">
          {service.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-grow flex flex-col justify-between">
        <div className="grid grid-cols-3 gap-2 mb-4">
          {service.stats.slice(0, 3).map((stat, index) => (
            <div key={index} className="text-center">
              <div className="font-bold text-primary text-base truncate">{stat.value}</div>
              <div className="text-xs text-muted-foreground line-clamp-2 leading-tight">{stat.label}</div>
            </div>
          ))}
        </div>

        <Button 
          variant="outline" 
          className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            handleClick();
          }}
        >
          View Details
          <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </CardContent>
    </Card>
  );
};
