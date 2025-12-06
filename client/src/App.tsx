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
import Orders from "./pages/Orders";
import ProductCategories from "./pages/ProductCategories";
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
import Contact from "./pages/Contact";
import RadioHome from "./pages/RadioHome";
import RadioLive from "./pages/RadioLive";
import RadioSchedule from "./pages/RadioSchedule";
import RadioPodcasts from "./pages/RadioPodcasts";
import RadioPodcastDetail from "./pages/RadioPodcastDetail";
import RadioEpisodes from "./pages/RadioEpisodes";
import RadioScheduleAdmin from "./pages/RadioScheduleAdmin";
import RadioSettings from "./pages/RadioSettings";
import Portal from "./pages/Portal";
import PortalHome from "./pages/PortalHome";
import PortalArticles from "./pages/PortalArticles";
import PortalArticleDetail from "./pages/PortalArticleDetail";
import PortalContact from "./pages/PortalContact";
import PortalEvents from "./pages/PortalEvents";
import BoutiqueHome from "./pages/BoutiqueHome";
import BoutiqueCatalogue from "./pages/BoutiqueCatalogue";
import BoutiqueProductDetail from "./pages/BoutiqueProductDetail";
import BoutiqueCart from "@/pages/BoutiqueCart";
import BoutiqueCheckout from "@/pages/BoutiqueCheckout";
import BoutiqueOrderConfirmation from "@/pages/BoutiqueOrderConfirmation";

function Router() {
  return (
    <Switch>
      {/* Page d'accueil publique - Portail avec carousel de cartes */}
      <Route path="/" component={Portal} />
      
      {/* Routes protégées avec DashboardLayout */}
      <Route path="/admin">
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
      
      <Route path="/orders">
        <DashboardLayout>
          <Orders />
        </DashboardLayout>
      </Route>
      
      <Route path="/product-categories">
        <DashboardLayout>
          <ProductCategories />
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
      
      <Route path="/radio-shows">
        <DashboardLayout>
          <Radio />
        </DashboardLayout>
      </Route>

      <Route path="/radio-episodes">
        <DashboardLayout>
          <RadioEpisodes />
        </DashboardLayout>
      </Route>

      <Route path="/radio-schedule">
        <DashboardLayout>
          <RadioScheduleAdmin />
        </DashboardLayout>
      </Route>

      <Route path="/radio-settings">
        <DashboardLayout>
          <RadioSettings />
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
      <Route path="/contact" component={Contact} />

      {/* Routes publiques E-Radio */}
      <Route path="/radio" component={RadioHome} />
      <Route path="/radio/live" component={RadioLive} />
      <Route path="/radio/grille" component={RadioSchedule} />
      <Route path="/radio/podcasts" component={RadioPodcasts} />
      <Route path="/radio/podcasts/:slug" component={RadioPodcastDetail} />

      {/* Routes publiques E-Boutique */}
      <Route path="/boutique" component={BoutiqueHome} />
      <Route path="/boutique/catalogue" component={BoutiqueCatalogue} />
      <Route path="/boutique/produits/:slug" component={BoutiqueProductDetail} />
          <Route path="/boutique/panier" component={BoutiqueCart} />
          <Route path="/boutique/checkout" component={BoutiqueCheckout} />
          <Route path="/boutique/confirmation/:orderId" component={BoutiqueOrderConfirmation} />
      
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
