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
import NewLead from "@/pages/portal/NewLead";
import Team from "@/pages/portal/Team";
import Resources from "@/pages/portal/Resources";
import Settings from "@/pages/portal/Settings";
import Events from "@/pages/portal/Events";
import Tools from "@/pages/portal/Tools";
import Products from "@/pages/portal/Products";
import PublicEvents from "@/pages/PublicEvents";
import PublicProducts from "@/pages/PublicProducts";
import ExplainerVideo from "@/pages/ExplainerVideo";
import JoinBitForce from "@/pages/JoinBitForce";
import SupportInbox from "@/pages/admin/SupportInbox";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home}/>
      <Route path="/events" component={PublicEvents}/>
      <Route path="/products" component={PublicProducts}/>
      <Route path="/explainer" component={ExplainerVideo}/>
      <Route path="/joinbitforce" component={JoinBitForce}/>
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
      <Route path="/portal/leads/new">
        <PortalLayout>
          <NewLead />
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
      <Route path="/portal/events">
        <PortalLayout>
          <Events />
        </PortalLayout>
      </Route>
      <Route path="/portal/tools">
        <PortalLayout>
          <Tools />
        </PortalLayout>
      </Route>
      <Route path="/portal/products">
        <PortalLayout>
          <Products />
        </PortalLayout>
      </Route>
      <Route path="/admin/support" component={SupportInbox} />
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
