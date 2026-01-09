import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Search, 
  MapPin, 
  Cloud, 
  Home, 
  Users, 
  AlertTriangle, 
  Thermometer,
  Droplets,
  Wind,
  TrendingUp,
  Calendar,
  Building,
  DollarSign,
  Lightbulb,
  ExternalLink,
  Wrench,
  Loader2,
  ChevronRight
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Lead } from "@shared/schema";

interface WeatherData {
  location: {
    city: string;
    state: string;
    coordinates: { lat: number; lon: number };
  };
  current: {
    temperature: number;
    feelsLike: number;
    humidity: number;
    windSpeed: number;
    conditions: string;
    icon: string;
  };
  forecast: Array<{
    date: string;
    high: number;
    low: number;
    conditions: string;
    precipChance: number;
  }>;
  alerts: Array<{
    event: string;
    headline: string;
    severity: string;
    urgency: string;
    description: string;
    instruction: string;
  }>;
  homeMaintenanceTips: string[];
}

interface CensusData {
  neighborhood: {
    totalPopulation: number;
    medianAge: number;
    medianHouseholdIncome: number;
    homeownershipRate: number;
    medianHomeValue: number;
    medianYearBuilt: number;
    averageHouseholdSize: number;
  };
  housing: {
    totalHousingUnits: number;
    occupiedUnits: number;
    vacantUnits: number;
    ownerOccupied: number;
    renterOccupied: number;
  };
  demographics: {
    educationBachelorsOrHigher: number;
    employmentRate: number;
  };
}

