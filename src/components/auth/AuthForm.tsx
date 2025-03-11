
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Mail, Key, User } from "lucide-react";

interface AuthFormProps {
  mode: "login" | "signup";
  toggleMode: () => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
}

export function AuthForm({ mode, toggleMode, isLoading, setIsLoading }: AuthFormProps) {
  const navigate = useNavigate();
  
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
      if (mode === "signup") {
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
      } else {
        // Login existing user
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });
        
        if (error) throw error;
        
        toast.success("Login successful", {
          description: "Welcome back!",
        });
        
        // Navigate home
        navigate("/");
      }
    } catch (error: any) {
      console.error("Authentication error:", error);
      toast.error(mode === "signup" ? "Failed to create account" : "Login failed", {
        description: error.message || "Please check your credentials and try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {mode === "signup" && (
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
      )}
      
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
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            className="pl-10"
            required
            minLength={6}
          />
        </div>
      </div>
      
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 
          `${mode === "login" ? "Logging in..." : "Creating account..."}` : 
          `${mode === "login" ? "Login" : "Create Account"}`
        }
      </Button>
    </form>
  );
}
