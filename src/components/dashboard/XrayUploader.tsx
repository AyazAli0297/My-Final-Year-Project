import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, X, FileImage } from "lucide-react";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

export function XrayUploader() {
  const { user } = useAuth();
  const [patientId, setPatientId] = useState<string | null>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [aiCaption, setAiCaption] = useState("");
  const [captionLoading, setCaptionLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function fetchPatientId() {
      if (user) {
        const { data, error } = await supabase
          .from('patients')
          .select('id')
          .eq('user_id', user.id)
          .single();
        if (data) {
          setPatientId(data.id);
        } else if (error) {
          console.error('Error fetching patient ID:', error);
        }
      } else {
         setPatientId(null);
      }
    }
    fetchPatientId();
  }, [user]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size should be less than 10MB');
      return;
    }

    setFile(file);

    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const clearFile = () => {
    setFile(null);
    setPreview(null);
    setAiCaption("");
  };

  const uploadFile = async () => {
    if (!file) {
        toast.error("No file selected for upload.");
        return;
    }
    if (!user || !patientId) {
        toast.error("User or patient information not available. Cannot upload.");
        console.error("Upload prevented: User or patient ID missing.");
        return;
    }


    try {
      setIsUploading(true);
      setUploadProgress(0);
      setAiCaption("");
      setCaptionLoading(false);

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
      const filePath = `xrays/${fileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('xrays')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      setUploadProgress(100);
      toast.success('X-ray image uploaded successfully!');

       const result = supabase.storage.from('xrays').getPublicUrl(filePath);
       const publicUrl = result.data?.publicUrl;

       if (!publicUrl) {
           console.error("Could not get public URL for uploaded file.");
       }

       const xrayImageUrl = publicUrl || null;


      setCaptionLoading(true);
      let generatedCaption = "";
      try {
        const apiUrl = "http://127.0.0.1:8000/caption";
        const formData = new FormData();
        formData.append("file", file);
        const response = await fetch(apiUrl, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
            const errorBody = await response.text();
            console.error("API Error Response:", response.status, errorBody);
            throw new Error(`Failed to generate AI caption: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        generatedCaption = data.caption || "";
        setAiCaption(generatedCaption);

      } catch (err) {
        console.error("AI Captioning error:", err);
        setAiCaption("Failed to generate AI caption.");
      } finally {
        setCaptionLoading(false);
      }

      try {
          if (!patientId) {
              console.error("Patient ID not available after fetch. Cannot save report.");
               toast.error("Could not save report: Patient information missing.");
               return;
          }

          const reportData = {
              patient_id: patientId,
              xray_image_url: xrayImageUrl,
              ai_analysis_result: generatedCaption ? { caption: generatedCaption } : { error: "Caption generation failed" },
          };

          const { data: reportInsertData, error: reportInsertError } = await supabase
              .from('reports')
              .insert([reportData])
              .select();

          if (reportInsertError) {
              console.error("Error saving report to database:", reportInsertError);
              toast.error("Failed to save report to database.");
          } else {
              console.log("Report saved successfully:", reportInsertData);
              toast.success("Report saved successfully!");
          }

      } catch (dbError) {
          console.error("Unexpected error during database save:", dbError);
          toast.error("An error occurred while saving the report.");
      }

       clearFile();


    } catch (error: any) {
      console.error('Overall process error:', error);
      toast.error(error.message || 'An unexpected error occurred during processing.');
    } finally {
      // Ensure loading states are turned off after the process completes
      setIsUploading(false);
      setCaptionLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Upload X-ray Image</CardTitle>
        <CardDescription>
          Upload your X-ray image for analysis
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!file ? (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-12 text-center ${
              isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/20'
            } transition-all`}
          >
            <div className="flex flex-col items-center gap-4">
              <div className="rounded-full bg-primary/10 p-4">
                <Upload className="h-8 w-8 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="font-medium">Drag and drop your X-ray image</h3>
                <p className="text-sm text-muted-foreground">
                  Supports: JPG, PNG (Max size: 10MB)
                </p>
              </div>
              <span className="text-sm text-muted-foreground">or</span>
              <div>
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <FileImage className="mr-2 h-4 w-4" />
                  Browse files
                </Button>
                <input
                  ref={fileInputRef}
                  id="file-upload"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileInput}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative rounded-lg overflow-hidden border">
              <img
                src={preview!}
                alt="X-ray preview"
                className="w-full object-contain max-h-[300px]"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 bg-background/80 rounded-full"
                onClick={clearFile}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="text-sm">
              <p className="font-medium">{file.name}</p>
              <p className="text-muted-foreground">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            {isUploading && (
              <div className="space-y-2">
                <Progress value={uploadProgress} className="h-2" />
                <p className="text-xs text-muted-foreground text-right">
                  Uploading: {uploadProgress}%
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <div className="w-full space-y-2">
          <Button
            className="w-full"
            disabled={!file || isUploading || captionLoading || !patientId}
            onClick={uploadFile}
          >
            {isUploading ? "Uploading..." : captionLoading ? "Analyzing..." : "Upload X-ray"}
          </Button>
          {captionLoading && (
            <div className="text-sm text-blue-600 mt-2">X-ray findings loading...</div>
          )}
          {aiCaption && !captionLoading && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded text-green-900">
              <div className="font-semibold mb-1">Findings:</div>
              <div className="whitespace-pre-line">{aiCaption}</div>
            </div>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
