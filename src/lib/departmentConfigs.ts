export interface Role {
  title: string;
  isFilled: boolean;
}

export interface Resource {
  title: string;
  url: string;
  icon: string;
}

export interface QuickAction {
  title: string;
  icon: string;
  formType: 'request' | 'idea' | 'delegate';
}

export interface CoreAction {
  title: string;
  icon: string;
  type: 'request' | 'idea' | 'delegate';
  description: string;
}

export interface DepartmentConfig {
  slug: string;
  name: string;
  icon: string;
  shortDescription: string;
  overview: string;
  color: string;
  coreActions: CoreAction[];
  quickActions: QuickAction[];
  roles: Role[];
  resources: Resource[];
}

export const departmentConfigs: DepartmentConfig[] = [
  {
    slug: 'sales-marketing',
    name: 'Sales & Marketing',
    icon: '📈',
    shortDescription: 'Drives customer acquisition and brand awareness',
    overview: 'Drives customer acquisition, brand awareness, and revenue growth through campaigns, content, and customer engagement.',
    color: 'blue',
    coreActions: [
      { title: 'Submit Marketing Request', icon: '📋', type: 'request', description: 'Form for campaigns, content, design needs' },
      { title: 'Share Campaign Idea', icon: '💡', type: 'idea', description: 'Idea submission board' },
      { title: 'Delegate Content Task', icon: '✅', type: 'delegate', description: 'Task assignment system' },
    ],
    quickActions: [
      { title: 'Create Campaign', icon: '🎯', formType: 'request' },
      { title: 'Request Newsletter', icon: '📧', formType: 'request' },
      { title: 'Request Design Work', icon: '🎨', formType: 'request' },
      { title: 'Request Analytics Report', icon: '📊', formType: 'request' },
      { title: 'Social Media Campaign', icon: '📱', formType: 'request' },
      { title: 'SEO Initiative', icon: '🔍', formType: 'request' },
    ],
    roles: [
      { title: 'Chief Marketing Officer (CMO)', isFilled: false },
      { title: 'Content Marketing Lead', isFilled: false },
      { title: 'SEO Specialist', isFilled: false },
      { title: 'Social Media Manager', isFilled: false },
      { title: 'Marketing Designer', isFilled: false },
      { title: 'Marketing Analyst', isFilled: false },
    ],
    resources: [
      { title: 'Access Marketing SOPs', url: '#', icon: '📚' },
      { title: 'Brand Guidelines', url: '#', icon: '🎨' },
      { title: 'Campaign Templates', url: '#', icon: '📝' },
      { title: 'Content Calendar', url: '#', icon: '📅' },
      { title: 'Analytics Dashboards', url: '#', icon: '📊' },
    ],
  },
  {
    slug: 'product-development',
    name: 'Product & Development',
    icon: '💻',
    shortDescription: 'Builds and improves the platform',
    overview: "Builds and improves GFunnel's platform through user-centered design, engineering excellence, and continuous innovation.",
    color: 'purple',
    coreActions: [
      { title: 'Submit Feature Request', icon: '📋', type: 'request', description: 'Product backlog intake' },
      { title: 'Share Product Idea', icon: '💡', type: 'idea', description: 'Innovation pipeline' },
      { title: 'Delegate Dev Task', icon: '✅', type: 'delegate', description: 'Engineering task board' },
    ],
    quickActions: [
      { title: 'Report Bug', icon: '🐛', formType: 'request' },
      { title: 'Request Integration', icon: '🔗', formType: 'request' },
      { title: 'UX Improvement', icon: '✨', formType: 'idea' },
      { title: 'Technical Documentation', icon: '📖', formType: 'request' },
      { title: 'API Request', icon: '🔌', formType: 'request' },
      { title: 'Create Project', icon: '🚀', formType: 'request' },
    ],
    roles: [
      { title: 'Chief Product Officer (CPO)', isFilled: false },
      { title: 'Product Manager', isFilled: false },
      { title: 'Lead Engineer', isFilled: false },
      { title: 'Frontend Developer', isFilled: false },
      { title: 'Backend Developer', isFilled: false },
      { title: 'UX/UI Designer', isFilled: false },
      { title: 'QA Engineer', isFilled: false },
    ],
    resources: [
      { title: 'Access Product SOPs', url: '#', icon: '📚' },
      { title: 'Technical Documentation', url: '#', icon: '📖' },
      { title: 'Design System', url: '#', icon: '🎨' },
      { title: 'API Documentation', url: '#', icon: '🔌' },
      { title: 'Development Standards', url: '#', icon: '📋' },
    ],
  },
  {
    slug: 'operations',
    name: 'Operations',
    icon: '⚙️',
    shortDescription: 'Ensures smooth daily operations',
    overview: 'Ensures smooth daily operations, process optimization, and efficient delivery of services across all functions.',
    color: 'green',
    coreActions: [
      { title: 'Submit Operations Request', icon: '📋', type: 'request', description: 'Process improvement intake' },
      { title: 'Share Process Idea', icon: '💡', type: 'idea', description: 'Efficiency suggestions' },
      { title: 'Delegate Operational Task', icon: '✅', type: 'delegate', description: 'Operations workflow' },
    ],
    quickActions: [
      { title: 'Request Process Documentation', icon: '📝', formType: 'request' },
      { title: 'System Access Request', icon: '🔑', formType: 'request' },
      { title: 'Vendor Management', icon: '🤝', formType: 'request' },
      { title: 'Workflow Automation', icon: '🤖', formType: 'idea' },
      { title: 'Infrastructure Request', icon: '🏗️', formType: 'request' },
      { title: 'Create SOP', icon: '📋', formType: 'request' },
    ],
    roles: [
      { title: 'Chief Operating Officer (COO)', isFilled: false },
      { title: 'Operations Manager', isFilled: false },
      { title: 'Process Analyst', isFilled: false },
      { title: 'Operations Coordinator', isFilled: false },
      { title: 'Automation Specialist', isFilled: false },
    ],
    resources: [
      { title: 'Access Operations SOPs', url: '#', icon: '📚' },
      { title: 'Process Templates', url: '#', icon: '📝' },
      { title: 'Vendor List', url: '#', icon: '🤝' },
      { title: 'System Documentation', url: '#', icon: '💻' },
      { title: 'Automation Workflows', url: '#', icon: '🤖' },
    ],
  },
  {
    slug: 'finance-admin',
    name: 'Finance & Admin',
    icon: '💰',
    shortDescription: 'Manages financial planning and compliance',
    overview: 'Manages financial planning, accounting, compliance, and administrative operations to support sustainable growth.',
    color: 'orange',
    coreActions: [
      { title: 'Submit Finance Request', icon: '📋', type: 'request', description: 'Budget, expenses, invoices' },
      { title: 'Share Financial Idea', icon: '💡', type: 'idea', description: 'Cost optimization suggestions' },
      { title: 'Delegate Admin Task', icon: '✅', type: 'delegate', description: 'Administrative workflow' },
    ],
    quickActions: [
      { title: 'Expense Approval', icon: '💳', formType: 'request' },
      { title: 'Budget Request', icon: '📊', formType: 'request' },
      { title: 'Invoice Submission', icon: '🧾', formType: 'request' },
      { title: 'Contract Review', icon: '📄', formType: 'request' },
      { title: 'Compliance Check', icon: '✅', formType: 'request' },
      { title: 'Financial Report Request', icon: '📈', formType: 'request' },
    ],
    roles: [
      { title: 'Chief Financial Officer (CFO)', isFilled: false },
      { title: 'Controller', isFilled: false },
      { title: 'Accountant', isFilled: false },
      { title: 'Financial Analyst', isFilled: false },
      { title: 'Office Manager', isFilled: false },
      { title: 'Compliance Officer', isFilled: false },
    ],
    resources: [
      { title: 'Access Finance SOPs', url: '#', icon: '📚' },
      { title: 'Budget Templates', url: '#', icon: '📊' },
      { title: 'Expense Policies', url: '#', icon: '💳' },
      { title: 'Contract Templates', url: '#', icon: '📄' },
      { title: 'Compliance Guidelines', url: '#', icon: '✅' },
    ],
  },
  {
    slug: 'strategy-analytics',
    name: 'Strategy & Analytics',
    icon: '🎯',
    shortDescription: 'Drives strategic planning and data insights',
    overview: 'Drives strategic planning, business intelligence, and data-driven decision making across the organization.',
    color: 'teal',
    coreActions: [
      { title: 'Submit Analysis Request', icon: '📋', type: 'request', description: 'Data insights needs' },
      { title: 'Share Strategic Idea', icon: '💡', type: 'idea', description: 'Strategic initiative proposals' },
      { title: 'Delegate Research Task', icon: '✅', type: 'delegate', description: 'Analysis assignments' },
    ],
    quickActions: [
      { title: 'Request Market Research', icon: '🔍', formType: 'request' },
      { title: 'Competitive Analysis', icon: '⚔️', formType: 'request' },
      { title: 'Strategic Planning Session', icon: '🗓️', formType: 'request' },
      { title: 'Data Dashboard Request', icon: '📊', formType: 'request' },
      { title: 'Business Case Development', icon: '💼', formType: 'request' },
      { title: 'KPI Review', icon: '📈', formType: 'request' },
    ],
    roles: [
      { title: 'Chief Strategy Officer (CSO)', isFilled: false },
      { title: 'Business Analyst', isFilled: false },
      { title: 'Data Scientist', isFilled: false },
      { title: 'Market Research Lead', isFilled: false },
      { title: 'Strategic Planner', isFilled: false },
    ],
    resources: [
      { title: 'Access Strategy SOPs', url: '#', icon: '📚' },
      { title: 'Analysis Templates', url: '#', icon: '📝' },
      { title: 'Market Research Tools', url: '#', icon: '🔍' },
      { title: 'Strategic Planning Frameworks', url: '#', icon: '🗺️' },
      { title: 'KPI Dashboards', url: '#', icon: '📊' },
    ],
  },
  {
    slug: 'people-culture',
    name: 'People & Culture',
    icon: '👥',
    shortDescription: 'Attracts and develops top talent',
    overview: 'Attracts, develops, and retains top talent while fostering a positive, productive workplace culture.',
    color: 'pink',
    coreActions: [
      { title: 'Submit HR Request', icon: '📋', type: 'request', description: 'Hiring, benefits, issues' },
      { title: 'Share Culture Idea', icon: '💡', type: 'idea', description: 'Team building, engagement' },
      { title: 'Delegate People Task', icon: '✅', type: 'delegate', description: 'HR workflow' },
    ],
    quickActions: [
      { title: 'Start Hiring Process', icon: '🎯', formType: 'request' },
      { title: 'Request Training', icon: '📚', formType: 'request' },
      { title: 'Report Issue', icon: '⚠️', formType: 'request' },
      { title: 'Benefits Question', icon: '❓', formType: 'request' },
      { title: 'Performance Review', icon: '📊', formType: 'request' },
      { title: 'Team Building Event', icon: '🎉', formType: 'idea' },
    ],
    roles: [
      { title: 'Chief People Officer (CPO)', isFilled: false },
      { title: 'HR Manager', isFilled: false },
      { title: 'Recruiter', isFilled: false },
      { title: 'Training & Development Lead', isFilled: false },
      { title: 'Culture Coordinator', isFilled: false },
    ],
    resources: [
      { title: 'Access HR SOPs', url: '#', icon: '📚' },
      { title: 'Onboarding Materials', url: '#', icon: '👋' },
      { title: 'Training Resources', url: '#', icon: '🎓' },
      { title: 'Benefits Information', url: '#', icon: '💝' },
      { title: 'Employee Handbook', url: '#', icon: '📖' },
    ],
  },
];

export const getDepartmentBySlug = (slug: string): DepartmentConfig | undefined => {
  return departmentConfigs.find((dept) => dept.slug === slug);
};

export const getDepartmentColorClasses = (color: string): { bg: string; border: string; text: string } => {
  const colorMap: Record<string, { bg: string; border: string; text: string }> = {
    blue: { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-500' },
    purple: { bg: 'bg-purple-500/10', border: 'border-purple-500/30', text: 'text-purple-500' },
    green: { bg: 'bg-green-500/10', border: 'border-green-500/30', text: 'text-green-500' },
    orange: { bg: 'bg-orange-500/10', border: 'border-orange-500/30', text: 'text-orange-500' },
    teal: { bg: 'bg-teal-500/10', border: 'border-teal-500/30', text: 'text-teal-500' },
    pink: { bg: 'bg-pink-500/10', border: 'border-pink-500/30', text: 'text-pink-500' },
  };
  return colorMap[color] || colorMap.blue;
};
