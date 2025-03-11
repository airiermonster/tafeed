import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { toast } from "sonner";
import { 
  Shield, UserRoundPlus, CheckCircle2, Loader2
} from "lucide-react";
import { UserRole } from "@/types/feedback";

export function UserCreationForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    role: "user" as UserRole,
    sendPasswordResetEmail: true
  });

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const createUser = async () => {
    if (!formData.email || !formData.password) {
      toast.error("Email and password are required");
      return;
    }

    setIsLoading(true);
    try {
      // Create the user
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });
      
      if (error) throw error;
      
      if (!data.user) {
        throw new Error("Failed to create user");
      }

      const userId = data.user.id;
      
      // Update profile with name if provided
      if (formData.fullName) {
        const { error: profileError } = await supabase
          .from("profiles")
          .update({ full_name: formData.fullName })
          .eq("id", userId);
          
        if (profileError) throw profileError;
      }
      
      // Assign role
      const { error: roleError } = await supabase.rpc('assign_user_role_fixed', {
        p_user_id: userId,
        p_role_name: formData.role
      });
      
      if (roleError) throw roleError;

      // Send password reset email if option selected
      if (formData.sendPasswordResetEmail) {
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(
          formData.email,
          { redirectTo: `${window.location.origin}/auth/reset-password` }
        );
        
        if (resetError) throw resetError;
      }
      
      // Reset form
      setFormData({
        email: "",
        password: "",
        fullName: "",
        role: "user",
        sendPasswordResetEmail: true
      });
      
      toast.success(
        `${formData.role.charAt(0).toUpperCase() + formData.role.slice(1)} created successfully`,
        {
          description: formData.sendPasswordResetEmail 
            ? "A password reset email has been sent" 
            : "User can log in with the provided credentials"
        }
      );
    } catch (error: any) {
      console.error("Error creating user:", error);
      toast.error(`Failed to create user: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleIcon = () => {
    switch (formData.role) {
      case "admin":
        return <Shield className="h-5 w-5 text-amber-600" />;
      case "moderator":
        return <Shield className="h-5 w-5 text-cyan-600" />;
      default:
        return <UserRoundPlus className="h-5 w-5 text-indigo-600" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getRoleIcon()}
          <span>Create New User</span>
        </CardTitle>
        <CardDescription>
          Create a new user account with specific role permissions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
              <Input
                id="email"
                type="email"
                placeholder="user@example.com"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password <span className="text-red-500">*</span></Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => handleChange("password", e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                Min. 8 characters with mixed case, numbers & symbols
              </p>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              placeholder="John Doe"
              value={formData.fullName}
              onChange={(e) => handleChange("fullName", e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="role">User Role</Label>
            <Select
              value={formData.role}
              onValueChange={(value) => handleChange("role", value as UserRole)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user" className="flex items-center">
                  <div className="flex items-center gap-2">
                    <UserRoundPlus className="h-4 w-4 text-indigo-600" />
                    <span>Regular User</span>
                  </div>
                </SelectItem>
                <SelectItem value="moderator">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-cyan-600" />
                    <span>Moderator</span>
                  </div>
                </SelectItem>
                <SelectItem value="admin">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-amber-600" />
                    <span>Administrator</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center space-x-2 pt-2">
            <input
              id="sendResetEmail"
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              checked={formData.sendPasswordResetEmail}
              onChange={(e) => handleChange("sendPasswordResetEmail", e.target.checked)}
            />
            <Label htmlFor="sendResetEmail" className="text-sm font-normal">
              Send password reset email to let user set their own password
            </Label>
          </div>
          
          <Button
            type="button"
            className="w-full mt-6"
            disabled={isLoading || !formData.email || !formData.password}
            onClick={createUser}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating User...
              </>
            ) : (
              <>
                <UserRoundPlus className="mr-2 h-4 w-4" />
                Create User
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
} 