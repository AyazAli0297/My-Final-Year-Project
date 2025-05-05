
import { DashboardShell } from "@/components/layout/DashboardShell";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { Button } from "@/components/ui/button";
import { Users, FileText, Settings, Shield } from "lucide-react";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  // Mock data for admin dashboard
  const stats = [
    { title: "Total Users", value: 3245, icon: Users, trend: { value: 8, isPositive: true } },
    { title: "Active Doctors", value: 128, icon: Users },
    { title: "Reports Generated", value: 15729, icon: FileText, trend: { value: 12, isPositive: true } },
    { title: "System Health", value: "98%", icon: Shield },
  ];

  return (
    <DashboardShell userRole="admin">
      <div className="space-y-8">
        <DashboardHeader
          heading="Admin Dashboard"
          description="System overview and management controls"
        >
          <Button asChild>
            <Link to="/admin/system">
              <Settings className="mr-2 h-4 w-4" /> System Settings
            </Link>
          </Button>
        </DashboardHeader>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <StatCard
              key={stat.title}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              trend={stat.trend}
            />
          ))}
        </div>
        
        <div className="grid gap-8 md:grid-cols-2">
          <div className="p-6 border rounded-lg bg-card">
            <h2 className="text-xl font-bold mb-4">Recent User Activities</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">New doctor registration</p>
                  <p className="text-sm text-muted-foreground">Dr. James Wilson</p>
                </div>
                <p className="text-sm text-muted-foreground">10 minutes ago</p>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">System update completed</p>
                  <p className="text-sm text-muted-foreground">AI model v2.3 deployed</p>
                </div>
                <p className="text-sm text-muted-foreground">2 hours ago</p>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">User role modified</p>
                  <p className="text-sm text-muted-foreground">Sarah Johnson: Admin → Doctor</p>
                </div>
                <p className="text-sm text-muted-foreground">5 hours ago</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/admin/activity">View all activities</Link>
              </Button>
            </div>
          </div>
          
          <div className="p-6 border rounded-lg bg-card">
            <h2 className="text-xl font-bold mb-4">System Health</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Database</span>
                  <span className="text-sm text-green-600">Healthy</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2.5">
                  <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '98%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">API Services</span>
                  <span className="text-sm text-green-600">Operational</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2.5">
                  <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '100%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">AI Model</span>
                  <span className="text-sm text-amber-600">Updating</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2.5">
                  <div className="bg-amber-500 h-2.5 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Storage</span>
                  <span className="text-sm text-green-600">72% used</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2.5">
                  <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '72%' }}></div>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/admin/system">View detailed metrics</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
