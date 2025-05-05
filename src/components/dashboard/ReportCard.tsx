
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileText, Download, Eye } from "lucide-react";
import { Link } from "react-router-dom";

type ReportCardProps = {
  id: string;
  title: string;
  description: string;
  date: string;
  imageUrl?: string;
  userRole: "patient" | "doctor";
  patientName?: string;
};

export function ReportCard({
  id,
  title,
  description,
  date,
  imageUrl,
  userRole,
  patientName,
}: ReportCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            {title}
          </CardTitle>
          <span className="text-xs text-muted-foreground">{date}</span>
        </div>
        {userRole === "doctor" && patientName && (
          <CardDescription>Patient: {patientName}</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        {imageUrl && (
          <div className="mb-3 w-full overflow-hidden rounded-md">
            <img
              src={imageUrl}
              alt="X-ray"
              className="h-32 w-full object-cover"
            />
          </div>
        )}
        <p className="text-sm line-clamp-2">{description}</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm" asChild>
          <Link to={`/reports/${id}`}>
            <Eye className="mr-2 h-4 w-4" /> View
          </Link>
        </Button>
        <Button variant="secondary" size="sm">
          <Download className="mr-2 h-4 w-4" /> Download
        </Button>
      </CardFooter>
    </Card>
  );
}
