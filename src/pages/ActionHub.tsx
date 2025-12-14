import { Eyebrow } from '@/components/ui/eyebrow';
import { DepartmentCard } from '@/components/DepartmentCard';
import { departmentConfigs } from '@/lib/departmentConfigs';

const ActionHub = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <Eyebrow>Organizational Hub</Eyebrow>
            <h1 className="text-4xl md:text-5xl font-bold mt-4 mb-6">
              GFunnel <span className="gradient-text">Action Hub</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Your organizational operating system. Submit requests, delegate tasks, and access
              resources across all departments.
            </p>
          </div>

          {/* Department Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {departmentConfigs.map((department) => (
              <DepartmentCard key={department.slug} department={department} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ActionHub;
