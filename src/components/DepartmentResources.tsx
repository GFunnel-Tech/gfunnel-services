import { DepartmentConfig } from '@/lib/departmentConfigs';
import { ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

interface DepartmentResourcesProps {
  department: DepartmentConfig;
}

const colorHoverClasses: Record<string, string> = {
  blue: 'hover:bg-blue-500/10 hover:border-blue-500/30',
  purple: 'hover:bg-purple-500/10 hover:border-purple-500/30',
  green: 'hover:bg-green-500/10 hover:border-green-500/30',
  orange: 'hover:bg-orange-500/10 hover:border-orange-500/30',
  teal: 'hover:bg-teal-500/10 hover:border-teal-500/30',
  pink: 'hover:bg-pink-500/10 hover:border-pink-500/30',
  cyan: 'hover:bg-cyan-500/10 hover:border-cyan-500/30',
  violet: 'hover:bg-violet-500/10 hover:border-violet-500/30',
};

export const DepartmentResources = ({ department }: DepartmentResourcesProps) => {
  const hoverClass = colorHoverClasses[department.color] || colorHoverClasses.blue;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {department.resources.map((resource, index) => {
        const isExternal = resource.url.startsWith('http');
        
        if (isExternal) {
          return (
            <a
              key={index}
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                'flex items-center gap-3 p-4 rounded-lg border border-border/50 bg-card/50 transition-all duration-200 group',
                hoverClass
              )}
            >
              <span className="text-xl flex-shrink-0">{resource.icon}</span>
              <span className="flex-1 text-foreground group-hover:text-primary transition-colors text-sm leading-tight">
                {resource.title}
              </span>
              <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
            </a>
          );
        }
        
        return (
          <Link
            key={index}
            to={resource.url}
            className={cn(
              'flex items-center gap-3 p-4 rounded-lg border border-border/50 bg-card/50 transition-all duration-200 group',
              hoverClass
            )}
          >
            <span className="text-xl flex-shrink-0">{resource.icon}</span>
            <span className="flex-1 text-foreground group-hover:text-primary transition-colors text-sm leading-tight">
              {resource.title}
            </span>
          </Link>
        );
      })}
    </div>
  );
};
