
import { DashboardShell } from "@/components/layout/DashboardShell";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { AppointmentCard } from "@/components/dashboard/AppointmentCard";
import { ReportCard } from "@/components/dashboard/ReportCard";
import { Button } from "@/components/ui/button";
import { FileText, Calendar, Upload, Clock } from "lucide-react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  // Mock data for patient dashboard
  const stats = [
    { title: "Total Reports", value: 12, icon: FileText },
    { title: "Upcoming Appointments", value: 3, icon: Calendar },
    { title: "Pending Reports", value: 1, icon: Clock, trend: { value: 5, isPositive: false } },
  ];

  const appointments = [
    {
      id: "APT-1234",
      doctorName: "Jane Smith",
      date: "May 10, 2025",
      time: "10:00 AM",
      status: "upcoming" as const,
    },
    {
      id: "APT-1235",
      doctorName: "Robert Johnson",
      date: "May 15, 2025",
      time: "2:30 PM",
      status: "upcoming" as const,
    },
  ];

  const reports = [
    {
      id: "REP-5678",
      title: "Chest X-ray Analysis",
      description: "Analysis of anterior-posterior chest X-ray showing normal heart size and clear lung fields.",
      date: "April 30, 2025",
      imageUrl: "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&q=80",
    },
    {
      id: "REP-5679",
      title: "Left Hand X-ray",
      description: "X-ray of left hand showing no fractures or dislocations. Normal bone density and alignment.",
      date: "April 15, 2025",
      imageUrl: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&q=80",
    },
  ];

  return (
    <DashboardShell userRole="patient">
      <div className="space-y-8">
        <DashboardHeader
          heading="Dashboard"
          description="Welcome back, John. Here's an overview of your health records."
        >
          <Button asChild>
            <Link to="/upload">
              <Upload className="mr-2 h-4 w-4" /> Upload new X-ray
            </Link>
          </Button>
        </DashboardHeader>
        
        <div className="grid gap-4 md:grid-cols-3">
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
        
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Upcoming Appointments</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/appointments">View all</Link>
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {appointments.map((apt) => (
              <AppointmentCard
                key={apt.id}
                id={apt.id}
                doctorName={apt.doctorName}
                date={apt.date}
                time={apt.time}
                status={apt.status}
                userRole="patient"
              />
            ))}
            <div className="flex flex-col justify-center items-center p-6 border border-dashed rounded-lg bg-muted/50 min-h-[150px]">
              <Calendar className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground text-center">
                Schedule a new appointment with a specialist
              </p>
              <Button variant="outline" className="mt-4" asChild>
                <Link to="/appointments/new">Book Appointment</Link>
              </Button>
            </div>
          </div>
        </div>
        
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Recent Reports</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/reports">View all</Link>
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {reports.map((report) => (
              <ReportCard
                key={report.id}
                id={report.id}
                title={report.title}
                description={report.description}
                date={report.date}
                imageUrl={report.imageUrl}
                userRole="patient"
              />
            ))}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
