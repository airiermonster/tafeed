import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { 
  Dialog, DialogContent, DialogDescription, DialogFooter, 
  DialogHeader, DialogTitle, DialogTrigger, DialogClose 
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { 
  Shield, Search, UserRoundCheck, UserRoundMinus, MoreHorizontal, 
  UserRoundPlus, KeyRound, Ban, MailPlus, UserRoundX, Check, Filter, 
  ArrowUpDown, ChevronDown 
} from "lucide-react";
import { UserRole } from "@/types/feedback";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

interface User {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
  last_sign_in?: string;
  created_at: string;
  phone_number: string | null;
}

export function EnhancedUserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<UserRole | "all">("all");
  const [sortField, setSortField] = useState<"full_name" | "email" | "created_at" | "role">("created_at");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [resetEmailData, setResetEmailData] = useState({
    userId: "",
    email: "",
    name: ""
  });
  const [inviteData, setInviteData] = useState({
    email: "",
    role: "user" as UserRole
  });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Get users with their profiles
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select(`
          id,
          full_name,
          phone_number,
          created_at
        `);
        
      if (profilesError) throw profilesError;
      
      // For each user, get their email and role
      const usersWithRoles = await Promise.all(
        profilesData.map(async (profile) => {
          // Get user role using fixed RPC
          const { data: roleData, error: roleError } = await supabase.rpc('get_user_role_fixed', {
            p_user_id: profile.id
          });
          
          if (roleError) {
            console.error("Error fetching role:", roleError);
          }
          
          // Get user auth details
          const { data: authData } = await supabase.auth.admin.getUserById(profile.id);
          
          return {
            id: profile.id,
            email: authData?.user?.email || "Unknown",
            full_name: profile.full_name,
            role: (roleData as UserRole) || "user",
            last_sign_in: authData?.user?.last_sign_in_at,
            created_at: profile.created_at,
            phone_number: profile.phone_number
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
      const { error } = await supabase.rpc('assign_user_role_fixed', {
        p_user_id: userId,
        p_role_name: role
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

  const banUser = async (userId: string) => {
    try {
      const { error } = await supabase.auth.admin.updateUserById(
        userId,
        { ban_duration: 'none' }
      );
      
      if (error) throw error;
      
      toast.success("User banned successfully");
      
      // Update the local state
      fetchUsers();
    } catch (error) {
      console.error("Error banning user:", error);
      toast.error("Failed to ban user");
    }
  };

  const resetPassword = async (userId: string, email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });
      
      if (error) throw error;
      
      toast.success("Password reset email sent successfully");
    } catch (error) {
      console.error("Error sending password reset:", error);
      toast.error("Failed to send password reset email");
    }
  };

  const inviteUser = async () => {
    if (!inviteData.email) {
      toast.error("Please enter an email address");
      return;
    }

    try {
      // Generate a random secure password for the initial account
      const tempPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8).toUpperCase();
      
      // Create the user
      const { data, error } = await supabase.auth.signUp({
        email: inviteData.email,
        password: tempPassword,
      });
      
      if (error) throw error;
      
      if (data?.user) {
        // Assign the role
        const { error: roleError } = await supabase.rpc('assign_user_role_fixed', {
          p_user_id: data.user.id,
          p_role_name: inviteData.role
        });
        
        if (roleError) throw roleError;
        
        // Send password reset to allow them to set their own password
        await supabase.auth.resetPasswordForEmail(inviteData.email, {
          redirectTo: `${window.location.origin}/auth/reset-password`,
        });
        
        toast.success("User invited successfully");
        
        // Clear form and refresh users
        setInviteData({
          email: "",
          role: "user" as UserRole
        });
        
        fetchUsers();
      }
    } catch (error: any) {
      console.error("Error inviting user:", error);
      toast.error(`Failed to invite user: ${error.message}`);
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

  // Apply filters and sorting
  let filteredUsers = users;
  
  // Apply search filter
  if (searchTerm) {
    filteredUsers = filteredUsers.filter(user => 
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.full_name && user.full_name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }
  
  // Apply role filter
  if (roleFilter !== "all") {
    filteredUsers = filteredUsers.filter(user => user.role === roleFilter);
  }
  
  // Apply sorting
  filteredUsers = [...filteredUsers].sort((a, b) => {
    // Handle null values
    const aValue = a[sortField] || "";
    const bValue = b[sortField] || "";
    
    // Compare based on direction
    const comparison = sortDirection === "asc" 
      ? String(aValue).localeCompare(String(bValue))
      : String(bValue).localeCompare(String(aValue));
    
    return comparison;
  });

  // Toggle sort direction when clicking on the same field
  const handleSort = (field: typeof sortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const renderSortIcon = (field: typeof sortField) => {
    if (field !== sortField) return <ChevronDown className="ml-1 h-4 w-4 opacity-50" />;
    return sortDirection === "asc" 
      ? <ChevronDown className="ml-1 h-4 w-4" /> 
      : <ChevronDown className="ml-1 h-4 w-4 transform rotate-180" />;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <CardTitle>User Management</CardTitle>
            <div className="flex gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="flex gap-2 items-center">
                    <UserRoundPlus className="h-4 w-4" />
                    <span>Invite User</span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Invite New User</DialogTitle>
                    <DialogDescription>
                      Send an invitation to a new user with specific role permissions.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <label htmlFor="email">Email</label>
                      <Input 
                        id="email" 
                        placeholder="user@example.com" 
                        value={inviteData.email}
                        onChange={(e) => setInviteData({...inviteData, email: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="role">Role</label>
                      <Select 
                        value={inviteData.role} 
                        onValueChange={(value) => setInviteData({...inviteData, role: value as UserRole})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user">Regular User</SelectItem>
                          <SelectItem value="moderator">Moderator</SelectItem>
                          <SelectItem value="admin">Administrator</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button onClick={inviteUser}>Send Invitation</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <div className="flex gap-2">
              <div className="w-48">
                <Select value={roleFilter} onValueChange={(value) => setRoleFilter(value as UserRole | "all")}>
                  <SelectTrigger>
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      <SelectValue placeholder="Filter by role" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="user">Users Only</SelectItem>
                    <SelectItem value="moderator">Moderators Only</SelectItem>
                    <SelectItem value="admin">Admins Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm("");
                  setRoleFilter("all");
                  setSortField("created_at");
                  setSortDirection("desc");
                }}
              >
                Clear Filters
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-1/4">
                      <button 
                        className="flex items-center font-medium"
                        onClick={() => handleSort("full_name")}
                      >
                        Name {renderSortIcon("full_name")}
                      </button>
                    </TableHead>
                    <TableHead className="w-1/4">
                      <button 
                        className="flex items-center font-medium"
                        onClick={() => handleSort("email")}
                      >
                        Email {renderSortIcon("email")}
                      </button>
                    </TableHead>
                    <TableHead className="w-1/6">
                      <button 
                        className="flex items-center font-medium"
                        onClick={() => handleSort("role")}
                      >
                        Role {renderSortIcon("role")}
                      </button>
                    </TableHead>
                    <TableHead className="w-1/6">
                      <button 
                        className="flex items-center font-medium"
                        onClick={() => handleSort("created_at")}
                      >
                        Joined {renderSortIcon("created_at")}
                      </button>
                    </TableHead>
                    <TableHead className="w-1/6 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center">
                        No users found matching your criteria.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">
                          {user.full_name || "No name provided"}
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{getRoleBadge(user.role)}</TableCell>
                        <TableCell>{format(new Date(user.created_at), 'MMM d, yyyy')}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              
                              <DropdownMenuItem onClick={() => updateUserRole(user.id, "user")}>
                                <UserRoundCheck className="mr-2 h-4 w-4" />
                                <span>Set as User</span>
                                {user.role === "user" && (
                                  <Check className="ml-2 h-4 w-4" />
                                )}
                              </DropdownMenuItem>
                              
                              <DropdownMenuItem onClick={() => updateUserRole(user.id, "moderator")}>
                                <Shield className="mr-2 h-4 w-4" />
                                <span>Set as Moderator</span>
                                {user.role === "moderator" && (
                                  <Check className="ml-2 h-4 w-4" />
                                )}
                              </DropdownMenuItem>
                              
                              <DropdownMenuItem onClick={() => updateUserRole(user.id, "admin")}>
                                <Shield className="mr-2 h-4 w-4" />
                                <span>Set as Admin</span>
                                {user.role === "admin" && (
                                  <Check className="ml-2 h-4 w-4" />
                                )}
                              </DropdownMenuItem>
                              
                              <DropdownMenuSeparator />
                              
                              <Dialog>
                                <DialogTrigger asChild>
                                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                    <KeyRound className="mr-2 h-4 w-4" />
                                    <span>Reset Password</span>
                                  </DropdownMenuItem>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Reset User Password</DialogTitle>
                                    <DialogDescription>
                                      This will send a password reset email to {user.email}
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="py-4">
                                    <p>Are you sure you want to send a password reset email to this user?</p>
                                  </div>
                                  <DialogFooter>
                                    <DialogClose asChild>
                                      <Button variant="outline">Cancel</Button>
                                    </DialogClose>
                                    <Button onClick={() => resetPassword(user.id, user.email)}>
                                      Send Reset Email
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                              
                              <Dialog>
                                <DialogTrigger asChild>
                                  <DropdownMenuItem 
                                    onSelect={(e) => e.preventDefault()}
                                    className="text-destructive focus:text-destructive"
                                  >
                                    <Ban className="mr-2 h-4 w-4" />
                                    <span>Ban User</span>
                                  </DropdownMenuItem>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Ban User</DialogTitle>
                                    <DialogDescription>
                                      This will prevent the user from accessing the platform.
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="py-4">
                                    <p>Are you sure you want to ban this user?</p>
                                    <p className="font-medium">{user.email}</p>
                                  </div>
                                  <DialogFooter>
                                    <DialogClose asChild>
                                      <Button variant="outline">Cancel</Button>
                                    </DialogClose>
                                    <Button 
                                      variant="destructive" 
                                      onClick={() => banUser(user.id)}
                                    >
                                      Ban User
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 