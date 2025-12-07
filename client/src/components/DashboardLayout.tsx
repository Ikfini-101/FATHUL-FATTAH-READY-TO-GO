import { useAuth } from "@/_core/hooks/useAuth";
import { APP_LOGO, APP_TITLE } from "@/const";
import { cn } from "@/lib/utils";
import {
  Book,
  BookOpen,
  Calendar,
  Copy,
  FileText,
  FileType,
  FolderOpen,
  Glasses,
  Image,
  MessageCircle,
  Package,
  Radio,
  Shield,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { DashboardLayoutSkeleton } from "./DashboardLayoutSkeleton";

const navItems = [
  { icon: Shield, label: "Rôles & Permissions", path: "/roles" },
  { icon: FileText, label: "Articles", path: "/posts" },
  { icon: Calendar, label: "Événements", path: "/events" },
  { icon: FileType, label: "Pages Statiques", path: "/pages" },
  { icon: Book, label: "Centre de Documentation", path: "/doc-items" },
  { icon: BookOpen, label: "Prêts", path: "/doc-loans" },
  { icon: Copy, label: "Reprographie", path: "/doc-repro" },
  { icon: FolderOpen, label: "Catégories & Tags", path: "/categories" },
  { icon: Package, label: "Produits", path: "/products" },
  { icon: FolderOpen, label: "Catégories Produits", path: "/product-categories" },
  { icon: Package, label: "Commandes", path: "/orders" },
  { icon: MessageCircle, label: "Messages", path: "/messages" },
  { icon: Radio, label: "E-Radio", path: "/radio" },
  { icon: Glasses, label: "Musée VR", path: "/museum-vr" },
  { icon: Image, label: "Médias", path: "/media" },
];

const SIDEBAR_WIDTH_KEY = "sidebar-width";
const DEFAULT_WIDTH = 280;
const MIN_WIDTH = 200;
const MAX_WIDTH = 480;

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    const saved = localStorage.getItem(SIDEBAR_WIDTH_KEY);
    return saved ? parseInt(saved, 10) : DEFAULT_WIDTH;
  });
  const { loading, user } = useAuth();

  useEffect(() => {
    localStorage.setItem(SIDEBAR_WIDTH_KEY, sidebarWidth.toString());
  }, [sidebarWidth]);

  if (loading) {
    return <DashboardLayoutSkeleton />
  }

  // MODE DÉMO : Désactivé la page de connexion
  // if (!user) {
  //   return (
  //     <div className="flex items-center justify-center min-h-screen">
  //       <div className="flex flex-col items-center gap-8 p-8 max-w-md w-full">
  //         <div className="relative group">
  //           <div className="relative">
  //             <img src={APP_LOGO} alt="App Logo" className="w-24 h-24 rounded-2xl" />
  //           </div>
  //         </div>
  //         <h1 className="text-2xl font-bold">{APP_TITLE}</h1>
  //         <p className="text-muted-foreground">Please sign in to continue</p>
  //         <button className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg">
  //           Sign in
  //         </button>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <aside
        className="flex flex-col border-r bg-card"
        style={{ width: `${sidebarWidth}px` }}
      >
        <div className="flex items-center gap-3 p-4 border-b">
          <img src={APP_LOGO} alt="Logo" className="w-8 h-8 rounded" />
          <h1 className="font-semibold text-lg">{APP_TITLE}</h1>
        </div>

        <nav className="flex-1 overflow-y-auto p-2">
          {navItems.map((item) => (
            <NavItem key={item.path} {...item} />
          ))}
        </nav>

        <div className="p-4 border-t">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-sm font-medium">
                {user?.name?.[0]?.toUpperCase() || "D"}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {user?.name || "Demo User"}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {user?.email || "demo@fathulfattah.com"}
              </p>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}

function NavItem({
  icon: Icon,
  label,
  path,
}: {
  icon: React.ElementType;
  label: string;
  path: string;
}) {
  const [location] = useLocation();
  const isActive = location === path;

  return (
    <Link href={path}>
      <a
        className={cn(
          "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
          isActive
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        )}
      >
        <Icon className="w-4 h-4" />
        <span>{label}</span>
      </a>
    </Link>
  );
}
