import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
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
  DollarSign
} from "lucide-react";
import { AmbassadorPayoutModal } from "@/components/AmbassadorPayoutModal";
import { useState } from "react";

const menuItems = [
  { title: "Dashboard", url: "/portal", icon: LayoutDashboard },
  { title: "Leads", url: "/portal/leads", icon: ClipboardList },
  { title: "My Team", url: "/portal/team", icon: Users },
  { title: "Resources", url: "/portal/resources", icon: BookOpen },
  { title: "Settings", url: "/portal/settings", icon: Settings },
];

interface PortalLayoutProps {
  children: React.ReactNode;
}

export function PortalLayout({ children }: PortalLayoutProps) {
  const [location] = useLocation();
  const [showPayoutModal, setShowPayoutModal] = useState(false);

  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

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
    </SidebarProvider>
  );
}
