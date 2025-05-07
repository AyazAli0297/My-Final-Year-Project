import { useParams } from "react-router-dom";

export default function RescheduleAppointment() {
  const { id } = useParams();
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold mb-4">Reschedule Appointment</h1>
      <p className="text-muted-foreground">Reschedule appointment with ID: <span className="font-mono">{id}</span> (To be implemented)</p>
    </div>
  );
} 