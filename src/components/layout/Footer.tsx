
import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-card/50 border-t border-border/50 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          <div className="text-left">
            <div className="flex items-center mb-4">
              <img src="/logo.png" alt="Tanzania Feedback Logo" className="h-10 w-auto mr-2" />
              <h3 className="text-lg font-semibold">Tanzania Feedback (Tafeed)</h3>
            </div>
            <p className="text-muted-foreground mb-4">
              The official platform enabling Tanzanian citizens to submit complaints, 
              suggestions, inquiries, and commendations directly to the government.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-foreground hover:text-primary transition-colors" aria-label="Facebook">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-foreground hover:text-primary transition-colors" aria-label="Twitter">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-foreground hover:text-primary transition-colors" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div className="text-left">
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/categories" className="text-muted-foreground hover:text-primary transition-colors">
                  Categories
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/submit-feedback" className="text-muted-foreground hover:text-primary transition-colors">
                  Submit Feedback
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="text-left">
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-center text-muted-foreground">
                <Phone className="h-4 w-4 mr-2" />
                <span>+255 123 456 789</span>
              </li>
              <li className="flex items-center text-muted-foreground">
                <Mail className="h-4 w-4 mr-2" />
                <span>info@tafeed.go.tz</span>
              </li>
              <li className="flex items-start text-muted-foreground">
                <MapPin className="h-4 w-4 mr-2 mt-1" />
                <span>Dodoma, Tanzania</span>
              </li>
            </ul>
          </div>
          
          <div className="text-left">
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy-policy" className="text-muted-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms-of-use" className="text-muted-foreground hover:text-primary transition-colors">
                  Terms of Use
                </Link>
              </li>
              <li>
                <Link to="/accessibility" className="text-muted-foreground hover:text-primary transition-colors">
                  Accessibility
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © {currentYear} Tanzania Feedback (Tafeed). All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
