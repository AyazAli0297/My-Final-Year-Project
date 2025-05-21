import React, { useEffect, useState } from 'react';
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { AppointmentCard } from "@/components/dashboard/AppointmentCard";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function DoctorSchedule() {
  const { user, profile } = useAuth();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any | null>(null);
  const [newDateTime, setNewDateTime] = useState({
    date: '',
    time: '',
  });

  // Add state for adding new slots (weekly availability)
  const [newSlot, setNewSlot] = useState({
    selectedWeekdays: [] as string[],
    startTime: '',
    endTime: '',
  });
  const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const [addingSlot, setAddingSlot] = useState(false);
  const [availableSlots, setAvailableSlots] = useState<any[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(true);

  // Fetch doctor's upcoming appointments
  useEffect(() => {
    async function fetchUpcomingAppointments() {
      if (!user || !profile || profile.role !== 'doctor') {
        setLoading(false);
        return;
      }
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
          console.error("Error fetching doctor profile:", doctorError);
          toast.error("Could not fetch doctor profile.");
          return;
        }
        const doctorId = doctorData.id;

        const now = new Date().toISOString();

        // Fetch upcoming appointments
        const { data, error } = await supabase
          .from('appointments')
          .select(`
            id,
            appointment_date,
            status,
            patients ( id, first_name, last_name )
          `)
          .eq('doctor_id', doctorId)
          .gte('appointment_date', now) // Filter for upcoming appointments
          .order('appointment_date', { ascending: true });

        if (error) {
          console.error("Error fetching appointments:", error);
          setAppointments([]);
          toast.error("Failed to fetch upcoming appointments.");
        } else {
          setAppointments(data || []);
        }
      } catch (err) {
        console.error("Unexpected error fetching appointments:", err);
        setAppointments([]);
        toast.error("An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    }

    fetchUpcomingAppointments();
  }, [user, profile]); // Depend on user and profile

  // Fetch doctor's available slots
  async function fetchAvailableSlots() {
     if (!user || !profile || profile.role !== 'doctor') {
      setLoadingSlots(false);
      return;
    }
    setLoadingSlots(true);
     try {
      // Get doctor_id from doctors table using user.id
      const { data: doctorData, error: doctorError } = await supabase
        .from('doctors')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (doctorError || !doctorData) {
        setLoadingSlots(false);
        console.error("Error fetching doctor profile for slots:", doctorError);
        // toast.error("Could not fetch doctor profile for slots."); // Avoid too many toasts
        return;
      }
      const doctorId = doctorData.id;

       const { data, error } = await supabase
        .from('doctor_available_slots')
        .select('*')
        .eq('doctor_id', doctorId)
        .order('start_time', { ascending: true });

      if (error) {
        console.error("Error fetching available slots:", error);
        setAvailableSlots([]);
        toast.error("Failed to fetch available slots.");
      } else {
        setAvailableSlots(data || []);
      }

     } catch (err) {
       console.error("Unexpected error fetching available slots:", err);
       setAvailableSlots([]);
       toast.error("An unexpected error occurred while fetching slots.");
     } finally {
       setLoadingSlots(false);
     }
  }

  useEffect(() => {
    fetchAvailableSlots();
  }, [user, profile]); // Depend on user and profile

  const handleCancel = async (appointmentId: string) => {
    if (!confirm("Are you sure you want to cancel this appointment?")) return;

    setLoading(true); // Indicate loading while canceling
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status: 'cancelled' })
        .eq('id', appointmentId);

      if (error) throw error;

      toast.success('Appointment canceled successfully.');

      // Remove the canceled appointment from the local state immediately for responsiveness
      setAppointments(appointments.filter(apt => apt.id !== appointmentId));

    } catch (error: any) {
      console.error("Error canceling appointment:", error);
      toast.error('Failed to cancel appointment: ' + error.message);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const handleReschedule = (appointment: any) => {
    setSelectedAppointment(appointment);
    if (appointment?.appointment_date) {
      const aptDate = new Date(appointment.appointment_date);
      setNewDateTime({
        date: aptDate.toISOString().split('T')[0],
        time: aptDate.toTimeString().split(' ')[0].substring(0, 5),
      });
    } else {
       setNewDateTime({ date: '', time: '' });
    }
    setIsRescheduleModalOpen(true);
  };

  const handleRescheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAppointment || !newDateTime.date || !newDateTime.time) return;

    setLoading(true); // Indicate loading while rescheduling
    const newAppointmentDate = `${newDateTime.date}T${newDateTime.time}:00Z`; // Assuming UTC for timestamp

    try {
      const { error } = await supabase
        .from('appointments')
        .update({ appointment_date: newAppointmentDate, status: 'scheduled' }) // Assuming status goes back to scheduled on reschedule
        .eq('id', selectedAppointment.id);

      if (error) throw error;

      toast.success('Appointment rescheduled successfully.');
      setIsRescheduleModalOpen(false);
      // The useEffect will refetch appointments, or we can update local state if realtime is implemented

    } catch (error: any) {
      console.error("Error rescheduling appointment:", error);
      toast.error('Failed to reschedule appointment: ' + error.message);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // Handle adding a new slot
  const handleAddSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !profile || profile.role !== 'doctor') return;
    if (!newSlot.selectedWeekdays.length || !newSlot.startTime || !newSlot.endTime) {
      toast.error("Please fill in all slot details.");
      return;
    }

    setAddingSlot(true);

    try {
      // Get doctor_id
       const { data: doctorData, error: doctorError } = await supabase
          .from('doctors')
          .select('id')
          .eq('user_id', user.id)
          .single();

        if (doctorError || !doctorData) {
          setAddingSlot(false);
          console.error("Error fetching doctor profile for adding slot:", doctorError);
          toast.error("Could not add slot: doctor profile not found.");
          return;
        }
        const doctorId = doctorData.id;

      // Insert the new recurring slot rule directly
      const { error } = await supabase
        .from('doctor_available_slots')
        .insert([
          {
            doctor_id: doctorId,
            available_weekdays: newSlot.selectedWeekdays, // Insert the array of weekdays
            start_time: newSlot.startTime,
            end_time: newSlot.endTime,
          },
        ]);

      if (error) throw error;

      toast.success('Availability slot added successfully!');
      setNewSlot({ selectedWeekdays: [], startTime: '', endTime: '' }); // Clear form
      // Refetch slots to update the list
      fetchAvailableSlots();

    } catch (error: any) {
      console.error("Error adding slot:", error);
      toast.error('Failed to add availability slot: ' + error.message);
    } finally {
      setAddingSlot(false);
    }
  };

  // Handle deleting a slot
   const handleDeleteSlot = async (slotId: string) => {
    if (!confirm("Are you sure you want to remove this availability slot?")) return;

    setLoadingSlots(true); // Indicate loading while deleting
    try {
      const { error } = await supabase
        .from('doctor_available_slots')
        .delete()
        .eq('id', slotId);

      if (error) throw error;

      toast.success('Availability slot removed successfully.');
      // Remove the deleted slot from the local state
      setAvailableSlots(availableSlots.filter(slot => slot.id !== slotId));

    } catch (error: any) {
      console.error("Error removing slot:", error);
      toast.error('Failed to remove availability slot: ' + error.message);
    } finally {
      setLoadingSlots(false); // Stop loading
    }
   };

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Manage Doctor Schedule</h1>

      {/* Section to Add New Slots */}
      <div className="mb-8 p-6 border rounded-lg">
        <h2 className="text-xl font-bold mb-4">Add New Availability Slot</h2>
        <form onSubmit={handleAddSlot} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          {/* Weekday Selection */}
          <div className="col-span-full">
             <label className="block text-sm font-medium mb-1">Available Weekdays</label>
             <div className="flex flex-wrap gap-2">
               {weekdays.map(day => (
                 <Button
                   key={day}
                   variant={newSlot.selectedWeekdays.includes(day) ? "default" : "outline"}
                   type="button"
                   onClick={() => {
                     setNewSlot(prev => ({
                       ...prev,
                       selectedWeekdays: prev.selectedWeekdays.includes(day)
                         ? prev.selectedWeekdays.filter(d => d !== day)
                         : [...prev.selectedWeekdays, day]
                     }));
                   }}
                 >
                   {day}
                 </Button>
               ))}
             </div>
          </div>
           {/* Date Range (Removed) */}
           {/* Time Inputs */}
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="start-time">Start Time</label>
            <input
              id="start-time"
              type="time"
              value={newSlot.startTime}
              onChange={(e) => setNewSlot({ ...newSlot, startTime: e.target.value })}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="end-time">End Time</label>
            <input
              id="end-time"
              type="time"
              value={newSlot.endTime}
              onChange={(e) => setNewSlot({ ...newSlot, endTime: e.target.value })}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          <Button type="submit" disabled={addingSlot}>
            {addingSlot ? 'Adding...' : 'Add Slot'}
          </Button>
        </form>
      </div>

      {/* Section to Display Available Slots */}
      <div className="mb-8">
         <h2 className="text-xl font-bold mb-4">Available Slots</h2>
         {loadingSlots ? (
            <div className="text-center">Loading available slots...</div>
         ) : availableSlots.length > 0 ? (
            <div className="space-y-4">
               {availableSlots.map(slot => (
                  <div key={slot.id} className="flex justify-between items-center p-4 border rounded-lg">
                     <div>
                        <p className="font-medium">{Array.isArray(slot.available_weekdays) ? slot.available_weekdays.join(', ') : 'N/A'}</p>
                        <p className="text-sm text-muted-foreground">{slot.start_time} - {slot.end_time}</p>
                     </div>
                     <Button variant="destructive" size="sm" onClick={() => handleDeleteSlot(slot.id)}>
                        Remove
                     </Button>
                  </div>
               ))}
            </div>
         ) : (
            <div className="text-center">No available slots added yet.</div>
         )}
      </div>

      {/* Section to Display Booked Appointments */}
      <div className="mb-8">
         <h2 className="text-xl font-bold mb-4">Booked Appointments</h2>
         {loading && !isRescheduleModalOpen ? (
           <div className="text-center">Loading booked appointments...</div>
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
                 onCancel={() => handleCancel(apt.id)}
                 onReschedule={() => handleReschedule(apt)}
               />
             ))}
           </div>
         ) : (
           <div className="text-center">No booked appointments found.</div>
         )}
      </div>

      {/* Reschedule Modal */}
      {isRescheduleModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-xl font-bold text-gray-500 hover:text-gray-700"
              onClick={() => setIsRescheduleModalOpen(false)}
              aria-label="Close"
            >
              ×
            </button>
            <h2 className="text-2xl font-bold mb-4">Reschedule Appointment</h2>
            {selectedAppointment && (
              <p className="mb-4">with {selectedAppointment.patients ? `${selectedAppointment.patients.first_name} ${selectedAppointment.patients.last_name}` : 'N/A'}</p>
            )}
            <form onSubmit={handleRescheduleSubmit} className="space-y-4">
              <div>
                <label className="block mb-1 font-medium" htmlFor="reschedule-date">New Date</label>
                <input
                  id="reschedule-date"
                  name="date"
                  type="date"
                  value={newDateTime.date}
                  onChange={(e) => setNewDateTime({ ...newDateTime, date: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-medium" htmlFor="reschedule-time">New Time</label>
                <input
                  id="reschedule-time"
                  name="time"
                  type="time"
                  value={newDateTime.time}
                  onChange={(e) => setNewDateTime({ ...newDateTime, time: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
              </div>
              <Button type="submit" className="w-full mt-2" disabled={loading}>
                {loading ? 'Rescheduling...' : 'Confirm Reschedule'}
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 