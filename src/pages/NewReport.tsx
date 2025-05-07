import { DashboardShell } from "@/components/layout/DashboardShell";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileText } from "lucide-react";
import { useState } from "react";

export default function NewReport() {
  // Sample patient data (to be replaced with API data later)
  const patients = [
    { id: "PAT-001", name: "Michael Brown" },
    { id: "PAT-002", name: "Sarah Williams" },
    { id: "PAT-003", name: "David Miller" },
  ];

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    patientId: "",
    image: null as File | null,
  });
  const [loading, setLoading] = useState(false);
  const [aiCaption, setAiCaption] = useState("");
  const [error, setError] = useState("");

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
    setLoading(true);
    try {
      // Send image to AI captioning API
      const apiUrl = "http://localhost:8001/caption";
      const form = new FormData();
      form.append("file", formData.image);
      const response = await fetch(apiUrl, {
        method: "POST",
        body: form,
      });
      if (!response.ok) {
        throw new Error("Failed to generate AI caption.");
      }
      const data = await response.json();
      setAiCaption(data.caption || "");
      setFormData((prev) => ({ ...prev, description: data.caption || "" }));
    } catch (err: any) {
      setError(err.message || "An error occurred while generating the caption.");
    } finally {
      setLoading(false);
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

            {/* Patient Selection */}
            <div className="space-y-2">
              <Label htmlFor="patientId" className="text-sm font-medium">
                Select Patient
              </Label>
              <select
                id="patientId"
                name="patientId"
                value={formData.patientId}
                onChange={handleInputChange}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                required
              >
                <option value="" disabled>
                  Choose a patient
                </option>
                {patients.map((patient) => (
                  <option key={patient.id} value={patient.id}>
                    {patient.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Description (AI-generated, editable) */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">
                Description (AI-generated, editable)
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter report details, e.g., AI analysis or observations..."
                className="w-full min-h-[120px]"
                required
              />
              {aiCaption && (
                <p className="text-xs text-green-700 mt-1">AI Caption generated. You can review and edit before saving.</p>
              )}
            </div>

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
            </div>
          </div>

          {/* Error and Loading States */}
          {error && <p className="text-sm text-red-600">{error}</p>}
          {loading && <p className="text-sm text-blue-600">Generating AI caption...</p>}

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                setFormData({ title: "", description: "", patientId: "", image: null })
              }
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              <FileText className="mr-2 h-4 w-4" /> Generate AI Caption
            </Button>
          </div>
        </form>
      </div>
    </DashboardShell>
  );
}// export default function NewReport() {
//   return (
//     <div className="space-y-8">
//       <h1 className="text-2xl font-bold mb-4">Create New Report</h1>
//       <p className="text-muted-foreground">This is where you can create a new report. (To be implemented)</p>
//     </div>
//   );
// } 