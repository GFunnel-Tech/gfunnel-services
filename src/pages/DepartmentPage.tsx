import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink } from 'lucide-react';
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
import { ServiceTypeModal, ServiceRequestType } from '@/components/ServiceTypeModal';
import {
  getDepartmentBySlug,
  getDepartmentColorClasses,
  CoreAction,
  QuickAction,
  Role,
} from '@/lib/departmentConfigs';
import { getStoredEmail, fetchWalletData } from '@/lib/walletService';

const DepartmentPage = () => {
  const { departmentSlug } = useParams<{ departmentSlug: string }>();
  const department = getDepartmentBySlug(departmentSlug || '');

  const [modalOpen, setModalOpen] = useState(false);
  const [formType, setFormType] = useState<'request' | 'idea' | 'delegate' | 'hire'>('request');
  const [actionTitle, setActionTitle] = useState<string | undefined>();
  const [selectedRole, setSelectedRole] = useState<Role | undefined>();
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [serviceRequestType, setServiceRequestType] = useState<ServiceRequestType | null>(null);
  const [pendingAction, setPendingAction] = useState<{ type: 'core' | 'quick'; action: CoreAction | QuickAction } | null>(null);
  const [planName, setPlanName] = useState<string | undefined>();

  // Fetch user's plan name on mount
  useEffect(() => {
    const email = getStoredEmail();
    if (email) {
      fetchWalletData(email).then((res) => {
        if (res.success && res.data) {
          setPlanName(res.data.plan_name);
        }
      });
    }
  }, []);

  if (!department) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Department Not Found</h1>
          <Link to="/service-hub">
            <Button variant="outline">Back to Service Hub</Button>
          </Link>
        </div>
      </div>
    );
  }

  const colorClasses = getDepartmentColorClasses(department.color);

  const handleCoreActionClick = (action: CoreAction) => {
    // Show the service type modal first
    setPendingAction({ type: 'core', action });
    setFormType(action.type);
    setActionTitle(action.title);
    setSelectedRole(undefined);
    setShowTypeModal(true);
  };

  const handleQuickActionClick = (action: QuickAction) => {
    // Show the service type modal first
    setPendingAction({ type: 'quick', action });
    setFormType(action.formType);
    setActionTitle(action.title);
    setSelectedRole(undefined);
    setShowTypeModal(true);
  };

  const handleHireClick = (role: Role) => {
    // Hire doesn't need the type modal, go straight to form
    setFormType('hire');
    setActionTitle(undefined);
    setSelectedRole(role);
    setModalOpen(true);
  };

  const handleTypeSelect = (type: ServiceRequestType) => {
    setServiceRequestType(type);
    setShowTypeModal(false);
    setModalOpen(true);
  };

  const handleTypeModalClose = () => {
    setShowTypeModal(false);
    setPendingAction(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="py-8 border-b border-border/50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <Link
              to="/service-hub"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Service Hub</span>
            </Link>
            <a href="https://gitscrum.com/workspace" target="_parent">
              <Button variant="outline" className="gap-2">
                <ExternalLink className="w-4 h-4" />
                <span className="hidden sm:inline">Open Workspace</span>
                <span className="sm:hidden">Workspace</span>
              </Button>
            </a>
          </div>

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

      {/* Service Type Selection Modal */}
      <ServiceTypeModal
        isOpen={showTypeModal}
        onSelect={handleTypeSelect}
        serviceName={actionTitle || department.name}
        onClose={handleTypeModalClose}
      />

      {/* Form Modal */}
      <ActionFormModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setServiceRequestType(null);
          setPendingAction(null);
        }}
        formType={formType}
        department={department}
        actionTitle={actionTitle}
        selectedRole={selectedRole}
        serviceRequestType={serviceRequestType}
        planName={planName}
      />
    </div>
  );
};

export default DepartmentPage;
