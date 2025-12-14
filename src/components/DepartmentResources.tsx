import { DepartmentConfig, getDepartmentColorClasses } from '@/lib/departmentConfigs';
import { ExternalLink } from 'lucide-react';

interface DepartmentResourcesProps {
  department: DepartmentConfig;
}

export const DepartmentResources = ({ department }: DepartmentResourcesProps) => {
  const colorClasses = getDepartmentColorClasses(department.color);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {department.resources.map((resource, index) => (
        <a
          key={index}
          href={resource.url}
          target="_parent"
          className={`flex items-center gap-3 p-4 rounded-lg border border-border/50 bg-card/50 hover:${colorClasses.bg} hover:border-${department.color}-500/30 transition-all duration-200 group`}
        >
          <span className="text-xl">{resource.icon}</span>
          <span className="flex-1 text-foreground group-hover:text-primary transition-colors">
            {resource.title}
          </span>
          <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
        </a>
      ))}
    </div>
  );
};
