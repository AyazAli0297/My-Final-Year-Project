import { DashboardShell } from "@/components/layout/DashboardShell";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileText } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export default function NewReport() {
  const { user } = useAuth();
  const [doctorId, setDoctorId] = useState<string | null>(null);

  // Sample patient data (to be replaced with API data later)
  // const patients = [
  //   { id: "PAT-001", name: "Michael Brown" },
  //   { id: "PAT-002", name: "Sarah Williams" },
  //   { id: "PAT-003", name: "David Miller" },
  // ];

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    patientId: "",
    image: null as File | null,
    patientName: "",
  });
  const [loading, setLoading] = useState(false);
  const [aiCaption, setAiCaption] = useState("");
  const [error, setError] = useState("");
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchDoctorId() {
      if (user) {
        const { data, error } = await supabase
          .from('doctors')
          .select('id')
          .eq('user_id', user.id)
          .single();
        if (data) {
          setDoctorId(data.id);
        } else if (error) {
          console.error('Error fetching doctor ID:', error);
          toast.error('Could not fetch doctor profile.');
        }
      } else {
         setDoctorId(null);
      }
    }
    fetchDoctorId();
  }, [user]);

  // Handle input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, image: file }));
    setAiCaption("");
    setError("");
    setFormData((prev) => ({ ...prev, description: "" }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setAiCaption("");
    if (!formData.image) {
      setError("Please upload an X-ray image to generate a report.");
      return;
    }
    if (!doctorId) {
      setError("Doctor information not available. Cannot generate report.");
      console.error("Generate report prevented: Doctor ID missing.");
      return;
    }

    setLoading(true);
    let generatedCaption = "";
    let xrayImageUrl = null;

    try {
      const fileExt = formData.image.name.split('.').pop();
      const storagePath = `doctor_reports/${doctorId}/${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;

      console.log("Attempting to upload image to Supabase Storage...");
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('xrays')
        .upload(storagePath, formData.image);
      console.log("Image upload attempt finished.", { uploadData, uploadError });

      if (uploadError) {
        console.error("Error uploading image to storage:", uploadError);
        setError("Failed to upload X-ray image.");
        setLoading(false); // Ensure loading is turned off on upload error
        return;
      }

       console.log("Attempting to get public URL...");
       const result = supabase.storage.from('xrays').getPublicUrl(storagePath);
       xrayImageUrl = result.data?.publicUrl || null;
       console.log("Get public URL finished.", { xrayImageUrl });

       if (!xrayImageUrl) {
           console.error("Could not get public URL for uploaded file.");
           setError("Could not get public URL for uploaded X-ray."); // Add UI error
           setLoading(false); // Ensure loading is turned off if URL is null
           return; // Stop the process if URL is null
       }

      console.log("Attempting to call FastAPI for caption generation...");
      const apiUrl = "http://127.0.0.1:8000/caption";
      const form = new FormData();
      form.append("file", formData.image);
      const response = await fetch(apiUrl, {
        method: "POST",
        body: form,
      });
      if (!response.ok) {
         const errorBody = await response.text();
         console.error("API Error Response:", response.status, errorBody);
        throw new Error("Failed to generate AI caption.");
      }
      const data = await response.json();
      generatedCaption = data.caption || "";
      setAiCaption(generatedCaption);
      setFormData((prev) => ({ ...prev, description: generatedCaption }));

      const reportData = {
          doctor_id: doctorId,
          patient_id: null,
          xray_image_url: xrayImageUrl,
          ai_analysis_result: {
            title: formData.title || 'AI Analysis Report',
            caption: generatedCaption,
          },
      };

      const { data: reportInsertData, error: reportInsertError } = await supabase
          .from('reports')
          .insert([reportData])
          .select();

      if (reportInsertError) {
          console.error("Error saving report to database:", reportInsertError);
          setError("Failed to save report to database.");
      } else {
          console.log("Report saved successfully:", reportInsertData);
          toast.success("Report saved successfully!");
      }

    } catch (err: any) {
      console.error("Overall process error:", err);
      setError(err.message || "An error occurred during report generation.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (reportRef.current) {
      const canvas = await html2canvas(reportRef.current);
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("report.pdf");
    }
  };

  return (
    <DashboardShell userRole="doctor">
      <DashboardHeader
        heading="Create New Report"
        description="Fill in the details to create a new medical report."
      >
        <Button variant="outline" asChild>
          <a href="/doctor/reports">
            <FileText className="mr-2 h-4 w-4" /> View Reports
          </a>
        </Button>
      </DashboardHeader>
      <div className="space-y-8 p-6">
        <div ref={reportRef} style={{ background: '#fff', padding: 24, borderRadius: 8 }}>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-medium">
                  Report Title
                </Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Chest X-ray Analysis"
                  className="w-full"
                  required
                />
              </div>

              {/* Removed Patient Name Input */}
              {/* <div className="space-y-2">
                <Label htmlFor="patientName" className="text-sm font-medium">
                  Patient Name
                </Label>
                <Input
                  id="patientName"
                  name="patientName"
                  value={formData.patientName || ''}
                  onChange={handleInputChange}
                  placeholder="Enter patient name" // Hint for doctor
                  className="w-full"
                  required
                />
              </div> */}

              {/* Image Upload */}
              <div className="space-y-2">
                <Label htmlFor="image" className="text-sm font-medium">
                  Upload Image (e.g., X-ray)
                </Label>
                <Input
                  id="image"
                  name="image"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full"
                />
                {formData.image && (
                  <p className="text-sm text-muted-foreground">
                    Selected: {formData.image.name}
                  </p>
                )}
                {/* Findings below image - always show if aiCaption is available */}
                {aiCaption && (
                  <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded text-green-900">
                    <div className="font-semibold mb-1">Findings:</div>
                    <div className="whitespace-pre-line">{aiCaption}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Error and Loading States */}
            {error && <p className="text-sm text-red-600">{error}</p>}
            {loading && <p className="text-sm text-blue-600">Processing report...</p>}

            {/* Submit Button */}
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  setFormData({ title: "", description: "", patientId: "", image: null, patientName: "" })
                }
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                <FileText className="mr-2 h-4 w-4" /> {loading ? 'Generating...' : 'Generate Findings'}
              </Button>
            </div>
          </form>
        </div>
        {/* The Download PDF button - will be visible if report is saved/captioned */}
         {aiCaption && (
           <Button onClick={handleDownloadPDF} variant="default" className="mt-4">
             Download as PDF
           </Button>
         )}
      </div>
    </DashboardShell>
  );
}

// export default function NewReport() {
//   return (
//     <div className="space-y-8">
//       <h1 className="text-2xl font-bold mb-4">Create New Report</h1>
//       <p className="text-muted-foreground">This is where you can create a new report. (To be implemented)</p>
//     </div>
//   );
// } 