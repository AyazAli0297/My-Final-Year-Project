
import { AuthForm } from "@/components/auth/AuthForm";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function Signup() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-12">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
            <div className="space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Create an account</h1>
                <p className="text-muted-foreground">
                  Sign up to get started with X-Ray AI
                </p>
              </div>
              <div className="space-y-2">
                <AuthForm type="signup" />
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="relative h-full">
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-20 rounded-2xl"></div>
                <img
                  src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
                  alt="Medical technology"
                  className="w-full h-full object-cover rounded-2xl opacity-80 mix-blend-overlay"
                />
                <div className="absolute inset-0 flex flex-col justify-center p-6">
                  <div className="glass-card p-6 rounded-xl max-w-md">
                    <h3 className="text-2xl font-bold mb-2">Why Join X-Ray AI?</h3>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                          <span className="text-xs font-bold text-white">1</span>
                        </div>
                        <span>AI-powered analysis for faster results</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                          <span className="text-xs font-bold text-white">2</span>
                        </div>
                        <span>Secure storage of medical records</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                          <span className="text-xs font-bold text-white">3</span>
                        </div>
                        <span>Easy appointment scheduling</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                          <span className="text-xs font-bold text-white">4</span>
                        </div>
                        <span>Direct communication with healthcare providers</span>
                      </li>
                    </ul>
                  </div>
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
