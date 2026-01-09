export interface Role {
  title: string;
  isFilled: boolean;
  description: string;
  responsibilities: string[];
  skills: string[];
}

export interface Resource {
  title: string;
  url: string;
  icon: string;
}

// General resources shared across all departments
export const generalResources: Resource[] = [
  { title: 'Standard Operating Procedures', url: '/resources?category=sops', icon: '📚' },
  { title: 'Templates Library', url: '/resources?category=templates', icon: '📝' },
  { title: 'Best Practices', url: '/resources?category=best-practices', icon: '✨' },
  { title: 'Documentation', url: '/resources?category=documentation', icon: '📖' },
];

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
    slug: 'revenue-generation',
    name: 'Revenue Generation',
    icon: '📈',
    shortDescription: 'Sales, Marketing, Partnerships',
    overview: 'Drives customer acquisition, revenue growth, and strategic partnerships through campaigns, outreach, and relationship building.',
    color: 'blue',
    coreActions: [
      { title: 'Submit Sales Request', icon: '📋', type: 'request', description: 'Form for sales, marketing, partnership needs' },
      { title: 'Share Growth Idea', icon: '💡', type: 'idea', description: 'Revenue growth suggestions' },
      { title: 'Delegate Outreach Task', icon: '✅', type: 'delegate', description: 'Task assignment system' },
    ],
    quickActions: [
      { title: 'Create Campaign', icon: '🎯', formType: 'request' },
      { title: 'Request Newsletter', icon: '📧', formType: 'request' },
      { title: 'Partnership Outreach', icon: '🤝', formType: 'request' },
      { title: 'Request Analytics Report', icon: '📊', formType: 'request' },
      { title: 'Social Media Campaign', icon: '📱', formType: 'request' },
      { title: 'Lead Generation', icon: '🎣', formType: 'request' },
    ],
    roles: [
      { 
        title: 'Chief Marketing Officer (CMO)', 
        isFilled: false,
        description: 'Leads the overall marketing strategy and brand direction for the organization.',
        responsibilities: ['Define marketing strategy and vision', 'Oversee brand positioning', 'Manage marketing budget', 'Lead and develop marketing team'],
        skills: ['Strategic thinking', 'Leadership', 'Brand management', 'Data-driven decision making']
      },
      { 
        title: 'VP of Sales', 
        isFilled: false,
        description: 'Drives revenue growth and leads the entire sales organization.',
        responsibilities: ['Set sales targets and quotas', 'Build and manage sales team', 'Develop sales strategy', 'Forecast revenue and pipeline'],
        skills: ['Sales leadership', 'Revenue forecasting', 'Team building', 'Strategic planning']
      },
      { 
        title: 'Sales Manager', 
        isFilled: false,
        description: 'Manages a team of sales representatives to achieve revenue targets.',
        responsibilities: ['Coach and mentor sales reps', 'Monitor sales performance', 'Develop sales playbooks', 'Run sales meetings and training'],
        skills: ['Sales coaching', 'Performance management', 'CRM expertise', 'Deal negotiation']
      },
      { 
        title: 'Account Executive', 
        isFilled: false,
        description: 'Closes new business and manages the full sales cycle from demo to contract.',
        responsibilities: ['Conduct product demos', 'Negotiate contracts', 'Manage pipeline', 'Build client relationships'],
        skills: ['Consultative selling', 'Presentation skills', 'Objection handling', 'CRM proficiency']
      },
      { 
        title: 'Sales Development Rep (SDR)', 
        isFilled: false,
        description: 'Generates qualified leads through outbound prospecting and inbound lead qualification.',
        responsibilities: ['Cold calling and emailing', 'Qualify inbound leads', 'Book meetings for AEs', 'Research target accounts'],
        skills: ['Prospecting', 'Cold outreach', 'Lead qualification', 'Persistence and resilience']
      },
      { 
        title: 'Business Development Rep (BDR)', 
        isFilled: false,
        description: 'Identifies and develops new business opportunities through strategic outreach.',
        responsibilities: ['Identify new market opportunities', 'Build partnership pipeline', 'Conduct outreach campaigns', 'Qualify strategic leads'],
        skills: ['Market research', 'Relationship building', 'Strategic thinking', 'Communication']
      },
      { 
        title: 'Customer Success Manager', 
        isFilled: false,
        description: 'Ensures customer satisfaction, retention, and expansion of existing accounts.',
        responsibilities: ['Onboard new customers', 'Drive product adoption', 'Identify upsell opportunities', 'Reduce churn'],
        skills: ['Customer relationship management', 'Product knowledge', 'Problem solving', 'Account management']
      },
      { 
        title: 'Content Marketing Lead', 
        isFilled: false,
        description: 'Creates and manages content strategy to drive engagement and conversions.',
        responsibilities: ['Develop content calendar', 'Create compelling copy', 'Manage content team', 'Measure content performance'],
        skills: ['Copywriting', 'Content strategy', 'SEO knowledge', 'Project management']
      },
      { 
        title: 'SEO Specialist', 
        isFilled: false,
        description: 'Optimizes website and content for search engine visibility and organic traffic.',
        responsibilities: ['Keyword research', 'On-page optimization', 'Technical SEO audits', 'Link building strategies'],
        skills: ['SEO tools proficiency', 'Analytical mindset', 'HTML/CSS basics', 'Content optimization']
      },
      { 
        title: 'Social Media Manager', 
        isFilled: false,
        description: 'Manages social media presence and community engagement across platforms.',
        responsibilities: ['Create social content', 'Engage with community', 'Monitor brand mentions', 'Report on social metrics'],
        skills: ['Platform expertise', 'Creative content creation', 'Community building', 'Trend awareness']
      },
      { 
        title: 'Paid Media Specialist', 
        isFilled: false,
        description: 'Manages paid advertising campaigns across digital platforms.',
        responsibilities: ['Create and optimize ad campaigns', 'Manage ad budgets', 'A/B test creatives', 'Report on ROAS'],
        skills: ['Google Ads', 'Facebook/Meta Ads', 'Analytics', 'Budget management']
      },
      { 
        title: 'Marketing Designer', 
        isFilled: false,
        description: 'Creates visual assets for marketing campaigns and brand materials.',
        responsibilities: ['Design campaign assets', 'Maintain brand consistency', 'Create presentations', 'Support ad creative'],
        skills: ['Graphic design', 'Adobe Creative Suite', 'Brand identity', 'Motion graphics']
      },
      { 
        title: 'Email Marketing Specialist', 
        isFilled: false,
        description: 'Develops and executes email marketing campaigns to nurture leads and drive conversions.',
        responsibilities: ['Create email campaigns', 'Segment audiences', 'Optimize open and click rates', 'Manage automation flows'],
        skills: ['Email platforms', 'Copywriting', 'A/B testing', 'Marketing automation']
      },
      { 
        title: 'Marketing Analyst', 
        isFilled: false,
        description: 'Analyzes marketing data to optimize campaigns and measure ROI.',
        responsibilities: ['Track campaign performance', 'Build analytics dashboards', 'Provide insights', 'A/B testing'],
        skills: ['Data analysis', 'Google Analytics', 'Excel/Sheets', 'Statistical thinking']
      },
    ],
    resources: generalResources,
  },
  {
    slug: 'creative-content',
    name: 'Creative & Content',
    icon: '🎨',
    shortDescription: 'Design, Video, Copywriting',
    overview: 'Creates compelling visual and written content that engages audiences and strengthens brand identity.',
    color: 'pink',
    coreActions: [
      { title: 'Submit Creative Request', icon: '📋', type: 'request', description: 'Design, video, copy requests' },
      { title: 'Share Creative Idea', icon: '💡', type: 'idea', description: 'Creative innovation pipeline' },
      { title: 'Delegate Creative Task', icon: '✅', type: 'delegate', description: 'Creative task board' },
    ],
    quickActions: [
      { title: 'Request Design Work', icon: '🎨', formType: 'request' },
      { title: 'Video Production', icon: '🎬', formType: 'request' },
      { title: 'Copywriting Request', icon: '✍️', formType: 'request' },
      { title: 'Brand Assets', icon: '🏷️', formType: 'request' },
      { title: 'Presentation Design', icon: '📊', formType: 'request' },
      { title: 'Photography Request', icon: '📸', formType: 'request' },
    ],
    roles: [
      { 
        title: 'Chief Product Officer (CPO)', 
        isFilled: false,
        description: 'Drives product vision and strategy aligned with business goals.',
        responsibilities: ['Define product roadmap', 'Align stakeholders', 'Prioritize features', 'Lead product team'],
        skills: ['Product strategy', 'User empathy', 'Business acumen', 'Cross-functional leadership']
      },
      { 
        title: 'Chief Technology Officer (CTO)', 
        isFilled: false,
        description: 'Leads technology vision and oversees all technical development.',
        responsibilities: ['Technology strategy', 'Team leadership', 'Architecture decisions', 'Innovation roadmap'],
        skills: ['Technical leadership', 'Strategic planning', 'System architecture', 'Team development']
      },
      { 
        title: 'Product Manager', 
        isFilled: false,
        description: 'Manages product lifecycle from ideation to launch and iteration.',
        responsibilities: ['Write user stories', 'Conduct user research', 'Coordinate development', 'Track product metrics'],
        skills: ['Agile methodology', 'User research', 'Prioritization', 'Communication']
      },
      { 
        title: 'Lead Engineer', 
        isFilled: false,
        description: 'Guides technical architecture and mentors the engineering team.',
        responsibilities: ['Architecture decisions', 'Code reviews', 'Technical mentorship', 'System design'],
        skills: ['Full-stack development', 'System architecture', 'Team leadership', 'Problem solving']
      },
      { 
        title: 'Frontend Developer', 
        isFilled: false,
        description: 'Builds responsive, accessible user interfaces and experiences.',
        responsibilities: ['Build UI components', 'Implement designs', 'Optimize performance', 'Write tests'],
        skills: ['React/TypeScript', 'CSS/Tailwind', 'Accessibility', 'Performance optimization']
      },
      { 
        title: 'Backend Developer', 
        isFilled: false,
        description: 'Develops server-side logic, APIs, and database integrations.',
        responsibilities: ['Build APIs', 'Database design', 'System integrations', 'Security implementation'],
        skills: ['API development', 'Database management', 'Cloud services', 'Security best practices']
      },
      { 
        title: 'Full-Stack Developer', 
        isFilled: false,
        description: 'Works across the entire stack from database to user interface.',
        responsibilities: ['End-to-end feature development', 'API and UI integration', 'Performance optimization', 'Code maintenance'],
        skills: ['Frontend frameworks', 'Backend languages', 'Database management', 'DevOps basics']
      },
      { 
        title: 'Mobile Developer', 
        isFilled: false,
        description: 'Builds native or cross-platform mobile applications.',
        responsibilities: ['Develop mobile apps', 'Optimize for devices', 'Implement push notifications', 'App store deployment'],
        skills: ['React Native/Flutter', 'iOS/Android', 'Mobile UX', 'API integration']
      },
      { 
        title: 'DevOps Engineer', 
        isFilled: false,
        description: 'Manages infrastructure, CI/CD pipelines, and deployment processes.',
        responsibilities: ['Infrastructure automation', 'CI/CD pipelines', 'Monitoring and alerting', 'Security compliance'],
        skills: ['AWS/GCP/Azure', 'Docker/Kubernetes', 'Terraform', 'Linux administration']
      },
      { 
        title: 'UX/UI Designer', 
        isFilled: false,
        description: 'Creates intuitive, beautiful interfaces based on user research.',
        responsibilities: ['User research', 'Wireframing', 'Visual design', 'Usability testing'],
        skills: ['Figma/Sketch', 'User research', 'Prototyping', 'Design systems']
      },
      { 
        title: 'QA Engineer', 
        isFilled: false,
        description: 'Ensures product quality through testing and quality processes.',
        responsibilities: ['Write test cases', 'Automated testing', 'Bug tracking', 'Release validation'],
        skills: ['Test automation', 'Attention to detail', 'Bug reproduction', 'Testing frameworks']
      },
      { 
        title: 'Technical Writer', 
        isFilled: false,
        description: 'Creates clear documentation for products, APIs, and internal processes.',
        responsibilities: ['Write documentation', 'Create tutorials', 'Maintain knowledge base', 'API documentation'],
        skills: ['Technical writing', 'Documentation tools', 'API knowledge', 'Clear communication']
      },
    ],
    resources: generalResources,
  },
  {
    slug: 'technology',
    name: 'Technology',
    icon: '💻',
    shortDescription: 'Development, Automations, Integrations',
    overview: 'Builds and maintains technology solutions including websites, apps, automations, and system integrations.',
    color: 'purple',
    coreActions: [
      { title: 'Submit Tech Request', icon: '📋', type: 'request', description: 'Development and integration requests' },
      { title: 'Share Tech Idea', icon: '💡', type: 'idea', description: 'Innovation pipeline' },
      { title: 'Delegate Dev Task', icon: '✅', type: 'delegate', description: 'Engineering task board' },
    ],
    quickActions: [
      { title: 'Report Bug', icon: '🐛', formType: 'request' },
      { title: 'Request Integration', icon: '🔗', formType: 'request' },
      { title: 'Automation Request', icon: '🤖', formType: 'request' },
      { title: 'Website Update', icon: '🌐', formType: 'request' },
      { title: 'API Request', icon: '🔌', formType: 'request' },
      { title: 'New Feature', icon: '🚀', formType: 'request' },
    ],
    roles: [
      { 
        title: 'Chief Operating Officer (COO)', 
        isFilled: false,
        description: 'Oversees daily operations and drives operational excellence.',
        responsibilities: ['Operational strategy', 'Process optimization', 'Resource allocation', 'Cross-department coordination'],
        skills: ['Operations management', 'Strategic planning', 'Process improvement', 'Leadership']
      },
      { 
        title: 'Operations Manager', 
        isFilled: false,
        description: 'Manages day-to-day operations and ensures smooth workflow.',
        responsibilities: ['Team coordination', 'Process management', 'Performance monitoring', 'Issue resolution'],
        skills: ['Project management', 'Problem solving', 'Team management', 'Process documentation']
      },
      { 
        title: 'Customer Support Manager', 
        isFilled: false,
        description: 'Leads the customer support team to deliver exceptional service.',
        responsibilities: ['Manage support team', 'Set service standards', 'Handle escalations', 'Improve satisfaction scores'],
        skills: ['Customer service leadership', 'Team management', 'Conflict resolution', 'Metrics analysis']
      },
      { 
        title: 'Customer Support Specialist', 
        isFilled: false,
        description: 'Provides frontline support to customers via chat, email, and phone.',
        responsibilities: ['Respond to tickets', 'Troubleshoot issues', 'Document solutions', 'Escalate complex issues'],
        skills: ['Communication', 'Problem solving', 'Product knowledge', 'Patience and empathy']
      },
      { 
        title: 'Technical Support Specialist', 
        isFilled: false,
        description: 'Handles technical customer inquiries and troubleshooting.',
        responsibilities: ['Technical troubleshooting', 'Bug documentation', 'Customer education', 'Liaise with engineering'],
        skills: ['Technical knowledge', 'Problem diagnosis', 'Clear communication', 'Documentation']
      },
      { 
        title: 'Process Analyst', 
        isFilled: false,
        description: 'Analyzes and improves business processes for efficiency.',
        responsibilities: ['Process mapping', 'Bottleneck identification', 'Improvement recommendations', 'Metrics tracking'],
        skills: ['Process analysis', 'Data analysis', 'Documentation', 'Continuous improvement']
      },
      { 
        title: 'Operations Coordinator', 
        isFilled: false,
        description: 'Coordinates operational activities and supports team execution.',
        responsibilities: ['Schedule management', 'Communication coordination', 'Task tracking', 'Administrative support'],
        skills: ['Organization', 'Communication', 'Multitasking', 'Attention to detail']
      },
      { 
        title: 'Project Manager', 
        isFilled: false,
        description: 'Leads cross-functional projects from initiation to completion.',
        responsibilities: ['Project planning', 'Resource allocation', 'Timeline management', 'Stakeholder communication'],
        skills: ['Project management', 'Agile/Scrum', 'Risk management', 'Leadership']
      },
      { 
        title: 'Automation Specialist', 
        isFilled: false,
        description: 'Implements automation solutions to streamline workflows.',
        responsibilities: ['Identify automation opportunities', 'Build workflows', 'Integrate systems', 'Train users'],
        skills: ['Automation tools', 'Integration platforms', 'Scripting', 'Process optimization']
      },
      { 
        title: 'Implementation Specialist', 
        isFilled: false,
        description: 'Guides customers through product setup and onboarding.',
        responsibilities: ['Customer onboarding', 'Data migration', 'Configuration setup', 'Training delivery'],
        skills: ['Product expertise', 'Training skills', 'Project management', 'Customer communication']
      },
    ],
    resources: generalResources,
  },
  {
    slug: 'operations',
    name: 'Operations',
    icon: '⚙️',
    shortDescription: 'CRM, Workflows, Process Optimization',
    overview: 'Streamlines daily operations through efficient workflows, CRM management, and continuous process optimization.',
    color: 'green',
    coreActions: [
      { title: 'Submit Operations Request', icon: '📋', type: 'request', description: 'Process improvement intake' },
      { title: 'Share Process Idea', icon: '💡', type: 'idea', description: 'Efficiency suggestions' },
      { title: 'Delegate Operational Task', icon: '✅', type: 'delegate', description: 'Operations workflow' },
    ],
    quickActions: [
      { title: 'CRM Update', icon: '📇', formType: 'request' },
      { title: 'Workflow Automation', icon: '🤖', formType: 'request' },
      { title: 'Process Documentation', icon: '📝', formType: 'request' },
      { title: 'System Access Request', icon: '🔑', formType: 'request' },
      { title: 'Vendor Management', icon: '🤝', formType: 'request' },
      { title: 'SOP Creation', icon: '📋', formType: 'request' },
    ],
    roles: [
      { 
        title: 'Chief Operating Officer (COO)', 
        isFilled: false,
        description: 'Oversees daily operations and drives operational excellence.',
        responsibilities: ['Operational strategy', 'Process optimization', 'Resource allocation', 'Cross-department coordination'],
        skills: ['Operations management', 'Strategic planning', 'Process improvement', 'Leadership']
      },
      { 
        title: 'Operations Manager', 
        isFilled: false,
        description: 'Manages day-to-day operations and ensures smooth workflow.',
        responsibilities: ['Team coordination', 'Process management', 'Performance monitoring', 'Issue resolution'],
        skills: ['Project management', 'Problem solving', 'Team management', 'Process documentation']
      },
      { 
        title: 'CRM Administrator', 
        isFilled: false,
        description: 'Manages and optimizes CRM systems for the organization.',
        responsibilities: ['CRM configuration', 'Data management', 'User training', 'Workflow automation'],
        skills: ['CRM platforms', 'Data analysis', 'Process automation', 'User support']
      },
      { 
        title: 'Process Analyst', 
        isFilled: false,
        description: 'Analyzes and improves business processes for efficiency.',
        responsibilities: ['Process mapping', 'Bottleneck identification', 'Improvement recommendations', 'Metrics tracking'],
        skills: ['Process analysis', 'Data analysis', 'Documentation', 'Continuous improvement']
      },
      { 
        title: 'Operations Coordinator', 
        isFilled: false,
        description: 'Coordinates operational activities and supports team execution.',
        responsibilities: ['Schedule management', 'Communication coordination', 'Task tracking', 'Administrative support'],
        skills: ['Organization', 'Communication', 'Multitasking', 'Attention to detail']
      },
    ],
    resources: generalResources,
  },
  {
    slug: 'finance',
    name: 'Finance',
    icon: '💰',
    shortDescription: 'Billing, Budgets, Contracts, Reporting',
    overview: 'Manages financial planning, accounting, budgets, contracts, and fiscal reporting.',
    color: 'orange',
    coreActions: [
      { title: 'Submit Finance Request', icon: '📋', type: 'request', description: 'Budget, expenses, invoices' },
      { title: 'Share Financial Idea', icon: '💡', type: 'idea', description: 'Cost optimization suggestions' },
      { title: 'Delegate Finance Task', icon: '✅', type: 'delegate', description: 'Financial workflow' },
    ],
    quickActions: [
      { title: 'Expense Approval', icon: '💳', formType: 'request' },
      { title: 'Budget Request', icon: '📊', formType: 'request' },
      { title: 'Invoice Submission', icon: '🧾', formType: 'request' },
      { title: 'Contract Review', icon: '📄', formType: 'request' },
      { title: 'Financial Report', icon: '📈', formType: 'request' },
      { title: 'Billing Update', icon: '💵', formType: 'request' },
    ],
    roles: [
      { 
        title: 'Chief Financial Officer (CFO)', 
        isFilled: false,
        description: 'Leads financial strategy, planning, and fiscal management.',
        responsibilities: ['Financial planning', 'Budget oversight', 'Investor relations', 'Risk management'],
        skills: ['Financial strategy', 'Leadership', 'Forecasting', 'Regulatory knowledge']
      },
      { 
        title: 'Controller', 
        isFilled: false,
        description: 'Manages accounting operations and financial reporting.',
        responsibilities: ['Financial statements', 'Accounting operations', 'Internal controls', 'Audit coordination'],
        skills: ['GAAP knowledge', 'Financial reporting', 'Team management', 'ERP systems']
      },
      { 
        title: 'Accountant', 
        isFilled: false,
        description: 'Handles day-to-day accounting and bookkeeping activities.',
        responsibilities: ['Transaction recording', 'Reconciliations', 'Invoice processing', 'Expense tracking'],
        skills: ['Bookkeeping', 'Accounting software', 'Attention to detail', 'Organization']
      },
      { 
        title: 'Financial Analyst', 
        isFilled: false,
        description: 'Analyzes financial data to support business decisions.',
        responsibilities: ['Financial modeling', 'Variance analysis', 'Forecasting', 'Performance reporting'],
        skills: ['Financial modeling', 'Excel expertise', 'Data analysis', 'Business intelligence']
      },
    ],
    resources: generalResources,
  },
  {
    slug: 'strategy-analytics',
    name: 'Strategy & Analytics',
    icon: '📊',
    shortDescription: 'Business Intelligence, KPIs, Planning',
    overview: 'Drives strategic planning, business intelligence, and data-driven decision making across the organization.',
    color: 'teal',
    coreActions: [
      { title: 'Submit Analysis Request', icon: '📋', type: 'request', description: 'Data insights needs' },
      { title: 'Share Strategic Idea', icon: '💡', type: 'idea', description: 'Strategic initiative proposals' },
      { title: 'Delegate Research Task', icon: '✅', type: 'delegate', description: 'Analysis assignments' },
    ],
    quickActions: [
      { title: 'Request Market Research', icon: '🔍', formType: 'request' },
      { title: 'KPI Dashboard', icon: '📊', formType: 'request' },
      { title: 'Strategic Planning', icon: '🗓️', formType: 'request' },
      { title: 'Competitive Analysis', icon: '⚔️', formType: 'request' },
      { title: 'Business Case', icon: '💼', formType: 'request' },
      { title: 'Performance Report', icon: '📈', formType: 'request' },
    ],
    roles: [
      { 
        title: 'Chief Strategy Officer (CSO)', 
        isFilled: false,
        description: 'Develops and executes long-term strategic initiatives.',
        responsibilities: ['Strategic vision', 'Market positioning', 'Growth initiatives', 'Executive alignment'],
        skills: ['Strategic thinking', 'Business development', 'Leadership', 'Market analysis']
      },
      { 
        title: 'Head of Analytics', 
        isFilled: false,
        description: 'Leads the analytics function and drives data-driven culture.',
        responsibilities: ['Analytics strategy', 'Team leadership', 'Data governance', 'Executive reporting'],
        skills: ['Analytics leadership', 'Data strategy', 'Team management', 'Business acumen']
      },
      { 
        title: 'Business Analyst', 
        isFilled: false,
        description: 'Bridges business needs and technical solutions through analysis.',
        responsibilities: ['Requirements gathering', 'Process analysis', 'Solution design', 'Stakeholder communication'],
        skills: ['Business analysis', 'Documentation', 'Problem solving', 'Communication']
      },
      { 
        title: 'Data Scientist', 
        isFilled: false,
        description: 'Extracts insights from data using statistical and ML techniques.',
        responsibilities: ['Data modeling', 'Predictive analytics', 'Algorithm development', 'Insight communication'],
        skills: ['Python/R', 'Machine learning', 'Statistics', 'Data visualization']
      },
      { 
        title: 'Data Analyst', 
        isFilled: false,
        description: 'Analyzes data sets to identify trends and create reports.',
        responsibilities: ['Data analysis', 'Report creation', 'Dashboard building', 'Ad-hoc queries'],
        skills: ['SQL', 'Excel', 'Data visualization', 'Statistical analysis']
      },
    ],
    resources: generalResources,
  },
  {
    slug: 'team-support',
    name: 'Team & Support',
    icon: '👥',
    shortDescription: 'HR, Training, Customer Success',
    overview: 'Manages HR, employee training, and customer success to support both internal teams and clients.',
    color: 'cyan',
    coreActions: [
      { title: 'Submit HR Request', icon: '📋', type: 'request', description: 'Hiring, benefits, issues' },
      { title: 'Share Team Idea', icon: '💡', type: 'idea', description: 'Team building, engagement' },
      { title: 'Delegate Support Task', icon: '✅', type: 'delegate', description: 'Support workflow' },
    ],
    quickActions: [
      { title: 'Start Hiring Process', icon: '🎯', formType: 'request' },
      { title: 'Request Training', icon: '📚', formType: 'request' },
      { title: 'Customer Success Request', icon: '🤝', formType: 'request' },
      { title: 'Benefits Question', icon: '❓', formType: 'request' },
      { title: 'Performance Review', icon: '📊', formType: 'request' },
      { title: 'Team Building Event', icon: '🎉', formType: 'idea' },
    ],
    roles: [
      { 
        title: 'Chief People Officer (CPO)', 
        isFilled: false,
        description: 'Leads people strategy, culture, and organizational development.',
        responsibilities: ['People strategy', 'Culture development', 'Talent management', 'Employee experience'],
        skills: ['HR leadership', 'Strategic thinking', 'Change management', 'Employee engagement']
      },
      { 
        title: 'HR Director', 
        isFilled: false,
        description: 'Directs HR functions and aligns people practices with business goals.',
        responsibilities: ['HR strategy execution', 'Policy development', 'Organizational design', 'HR team leadership'],
        skills: ['HR management', 'Employment law', 'Strategic planning', 'Leadership']
      },
      { 
        title: 'HR Manager', 
        isFilled: false,
        description: 'Manages HR operations and employee relations.',
        responsibilities: ['Policy implementation', 'Employee relations', 'Benefits administration', 'Compliance'],
        skills: ['HR knowledge', 'Conflict resolution', 'Communication', 'Organization']
      },
      { 
        title: 'HR Business Partner', 
        isFilled: false,
        description: 'Partners with business units to align HR strategies with department goals.',
        responsibilities: ['Strategic HR consulting', 'Workforce planning', 'Change management', 'Performance management'],
        skills: ['Business acumen', 'Consulting', 'Relationship building', 'Problem solving']
      },
      { 
        title: 'Talent Acquisition Manager', 
        isFilled: false,
        description: 'Leads recruiting strategy and manages the talent acquisition team.',
        responsibilities: ['Recruiting strategy', 'Team management', 'Employer branding', 'Hiring metrics'],
        skills: ['Recruiting leadership', 'Employer branding', 'Team management', 'Data analysis']
      },
      { 
        title: 'Recruiter', 
        isFilled: false,
        description: 'Sources and attracts top talent to join the organization.',
        responsibilities: ['Sourcing candidates', 'Screening interviews', 'Candidate experience', 'Pipeline management'],
        skills: ['Talent sourcing', 'Interviewing', 'Relationship building', 'Assessment']
      },
      { 
        title: 'Technical Recruiter', 
        isFilled: false,
        description: 'Specializes in recruiting technical and engineering talent.',
        responsibilities: ['Technical sourcing', 'Technical screening', 'Engineering partnerships', 'Market intelligence'],
        skills: ['Technical knowledge', 'Sourcing', 'Technical assessment', 'Relationship building']
      },
      { 
        title: 'Training & Development Lead', 
        isFilled: false,
        description: 'Designs and delivers learning programs for employee growth.',
        responsibilities: ['Training programs', 'Skill development', 'Learning systems', 'Performance support'],
        skills: ['Instructional design', 'Facilitation', 'LMS management', 'Needs assessment']
      },
      { 
        title: 'Compensation & Benefits Analyst', 
        isFilled: false,
        description: 'Manages compensation structures and benefits programs.',
        responsibilities: ['Salary benchmarking', 'Benefits administration', 'Compensation analysis', 'Policy development'],
        skills: ['Compensation analysis', 'Benefits knowledge', 'Data analysis', 'Market research']
      },
      { 
        title: 'HR Coordinator', 
        isFilled: false,
        description: 'Provides administrative support for HR operations.',
        responsibilities: ['HR administration', 'Onboarding coordination', 'Record keeping', 'Employee inquiries'],
        skills: ['Organization', 'Communication', 'HRIS systems', 'Attention to detail']
      },
      { 
        title: 'Culture Coordinator', 
        isFilled: false,
        description: 'Fosters positive workplace culture and employee engagement.',
        responsibilities: ['Culture initiatives', 'Team events', 'Recognition programs', 'Engagement surveys'],
        skills: ['Event planning', 'Communication', 'Creativity', 'Relationship building']
      },
    ],
    resources: generalResources,
  },
  {
    slug: 'ai-automation',
    name: 'AI & Automation',
    icon: '🤖',
    shortDescription: 'AI Tools, Chatbots, Machine Learning',
    overview: 'Leverages artificial intelligence and automation to streamline operations, enhance customer experiences, and drive innovation.',
    color: 'violet',
    coreActions: [
      { title: 'Submit AI Request', icon: '📋', type: 'request', description: 'AI implementation and automation requests' },
      { title: 'Share AI Idea', icon: '💡', type: 'idea', description: 'AI innovation pipeline' },
      { title: 'Delegate AI Task', icon: '✅', type: 'delegate', description: 'AI project task board' },
    ],
    quickActions: [
      { title: 'AI Chatbot Setup', icon: '💬', formType: 'request' },
      { title: 'Workflow Automation', icon: '⚡', formType: 'request' },
      { title: 'AI Content Generation', icon: '✍️', formType: 'request' },
      { title: 'Data Analysis & Insights', icon: '📊', formType: 'request' },
      { title: 'AI Integration', icon: '🔗', formType: 'request' },
      { title: 'Custom AI Solution', icon: '🧠', formType: 'request' },
    ],
    roles: [
      { 
        title: 'AI/ML Lead', 
        isFilled: false,
        description: 'Leads AI strategy and oversees machine learning initiatives.',
        responsibilities: ['Define AI roadmap', 'Lead ML projects', 'Evaluate AI tools', 'Guide team on best practices'],
        skills: ['Machine learning', 'AI strategy', 'Technical leadership', 'Data science']
      },
      { 
        title: 'AI Engineer', 
        isFilled: false,
        description: 'Builds and deploys AI models and automation solutions.',
        responsibilities: ['Develop AI models', 'Integrate AI APIs', 'Optimize performance', 'Maintain AI systems'],
        skills: ['Python', 'Machine learning frameworks', 'API integration', 'Cloud AI services']
      },
      { 
        title: 'Automation Specialist', 
        isFilled: false,
        description: 'Creates automated workflows to improve efficiency across departments.',
        responsibilities: ['Build automations', 'Integrate systems', 'Optimize workflows', 'Train teams on tools'],
        skills: ['No-code/low-code platforms', 'API integration', 'Process optimization', 'Problem solving']
      },
      { 
        title: 'Prompt Engineer', 
        isFilled: false,
        description: 'Designs and optimizes prompts for AI language models.',
        responsibilities: ['Craft effective prompts', 'Test AI outputs', 'Document best practices', 'Train team on AI usage'],
        skills: ['Prompt design', 'AI/LLM knowledge', 'Critical thinking', 'Clear communication']
      },
      { 
        title: 'AI Product Manager', 
        isFilled: false,
        description: 'Manages AI product features and roadmap.',
        responsibilities: ['Define AI product vision', 'Prioritize features', 'Coordinate with engineering', 'Measure AI impact'],
        skills: ['Product management', 'AI/ML understanding', 'User research', 'Strategic thinking']
      },
    ],
    resources: generalResources,
  },
  {
    slug: 'legal-compliance',
    name: 'Legal & Compliance',
    icon: '⚖️',
    shortDescription: 'Contracts, Compliance, Risk',
    overview: 'Manages contracts, compliance, risk mitigation, and legal documentation.',
    color: 'slate',
    coreActions: [
      { title: 'Submit Legal Request', icon: '📋', type: 'request', description: 'Contracts, compliance, legal needs' },
      { title: 'Share Compliance Idea', icon: '💡', type: 'idea', description: 'Risk mitigation suggestions' },
      { title: 'Delegate Legal Task', icon: '✅', type: 'delegate', description: 'Legal workflow' },
    ],
    quickActions: [
      { title: 'Contract Review', icon: '📄', formType: 'request' },
      { title: 'Legal Consultation', icon: '⚖️', formType: 'request' },
      { title: 'Compliance Check', icon: '🛡️', formType: 'request' },
      { title: 'NDA Request', icon: '📝', formType: 'request' },
      { title: 'Privacy Review', icon: '🔒', formType: 'request' },
      { title: 'Risk Assessment', icon: '⚠️', formType: 'request' },
    ],
    roles: [
      { 
        title: 'General Counsel', 
        isFilled: false,
        description: 'Oversees all legal matters and provides strategic legal guidance.',
        responsibilities: ['Legal strategy', 'Contract negotiations', 'Risk management', 'Regulatory compliance'],
        skills: ['Legal expertise', 'Strategic thinking', 'Negotiation', 'Business acumen']
      },
      { 
        title: 'Compliance Officer', 
        isFilled: false,
        description: 'Ensures organizational compliance with laws and regulations.',
        responsibilities: ['Compliance monitoring', 'Policy development', 'Audit coordination', 'Training programs'],
        skills: ['Regulatory knowledge', 'Risk assessment', 'Policy writing', 'Attention to detail']
      },
      { 
        title: 'Contract Manager', 
        isFilled: false,
        description: 'Manages contract lifecycle from drafting to execution.',
        responsibilities: ['Contract drafting', 'Review and negotiation', 'Vendor management', 'Contract database'],
        skills: ['Contract law', 'Negotiation', 'Organization', 'Communication']
      },
      { 
        title: 'Privacy Officer', 
        isFilled: false,
        description: 'Manages data privacy policies and ensures regulatory compliance.',
        responsibilities: ['Privacy policy management', 'GDPR/CCPA compliance', 'Data protection', 'Privacy audits'],
        skills: ['Privacy regulations', 'Data protection', 'Policy development', 'Risk assessment']
      },
      { 
        title: 'Legal Analyst', 
        isFilled: false,
        description: 'Conducts legal research and supports legal team operations.',
        responsibilities: ['Legal research', 'Document preparation', 'Case analysis', 'Compliance tracking'],
        skills: ['Legal research', 'Documentation', 'Analytical thinking', 'Communication']
      },
      { 
        title: 'Risk Manager', 
        isFilled: false,
        description: 'Identifies and mitigates organizational risks.',
        responsibilities: ['Risk assessment', 'Mitigation strategies', 'Insurance coordination', 'Incident response'],
        skills: ['Risk analysis', 'Strategic planning', 'Problem solving', 'Communication']
      },
    ],
    resources: generalResources,
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
    cyan: { bg: 'bg-cyan-500/10', border: 'border-cyan-500/30', text: 'text-cyan-500' },
    violet: { bg: 'bg-violet-500/10', border: 'border-violet-500/30', text: 'text-violet-500' },
    slate: { bg: 'bg-slate-500/10', border: 'border-slate-500/30', text: 'text-slate-500' },
  };
  return colorMap[color] || colorMap.blue;
};
