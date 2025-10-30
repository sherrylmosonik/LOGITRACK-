import { useState } from "react";
import { useLocation } from "wouter";
import { Package, LayoutDashboard, Users, Truck, Settings, LogOut, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import type { User } from "@shared/schema";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [location, setLocation] = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { data: user } = useQuery<User>({
    queryKey: ['/api/auth/me'],
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Logout failed');
    },
    onSuccess: () => {
      queryClient.clear();
      setLocation('/login');
    },
  });

  const isAdmin = user?.role === 'admin';
  const isClient = user?.role === 'client';

  const navItems = isAdmin
    ? [
        { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
        { icon: Package, label: "Shipments", path: "/dashboard" },
        { icon: Truck, label: "Vehicles", path: "/dashboard" },
        { icon: Users, label: "Personnel", path: "/dashboard" },
      ]
    : isClient
    ? [
        { icon: Package, label: "My Shipments", path: "/client-portal" },
        { icon: LayoutDashboard, label: "Overview", path: "/client-portal" },
      ]
    : [
        { icon: Package, label: "My Deliveries", path: "/personnel" },
        { icon: LayoutDashboard, label: "Overview", path: "/personnel" },
      ];

  return (
    <div className="flex h-screen bg-background">
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r transform transition-transform duration-300 lg:translate-x-0 lg:static ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                <Package className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">LogiTrack</span>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item) => (
              <Button
                key={item.path}
                variant={location === item.path ? "secondary" : "ghost"}
                className="w-full justify-start gap-3"
                onClick={() => {
                  setLocation(item.path);
                  setIsSidebarOpen(false);
                }}
                data-testid={`nav-${item.label.toLowerCase().replace(' ', '-')}`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Button>
            ))}
          </nav>

          <div className="p-4 border-t space-y-2">
            <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-muted/50">
              <Avatar className="w-8 h-8">
                <AvatarFallback>{user?.fullName.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user?.fullName}</p>
                <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              className="w-full justify-start gap-3"
              onClick={() => logoutMutation.mutate()}
              data-testid="button-logout"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="border-b bg-card px-6 py-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            data-testid="button-menu"
          >
            <Menu className="w-5 h-5" />
          </Button>
          <div className="flex-1" />
          <Button variant="ghost" size="icon" data-testid="button-settings">
            <Settings className="w-5 h-5" />
          </Button>
        </header>

        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
