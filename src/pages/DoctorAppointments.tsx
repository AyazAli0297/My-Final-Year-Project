import { useEffect, useState } from "react";
import { AppointmentCard } from "@/components/dashboard/AppointmentCard";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

export default function DoctorAppointments() {
  const { user, profile } = useAuth();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  // State for rescheduling
  const [reschedulingId, setReschedulingId] = useState<string | null>(null);
  const [rescheduleDateTime, setRescheduleDateTime] = useState({
    date: '',
    time: '',
  });

  // Handle Cancel action
  const handleCancel = async (appointmentId: string) => {
    const confirmCancel = window.confirm("Are you sure you want to cancel this appointment?");
    if (!confirmCancel) return;

    try {
      // Optional: Set a canceling state for the specific card
      // setAppointments(appointments.map(apt => apt.id === appointmentId ? { ...apt, status: 'canceling' } : apt));

      const { error } = await supabase
        .from('appointments')
        .update({ status: 'cancelled' })
        .eq('id', appointmentId);

      if (error) {
        console.error("Error canceling appointment:", error);
        // Optional: Revert state if update fails
        // setAppointments(appointments.map(apt => apt.id === appointmentId && apt.status === 'canceling' ? { ...apt, status: 'scheduled' } : apt));
        toast.error("Failed to cancel appointment.");
      } else {
        toast.success("Appointment cancelled successfully.");
        // Update the status in the local state
        setAppointments(appointments.map(apt =>
          apt.id === appointmentId ? { ...apt, status: 'cancelled' } : apt
        ));
      }
    } catch (error) {
      console.error("Unexpected error during cancellation:", error);
      toast.error("An unexpected error occurred.");
    }
  };

  // Handle Reschedule click
  const handleRescheduleClick = (appointmentId: string) => {
    setReschedulingId(appointmentId);
    // Optionally pre-fill with current appointment date/time if available in state
    const currentAppointment = appointments.find(apt => apt.id === appointmentId);
    if (currentAppointment) {
      const date = new Date(currentAppointment.appointment_date);
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      setRescheduleDateTime({
        date: `${year}-${month}-${day}`,
        time: `${hours}:${minutes}`,
      });
    } else {
      setRescheduleDateTime({ date: '', time: '' });
    }
  };

  // Handle Reschedule submit
  const handleRescheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reschedulingId || !rescheduleDateTime.date || !rescheduleDateTime.time) return;

    setLoading(true); // Use component's main loading or add a separate modal loading

    try {
      const newDateTime = `${rescheduleDateTime.date}T${rescheduleDateTime.time}:00Z`; // Assuming UTC

      const { data, error } = await supabase
        .from('appointments')
        .update({ appointment_date: newDateTime })
        .eq('id', reschedulingId)
        .select(); // Select the updated appointment to refresh state

      if (error) {
        console.error("Error rescheduling appointment:", error);
        toast.error("Failed to reschedule appointment.");
      } else if (data && data.length > 0) {
        toast.success("Appointment rescheduled successfully.");
        // Update the specific appointment in the local state
        setAppointments(appointments.map(apt =>
          apt.id === reschedulingId ? data[0] : apt
        ));
        setReschedulingId(null); // Close modal on success
      } else {
         // Handle case where update was successful but no data was returned (shouldn't happen with select())
         toast.success("Appointment rescheduled successfully (no data returned).");
         setReschedulingId(null); // Close modal
      }

    } catch (error) {
      console.error("Unexpected error during rescheduling:", error);
      toast.error("An unexpected error occurred.");
    } finally {
      setLoading(false); // Turn off loading
    }
  };

  useEffect(() => {
    async function fetchAppointments() {
      if (!user || !profile || profile.role !== 'doctor') return;
      setLoading(true);
      try {
        const { data: doctorData, error: doctorError } = await supabase
          .from('doctors')
          .select('id')
          .eq('user_id', user.id)
          .single();
        if (doctorError || !doctorData) {
          setLoading(false);
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
        setLoading(false);
      }
    }
    fetchAppointments();
  }, [user, profile]);

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">All Appointments</h1>
      {loading ? (
        <div className="text-center">Loading appointments...</div>
      ) : appointments.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {appointments.map((apt) => (
            <AppointmentCard
              key={apt.id}
              id={apt.id}
              patientName={apt.patients ? `${apt.patients.first_name} ${apt.patients.last_name}` : 'N/A'}
              date={new Date(apt.appointment_date).toLocaleDateString()}
              time={new Date(apt.appointment_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              status={apt.status}
              userRole="doctor"
              onCancel={handleCancel}
              onReschedule={handleRescheduleClick}
            />
          ))}
        </div>
      ) : (
        <div className="text-center">No appointments found.</div>
      )}

      {/* Reschedule Modal */}
      {reschedulingId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-xl font-bold text-gray-500 hover:text-gray-700"
              onClick={() => setReschedulingId(null)}
              aria-label="Close"
            >
              ×
            </button>
            <h2 className="text-2xl font-bold mb-4">Reschedule Appointment</h2>
            <form onSubmit={handleRescheduleSubmit} className="space-y-4">
              <div>
                <label className="block mb-1 font-medium" htmlFor="reschedule-date">New Date</label>
                <Input
                  id="reschedule-date"
                  name="date"
                  type="date"
                  value={rescheduleDateTime.date}
                  onChange={e => setRescheduleDateTime(f => ({ ...f, date: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-medium" htmlFor="reschedule-time">New Time</label>
                <Input
                  id="reschedule-time"
                  name="time"
                  type="time"
                  value={rescheduleDateTime.time}
                  onChange={e => setRescheduleDateTime(f => ({ ...f, time: e.target.value }))}
                  required
                />
              </div>
              <Button type="submit" className="w-full mt-2" disabled={loading}> {/* Use a separate loading state for the modal if needed */}
                Reschedule Appointment
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 