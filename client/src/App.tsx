import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import VendorCategory from "@/pages/VendorCategory";
import VendorProfile from "@/pages/VendorProfile";
import ListBusiness from "@/pages/ListBusiness";
import Blog from "@/pages/Blog";
import BlogPost from "@/pages/BlogPost";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Couples from "@/pages/Couples";
import RSVPGenerator from "@/pages/RSVPGenerator";
import { RSVPForm } from "@/components/RSVP/RSVPForm";
import { RSVPConfirmation } from "@/components/RSVP/RSVPConfirmation";
import { RSVPDashboard } from "@/components/RSVP/RSVPDashboard";
import { RSVPInvitationSender } from "@/components/RSVP/RSVPInvitationSender";
import { SingleRSVPGenerator } from "@/components/RSVP/SingleRSVPGenerator";
import { GoanWeddingRSVP } from "@/components/RSVP/GoanWeddingRSVP";
import { CoupleDashboard } from "@/components/RSVP/CoupleDashboard";
import Search from "@/pages/Search";
import AdminDashboard from "@/pages/AdminDashboard";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/vendors/:category" component={VendorCategory} />
        <Route path="/vendor/:id" component={VendorProfile} />
        <Route path="/list-business" component={ListBusiness} />
        <Route path="/blog" component={Blog} />
        <Route path="/blog/:slug" component={BlogPost} />
        <Route path="/about" component={About} />
        <Route path="/contact" component={Contact} />
        <Route path="/couples/:slug" component={Couples} />
        <Route path="/rsvp/create" component={RSVPGenerator} />
        <Route path="/rsvp/send" component={RSVPInvitationSender} />
        <Route path="/rsvp/generate" component={SingleRSVPGenerator} />
        <Route path="/rsvp/:invitationCode" component={RSVPForm} />
        <Route path="/rsvp/goan/:weddingId" component={GoanWeddingRSVP} />
        <Route path="/rsvp/confirmation/:code" component={RSVPConfirmation} />
        <Route path="/rsvp/manage/:weddingId" component={RSVPDashboard} />
        <Route path="/rsvp/dashboard/:weddingId" component={CoupleDashboard} />
        <Route path="/search" component={Search} />
        <Route path="/admin/dashboard" component={AdminDashboard} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
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
