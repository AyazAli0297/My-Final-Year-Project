import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="bg-background border-t py-12">
      <div className="container grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-3">
          <Link to="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <span className="font-bold text-white text-lg">X</span>
            </div>
            <span className="font-bold text-xl">X-Ray AI</span>
          </Link>
          <p className="text-sm text-muted-foreground">
            Advanced AI-powered X-ray analysis and report generation for healthcare professionals.
          </p>
        </div>
        
        <div>
          <h3 className="font-semibold mb-3">Platform</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/features" className="text-muted-foreground hover:text-foreground transition-colors">Features</Link></li>
          </ul>
        </div>
        
        <div>
          <h3 className="font-semibold mb-3">Resources</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/blog" className="text-muted-foreground hover:text-foreground transition-colors">Blog</Link></li>
            <li><Link to="/case-studies" className="text-muted-foreground hover:text-foreground transition-colors">Case Studies</Link></li>
            <li><Link to="/support" className="text-muted-foreground hover:text-foreground transition-colors">Support</Link></li>
            <li><Link to="/documentation" className="text-muted-foreground hover:text-foreground transition-colors">Documentation</Link></li>
          </ul>
        </div>
        
        <div>
          <h3 className="font-semibold mb-3">Company</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors">About</Link></li>
            <li><Link to="/contact" className="text-muted-foreground hover:text-foreground transition-colors">Contact</Link></li>
          </ul>
        </div>
      </div>
      
      <div className="container mt-12 pt-6 border-t">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} X-Ray AI, Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
