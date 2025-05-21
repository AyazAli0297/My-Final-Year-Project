import { useEffect, useState } from "react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

const patientSettingsSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  dateOfBirth: z.date({
    required_error: "A date of birth is required.",
  }),
  gender: z.string().min(1, "Gender is required"),
  contactNumber: z.string().optional(),
  address: z.string().min(1, "Address is required"),
  medicalHistory: z.string().optional(),
});

const doctorSettingsSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  specialization: z.string().min(1, "Specialization is required"),
  experienceYears: z.preprocess(
    (val) => (val === null || val === undefined || val === '' ? undefined : Number(val)),
    z.number().int().nonnegative("Experience years must be a non-negative number").optional()
  ),
  contactNumber: z.string().optional(),
});

export default function Settings() {
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<any>(null); // State to hold fetched profile data

  const isPatient = profile?.role === 'patient';
  const schema = isPatient ? patientSettingsSchema : doctorSettingsSchema;

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: isPatient
      ? { firstName: "", lastName: "", dateOfBirth: undefined, gender: "", contactNumber: "", address: "", medicalHistory: "" }
      : { firstName: "", lastName: "", specialization: "", experienceYears: undefined, contactNumber: "" },
  });

  // Fetch profile data
  useEffect(() => {
    async function fetchProfileData() {
      if (!user || !profile) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        let data, error;
        if (profile.role === 'patient') {
          ({ data, error } = await supabase
            .from('patients')
            .select('*')
            .eq('user_id', user.id)
            .single());
        } else if (profile.role === 'doctor') {
           ({ data, error } = await supabase
            .from('doctors')
            .select('*')
            .eq('user_id', user.id) // Assuming doctors table also links to user_id
            .single());

          console.log('Doctor data fetch result:', { data, error });
        }

        if (error || !data) {
          console.error("Error fetching profile:", error);
          setLoading(false);
          toast.error("Could not fetch your profile data.");
          return;
        }

        setProfileData(data);

        // Reset form with fetched data
        if (profile.role === 'patient') {
          form.reset({
            firstName: data.first_name || '',
            lastName: data.last_name || '',
            dateOfBirth: data.date_of_birth ? new Date(data.date_of_birth) : undefined,
            gender: data.gender || '',
            contactNumber: data.contact_number || '', // Use contact_number for patient
            address: data.address || '',
            medicalHistory: data.medical_history || '',
          });
        } else if (profile.role === 'doctor') {
           form.reset({
            firstName: data.first_name || '',
            lastName: data.last_name || '',
            specialization: data.specialization || '',
            experienceYears: data.experience_years || undefined,
            contactNumber: data.contact_number || '',
          });
        }

      } catch (err) {
        console.error("Unexpected error fetching profile:", err);
        toast.error("An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    }

    fetchProfileData();
  }, [user, profile]); // Depend on user and profile

  async function onSubmit(values: z.infer<typeof schema>) {
    if (!user || !profileData) return;

    let error;
    if (isPatient) {
      const patientValues = values as z.infer<typeof patientSettingsSchema>;
      ({ error } = await supabase
        .from("patients")
        .update({
          first_name: patientValues.firstName,
          last_name: patientValues.lastName,
          date_of_birth: patientValues.dateOfBirth?.toISOString().split('T')[0] || null,
          gender: patientValues.gender,
          contact_number: patientValues.contactNumber,
          address: patientValues.address,
          medical_history: patientValues.medicalHistory,
        })
        .eq("id", profileData.id)); // Update based on the profile data's unique ID
    } else {
      const doctorValues = values as z.infer<typeof doctorSettingsSchema>;
       ({ error } = await supabase
        .from("doctors")
        .update({
          first_name: doctorValues.firstName,
          last_name: doctorValues.lastName,
          specialization: doctorValues.specialization,
          experience_years: doctorValues.experienceYears,
          contact_number: doctorValues.contactNumber,
          user_id: user.id,
        })
        .eq("id", profileData.id)); // Update based on the profile data's unique ID
    }

    if (!error) {
      toast.success("Profile updated successfully!");
    } else {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile: " + error.message);
    }
  }

  return (
    <div className="space-y-8">
      <DashboardHeader
        heading="Settings"
        description="Manage your profile information."
      />

      {loading ? (
        <div className="text-center">Loading settings...</div>
      ) : (
        <div className="w-full max-w-md mx-auto">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {isPatient ? (
                <>
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your first name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your last name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="dateOfBirth"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Date of Birth</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )
                              }
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date > new Date() || date < new Date("1900-01-01")
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                 <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gender</FormLabel>
                        <FormControl>
                          <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                 <FormField
                    control={form.control}
                    name="contactNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Number</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your contact number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                 <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                 <FormField
                    control={form.control}
                    name="medicalHistory"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Medical History</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your medical history" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              ) : ( // Doctor fields
                <>
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your first name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your last name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="specialization"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Specialization</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your specialization" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="experienceYears"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Years of Experience</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="Enter years of experience" {...field} onChange={event => field.onChange(event.target.value === '' ? undefined : Number(event.target.value))} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="contactNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Number</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your contact number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              <Button type="submit" className="w-full">Update Profile</Button>
            </form>
          </Form>
        </div>
      )}
    </div>
  );
}