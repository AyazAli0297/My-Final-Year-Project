import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { DashboardShell } from '@/components/layout/DashboardShell';

interface ProtectedRouteProps {
  requiredRole?: 'patient' | 'doctor' | 'admin';
}

export function ProtectedRoute({ requiredRole }: ProtectedRouteProps) {
  const { user, profile, isLoading } = useAuth();

  console.log('ProtectedRoute rendering.', { isLoading, user, profile, requiredRole });

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    console.log('ProtectedRoute: User not found, redirecting to /login');
    return <Navigate to="/login" replace />;
  }

  // If role is required, check if user has the role
  if (requiredRole && profile?.role !== requiredRole) {
    console.log('ProtectedRoute: Role mismatch or profile missing. Required:', requiredRole, 'Actual:', profile?.role);
    // Redirect patients trying to access doctor pages to patient dashboard
    if (profile?.role === 'patient' && requiredRole === 'doctor') {
      return <Navigate to="/dashboard" replace />;
    }
    
    // Redirect doctors trying to access patient pages to doctor dashboard
    if (profile?.role === 'doctor' && requiredRole === 'patient') {
      return <Navigate to="/doctor/dashboard" replace />;
    }

    // If role doesn't match and no specific redirect, maybe render nothing or a message?
    console.log('ProtectedRoute: Role mismatch, no specific redirect defined.');
    return null; // Or render an unauthorized message
  }

  // User is authenticated and has the required role
  console.log('ProtectedRoute: User authenticated and has required role, rendering Outlet.');
  return (
    <DashboardShell userRole={profile?.role || 'patient'}>
      <Outlet />
    </DashboardShell>
  );
}
