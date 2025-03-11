import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { FeedbackSubmission } from "@/types/feedback";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UserManagement } from "./UserManagement";
import { EnhancedUserManagement } from "./EnhancedUserManagement";
import { ModeratorManagement } from "./ModeratorManagement";
import { ModeratorAssignment } from "./ModeratorAssignment";
import { DashboardCharts } from "./DashboardCharts";
import { CreateTestAccounts } from "./CreateTestAccounts";
import { UserCreationForm } from "./UserCreationForm";
import { 
  AlertTriangle, CheckCircle, Clock, FileText, Users, 
  LayoutDashboard, MessageSquare, Shield, Settings, Activity,
  MapPin
} from "lucide-react";
import { toast } from "sonner";

export function AdminDashboard() {
  const [feedbacks, setFeedbacks] = useState<FeedbackSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    reviewing: 0,
    resolved: 0,
    rejected: 0
  });

  const fetchFeedbacks = async () => {
    setLoading(true);
    try {
      // Admin can see all feedback
      const { data, error } = await supabase
        .from("feedback")
        .select("*")
        .order("created_at", { ascending: false });
        
      if (error) throw error;
      
      if (data) {
        setFeedbacks(data as unknown as FeedbackSubmission[]);
        
        // Calculate stats
        setStats({
          total: data.length,
          pending: data.filter(item => item.status === "pending").length,
          reviewing: data.filter(item => item.status === "reviewing").length,
          resolved: data.filter(item => item.status === "resolved").length,
          rejected: data.filter(item => item.status === "rejected").length
        });
      }
    } catch (error) {
      console.error("Error fetching feedback:", error);
      toast.error("Failed to load feedback data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from("feedback")
        .update({ status })
        .eq("id", id);
        
      if (error) throw error;
      
      // Update local state
      setFeedbacks(prevFeedbacks => 
        prevFeedbacks.map(feedback => 
          feedback.id === id ? { ...feedback, status: status as any } : feedback
        )
      );
      
      toast.success(`Feedback status updated to ${status}`);
      
      // Update stats
      fetchFeedbacks();
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500">Pending</Badge>;
      case "reviewing":
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-500">Reviewing</Badge>;
      case "resolved":
        return <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500">Resolved</Badge>;
      case "rejected":
        return <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Tabs defaultValue="dashboard" className="w-full">
      <TabsList className="grid grid-cols-5">
        <TabsTrigger value="overview" className="flex items-center gap-1">
          <LayoutDashboard className="h-4 w-4" />
          <span className="hidden sm:inline-block">Overview</span>
        </TabsTrigger>
        <TabsTrigger value="feedbacks" className="flex items-center gap-1">
          <MessageSquare className="h-4 w-4" />
          <span className="hidden sm:inline-block">Feedbacks</span>
        </TabsTrigger>
        <TabsTrigger value="users" className="flex items-center gap-1">
          <Users className="h-4 w-4" />
          <span className="hidden sm:inline-block">Users</span>
        </TabsTrigger>
        <TabsTrigger value="moderators" className="flex items-center gap-1">
          <Shield className="h-4 w-4" />
          <span className="hidden sm:inline-block">Moderators</span>
        </TabsTrigger>
        <TabsTrigger value="assignments" className="flex items-center gap-1">
          <MapPin className="h-4 w-4" />
          <span className="hidden sm:inline-block">Assignments</span>
        </TabsTrigger>
      </TabsList>
      
      {/* Dashboard Tab */}
      <TabsContent value="overview" className="space-y-6">
        <DashboardCharts />
        
        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-4">Recent Feedback</h3>
            {loading ? (
              <div className="text-center py-4">
                <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
                <p className="mt-2">Loading recent feedback...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {feedbacks.slice(0, 5).map((feedback) => (
                  <div key={feedback.id} className="border-b pb-4 last:border-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{feedback.category}</p>
                        <p className="text-sm text-muted-foreground line-clamp-2">{feedback.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs text-muted-foreground">
                            ID: {feedback.tracking_id}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(feedback.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      {getStatusBadge(feedback.status)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
      
      {/* Feedback Management Tab */}
      <TabsContent value="feedbacks" className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">All Feedback</h3>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={fetchFeedbacks}
                  className="flex items-center gap-1"
                >
                  <Activity className="h-4 w-4" />
                  Refresh Data
                </Button>
              </div>
            </div>
            
            {loading ? (
              <div className="text-center py-4">
                <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
                <p className="mt-2">Loading feedback...</p>
              </div>
            ) : (
              <div className="space-y-6">
                {feedbacks.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-20" />
                    <p>No feedback submissions yet.</p>
                  </div>
                ) : (
                  feedbacks.map((feedback) => (
                    <div key={feedback.id} className="border p-4 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold">{feedback.category}</h4>
                            {getStatusBadge(feedback.status)}
                          </div>
                          
                          <p className="text-sm">{feedback.description}</p>
                          
                          <div className="text-sm text-muted-foreground grid grid-cols-2 gap-2">
                            <p><span className="font-medium">ID:</span> {feedback.tracking_id}</p>
                            <p><span className="font-medium">Date:</span> {new Date(feedback.created_at).toLocaleDateString()}</p>
                            <p><span className="font-medium">Region:</span> {feedback.region}</p>
                            <p><span className="font-medium">District:</span> {feedback.district || "N/A"}</p>
                            <p><span className="font-medium">Name:</span> {feedback.full_name || "Anonymous"}</p>
                            <p><span className="font-medium">Contact:</span> {feedback.phone_number || feedback.email || "None provided"}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 mt-4">
                        <Button 
                          size="sm" 
                          variant={feedback.status === "reviewing" ? "default" : "outline"}
                          onClick={() => updateStatus(feedback.id, "reviewing")}
                        >
                          Mark as Reviewing
                        </Button>
                        <Button 
                          size="sm" 
                          variant={feedback.status === "resolved" ? "default" : "outline"}
                          onClick={() => updateStatus(feedback.id, "resolved")}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          Mark as Resolved
                        </Button>
                        <Button 
                          size="sm" 
                          variant={feedback.status === "rejected" ? "default" : "outline"}
                          onClick={() => updateStatus(feedback.id, "rejected")}
                          className="bg-red-600 hover:bg-red-700 text-white"
                        >
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
      
      {/* User Management Tab */}
      <TabsContent value="users" className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <EnhancedUserManagement />
          </div>
          <div>
            <UserCreationForm />
          </div>
        </div>
      </TabsContent>

      {/* Moderator Management Tab */}
      <TabsContent value="moderators">
        <ModeratorManagement />
      </TabsContent>

      {/* Moderator Assignment Tab */}
      <TabsContent value="assignments">
        <ModeratorAssignment />
      </TabsContent>

      {/* System Settings Tab */}
      <TabsContent value="system" className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-6">System Settings</h3>
            
            <div className="mb-8">
              <h4 className="text-lg font-medium mb-4">Test Accounts</h4>
              <p className="text-muted-foreground mb-4">
                Create test accounts for development and testing purposes.
              </p>
              <CreateTestAccounts />
            </div>
            
            <div className="mb-8">
              <h4 className="text-lg font-medium mb-4">Database Stats</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4 flex flex-col items-center">
                    <span className="text-muted-foreground text-sm">Total Feedback</span>
                    <span className="text-2xl font-bold">{stats.total}</span>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 flex flex-col items-center">
                    <span className="text-muted-foreground text-sm">Active Users</span>
                    <span className="text-2xl font-bold">-</span>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 flex flex-col items-center">
                    <span className="text-muted-foreground text-sm">Storage Usage</span>
                    <span className="text-2xl font-bold">-</span>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-medium mb-4">System Actions</h4>
              <div className="flex flex-wrap gap-3">
                <Button variant="outline" onClick={() => toast.info("This feature is not yet implemented")}>
                  Refresh Caches
                </Button>
                <Button 
                  variant="outline" 
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => toast.info("This feature is not yet implemented")}
                >
                  Clear All Data
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
