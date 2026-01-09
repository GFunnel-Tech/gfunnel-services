import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, BookOpen, Sparkles, FolderOpen } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";

const resourceCategories = [
  {
    id: 'sops',
    title: 'Standard Operating Procedures',
    description: 'Step-by-step guides for common business processes and workflows.',
    icon: FileText,
    color: 'blue',
    items: [
      'Project Management SOP',
      'Client Onboarding Process',
      'Quality Assurance Checklist',
      'Request Escalation Guide',
    ],
  },
  {
    id: 'templates',
    title: 'Templates Library',
    description: 'Ready-to-use templates for documents, reports, and presentations.',
    icon: FolderOpen,
    color: 'green',
    items: [
      'Project Brief Template',
      'Status Report Template',
      'Meeting Notes Template',
      'Budget Proposal Template',
    ],
  },
  {
    id: 'best-practices',
    title: 'Best Practices',
    description: 'Industry standards and proven approaches for success.',
    icon: Sparkles,
    color: 'purple',
    items: [
      'Communication Guidelines',
      'Project Planning Tips',
      'Time Management Strategies',
      'Collaboration Best Practices',
    ],
  },
  {
    id: 'documentation',
    title: 'Documentation',
    description: 'Reference materials, guides, and knowledge base articles.',
    icon: BookOpen,
    color: 'orange',
    items: [
      'System User Guide',
      'Tool Integration Docs',
      'FAQ & Troubleshooting',
      'Glossary of Terms',
    ],
  },
];

const colorClasses: Record<string, string> = {
  blue: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  green: 'bg-green-500/10 text-green-600 border-green-500/20',
  purple: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
  orange: 'bg-orange-500/10 text-orange-600 border-orange-500/20',
};

const Resources = () => {
  const [searchParams] = useSearchParams();
  const activeCategory = searchParams.get('category');

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 py-4">
        <div className="container mx-auto px-4">
          <Link to="/service-hub" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Service Hub
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Resources</h1>
            <p className="text-muted-foreground text-lg">
              Access SOPs, templates, best practices, and documentation to support your work.
            </p>
          </div>

          {/* Category Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {resourceCategories.map((category) => {
              const Icon = category.icon;
              const isActive = activeCategory === category.id;
              
              return (
                <Card 
                  key={category.id}
                  className={`p-6 transition-all duration-300 hover:shadow-lg ${
                    isActive ? 'ring-2 ring-primary' : ''
                  }`}
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${colorClasses[category.color]}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-xl font-semibold text-foreground mb-1">{category.title}</h2>
                      <p className="text-muted-foreground text-sm">{category.description}</p>
                    </div>
                  </div>
                  
                  {/* Preview Items */}
                  <div className="space-y-2 mb-4">
                    {category.items.map((item, index) => (
                      <div 
                        key={index}
                        className="flex items-center gap-2 text-sm text-foreground/80 p-2 rounded-md bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
                      >
                        <FileText className="w-4 h-4 text-muted-foreground" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>

                  {/* Coming Soon Notice */}
                  <div className="pt-4 border-t border-border/50">
                    <p className="text-xs text-muted-foreground italic">
                      Content library coming soon. Stay tuned for templates, guides, and more.
                    </p>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* CTA Section */}
          <Card className="mt-8 p-6 bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Need something specific?</h3>
                <p className="text-muted-foreground">We can create custom resources tailored to your needs.</p>
              </div>
              <Button
                variant="gradient"
                onClick={() => window.open('https://www.gfunnel.com/discover', '_blank')}
              >
                Schedule a Call
              </Button>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Resources;
