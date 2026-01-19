import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  ShieldCheck, 
  Package, 
  Settings as SettingsIcon, 
  Plus, 
  Pencil, 
  Trash2,
  Save,
  Loader2,
  DollarSign,
  Coins,
  Users,
  AlertCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface Product {
  id: number;
  slug: string;
  name: string;
  tagline: string;
  price: string;
  priceDetail: string;
  priceAmount?: string;
  description: string;
  valueProposition?: string;
  backstory?: string;
  bestFor?: string[];
  useCases?: string[];
  features?: string[];
  imageUrl?: string;
  badge?: string;
  badgeType?: string;
  commissionAmount?: string;
  commissionType?: string;
  commissionInfo?: string;
  category: string;
  hasInteractiveFeature?: boolean;
  externalUrl?: string;
  isActive: boolean;
  isFeatured: boolean;
  sortOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

interface PlatformSetting {
  id: number;
  key: string;
  value: string;
  label: string;
  description?: string;
  category: string;
  valueType: string;
  updatedAt?: string;
  updatedBy?: string;
}

export default function Admin() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState(false);
  const [activeTab, setActiveTab] = useState("products");

  const { data: adminCheck, isLoading: adminCheckLoading } = useQuery<{ isAdmin: boolean }>({
    queryKey: ["/api/admin/check"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/admin/check");
        if (res.ok) {
          return { isAdmin: true };
        }
        return { isAdmin: false };
      } catch {
        return { isAdmin: false };
      }
    },
    staleTime: 5 * 60 * 1000,
  });

  const { data: products = [], isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ["/api/admin/products"],
    enabled: adminCheck?.isAdmin === true,
  });

  const { data: settings = [], isLoading: settingsLoading } = useQuery<PlatformSetting[]>({
    queryKey: ["/api/admin/settings"],
    enabled: adminCheck?.isAdmin === true,
  });

  const createProduct = useMutation({
    mutationFn: async (product: Partial<Product>) => {
      return apiRequest("POST", "/api/admin/products", product);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/products"] });
      setNewProduct(false);
      toast({ title: "Product created", description: "New product has been added." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create product.", variant: "destructive" });
    },
  });

  const updateProduct = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Product> & { id: number }) => {
      return apiRequest("PATCH", `/api/admin/products/${id}`, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/products"] });
      setEditingProduct(null);
      toast({ title: "Product updated", description: "Changes have been saved." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update product.", variant: "destructive" });
    },
  });

  const deleteProduct = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("DELETE", `/api/admin/products/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/products"] });
      toast({ title: "Product deleted", description: "Product has been removed." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete product.", variant: "destructive" });
    },
  });

  const updateSetting = useMutation({
    mutationFn: async ({ key, value }: { key: string; value: string }) => {
      return apiRequest("PUT", `/api/admin/settings/${key}`, { value });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/settings"] });
      toast({ title: "Setting updated", description: "Changes have been saved." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update setting.", variant: "destructive" });
    },
  });

  const settingsByCategory = settings.reduce((acc, setting) => {
    if (!acc[setting.category]) acc[setting.category] = [];
    acc[setting.category].push(setting);
    return acc;
  }, {} as Record<string, PlatformSetting[]>);

  if (adminCheckLoading) {
    return (
      <div className="flex items-center justify-center py-16" data-testid="admin-loading">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!adminCheck?.isAdmin) {
    return (
      <div className="space-y-6" data-testid="page-admin-unauthorized">
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <ShieldCheck className="w-16 h-16 text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-2">Admin Access Required</h1>
          <p className="text-muted-foreground max-w-md">
            You don't have permission to access the admin dashboard. 
            Contact your administrator if you believe this is an error.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="page-admin">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <ShieldCheck className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold" data-testid="text-page-title">Admin Dashboard</h1>
          <Badge variant="secondary">Admin Only</Badge>
        </div>
        <p className="text-muted-foreground">
          Manage products, commissions, BFT reward rates, and platform settings.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="products" data-testid="tab-products">
            <Package className="w-4 h-4 mr-2" />
            Products
          </TabsTrigger>
          <TabsTrigger value="commissions" data-testid="tab-commissions">
            <DollarSign className="w-4 h-4 mr-2" />
            Commissions
          </TabsTrigger>
          <TabsTrigger value="bft" data-testid="tab-bft">
            <Coins className="w-4 h-4 mr-2" />
            BFT Rewards
          </TabsTrigger>
          <TabsTrigger value="settings" data-testid="tab-settings">
            <SettingsIcon className="w-4 h-4 mr-2" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0">
              <div>
                <CardTitle>Products</CardTitle>
                <CardDescription>Manage products available to ambassadors</CardDescription>
              </div>
              <Dialog open={newProduct} onOpenChange={setNewProduct}>
                <DialogTrigger asChild>
                  <Button data-testid="button-add-product">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Product
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <ProductForm 
                    onSubmit={(data) => createProduct.mutate(data)} 
                    isLoading={createProduct.isPending}
                    onCancel={() => setNewProduct(false)}
                  />
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {productsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No products yet. Add your first product above.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Commission</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product.id} data-testid={`row-product-${product.id}`}>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">{product.name}</span>
                            <span className="text-sm text-muted-foreground">{product.tagline}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium">{product.price}</span>
                          <span className="text-sm text-muted-foreground ml-1">{product.priceDetail}</span>
                        </TableCell>
                        <TableCell>
                          {product.commissionAmount ? (
                            <Badge variant="outline" className="text-green-600">
                              {product.commissionAmount}
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{product.category}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Badge variant={product.isActive ? "default" : "outline"}>
                              {product.isActive ? "Active" : "Inactive"}
                            </Badge>
                            {product.isFeatured && (
                              <Badge variant="secondary">Featured</Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Dialog open={editingProduct?.id === product.id} onOpenChange={(open) => !open && setEditingProduct(null)}>
                              <DialogTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  size="icon" 
                                  onClick={() => setEditingProduct(product)}
                                  data-testid={`button-edit-product-${product.id}`}
                                >
                                  <Pencil className="w-4 h-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                                <ProductForm 
                                  product={editingProduct || undefined}
                                  onSubmit={(data) => updateProduct.mutate({ id: product.id, ...data })} 
                                  isLoading={updateProduct.isPending}
                                  onCancel={() => setEditingProduct(null)}
                                />
                              </DialogContent>
                            </Dialog>
                            <Button 
                              variant="outline" 
                              size="icon"
                              onClick={() => {
                                if (confirm("Are you sure you want to delete this product?")) {
                                  deleteProduct.mutate(product.id);
                                }
                              }}
                              data-testid={`button-delete-product-${product.id}`}
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="commissions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Commission Settings</CardTitle>
              <CardDescription>Configure ambassador payout amounts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {settingsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <SettingsEditor 
                  settings={settingsByCategory["payouts"] || []} 
                  onUpdate={(key, value) => updateSetting.mutate({ key, value })}
                  isLoading={updateSetting.isPending}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bft" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>BFT Reward Rates</CardTitle>
              <CardDescription>Configure BFT token rewards for ambassador actions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {settingsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <SettingsEditor 
                  settings={settingsByCategory["bft_rewards"] || []} 
                  onUpdate={(key, value) => updateSetting.mutate({ key, value })}
                  isLoading={updateSetting.isPending}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Platform Settings</CardTitle>
              <CardDescription>General platform configuration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {settingsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <SettingsEditor 
                  settings={settingsByCategory["subscription"] || []} 
                  onUpdate={(key, value) => updateSetting.mutate({ key, value })}
                  isLoading={updateSetting.isPending}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface ProductFormProps {
  product?: Product;
  onSubmit: (data: Partial<Product>) => void;
  isLoading: boolean;
  onCancel: () => void;
}

function ProductForm({ product, onSubmit, isLoading, onCancel }: ProductFormProps) {
  const [formData, setFormData] = useState<Partial<Product>>({
    slug: product?.slug || "",
    name: product?.name || "",
    tagline: product?.tagline || "",
    price: product?.price || "",
    priceDetail: product?.priceDetail || "",
    priceAmount: product?.priceAmount || "",
    description: product?.description || "",
    valueProposition: product?.valueProposition || "",
    commissionAmount: product?.commissionAmount || "",
    commissionType: product?.commissionType || "flat",
    commissionInfo: product?.commissionInfo || "",
    category: product?.category || "ai-buddy",
    isActive: product?.isActive ?? true,
    isFeatured: product?.isFeatured ?? false,
    sortOrder: product?.sortOrder ?? 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>{product ? "Edit Product" : "Add New Product"}</DialogTitle>
        <DialogDescription>
          {product ? "Update product details" : "Create a new product for ambassadors to sell"}
        </DialogDescription>
      </DialogHeader>
      
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input 
              id="slug"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              placeholder="product-slug"
              data-testid="input-product-slug"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select 
              value={formData.category} 
              onValueChange={(value) => setFormData({ ...formData, category: value })}
            >
              <SelectTrigger data-testid="select-product-category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ai-buddy">AI Buddy</SelectItem>
                <SelectItem value="subscription">Subscription</SelectItem>
                <SelectItem value="bundle">Bundle</SelectItem>
                <SelectItem value="utility">Utility</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input 
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Product Name"
            data-testid="input-product-name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tagline">Tagline</Label>
          <Input 
            id="tagline"
            value={formData.tagline}
            onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
            placeholder="Short catchy tagline"
            data-testid="input-product-tagline"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="price">Price Display</Label>
            <Input 
              id="price"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              placeholder="$29"
              data-testid="input-product-price"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="priceDetail">Price Detail</Label>
            <Input 
              id="priceDetail"
              value={formData.priceDetail}
              onChange={(e) => setFormData({ ...formData, priceDetail: e.target.value })}
              placeholder="per month"
              data-testid="input-product-price-detail"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea 
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Product description..."
            className="min-h-24"
            data-testid="input-product-description"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="commissionAmount">Commission Amount</Label>
            <Input 
              id="commissionAmount"
              value={formData.commissionAmount}
              onChange={(e) => setFormData({ ...formData, commissionAmount: e.target.value })}
              placeholder="$8"
              data-testid="input-product-commission"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="commissionType">Commission Type</Label>
            <Select 
              value={formData.commissionType} 
              onValueChange={(value) => setFormData({ ...formData, commissionType: value })}
            >
              <SelectTrigger data-testid="select-product-commission-type">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="flat">Flat Amount</SelectItem>
                <SelectItem value="percent">Percentage</SelectItem>
                <SelectItem value="recurring">Recurring</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Switch 
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              data-testid="switch-product-active"
            />
            <Label htmlFor="isActive">Active</Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch 
              id="isFeatured"
              checked={formData.isFeatured}
              onCheckedChange={(checked) => setFormData({ ...formData, isFeatured: checked })}
              data-testid="switch-product-featured"
            />
            <Label htmlFor="isFeatured">Featured</Label>
          </div>
          <div className="flex items-center gap-2">
            <Label htmlFor="sortOrder">Sort Order</Label>
            <Input 
              id="sortOrder"
              type="number"
              className="w-20"
              value={formData.sortOrder}
              onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
              data-testid="input-product-sort-order"
            />
          </div>
        </div>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel} data-testid="button-cancel-product">
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading} data-testid="button-save-product">
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              {product ? "Save Changes" : "Create Product"}
            </>
          )}
        </Button>
      </DialogFooter>
    </form>
  );
}

interface SettingsEditorProps {
  settings: PlatformSetting[];
  onUpdate: (key: string, value: string) => void;
  isLoading: boolean;
}

function SettingsEditor({ settings, onUpdate, isLoading }: SettingsEditorProps) {
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>("");

  const startEdit = (setting: PlatformSetting) => {
    setEditingKey(setting.key);
    setEditValue(setting.value);
  };

  const saveEdit = () => {
    if (editingKey) {
      onUpdate(editingKey, editValue);
      setEditingKey(null);
    }
  };

  const cancelEdit = () => {
    setEditingKey(null);
    setEditValue("");
  };

  if (settings.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <AlertCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
        <p>No settings in this category.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {settings.map((setting) => (
        <div 
          key={setting.key} 
          className="flex items-center justify-between p-4 border rounded-lg"
          data-testid={`setting-${setting.key}`}
        >
          <div className="flex-1 mr-4">
            <div className="font-medium">{setting.label}</div>
            {setting.description && (
              <div className="text-sm text-muted-foreground">{setting.description}</div>
            )}
          </div>
          <div className="flex items-center gap-2">
            {editingKey === setting.key ? (
              <>
                <Input
                  type={setting.valueType === "number" ? "number" : "text"}
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="w-32"
                  data-testid={`input-setting-${setting.key}`}
                />
                <Button 
                  size="sm" 
                  onClick={saveEdit} 
                  disabled={isLoading}
                  data-testid={`button-save-setting-${setting.key}`}
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                </Button>
                <Button size="sm" variant="outline" onClick={cancelEdit}>
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Badge variant="secondary" className="min-w-16 justify-center">
                  {setting.valueType === "currency" ? `$${setting.value}` : setting.value}
                </Badge>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => startEdit(setting)}
                  data-testid={`button-edit-setting-${setting.key}`}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
