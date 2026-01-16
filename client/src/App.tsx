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
import LeadFinder from "@/pages/portal/LeadFinder";
import BftWallet from "@/pages/portal/BftWallet";
import PublicEvents from "@/pages/PublicEvents";
import PublicProducts from "@/pages/PublicProducts";
import ExplainerVideo from "@/pages/ExplainerVideo";
import WhyBitForce from "@/pages/WhyBitForce";
import JoinBitForce from "@/pages/JoinBitForce";
import NextStep from "@/pages/NextStep";
import AmbassadorOne from "@/pages/AmbassadorOne";
import SupportInbox from "@/pages/admin/SupportInbox";
import TokenPitch from "@/pages/TokenPitch";
import ExplainerVideos from "@/pages/ExplainerVideos";
import EarningsCalculator from "@/pages/EarningsCalculator";
import MarketingVideo from "@/pages/MarketingVideo";
import AmbassadorPromoVideo from "@/pages/AmbassadorPromoVideo";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home}/>
      <Route path="/events" component={PublicEvents}/>
      <Route path="/products" component={PublicProducts}/>
      <Route path="/explainer" component={ExplainerVideo}/>
      <Route path="/why-bitforce" component={WhyBitForce}/>
      <Route path="/joinbitforce" component={JoinBitForce}/>
      <Route path="/nextstep" component={NextStep}/>
      <Route path="/ambassadorone" component={AmbassadorOne}/>
      <Route path="/token" component={TokenPitch}/>
      <Route path="/explainer-videos" component={ExplainerVideos}/>
      <Route path="/calculator" component={EarningsCalculator}/>
      <Route path="/marketing-video" component={MarketingVideo}/>
      <Route path="/ambassador-video" component={AmbassadorPromoVideo}/>
      <Route path="/portal">
        <PortalLayout>
          <Dashboard />
        </PortalLayout>
      </Route>
      <Route path="/portal/dashboard">
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
      <Route path="/portal/lead-finder">
        <PortalLayout>
          <LeadFinder />
        </PortalLayout>
      </Route>
      <Route path="/portal/products">
        <PortalLayout>
          <Products />
        </PortalLayout>
      </Route>
      <Route path="/portal/bft-wallet">
        <PortalLayout>
          <BftWallet />
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
