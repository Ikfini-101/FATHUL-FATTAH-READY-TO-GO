import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import DashboardLayout from "./components/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Posts from "./pages/Posts";
import Products from "./pages/Products";
import Categories from "./pages/Categories";
import Roles from "./pages/Roles";
import Messages from "./pages/Messages";
import Radio from "./pages/Radio";
import MuseumVR from "./pages/MuseumVR";
import MediaLibrary from "./pages/MediaLibrary";
import Events from "./pages/Events";
import EventForm from "./pages/EventForm";
import Pages from "./pages/Pages";
import PageForm from "./pages/PageForm";
import DocItems from "./pages/DocItems";
import DocItemForm from "@/pages/DocItemForm";
import DocLoans from "@/pages/DocLoans";
import DocRepro from "@/pages/DocRepro";
import DocCatalog from "./pages/DocCatalog";
import DocDetail from "./pages/DocDetail";
import DocGallery from "./pages/DocGallery";
import Portal from "./pages/Portal";
import PortalArticles from "./pages/PortalArticles";
import PortalArticleDetail from "./pages/PortalArticleDetail";
import PortalContact from "./pages/PortalContact";
import PortalEvents from "./pages/PortalEvents";

function Router() {
  return (
    <Switch>
      {/* Routes protégées avec DashboardLayout */}
      <Route path="/">
        <DashboardLayout>
          <Dashboard />
        </DashboardLayout>
      </Route>
      
      <Route path="/users">
        <DashboardLayout>
          <Users />
        </DashboardLayout>
      </Route>
      
      <Route path="/posts">
        <DashboardLayout>
          <Posts />
        </DashboardLayout>
      </Route>
      
      <Route path="/products">
        <DashboardLayout>
          <Products />
        </DashboardLayout>
      </Route>
      
      <Route path="/categories">
        <DashboardLayout>
          <Categories />
        </DashboardLayout>
      </Route>
      
      <Route path="/roles">
        <DashboardLayout>
          <Roles />
        </DashboardLayout>
      </Route>
      
      <Route path="/messages">
        <DashboardLayout>
          <Messages />
        </DashboardLayout>
      </Route>
      
      <Route path="/radio">
        <DashboardLayout>
          <Radio />
        </DashboardLayout>
      </Route>
      
      <Route path="/museum-vr">
        <DashboardLayout>
          <MuseumVR />
        </DashboardLayout>
      </Route>
      
      <Route path="/media">
        <DashboardLayout>
          <MediaLibrary />
        </DashboardLayout>
      </Route>
      
      {/* Routes Événements */}
      <Route path="/events">
        <DashboardLayout>
          <Events />
        </DashboardLayout>
      </Route>
      <Route path="/events/new">
        <DashboardLayout>
          <EventForm />
        </DashboardLayout>
      </Route>
      <Route path="/events/:id/edit">
        <DashboardLayout>
          <EventForm />
        </DashboardLayout>
      </Route>
      
      {/* Routes Pages Statiques */}
      <Route path="/pages">
        <DashboardLayout>
          <Pages />
        </DashboardLayout>
      </Route>
      <Route path="/pages/new">
        <DashboardLayout>
          <PageForm />
        </DashboardLayout>
      </Route>
      <Route path="/pages/:id/edit">
        <DashboardLayout>
          <PageForm />
        </DashboardLayout>
      </Route>

      {/* Centre de Documentation */}
      <Route path="/doc-items">
        <DashboardLayout>
          <DocItems />
        </DashboardLayout>
      </Route>
      <Route path="/doc-items/new">
        <DashboardLayout>
          <DocItemForm />
        </DashboardLayout>
      </Route>
      <Route path="/doc-items/:id/edit">
        <DashboardLayout>
          <DocItemForm />
        </DashboardLayout>
      </Route>
      <Route path="/doc-loans">
        <DashboardLayout>
          <DocLoans />
        </DashboardLayout>
      </Route>
      <Route path="/doc-repro">
        <DashboardLayout>
          <DocRepro />
        </DashboardLayout>
      </Route>
      
      {/* Routes publiques Portal (sans DashboardLayout) */}
      <Route path="/portal" component={Portal} />
      <Route path="/portal/articles" component={PortalArticles} />
      <Route path="/portal/articles/:slug" component={PortalArticleDetail} />
      <Route path="/portal/events" component={PortalEvents} />
      <Route path="/portal/contact" component={PortalContact} />

      {/* Routes publiques Centre de Documentation */}
      <Route path="/catalogue" component={DocCatalog} />
      <Route path="/catalogue/:slug" component={DocDetail} />
      <Route path="/galerie" component={DocGallery} />
      
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
