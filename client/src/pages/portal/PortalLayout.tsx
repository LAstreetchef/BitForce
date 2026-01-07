import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { 
  LayoutDashboard, 
  Users, 
  ClipboardList, 
  BookOpen, 
  Settings,
  Home,
  DollarSign,
  LogOut,
  Loader2,
  CalendarDays
} from "lucide-react";
import { AmbassadorPayoutModal } from "@/components/AmbassadorPayoutModal";
import { SupportChat } from "@/components/SupportChat";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import SubscriptionRequired from "@/pages/SubscriptionRequired";

const menuItems = [
  { title: "Dashboard", url: "/portal", icon: LayoutDashboard },
  { title: "Leads", url: "/portal/leads", icon: ClipboardList },
  { title: "My Team", url: "/portal/team", icon: Users },
  { title: "Events", url: "/portal/events", icon: CalendarDays },
  { title: "Resources", url: "/portal/resources", icon: BookOpen },
  { title: "Settings", url: "/portal/settings", icon: Settings },
];

interface PortalLayoutProps {
  children: React.ReactNode;
}

interface SubscriptionStatus {
  isAmbassador: boolean;
  subscriptionStatus: string;
  referralCode: string | null;
}

export function PortalLayout({ children }: PortalLayoutProps) {
  const [location] = useLocation();
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const { user, isLoading, isAuthenticated, logout } = useAuth();
  const { toast } = useToast();

  const { data: subscriptionStatus, isLoading: subscriptionLoading, isFetched: subscriptionFetched } = useQuery<SubscriptionStatus>({
    queryKey: ["/api/ambassador/subscription-status", user?.id],
    queryFn: async () => {
      const res = await fetch(`/api/ambassador/subscription-status?userId=${user?.id}`);
      return res.json();
    },
    enabled: !!user?.id,
  });

  const isSubscriptionCheckComplete = !!user?.id && subscriptionFetched;

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Please sign in",
        description: "You need to be logged in to access the Ambassador Portal.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
    }
  }, [isLoading, isAuthenticated, toast]);

  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <p className="text-muted-foreground">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  if (!isSubscriptionCheckComplete || subscriptionLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <p className="text-muted-foreground">Checking subscription...</p>
        </div>
      </div>
    );
  }

  if (!subscriptionStatus?.isAmbassador || subscriptionStatus?.subscriptionStatus !== "active") {
    return <SubscriptionRequired userId={user?.id || ""} />;
  }

  const userInitials = user?.firstName && user?.lastName 
    ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    : user?.email?.[0]?.toUpperCase() || "U";

  const userName = user?.firstName && user?.lastName 
    ? `${user.firstName} ${user.lastName}`
    : user?.email || "Ambassador";

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full bg-slate-50 dark:bg-slate-950">
        <Sidebar>
          <SidebarHeader className="p-4 border-b">
            <Link href="/" data-testid="link-logo-home">
              <div className="flex items-center gap-2 cursor-pointer">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                  B
                </div>
                <span className="font-display font-bold text-lg tracking-tight">
                  Bit Force
                </span>
              </div>
            </Link>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => {
                    const isActive = location === item.url || 
                      (item.url !== "/portal" && location.startsWith(item.url));
                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton 
                          asChild
                          isActive={isActive}
                          data-testid={`nav-${item.title.toLowerCase().replace(/\s+/g, '-')}`}
                        >
                          <Link href={item.url}>
                            <item.icon className="w-4 h-4" />
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup className="mt-auto">
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      onClick={() => setShowPayoutModal(true)}
                      className="text-green-600"
                      data-testid="nav-my-earnings"
                    >
                      <DollarSign className="w-4 h-4" />
                      <span>My Earnings</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild data-testid="nav-back-home">
                      <Link href="/">
                        <Home className="w-4 h-4" />
                        <span>Back to Home</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="p-4 border-t">
            <div className="flex items-center gap-3">
              <Avatar className="w-9 h-9">
                <AvatarImage src={user?.profileImageUrl || undefined} alt={userName} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold text-sm">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm truncate" data-testid="text-user-name">{userName}</div>
                <div className="text-xs text-muted-foreground truncate">{user?.email}</div>
              </div>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => logout()}
                data-testid="button-logout"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>

        <div className="flex flex-col flex-1 overflow-hidden">
          <header className="flex items-center justify-between gap-4 p-4 border-b bg-white dark:bg-slate-900">
            <SidebarTrigger data-testid="button-sidebar-toggle" />
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowPayoutModal(true)}
                data-testid="button-header-earnings"
              >
                <DollarSign className="w-4 h-4 text-green-600 mr-1" />
                Earnings
              </Button>
            </div>
          </header>
          <main className="flex-1 overflow-auto p-6">
            {children}
          </main>
        </div>
      </div>

      <AmbassadorPayoutModal 
        open={showPayoutModal} 
        onOpenChange={setShowPayoutModal} 
      />

      <SupportChat />
    </SidebarProvider>
  );
}
