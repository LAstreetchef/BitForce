import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import {
  Upload,
  Plus,
  Trash2,
  Mail,
  UserPlus,
  Sparkles,
  Loader2,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Users,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Contact {
  id: number;
  fullName: string;
  email: string;
  phone?: string;
  notes?: string;
  emailSentType?: string;
  emailSentAt?: string;
  createdAt?: string;
}

interface CSVPreviewRow {
  fullName: string;
  email: string;
  phone?: string;
  notes?: string;
  valid: boolean;
  error?: string;
}

export default function ContactManager() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [csvDialogOpen, setCsvDialogOpen] = useState(false);
  const [csvPreview, setCsvPreview] = useState<CSVPreviewRow[]>([]);
  const [newContact, setNewContact] = useState({ fullName: "", email: "", phone: "", notes: "" });

  const { data: contacts = [], isLoading } = useQuery<Contact[]>({
    queryKey: ["/api/ambassador/contacts"],
  });

  const createContactMutation = useMutation({
    mutationFn: async (contact: typeof newContact) => {
      const response = await apiRequest("POST", "/api/ambassador/contacts", contact);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/ambassador/contacts"] });
      setNewContact({ fullName: "", email: "", phone: "", notes: "" });
      setAddDialogOpen(false);
      toast({ title: "Contact added successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Failed to add contact", description: error.message, variant: "destructive" });
    },
  });

  const bulkImportMutation = useMutation({
    mutationFn: async (contactsData: typeof csvPreview) => {
      const validContacts = contactsData.filter(c => c.valid).map(({ valid, error, ...c }) => c);
      const response = await apiRequest("POST", "/api/ambassador/contacts/bulk", { contacts: validContacts });
      return response.json() as Promise<{ imported: number; errors?: any[] }>;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/ambassador/contacts"] });
      setCsvPreview([]);
      setCsvDialogOpen(false);
      toast({ 
        title: `Imported ${data.imported} contacts`,
        description: data.errors?.length ? `${data.errors.length} rows had errors` : undefined
      });
    },
    onError: (error: Error) => {
      toast({ title: "Failed to import contacts", description: error.message, variant: "destructive" });
    },
  });

  const deleteContactMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("DELETE", `/api/ambassador/contacts/${id}`);
      return response.json() as Promise<{ success: boolean }>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/ambassador/contacts"] });
      toast({ title: "Contact deleted" });
    },
    onError: (error: Error) => {
      toast({ title: "Failed to delete contact", description: error.message, variant: "destructive" });
    },
  });

  const sendEmailsMutation = useMutation({
    mutationFn: async ({ contactIds, emailType }: { contactIds: number[]; emailType: string }) => {
      const response = await apiRequest("POST", "/api/ambassador/contacts/send-email", { contactIds, emailType });
      return response.json() as Promise<{ sent: number; message: string; results: any[] }>;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/ambassador/contacts"] });
      setSelectedIds(new Set());
      const failedCount = data.results?.filter((r: any) => !r.success).length || 0;
      if (failedCount > 0) {
        toast({ 
          title: data.message,
          description: `${failedCount} email(s) could not be sent`,
          variant: "default"
        });
      } else {
        toast({ title: data.message });
      }
    },
    onError: (error: Error) => {
      toast({ title: "Failed to send emails", description: error.message, variant: "destructive" });
    },
  });

  const parseCSVLine = (line: string): string[] => {
    const result: string[] = [];
    let current = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === "," && !inQuotes) {
        result.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }
    result.push(current.trim());
    return result;
  };

  const parseCSV = (text: string): CSVPreviewRow[] => {
    const lines = text.trim().split(/\r?\n/);
    if (lines.length < 2) return [];
    
    const headers = parseCSVLine(lines[0]).map(h => h.toLowerCase().replace(/['"]/g, "").trim());
    
    const nameIdx = headers.findIndex(h => 
      h === "name" || h === "full name" || h === "fullname" || h === "full_name" || h.includes("name")
    );
    const emailIdx = headers.findIndex(h => 
      h === "email" || h === "e-mail" || h === "email address" || h === "email_address"
    );
    const phoneIdx = headers.findIndex(h => 
      h === "phone" || h === "telephone" || h === "tel" || h === "mobile" || h === "cell" || h.includes("phone")
    );
    const notesIdx = headers.findIndex(h => 
      h === "notes" || h === "note" || h === "comment" || h === "comments"
    );

    if (nameIdx === -1 || emailIdx === -1) {
      return [{ fullName: "", email: "", valid: false, error: "CSV must have 'name' and 'email' columns" }];
    }

    return lines.slice(1).filter(line => line.trim()).map(line => {
      const values = parseCSVLine(line);
      const fullName = (values[nameIdx] || "").replace(/^['"]+|['"]+$/g, "");
      const email = (values[emailIdx] || "").replace(/^['"]+|['"]+$/g, "");
      const phone = phoneIdx >= 0 ? (values[phoneIdx] || "").replace(/^['"]+|['"]+$/g, "") : "";
      const notes = notesIdx >= 0 ? (values[notesIdx] || "").replace(/^['"]+|['"]+$/g, "") : "";

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const valid = fullName.length > 0 && emailRegex.test(email);
      const error = !fullName ? "Missing name" : !emailRegex.test(email) ? "Invalid email" : undefined;

      return { fullName, email, phone, notes, valid, error };
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const parsed = parseCSV(text);
      setCsvPreview(parsed);
      setCsvDialogOpen(true);
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === contacts.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(contacts.map(c => c.id)));
    }
  };

  const toggleSelect = (id: number) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedIds(newSet);
  };

  const validPreviewCount = csvPreview.filter(r => r.valid).length;

  return (
    <Card data-testid="card-contact-manager">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              My Contacts
            </CardTitle>
            <CardDescription>
              Upload your personal network to invite them as ambassadors or customers
            </CardDescription>
          </div>
          <div className="flex gap-2 flex-wrap">
            <input
              type="file"
              accept=".csv"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
              data-testid="input-csv-upload"
            />
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              data-testid="button-upload-csv"
            >
              <FileSpreadsheet className="w-4 h-4 mr-2" />
              Import CSV
            </Button>
            <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
              <DialogTrigger asChild>
                <Button data-testid="button-add-contact">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Contact
                </Button>
              </DialogTrigger>
              <DialogContent data-testid="dialog-add-contact">
                <DialogHeader>
                  <DialogTitle>Add New Contact</DialogTitle>
                  <DialogDescription>Add someone from your personal network</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      value={newContact.fullName}
                      onChange={(e) => setNewContact({ ...newContact, fullName: e.target.value })}
                      placeholder="John Smith"
                      data-testid="input-contact-name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newContact.email}
                      onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                      placeholder="john@example.com"
                      data-testid="input-contact-email"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={newContact.phone}
                      onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                      placeholder="(555) 123-4567"
                      data-testid="input-contact-phone"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      value={newContact.notes}
                      onChange={(e) => setNewContact({ ...newContact, notes: e.target.value })}
                      placeholder="How do you know this person?"
                      data-testid="input-contact-notes"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    onClick={() => createContactMutation.mutate(newContact)}
                    disabled={!newContact.fullName || !newContact.email || createContactMutation.isPending}
                    data-testid="button-save-contact"
                  >
                    {createContactMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Save Contact
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {selectedIds.size > 0 && (
          <div className="flex items-center gap-3 p-3 mb-4 bg-muted rounded-md flex-wrap" data-testid="selection-actions">
            <span className="text-sm font-medium">{selectedIds.size} selected</span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => sendEmailsMutation.mutate({ contactIds: Array.from(selectedIds), emailType: "ambassador_invite" })}
              disabled={sendEmailsMutation.isPending}
              data-testid="button-invite-ambassadors"
            >
              {sendEmailsMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <UserPlus className="w-4 h-4 mr-2" />}
              Invite as Ambassadors
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => sendEmailsMutation.mutate({ contactIds: Array.from(selectedIds), emailType: "customer_invite" })}
              disabled={sendEmailsMutation.isPending}
              data-testid="button-invite-customers"
            >
              {sendEmailsMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
              Invite as Customers
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setSelectedIds(new Set())}
              data-testid="button-clear-selection"
            >
              Clear
            </Button>
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">
            <Loader2 className="w-8 h-8 mx-auto mb-2 animate-spin" />
            <p>Loading contacts...</p>
          </div>
        ) : contacts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="mb-4">No contacts yet. Import a CSV or add contacts manually.</p>
            <div className="flex justify-center gap-2">
              <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                <Upload className="w-4 h-4 mr-2" />
                Import CSV
              </Button>
              <Button onClick={() => setAddDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Contact
              </Button>
            </div>
          </div>
        ) : (
          <div className="border rounded-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedIds.size === contacts.length && contacts.length > 0}
                      onCheckedChange={toggleSelectAll}
                      data-testid="checkbox-select-all"
                    />
                  </TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contacts.map((contact) => (
                  <TableRow key={contact.id} data-testid={`contact-row-${contact.id}`}>
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.has(contact.id)}
                        onCheckedChange={() => toggleSelect(contact.id)}
                        data-testid={`checkbox-contact-${contact.id}`}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{contact.fullName}</TableCell>
                    <TableCell className="text-muted-foreground">{contact.email}</TableCell>
                    <TableCell className="text-muted-foreground">{contact.phone || "-"}</TableCell>
                    <TableCell>
                      {contact.emailSentType ? (
                        <Badge variant="secondary" className="text-xs">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          {contact.emailSentType === "ambassador_invite" ? "Ambassador Invite" : "Customer Invite"}
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-xs">Not contacted</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => deleteContactMutation.mutate(contact.id)}
                        disabled={deleteContactMutation.isPending}
                        data-testid={`button-delete-contact-${contact.id}`}
                      >
                        <Trash2 className="w-4 h-4 text-muted-foreground" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        <Dialog open={csvDialogOpen} onOpenChange={setCsvDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col" data-testid="dialog-csv-preview">
            <DialogHeader>
              <DialogTitle>Import Contacts from CSV</DialogTitle>
              <DialogDescription>
                {csvPreview.length > 0 && (
                  <>Found {csvPreview.length} rows, {validPreviewCount} valid</>
                )}
              </DialogDescription>
            </DialogHeader>
            <div className="flex-1 overflow-auto border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12"></TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {csvPreview.map((row, idx) => (
                    <TableRow key={idx} className={!row.valid ? "bg-destructive/10" : ""}>
                      <TableCell>
                        {row.valid ? (
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-destructive" />
                        )}
                      </TableCell>
                      <TableCell>{row.fullName || <span className="text-muted-foreground">-</span>}</TableCell>
                      <TableCell>{row.email || <span className="text-destructive text-xs">{row.error}</span>}</TableCell>
                      <TableCell>{row.phone || "-"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setCsvDialogOpen(false)}>Cancel</Button>
              <Button
                onClick={() => bulkImportMutation.mutate(csvPreview)}
                disabled={validPreviewCount === 0 || bulkImportMutation.isPending}
                data-testid="button-confirm-import"
              >
                {bulkImportMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Import {validPreviewCount} Contacts
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
