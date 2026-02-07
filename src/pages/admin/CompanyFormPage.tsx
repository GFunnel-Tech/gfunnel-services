import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Loader2, Save, FolderOpen, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { ProtectedAdminRoute } from '@/components/admin/ProtectedAdminRoute';
import { QuickAccessManager } from '@/components/admin/QuickAccessManager';
import { getCompany, createCompany, updateCompany } from '@/lib/adminService';
import { PLAN_OPTIONS, Company } from '@/lib/adminTypes';
import { useToast } from '@/hooks/use-toast';

export default function CompanyFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEditing = !!id && id !== 'new';

  const [isLoading, setIsLoading] = useState(isEditing);
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState({
    name: '',
    slug: '',
    plan_name: 'Free',
    plan_price: 0,
    plan_value: 0,
    savings_percentage: 0,
    response_time: 'N/A',
    hours_included: 2,
    hours_used: 0,
    billing_cycle_end: '',
    overage_rate: 83,
    time_multiplier: 13,
    va_hourly_rate: 15,
  });

  useEffect(() => {
    if (isEditing) {
      const loadCompany = async () => {
        try {
          const company = await getCompany(id);
          if (company) {
            setForm({
              name: company.name,
              slug: company.slug,
              plan_name: company.plan_name,
              plan_price: company.plan_price,
              plan_value: company.plan_value,
              savings_percentage: company.savings_percentage,
              response_time: company.response_time,
              hours_included: company.hours_included,
              hours_used: company.hours_used,
              billing_cycle_end: company.billing_cycle_end?.split('T')[0] || '',
              overage_rate: company.overage_rate,
              time_multiplier: company.time_multiplier ?? 13,
              va_hourly_rate: company.va_hourly_rate ?? 15,
            });
          }
        } catch (err) {
          toast({
            title: 'Error',
            description: 'Failed to load company',
            variant: 'destructive',
          });
        } finally {
          setIsLoading(false);
        }
      };
      loadCompany();
    }
  }, [id, isEditing]);

  const handlePlanChange = (planName: string) => {
    const plan = PLAN_OPTIONS.find(p => p.name === planName);
    if (plan) {
      setForm({
        ...form,
        plan_name: planName,
        plan_price: plan.price,
        plan_value: plan.planValue,
        savings_percentage: plan.savings,
        response_time: plan.response,
        hours_included: plan.hours,
      });
    }
  };

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  const handleNameChange = (name: string) => {
    setForm({
      ...form,
      name,
      slug: isEditing ? form.slug : generateSlug(name),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const data = {
        ...form,
        billing_cycle_end: form.billing_cycle_end ? new Date(form.billing_cycle_end).toISOString() : null,
      };

      if (isEditing) {
        await updateCompany(id, data);
        toast({ title: 'Company updated' });
      } else {
        await createCompany(data as any);
        toast({ title: 'Company created' });
      }
      navigate('/admin/companies');
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to save company',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
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
            <div>
              <h1 className="text-3xl font-bold">
                {isEditing ? 'Edit Company' : 'New Company'}
              </h1>
              <p className="text-muted-foreground">
                {isEditing ? 'Update company details and plan' : 'Create a new company account'}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <Tabs defaultValue="general" className="space-y-6">
              <TabsList>
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="plan">Plan & Billing</TabsTrigger>
                <TabsTrigger value="usage">Usage</TabsTrigger>
                {isEditing && <TabsTrigger value="access">Quick Access</TabsTrigger>}
              </TabsList>

              <TabsContent value="general">
                <Card>
                  <CardHeader>
                    <CardTitle>Company Information</CardTitle>
                    <CardDescription>Basic details about the company</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name">Company Name</Label>
                        <Input
                          id="name"
                          value={form.name}
                          onChange={(e) => handleNameChange(e.target.value)}
                          placeholder="Acme Corp"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="slug">Slug</Label>
                        <Input
                          id="slug"
                          value={form.slug}
                          onChange={(e) => setForm({ ...form, slug: e.target.value })}
                          placeholder="acme-corp"
                          required
                        />
                        <p className="text-xs text-muted-foreground">
                          Unique identifier for the company
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="plan">
                <Card>
                  <CardHeader>
                    <CardTitle>Plan & Billing</CardTitle>
                    <CardDescription>Configure the company's subscription plan</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Plan</Label>
                      <Select value={form.plan_name} onValueChange={handlePlanChange}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {PLAN_OPTIONS.map((plan) => (
                            <SelectItem key={plan.name} value={plan.name}>
                              {plan.label} - ${plan.price}/mo
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="plan_price">Monthly Price ($)</Label>
                        <Input
                          id="plan_price"
                          type="number"
                          value={form.plan_price}
                          onChange={(e) => setForm({ ...form, plan_price: Number(e.target.value) })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="plan_value">Plan Value ($)</Label>
                        <Input
                          id="plan_value"
                          type="number"
                          value={form.plan_value}
                          onChange={(e) => setForm({ ...form, plan_value: Number(e.target.value) })}
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="savings_percentage">Savings %</Label>
                        <Input
                          id="savings_percentage"
                          type="number"
                          value={form.savings_percentage}
                          onChange={(e) => setForm({ ...form, savings_percentage: Number(e.target.value) })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="response_time">Response Time</Label>
                        <Input
                          id="response_time"
                          value={form.response_time}
                          onChange={(e) => setForm({ ...form, response_time: e.target.value })}
                          placeholder="24-48 hrs"
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="billing_cycle_end">Billing Cycle End</Label>
                        <Input
                          id="billing_cycle_end"
                          type="date"
                          value={form.billing_cycle_end}
                          onChange={(e) => setForm({ ...form, billing_cycle_end: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="overage_rate">Overage Rate ($/hr)</Label>
                        <Input
                          id="overage_rate"
                          type="number"
                          value={form.overage_rate}
                          onChange={(e) => setForm({ ...form, overage_rate: Number(e.target.value) })}
                        />
                      </div>
                    </div>

                    <Separator className="my-4" />
                    
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">ROTI Calculation Settings</h4>
                      <p className="text-xs text-muted-foreground">
                        Adjust how Return on Time Investment is calculated for this client
                      </p>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="time_multiplier">Time Multiplier</Label>
                        <Input
                          id="time_multiplier"
                          type="number"
                          value={form.time_multiplier}
                          onChange={(e) => setForm({ ...form, time_multiplier: Number(e.target.value) })}
                        />
                        <p className="text-xs text-muted-foreground">
                          How many hours of regular work 1 hour of your work replaces (default: 13)
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="va_hourly_rate">VA Hourly Rate ($)</Label>
                        <Input
                          id="va_hourly_rate"
                          type="number"
                          value={form.va_hourly_rate}
                          onChange={(e) => setForm({ ...form, va_hourly_rate: Number(e.target.value) })}
                        />
                        <p className="text-xs text-muted-foreground">
                          Comparison hourly rate for value calculation (default: $15)
                        </p>
                      </div>
                    </div>

                    {/* ROTI Preview */}
                    <div className="mt-4 p-4 rounded-lg bg-accent/5 border border-accent/20">
                      <div className="flex items-center gap-2 mb-3">
                        <TrendingUp className="w-4 h-4 text-accent" />
                        <h5 className="text-sm font-medium">ROTI Preview</h5>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-3">
                        {[10, 20, 40].map((exampleHours) => {
                          const hoursSaved = exampleHours * form.time_multiplier;
                          const valueDelivered = hoursSaved * form.va_hourly_rate;
                          const roti = form.plan_price > 0 ? valueDelivered / form.plan_price : 0;
                          
                          return (
                            <div key={exampleHours} className="p-3 rounded-md bg-background border">
                              <p className="text-xs text-muted-foreground mb-1">
                                If client uses <span className="font-medium text-foreground">{exampleHours} hrs</span>
                              </p>
                              <div className="space-y-1 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Hours saved:</span>
                                  <span className="font-medium">{hoursSaved}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Value:</span>
                                  <span className="font-medium text-accent">${valueDelivered.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between pt-1 border-t">
                                  <span className="text-muted-foreground">ROTI:</span>
                                  <span className="font-bold text-accent">{roti.toFixed(1)}X</span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <p className="text-xs text-muted-foreground mt-3">
                        Based on ${form.plan_price}/mo plan price • {form.time_multiplier}X multiplier • ${form.va_hourly_rate}/hr rate
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="usage">
                <Card>
                  <CardHeader>
                    <CardTitle>Usage</CardTitle>
                    <CardDescription>Track hours included and used</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="hours_included">Hours Included</Label>
                        <Input
                          id="hours_included"
                          type="number"
                          value={form.hours_included}
                          onChange={(e) => setForm({ ...form, hours_included: Number(e.target.value) })}
                        />
                        <p className="text-xs text-muted-foreground">
                          Use -1 for unlimited hours
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="hours_used">Hours Used</Label>
                        <Input
                          id="hours_used"
                          type="number"
                          step="0.01"
                          value={form.hours_used}
                          onChange={(e) => setForm({ ...form, hours_used: Number(e.target.value) })}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {isEditing && id && (
                <TabsContent value="access">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FolderOpen className="h-5 w-5" />
                        Quick Access Items
                      </CardTitle>
                      <CardDescription>
                        Manage shortcuts and links that appear in the company's workspace
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <QuickAccessManager companyId={id} />
                    </CardContent>
                  </Card>
                </TabsContent>
              )}
            </Tabs>

            <div className="flex justify-end gap-4 mt-6">
              <Button type="button" variant="outline" asChild>
                <Link to="/admin/companies">Cancel</Link>
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {isEditing ? 'Save Changes' : 'Create Company'}
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </AdminLayout>
    </ProtectedAdminRoute>
  );
}
