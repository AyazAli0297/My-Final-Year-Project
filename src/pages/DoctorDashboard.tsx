
import { DashboardShell } from "@/components/layout/DashboardShell";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { AppointmentCard } from "@/components/dashboard/AppointmentCard";
import { ReportCard } from "@/components/dashboard/ReportCard";
import { Button } from "@/components/ui/button";
import { FileText, Calendar, Users, Clock } from "lucide-react";
import { Link } from "react-router-dom";

export default function DoctorDashboard() {
  // Mock data for doctor dashboard
  const stats = [
    { title: "Total Patients", value: 128, icon: Users, trend: { value: 12, isPositive: true } },
    { title: "Today's Appointments", value: 8, icon: Calendar },
    { title: "Pending Reviews", value: 5, icon: Clock },
    { title: "Reports Generated", value: 42, icon: FileText, trend: { value: 15, isPositive: true } },
  ];

  const appointments = [
    {
      id: "APT-2345",
      patientName: "Michael Brown",
      date: "May 5, 2025",
      time: "9:00 AM",
      status: "upcoming" as const,
    },
    {
      id: "APT-2346",
      patientName: "Sarah Williams",
      date: "May 5, 2025",
      time: "10:30 AM",
      status: "upcoming" as const,
    },
    {
      id: "APT-2347",
      patientName: "David Miller",
      date: "May 5, 2025",
      time: "2:00 PM",
      status: "upcoming" as const,
    },
  ];

  const reports = [
    {
      id: "REP-6789",
      title: "Chest X-ray Analysis",
      description: "AI detected potential pneumonia in lower right lobe. Awaiting your review.",
      date: "May 4, 2025",
      imageUrl: "https://images.unsplash.com/photo-1516069677022-d3cc5f75ff79?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&q=80",
      patientName: "Michael Brown",
    },
    {
      id: "REP-6790",
      title: "Lumbar Spine X-ray",
      description: "AI analysis shows normal alignment with mild degenerative changes at L4-L5.",
      date: "May 3, 2025",
      imageUrl: "https://images.unsplash.com/photo-1579154341098-e4e158cc7f55?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&q=80",
      patientName: "Sarah Williams",
    },
  ];

  return (
    <DashboardShell userRole="doctor">
      <div className="space-y-8">
        <DashboardHeader
          heading="Doctor Dashboard"
          description="Welcome back, Dr. Jane. Here's your daily summary."
        >
          <Button asChild>
            <Link to="/doctor/appointments/schedule">
              <Calendar className="mr-2 h-4 w-4" /> Manage Schedule
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
        
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Today's Appointments</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/doctor/appointments">View all</Link>
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {appointments.map((apt) => (
              <AppointmentCard
                key={apt.id}
                id={apt.id}
                patientName={apt.patientName}
                date={apt.date}
                time={apt.time}
                status={apt.status}
                userRole="doctor"
              />
            ))}
          </div>
        </div>
        
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Reports Needing Review</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/doctor/reports">View all</Link>
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
                patientName={report.patientName}
                userRole="doctor"
              />
            ))}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
