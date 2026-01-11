import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Heart,
  Activity,
  Scale,
  Droplets,
  TrendingUp,
  Users,
  Plus,
  RefreshCw,
  ExternalLink,
  Trash2,
  AlertCircle,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface ConnectedCustomer {
  id: number;
  customerEmail: string;
  customerName: string | null;
  connectedAt: string;
  lastUpdated: string;
}

interface HealthSummary {
  customer: {
    email: string;
    name: string | null;
  };
  health: {
    latestWeight?: { value: number; date: string };
    latestBP?: { systolic: number; diastolic: number; pulse: number; date: string };
    latestBodyComposition?: {
      fatRatio?: number;
      muscleMass?: number;
      boneMass?: number;
      hydration?: number;
      date: string;
    };
    recentActivity: Array<{
      date: string;
      steps: number;
      calories: number;
    }>;
  };
}

export function WithingsHealthTool() {
  const [connectDialogOpen, setConnectDialogOpen] = useState(false);
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: customers = [], isLoading: customersLoading } = useQuery<ConnectedCustomer[]>({
    queryKey: ["/api/withings/customers"],
  });

  const { data: healthData, isLoading: healthLoading, error: healthError, refetch: refetchHealth } = useQuery<HealthSummary>({
    queryKey: ["/api/withings/customer", selectedCustomerId, "health"],
    enabled: !!selectedCustomerId,
    retry: false,
  });

  const connectMutation = useMutation({
    mutationFn: async ({ email, name }: { email: string; name: string }) => {
      const params = new URLSearchParams({
        customerEmail: email,
        customerName: name,
      });
      const response = await fetch(`/api/withings/auth-url?${params}`);
      if (!response.ok) throw new Error("Failed to get auth URL");
      return response.json() as Promise<{ authUrl: string }>;
    },
    onSuccess: (data) => {
      window.location.href = data.authUrl;
    },
    onError: (error: Error) => {
      toast({
        title: "Connection Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const disconnectMutation = useMutation({
    mutationFn: async (customerId: number) => {
      const response = await apiRequest("DELETE", `/api/withings/customer/${customerId}`);
      if (!response.ok) throw new Error("Failed to disconnect customer");
      return response.json();
    },
    onSuccess: (_data, customerId) => {
      queryClient.invalidateQueries({ queryKey: ["/api/withings/customers"] });
      queryClient.removeQueries({ queryKey: ["/api/withings/customer", customerId, "health"] });
      if (selectedCustomerId === customerId) {
        setSelectedCustomerId(null);
      }
      toast({
        title: "Customer Disconnected",
        description: "The customer's Withings account has been disconnected.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Disconnect Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleConnect = () => {
    if (!customerEmail.trim()) {
      toast({
        title: "Email Required",
        description: "Please enter the customer's email address.",
        variant: "destructive",
      });
      return;
    }
    connectMutation.mutate({ email: customerEmail, name: customerName });
  };

  const getBPCategory = (systolic: number, diastolic: number): { label: string; color: string } => {
    if (systolic < 120 && diastolic < 80) return { label: "Normal", color: "text-green-500" };
    if (systolic < 130 && diastolic < 80) return { label: "Elevated", color: "text-yellow-500" };
    if (systolic < 140 || diastolic < 90) return { label: "High Stage 1", color: "text-orange-500" };
    return { label: "High Stage 2", color: "text-red-500" };
  };

  return (
    <Card className="border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 to-teal-500/10" data-testid="card-withings-tool">
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10">
              <Heart className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <CardTitle className="flex items-center gap-2">
                Withings Health Monitor
                <Badge variant="secondary">New</Badge>
              </CardTitle>
              <CardDescription className="mt-1">
                View customer health data from Withings devices
              </CardDescription>
            </div>
          </div>
          <Dialog open={connectDialogOpen} onOpenChange={setConnectDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2" data-testid="button-connect-customer">
                <Plus className="w-4 h-4" />
                Connect Customer
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Connect Customer's Withings Account</DialogTitle>
                <DialogDescription>
                  Enter the customer's information to start the Withings connection process.
                  They will need to authorize access to their health data.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="customer-email">Customer Email *</Label>
                  <Input
                    id="customer-email"
                    type="email"
                    placeholder="customer@example.com"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    data-testid="input-customer-email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customer-name">Customer Name (Optional)</Label>
                  <Input
                    id="customer-name"
                    placeholder="John Smith"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    data-testid="input-customer-name"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setConnectDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleConnect} 
                  disabled={connectMutation.isPending}
                  data-testid="button-start-connection"
                >
                  {connectMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Connect to Withings
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-3">
            <h4 className="font-medium text-sm flex items-center gap-2">
              <Users className="w-4 h-4" />
              Connected Customers ({customers.length})
            </h4>
            {customersLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : customers.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No customers connected yet</p>
                <p className="text-xs mt-1">Click "Connect Customer" to get started</p>
              </div>
            ) : (
              <div className="space-y-2">
                {customers.map((customer) => (
                  <div
                    key={customer.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors hover-elevate ${
                      selectedCustomerId === customer.id
                        ? "border-emerald-500 bg-emerald-500/10"
                        : "border-border"
                    }`}
                    onClick={() => setSelectedCustomerId(customer.id)}
                    data-testid={`customer-card-${customer.id}`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">
                          {customer.customerName || customer.customerEmail}
                        </p>
                        {customer.customerName && (
                          <p className="text-xs text-muted-foreground">{customer.customerEmail}</p>
                        )}
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          disconnectMutation.mutate(customer.id);
                        }}
                        data-testid={`button-disconnect-${customer.id}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-2">
            {!selectedCustomerId ? (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Select a customer to view their health data</p>
                </div>
              </div>
            ) : healthError ? (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <AlertCircle className="w-10 h-10 mx-auto mb-3 text-destructive opacity-70" />
                  <p className="font-medium">Unable to load health data</p>
                  <p className="text-sm mt-1">The customer may need to reconnect their Withings device.</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3"
                    onClick={() => refetchHealth()}
                    data-testid="button-retry-health"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Try Again
                  </Button>
                </div>
              </div>
            ) : healthLoading ? (
              <div className="grid gap-4 sm:grid-cols-2">
                <Skeleton className="h-32" />
                <Skeleton className="h-32" />
                <Skeleton className="h-32" />
                <Skeleton className="h-32" />
              </div>
            ) : healthData ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {healthData.health.latestWeight && (
                  <Card data-testid="card-weight">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Scale className="w-4 h-4 text-blue-500" />
                        Weight
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold">
                        {healthData.health.latestWeight.value.toFixed(1)} kg
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(healthData.health.latestWeight.date).toLocaleDateString()}
                      </p>
                    </CardContent>
                  </Card>
                )}

                {healthData.health.latestBP && (
                  <Card data-testid="card-blood-pressure">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Heart className="w-4 h-4 text-red-500" />
                        Blood Pressure
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold">
                        {healthData.health.latestBP.systolic}/{healthData.health.latestBP.diastolic}
                        <span className="text-sm font-normal ml-1">mmHg</span>
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge 
                          variant="outline" 
                          className={getBPCategory(
                            healthData.health.latestBP.systolic, 
                            healthData.health.latestBP.diastolic
                          ).color}
                        >
                          {getBPCategory(
                            healthData.health.latestBP.systolic, 
                            healthData.health.latestBP.diastolic
                          ).label}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          Pulse: {healthData.health.latestBP.pulse} bpm
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(healthData.health.latestBP.date).toLocaleDateString()}
                      </p>
                    </CardContent>
                  </Card>
                )}

                {healthData.health.latestBodyComposition && (
                  <Card data-testid="card-body-composition">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Droplets className="w-4 h-4 text-cyan-500" />
                        Body Composition
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {healthData.health.latestBodyComposition.fatRatio && (
                        <div>
                          <div className="flex justify-between text-xs">
                            <span>Body Fat</span>
                            <span>{healthData.health.latestBodyComposition.fatRatio.toFixed(1)}%</span>
                          </div>
                          <Progress value={healthData.health.latestBodyComposition.fatRatio} className="h-1" />
                        </div>
                      )}
                      {healthData.health.latestBodyComposition.muscleMass && (
                        <div className="text-xs flex justify-between">
                          <span>Muscle Mass</span>
                          <span>{healthData.health.latestBodyComposition.muscleMass.toFixed(1)} kg</span>
                        </div>
                      )}
                      <p className="text-xs text-muted-foreground">
                        {new Date(healthData.health.latestBodyComposition.date).toLocaleDateString()}
                      </p>
                    </CardContent>
                  </Card>
                )}

                {healthData.health.recentActivity.length > 0 && (
                  <Card data-testid="card-activity">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Activity className="w-4 h-4 text-green-500" />
                        Recent Activity
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {healthData.health.recentActivity.slice(0, 3).map((day, i) => (
                          <div key={i} className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground">{day.date}</span>
                            <div className="flex items-center gap-3">
                              <span className="font-medium">{day.steps.toLocaleString()} steps</span>
                              <span className="text-xs text-muted-foreground">{day.calories} cal</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {!healthData.health.latestWeight && 
                 !healthData.health.latestBP && 
                 !healthData.health.latestBodyComposition && 
                 healthData.health.recentActivity.length === 0 && (
                  <div className="col-span-2 text-center py-8 text-muted-foreground">
                    <AlertCircle className="w-10 h-10 mx-auto mb-3 opacity-50" />
                    <p>No health data available yet</p>
                    <p className="text-sm mt-1">
                      The customer needs to sync their Withings device to see data here.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <AlertCircle className="w-10 h-10 mx-auto mb-3 opacity-50" />
                  <p>Unable to load health data</p>
                  <p className="text-sm mt-1">The customer may need to reconnect their device.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 pt-4 border-t">
          <p className="text-xs text-muted-foreground">
            Withings devices include smart scales, blood pressure monitors, and fitness trackers.
            <a 
              href="https://www.withings.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-emerald-600 hover:underline ml-1"
            >
              Learn more about Withings products
            </a>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
