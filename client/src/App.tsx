import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import TrackShipment from "@/pages/TrackShipment";
import AdminDashboard from "@/pages/AdminDashboard";
import ClientPortal from "@/pages/ClientPortal";
import PersonnelDashboard from "@/pages/PersonnelDashboard";
import DashboardLayout from "@/components/layout/DashboardLayout";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      <Route path="/track" component={TrackShipment} />
      <Route path="/dashboard">
        <DashboardLayout>
          <AdminDashboard />
        </DashboardLayout>
      </Route>
      <Route path="/client-portal">
        <DashboardLayout>
          <ClientPortal />
        </DashboardLayout>
      </Route>
      <Route path="/personnel">
        <DashboardLayout>
          <PersonnelDashboard />
        </DashboardLayout>
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
