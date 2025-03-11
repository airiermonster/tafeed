
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Shield, Search, UserRoundCheck, UserRoundMinus } from "lucide-react";
import { UserRole } from "@/types/feedback";

interface User {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
}

export function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Get users with their profiles
      const { data: userData, error: userError } = await supabase
        .from("profiles")
        .select(`
          id,
          full_name
        `);
        
      if (userError) throw userError;
      
      // For each user, get their email and role
      const usersWithRoles = await Promise.all(
        userData.map(async (user) => {
          // Get user role using RPC
          const { data: roleData, error: roleError } = await supabase.rpc('get_user_role', {
            user_id: user.id
          });
          
          if (roleError) {
            console.error("Error fetching role:", roleError);
          }
          
          // Get user email
          const { data: authData } = await supabase.auth.admin.getUserById(user.id);
          
          return {
            id: user.id,
            email: authData?.user?.email || "Unknown",
            full_name: user.full_name || "Unknown",
            role: (roleData as UserRole) || "user",
          };
        })
      );
      
      setUsers(usersWithRoles);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load user data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const updateUserRole = async (userId: string, role: UserRole) => {
    try {
      // Use RPC to update user role
      const { error } = await supabase.rpc('assign_user_role', {
        user_id: userId,
        role_name: role
      });
          
      if (error) throw error;
      
      // Update local state
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userId ? { ...user, role } : user
        )
      );
      
      toast.success(`User role updated to ${role}`);
    } catch (error) {
      console.error("Error updating user role:", error);
      toast.error("Failed to update user role");
    }
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case "admin":
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500">Admin</Badge>;
      case "moderator":
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-500">Moderator</Badge>;
      default:
        return <Badge variant="outline">User</Badge>;
    }
  };

  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold">User Management</h3>
          <div className="relative w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
        
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
            <p className="mt-2">Loading users...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredUsers.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No users found matching your search criteria.</p>
              </div>
            ) : (
              filteredUsers.map((user) => (
                <div key={user.id} className="border p-4 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold">{user.full_name}</h4>
                        {getRoleBadge(user.role)}
                      </div>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Select
                        defaultValue={user.role}
                        onValueChange={(value) => updateUserRole(user.id, value as UserRole)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user">
                            <div className="flex items-center gap-2">
                              <UserRoundCheck className="h-4 w-4" />
                              <span>User</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="moderator">
                            <div className="flex items-center gap-2">
                              <Shield className="h-4 w-4" />
                              <span>Moderator</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="admin">
                            <div className="flex items-center gap-2">
                              <Shield className="h-4 w-4" />
                              <span>Admin</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <Button 
                        variant="outline" 
                        size="icon"
                        className="text-red-600 hover:text-red-800"
                        onClick={() => toast.info("Delete user functionality coming soon")}
                      >
                        <UserRoundMinus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
