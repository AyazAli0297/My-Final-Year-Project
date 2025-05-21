import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";

type AuthFormProps = {
  type: "login" | "signup";
};

// Schema for login form
const loginSchema = z.object({
  email: z.string()
    .email("Please enter a valid email address")
    .refine((email) => {
      // Basic email format validation
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return emailRegex.test(email);
    }, "Please enter a valid email address"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
});

// Extended schema for signup form with only basic fields
const signupSchema = loginSchema.extend({
  name: z.string().min(2, "Name must be at least 2 characters"),
  role: z.enum(["patient", "doctor"]),
});

// Create a type that combines both schema types
type LoginFormValues = z.infer<typeof loginSchema>;
type SignupFormValues = z.infer<typeof signupSchema>;
type FormValues = LoginFormValues & Partial<Omit<SignupFormValues, keyof LoginFormValues>>;

export function AuthForm({ type }: AuthFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  const schema = type === "login" ? loginSchema : signupSchema;
  
  // Define the form using the appropriate schema
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
      ...(type === "signup" && { name: "", role: "patient" }),
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    toast.loading(type === "login" ? "Logging in..." : "Creating account...");
    
    try {
      if (type === "login") {
        console.log('Attempting login with email:', values.email);
        
        // Login with Supabase
        const { data, error } = await supabase.auth.signInWithPassword({
          email: values.email.toLowerCase().trim(),
          password: values.password,
        });
        
        if (error) {
          console.error('Login error:', error);
          if (error.message.includes('Invalid login credentials')) {
            throw new Error('Invalid email or password');
          }
          if (error.message.includes('Email not confirmed')) {
            throw new Error('Please confirm your email before logging in');
          }
          throw error;
        }
        
        console.log('Login successful, fetching user profile...');
        toast.loading("Fetching your profile...");
        
        // Check user role in database to determine redirect path
        const { data: userData, error: userError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single();
        
        if (userError) {
          console.error('Error fetching user profile:', userError);
          throw new Error('Error fetching user profile. Please try again.');
        }
        
        console.log('User profile fetched successfully:', userData);
        toast.dismiss();
        toast.success("Logged in successfully!");
        
        // Redirect based on user role
        if (userData.role === "doctor") {
          navigate("/doctor/dashboard");
        } else {
          navigate("/dashboard");
        }
      } else {
        console.log('Attempting signup with email:', values.email);
        
        // Signup with Supabase
        const { data, error } = await supabase.auth.signUp({
          email: values.email.toLowerCase().trim(),
          password: values.password,
          options: {
            data: {
              name: values.name,
              role: values.role
            },
            emailRedirectTo: `${window.location.origin}/complete-profile`
          }
        });
        
        if (error) {
          console.error('Signup error:', error);
          if (error.message.includes('User already registered')) {
            throw new Error('An account with this email already exists');
          }
          if (error.message.includes('For security purposes')) {
            throw new Error('Please wait a moment before trying again');
          }
          throw error;
        }
        
        if (data.user) {
          console.log('User created, creating profile...');
          
          // Create a profile record for the user with name and role
          const { error: profileError } = await supabase
            .from('profiles')
            .insert([
              {
                id: data.user.id,
                name: values.name,
                role: values.role,
                email: values.email,
                created_at: new Date().toISOString()
              }
            ]);
          
          if (profileError) {
            console.error('Error creating user profile:', profileError);
            console.warn('Profile creation failed, but user was created');
          }
          
          toast.dismiss();
          toast.success("Account created! Please check your email to confirm your account.");
          // Redirect to confirmation page
          navigate("/signup/confirm", { 
            state: { 
              email: values.email,
              name: values.name
            }
          });
        }
      }
    } catch (error: any) {
      console.error('Authentication error details:', {
        message: error.message,
        status: error.status,
        name: error.name,
        stack: error.stack
      });
      toast.dismiss();
      toast.error(error.message || "Authentication failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          {type === "login" ? "Welcome back" : "Create an account"}
        </CardTitle>
        <CardDescription>
          {type === "login" 
            ? "Sign in to your account to continue using X-Ray AI"
            : "Enter your information to create an account"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {type === "signup" && (
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input type="email" placeholder="name@example.com" {...field} />
                      <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        {...field}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground focus:outline-none"
                        onClick={() => setShowPassword((prev) => !prev)}
                        tabIndex={-1}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {type === "signup" && (
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>I am a</FormLabel>
                    <FormControl>
                      <ToggleGroup
                        type="single"
                        value={field.value}
                        onValueChange={val => field.onChange(val || "patient")}
                        className="w-full"
                      >
                        <ToggleGroupItem value="patient" className="w-1/2">Patient</ToggleGroupItem>
                        <ToggleGroupItem value="doctor" className="w-1/2">Doctor</ToggleGroupItem>
                      </ToggleGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  {type === "login" ? "Signing in..." : "Creating account..."}
                </div>
              ) : type === "login" ? "Sign in" : "Create account"}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        {type === "login" ? (
          <span className="text-sm text-muted-foreground text-center">
            Don&apos;t have an account? <Link to="/signup" className="text-primary hover:underline">Sign up</Link>
          </span>
        ) : (
          <span className="text-sm text-muted-foreground text-center">
            Already have an account? <Link to="/login" className="text-primary hover:underline">Sign in</Link>
          </span>
        )}
      </CardFooter>
    </Card>
  );
}
