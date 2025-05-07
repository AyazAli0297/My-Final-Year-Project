import { useEffect, useState } from "react";
import { AppointmentCard } from "@/components/dashboard/AppointmentCard";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

export default function DoctorAppointments() {
  const { user, profile } = useAuth();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
              // onCancel and onReschedule will be added next
            />
          ))}
        </div>
      ) : (
        <div className="text-center">No appointments found.</div>
      )}
    </div>
  );
} 