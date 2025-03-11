import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Mail, Key, User, Facebook, Twitter } from "lucide-react";

export function SignupForm() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Sign up new user
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
          },
        },
      });
      
      if (error) throw error;
      
      toast.success("Account created successfully", {
        description: "Please check your email to verify your account.",
      });
      
      // Navigate home
      navigate("/");
    } catch (error: any) {
      console.error("Authentication error:", error);
      toast.error("Failed to create account", {
        description: error.message || "Please check your information and try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="fullName" className="text-left block">Full Name</Label>
        <div className="relative">
          <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
          <Input
            id="fullName"
            name="fullName"
            placeholder="Enter your full name"
            value={formData.fullName}
            onChange={handleChange}
            className="pl-10"
            required
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email" className="text-left block">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            className="pl-10"
            required
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password" className="text-left block">Password</Label>
        <div className="relative">
          <Key className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="Create a password (min. 6 characters)"
            value={formData.password}
            onChange={handleChange}
            className="pl-10"
            minLength={6}
            required
          />
        </div>
      </div>
      
      <div className="pt-2">
        <Button 
          type="submit" 
          className="w-full" 
          disabled={isLoading}
        >
          {isLoading ? "Creating account..." : "Sign up"}
        </Button>
      </div>
      
      {/* Social login options */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border"></span>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or sign up with</span>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-3">
        <Button 
          type="button" 
          variant="outline" 
          className="flex items-center justify-center gap-2"
          onClick={() => toast.info("Social signup coming soon")}
        >
          <Facebook size={16} />
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          className="flex items-center justify-center gap-2"
          onClick={() => toast.info("Social signup coming soon")}
        >
          <svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 488 512">
            <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"/>
          </svg>
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          className="flex items-center justify-center gap-2"
          onClick={() => toast.info("Social signup coming soon")}
        >
          <Twitter size={16} />
        </Button>
      </div>
      
      <div className="text-center text-sm text-muted-foreground mt-4">
        <p>By signing up, you agree to our <a href="#" className="text-primary hover:underline">Terms of Service</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a></p>
      </div>
    </form>
  );
}