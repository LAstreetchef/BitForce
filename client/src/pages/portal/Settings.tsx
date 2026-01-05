import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  User, 
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Bell,
  Shield,
  Save,
  CheckCircle
} from "lucide-react";
import { useState } from "react";

export default function Settings() {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6" data-testid="page-settings">
      <div>
        <h1 className="text-2xl font-bold" data-testid="text-page-title">Settings</h1>
        <p className="text-muted-foreground">Manage your profile and preferences</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card data-testid="section-profile">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                Profile Information
              </CardTitle>
              <CardDescription>Update your personal details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4 mb-6">
                <Avatar className="w-20 h-20">
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold text-2xl">
                    JD
                  </AvatarFallback>
                </Avatar>
                <div>
                  <Button variant="outline" size="sm" data-testid="button-change-photo">
                    Change Photo
                  </Button>
                  <p className="text-xs text-muted-foreground mt-1">JPG, PNG. Max 2MB</p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" defaultValue="John" data-testid="input-first-name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" defaultValue="Doe" data-testid="input-last-name" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input id="email" defaultValue="john.doe@email.com" className="pl-9" data-testid="input-email" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input id="phone" defaultValue="(555) 123-4567" className="pl-9" data-testid="input-phone" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input id="address" defaultValue="123 Main Street, Atlanta, GA 30301" className="pl-9" data-testid="input-address" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card data-testid="section-payout">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-green-600" />
                Payout Settings
              </CardTitle>
              <CardDescription>Configure how you receive your earnings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="payoutMethod">Payout Method</Label>
                <Select defaultValue="direct-deposit">
                  <SelectTrigger data-testid="select-payout-method">
                    <SelectValue placeholder="Select payout method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="direct-deposit">Direct Deposit</SelectItem>
                    <SelectItem value="paypal">PayPal</SelectItem>
                    <SelectItem value="check">Paper Check</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="bankName">Bank Name</Label>
                  <Input id="bankName" defaultValue="Chase Bank" data-testid="input-bank-name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accountType">Account Type</Label>
                  <Select defaultValue="checking">
                    <SelectTrigger data-testid="select-account-type">
                      <SelectValue placeholder="Select account type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="checking">Checking</SelectItem>
                      <SelectItem value="savings">Savings</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="routingNumber">Routing Number</Label>
                  <Input id="routingNumber" defaultValue="****4567" type="password" data-testid="input-routing" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accountNumber">Account Number</Label>
                  <Input id="accountNumber" defaultValue="****8901" type="password" data-testid="input-account" />
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm bg-green-50 dark:bg-green-950/30 p-3 rounded-lg">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Your bank account is verified and ready for payouts</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card data-testid="section-notifications">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-amber-500" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <div className="font-medium text-sm">New Lead Alerts</div>
                  <div className="text-xs text-muted-foreground">Get notified of new leads</div>
                </div>
                <Switch defaultChecked data-testid="switch-lead-alerts" />
              </div>
              <div className="flex items-center justify-between gap-2">
                <div>
                  <div className="font-medium text-sm">Sale Confirmations</div>
                  <div className="text-xs text-muted-foreground">Notifications when sales close</div>
                </div>
                <Switch defaultChecked data-testid="switch-sale-confirmations" />
              </div>
              <div className="flex items-center justify-between gap-2">
                <div>
                  <div className="font-medium text-sm">Team Updates</div>
                  <div className="text-xs text-muted-foreground">Activity from your recruits</div>
                </div>
                <Switch defaultChecked data-testid="switch-team-updates" />
              </div>
              <div className="flex items-center justify-between gap-2">
                <div>
                  <div className="font-medium text-sm">Weekly Summary</div>
                  <div className="text-xs text-muted-foreground">Weekly performance email</div>
                </div>
                <Switch data-testid="switch-weekly-summary" />
              </div>
              <div className="flex items-center justify-between gap-2">
                <div>
                  <div className="font-medium text-sm">Marketing Updates</div>
                  <div className="text-xs text-muted-foreground">News and promotions</div>
                </div>
                <Switch data-testid="switch-marketing" />
              </div>
            </CardContent>
          </Card>

          <Card data-testid="section-account-status">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-600" />
                Account Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm">Status</span>
                <Badge className="bg-green-100 text-green-800">Active</Badge>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm">Member Since</span>
                <span className="text-sm font-medium">Jan 15, 2025</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm">Ambassador ID</span>
                <span className="text-sm font-mono">AMB-2025-1234</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm">Tier</span>
                <Badge className="bg-purple-100 text-purple-800">Silver</Badge>
              </div>
            </CardContent>
          </Card>

          <Button 
            className="w-full" 
            onClick={handleSave}
            data-testid="button-save-settings"
          >
            {saved ? (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Saved!
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
