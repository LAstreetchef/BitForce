import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Users,
  Search,
  MapPin,
  User,
  Calendar,
  Phone,
  Home,
  AlertTriangle,
  CheckCircle,
  Loader2,
  ChevronDown,
  ChevronUp,
  Shield,
  Info,
  FileText,
  UserPlus,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PersonResult {
  id: string;
  name: {
    first: string;
    middle?: string;
    last: string;
  };
  age?: number;
  ageRange?: string;
  locations: Array<{
    city: string;
    state: string;
    zip?: string;
    address?: string;
    isCurrent: boolean;
  }>;
  phones: Array<{
    number: string;
    type: string;
    isCurrent: boolean;
  }>;
  relatives: Array<{
    name: string;
    relation?: string;
  }>;
  confidence: number;
  confidenceLabel: string;
  sources: string[];
}

interface SearchResult {
  status: "found" | "not_found" | "error";
  matchCount: number;
  results: PersonResult[];
  message?: string;
}

interface OldFriendFinderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function OldFriendFinderModal({ open, onOpenChange }: OldFriendFinderModalProps) {
  const { toast } = useToast();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [age, setAge] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchProgress, setSearchProgress] = useState(0);
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [consentChecked, setConsentChecked] = useState(false);
  const [ageVerified, setAgeVerified] = useState(false);

  const resetState = () => {
    setFirstName("");
    setLastName("");
    setCity("");
    setState("");
    setAge("");
    setShowAdvanced(false);
    setSearchResult(null);
    setSearchProgress(0);
    setConsentChecked(false);
    setAgeVerified(false);
  };

  const handleSearch = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      toast({
        title: "Name required",
        description: "Please enter at least a first and last name.",
        variant: "destructive",
      });
      return;
    }

    if (!consentChecked) {
      toast({
        title: "Consent required",
        description: "Please agree to the terms of use before searching.",
        variant: "destructive",
      });
      return;
    }

    if (!ageVerified) {
      toast({
        title: "Age verification required",
        description: "You must be 18 or older to use this service.",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    setSearchProgress(0);
    setSearchResult(null);

    const progressInterval = setInterval(() => {
      setSearchProgress((prev) => Math.min(prev + 8, 90));
    }, 300);

    try {
      const response = await fetch("/api/person-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          city: city.trim() || undefined,
          state: state.trim() || undefined,
          age: age ? parseInt(age) : undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Search failed");
      }

      const data = await response.json();
      setSearchProgress(100);
      setSearchResult(data);
    } catch (error: any) {
      toast({
        title: "Search failed",
        description: error.message || "Unable to complete the search. Please try again.",
        variant: "destructive",
      });
    } finally {
      clearInterval(progressInterval);
      setIsSearching(false);
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return "bg-green-500";
    if (confidence >= 70) return "bg-emerald-500";
    if (confidence >= 50) return "bg-yellow-500";
    if (confidence >= 30) return "bg-orange-500";
    return "bg-red-500";
  };

  const getConfidenceBadgeColor = (confidence: number) => {
    if (confidence >= 90) return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
    if (confidence >= 70) return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300";
    if (confidence >= 50) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
    if (confidence >= 30) return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300";
    return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) resetState();
      onOpenChange(isOpen);
    }}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="w-6 h-6 text-primary" />
            Old Friend & Family Finder
          </DialogTitle>
          <DialogDescription>
            Reconnect with people from your past using public records search
          </DialogDescription>
        </DialogHeader>

        {!searchResult ? (
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  placeholder="John"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  disabled={isSearching}
                  data-testid="input-first-name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  placeholder="Smith"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  disabled={isSearching}
                  data-testid="input-last-name"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="city">City (optional)</Label>
                <Input
                  id="city"
                  placeholder="Houston"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  disabled={isSearching}
                  data-testid="input-city"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State (optional)</Label>
                <Input
                  id="state"
                  placeholder="TX"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  disabled={isSearching}
                  maxLength={2}
                  data-testid="input-state"
                />
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="w-full"
              onClick={() => setShowAdvanced(!showAdvanced)}
              data-testid="button-toggle-advanced"
            >
              {showAdvanced ? (
                <>
                  <ChevronUp className="w-4 h-4 mr-2" />
                  Hide Advanced Options
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4 mr-2" />
                  Show Advanced Options
                </>
              )}
            </Button>

            {showAdvanced && (
              <div className="space-y-4 p-4 bg-muted/50 rounded-md">
                <div className="space-y-2">
                  <Label htmlFor="age">Approximate Age (optional)</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="45"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    disabled={isSearching}
                    min={18}
                    max={120}
                    data-testid="input-age"
                  />
                  <p className="text-xs text-muted-foreground">
                    Helps narrow down results when there are multiple matches
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-3 p-4 bg-accent/30 dark:bg-accent/10 rounded-md">
              <div className="flex items-start gap-3">
                <Checkbox
                  id="consent"
                  checked={consentChecked}
                  onCheckedChange={(checked) => setConsentChecked(checked === true)}
                  data-testid="checkbox-consent"
                />
                <Label htmlFor="consent" className="text-sm leading-relaxed cursor-pointer">
                  I agree to use this service only for permissible purposes, including locating 
                  friends, family, or colleagues I have a prior relationship with. I will not use 
                  this information for harassment, stalking, or any illegal purpose.
                </Label>
              </div>
              <div className="flex items-start gap-3">
                <Checkbox
                  id="ageVerify"
                  checked={ageVerified}
                  onCheckedChange={(checked) => setAgeVerified(checked === true)}
                  data-testid="checkbox-age-verify"
                />
                <Label htmlFor="ageVerify" className="text-sm cursor-pointer">
                  I confirm that I am 18 years of age or older.
                </Label>
              </div>
            </div>

            {isSearching && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Searching public records...</span>
                  <span>{searchProgress}%</span>
                </div>
                <Progress value={searchProgress} />
              </div>
            )}

            <Button
              className="w-full"
              onClick={handleSearch}
              disabled={isSearching || !firstName || !lastName || !consentChecked || !ageVerified}
              data-testid="button-search-person"
            >
              {isSearching ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Search className="w-4 h-4 mr-2" />
              )}
              Search for Person
            </Button>

            <div className="flex items-start gap-2 text-xs text-muted-foreground bg-accent/50 dark:bg-accent/20 p-3 rounded-md">
              <Shield className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                This tool searches publicly available records. Results may contain inaccuracies - 
                always verify through multiple sources. We do not store your searches.
              </span>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 rounded-lg bg-accent/30 dark:bg-accent/10">
              {searchResult.status === "found" ? (
                <CheckCircle className="w-10 h-10 text-green-500" />
              ) : (
                <AlertTriangle className="w-10 h-10 text-yellow-500" />
              )}
              <div className="flex-1">
                <h3 className="font-semibold text-lg">
                  {searchResult.status === "found"
                    ? `Found ${searchResult.matchCount} potential match${searchResult.matchCount !== 1 ? "es" : ""}`
                    : "No matches found"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {searchResult.status === "found"
                    ? "Review the results below to find your connection"
                    : "Try adjusting your search criteria"}
                </p>
              </div>
            </div>

            {searchResult.results.length > 0 && (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {searchResult.results.map((person, index) => (
                  <Card key={person.id || index} data-testid={`card-result-${index}`}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-semibold">
                              {person.name.first} {person.name.middle ? `${person.name.middle} ` : ""}{person.name.last}
                            </h4>
                            {person.age && (
                              <p className="text-sm text-muted-foreground flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                Age: {person.age}
                              </p>
                            )}
                            {person.ageRange && !person.age && (
                              <p className="text-sm text-muted-foreground flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                Age range: {person.ageRange}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className={getConfidenceBadgeColor(person.confidence)}>
                            {person.confidence}% Match
                          </Badge>
                          <p className="text-xs text-muted-foreground mt-1">
                            {person.confidenceLabel}
                          </p>
                        </div>
                      </div>

                      <div className="mt-3 space-y-2">
                        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${getConfidenceColor(person.confidence)} transition-all`}
                            style={{ width: `${person.confidence}%` }}
                          />
                        </div>
                      </div>

                      {person.locations.length > 0 && (
                        <div className="mt-3">
                          <p className="text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            Locations
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {person.locations.slice(0, 3).map((loc, i) => (
                              <Badge key={i} variant="outline" className="text-xs">
                                {loc.city}, {loc.state}
                                {loc.isCurrent && " (Current)"}
                              </Badge>
                            ))}
                            {person.locations.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{person.locations.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}

                      {person.phones.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            Phone Numbers
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {person.phones.slice(0, 2).map((phone, i) => (
                              <Badge key={i} variant="secondary" className="text-xs">
                                {phone.number} ({phone.type})
                              </Badge>
                            ))}
                            {person.phones.length > 2 && (
                              <Badge variant="secondary" className="text-xs">
                                +{person.phones.length - 2} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}

                      {person.relatives.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1">
                            <UserPlus className="w-3 h-3" />
                            Known Associates
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {person.relatives.slice(0, 3).map((rel, i) => (
                              <Badge key={i} variant="outline" className="text-xs">
                                {rel.name}
                              </Badge>
                            ))}
                            {person.relatives.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{person.relatives.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}

                      {person.sources.length > 0 && (
                        <div className="mt-3 pt-2 border-t">
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <FileText className="w-3 h-3" />
                            Sources: {person.sources.join(", ")}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 border-primary/20">
              <CardContent className="p-4">
                <h4 className="font-semibold flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Need More Detailed Information?
                </h4>
                <p className="text-sm text-muted-foreground mt-1 mb-3">
                  Upgrade to get full contact details, complete address history, and additional family connections.
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                  <Button size="sm" data-testid="button-upgrade-search">
                    Upgrade for Full Report
                  </Button>
                  <span className="text-xs text-muted-foreground">Starting at $4.99</span>
                </div>
              </CardContent>
            </Card>

            <div className="flex items-start gap-2 text-xs text-muted-foreground p-3 rounded-md border">
              <Info className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                <strong>Disclaimer:</strong> Results may contain inaccuracies. This information comes from 
                publicly available sources and should be verified independently. If you believe any information 
                is incorrect, please contact us.
              </span>
            </div>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                setSearchResult(null);
                setFirstName("");
                setLastName("");
                setCity("");
                setState("");
                setAge("");
              }}
              data-testid="button-search-again"
            >
              <Search className="w-4 h-4 mr-2" />
              Search for Another Person
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
