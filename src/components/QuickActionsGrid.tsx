import { Button } from '@/components/ui/button';
import { DepartmentConfig, QuickAction, getDepartmentColorClasses } from '@/lib/departmentConfigs';

interface QuickActionsGridProps {
  department: DepartmentConfig;
  onActionClick: (action: QuickAction) => void;
}

export const QuickActionsGrid = ({ department, onActionClick }: QuickActionsGridProps) => {
  const colorClasses = getDepartmentColorClasses(department.color);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {department.quickActions.map((action, index) => (
        <Button
          key={index}
          variant="outline"
          onClick={() => onActionClick(action)}
          className={`h-auto py-4 px-4 flex flex-col items-center gap-2 hover:${colorClasses.bg} hover:border-${department.color}-500/30`}
        >
          <span className="text-xl">{action.icon}</span>
          <span className="text-sm text-center">{action.title}</span>
        </Button>
      ))}
    </div>
  );
};
