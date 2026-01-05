import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import { PortalLayout } from "@/pages/portal/PortalLayout";
import Dashboard from "@/pages/portal/Dashboard";
import Leads from "@/pages/portal/Leads";
import Team from "@/pages/portal/Team";
import Resources from "@/pages/portal/Resources";
import Settings from "@/pages/portal/Settings";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home}/>
      <Route path="/portal">
        <PortalLayout>
          <Dashboard />
        </PortalLayout>
      </Route>
      <Route path="/portal/leads">
        <PortalLayout>
          <Leads />
        </PortalLayout>
      </Route>
      <Route path="/portal/team">
        <PortalLayout>
          <Team />
        </PortalLayout>
      </Route>
      <Route path="/portal/resources">
        <PortalLayout>
          <Resources />
        </PortalLayout>
      </Route>
      <Route path="/portal/settings">
        <PortalLayout>
          <Settings />
        </PortalLayout>
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
