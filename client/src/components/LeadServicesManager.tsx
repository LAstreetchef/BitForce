import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Plus, 
  CheckCircle2, 
  Phone as PhoneIcon, 
  ThumbsUp, 
  DollarSign, 
  XCircle,
  Loader2,
  ClipboardList
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { LeadService } from "@shared/schema";

interface ScraperStatus {
  leadId: number;
  status: "idle" | "running" | "completed" | "error";
  canTrigger: boolean;
}

interface LeadServicesManagerProps {
  leadId: number;
  recommendations?: { id: number; title: string; providerName: string }[];
  onRecommendationsRefresh?: () => void;
}

const STATUS_CONFIG = {
  suggested: { label: "Suggested", icon: ClipboardList, color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" },
  contacted: { label: "Contacted", icon: PhoneIcon, color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200" },
  interested: { label: "Interested", icon: ThumbsUp, color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200" },
  sold: { label: "Sold", icon: DollarSign, color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" },
  declined: { label: "Declined", icon: XCircle, color: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200" },
};

const POINT_VALUES = {
  suggested: 5,
  contacted: 10,
  interested: 15,
  sold: 50,
};

export default function LeadServicesManager({ leadId, recommendations = [], onRecommendationsRefresh }: LeadServicesManagerProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newServiceName, setNewServiceName] = useState("");
  const [newServiceNotes, setNewServiceNotes] = useState("");
  const [selectedListing, setSelectedListing] = useState<string>("");
  const [isScraperRunning, setIsScraperRunning] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const checkScraperStatus = useCallback(async () => {
    try {
      const response = await fetch(`/api/scraper/status/${leadId}`, { credentials: "include" });
      if (response.ok) {
        const status: ScraperStatus = await response.json();
        if (status.status === "completed") {
          setIsScraperRunning(false);
          queryClient.invalidateQueries({ queryKey: ["/api/recommendations"] });
          onRecommendationsRefresh?.();
          toast({
            title: "Recommendations Updated",
            description: "Fresh service listings are now available!",
          });
          return true;
        } else if (status.status === "error") {
          setIsScraperRunning(false);
          return true;
        }
        return false;
      }
      return true;
    } catch {
      setIsScraperRunning(false);
      return true;
    }
  }, [leadId, queryClient, onRecommendationsRefresh, toast]);

  useEffect(() => {
    if (!isScraperRunning) return;
    
    const interval = setInterval(async () => {
      const done = await checkScraperStatus();
      if (done) clearInterval(interval);
    }, 2000);
    
    return () => clearInterval(interval);
  }, [isScraperRunning, checkScraperStatus]);

  const { data: services = [], isLoading } = useQuery<LeadService[]>({
    queryKey: [`/api/leads/${leadId}/services`],
  });

  const addServiceMutation = useMutation({
    mutationFn: async (data: { serviceName: string; listingId?: number; notes?: string }) => {
      return apiRequest("POST", `/api/leads/${leadId}/services`, data);
    },
    onSuccess: (response: any) => {
      queryClient.invalidateQueries({ queryKey: [`/api/leads/${leadId}/services`] });
      queryClient.invalidateQueries({ queryKey: ["/api/gamification/stats"] });
      setNewServiceName("");
      setNewServiceNotes("");
      setSelectedListing("");
      setIsAddDialogOpen(false);
      
      if (response?.scraperTriggered) {
        setIsScraperRunning(true);
        toast({
          title: "Service Added",
          description: `+${POINT_VALUES.suggested} points! Refreshing recommendations...`,
        });
      } else {
        toast({
          title: "Service Added",
          description: `+${POINT_VALUES.suggested} points earned!`,
        });
      }
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add service",
        variant: "destructive",
      });
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status, notes }: { id: number; status: string; notes?: string }) => {
      return apiRequest("PATCH", `/api/lead-services/${id}/status`, { status, notes });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [`/api/leads/${leadId}/services`] });
      queryClient.invalidateQueries({ queryKey: ["/api/gamification/stats"] });
      const pointValue = POINT_VALUES[variables.status as keyof typeof POINT_VALUES];
      if (pointValue) {
        toast({
          title: "Status Updated",
          description: `+${pointValue} points earned!`,
        });
      }
    },
  });

  const handleAddService = () => {
    if (!newServiceName.trim()) return;
    
    const listingId = selectedListing ? parseInt(selectedListing) : undefined;
    addServiceMutation.mutate({
      serviceName: newServiceName,
      listingId,
      notes: newServiceNotes || undefined,
    });
  };

  const handleQuickAdd = (recommendation: { id: number; title: string; providerName: string }) => {
    addServiceMutation.mutate({
      serviceName: `${recommendation.title} (${recommendation.providerName})`,
      listingId: recommendation.id,
    });
  };

  if (isLoading) {
    return (
      <Card data-testid="lead-services-loading">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <ClipboardList className="w-4 h-4" />
            Assigned Services
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card data-testid="lead-services-manager">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <ClipboardList className="w-4 h-4" />
            Assigned Services ({services.length})
            {isScraperRunning && (
              <Badge variant="outline" className="ml-2 text-xs">
                <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                Updating
              </Badge>
            )}
          </CardTitle>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" data-testid="button-add-service">
                <Plus className="w-4 h-4 mr-1" />
                Add Service
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Service to Lead</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                {recommendations.length > 0 && (
                  <div>
                    <label className="text-sm font-medium">Quick Add from Recommendations</label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {recommendations.slice(0, 3).map((rec) => (
                        <Button
                          key={rec.id}
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuickAdd(rec)}
                          disabled={addServiceMutation.isPending}
                          data-testid={`button-quick-add-${rec.id}`}
                        >
                          {rec.title}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium">Or Enter Custom Service</label>
                  <Input
                    placeholder="Service name..."
                    value={newServiceName}
                    onChange={(e) => setNewServiceName(e.target.value)}
                    className="mt-2"
                    data-testid="input-service-name"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Notes (optional)</label>
                  <Textarea
                    placeholder="Add notes about this service..."
                    value={newServiceNotes}
                    onChange={(e) => setNewServiceNotes(e.target.value)}
                    className="mt-2"
                    data-testid="input-service-notes"
                  />
                </div>
                <Button 
                  onClick={handleAddService} 
                  disabled={!newServiceName.trim() || addServiceMutation.isPending}
                  className="w-full"
                  data-testid="button-confirm-add-service"
                >
                  {addServiceMutation.isPending ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Plus className="w-4 h-4 mr-2" />
                  )}
                  Add Service (+{POINT_VALUES.suggested} pts)
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {services.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No services assigned yet. Add services to track your follow-ups!
          </p>
        ) : (
          services.map((service) => {
            const statusConfig = STATUS_CONFIG[service.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.suggested;
            const StatusIcon = statusConfig.icon;
            
            return (
              <div 
                key={service.id}
                className="flex flex-col gap-2 p-3 bg-muted/50 rounded-md"
                data-testid={`service-${service.id}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{service.serviceName}</p>
                    {service.notes && (
                      <p className="text-xs text-muted-foreground mt-1">{service.notes}</p>
                    )}
                  </div>
                  <Badge className={statusConfig.color}>
                    <StatusIcon className="w-3 h-3 mr-1" />
                    {statusConfig.label}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-muted-foreground">Update status:</span>
                  <Select
                    value={service.status}
                    onValueChange={(value) => updateStatusMutation.mutate({ id: service.id, status: value })}
                    disabled={updateStatusMutation.isPending}
                  >
                    <SelectTrigger className="w-[140px] h-8" data-testid={`select-status-${service.id}`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="suggested">
                        Suggested
                      </SelectItem>
                      <SelectItem value="contacted">
                        Contacted (+{POINT_VALUES.contacted} pts)
                      </SelectItem>
                      <SelectItem value="interested">
                        Interested (+{POINT_VALUES.interested} pts)
                      </SelectItem>
                      <SelectItem value="sold">
                        Sold (+{POINT_VALUES.sold} pts)
                      </SelectItem>
                      <SelectItem value="declined">
                        Declined
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
