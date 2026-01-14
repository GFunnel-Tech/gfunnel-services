import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ProtectedAdminRoute } from "@/components/admin/ProtectedAdminRoute";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import {
  getProjectRequests,
  updateProjectRequestStatus,
  updateProjectRequestPriority,
  deleteProjectRequest,
  type ProjectRequestWithCompany,
} from "@/lib/projectRequestService";
import {
  ClipboardList,
  MoreHorizontal,
  Eye,
  Building2,
  Trash2,
  ExternalLink,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  in_progress: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  completed: "bg-green-500/10 text-green-600 border-green-500/20",
  cancelled: "bg-gray-500/10 text-gray-600 border-gray-500/20",
};

const priorityColors: Record<string, string> = {
  low: "bg-gray-500/10 text-gray-600 border-gray-500/20",
  medium: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  high: "bg-orange-500/10 text-orange-600 border-orange-500/20",
  urgent: "bg-red-500/10 text-red-600 border-red-500/20",
};

const categoryLabels: Record<string, string> = {
  vision: "Vision Intake",
  service_intake: "Service Request",
  department_action: "Department Action",
};

export default function ProjectRequestsPage() {
  const [requests, setRequests] = useState<ProjectRequestWithCompany[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedRequest, setSelectedRequest] = useState<ProjectRequestWithCompany | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const { toast } = useToast();

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const data = await getProjectRequests({ 
        status: statusFilter === "all" ? undefined : statusFilter 
      });
      setRequests(data);
    } catch (error) {
      console.error("Error fetching requests:", error);
      toast({
        title: "Error",
        description: "Failed to load project requests",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [statusFilter]);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await updateProjectRequestStatus(id, newStatus);
      toast({ title: "Status updated" });
      fetchRequests();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      });
    }
  };

  const handlePriorityChange = async (id: string, newPriority: string) => {
    try {
      await updateProjectRequestPriority(id, newPriority);
      toast({ title: "Priority updated" });
      fetchRequests();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update priority",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this request?")) return;
    
    try {
      await deleteProjectRequest(id);
      toast({ title: "Request deleted" });
      fetchRequests();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete request",
        variant: "destructive",
      });
    }
  };

  const viewDetails = (request: ProjectRequestWithCompany) => {
    setSelectedRequest(request);
    setDetailsOpen(true);
  };

  const stats = {
    total: requests.length,
    pending: requests.filter((r) => r.status === "pending").length,
    in_progress: requests.filter((r) => r.status === "in_progress").length,
    completed: requests.filter((r) => r.status === "completed").length,
  };

  return (
    <ProtectedAdminRoute>
      <AdminLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <ClipboardList className="h-6 w-6" />
                Project Requests
              </h1>
              <p className="text-muted-foreground">
                Manage incoming project and service requests
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <ClipboardList className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.total}</p>
                    <p className="text-sm text-muted-foreground">Total</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-yellow-500/10">
                    <Clock className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.pending}</p>
                    <p className="text-sm text-muted-foreground">Pending</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/10">
                    <AlertCircle className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.in_progress}</p>
                    <p className="text-sm text-muted-foreground">In Progress</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-green-500/10">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.completed}</p>
                    <p className="text-sm text-muted-foreground">Completed</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Status:</span>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Requests Table */}
          <Card>
            <CardHeader>
              <CardTitle>Requests</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : requests.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No project requests found
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Request</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {requests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell>
                          <div className="font-medium">
                            {request.request_title || request.form_type}
                          </div>
                          {request.delegate_email && (
                            <div className="text-xs text-muted-foreground">
                              Delegated to: {request.delegate_email}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>{request.email}</TableCell>
                        <TableCell>
                          {request.companies ? (
                            <Link
                              to={`/admin/companies/${request.company_id}`}
                              className="flex items-center gap-1 text-primary hover:underline"
                            >
                              <Building2 className="h-3 w-3" />
                              {request.companies.name}
                            </Link>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {categoryLabels[request.form_category] || request.form_category}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Select
                            value={request.status}
                            onValueChange={(value) => handleStatusChange(request.id, value)}
                          >
                            <SelectTrigger className="w-[130px] h-8">
                              <Badge className={statusColors[request.status]}>
                                {request.status.replace("_", " ")}
                              </Badge>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="in_progress">In Progress</SelectItem>
                              <SelectItem value="completed">Completed</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Select
                            value={request.priority}
                            onValueChange={(value) => handlePriorityChange(request.id, value)}
                          >
                            <SelectTrigger className="w-[100px] h-8">
                              <Badge className={priorityColors[request.priority]}>
                                {request.priority}
                              </Badge>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="low">Low</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="high">High</SelectItem>
                              <SelectItem value="urgent">Urgent</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {format(new Date(request.submitted_at), "MMM d, yyyy")}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => viewDetails(request)}>
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              {request.video_link && (
                                <DropdownMenuItem
                                  onClick={() => window.open(request.video_link!, "_blank")}
                                >
                                  <ExternalLink className="h-4 w-4 mr-2" />
                                  View Video
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem
                                onClick={() => handleDelete(request.id)}
                                className="text-destructive"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Details Dialog */}
        <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Request Details</DialogTitle>
            </DialogHeader>
            {selectedRequest && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-muted-foreground">Title</label>
                    <p className="font-medium">
                      {selectedRequest.request_title || selectedRequest.form_type}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Email</label>
                    <p className="font-medium">{selectedRequest.email}</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Category</label>
                    <p className="font-medium">
                      {categoryLabels[selectedRequest.form_category] || selectedRequest.form_category}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Form Type</label>
                    <p className="font-medium">{selectedRequest.form_type}</p>
                  </div>
                  {selectedRequest.delegate_email && (
                    <>
                      <div>
                        <label className="text-sm text-muted-foreground">Delegated To</label>
                        <p className="font-medium">{selectedRequest.delegate_email}</p>
                      </div>
                      {selectedRequest.delegate_name && (
                        <div>
                          <label className="text-sm text-muted-foreground">Delegate Name</label>
                          <p className="font-medium">{selectedRequest.delegate_name}</p>
                        </div>
                      )}
                    </>
                  )}
                  <div>
                    <label className="text-sm text-muted-foreground">Submitted</label>
                    <p className="font-medium">
                      {format(new Date(selectedRequest.submitted_at), "PPpp")}
                    </p>
                  </div>
                  {selectedRequest.companies && (
                    <div>
                      <label className="text-sm text-muted-foreground">Company</label>
                      <Link
                        to={`/admin/companies/${selectedRequest.company_id}`}
                        className="flex items-center gap-1 text-primary hover:underline font-medium"
                      >
                        <Building2 className="h-4 w-4" />
                        {selectedRequest.companies.name}
                      </Link>
                    </div>
                  )}
                </div>

                {selectedRequest.description && (
                  <div>
                    <label className="text-sm text-muted-foreground">Description</label>
                    <p className="mt-1 p-3 bg-muted rounded-lg">{selectedRequest.description}</p>
                  </div>
                )}

                {selectedRequest.video_link && (
                  <div>
                    <label className="text-sm text-muted-foreground">Video Link</label>
                    <a
                      href={selectedRequest.video_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-primary hover:underline mt-1"
                    >
                      <ExternalLink className="h-4 w-4" />
                      {selectedRequest.video_link}
                    </a>
                  </div>
                )}

                <div>
                  <label className="text-sm text-muted-foreground">Full Payload</label>
                  <pre className="mt-1 p-3 bg-muted rounded-lg text-xs overflow-x-auto">
                    {JSON.stringify(selectedRequest.payload, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </AdminLayout>
    </ProtectedAdminRoute>
  );
}