import { Button } from '@/components/ui/button';
import { DepartmentConfig, Role, getDepartmentColorClasses } from '@/lib/departmentConfigs';
import { UserPlus } from 'lucide-react';

interface RolesStructureProps {
  department: DepartmentConfig;
  onHireClick: (role: Role) => void;
}

export const RolesStructure = ({ department, onHireClick }: RolesStructureProps) => {
  const colorClasses = getDepartmentColorClasses(department.color);

  return (
    <div className="space-y-3">
      {department.roles.map((role, index) => (
        <div
          key={index}
          className="flex items-center justify-between p-4 rounded-lg border border-border/50 bg-card/50"
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-2 h-2 rounded-full ${
                role.isFilled ? 'bg-green-500' : 'bg-muted-foreground/30'
              }`}
            />
            <span className="text-foreground">{role.title}</span>
            {!role.isFilled && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                Vacant
              </span>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onHireClick(role)}
            className={`gap-2 ${colorClasses.text} hover:${colorClasses.bg}`}
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Hire</span>
          </Button>
        </div>
      ))}
    </div>
  );
};
