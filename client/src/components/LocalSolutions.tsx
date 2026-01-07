import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  ExternalLink, 
  MapPin, 
  Phone, 
  RefreshCw,
  Building2,
  Wrench,
  Home,
  Zap
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface ProviderListing {
  id: number;
  providerId: number;
  title: string;
  description: string | null;
  category: string;
  subcategory: string | null;
  price: string | null;
  priceNote: string | null;
  bookingUrl: string | null;
  contactPhone: string | null;
  contactEmail: string | null;
  serviceArea: string | null;
  keywords: string[] | null;
  providerName: string;
  providerWebsite: string;
}

interface LocalSolutionsProps {
  interests: string;
  className?: string;
}

const categoryIcons: Record<string, typeof Wrench> = {
  Handyman: Wrench,
  HVAC: Zap,
  Plumbing: Home,
  Electrical: Zap,
  Garage: Building2,
  Chimney: Home,
  Insulation: Home,
  Cleaning: Home,
  default: Building2,
};

export default function LocalSolutions({ interests, className }: LocalSolutionsProps) {
  const queryClient = useQueryClient();

  const queryKey = ["/api/recommendations", { interests }];
  
  const { data: recommendations, isLoading, error, refetch } = useQuery<ProviderListing[]>({
    queryKey,
    staleTime: 1000 * 60 * 30,
  });

  const refreshMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/scraper/run", {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/recommendations"] });
      refetch();
    },
  });

  if (isLoading) {
    return (
      <Card className={className} data-testid="local-solutions-loading">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            Local Solutions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error || !recommendations || recommendations.length === 0) {
    return (
      <Card className={className} data-testid="local-solutions-empty">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            Local Solutions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No matching local service providers found for this lead.
          </p>
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-2"
            onClick={() => refreshMutation.mutate()}
            disabled={refreshMutation.isPending}
            data-testid="button-refresh-solutions"
          >
            <RefreshCw className={`w-3 h-3 mr-1 ${refreshMutation.isPending ? 'animate-spin' : ''}`} />
            Refresh Data
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className} data-testid="local-solutions">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            Local Solutions ({recommendations.length})
          </CardTitle>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => refetch()}
            data-testid="button-refresh-recommendations"
          >
            <RefreshCw className="w-3 h-3" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {recommendations.slice(0, 3).map((listing, index) => {
          const IconComponent = categoryIcons[listing.category] || categoryIcons.default;
          return (
            <div 
              key={listing.id || index} 
              className="flex flex-col gap-2 p-3 bg-muted/50 rounded-md"
              data-testid={`solution-${listing.id || index}`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <IconComponent className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium leading-tight">{listing.title}</p>
                    <p className="text-xs text-muted-foreground">{listing.providerName}</p>
                  </div>
                </div>
                <Badge variant="secondary" className="text-xs flex-shrink-0">
                  {listing.category}
                </Badge>
              </div>
              
              {listing.description && (
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {listing.description}
                </p>
              )}
              
              <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                {listing.serviceArea && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {listing.serviceArea}
                  </span>
                )}
                {listing.priceNote && (
                  <span className="text-green-600 font-medium">
                    {listing.priceNote}
                  </span>
                )}
              </div>
              
              <div className="flex gap-2 mt-1">
                {listing.bookingUrl && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    asChild
                    data-testid={`button-book-${listing.id || index}`}
                  >
                    <a href={listing.bookingUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Book Now
                    </a>
                  </Button>
                )}
                {listing.contactPhone && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    asChild
                    data-testid={`button-call-provider-${listing.id || index}`}
                  >
                    <a href={`tel:${listing.contactPhone}`}>
                      <Phone className="w-3 h-3 mr-1" />
                      Call
                    </a>
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
