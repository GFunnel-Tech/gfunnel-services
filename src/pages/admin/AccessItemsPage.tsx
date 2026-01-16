import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, GripVertical, Loader2, Plus, Trash2, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
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
import { AdminLayout } from '@/components/admin/AdminLayout';
import { ProtectedAdminRoute } from '@/components/admin/ProtectedAdminRoute';
import { getCompany, getAccessItems, createAccessItem, updateAccessItem, deleteAccessItem } from '@/lib/adminService';
import { Company, AccessItem, ICON_OPTIONS } from '@/lib/adminTypes';
import { useToast } from '@/hooks/use-toast';
import * as LucideIcons from 'lucide-react';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  folder: LucideIcons.Folder,
  file: LucideIcons.File,
  video: LucideIcons.Video,
  image: LucideIcons.Image,
  link: LucideIcons.Link,
  globe: LucideIcons.Globe,
  settings: LucideIcons.Settings,
  user: LucideIcons.User,
  calendar: LucideIcons.Calendar,
  mail: LucideIcons.Mail,
  phone: LucideIcons.Phone,
  'message-circle': LucideIcons.MessageCircle,
  bookmark: LucideIcons.Bookmark,
  star: LucideIcons.Star,
  heart: LucideIcons.Heart,
  home: LucideIcons.Home,
  briefcase: LucideIcons.Briefcase,
  database: LucideIcons.Database,
  cloud: LucideIcons.Cloud,
  download: LucideIcons.Download,
  upload: LucideIcons.Upload,
  'external-link': LucideIcons.ExternalLink,
};

export default function AccessItemsPage() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();

  const [company, setCompany] = useState<Company | null>(null);
  const [items, setItems] = useState<AccessItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<AccessItem | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    label: '',
    icon: 'folder',
    url: '',
    description: '',
    is_active: true,
  });

  const loadData = async () => {
    if (!id) return;
    
    try {
      const [companyData, itemsData] = await Promise.all([
        getCompany(id),
        getAccessItems(id),
      ]);
      setCompany(companyData);
      setItems(itemsData);
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

  const handleOpenDialog = (item?: AccessItem) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        label: item.label,
        icon: item.icon,
        url: item.url,
        description: item.description || '',
        is_active: item.is_active,
      });
    } else {
      setEditingItem(null);
      setFormData({ label: '', icon: 'folder', url: '', description: '', is_active: true });
    }
    setShowDialog(true);
  };

  const handleSubmit = async () => {
    if (!id) return;
    setIsSubmitting(true);

    try {
      if (editingItem) {
        await updateAccessItem(editingItem.id, {
          label: formData.label,
          icon: formData.icon,
          url: formData.url,
          description: formData.description || null,
          is_active: formData.is_active,
        });
        toast({ title: 'Access item updated' });
      } else {
        await createAccessItem({
          company_id: id,
          label: formData.label,
          icon: formData.icon,
          url: formData.url,
          description: formData.description || null,
          display_order: items.length,
          is_active: formData.is_active,
        });
        toast({ title: 'Access item created' });
      }
      
      setShowDialog(false);
      loadData();
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to save access item',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleActive = async (item: AccessItem) => {
    try {
      await updateAccessItem(item.id, { is_active: !item.is_active });
      loadData();
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to update item',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    
    try {
      await deleteAccessItem(deleteId);
      setItems(items.filter(i => i.id !== deleteId));
      toast({ title: 'Access item deleted' });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to delete item',
        variant: 'destructive',
      });
    } finally {
      setDeleteId(null);
    }
  };

  const IconComponent = (iconName: string) => {
    const Icon = iconMap[iconName] || LucideIcons.Folder;
    return <Icon className="h-5 w-5" />;
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
              <Link to={`/admin/companies/${id}/users`}>
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div className="flex-1">
              <h1 className="text-3xl font-bold">{company?.name} - Access Items</h1>
              <p className="text-muted-foreground">
                Configure the "My Workspace" quick access links
              </p>
            </div>
          </div>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Workspace Items</CardTitle>
                <CardDescription>
                  These links appear in the user's service account under "My Workspace"
                </CardDescription>
              </div>
              <Button onClick={() => handleOpenDialog()}>
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </CardHeader>
            <CardContent>
              {items.length === 0 ? (
                <div className="py-8 text-center text-muted-foreground">
                  No access items yet. Add some quick links for users.
                </div>
              ) : (
                <div className="space-y-2">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className={`flex items-center justify-between p-4 rounded-lg border bg-card ${
                        !item.is_active ? 'opacity-50' : ''
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-muted-foreground cursor-move">
                          <GripVertical className="h-5 w-5" />
                        </div>
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                          {IconComponent(item.icon)}
                        </div>
                        <div>
                          <div className="font-medium">{item.label}</div>
                          {item.description && (
                            <div className="text-sm text-muted-foreground">{item.description}</div>
                          )}
                          <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                            <ExternalLink className="h-3 w-3" />
                            {item.url}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Switch
                          checked={item.is_active}
                          onCheckedChange={() => handleToggleActive(item)}
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenDialog(item)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => setDeleteId(item.id)}
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

        {/* Add/Edit Dialog */}
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingItem ? 'Edit' : 'Add'} Access Item</DialogTitle>
              <DialogDescription>
                Configure a quick access link for the workspace
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="label">Label</Label>
                <Input
                  id="label"
                  placeholder="Recording Sessions"
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="icon">Icon</Label>
                <Select
                  value={formData.icon}
                  onValueChange={(value) => setFormData({ ...formData, icon: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ICON_OPTIONS.map((icon) => (
                      <SelectItem key={icon} value={icon}>
                        <div className="flex items-center gap-2">
                          {IconComponent(icon)}
                          <span className="capitalize">{icon.replace('-', ' ')}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="url">URL</Label>
                <Input
                  id="url"
                  type="url"
                  placeholder="https://example.com/resource"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description (optional)</Label>
                <Input
                  id="description"
                  placeholder="View your screen recordings"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
                <Label htmlFor="is_active" className="font-normal">Active</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDialog(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleSubmit} 
                disabled={!formData.label || !formData.url || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  editingItem ? 'Save Changes' : 'Add Item'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation */}
        <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Access Item?</AlertDialogTitle>
              <AlertDialogDescription>
                This item will be removed from the user's workspace.
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
