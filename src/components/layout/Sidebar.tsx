import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  Home, 
  Users, 
  FileText, 
  Calendar, 
  Upload, 
  Settings,
  LayoutDashboard,
  User,
  LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

type SidebarProps = {
  userRole: 'patient' | 'doctor' | 'admin';
}

export function Sidebar({ userRole }: SidebarProps) {
  const location = useLocation();
  const { profile, signOut } = useAuth();
  
  // Define navigation items based on user role
  const getNavItems = () => {
    if (userRole === 'patient') {
      return [
        { name: 'Dashboard', href: '/dashboard', icon: Home },
        { name: 'Upload X-ray', href: '/upload', icon: Upload },
        { name: 'Appointments', href: '/appointments', icon: Calendar },
        { name: 'Reports', href: '/reports', icon: FileText },
        { name: 'Settings', href: '/settings', icon: Settings },
      ];
    } else if (userRole === 'doctor') {
      return [
        { name: 'Dashboard', href: '/doctor/dashboard', icon: LayoutDashboard },
        { name: 'Patients', href: '/doctor/patients', icon: Users },
        { name: 'Appointments', href: '/doctor/appointments', icon: Calendar },
        { name: 'Reports', href: '/doctor/reports', icon: FileText },
        { name: 'Settings', href: '/settings', icon: Settings },
      ];
    } else if (userRole === 'admin') {
      return [
        { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Users', href: '/admin/users', icon: Users },
        { name: 'Reports', href: '/admin/reports', icon: FileText },
        { name: 'System', href: '/admin/system', icon: Settings },
      ];
    }
    return [];
  };

  const navItems = getNavItems();

  return (
    <aside className="hidden md:flex h-screen border-r w-64 flex-col bg-sidebar fixed">
      <div className="flex h-16 items-center border-b px-6">
        <Link to="/" className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <span className="font-bold text-white text-lg">X</span>
          </div>
          <span className="font-bold text-xl">X-Ray AI</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-4">
        <nav className="grid items-start px-4 text-sm">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-sidebar-accent transition-all",
                location.pathname === item.href
                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                  : "text-sidebar-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
      <div className="border-t p-4">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3 rounded-lg px-3 py-2">
            <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center">
              <User className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-bold">{profile?.name || 'User'}</p>
              <p className="text-xs text-muted-foreground capitalize">{profile?.role || userRole}</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full flex items-center gap-2"
            onClick={signOut}
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </Button>
        </div>
      </div>
    </aside>
  );
}
