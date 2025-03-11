import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog, DialogContent, DialogDescription, DialogFooter, 
  DialogHeader, DialogTitle, DialogTrigger, DialogClose 
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { 
  UserRoundPlus, Shield, AlertTriangle, CheckCircle2, 
  MailCheck, KeyRound, Ban
} from "lucide-react";
import { UserRole } from "@/types/feedback";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

interface Moderator {
  id: string;
  email: string;
  full_name: string | null;
  created_at: string;
  last_sign_in?: string;
  status: 'active' | 'inactive' | 'pending';
}

export function ModeratorManagement() {
  const [moderators, setModerators] = useState<Moderator[]>([]);
  const [loading, setLoading] = useState(true);
  const [newModeratorData, setNewModeratorData] = useState({
    email: '',
    fullName: ''
  });

  useEffect(() => {
    fetchModerators();
  }, []);

  const fetchModerators = async () => {
    setLoading(true);
    try {
      // First get all users with moderator role
      const { data: roleModerators, error: roleError } = await supabase
        .from('user_roles')
        .select('user_id')
        .eq('role', 'moderator');
      
      if (roleError) throw roleError;

      if (!roleModerators.length) {
        setModerators([]);
        setLoading(false);
        return;
      }

      // Get profile info for each moderator
      const moderatorIds = roleModerators.map(m => m.user_id);
      
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name, created_at')
        .in('id', moderatorIds);
        
      if (profilesError) throw profilesError;

      // Get authentication info
      const moderatorsWithDetails = await Promise.all(
        profilesData.map(async (profile) => {
          const { data: authData } = await supabase.auth.admin.getUserById(profile.id);
          
          // Determine status
          let status: 'active' | 'inactive' | 'pending' = 'inactive';
          
          if (authData?.user) {
            if (authData.user.last_sign_in_at) {
              const lastSignIn = new Date(authData.user.last_sign_in_at);
              const daysSinceSignIn = Math.floor((Date.now() - lastSignIn.getTime()) / (1000 * 60 * 60 * 24));
              
              status = daysSinceSignIn < 30 ? 'active' : 'inactive';
            } else {
              status = 'pending';
            }
          }
          
          return {
            id: profile.id,
            email: authData?.user?.email || "Unknown",
            full_name: profile.full_name,
            created_at: profile.created_at,
            last_sign_in: authData?.user?.last_sign_in_at,
            status
          };
        })
      );
      
      setModerators(moderatorsWithDetails);
    } catch (error) {
      console.error("Error fetching moderators:", error);
      toast.error("Failed to load moderator data");
    } finally {
      setLoading(false);
    }
  };

  const createModerator = async () => {
    if (!newModeratorData.email) {
      toast.error("Please enter an email address");
      return;
    }

    try {
      // Generate a random secure password for the initial account
      const tempPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8).toUpperCase();
      
      // Create the user
      const { data, error } = await supabase.auth.signUp({
        email: newModeratorData.email,
        password: tempPassword,
      });
      
      if (error) throw error;
      
      if (data?.user) {
        // Assign the moderator role
        const { error: roleError } = await supabase.rpc('assign_user_role_fixed', {
          p_user_id: data.user.id,
          p_role_name: 'moderator'
        });
        
        if (roleError) throw roleError;
        
        // Update profile with name if provided
        if (newModeratorData.fullName) {
          const { error: profileError } = await supabase
            .from('profiles')
            .update({ full_name: newModeratorData.fullName })
            .eq('id', data.user.id);
            
          if (profileError) throw profileError;
        }
        
        // Send password reset to allow them to set their own password
        await supabase.auth.resetPasswordForEmail(newModeratorData.email, {
          redirectTo: `${window.location.origin}/auth/reset-password`,
        });
        
        toast.success("Moderator created and invited successfully");
        
        // Clear form and refresh moderators
        setNewModeratorData({
          email: '',
          fullName: ''
        });
        
        fetchModerators();
      }
    } catch (error: any) {
      console.error("Error creating moderator:", error);
      toast.error(`Failed to create moderator: ${error.message}`);
    }
  };

  const removeModerator = async (moderatorId: string) => {
    try {
      // Change role to regular user
      const { error } = await supabase.rpc('assign_user_role_fixed', {
        p_user_id: moderatorId,
        p_role_name: 'user'
      });
      
      if (error) throw error;
      
      toast.success("Moderator removed successfully");
      fetchModerators();
    } catch (error) {
      console.error("Error removing moderator:", error);
      toast.error("Failed to remove moderator");
    }
  };

  const resetPassword = async (email: string) => {
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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <CardTitle>Moderator Management</CardTitle>
              <CardDescription>Manage platform moderators who help review feedback submissions</CardDescription>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <UserRoundPlus className="h-4 w-4" />
                  <span>Add Moderator</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Moderator</DialogTitle>
                  <DialogDescription>
                    Add a new moderator to help manage feedback submissions
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <label htmlFor="email">Email</label>
                    <Input 
                      id="email"
                      placeholder="moderator@example.com"
                      value={newModeratorData.email}
                      onChange={(e) => setNewModeratorData({...newModeratorData, email: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="fullName">Full Name (Optional)</label>
                    <Input 
                      id="fullName"
                      placeholder="John Doe"
                      value={newModeratorData.fullName}
                      onChange={(e) => setNewModeratorData({...newModeratorData, fullName: e.target.value})}
                    />
                  </div>
                </div>
                
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button onClick={createModerator}>Create & Invite</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          ) : moderators.length === 0 ? (
            <div className="text-center py-12 border rounded-lg">
              <Shield className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
              <h3 className="text-lg font-medium">No Moderators Yet</h3>
              <p className="text-muted-foreground mb-4">Create your first moderator to help manage feedback</p>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>Add Your First Moderator</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Moderator</DialogTitle>
                    <DialogDescription>
                      Add a new moderator to help manage feedback submissions
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <label htmlFor="email">Email</label>
                      <Input 
                        id="email"
                        placeholder="moderator@example.com"
                        value={newModeratorData.email}
                        onChange={(e) => setNewModeratorData({...newModeratorData, email: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="fullName">Full Name (Optional)</label>
                      <Input 
                        id="fullName"
                        placeholder="John Doe"
                        value={newModeratorData.fullName}
                        onChange={(e) => setNewModeratorData({...newModeratorData, fullName: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button onClick={createModerator}>Create & Invite</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          ) : (
            <div className="grid gap-6">
              {moderators.map((moderator) => (
                <div key={moderator.id} className="border rounded-lg p-6">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium">{moderator.full_name || "Unnamed Moderator"}</h3>
                        <Badge variant="outline" className="text-blue-600 bg-blue-50 dark:bg-blue-900/20">Moderator</Badge>
                        {moderator.status === 'active' && (
                          <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/30">Active</Badge>
                        )}
                        {moderator.status === 'inactive' && (
                          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30">Inactive</Badge>
                        )}
                        {moderator.status === 'pending' && (
                          <Badge variant="outline" className="bg-gray-100 text-gray-800 dark:bg-gray-900/30">Pending</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{moderator.email}</p>
                      <p className="text-xs text-muted-foreground">
                        Added {format(new Date(moderator.created_at), 'MMM d, yyyy')}
                        {moderator.last_sign_in && (
                          <> • Last sign in: {format(new Date(moderator.last_sign_in), 'MMM d, yyyy')}</>
                        )}
                      </p>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="flex items-center gap-1.5">
                            <KeyRound className="h-3.5 w-3.5" />
                            <span>Reset Password</span>
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Reset Moderator Password</DialogTitle>
                            <DialogDescription>
                              This will send a password reset email to {moderator.email}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="py-4">
                            <p>Are you sure you want to send a password reset email?</p>
                          </div>
                          <DialogFooter>
                            <DialogClose asChild>
                              <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button onClick={() => resetPassword(moderator.email)}>
                              Send Reset Email
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 flex items-center gap-1.5">
                            <Shield className="h-3.5 w-3.5" />
                            <span>Remove Role</span>
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Remove Moderator Role</DialogTitle>
                            <DialogDescription>
                              This will remove moderator privileges from this user
                            </DialogDescription>
                          </DialogHeader>
                          <div className="py-4">
                            <p>Are you sure you want to remove moderator status from:</p>
                            <p className="font-medium">{moderator.email}</p>
                            <p className="mt-2 text-sm text-muted-foreground">
                              They will still be able to access the platform as a regular user.
                            </p>
                          </div>
                          <DialogFooter>
                            <DialogClose asChild>
                              <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button 
                              variant="destructive" 
                              onClick={() => removeModerator(moderator.id)}
                            >
                              Remove Moderator Role
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 