import { useEffect, useState } from "react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { ReportCard } from "@/components/dashboard/ReportCard";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

export default function Reports() {
  const { user, profile } = useAuth();
  const [reportsData, setReportsData] = useState<any[]>([]);
  const [loadingReports, setLoadingReports] = useState(true);
  const [patientDetails, setPatientDetails] = useState<any>(null);

  useEffect(() => {
    async function fetchReports() {
      if (!user || !profile) {
        setLoadingReports(false);
        return;
      }
      setLoadingReports(true);
      try {
        let reportQuery = supabase.from('reports').select('*').order('created_at', { ascending: false });

        if (profile.role === 'patient') {
           // First, get the patient_id from the patients table using user.id
           const { data: patientData, error: patientError } = await supabase
             .from('patients')
             .select('id, gender, first_name, last_name')
             .eq('user_id', user.id)
             .single();

           if (patientError || !patientData) {
             console.error("Error fetching patient ID for reports:", patientError);
             setReportsData([]);
             setLoadingReports(false);
             return;
           }

           const patientId = patientData.id;
           console.log("Fetching reports for patientId:", patientId); // Log patientId
           setPatientDetails(patientData);
           reportQuery = reportQuery.eq('patient_id', patientId);

        } else if (profile.role === 'doctor') {
           // First, get the doctor_id from the doctors table using user.id
           const { data: doctorData, error: doctorError } = await supabase
             .from('doctors')
             .select('id')
             .eq('user_id', user.id)
             .single();

           if (doctorError || !doctorData) {
             console.error("Error fetching doctor ID for reports:", doctorError);
             setReportsData([]);
             setLoadingReports(false);
             // toast.error("Could not fetch your doctor profile to load reports.");
             return;
           }

           const doctorId = doctorData.id;
           console.log("Fetching reports for doctorId:", doctorId); // Log doctorId
           reportQuery = reportQuery.eq('doctor_id', doctorId);
        }
         else {
            // Handle other roles or no reports if role is neither patient nor doctor
            setReportsData([]);
            setLoadingReports(false);
            return;
         }

        const { data, error } = await reportQuery;

        if (error) {
          console.error("Error fetching reports:", error);
          setReportsData([]);
          console.log("Reports fetch result - Error:", error); // Log error
        } else {
          setReportsData(data || []);
          // For doctors, patientDetails will remain null, which is fine for now
          console.log("Reports fetch result - Data:", data); // Log data
        }
      } catch (err) {
        console.error("Unexpected error fetching reports:", err);
        setReportsData([]);
      } finally {
        setLoadingReports(false);
      }
    }

    fetchReports();
  }, [user, profile]);

  return (
    <div className="space-y-8">
      <DashboardHeader
        heading="My Reports"
        description="View your past X-ray analysis reports."
      />

      <div>
        {loadingReports ? (
          <div className="text-center">Loading reports...</div>
        ) : reportsData.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {reportsData.map((report) => (
              <ReportCard
                key={report.id}
                id={report.id}
                title={report.ai_analysis_result?.title || report.title || (patientDetails ? `${patientDetails.first_name} ${patientDetails.last_name}'s Report` : 'Report')}
                description={report.ai_analysis_result?.caption || report.recommendations || 'No detailed findings available.'}
                date={report.created_at}
                imageUrl={report.xray_image_url}
                userRole={profile?.role || "patient"}
                patientAge={profile?.role === 'patient' ? patientDetails?.age : null}
                patientGender={profile?.role === 'patient' ? patientDetails?.gender : null}
              />
            ))}
          </div>
        ) : (
          <div className="text-center">No reports found.</div>
        )}
      </div>
    </div>
  );
} 