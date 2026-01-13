import { useState, useEffect, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import {
  Search,
  MapPin,
  Phone,
  Globe,
  Star,
  Save,
  Mail,
  ExternalLink,
  Download,
  Trash2,
  Building2,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
  Target,
  TrendingUp,
  Home,
  DollarSign,
  Bed,
  Bath,
  Ruler,
  Calendar,
  User,
} from "lucide-react";

const createMarkerIcon = (score: number) => {
  let color = "#22c55e"; // green for low scores
  if (score >= 70) color = "#ef4444"; // red for high scores
  else if (score >= 50) color = "#eab308"; // yellow for medium scores

  return L.divIcon({
    className: "custom-marker",
    html: `<div style="
      background-color: ${color};
      width: 24px;
      height: 24px;
      border-radius: 50%;
      border: 2px solid white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 10px;
      font-weight: bold;
    ">${score}</div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 13);
  }, [center, map]);
  return null;
}

interface PlaceResult {
  placeId: string;
  businessName: string;
  address: string;
  phone?: string;
  website?: string;
  latitude: number;
  longitude: number;
  businessType: string;
  rating?: number;
  reviewCount?: number;
  priceLevel?: number;
  types: string[];
  openNow?: boolean;
  score?: number;
}

interface SearchResult {
  places: PlaceResult[];
  center: { latitude: number; longitude: number; formattedAddress: string };
  searchRadius: number;
}

interface SavedLead {
  id: number;
  placeId: string;
  businessName: string;
  address: string;
  phone?: string;
  website?: string;
  latitude: string;
  longitude: string;
  businessType?: string;
  rating?: string;
  reviewCount?: number;
  score: number;
  status: string;
  notes?: string;
  createdAt: string;
}

const STATUS_OPTIONS = [
  { value: "new", label: "New", icon: Clock, color: "bg-blue-500" },
  { value: "contacted", label: "Contacted", icon: Phone, color: "bg-yellow-500" },
  { value: "interested", label: "Interested", icon: TrendingUp, color: "bg-purple-500" },
  { value: "client", label: "Client", icon: CheckCircle, color: "bg-green-500" },
  { value: "declined", label: "Declined", icon: XCircle, color: "bg-red-500" },
];

const BUSINESS_TYPES = [
  { value: "restaurant", label: "Restaurants" },
  { value: "store", label: "Retail Stores" },
  { value: "doctor", label: "Healthcare" },
  { value: "lawyer", label: "Legal Services" },
  { value: "gym", label: "Fitness" },
  { value: "salon", label: "Salons & Spas" },
  { value: "real_estate_agency", label: "Real Estate" },
  { value: "accounting", label: "Accounting" },
];

export default function LeadFinder() {
  const { toast } = useToast();
  const [location, setLocation] = useState("");
  const [radius, setRadius] = useState("5");
  const [businessType, setBusinessType] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null);
  const [selectedLead, setSelectedLead] = useState<PlaceResult | SavedLead | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([29.7604, -95.3698]); // Houston default
  const [activeTab, setActiveTab] = useState("search");

  const { data: savedLeads, refetch: refetchSaved } = useQuery<SavedLead[]>({
    queryKey: ["/api/lead-finder/saved"],
  });

  const searchMutation = useMutation({
    mutationFn: async (data: { location: string; radiusMiles: number; businessTypes?: string[] }) => {
      const response = await apiRequest("POST", "/api/lead-finder/search", data);
      return response.json();
    },
    onSuccess: (data: SearchResult) => {
      setSearchResults(data);
      setMapCenter([data.center.latitude, data.center.longitude]);
      toast({
        title: "Search Complete",
        description: `Found ${data.places.length} potential leads`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Search Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (lead: PlaceResult) => {
      const response = await apiRequest("POST", "/api/lead-finder/save", {
        ...lead,
        searchLocation: location,
        searchRadius: parseInt(radius),
      });
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Lead Saved" });
      queryClient.invalidateQueries({ queryKey: ["/api/lead-finder/saved"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to save",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: Partial<SavedLead> }) => {
      const response = await apiRequest("PATCH", `/api/lead-finder/saved/${id}`, updates);
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Lead Updated" });
      queryClient.invalidateQueries({ queryKey: ["/api/lead-finder/saved"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/lead-finder/saved/${id}`);
    },
    onSuccess: () => {
      toast({ title: "Lead Deleted" });
      queryClient.invalidateQueries({ queryKey: ["/api/lead-finder/saved"] });
    },
  });

  const handleSearch = () => {
    if (!location.trim()) {
      toast({
        title: "Enter a location",
        description: "Please enter an address, city, or ZIP code",
        variant: "destructive",
      });
      return;
    }
    searchMutation.mutate({
      location,
      radiusMiles: parseInt(radius),
      businessTypes: businessType ? [businessType] : undefined,
    });
  };

  const handleExport = () => {
    window.open("/api/lead-finder/export", "_blank");
  };

  const savedPlaceIds = useMemo(() => {
    return new Set(savedLeads?.map((l) => l.placeId) || []);
  }, [savedLeads]);

  const getScoreBadgeColor = (score: number) => {
    if (score >= 70) return "bg-red-500 text-white";
    if (score >= 50) return "bg-yellow-500 text-black";
    return "bg-green-500 text-white";
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Target className="w-6 h-6 text-primary" />
            Lead Finder
          </h1>
          <p className="text-muted-foreground">Find local businesses in minutes, not days</p>
        </div>
        {savedLeads && savedLeads.length > 0 && (
          <Button variant="outline" onClick={handleExport} data-testid="button-export">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="mb-4">
          <TabsTrigger value="search" data-testid="tab-search">
            <Search className="w-4 h-4 mr-2" />
            Search
          </TabsTrigger>
          <TabsTrigger value="saved" data-testid="tab-saved">
            <Save className="w-4 h-4 mr-2" />
            Saved ({savedLeads?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="property" data-testid="tab-property">
            <Home className="w-4 h-4 mr-2" />
            Property Intel
          </TabsTrigger>
        </TabsList>

        <TabsContent value="search" className="flex-1 flex flex-col gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-4 items-end">
                <div className="flex-1 min-w-[200px]">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="Address, City, or ZIP Code"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    data-testid="input-location"
                  />
                </div>
                <div className="w-32">
                  <Label htmlFor="radius">Radius</Label>
                  <Select value={radius} onValueChange={setRadius}>
                    <SelectTrigger id="radius" data-testid="select-radius">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 mile</SelectItem>
                      <SelectItem value="5">5 miles</SelectItem>
                      <SelectItem value="10">10 miles</SelectItem>
                      <SelectItem value="25">25 miles</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-40">
                  <Label htmlFor="type">Business Type</Label>
                  <Select value={businessType} onValueChange={setBusinessType}>
                    <SelectTrigger id="type" data-testid="select-type">
                      <SelectValue placeholder="All types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All types</SelectItem>
                      {BUSINESS_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  onClick={handleSearch}
                  disabled={searchMutation.isPending}
                  data-testid="button-search"
                >
                  {searchMutation.isPending ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Search className="w-4 h-4 mr-2" />
                  )}
                  Search Leads
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-0">
            <Card className="flex flex-col overflow-hidden">
              <CardHeader className="p-3 border-b">
                <CardTitle className="text-sm flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Map View
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 flex-1">
                <MapContainer
                  center={mapCenter}
                  zoom={13}
                  style={{ height: "100%", width: "100%", minHeight: "300px" }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <MapUpdater center={mapCenter} />
                  {searchResults?.places.map((place) => (
                    <Marker
                      key={place.placeId}
                      position={[place.latitude, place.longitude]}
                      icon={createMarkerIcon(place.score || 50)}
                      eventHandlers={{
                        click: () => setSelectedLead(place),
                      }}
                    >
                      <Popup>
                        <div className="p-1">
                          <strong>{place.businessName}</strong>
                          <br />
                          <span className="text-xs">{place.address}</span>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </CardContent>
            </Card>

            <Card className="flex flex-col overflow-hidden">
              <CardHeader className="p-3 border-b">
                <CardTitle className="text-sm flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    Results ({searchResults?.places.length || 0})
                  </span>
                  <div className="flex gap-1 text-xs">
                    <Badge className="bg-red-500 text-white text-[10px]">70+</Badge>
                    <Badge className="bg-yellow-500 text-black text-[10px]">50-69</Badge>
                    <Badge className="bg-green-500 text-white text-[10px]">&lt;50</Badge>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2 flex-1 overflow-auto">
                {!searchResults && !searchMutation.isPending && (
                  <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                    <Search className="w-12 h-12 mb-2 opacity-50" />
                    <p>Enter a location to find leads</p>
                  </div>
                )}
                {searchMutation.isPending && (
                  <div className="flex flex-col items-center justify-center h-full">
                    <Loader2 className="w-8 h-8 animate-spin mb-2" />
                    <p>Searching for leads...</p>
                  </div>
                )}
                {searchResults && (
                  <div className="space-y-2">
                    {searchResults.places.map((place) => (
                      <LeadCard
                        key={place.placeId}
                        lead={place}
                        isSaved={savedPlaceIds.has(place.placeId)}
                        onSave={() => saveMutation.mutate(place)}
                        onSelect={() => setSelectedLead(place)}
                        saving={saveMutation.isPending}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="saved" className="flex-1 overflow-auto">
          {!savedLeads || savedLeads.length === 0 ? (
            <Card className="p-8 text-center">
              <Save className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <h3 className="font-semibold mb-2">No Saved Leads</h3>
              <p className="text-muted-foreground">Search for leads and save the ones you want to follow up with</p>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {savedLeads.map((lead) => (
                <SavedLeadCard
                  key={lead.id}
                  lead={lead}
                  onUpdate={(updates) => updateMutation.mutate({ id: lead.id, updates })}
                  onDelete={() => deleteMutation.mutate(lead.id)}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="property" className="flex-1 overflow-auto">
          <PropertyIntelligence />
        </TabsContent>
      </Tabs>

      {selectedLead && (
        <LeadDetailDialog
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
          isSaved={"id" in selectedLead || savedPlaceIds.has(selectedLead.placeId)}
          onSave={() => "placeId" in selectedLead && saveMutation.mutate(selectedLead as PlaceResult)}
        />
      )}
    </div>
  );
}

function LeadCard({
  lead,
  isSaved,
  onSave,
  onSelect,
  saving,
}: {
  lead: PlaceResult;
  isSaved: boolean;
  onSave: () => void;
  onSelect: () => void;
  saving?: boolean;
}) {
  const score = lead.score || 50;

  return (
    <div
      className="p-3 border rounded-lg hover-elevate cursor-pointer"
      onClick={onSelect}
      data-testid={`card-lead-${lead.placeId}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Badge className={`text-xs ${score >= 70 ? "bg-red-500" : score >= 50 ? "bg-yellow-500 text-black" : "bg-green-500"}`}>
              {score}%
            </Badge>
            <h4 className="font-medium truncate">{lead.businessName}</h4>
          </div>
          <p className="text-xs text-muted-foreground truncate">{lead.address}</p>
          <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
            {lead.rating && (
              <span className="flex items-center gap-1">
                <Star className="w-3 h-3 text-yellow-500" />
                {lead.rating}
              </span>
            )}
            {lead.reviewCount && <span>{lead.reviewCount} reviews</span>}
            <Badge variant="outline" className="text-[10px]">
              {lead.businessType}
            </Badge>
          </div>
        </div>
        <Button
          size="sm"
          variant={isSaved ? "secondary" : "default"}
          onClick={(e) => {
            e.stopPropagation();
            if (!isSaved) onSave();
          }}
          disabled={isSaved || saving}
          data-testid={`button-save-${lead.placeId}`}
        >
          {isSaved ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
        </Button>
      </div>
    </div>
  );
}

function SavedLeadCard({
  lead,
  onUpdate,
  onDelete,
}: {
  lead: SavedLead;
  onUpdate: (updates: Partial<SavedLead>) => void;
  onDelete: () => void;
}) {
  const [notes, setNotes] = useState(lead.notes || "");
  const statusConfig = STATUS_OPTIONS.find((s) => s.value === lead.status) || STATUS_OPTIONS[0];
  const StatusIcon = statusConfig.icon;

  return (
    <Card data-testid={`card-saved-${lead.id}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Badge className={`${statusConfig.color} text-white text-xs`}>
                <StatusIcon className="w-3 h-3 mr-1" />
                {statusConfig.label}
              </Badge>
              <Badge variant="outline" className="text-xs">{lead.score}%</Badge>
            </div>
            <h4 className="font-medium">{lead.businessName}</h4>
            <p className="text-sm text-muted-foreground truncate">{lead.address}</p>
          </div>
          <Button
            size="icon"
            variant="ghost"
            onClick={onDelete}
            data-testid={`button-delete-${lead.id}`}
          >
            <Trash2 className="w-4 h-4 text-destructive" />
          </Button>
        </div>

        <div className="flex flex-wrap gap-2 mb-3 text-sm">
          {lead.phone && (
            <a
              href={`tel:${lead.phone}`}
              className="flex items-center gap-1 text-primary hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              <Phone className="w-3 h-3" />
              {lead.phone}
            </a>
          )}
          {lead.website && (
            <a
              href={lead.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-primary hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              <Globe className="w-3 h-3" />
              Website
            </a>
          )}
        </div>

        <div className="space-y-2">
          <Select
            value={lead.status}
            onValueChange={(value) => onUpdate({ status: value })}
          >
            <SelectTrigger className="h-8" data-testid={`select-status-${lead.id}`}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <span className="flex items-center gap-2">
                    <option.icon className="w-4 h-4" />
                    {option.label}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Textarea
            placeholder="Add notes..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            onBlur={() => notes !== lead.notes && onUpdate({ notes })}
            className="text-sm h-16 resize-none"
            data-testid={`textarea-notes-${lead.id}`}
          />
        </div>

        <div className="flex gap-2 mt-3">
          <Button
            size="sm"
            variant="outline"
            className="flex-1"
            onClick={() => window.open(`/explainer?ref=${lead.id}`, "_blank")}
            data-testid={`button-explainer-${lead.id}`}
          >
            <Mail className="w-3 h-3 mr-1" />
            Explainer
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="flex-1"
            onClick={() => window.open(`/why-bitforce?ref=${lead.id}`, "_blank")}
            data-testid={`button-why-${lead.id}`}
          >
            <ExternalLink className="w-3 h-3 mr-1" />
            Why BitForce
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function LeadDetailDialog({
  lead,
  onClose,
  isSaved,
  onSave,
}: {
  lead: PlaceResult | SavedLead;
  onClose: () => void;
  isSaved: boolean;
  onSave: () => void;
}) {
  const score = "score" in lead ? (typeof lead.score === "number" ? lead.score : 50) : 50;

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md z-[1000]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Badge className={score >= 70 ? "bg-red-500" : score >= 50 ? "bg-yellow-500 text-black" : "bg-green-500"}>
              {score}% Match
            </Badge>
            {lead.businessName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <MapPin className="w-4 h-4" />
              <span>{lead.address}</span>
            </div>
            {"phone" in lead && lead.phone && (
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <a href={`tel:${lead.phone}`} className="text-primary hover:underline">
                  {lead.phone}
                </a>
              </div>
            )}
            {"website" in lead && lead.website && (
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-muted-foreground" />
                <a
                  href={lead.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline truncate"
                >
                  {lead.website}
                </a>
              </div>
            )}
          </div>

          {"rating" in lead && lead.rating && (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500" />
                <span>{lead.rating} rating</span>
              </div>
              {"reviewCount" in lead && lead.reviewCount && (
                <span className="text-muted-foreground">{lead.reviewCount} reviews</span>
              )}
            </div>
          )}

          <div className="flex gap-2">
            {!isSaved && (
              <Button onClick={onSave} className="flex-1" data-testid="button-save-detail">
                <Save className="w-4 h-4 mr-2" />
                Save Lead
              </Button>
            )}
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => window.open(`/explainer`, "_blank")}
            >
              <Mail className="w-4 h-4 mr-2" />
              Send Explainer
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface PropertyData {
  property: {
    id: string;
    formattedAddress: string;
    city: string;
    state: string;
    zipCode: string;
    county: string;
    latitude: number;
    longitude: number;
    propertyType: string;
    bedrooms: number;
    bathrooms: number;
    squareFootage: number;
    lotSize: number;
    yearBuilt: number;
    lastSaleDate: string;
    lastSalePrice: number;
    ownerOccupied: boolean;
    features: {
      architectureType?: string;
      cooling?: boolean;
      coolingType?: string;
      heating?: boolean;
      heatingType?: string;
      pool?: boolean;
      garage?: boolean;
      garageSpaces?: number;
      fireplace?: boolean;
    };
    taxAssessments: Array<{
      year: number;
      value: number;
    }>;
    owner?: {
      names: string[];
      mailingAddress?: {
        addressLine1: string;
        city: string;
        state: string;
        zipCode: string;
      };
    };
  } | null;
  valueEstimate: {
    price: number;
    priceRangeLow: number;
    priceRangeHigh: number;
    comparables: Array<{
      formattedAddress: string;
      price: number;
      squareFootage: number;
      distance: number;
    }>;
  } | null;
  rentEstimate: {
    rent: number;
    rentRangeLow: number;
    rentRangeHigh: number;
  } | null;
}

function PropertyIntelligence() {
  const { toast } = useToast();
  const [address, setAddress] = useState("");
  const [propertyData, setPropertyData] = useState<PropertyData | null>(null);

  const lookupMutation = useMutation({
    mutationFn: async (addr: string) => {
      const response = await apiRequest("POST", "/api/property-intel/lookup", { address: addr });
      return response.json();
    },
    onSuccess: (data: PropertyData) => {
      setPropertyData(data);
      if (!data.property) {
        toast({
          title: "Property Not Found",
          description: "Could not find property records for this address",
          variant: "destructive",
        });
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Lookup Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleLookup = () => {
    if (!address.trim()) {
      toast({
        title: "Enter an address",
        description: "Please enter a full property address",
        variant: "destructive",
      });
      return;
    }
    lookupMutation.mutate(address);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString();
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <Label htmlFor="property-address">Property Address</Label>
              <Input
                id="property-address"
                placeholder="Enter full address (e.g., 123 Main St, Houston, TX 77001)"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLookup()}
                data-testid="input-property-address"
              />
            </div>
            <Button
              onClick={handleLookup}
              disabled={lookupMutation.isPending}
              data-testid="button-property-lookup"
            >
              {lookupMutation.isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Search className="w-4 h-4 mr-2" />
              )}
              Lookup Property
            </Button>
          </div>
        </CardContent>
      </Card>

      {propertyData && propertyData.property && (
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Home className="w-5 h-5 text-primary" />
                Property Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="font-medium">{propertyData.property.formattedAddress}</p>
                <p className="text-sm text-muted-foreground">
                  {propertyData.property.city}, {propertyData.property.state} {propertyData.property.zipCode}
                </p>
                <p className="text-sm text-muted-foreground">{propertyData.property.county} County</p>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-2">
                <div className="text-center p-2 bg-muted rounded-lg">
                  <Bed className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
                  <p className="font-semibold">{propertyData.property.bedrooms || "—"}</p>
                  <p className="text-xs text-muted-foreground">Beds</p>
                </div>
                <div className="text-center p-2 bg-muted rounded-lg">
                  <Bath className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
                  <p className="font-semibold">{propertyData.property.bathrooms || "—"}</p>
                  <p className="text-xs text-muted-foreground">Baths</p>
                </div>
                <div className="text-center p-2 bg-muted rounded-lg">
                  <Ruler className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
                  <p className="font-semibold">{propertyData.property.squareFootage?.toLocaleString() || "—"}</p>
                  <p className="text-xs text-muted-foreground">Sq Ft</p>
                </div>
              </div>

              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Property Type</span>
                  <span className="font-medium">{propertyData.property.propertyType || "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Year Built</span>
                  <span className="font-medium">{propertyData.property.yearBuilt || "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Lot Size</span>
                  <span className="font-medium">{propertyData.property.lotSize?.toLocaleString() || "—"} sq ft</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Owner Occupied</span>
                  <Badge variant={propertyData.property.ownerOccupied ? "default" : "secondary"}>
                    {propertyData.property.ownerOccupied ? "Yes" : "No"}
                  </Badge>
                </div>
              </div>

              {propertyData.property.features && (
                <div className="pt-2 border-t">
                  <p className="text-sm font-medium mb-2">Features</p>
                  <div className="flex flex-wrap gap-1">
                    {propertyData.property.features.pool && <Badge variant="outline">Pool</Badge>}
                    {propertyData.property.features.garage && (
                      <Badge variant="outline">Garage ({propertyData.property.features.garageSpaces})</Badge>
                    )}
                    {propertyData.property.features.fireplace && <Badge variant="outline">Fireplace</Badge>}
                    {propertyData.property.features.cooling && <Badge variant="outline">A/C</Badge>}
                    {propertyData.property.features.heating && <Badge variant="outline">Heating</Badge>}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="space-y-4">
            {propertyData.valueEstimate && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    Value Estimate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-4">
                    <p className="text-3xl font-bold text-green-600">
                      {formatCurrency(propertyData.valueEstimate.price)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Range: {formatCurrency(propertyData.valueEstimate.priceRangeLow)} -{" "}
                      {formatCurrency(propertyData.valueEstimate.priceRangeHigh)}
                    </p>
                  </div>

                  {propertyData.property.lastSalePrice && (
                    <div className="flex justify-between text-sm pt-2 border-t">
                      <span className="text-muted-foreground">Last Sale</span>
                      <span>
                        {formatCurrency(propertyData.property.lastSalePrice)}{" "}
                        <span className="text-muted-foreground">
                          ({formatDate(propertyData.property.lastSaleDate)})
                        </span>
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {propertyData.rentEstimate && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    Rent Estimate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-blue-600">
                      {formatCurrency(propertyData.rentEstimate.rent)}<span className="text-lg font-normal">/mo</span>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Range: {formatCurrency(propertyData.rentEstimate.rentRangeLow)} -{" "}
                      {formatCurrency(propertyData.rentEstimate.rentRangeHigh)}/mo
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {propertyData.property.owner && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <User className="w-5 h-5 text-purple-600" />
                    Owner Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {propertyData.property.owner.names?.map((name, i) => (
                    <p key={i} className="font-medium">{name}</p>
                  ))}
                  {propertyData.property.owner.mailingAddress && (
                    <div className="text-sm text-muted-foreground pt-2 border-t">
                      <p className="font-medium text-foreground">Mailing Address</p>
                      <p>{propertyData.property.owner.mailingAddress.addressLine1}</p>
                      <p>
                        {propertyData.property.owner.mailingAddress.city},{" "}
                        {propertyData.property.owner.mailingAddress.state}{" "}
                        {propertyData.property.owner.mailingAddress.zipCode}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {propertyData.property.taxAssessments && propertyData.property.taxAssessments.length > 0 && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-orange-600" />
                    Tax Assessment History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    {propertyData.property.taxAssessments.slice(0, 3).map((tax) => (
                      <div key={tax.year} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{tax.year}</span>
                        <span className="font-medium">{formatCurrency(tax.value)}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}

      {!propertyData && !lookupMutation.isPending && (
        <Card className="p-8 text-center">
          <Home className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <h3 className="font-semibold mb-2">Property Intelligence</h3>
          <p className="text-muted-foreground mb-4">
            Enter a residential address to get detailed property information including valuation, owner details, and more.
          </p>
          <div className="text-sm text-muted-foreground">
            <p>Powered by RentCast - 140M+ US properties</p>
          </div>
        </Card>
      )}
    </div>
  );
}
