
import { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

export default function NotFound() {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="container px-4 md:px-6 flex flex-col items-center text-center">
        <div className="h-32 w-32 bg-muted rounded-full flex items-center justify-center mb-8">
          <span className="font-bold text-6xl text-muted-foreground">404</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Page not found</h1>
        <p className="text-muted-foreground mb-8">
          We couldn't find the page you were looking for. It may have been moved or deleted.
        </p>
        <Button asChild>
          <Link to="/">
            <Home className="mr-2 h-4 w-4" /> Return Home
          </Link>
        </Button>
      </div>
    </div>
  );
}