interface LocationData {
  address: {
    formatted: string;
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  coordinates: {
    lat: number;
    lon: number;
  };
  mapUrl: string;
}

interface PropertyReport {
  address: string;
  generatedAt: string;
  weather: WeatherData | null;
  census: CensusData | null;
  location: LocationData | null;
  serviceRecommendations: string[];
}

export default function Tools() {
  const [searchAddress, setSearchAddress] = useState("");
  const [selectedLeadId, setSelectedLeadId] = useState<number | null>(null);
  const { toast } = useToast();

  const { data: leads = [] } = useQuery<Lead[]>({
    queryKey: ["/api/leads"],
  });

  const reportMutation = useMutation({
    mutationFn: async (address: string) => {
      const response = await apiRequest("POST", "/api/property-report", { address });
      if (!response.ok) {
        throw new Error("Failed to generate report");
      }
      return response.json() as Promise<PropertyReport>;
    },
    onError: (error: Error) => {
      toast({
        title: "Report Failed",
        description: error.message || "Unable to generate property report. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSearch = () => {
    if (!searchAddress.trim()) {
      toast({
        title: "Address Required",
        description: "Please enter an address to search.",
        variant: "destructive",
      });
      return;
    }
    reportMutation.mutate(searchAddress);
  };

  const handleLeadSelect = (lead: Lead) => {
    setSelectedLeadId(lead.id);
    setSearchAddress(lead.address);
    reportMutation.mutate(lead.address);
  };

  const report = reportMutation.data;

  return (
    <div className="space-y-6" data-testid="page-tools">
      <div>
        <h1 className="text-2xl font-bold" data-testid="text-page-title">Property Intelligence Tools</h1>
        <p className="text-muted-foreground">
          Access real-time property data, weather alerts, and neighborhood insights to better serve your leads
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Property Lookup
          </CardTitle>
          <CardDescription>
            Enter an address or select from your leads to generate a comprehensive property report
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            <div className="flex-1 min-w-[280px]">
              <Input
                placeholder="Enter property address (e.g., 123 Main St, Houston, TX 77001)"
                value={searchAddress}
                onChange={(e) => setSearchAddress(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                data-testid="input-address-search"
              />
            </div>
            <Button 
              onClick={handleSearch} 
              disabled={reportMutation.isPending}
              data-testid="button-search-address"
            >
              {reportMutation.isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Search className="w-4 h-4 mr-2" />
              )}
              Generate Report
            </Button>
          </div>

          {leads.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Or select from your leads:</p>
              <div className="flex gap-2 flex-wrap">
                {leads.slice(0, 5).map((lead) => (
                  <Button
                    key={lead.id}
                    variant={selectedLeadId === lead.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleLeadSelect(lead)}
                    disabled={reportMutation.isPending}
                    data-testid={`button-lead-${lead.id}`}
                  >
                    <MapPin className="w-3 h-3 mr-1" />
                    {lead.fullName}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {reportMutation.isPending && (
        <Card>
          <CardContent className="py-8">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              <div className="text-center">
                <p className="font-medium">Generating Property Report</p>
                <p className="text-sm text-muted-foreground">
                  Fetching weather, census, and location data...
                </p>
              </div>
              <Progress value={66} className="w-64" />
            </div>
          </CardContent>
        </Card>
      )}

      {report && !reportMutation.isPending && (
        <div className="space-y-6">
          <Card className="border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/20">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                    <MapPin className="w-5 h-5" />
                    Property Report
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {report.address}
                  </CardDescription>
                </div>
                <Badge variant="outline" className="text-xs">
                  Generated {new Date(report.generatedAt).toLocaleString()}
                </Badge>
              </div>
            </CardHeader>
          </Card>

          <Tabs defaultValue="weather" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4" data-testid="tabs-report">
              <TabsTrigger value="weather" data-testid="tab-weather">
                <Cloud className="w-4 h-4 mr-2" />
                Weather
              </TabsTrigger>
              <TabsTrigger value="neighborhood" data-testid="tab-neighborhood">
                <Users className="w-4 h-4 mr-2" />
                Neighborhood
              </TabsTrigger>
              <TabsTrigger value="location" data-testid="tab-location">
                <MapPin className="w-4 h-4 mr-2" />
                Location
              </TabsTrigger>
              <TabsTrigger value="recommendations" data-testid="tab-recommendations">
                <Lightbulb className="w-4 h-4 mr-2" />
                Services
              </TabsTrigger>
            </TabsList>

            <TabsContent value="weather" className="space-y-4">
              {report.weather ? (
                <>
                  <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                          <Thermometer className="w-8 h-8 text-orange-500" />
                          <div>
                            <p className="text-3xl font-bold">{Math.round(report.weather.current.temperature)}°F</p>
                            <p className="text-sm text-muted-foreground">
                              Feels like {Math.round(report.weather.current.feelsLike)}°F
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                          <Droplets className="w-8 h-8 text-blue-500" />
                          <div>
                            <p className="text-3xl font-bold">{report.weather.current.humidity}%</p>
                            <p className="text-sm text-muted-foreground">Humidity</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                          <Wind className="w-8 h-8 text-gray-500" />
                          <div>
                            <p className="text-3xl font-bold">{Math.round(report.weather.current.windSpeed)}</p>
                            <p className="text-sm text-muted-foreground">mph Wind</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                          <Cloud className="w-8 h-8 text-sky-500" />
                          <div>
                            <p className="text-lg font-semibold truncate">{report.weather.current.conditions}</p>
                            <p className="text-sm text-muted-foreground">Conditions</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {report.weather.alerts.length > 0 && (
                    <Card className="border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20">
                      <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2 text-amber-700 dark:text-amber-300">
                          <AlertTriangle className="w-5 h-5" />
                          Active Weather Alerts ({report.weather.alerts.length})
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {report.weather.alerts.map((alert, i) => (
                          <div key={i} className="p-3 bg-amber-100/50 dark:bg-amber-900/30 rounded-md">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge 
                                variant={alert.severity === "Extreme" || alert.severity === "Severe" ? "destructive" : "secondary"}
                              >
                                {alert.severity}
                              </Badge>
                              <span className="font-medium">{alert.event}</span>
                            </div>
                            <p className="text-sm text-muted-foreground">{alert.headline}</p>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  )}

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="w-5 h-5" />
                        7-Day Forecast
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-2 md:grid-cols-7">
                        {report.weather.forecast.slice(0, 7).map((day, i) => (
                          <div key={i} className="text-center p-3 rounded-md bg-muted/50">
                            <p className="text-sm font-medium">
                              {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                            </p>
                            <p className="text-lg font-bold mt-1">
                              {day.high ? `${Math.round(day.high)}°` : "--"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {day.low ? `${Math.round(day.low)}°` : "--"}
                            </p>
                            <p className="text-xs mt-1 truncate">{day.conditions}</p>
                            {day.precipChance > 0 && (
                              <Badge variant="outline" className="mt-1">
                                <Droplets className="w-3 h-3 mr-1" />
                                {day.precipChance}%
                              </Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {report.weather.homeMaintenanceTips.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Wrench className="w-5 h-5" />
                          Weather-Based Maintenance Tips
                        </CardTitle>
                        <CardDescription>
                          Recommendations based on current and forecasted conditions
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {report.weather.homeMaintenanceTips.map((tip, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <ChevronRight className="w-4 h-4 mt-0.5 text-blue-500 shrink-0" />
                              <span className="text-sm">{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}
                </>
              ) : (
                <Card>
                  <CardContent className="py-8 text-center text-muted-foreground">
                    <Cloud className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Weather data unavailable for this location</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="neighborhood" className="space-y-4">
              {report.census && report.census.neighborhood.totalPopulation > 0 ? (
                <>
                  <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          Population
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-2xl font-bold">
                          {report.census.neighborhood.totalPopulation.toLocaleString()}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Avg. household size: {report.census.neighborhood.averageHouseholdSize.toFixed(1)}
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <DollarSign className="w-4 h-4" />
                          Median Income
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-2xl font-bold">
                          ${report.census.neighborhood.medianHouseholdIncome.toLocaleString()}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Median age: {report.census.neighborhood.medianAge} years
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <Home className="w-4 h-4" />
                          Home Values
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-2xl font-bold">
                          ${report.census.neighborhood.medianHomeValue.toLocaleString()}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Median year built: {report.census.neighborhood.medianYearBuilt || "N/A"}
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Building className="w-5 h-5" />
                        Housing Statistics
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm">Homeownership Rate</span>
                            <span className="text-sm font-medium">
                              {report.census.neighborhood.homeownershipRate}%
                            </span>
                          </div>
                          <Progress value={report.census.neighborhood.homeownershipRate} />
                        </div>
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm">Occupancy Rate</span>
                            <span className="text-sm font-medium">
                              {report.census.housing.totalHousingUnits > 0 
                                ? Math.round((report.census.housing.occupiedUnits / report.census.housing.totalHousingUnits) * 100)
                                : 0}%
                            </span>
                          </div>
                          <Progress 
                            value={report.census.housing.totalHousingUnits > 0 
                              ? (report.census.housing.occupiedUnits / report.census.housing.totalHousingUnits) * 100
                              : 0
                            } 
                          />
                        </div>
                      </div>

                      <div className="grid gap-4 md:grid-cols-4 pt-4 border-t">
                        <div className="text-center">
                          <p className="text-2xl font-bold">{report.census.housing.totalHousingUnits.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">Total Units</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold">{report.census.housing.ownerOccupied.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">Owner Occupied</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold">{report.census.housing.renterOccupied.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">Renter Occupied</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold">{report.census.housing.vacantUnits.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">Vacant</p>
                        </div>
                      </div>

                      {report.census.demographics && (report.census.demographics.educationBachelorsOrHigher > 0 || report.census.demographics.employmentRate > 0) && (
                        <div className="grid gap-4 md:grid-cols-2 pt-4 border-t">
                          <div>
                            <div className="flex justify-between mb-2">
                              <span className="text-sm">College Educated (Bachelor's+)</span>
                              <span className="text-sm font-medium">
                                {report.census.demographics.educationBachelorsOrHigher}%
                              </span>
                            </div>
                            <Progress value={report.census.demographics.educationBachelorsOrHigher} />
                          </div>
                          <div>
                            <div className="flex justify-between mb-2">
                              <span className="text-sm">Employment Rate</span>
                              <span className="text-sm font-medium">
                                {report.census.demographics.employmentRate}%
                              </span>
                            </div>
                            <Progress value={report.census.demographics.employmentRate} />
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </>
              ) : (
                <Card>
                  <CardContent className="py-8 text-center text-muted-foreground">
                    <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Census data unavailable for this location</p>
                    <p className="text-sm mt-1">This may be outside US census coverage areas</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="location" className="space-y-4">
              {report.location ? (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="w-5 h-5" />
                        Location Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <p className="text-sm text-muted-foreground">Street Address</p>
                          <p className="font-medium">{report.location.address.street || "N/A"}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">City</p>
                          <p className="font-medium">{report.location.address.city || "N/A"}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">State</p>
                          <p className="font-medium">{report.location.address.state || "N/A"}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Coordinates</p>
                          <p className="font-medium">
                            {report.location.coordinates.lat.toFixed(4)}, {report.location.coordinates.lon.toFixed(4)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t">
                        <Button variant="outline" asChild>
                          <a 
                            href={report.location.mapUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            data-testid="link-open-map"
                          >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            View on OpenStreetMap
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-0">
                      <iframe
                        title="Property Location Map"
                        width="100%"
                        height="300"
                        style={{ border: 0, borderRadius: "0.5rem" }}
                        loading="lazy"
                        src={`https://www.openstreetmap.org/export/embed.html?bbox=${report.location.coordinates.lon - 0.01},${report.location.coordinates.lat - 0.01},${report.location.coordinates.lon + 0.01},${report.location.coordinates.lat + 0.01}&layer=mapnik&marker=${report.location.coordinates.lat},${report.location.coordinates.lon}`}
                      />
                    </CardContent>
                  </Card>
                </>
              ) : (
                <Card>
                  <CardContent className="py-8 text-center text-muted-foreground">
                    <MapPin className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Location data unavailable</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="recommendations" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="w-5 h-5" />
                    Recommended Services
                  </CardTitle>
                  <CardDescription>
                    Based on weather conditions, home age, and neighborhood data
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3 md:grid-cols-2">
                    {report.serviceRecommendations.map((rec, i) => (
                      <div 
                        key={i} 
                        className="flex items-center gap-3 p-3 rounded-md bg-muted/50 hover-elevate cursor-pointer"
                        data-testid={`recommendation-${i}`}
                      >
                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                          <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <span className="font-medium">{rec}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Using This Data</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                  <p>
                    <strong className="text-foreground">Weather alerts</strong> help identify urgent needs like storm preparation or HVAC service.
                  </p>
                  <p>
                    <strong className="text-foreground">Home age data</strong> from census info helps recommend appropriate maintenance and upgrades.
                  </p>
                  <p>
                    <strong className="text-foreground">Neighborhood income</strong> levels help tailor service recommendations appropriately.
                  </p>
                  <p>
                    <strong className="text-foreground">Homeownership rates</strong> indicate areas with more potential customers for home services.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}

      {!report && !reportMutation.isPending && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Cloud className="w-5 h-5 text-blue-500" />
                Weather Intelligence
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Real-time weather data, alerts, and forecasts from NOAA and Open-Meteo. 
              Get maintenance tips based on current conditions.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="w-5 h-5 text-green-500" />
                Neighborhood Data
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Census Bureau statistics including median income, home values, 
              ownership rates, and housing characteristics.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <MapPin className="w-5 h-5 text-red-500" />
                Location Mapping
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              OpenStreetMap integration for precise geocoding, 
              mapping, and location visualization.
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
