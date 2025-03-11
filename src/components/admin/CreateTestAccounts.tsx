
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Shield, UserCog, UserPlus } from "lucide-react";

export function CreateTestAccounts() {
  const [isLoading, setIsLoading] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [moderatorEmail, setModeratorEmail] = useState("");
  const [moderatorPassword, setModeratorPassword] = useState("");

  const createTestAdmin = async () => {
    if (!adminEmail || !adminPassword) {
      toast.error("Please enter both email and password for the admin account");
      return;
    }

    setIsLoading(true);
    try {
      // Create admin user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: adminEmail,
        password: adminPassword
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("Failed to create admin user");

      const adminId = authData.user.id;

      // Assign admin role using RPC
      const { error: roleError } = await supabase.rpc('assign_user_role', {
        user_id: adminId,
        role_name: 'admin'
      });

      if (roleError) throw roleError;

      // Update profile
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ full_name: "Admin Test" })
        .eq("id", adminId);

      if (profileError) throw profileError;

      toast.success("Admin account created successfully!");
    } catch (error) {
      console.error("Error creating admin account:", error);
      toast.error("Failed to create admin account");
    } finally {
      setIsLoading(false);
    }
  };

  const createTestModerator = async () => {
    if (!moderatorEmail || !moderatorPassword) {
      toast.error("Please enter both email and password for the moderator account");
      return;
    }

    setIsLoading(true);
    try {
      // Create moderator user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: moderatorEmail,
        password: moderatorPassword
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("Failed to create moderator user");

      const moderatorId = authData.user.id;

      // Assign moderator role using RPC
      const { error: roleError } = await supabase.rpc('assign_user_role', {
        user_id: moderatorId,
        role_name: 'moderator'
      });

      if (roleError) throw roleError;

      // Update profile
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ full_name: "Moderator Test" })
        .eq("id", moderatorId);

      if (profileError) throw profileError;

      toast.success("Moderator account created successfully!");
    } catch (error) {
      console.error("Error creating moderator account:", error);
      toast.error("Failed to create moderator account");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Test Accounts</CardTitle>
        <CardDescription>
          Create test admin and moderator accounts for testing purposes
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <UserCog className="h-5 w-5 text-red-500" />
            <h3 className="text-lg font-medium">Admin Account</h3>
          </div>
          
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="adminEmail">Admin Email</Label>
              <Input
                id="adminEmail"
                type="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder="admin@example.com"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="adminPassword">Admin Password</Label>
              <Input
                id="adminPassword"
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            
            <Button 
              onClick={createTestAdmin} 
              disabled={isLoading || !adminEmail || !adminPassword}
              className="w-full"
            >
              <Shield className="mr-2 h-4 w-4" />
              Create Admin Account
            </Button>
          </div>
        </div>
        
        <div className="border-t pt-6 space-y-4">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-500" />
            <h3 className="text-lg font-medium">Moderator Account</h3>
          </div>
          
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="moderatorEmail">Moderator Email</Label>
              <Input
                id="moderatorEmail"
                type="email"
                value={moderatorEmail}
                onChange={(e) => setModeratorEmail(e.target.value)}
                placeholder="moderator@example.com"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="moderatorPassword">Moderator Password</Label>
              <Input
                id="moderatorPassword"
                type="password"
                value={moderatorPassword}
                onChange={(e) => setModeratorPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            
            <Button 
              onClick={createTestModerator} 
              disabled={isLoading || !moderatorEmail || !moderatorPassword}
              className="w-full"
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Create Moderator Account
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
