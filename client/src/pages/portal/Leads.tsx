import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Phone,
  Mail,
  MapPin,
  AlertCircle,
  Plus,
  ChevronDown,
  ChevronUp,
  Loader2,
  Sparkles,
  ClipboardList,
  Wand2,
  Users,
  FileText
} from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import LocalSolutions from "@/components/LocalSolutions";
import LeadServicesManager from "@/components/LeadServicesManager";
import { DesignVisualization } from "@/components/DesignVisualization";
import ContactManager from "@/components/ContactManager";
import type { Lead } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";

export default function Leads() {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedLeadId, setExpandedLeadId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("leads");
  const queryClient = useQueryClient();

  const { data: leads = [], isLoading, isError } = useQuery<Lead[]>({
    queryKey: ["/api/leads"],
  });

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          lead.interests.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="space-y-6" data-testid="page-leads">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold" data-testid="text-page-title">
            {activeTab === "leads" ? "Lead Management" : "Contact Network"}
          </h1>
          <p className="text-muted-foreground">
            {activeTab === "leads" 
              ? "Track and manage your customer leads" 
              : "Import and invite contacts to join Bitforce"}
          </p>
        </div>
        {activeTab === "leads" && (
          <Link href="/portal/leads/new">
            <Button data-testid="button-new-lead">
              <Plus className="w-4 h-4 mr-2" />
              New Lead
            </Button>
          </Link>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="leads" data-testid="tab-leads">
            <FileText className="w-4 h-4 mr-2" />
            Customer Leads
          </TabsTrigger>
          <TabsTrigger value="contacts" data-testid="tab-contacts">
            <Users className="w-4 h-4 mr-2" />
            My Contacts
          </TabsTrigger>
        </TabsList>

        <TabsContent value="contacts">
          <ContactManager />
        </TabsContent>

        <TabsContent value="leads">

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4 flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search leads by name, email, or interest..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
                data-testid="input-search-leads"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">
                <Loader2 className="w-8 h-8 mx-auto mb-2 animate-spin" />
                <p>Loading leads...</p>
              </div>
            ) : isError ? (
              <div className="text-center py-8 text-muted-foreground">
                <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>Failed to load leads. Please try again.</p>
              </div>
            ) : filteredLeads.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>{leads.length === 0 ? "No leads yet. Create your first lead!" : "No leads found matching your search."}</p>
              </div>
            ) : (
              filteredLeads.map((lead) => {
                const isExpanded = expandedLeadId === lead.id;
                const services = lead.interests.split(",").map(s => s.trim()).filter(Boolean);
                const dateStr = lead.createdAt 
                  ? formatDistanceToNow(new Date(lead.createdAt), { addSuffix: true })
                  : "Recently";
                return (
                  <Card key={lead.id} className="p-4" data-testid={`lead-${lead.id}`}>
                    <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-3 flex-wrap">
                          <h3 className="font-semibold text-lg">{lead.fullName}</h3>
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {lead.email}
                          </span>
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {lead.phone}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {lead.address}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {services.map((service) => (
                            <Badge key={service} variant="outline" className="text-xs">
                              {service}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-4 lg:flex-col lg:items-end">
                        <div className="text-right">
                          <div className="text-xs text-muted-foreground">{dateStr}</div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" data-testid={`button-call-${lead.id}`}>
                            <Phone className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline" data-testid={`button-email-${lead.id}`}>
                            <Mail className="w-4 h-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => setExpandedLeadId(isExpanded ? null : lead.id)}
                            data-testid={`button-solutions-${lead.id}`}
                          >
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t">
                        <Tabs defaultValue="services" className="w-full">
                          <TabsList className="mb-4">
                            <TabsTrigger value="services" data-testid={`tab-services-${lead.id}`}>
                              <ClipboardList className="w-4 h-4 mr-2" />
                              My Services
                            </TabsTrigger>
                            <TabsTrigger value="recommendations" data-testid={`tab-recommendations-${lead.id}`}>
                              <Sparkles className="w-4 h-4 mr-2" />
                              Recommendations
                            </TabsTrigger>
                            <TabsTrigger value="design" data-testid={`tab-design-${lead.id}`}>
                              <Wand2 className="w-4 h-4 mr-2" />
                              AI Design
                            </TabsTrigger>
                          </TabsList>
                          <TabsContent value="services">
                            <LeadServicesManager 
                              leadId={lead.id} 
                              onRecommendationsRefresh={() => {
                                queryClient.invalidateQueries({ queryKey: ["/api/recommendations"] });
                              }}
                            />
                          </TabsContent>
                          <TabsContent value="recommendations">
                            <LocalSolutions interests={lead.interests} />
                          </TabsContent>
                          <TabsContent value="design">
                            <DesignVisualization 
                              leadId={lead.id} 
                              leadName={lead.fullName}
                              onDesignGenerated={() => {
                                queryClient.invalidateQueries({ queryKey: ["/api/gamification/stats"] });
                              }}
                            />
                          </TabsContent>
                        </Tabs>
                      </div>
                    )}
                  </Card>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
