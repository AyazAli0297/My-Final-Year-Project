import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import {
  addHours,
  format,
  parse,
  isValid,
  getDay,
  startOfDay,
  endOfDay,
} from 'date-fns';
import { DashboardShell } from '../components/layout/DashboardShell';

const AVATAR_PLACEHOLDER = 'https://ui-avatars.com/api/?name=Doctor&background=random';

export default function BookAppointment() {
  console.log('BookAppointment component rendering');
  const { user, profile } = useAuth();
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingDoctor, setBookingDoctor] = useState<any | null>(null);
  console.log('State variables initialized', { loading, bookingDoctor });
  const [form, setForm] = useState({ date: '', reason: '', time_slot: '' });
  const [submitting, setSubmitting] = useState(false);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([]);
  const [fetchingSlots, setFetchingSlots] = useState(false);

  const navigate = useNavigate();

  // Fetch all doctors
  useEffect(() => {
    console.log('Fetching doctors...');
    async function fetchDoctors() {
      setLoading(true);
      // Fetch doctors and their related available slots
      const { data, error } = await supabase.from('doctors').select('*, doctor_available_slots(*)');
      if (error) {
        toast.error('Failed to fetch doctors');
        console.error('Error fetching doctors:', error);
      } else {
        console.log('Doctors fetched:', data);
        setDoctors(data || []);
        console.log('Doctors data with slots:', data);
      }
      setLoading(false);
      console.log('Finished fetching doctors, loading set to false');
    }
    fetchDoctors();
  }, []);

  // Fetch current patient profile id
  const [patientId, setPatientId] = useState<string | null>(null);
  useEffect(() => {
    console.log('Fetching patient ID...');
    async function fetchPatientId() {
      if (user) {
        const { data, error } = await supabase
          .from('patients')
          .select('id')
          .eq('user_id', user.id)
          .single();
        if (data) {
          console.log('Patient ID fetched:', data.id);
          setPatientId(data.id);
        } else if (error) {
          console.error('Error fetching patient ID:', error);
        }
      } else {
        console.log('User not available, cannot fetch patient ID');
      }
    }
    fetchPatientId();
  }, [user]);

  useEffect(() => {
    console.log('Called fetchPatientProfile');
  }, [user, navigate]);

  const handleBookClick = (doctor: any) => {
    console.log('Book button clicked for doctor:', doctor);
    setBookingDoctor(doctor);
    setForm({ date: '', reason: '', time_slot: '' });
    console.log('Booking state reset, bookingDoctor set:', bookingDoctor);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    console.log('Form input changed:', e.target.name, e.target.value);
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Calculate available slots when date or doctor changes
  useEffect(() => {
    console.log('useEffect for calculating slots triggered', { date: form.date, bookingDoctor: !!bookingDoctor });
    async function calculateAvailableSlots() {
      if (!form.date || !bookingDoctor) {
        setAvailableTimeSlots([]);
        return;
      }

      setFetchingSlots(true);
      setAvailableTimeSlots([]); // Clear previous slots

      const selectedDate = parse(form.date, 'yyyy-MM-dd', new Date());
      if (!isValid(selectedDate)) {
        console.error('Invalid date selected:', form.date);
        setFetchingSlots(false);
        return;
      }

      const selectedWeekday = format(selectedDate, 'EEEE'); // e.g., "Monday"
      console.log('Selected weekday:', selectedWeekday);

      const doctorSlots = bookingDoctor.doctor_available_slots.filter((slot: any) =>
        slot.available_weekdays.includes(selectedWeekday)
      );

      if (doctorSlots.length === 0) {
        console.log('No recurring slots for selected weekday', selectedWeekday);
        setFetchingSlots(false);
        return;
      }

      // For simplicity, assume one slot per day for now
      const recurringSlot = doctorSlots[0];
      const [startHour, startMinute] = recurringSlot.start_time.split(':').map(Number);
      const [endHour, endMinute] = recurringSlot.end_time.split(':').map(Number);

      let currentSlotTime = new Date(selectedDate);
      currentSlotTime.setHours(startHour, startMinute, 0, 0);

      const endSlotTime = new Date(selectedDate);
      endSlotTime.setHours(endHour, endMinute, 0, 0);

      const generatedSlots = [];
      const slotDuration = 30; // Assuming 30-minute slots, can be made configurable

      while (currentSlotTime < endSlotTime) {
        generatedSlots.push(format(currentSlotTime, 'HH:mm'));
        currentSlotTime = addHours(currentSlotTime, slotDuration / 60);
      }

      const supabaseDateTimeFormat = `yyyy-MM-dd'T'HH:mm:ss.SSS'Z'`;

      // Fetch existing appointments for this doctor on this date
      try {
        const { data: existingAppointments, error: appointmentsError } = await supabase
          .from('appointments')
          .select('appointment_date')
          .eq('doctor_id', bookingDoctor.id)
          .gte('appointment_date', format(startOfDay(selectedDate), supabaseDateTimeFormat))
          .lte('appointment_date', format(endOfDay(selectedDate), supabaseDateTimeFormat));

        if (appointmentsError) {
          console.error('Error fetching existing appointments:', appointmentsError);
          // Continue generating slots even if fetching appointments fails
          setAvailableTimeSlots(generatedSlots); // Use generated slots if fetching appointments fails
        } else {
          const bookedTimes = existingAppointments?.map(appt => format(parse(appt.appointment_date, 'yyyy-MM-dd HH:mm:ssZ', new Date()), 'HH:mm')) || [];
          console.log('Booked times for this date:', bookedTimes);
          const trulyAvailableSlots = generatedSlots.filter(slot => !bookedTimes.includes(slot));
          setAvailableTimeSlots(trulyAvailableSlots);
        }
        console.log('Finished calculating slots', { generatedSlotsCount: generatedSlots.length, trulyAvailableSlotsCount: availableTimeSlots.length }); // Note: availableTimeSlots might not be updated immediately here due to state update async nature
      } finally {
        setFetchingSlots(false);
      }
    }

    calculateAvailableSlots();
  }, [form.date, bookingDoctor]); // Depend on form.date and bookingDoctor

  const handleSubmit = async (e: React.FormEvent) => {
    console.log('Submit button clicked');
    e.preventDefault();
    if (!patientId || !bookingDoctor || !form.date || !form.time_slot || !form.reason) {
      console.log('Validation failed', { patientId, bookingDoctor, date: form.date, time_slot: form.time_slot, reason: form.reason });
      toast.error('Please select a date, time, and provide a reason.');
      return;
    }
    setSubmitting(true);
    console.log('Submitting appointment...');

    try {
      const appointmentDateTime = `${form.date}T${form.time_slot}:00Z`;
      console.log('Appointment date-time to insert:', appointmentDateTime);

      const { error } = await supabase.from('appointments').insert([
        {
          doctor_id: bookingDoctor.id,
          patient_id: patientId,
          appointment_date: appointmentDateTime,
          status: 'scheduled',
          reason: form.reason,
        },
      ]);
      if (error) throw error;
      console.log('Appointment insertion successful');
      toast.success('Appointment booked successfully!');
      setBookingDoctor(null);
    } catch (error: any) {
      console.error('Appointment insertion failed:', error);
      toast.error(error.message || 'Failed to book appointment');
    } finally {
      setSubmitting(false);
      console.log('Finished submitting appointment, submitting set to false');
    }
  };

  console.log('Rendering modal with state:', {
    open: !!bookingDoctor,
    doctor: bookingDoctor,
    date: form.date,
    time_slot: form.time_slot,
  });

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Book an Appointment</h1>
      {loading ? (
        console.log('Displaying loading state'),
        <div className="text-center">Loading doctors...</div>
      ) : (
        console.log('Displaying doctor cards', { doctorsCount: doctors.length }),
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
                <div className="mb-2">
                  Available Slots:
                  {doctor.doctor_available_slots && doctor.doctor_available_slots.length > 0 ? (
                    <ul>
                      {doctor.doctor_available_slots.map((slot: any) => (
                        <li key={slot.id} className="text-sm text-muted-foreground">
                          {slot.available_weekdays.join(', ')}: {format(parse(slot.start_time, 'HH:mm:ss', new Date()), 'h:mm a')} - {format(parse(slot.end_time, 'HH:mm:ss', new Date()), 'h:mm a')}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-sm text-muted-foreground">No slots configured.</span>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={() => handleBookClick(doctor)} className="w-full">Book Appointment</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

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
                <label className="block mb-1 font-medium" htmlFor="time_slot">Available Time Slots</label>
                <Select
                  name="time_slot"
                  value={form.time_slot}
                  onValueChange={(value) => setForm({ ...form, time_slot: value })}
                  required
                  disabled={!form.date || fetchingSlots}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={fetchingSlots ? "Loading slots..." : "Select a time slot"} />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTimeSlots.length > 0 ? (
                      availableTimeSlots.map((slot) => (
                        <SelectItem key={slot} value={slot}>
                          {slot}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="-placeholder-" disabled>
                        {form.date ? (fetchingSlots ? "Loading slots..." : "No slots available") : "Select a date first"}
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
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