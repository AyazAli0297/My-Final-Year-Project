import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const AVATAR_PLACEHOLDER = 'https://ui-avatars.com/api/?name=Doctor&background=random';

export default function BookAppointment() {
  const { user, profile } = useAuth();
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingDoctor, setBookingDoctor] = useState<any | null>(null);
  const [form, setForm] = useState({ date: '', time: '', reason: '' });
  const [submitting, setSubmitting] = useState(false);

  // Fetch all doctors
  useEffect(() => {
    async function fetchDoctors() {
      setLoading(true);
      const { data, error } = await supabase.from('doctors').select('*');
      if (error) {
        toast.error('Failed to fetch doctors');
      } else {
        setDoctors(data || []);
      }
      setLoading(false);
    }
    fetchDoctors();
  }, []);

  // Fetch current patient profile id
  const [patientId, setPatientId] = useState<string | null>(null);
  useEffect(() => {
    async function fetchPatientId() {
      if (user) {
        const { data, error } = await supabase
          .from('patients')
          .select('id')
          .eq('user_id', user.id)
          .single();
        if (data) setPatientId(data.id);
      }
    }
    fetchPatientId();
  }, [user]);

  const handleBookClick = (doctor: any) => {
    setBookingDoctor(doctor);
    setForm({ date: '', time: '', reason: '' });
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientId) {
      toast.error('Patient profile not found.');
      return;
    }
    setSubmitting(true);
    try {
      const appointmentDate = `${form.date}T${form.time}`;
      const { error } = await supabase.from('appointments').insert([
        {
          doctor_id: bookingDoctor.id,
          patient_id: patientId,
          appointment_date: appointmentDate,
          status: 'scheduled',
          reason: form.reason,
        },
      ]);
      if (error) throw error;
      toast.success('Appointment booked successfully!');
      setBookingDoctor(null);
    } catch (error: any) {
      toast.error(error.message || 'Failed to book appointment');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Book an Appointment</h1>
      {loading ? (
        <div className="text-center">Loading doctors...</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {doctors.map((doctor) => (
            <Card key={doctor.id} className="flex flex-col justify-between">
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <img
                  src={doctor.avatar_url || AVATAR_PLACEHOLDER}
                  alt="Doctor Avatar"
                  className="h-16 w-16 rounded-full object-cover border"
                />
                <div>
                  <CardTitle>Dr. {doctor.first_name} {doctor.last_name}</CardTitle>
                  <div className="text-muted-foreground text-sm mt-1">{doctor.specialization}</div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-2">Experience: {doctor.experience_years} years</div>
                <div className="mb-2">License: {doctor.license_number}</div>
                <div className="mb-2">Contact: {doctor.contact_number}</div>
                <div className="mb-2">City: {doctor.city || 'N/A'}</div>
              </CardContent>
              <CardFooter>
                <Button onClick={() => handleBookClick(doctor)} className="w-full">Book Appointment</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Booking Modal/Form */}
      {bookingDoctor && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-xl font-bold text-gray-500 hover:text-gray-700"
              onClick={() => setBookingDoctor(null)}
              aria-label="Close"
            >
              ×
            </button>
            <h2 className="text-2xl font-bold mb-4">Book with Dr. {bookingDoctor.first_name} {bookingDoctor.last_name}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-1 font-medium" htmlFor="date">Date</label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={form.date}
                  onChange={handleFormChange}
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-medium" htmlFor="time">Time</label>
                <Input
                  id="time"
                  name="time"
                  type="time"
                  value={form.time}
                  onChange={handleFormChange}
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-medium" htmlFor="reason">Reason</label>
                <Input
                  id="reason"
                  name="reason"
                  type="text"
                  value={form.reason}
                  onChange={handleFormChange}
                  placeholder="Reason for appointment"
                  required
                />
              </div>
              <Button type="submit" className="w-full mt-2" disabled={submitting}>
                {submitting ? 'Booking...' : 'Book Appointment'}
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 