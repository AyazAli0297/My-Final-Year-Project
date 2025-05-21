import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { AuthProvider } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import SignupConfirm from "./pages/SignupConfirm";
import Dashboard from "./pages/Dashboard";
import Upload from "./pages/Upload";
import DoctorDashboard from "./pages/DoctorDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import Patients from "./pages/Patients";
import Appointments from "./pages/Appointments";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import NewPatient from "./pages/NewPatient";
import NewAppointment from "./pages/NewAppointment";
import NewReport from "./pages/NewReport";
import NewConsultation from "./pages/NewConsultation";
import RescheduleAppointment from "./pages/RescheduleAppointment";
import CancelAppointment from "./pages/CancelAppointment";
import CompleteProfile from "./pages/CompleteProfile";
import BookAppointment from "./pages/BookAppointment";
import DoctorAppointments from "./pages/DoctorAppointments";
import DoctorSchedule from "./pages/DoctorSchedule";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Features from "./pages/Features";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Blog from "./pages/Blog";
import CaseStudies from "./pages/CaseStudies";
import Support from "./pages/Support";
import Documentation from "./pages/Documentation";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light">
      <TooltipProvider>
        <BrowserRouter>
          <AuthProvider>
            <Toaster />
            <Sonner />
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/signup/confirm" element={<SignupConfirm />} />
              <Route path="/complete-profile" element={<CompleteProfile />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/features" element={<Features />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/case-studies" element={<CaseStudies />} />
              <Route path="/support" element={<Support />} />
              <Route path="/documentation" element={<Documentation />} />
              
              {/* Patient Protected Routes */}
              <Route element={<ProtectedRoute requiredRole="patient" />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/appointments" element={<Appointments />} />
                <Route path="/appointments/new" element={<BookAppointment />} />
                <Route path="/upload" element={<Upload />} />
                <Route path="/reports" element={<Reports />} />
              </Route>
              
              {/* Doctor Protected Routes */}
              <Route element={<ProtectedRoute requiredRole="doctor" />}>
                <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
                <Route path="/doctor/patients" element={<Patients />} />
                <Route path="/doctor/patients/new" element={<NewPatient />} />
                <Route path="/doctor/appointments" element={<DoctorAppointments />} />
                <Route path="/doctor/appointments/new" element={<NewAppointment />} />
                <Route path="/doctor/appointments/:id/reschedule" element={<RescheduleAppointment />} />
                <Route path="/doctor/appointments/:id/cancel" element={<CancelAppointment />} />
                <Route path="/doctor/reports" element={<Reports />} />
                <Route path="/doctor/reports/new" element={<NewReport />} />
                <Route path="/doctor/consultations" element={<NewConsultation />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/doctor/appointments/schedule" element={<DoctorSchedule />} />
              </Route>
              
              {/* Admin Protected Routes */}
              <Route element={<ProtectedRoute requiredRole="admin" />}>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
              </Route>
              
              {/* Catch-all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
