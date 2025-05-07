import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function CompleteProfile() {
  const { user, profile, isLoading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState<any>({});
  const [submitting, setSubmitting] = useState(false);

  if (isLoading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (!user || !profile) return <div className="flex justify-center items-center h-screen">Not authenticated</div>;

  // Doctor fields
  const doctorFields = [
    { name: 'first_name', label: 'First Name', type: 'text' },
    { name: 'last_name', label: 'Last Name', type: 'text' },
    { name: 'specialization', label: 'Specialization', type: 'text' },
    { name: 'license_number', label: 'License Number', type: 'text' },
    { name: 'experience_years', label: 'Years of Experience', type: 'number' },
    { name: 'contact_number', label: 'Contact Number', type: 'text' },
  ];

  // Patient fields
  const patientFields = [
    { name: 'first_name', label: 'First Name', type: 'text' },
    { name: 'last_name', label: 'Last Name', type: 'text' },
    { name: 'date_of_birth', label: 'Date of Birth', type: 'date' },
    { name: 'gender', label: 'Gender', type: 'text' },
    { name: 'contact_number', label: 'Contact Number', type: 'text' },
    { name: 'address', label: 'Address', type: 'text' },
    { name: 'medical_history', label: 'Medical History', type: 'text' },
  ];

  const fields = profile.role === 'doctor' ? doctorFields : patientFields;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (profile.role === 'doctor') {
        const { error } = await supabase.from('doctors').insert([
          { user_id: user.id, ...form }
        ]);
        if (error) throw error;
        toast.success('Doctor profile completed!');
        navigate('/doctor/dashboard');
      } else {
        const { error } = await supabase.from('patients').insert([
          { user_id: user.id, ...form }
        ]);
        if (error) throw error;
        toast.success('Patient profile completed!');
        navigate('/dashboard');
      }
    } catch (error: any) {
      toast.error(error.message || 'Error completing profile');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-muted">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Complete Your Profile ({profile.role.charAt(0).toUpperCase() + profile.role.slice(1)})</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            {fields.map((field) => (
              <div key={field.name}>
                <label className="block mb-1 font-medium" htmlFor={field.name}>{field.label}</label>
                <Input
                  id={field.name}
                  name={field.name}
                  type={field.type}
                  value={form[field.name] || ''}
                  onChange={handleChange}
                  required
                />
              </div>
            ))}
            <Button type="submit" className="w-full mt-4" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Complete Profile'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 