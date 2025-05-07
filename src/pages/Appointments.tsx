import { useEffect, useState } from "react";
import { AppointmentCard } from "@/components/dashboard/AppointmentCard";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Appointments() {
  const { user, profile } = useAuth();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [rescheduleId, setRescheduleId] = useState<string | null>(null);
  const [rescheduleForm, setRescheduleForm] = useState({ date: '', time: '' });
  const [rescheduling, setRescheduling] = useState(false);

  const fetchAppointments = async () => {
    if (!user || !profile || profile.role !== 'patient') return;
    setLoading(true);
    try {
      // Get patient_id from patients table using user.id
      const { data: patientData, error: patientError } = await supabase
        .from('patients')
        .select('id')
        .eq('user_id', user.id)
        .single();
      if (patientError || !patientData) {
        setLoading(false);
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
        setAppointments([]);
      } else {
        setAppointments(data || []);
      }
    } catch (err) {
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [user, profile]);

  // Cancel handler
  const handleCancel = async (id: string) => {
    const ok = window.confirm("Are you sure you want to cancel this appointment?");
    if (!ok) return;
    const { error } = await supabase.from('appointments').delete().eq('id', id);
    if (error) {
      toast.error("Failed to cancel appointment: " + error.message);
      console.error("Cancel error:", error);
    } else {
      toast.success("Appointment cancelled");
      await fetchAppointments();
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
        toast.error("Failed to reschedule appointment: " + error.message);
        console.error("Reschedule error:", error);
      } else {
        toast.success("Appointment rescheduled");
        setRescheduleId(null);
        await fetchAppointments();
      }
    } finally {
      setRescheduling(false);
    }
  };

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">My Appointments</h1>
      {loading ? (
        <div className="text-center">Loading appointments...</div>
      ) : appointments.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {appointments.map((apt) => (
            <AppointmentCard
              key={apt.id}
              id={apt.id}
              doctorName={apt.doctors ? `${apt.doctors.first_name} ${apt.doctors.last_name}` : 'N/A'}
              date={new Date(apt.appointment_date).toLocaleDateString()}
              time={new Date(apt.appointment_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              status={apt.status}
              userRole="patient"
              onCancel={handleCancel}
              onReschedule={handleReschedule}
            />
          ))}
        </div>
      ) : (
        <div className="text-center">No appointments found.</div>
      )}
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