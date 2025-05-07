import { useEffect, useState } from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { AppointmentCard } from "@/components/dashboard/AppointmentCard";
import { ReportCard } from "@/components/dashboard/ReportCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Calendar, Users, Clock, Search, Bell, Stethoscope, ClipboardList } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

export default function DoctorDashboard() {
  const { user, profile } = useAuth();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loadingAppointments, setLoadingAppointments] = useState(true);

  // Fetch doctor's appointments
  useEffect(() => {
    async function fetchAppointments() {
      if (!user || !profile || profile.role !== 'doctor') return;
      setLoadingAppointments(true);
      try {
        // Get doctor_id from doctors table using user.id
        const { data: doctorData, error: doctorError } = await supabase
          .from('doctors')
          .select('id')
          .eq('user_id', user.id)
          .single();
        if (doctorError || !doctorData) {
          setLoadingAppointments(false);
          return;
        }
        const doctorId = doctorData.id;
        const { data, error } = await supabase
          .from('appointments')
          .select(`
            id,
            appointment_date,
            status,
            patients ( id, first_name, last_name )
          `)
          .eq('doctor_id', doctorId)
          .order('appointment_date', { ascending: true });
        if (error) {
          setAppointments([]);
        } else {
          setAppointments(data || []);
        }
      } catch (err) {
        setAppointments([]);
      } finally {
        setLoadingAppointments(false);
      }
    }
    fetchAppointments();
  }, [user, profile]);

  // Today's appointments (filter by today's date)
  const today = new Date();
  const todayAppointments = appointments.filter(apt => {
    const aptDate = new Date(apt.appointment_date);
    return (
      aptDate.getFullYear() === today.getFullYear() &&
      aptDate.getMonth() === today.getMonth() &&
      aptDate.getDate() === today.getDate() &&
      apt.status === 'scheduled'
    );
  }).map(apt => ({
    id: apt.id,
    patientName: apt.patients ? `${apt.patients.first_name} ${apt.patients.last_name}` : 'N/A',
    date: new Date(apt.appointment_date).toLocaleDateString(),
    time: new Date(apt.appointment_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    status: 'upcoming' as const,
  }));

  // Update stats with real data
  const stats = [
    { title: "Total Patients", value: 128, icon: Users, trend: { value: 12, isPositive: true } },
    { title: "Today's Appointments", value: todayAppointments.length, icon: Calendar },
    { title: "Pending Reviews", value: 5, icon: Clock },
    { title: "Reports Generated", value: 42, icon: FileText, trend: { value: 15, isPositive: true } },
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
    <div className="space-y-8">
      <DashboardHeader
        heading="Doctor Dashboard"
        description={`Welcome back, Dr. ${profile?.name || ''}. Here's your daily summary.`}
      >
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search patients or reports..." className="pl-8 w-[300px]" />
          </div>
          <Button variant="outline" size="icon">
            <Bell className="h-4 w-4" />
          </Button>
          <Button asChild>
            <Link to="/doctor/appointments/schedule">
              <Calendar className="mr-2 h-4 w-4" /> Manage Schedule
            </Link>
          </Button>
        </div>
      </DashboardHeader>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2" asChild>
          <Link to="/doctor/appointments/new">
            <Calendar className="h-6 w-6" />
            <span>New Appointment</span>
          </Link>
        </Button>
        <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2" asChild>
          <Link to="/doctor/reports/new">
            <FileText className="h-6 w-6" />
            <span>New Report</span>
          </Link>
        </Button>
        <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2" asChild>
          <Link to="/doctor/consultations">
            <Stethoscope className="h-6 w-6" />
            <span>Start Consultation</span>
          </Link>
        </Button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-4">
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
      
      <Tabs defaultValue="appointments" className="space-y-4">
        <TabsList>
          <TabsTrigger value="appointments" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Appointments
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Reports
          </TabsTrigger>
          <TabsTrigger value="patients" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Patients
          </TabsTrigger>
        </TabsList>

        <TabsContent value="appointments" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Today's Appointments</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/doctor/appointments">View all</Link>
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {loadingAppointments ? (
              <div className="col-span-3 text-center text-muted-foreground">Loading appointments...</div>
            ) : todayAppointments.length > 0 ? (
              todayAppointments.map((apt) => (
                <AppointmentCard
                  key={apt.id}
                  id={apt.id}
                  patientName={apt.patientName}
                  date={apt.date}
                  time={apt.time}
                  status={apt.status}
                  userRole="doctor"
                />
              ))
            ) : (
              <div className="col-span-3 text-center text-muted-foreground">
                No appointments scheduled for today.
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <div className="flex items-center justify-between">
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
        </TabsContent>

        <TabsContent value="patients" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Recent Patients</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/doctor/patients">View all</Link>
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex flex-col justify-center items-center p-6 border border-dashed rounded-lg bg-muted/50 min-h-[200px]">
              <Users className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground text-center">
                Add a new patient to your list
              </p>
              <Button variant="outline" className="mt-4" asChild>
                <Link to="/doctor/patients/new">Add Patient</Link>
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}