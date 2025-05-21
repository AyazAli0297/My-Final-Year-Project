import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { Session, User } from '@supabase/supabase-js';
import { useNavigate, useLocation } from 'react-router-dom';

interface UserProfile {
  id: string;
  name: string;
  role: 'patient' | 'doctor' | 'admin';
  email: string;
}

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  signOut: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id, session.user.user_metadata);
      } else {
        setIsLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          await fetchProfile(session.user.id, session.user.user_metadata);
        } else {
          setProfile(null);
          setIsLoading(false);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const fetchProfile = async (userId: string, userMeta?: any) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code === 'PGRST116') {
        // No profile found, insert one using user metadata
        if (user && user.user_metadata) {
          const { name, email, role } = user.user_metadata;
          const { error: insertError } = await supabase
            .from('profiles')
            .insert([
              {
                id: user.id,
                name: name || '',
                email: email || user.email,
                role: role || 'patient',
                created_at: new Date().toISOString()
              }
            ]);
          if (!insertError) {
            // Fetch the profile again after insert
            const { data: newProfile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', userId)
              .single();
            setProfile(newProfile as UserProfile);
            // Redirect to dashboard based on role - REMOVED
            // if ((role || 'patient') === 'doctor') {
            //   navigate('/doctor/dashboard');
            // } else {
            //   navigate('/dashboard');
            // }
            setIsLoading(false);
            return;
          }
        }
        setIsLoading(false);
        return;
      }
      if (error) throw error;

      setProfile(data as UserProfile);
      // Check for role-based data before redirecting
      let hasRoleData = false;
      if (data?.role === 'doctor') {
        const { data: doctorData } = await supabase
          .from('doctors')
          .select('*')
          .eq('id', data.id)
          .single();
        hasRoleData = !!doctorData;
        // If doctor data exists, do not redirect. Let them stay on the current page.
        if (hasRoleData) {
          // navigate('/doctor/dashboard'); // REMOVED
        } else {
          // If doctor data is missing and not on complete profile, redirect
          if (location.pathname !== '/complete-profile') {
             navigate('/complete-profile');
          }
        }
      } else if (data?.role === 'patient') {
        const { data: patientData, error: patientError } = await supabase
          .from('patients')
          .select('*')
          .eq('user_id', data.id)
          .single();

        console.log('Patient data fetch result:', { patientData, patientError });

        hasRoleData = !!patientData;
        // If patient data exists, do not redirect. Let them stay on the current page.
        if (hasRoleData) {
          // navigate('/dashboard'); // REMOVED
        } else {
           // If patient data is missing and not on complete profile, redirect
          if (location.pathname !== '/complete-profile') {
             navigate('/complete-profile');
          }
        }
      }
    } catch (error) {
      console.error('Error fetching or creating user profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const value = {
    session,
    user,
    profile,
    signOut,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
