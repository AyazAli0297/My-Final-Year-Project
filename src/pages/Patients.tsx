import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, CalendarCheck, Stethoscope } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

const statusMap = {
  consulted: { label: "Consulted", color: "bg-green-100 text-green-800" },
  appointed: { label: "Appointed", color: "bg-yellow-100 text-yellow-800" },
  scheduled: { label: "Appointed", color: "bg-yellow-100 text-yellow-800" },
  completed: { label: "Consulted", color: "bg-green-100 text-green-800" },
};

type Patient = {
  id: string;
  first_name: string;
  last_name: string;
};
type Appointment = {
  id: string;
  appointment_date: string;
  status: string;
  reason?: string;
  patients?: Patient;
};

export default function Patients() {
  const { user, profile } = useAuth();
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPatients() {
      if (!user || !profile || profile.role !== 'doctor') return;
      setLoading(true);
      try {
        // Get doctor_id from doctors table using user.id
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
        // Fetch all appointments for this doctor, including patient info
        const { data: appointmentsRaw, error } = await supabase
          .from('appointments')
          .select(`
            id,
            appointment_date,
            status,
            reason,
            patients ( id, first_name, last_name )
          `)
          .eq('doctor_id', doctorId)
          .order('appointment_date', { ascending: false });
        if (error || !Array.isArray(appointmentsRaw)) {
          setPatients([]);
        } else {
          // Map to unique patients, showing their latest appointment
          const uniquePatients: Record<string, any> = {};
          for (const apt of appointmentsRaw) {
            let pat: any = apt.patients;
            if (Array.isArray(pat)) pat = pat[0];
            if (
              pat &&
              typeof pat === 'object' &&
              !Array.isArray(pat) &&
              typeof pat.id === 'string' &&
              typeof pat.first_name === 'string' &&
              typeof pat.last_name === 'string'
            ) {
              if (!uniquePatients[pat.id]) {
                uniquePatients[pat.id] = {
                  id: pat.id,
                  name: pat.first_name + ' ' + pat.last_name,
                  status: apt.status === 'completed' ? 'consulted' : 'appointed',
                  date: new Date(apt.appointment_date).toLocaleDateString(),
                  time: new Date(apt.appointment_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  details:
                    apt.status === 'completed'
                      ? `Consultation completed${apt.reason ? ' for ' + apt.reason : '.'}`
                      : `Appointment booked${apt.reason ? ' for ' + apt.reason : '.'}`,
                };
              }
            }
          }
          setPatients(Object.values(uniquePatients));
        }
      } catch (err) {
        setPatients([]);
      } finally {
        setLoading(false);
      }
    }
    fetchPatients();
  }, [user, profile]);

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold mb-4">Patients</h1>
      {loading ? (
        <div>Loading patients...</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {patients.length === 0 ? (
            <div className="text-muted-foreground">No patients found.</div>
          ) : (
            patients.map((patient) => (
              <Card key={patient.id}>
                <CardHeader className="flex flex-row items-center gap-3 pb-2">
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{patient.name}</CardTitle>
                    <Badge className={`text-xs px-2 py-1 rounded ${statusMap[patient.status]?.color || ''}`}>{statusMap[patient.status]?.label || patient.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 mb-2">
                    {patient.status === "consulted" ? (
                      <Stethoscope className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <CalendarCheck className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="text-sm">{patient.date} at {patient.time}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{patient.details}</p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
} 