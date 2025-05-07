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
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Extended schema for signup form with additional fields
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
            }
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
            // If profile creation fails, we should still allow the user to proceed
            // as they can complete their profile later
            console.warn('Profile creation failed, but user was created');
          }
          
          toast.success("Account created successfully!");
          
          // Automatically sign in the user after successful signup
          const { error: signInError } = await supabase.auth.signInWithPassword({
            email: values.email.toLowerCase().trim(),
            password: values.password,
          });

          if (signInError) {
            console.error('Auto sign-in error:', signInError);
            navigate("/login");
          } else {
            // Redirect to complete profile page after signup
            navigate("/complete-profile");
          }
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
            ? "Enter your credentials to access your account" 
            : "Enter your information to create an account"}
        </CardDescription>
      </CardHeader>
      <CardContent>
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
                      <Input placeholder="name@example.com" {...field} />
                      <Mail className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
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
                        placeholder="••••••••"
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1 h-8 w-8"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                        <span className="sr-only">Toggle password visibility</span>
                      </Button>
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
                    <div className="flex gap-4">
                      <Button
                        type="button"
                        variant={field.value === "patient" ? "default" : "outline"}
                        className="flex-1"
                        onClick={() => form.setValue("role", "patient")}
                      >
                        Patient
                      </Button>
                      <Button
                        type="button"
                        variant={field.value === "doctor" ? "default" : "outline"}
                        className="flex-1"
                        onClick={() => form.setValue("role", "doctor")}
                      >
                        Doctor
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            <Button 
              type="submit" 
              className="w-full mt-6" 
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  {type === "login" ? "Logging in..." : "Creating account..."}
                </div>
              ) : (
                type === "login" ? "Sign in" : "Create account"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-center border-t p-4">
        <p className="text-sm text-muted-foreground">
          {type === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
          <Link
            to={type === "login" ? "/signup" : "/login"}
            className="font-medium text-primary hover:underline"
          >
            {type === "login" ? "Sign up" : "Sign in"}
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
