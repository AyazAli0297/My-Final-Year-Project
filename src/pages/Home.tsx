import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { ArrowRight, CheckCircle, FileText, Upload, Calendar, Users, Shield } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 bg-gradient-to-b from-background to-primary/5">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                  AI-Powered X-Ray Analysis & Report Generation
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Get accurate medical reports from your X-rays in minutes using our advanced AI technology. 
                  Fast, reliable, and secure for patients and healthcare professionals.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild>
                  <Link to="/signup">Get Started <ArrowRight className="ml-2 h-5 w-5" /></Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/about">Learn More</Link>
                </Button>
              </div>
              <div className="mt-8 w-full max-w-5xl">
                <div className="relative w-full rounded-lg overflow-hidden shadow-xl">
                  <div className="aspect-[16/9] bg-gradient-to-tr from-primary/20 to-secondary/20 rounded-lg overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1583911860205-72f8ac8ddcbe?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
                      alt="Dashboard preview"
                      className="w-full h-full object-cover mix-blend-overlay opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent"></div>
                    <div className="absolute bottom-8 left-8 right-8 text-left">
                      <div className="glass-card p-4 md:p-6 rounded-xl">
                        <h3 className="text-lg md:text-xl font-bold text-foreground">AI-Generated Reports</h3>
                        <p className="text-sm md:text-base text-muted-foreground mt-2">
                          Our advanced AI analyzes X-ray images and generates comprehensive medical reports in minutes
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Key Features
              </h2>
              <p className="mt-4 text-muted-foreground md:text-lg">
                Our platform provides powerful tools for patients and healthcare professionals
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card transition-all hover:shadow-md">
                <div className="rounded-full bg-primary/10 p-3 mb-4">
                  <Upload className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Easy X-ray Upload</h3>
                <p className="mt-2 text-muted-foreground">
                  Quickly upload X-ray images in common formats for immediate analysis
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card transition-all hover:shadow-md">
                <div className="rounded-full bg-primary/10 p-3 mb-4">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">AI Report Generation</h3>
                <p className="mt-2 text-muted-foreground">
                  Receive detailed, accurate reports powered by advanced AI algorithms
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card transition-all hover:shadow-md">
                <div className="rounded-full bg-primary/10 p-3 mb-4">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Appointment Management</h3>
                <p className="mt-2 text-muted-foreground">
                  Schedule, manage, and track appointments with healthcare providers
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* User Types Section */}
        <section className="py-16 md:py-24 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Made for Everyone in Healthcare
              </h2>
              <p className="mt-4 text-muted-foreground md:text-lg">
                Our platform serves the needs of patients, doctors, and administrators
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-card p-6 rounded-lg shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <Users className="h-8 w-8 text-primary" />
                  <h3 className="text-xl font-bold">For Patients</h3>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Upload X-rays and get AI analysis</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Book appointments with specialists</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Access medical reports anytime</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Secure storage of medical history</span>
                  </li>
                </ul>
                <div className="mt-6">
                  <Button asChild>
                    <Link to="/signup">Sign up as Patient</Link>
                  </Button>
                </div>
              </div>
              <div className="bg-card p-6 rounded-lg shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <Users className="h-8 w-8 text-primary" />
                  <h3 className="text-xl font-bold">For Doctors</h3>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Review AI-generated insights</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Manage patient appointments</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Access patient medical history</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Collaborate with other specialists</span>
                  </li>
                </ul>
                <div className="mt-6">
                  <Button asChild>
                    <Link to="/signup">Sign up as Doctor</Link>
                  </Button>
                </div>
              </div>
              <div className="bg-card p-6 rounded-lg shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="h-8 w-8 text-primary" />
                  <h3 className="text-xl font-bold">For Admins</h3>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Manage user accounts and access</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Configure system settings</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Monitor platform performance</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Generate analytics and reports</span>
                  </li>
                </ul>
                <div className="mt-6">
                  <Button variant="outline" asChild>
                    <Link to="/contact">Contact for Admin Access</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  Ready to Transform Your Healthcare Experience?
                </h2>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Join thousands of patients and healthcare providers using our AI-powered platform.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild>
                  <Link to="/signup">Create Account</Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/contact">Contact Sales</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
