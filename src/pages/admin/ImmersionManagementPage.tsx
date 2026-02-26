import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, ExternalLink, Loader2 } from "lucide-react";
import { useEngagementList, useCreateEngagement } from "@/hooks/useImmersion";
import { ImmersionStageIndicator } from "@/components/immersion/ImmersionStageIndicator";
import { SESSION_TYPE_LABELS } from "@/lib/immersionTypes";
import type { ImmersionStage, SessionType } from "@/lib/immersionTypes";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const ImmersionManagementPage = () => {
  const { data: engagements, isLoading } = useEngagementList();
  const createMutation = useCreateEngagement();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    client_name: "",
    client_org: "",
    client_email: "",
    client_phone: "",
    session_type: "virtual_foundation" as SessionType,
    session_date: "",
    location: "",
  });

  const handleCreate = () => {
    if (!formData.client_name || !formData.client_org || !formData.client_email || !formData.session_type) {
      toast.error("Please fill in all required fields");
      return;
    }

    createMutation.mutate(formData, {
      onSuccess: () => {
        toast.success("Engagement created successfully");
        setDialogOpen(false);
        setFormData({
          client_name: "",
          client_org: "",
          client_email: "",
          client_phone: "",
          session_type: "virtual_foundation",
          session_date: "",
          location: "",
        });
      },
      onError: (err) => {
        toast.error(err.message || "Failed to create engagement");
      },
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Immersion Engagements</h1>
            <p className="text-muted-foreground">Manage client immersion portals</p>
          </div>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                New Engagement
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Create New Immersion Engagement</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Client Name *</Label>
                    <Input
                      value={formData.client_name}
                      onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                      placeholder="John Smith"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Organization *</Label>
                    <Input
                      value={formData.client_org}
                      onChange={(e) => setFormData({ ...formData, client_org: e.target.value })}
                      placeholder="Acme Corp"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Email *</Label>
                    <Input
                      type="email"
                      value={formData.client_email}
                      onChange={(e) => setFormData({ ...formData, client_email: e.target.value })}
                      placeholder="john@acme.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input
                      value={formData.client_phone}
                      onChange={(e) => setFormData({ ...formData, client_phone: e.target.value })}
                      placeholder="+1 555-0123"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Session Type *</Label>
                  <Select
                    value={formData.session_type}
                    onValueChange={(v) => setFormData({ ...formData, session_type: v as SessionType })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="virtual_foundation">Virtual Foundation</SelectItem>
                      <SelectItem value="on_site_full">On-Site Full Immersion</SelectItem>
                      <SelectItem value="enterprise">Enterprise</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Session Date</Label>
                    <Input
                      type="date"
                      value={formData.session_date}
                      onChange={(e) => setFormData({ ...formData, session_date: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Location</Label>
                    <Input
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="Virtual"
                    />
                  </div>
                </div>

                <Button
                  onClick={handleCreate}
                  disabled={createMutation.isPending}
                  className="w-full"
                >
                  {createMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : null}
                  Create Engagement
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Engagements List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : !engagements || engagements.length === 0 ? (
          <Card className="p-12 text-center">
            <h3 className="text-lg font-semibold mb-2">No Engagements Yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first immersion engagement to get started.
            </p>
            <Button onClick={() => setDialogOpen(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              Create Engagement
            </Button>
          </Card>
        ) : (
          <div className="space-y-3">
            {engagements.map((eng) => (
              <Card key={eng.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{eng.client_org}</h3>
                        <ImmersionStageIndicator stage={eng.stage as ImmersionStage} size="sm" />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {eng.client_name} &middot; {eng.client_email}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                        <Badge variant="outline" className="text-xs">
                          {SESSION_TYPE_LABELS[eng.session_type as SessionType]}
                        </Badge>
                        {eng.session_date && (
                          <span>{new Date(eng.session_date).toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <Button variant="outline" size="sm" className="gap-2" asChild>
                    <Link to={`/immersion/${eng.id}`}>
                      <ExternalLink className="w-4 h-4" />
                      Open Portal
                    </Link>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ImmersionManagementPage;
