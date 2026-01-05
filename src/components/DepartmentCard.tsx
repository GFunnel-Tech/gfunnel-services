import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { DepartmentConfig, getDepartmentColorClasses } from '@/lib/departmentConfigs';
import { ArrowRight } from 'lucide-react';

interface DepartmentCardProps {
  department: DepartmentConfig;
}

export const DepartmentCard = ({ department }: DepartmentCardProps) => {
  const colorClasses = getDepartmentColorClasses(department.color);

  return (
    <Link to={`/service-hub/${department.slug}`}>
      <Card className="group relative overflow-hidden p-5 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg border-border/50 bg-card h-full">
        <div className="flex flex-col gap-3">
          {/* Top row: Icon + Title + Arrow */}
          <div className="flex items-center gap-3">
            {/* Icon */}
            <div
              className={`flex-shrink-0 w-11 h-11 rounded-lg flex items-center justify-center text-xl ${colorClasses.bg} ${colorClasses.border} border`}
            >
              {department.icon}
            </div>

            {/* Title + Arrow */}
            <div className="flex-1 flex items-center justify-between min-w-0">
              <h3 className="font-semibold text-base text-foreground group-hover:text-primary transition-colors truncate">
                {department.name}
              </h3>
              <ArrowRight className={`w-5 h-5 flex-shrink-0 ml-2 ${colorClasses.text} opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300`} />
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground line-clamp-2">
            {department.shortDescription}
          </p>
        </div>
      </Card>
    </Link>
  );
};
