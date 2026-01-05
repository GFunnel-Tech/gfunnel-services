import { Link } from 'react-router-dom';
import { DepartmentConfig, getDepartmentColorClasses } from '@/lib/departmentConfigs';
import { ArrowRight } from 'lucide-react';

interface DepartmentCardProps {
  department: DepartmentConfig;
}

export const DepartmentCard = ({ department }: DepartmentCardProps) => {
  const colorClasses = getDepartmentColorClasses(department.color);

  return (
    <Link to={`/service-hub/${department.slug}`}>
      <div className="group relative overflow-hidden rounded-xl border border-border/60 bg-card p-4 cursor-pointer transition-all duration-300 hover:border-border hover:shadow-md h-full">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div
            className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-lg ${colorClasses.bg} ${colorClasses.border} border`}
          >
            {department.icon}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                {department.name}
              </h3>
              <ArrowRight className={`w-4 h-4 flex-shrink-0 ${colorClasses.text} opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-300`} />
            </div>
            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
              {department.shortDescription}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};
