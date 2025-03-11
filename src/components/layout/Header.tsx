import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  LogOut,
  MessageSquarePlus,
  Shield,
  ShieldCheck,
  User,
} from "lucide-react";

export function Header() {
  const { user, signOut, language, setLanguage, userRole } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  return (
    <header className="fixed w-full bg-background/80 backdrop-blur-md z-50 border-b border-border/40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and site name */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <img src="/logo.png" alt="Tanzania Feedback Logo" className="h-10 w-auto" />
              <span className="font-semibold text-lg hidden sm:inline-block">Tanzania Feedback</span>
            </Link>
          </div>
          
          {/* Navigation links */}
          <nav className="hidden md:flex items-center space-x-4">
            <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">
              Home
            </Link>
            <Link to="/about" className="text-sm font-medium hover:text-primary transition-colors">
              About
            </Link>
            <Link to="/faq" className="text-sm font-medium hover:text-primary transition-colors">
              FAQ
            </Link>
            <Button 
              variant="default" 
              size="sm"
              onClick={() => navigate("/submit-feedback")}
              className="flex items-center"
            >
              <MessageSquarePlus size={16} />
              <span>Submit Feedback</span>
            </Button>
          </nav>
          
          {/* Right side - auth and settings */}
          <div className="flex items-center space-x-3">
            <ThemeToggle />
            <LanguageSwitcher language={language} setLanguage={setLanguage} />
            
            {user ? (
              <div className="relative">
                <Avatar 
                  className="cursor-pointer h-8 w-8 border border-border"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  <AvatarImage src={user.user_metadata?.avatar_url} />
                  <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                
                {isMenuOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute right-0 mt-2 w-48 bg-card rounded-md shadow-lg border border-border overflow-hidden z-50"
                  >
                    <div className="p-3 border-b border-border">
                      <p className="text-sm font-medium truncate">{user.email}</p>
                    </div>
                    <div className="p-2">
                      {userRole === "admin" && (
                        <Button 
                          variant="ghost" 
                          className="w-full justify-start text-left" 
                          onClick={() => navigate("/admin")}
                        >
                          <Shield className="mr-2 h-4 w-4" />
                          Admin Dashboard
                        </Button>
                      )}
                      {userRole === "moderator" && (
                        <Button 
                          variant="ghost" 
                          className="w-full justify-start text-left" 
                          onClick={() => navigate("/moderator")}
                        >
                          <ShieldCheck className="mr-2 h-4 w-4" />
                          Moderator Dashboard
                        </Button>
                      )}
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start text-left" 
                        onClick={() => navigate("/profile")}
                      >
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Button>
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start text-left text-destructive hover:text-destructive" 
                        onClick={() => {
                          signOut();
                          setIsMenuOpen(false);
                        }}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign out
                      </Button>
                    </div>
                  </motion.div>
                )}
              </div>
            ) : (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate("/auth")}
              >
                Sign in
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
