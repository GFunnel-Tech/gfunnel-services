import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { CoreActions } from '@/components/CoreActions';
import { QuickActionsGrid } from '@/components/QuickActionsGrid';
import { RolesStructure } from '@/components/RolesStructure';
import { DepartmentResources } from '@/components/DepartmentResources';
import { ActionFormModal } from '@/components/ActionFormModal';
import {
  getDepartmentBySlug,
  getDepartmentColorClasses,
  CoreAction,
  QuickAction,
  Role,
} from '@/lib/departmentConfigs';

const DepartmentPage = () => {
  const { departmentSlug } = useParams<{ departmentSlug: string }>();
  const department = getDepartmentBySlug(departmentSlug || '');

  const [modalOpen, setModalOpen] = useState(false);
  const [formType, setFormType] = useState<'request' | 'idea' | 'delegate' | 'hire'>('request');
  const [actionTitle, setActionTitle] = useState<string | undefined>();
  const [selectedRole, setSelectedRole] = useState<Role | undefined>();

  if (!department) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Department Not Found</h1>
          <Link to="/action-hub">
            <Button variant="outline">Back to Action Hub</Button>
          </Link>
        </div>
      </div>
    );
  }

  const colorClasses = getDepartmentColorClasses(department.color);

  const handleCoreActionClick = (action: CoreAction) => {
    setFormType(action.type);
    setActionTitle(action.title);
    setSelectedRole(undefined);
    setModalOpen(true);
  };

  const handleQuickActionClick = (action: QuickAction) => {
    setFormType(action.formType);
    setActionTitle(action.title);
    setSelectedRole(undefined);
    setModalOpen(true);
  };

  const handleHireClick = (role: Role) => {
    setFormType('hire');
    setActionTitle(undefined);
    setSelectedRole(role);
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="py-8 border-b border-border/50">
        <div className="container mx-auto px-4">
          <Link
            to="/action-hub"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Action Hub</span>
          </Link>

          <div className="flex items-center gap-4">
            <div
              className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl ${colorClasses.bg} ${colorClasses.border} border`}
            >
              {department.icon}
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                {department.name}
              </h1>
              <p className="text-muted-foreground mt-1">{department.overview}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Actions */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <h2 className="text-xl font-semibold mb-4">Core Actions</h2>
          <CoreActions department={department} onActionClick={handleCoreActionClick} />
        </div>
      </section>

      {/* Expandable Sections */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <Accordion type="multiple" defaultValue={['quick-actions']} className="space-y-4">
            {/* Quick Actions */}
            <AccordionItem value="quick-actions" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3">
                  <span className="text-xl">⚡</span>
                  <span className="font-semibold">Quick Actions</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <QuickActionsGrid department={department} onActionClick={handleQuickActionClick} />
              </AccordionContent>
            </AccordionItem>

            {/* Roles & Structure */}
            <AccordionItem value="roles" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3">
                  <span className="text-xl">👥</span>
                  <span className="font-semibold">Roles & Structure</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <RolesStructure department={department} onHireClick={handleHireClick} />
              </AccordionContent>
            </AccordionItem>

            {/* Resources */}
            <AccordionItem value="resources" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3">
                  <span className="text-xl">📚</span>
                  <span className="font-semibold">Resources</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <DepartmentResources department={department} />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Form Modal */}
      <ActionFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        formType={formType}
        department={department}
        actionTitle={actionTitle}
        selectedRole={selectedRole}
      />
    </div>
  );
};

export default DepartmentPage;
