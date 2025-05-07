import { DashboardShell } from "@/components/layout/DashboardShell";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "lucide-react";
import { useState } from "react";

export default function NewAppointment() {
  // Sample appointment types
  const appointmentTypes = ["Consultation", "Follow-up", "Emergency"];

  // Form state
  const [formData, setFormData] = useState({
    patientName: "",
    date: "",
    time: "",
    appointmentType: "",
    notes: "",
  });

  // Handle input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Log form data for now (replace with API call later)
    console.log("Appointment submitted:", formData);
    // Reset form
    setFormData({
      patientName: "",
      date: "",
      time: "",
      appointmentType: "",
      notes: "",
    });
  };

  return (
    <DashboardShell userRole="doctor">
      <DashboardHeader
        heading="Book New Appointment"
        description="Schedule a new appointment for a patient."
      >
        <Button variant="outline" asChild>
          <a href="/doctor/appointments">
            <Calendar className="mr-2 h-4 w-4" /> View Appointments
          </a>
        </Button>
      </DashboardHeader>
      <div className="space-y-8 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4">
            {/* Patient Name */}
            <div className="space-y-2">
              <Label htmlFor="patientName" className="text-sm font-medium">
                Patient Name
              </Label>
              <Input
                id="patientName"
                name="patientName"
                value={formData.patientName}
                onChange={handleInputChange}
                placeholder="e.g., Michael Brown"
                className="w-full"
                required
              />
            </div>

            {/* Date */}
            <div className="space-y-2">
              <Label htmlFor="date" className="text-sm font-medium">
                Appointment Date
              </Label>
              <Input
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleInputChange}
                className="w-full"
                required
              />
            </div>

            {/* Time */}
            <div className="space-y-2">
              <Label htmlFor="time" className="text-sm font-medium">
                Appointment Time
              </Label>
              <Input
                id="time"
                name="time"
                type="time"
                value={formData.time}
                onChange={handleInputChange}
                className="w-full"
                required
              />
            </div>

            {/* Appointment Type */}
            <div className="space-y-2">
              <Label htmlFor="appointmentType" className="text-sm font-medium">
                Appointment Type
              </Label>
              <select
                id="appointmentType"
                name="appointmentType"
                value={formData.appointmentType}
                onChange={handleInputChange}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                required
              >
                <option value="" disabled>
                  Choose appointment type
                </option>
                {appointmentTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes" className="text-sm font-medium">
                Notes (Optional)
              </Label>
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Add any additional notes about the appointment..."
                className="w-full min-h-[120px]"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                setFormData({
                  patientName: "",
                  date: "",
                  time: "",
                  appointmentType: "",
                  notes: "",
                })
              }
            >
              Cancel
            </Button>
            <Button type="submit">
              <Calendar className="mr-2 h-4 w-4" /> Book Appointment
            </Button>
          </div>
        </form>
      </div>
    </DashboardShell>
  );
}
// export default function NewAppointment() {
//   return (
//     <div className="space-y-8">
//       <h1 className="text-2xl font-bold mb-4">Book New Appointment</h1>
//       <p className="text-muted-foreground">This is where you can book a new appointment. (To be implemented)</p>
//     </div>
//   );
// } 