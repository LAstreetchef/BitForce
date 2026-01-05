import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Search, 
  Filter,
  Phone,
  Mail,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Plus
} from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

const leads = [
  { 
    id: 1,
    name: "John Martinez", 
    email: "john.m@email.com",
    phone: "(555) 123-4567",
    address: "123 Oak Street, Atlanta, GA",
    services: ["Roofing", "Gutters"],
    status: "qualified",
    date: "2 hours ago",
    value: "$3,200"
  },
  { 
    id: 2,
    name: "Sarah Kim", 
    email: "sarah.k@email.com",
    phone: "(555) 234-5678",
    address: "456 Maple Ave, Houston, TX",
    services: ["AI Assistant", "Document Digitizing"],
    status: "contacted",
    date: "Yesterday",
    value: "$600"
  },
  { 
    id: 3,
    name: "Mike Roberts", 
    email: "mike.r@email.com",
    phone: "(555) 345-6789",
    address: "789 Pine Road, Phoenix, AZ",
    services: ["Home Financing"],
    status: "pending",
    date: "2 days ago",
    value: "$5,000"
  },
  { 
    id: 4,
    name: "Lisa Thompson", 
    email: "lisa.t@email.com",
    phone: "(555) 456-7890",
    address: "321 Elm Street, Denver, CO",
    services: ["Driveway Paving"],
    status: "closed",
    date: "3 days ago",
    value: "$2,500"
  },
  { 
    id: 5,
    name: "David Wilson", 
    email: "david.w@email.com",
    phone: "(555) 567-8901",
    address: "654 Cedar Lane, Seattle, WA",
    services: ["Plumbing", "Roofing"],
    status: "lost",
    date: "5 days ago",
    value: "$4,100"
  },
];

const statusConfig: Record<string, { label: string; color: string; icon: typeof CheckCircle }> = {
  qualified: { label: "Qualified", color: "bg-blue-100 text-blue-800", icon: CheckCircle },
  contacted: { label: "Contacted", color: "bg-purple-100 text-purple-800", icon: Phone },
  pending: { label: "Pending", color: "bg-amber-100 text-amber-800", icon: Clock },
  closed: { label: "Closed Won", color: "bg-green-100 text-green-800", icon: CheckCircle },
  lost: { label: "Lost", color: "bg-red-100 text-red-800", icon: XCircle },
};

export default function Leads() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          lead.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6" data-testid="page-leads">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold" data-testid="text-page-title">Lead Management</h1>
          <p className="text-muted-foreground">Track and manage your customer leads</p>
        </div>
        <Link href="/">
          <Button data-testid="button-new-lead">
            <Plus className="w-4 h-4 mr-2" />
            New Lead
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4 flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search leads..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
                data-testid="input-search-leads"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[160px]" data-testid="select-status-filter">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="qualified">Qualified</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="closed">Closed Won</SelectItem>
                <SelectItem value="lost">Lost</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredLeads.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No leads found matching your criteria</p>
              </div>
            ) : (
              filteredLeads.map((lead) => {
                const status = statusConfig[lead.status];
                const StatusIcon = status.icon;
                return (
                  <Card key={lead.id} className="p-4" data-testid={`lead-${lead.id}`}>
                    <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-3 flex-wrap">
                          <h3 className="font-semibold text-lg">{lead.name}</h3>
                          <Badge className={status.color}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {status.label}
                          </Badge>
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
                          {lead.services.map((service) => (
                            <Badge key={service} variant="outline" className="text-xs">
                              {service}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-4 lg:flex-col lg:items-end">
                        <div className="text-right">
                          <div className="font-bold text-green-600 text-lg">{lead.value}</div>
                          <div className="text-xs text-muted-foreground">{lead.date}</div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" data-testid={`button-call-${lead.id}`}>
                            <Phone className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline" data-testid={`button-email-${lead.id}`}>
                            <Mail className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
