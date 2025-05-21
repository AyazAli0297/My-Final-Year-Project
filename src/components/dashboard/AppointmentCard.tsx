import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar, Clock, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

type AppointmentCardProps = {
  id: string;
  doctorName?: string;
  patientName?: string;
  date: string;
  time: string;
  status: "upcoming" | "completed" | "canceled" | "scheduled";
  userRole: "patient" | "doctor";
  onCancel?: (id: string) => void;
  onReschedule?: (id: string) => void;
};

export function AppointmentCard({
  id,
  doctorName,
  patientName,
  date,
  time,
  status,
  userRole,
  onCancel,
  onReschedule,
}: AppointmentCardProps) {
  const getStatusColor = () => {
    switch (status) {
      case "upcoming":
      case "scheduled":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "canceled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    }
  };

  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">
            {userRole === "patient" ? "Dr. " + doctorName : patientName}
          </CardTitle>
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{date}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{time}</span>
          </div>
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              {userRole === "patient" ? `Your doctor: ${doctorName}` : `Patient: ${patientName}`}
            </span>
          </div>
        </div>
      </CardContent>
      {(status === "upcoming" || status === "scheduled") && userRole === "doctor" && (
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={() =>
              // Use onReschedule prop if provided, otherwise navigate
              onReschedule ? onReschedule(id) : navigate(`/doctor/appointments/${id}/reschedule`)
            }
          >
            Reschedule
          </Button>
          <Button
            variant="destructive"
            onClick={() =>
              // Use onCancel prop if provided, otherwise navigate
              onCancel ? onCancel(id) : navigate(`/doctor/appointments/${id}/cancel`)
            }
          >
            Cancel
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}