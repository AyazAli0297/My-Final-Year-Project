import { useEffect, useState } from "react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { AppointmentCard } from "@/components/dashboard/AppointmentCard";
import { ReportCard } from "@/components/dashboard/ReportCard";
import { Button } from "@/components/ui/button";
import { FileText, Calendar, Upload, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

export default function Dashboard() {
  const { user, profile } = useAuth();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loadingAppointments, setLoadingAppointments] = useState(true);
  const [rescheduleId, setRescheduleId] = useState<string | null>(null);
  const [rescheduleForm, setRescheduleForm] = useState({ date: '', time: '' });
  const [rescheduling, setRescheduling] = useState(false);

  // Mock data for patient dashboard stats and reports (can be replaced later)
  const stats = [
    { title: "Total Reports", value: 12, icon: FileText },
    { title: "Upcoming Appointments", value: appointments.filter(apt => new Date(apt.appointment_date) >= new Date() && apt.status === 'scheduled').length, icon: Calendar },
    { title: "Pending Reports", value: 1, icon: Clock, trend: { value: 5, isPositive: false } },
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

  useEffect(() => {
    async function fetchAppointments() {
      if (!user || !profile || profile.role !== 'patient') return;
      setLoadingAppointments(true);
      try {
        // First, get the patient_id from the patients table using user.id
        const { data: patientData, error: patientError } = await supabase
          .from('patients')
          .select('id')
          .eq('user_id', user.id)
          .single();

        if (patientError || !patientData) {
          console.error("Error fetching patient ID:", patientError);
          // toast.error("Could not fetch your patient profile.");
          setLoadingAppointments(false);
          return;
        }

        const patientId = patientData.id;

        const { data, error } = await supabase
          .from('appointments')
          .select(`
            id,
            appointment_date,
            status,
            doctors ( id, first_name, last_name )
          `)
          .eq('patient_id', patientId)
          .order('appointment_date', { ascending: true });

        if (error) {
          console.error("Error fetching appointments:", error);
          // toast.error("Failed to fetch appointments.");
        } else {
          setAppointments(data || []);
        }
      } catch (err) {
        console.error("Unexpected error fetching appointments:", err);
        // toast.error("An unexpected error occurred.");
      } finally {
        setLoadingAppointments(false);
      }
    }

    fetchAppointments();
  }, [user, profile]);

  const upcomingAppointments = appointments
    .filter(apt => new Date(apt.appointment_date) >= new Date() && apt.status === 'scheduled')
    .map(apt => ({
      id: apt.id,
      doctorName: apt.doctors ? `${apt.doctors.first_name} ${apt.doctors.last_name}` : 'N/A',
      date: new Date(apt.appointment_date).toLocaleDateString(),
      time: new Date(apt.appointment_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'upcoming' as const, // Assuming status from DB matches or can be mapped
    }));

  // Cancel handler
  const handleCancel = async (id: string) => {
    const ok = window.confirm("Are you sure you want to cancel this appointment?");
    if (!ok) return;
    const { error } = await supabase.from('appointments').delete().eq('id', id);
    if (error) {
      toast.error("Failed to cancel appointment");
    } else {
      toast.success("Appointment cancelled");
      setAppointments((prev) => prev.filter((apt) => apt.id !== id));
    }
  };

  // Reschedule handler
  const handleReschedule = (id: string) => {
    setRescheduleId(id);
    setRescheduleForm({ date: '', time: '' });
  };

  const handleRescheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rescheduleId) return;
    setRescheduling(true);
    try {
      const newDate = `${rescheduleForm.date}T${rescheduleForm.time}`;
      const { error } = await supabase
        .from('appointments')
        .update({ appointment_date: newDate })
        .eq('id', rescheduleId);
      if (error) {
        toast.error("Failed to reschedule appointment");
      } else {
        toast.success("Appointment rescheduled");
        // Refresh appointments
        setAppointments((prev) =>
          prev.map((apt) =>
            apt.id === rescheduleId
              ? { ...apt, appointment_date: newDate }
              : apt
          )
        );
        setRescheduleId(null);
      }
    } finally {
      setRescheduling(false);
    }
  };

  return (
    <div className="space-y-8">
      <DashboardHeader
        heading="Dashboard"
        description={`Welcome back, ${profile?.name || 'User'}. Here's an overview of your health records.`}
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
            value={stat.title === "Upcoming Appointments" ? upcomingAppointments.length : stat.value}
            icon={stat.icon}
            trend={stat.trend}
          />
        ))}
      </div>
      
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Upcoming Appointments</h2>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/appointments/new">View all / Book New</Link>
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {loadingAppointments ? (
            <p>Loading appointments...</p>
          ) : upcomingAppointments.length > 0 ? (
            upcomingAppointments.map((apt) => (
              <AppointmentCard
                key={apt.id}
                id={apt.id}
                doctorName={apt.doctorName}
                date={apt.date}
                time={apt.time}
                status={apt.status}
                userRole="patient"
                onCancel={handleCancel}
                onReschedule={handleReschedule}
              />
            ))
          ) : (
            <p>No upcoming appointments.</p>
          )}
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
            <Link to="/upload">View all / Upload New</Link>
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

      {/* Reschedule Modal */}
      {rescheduleId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-xl font-bold text-gray-500 hover:text-gray-700"
              onClick={() => setRescheduleId(null)}
              aria-label="Close"
            >
              ×
            </button>
            <h2 className="text-2xl font-bold mb-4">Reschedule Appointment</h2>
            <form onSubmit={handleRescheduleSubmit} className="space-y-4">
              <div>
                <label className="block mb-1 font-medium" htmlFor="date">New Date</label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={rescheduleForm.date}
                  onChange={e => setRescheduleForm(f => ({ ...f, date: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-medium" htmlFor="time">New Time</label>
                <Input
                  id="time"
                  name="time"
                  type="time"
                  value={rescheduleForm.time}
                  onChange={e => setRescheduleForm(f => ({ ...f, time: e.target.value }))}
                  required
                />
              </div>
              <Button type="submit" className="w-full mt-2" disabled={rescheduling}>
                {rescheduling ? 'Rescheduling...' : 'Reschedule Appointment'}
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
