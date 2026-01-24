import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Crown, Loader2, Mail, Plus, Trash2, UserCircle, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { ProtectedAdminRoute } from '@/components/admin/ProtectedAdminRoute';
import { getCompany, getCompanyUsers, addCompanyUser, updateCompanyUser, deleteCompanyUser } from '@/lib/adminService';
import { Company, CompanyUser } from '@/lib/adminTypes';
import { useToast } from '@/hooks/use-toast';
import { useAdmin } from '@/hooks/useAdmin';

export default function CompanyUsersPage() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const { user } = useAdmin();

  const [company, setCompany] = useState<Company | null>(null);
  const [users, setUsers] = useState<CompanyUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAddingSelf, setIsAddingSelf] = useState(false);

  const [newUser, setNewUser] = useState({
    email: '',
    display_name: '',
    role: 'member',
    is_primary: false,
  });

  // Check if admin is already linked to this company
  const isAdminLinked = users.some(u => u.email.toLowerCase() === user?.email?.toLowerCase());

  const loadData = async () => {
    if (!id) return;
    
    try {
      const [companyData, usersData] = await Promise.all([
        getCompany(id),
        getCompanyUsers(id),
      ]);
      setCompany(companyData);
      setUsers(usersData);
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to load data',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const handleAddUser = async () => {
    if (!id) return;
    setIsSubmitting(true);

    try {
      await addCompanyUser({
        company_id: id,
        email: newUser.email.toLowerCase().trim(),
        display_name: newUser.display_name || null,
        role: newUser.role,
        is_primary: newUser.is_primary,
      });
      
      toast({ title: 'User added' });
      setShowAddDialog(false);
      setNewUser({ email: '', display_name: '', role: 'member', is_primary: false });
      loadData();
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to add user',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddSelf = async () => {
    if (!id || !user?.email) return;
    setIsAddingSelf(true);

    try {
      await addCompanyUser({
        company_id: id,
        email: user.email.toLowerCase().trim(),
        display_name: 'Admin',
        role: 'admin',
        is_primary: false,
      });
      
      toast({ title: 'Added yourself to this company' });
      loadData();
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to add yourself',
        variant: 'destructive',
      });
    } finally {
      setIsAddingSelf(false);
    }
  };

  const handleTogglePrimary = async (user: CompanyUser) => {
    try {
      await updateCompanyUser(user.id, { is_primary: !user.is_primary });
      loadData();
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to update user',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteUser = async () => {
    if (!deleteId) return;
    
    try {
      await deleteCompanyUser(deleteId);
      setUsers(users.filter(u => u.id !== deleteId));
      toast({ title: 'User removed' });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to remove user',
        variant: 'destructive',
      });
    } finally {
      setDeleteId(null);
    }
  };

  if (isLoading) {
    return (
      <ProtectedAdminRoute>
        <AdminLayout>
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </AdminLayout>
      </ProtectedAdminRoute>
    );
  }

  return (
    <ProtectedAdminRoute>
      <AdminLayout>
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/admin/companies">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div className="flex-1">
              <h1 className="text-3xl font-bold">{company?.name} - Users</h1>
              <p className="text-muted-foreground">
                Manage email addresses that can access this company's wallet
              </p>
            </div>
            <Button asChild variant="outline">
              <Link to={`/admin/companies/${id}/access`}>
                Manage Access Items
              </Link>
            </Button>
          </div>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Linked Users</CardTitle>
                <CardDescription>
                  These email addresses can look up this company's service account
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                {!isAdminLinked && user?.email && (
                  <Button 
                    variant="outline" 
                    onClick={handleAddSelf}
                    disabled={isAddingSelf}
                  >
                    {isAddingSelf ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <UserPlus className="h-4 w-4 mr-2" />
                    )}
                    Add Myself
                  </Button>
                )}
                <Button onClick={() => setShowAddDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add User
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {users.length === 0 ? (
                <div className="py-8 text-center text-muted-foreground">
                  No users linked yet. Add users to allow wallet access.
                </div>
              ) : (
                <div className="space-y-3">
                  {users.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-4 rounded-lg border bg-card"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <UserCircle className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">
                              {user.display_name || user.email}
                            </span>
                            {user.is_primary && (
                              <Badge variant="default" className="gap-1">
                                <Crown className="h-3 w-3" />
                                Primary
                              </Badge>
                            )}
                            <Badge variant="secondary">{user.role}</Badge>
                          </div>
                          <div className="text-sm text-muted-foreground flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {user.email}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleTogglePrimary(user)}
                        >
                          {user.is_primary ? 'Remove Primary' : 'Set Primary'}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => setDeleteId(user.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Add User Dialog */}
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add User</DialogTitle>
              <DialogDescription>
                Add an email address that can access this company's wallet
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="user@company.com"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="display_name">Display Name (optional)</Label>
                <Input
                  id="display_name"
                  placeholder="John Doe"
                  value={newUser.display_name}
                  onChange={(e) => setNewUser({ ...newUser, display_name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select
                  value={newUser.role}
                  onValueChange={(value) => setNewUser({ ...newUser, role: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="member">Member</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="owner">Owner</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="is_primary"
                  checked={newUser.is_primary}
                  onCheckedChange={(checked) => 
                    setNewUser({ ...newUser, is_primary: checked === true })
                  }
                />
                <Label htmlFor="is_primary" className="font-normal">
                  Set as primary contact
                </Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddUser} disabled={!newUser.email || isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Adding...
                  </>
                ) : (
                  'Add User'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation */}
        <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Remove User?</AlertDialogTitle>
              <AlertDialogDescription>
                This user will no longer be able to access this company's wallet data.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteUser} className="bg-destructive text-destructive-foreground">
                Remove
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </AdminLayout>
    </ProtectedAdminRoute>
  );
}
