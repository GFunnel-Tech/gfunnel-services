import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building2, Edit, Eye, MoreHorizontal, Plus, Trash2, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
import { AdminLayout } from '@/components/admin/AdminLayout';
import { ProtectedAdminRoute } from '@/components/admin/ProtectedAdminRoute';
import { getCompanies, deleteCompany } from '@/lib/adminService';
import { Company } from '@/lib/adminTypes';
import { formatCurrency } from '@/lib/walletService';
import { useToast } from '@/hooks/use-toast';

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleImpersonate = (companyId: string) => {
    // Store company ID for impersonation and navigate to wallet
    sessionStorage.setItem('admin_impersonate_company', companyId);
    navigate('/wallet');
  };

  const loadCompanies = async () => {
    try {
      const data = await getCompanies();
      setCompanies(data);
    } catch (err) {
      console.error('Failed to load companies:', err);
      toast({
        title: 'Error',
        description: 'Failed to load companies',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCompanies();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    
    try {
      await deleteCompany(deleteId);
      setCompanies(companies.filter(c => c.id !== deleteId));
      toast({ title: 'Company deleted' });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to delete company',
        variant: 'destructive',
      });
    } finally {
      setDeleteId(null);
    }
  };

  const filteredCompanies = companies.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.slug.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <ProtectedAdminRoute>
      <AdminLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Companies</h1>
              <p className="text-muted-foreground">Manage company accounts and plans</p>
            </div>
            <Button asChild>
              <Link to="/admin/companies/new">
                <Plus className="h-4 w-4 mr-2" />
                New Company
              </Link>
            </Button>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <Input
                  placeholder="Search companies..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="max-w-sm"
                />
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="py-8 text-center text-muted-foreground">Loading...</div>
              ) : filteredCompanies.length === 0 ? (
                <div className="py-8 text-center text-muted-foreground">
                  {search ? 'No companies found' : 'No companies yet. Create your first one!'}
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Company</TableHead>
                      <TableHead>Plan</TableHead>
                      <TableHead>Hours</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead className="w-[70px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCompanies.map((company) => (
                      <TableRow key={company.id}>
                        <TableCell>
                          <button 
                            onClick={() => handleImpersonate(company.id)}
                            className="flex items-center gap-3 hover:opacity-70 transition-opacity text-left"
                            title="View service account as this company"
                          >
                            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                              <Building2 className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <div className="font-medium">{company.name}</div>
                              <div className="text-sm text-muted-foreground">{company.slug}</div>
                            </div>
                          </button>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{company.plan_name}</Badge>
                        </TableCell>
                        <TableCell>
                          {company.hours_included === -1 ? (
                            'Unlimited'
                          ) : (
                            `${company.hours_used}/${company.hours_included}`
                          )}
                        </TableCell>
                        <TableCell>{formatCurrency(company.plan_price)}/mo</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleImpersonate(company.id)}>
                                <Eye className="h-4 w-4 mr-2" />
                                View Account
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link to={`/admin/companies/${company.id}`}>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link to={`/admin/companies/${company.id}/users`}>
                                  <Users className="h-4 w-4 mr-2" />
                                  Manage Users
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="text-destructive"
                                onClick={() => setDeleteId(company.id)}
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

        <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Company?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete the company and all associated users and access items.
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </AdminLayout>
    </ProtectedAdminRoute>
  );
}
