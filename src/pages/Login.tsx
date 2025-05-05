
import { AuthForm } from "@/components/auth/AuthForm";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function Login() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-12">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
            <div className="space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
                <p className="text-muted-foreground">
                  Sign in to your account to continue using X-Ray AI
                </p>
              </div>
              <div className="space-y-2">
                <AuthForm type="login" />
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="relative h-full">
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-20 rounded-2xl"></div>
                <img
                  src="https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2091&q=80"
                  alt="X-ray"
                  className="w-full h-full object-cover rounded-2xl opacity-80 mix-blend-overlay"
                />
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent rounded-b-2xl">
                  <blockquote className="text-white">
                    <p className="text-lg font-medium">
                      "X-Ray AI has revolutionized how we handle patient diagnostics, saving us hours of work every day."
                    </p>
                    <footer className="mt-2">
                      <p className="text-sm">Dr. Sarah Johnson, Radiologist</p>
                    </footer>
                  </blockquote>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
