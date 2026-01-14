import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Loader2, GripVertical, Folder, File, Video, Image, Link, Globe, Settings, User, Calendar, Mail, Phone, MessageCircle, Bookmark, Star, Heart, Home, Briefcase, Database, Cloud, Download, Upload, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
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
import { getAccessItems, createAccessItem, updateAccessItem, deleteAccessItem } from '@/lib/adminService';
import { AccessItem, ICON_OPTIONS } from '@/lib/adminTypes';
import { useToast } from '@/hooks/use-toast';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  folder: Folder,
  file: File,
  video: Video,
  image: Image,
  link: Link,
  globe: Globe,
  settings: Settings,
  user: User,
  calendar: Calendar,
  mail: Mail,
  phone: Phone,
  'message-circle': MessageCircle,
  bookmark: Bookmark,
  star: Star,
  heart: Heart,
  home: Home,
  briefcase: Briefcase,
  database: Database,
  cloud: Cloud,
  download: Download,
  upload: Upload,
  'external-link': ExternalLink,
};

interface QuickAccessManagerProps {
  companyId: string;
}

export function QuickAccessManager({ companyId }: QuickAccessManagerProps) {
  const { toast } = useToast();
  const [items, setItems] = useState<AccessItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AccessItem | null>(null);
  const [itemToDelete, setItemToDelete] = useState<AccessItem | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    label: '',
    icon: 'folder',
    url: '',
    description: '',
    is_active: true,
  });

  const loadItems = async () => {
    try {
      const data = await getAccessItems(companyId);
      setItems(data);
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to load access items',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (companyId) {
      loadItems();
    }
  }, [companyId]);

  const handleOpenDialog = (item?: AccessItem) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        label: item.label,
        icon: item.icon,
        url: item.url,
        description: item.description || '',
        is_active: item.is_active ?? true,
      });
    } else {
      setEditingItem(null);
      setFormData({
        label: '',
        icon: 'folder',
        url: '',
        description: '',
        is_active: true,
      });
    }
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      if (editingItem) {
        await updateAccessItem(editingItem.id, formData);
        toast({ title: 'Item updated' });
      } else {
        await createAccessItem({
          ...formData,
          company_id: companyId,
          display_order: items.length,
        });
        toast({ title: 'Item created' });
      }
      setDialogOpen(false);
      loadItems();
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to save item',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleActive = async (item: AccessItem) => {
    try {
      await updateAccessItem(item.id, { is_active: !item.is_active });
      loadItems();
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to update item',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    
    try {
      await deleteAccessItem(itemToDelete.id);
      toast({ title: 'Item deleted' });
      setDeleteDialogOpen(false);
      setItemToDelete(null);
      loadItems();
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to delete item',
        variant: 'destructive',
      });
    }
  };

  const IconComponent = ({ name }: { name: string }) => {
    const Icon = iconMap[name] || Folder;
    return <Icon className="h-4 w-4" />;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Manage quick access links that appear in the company's workspace
        </p>
        <Button onClick={() => handleOpenDialog()} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>
      </div>

      {items.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            <Folder className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No quick access items yet</p>
            <Button variant="link" onClick={() => handleOpenDialog()}>
              Add your first item
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <Card key={item.id} className={!item.is_active ? 'opacity-60' : ''}>
              <CardContent className="py-3 px-4">
                <div className="flex items-center gap-3">
                  <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                  <div className="flex items-center justify-center h-8 w-8 rounded-md bg-primary/10 text-primary">
                    <IconComponent name={item.icon} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{item.label}</p>
                    <p className="text-xs text-muted-foreground truncate">{item.url}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={item.is_active ?? true}
                      onCheckedChange={() => handleToggleActive(item)}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleOpenDialog(item)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setItemToDelete(item);
                        setDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Edit Item' : 'Add Quick Access Item'}</DialogTitle>
            <DialogDescription>
              {editingItem ? 'Update the access item details' : 'Create a new quick access link for the workspace'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="label">Label</Label>
              <Input
                id="label"
                value={formData.label}
                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                placeholder="Project Files"
                required
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
                        <IconComponent name={icon} />
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
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                placeholder="https://drive.google.com/..."
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Shared project documents"
              />
            </div>

            <div className="flex items-center gap-2">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
              <Label htmlFor="is_active">Active</Label>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : editingItem ? (
                  'Update'
                ) : (
                  'Create'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Item</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{itemToDelete?.label}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
