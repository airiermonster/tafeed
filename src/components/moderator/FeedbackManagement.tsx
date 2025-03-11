import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import { FeedbackSubmission } from "@/types/feedback";
import { format } from "date-fns";
import { 
  Search, 
  Filter, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  MessageCircle,
  RefreshCw, 
  ChevronDown,
  SlidersHorizontal,
  ClipboardCheck,
  Ban
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";

interface FeedbackManagementProps {
  moderatorRegion?: string;
}

export function FeedbackManagement({ moderatorRegion }: FeedbackManagementProps) {
  const { profile } = useAuth();
  const [feedbacks, setFeedbacks] = useState<FeedbackSubmission[]>([]);
  const [filteredFeedbacks, setFilteredFeedbacks] = useState<FeedbackSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackSubmission | null>(null);
  const [responseText, setResponseText] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [categories, setCategories] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "priority">("newest");

  // Get region from props or from user profile
  const region = moderatorRegion || profile?.region || "All Regions";

  useEffect(() => {
    fetchFeedbacks();
  }, [region]);

  useEffect(() => {
    // Apply filters and sorting whenever the base data or filters change
    applyFiltersAndSort();
  }, [feedbacks, searchTerm, statusFilter, categoryFilter, sortBy]);

  const fetchFeedbacks = async () => {
    setLoading(true);
    try {
      // Build query
      let query = supabase.from("feedback").select("*");
      
      // Add region filter if specific region provided
      if (region && region !== "All Regions") {
        query = query.eq("region", region);
      }
      
      const { data, error } = await query.order("created_at", { ascending: false });
      
      if (error) throw error;
      
      if (data) {
        setFeedbacks(data as unknown as FeedbackSubmission[]);
        
        // Extract unique categories for filter dropdown
        const uniqueCategories = [...new Set(data.map(f => f.category))];
        setCategories(uniqueCategories);
      }
    } catch (error) {
      console.error("Error fetching feedback:", error);
      toast.error("Failed to load feedback data");
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndSort = () => {
    let result = [...feedbacks];
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(feedback => 
        feedback.tracking_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        feedback.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        feedback.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (feedback.full_name && feedback.full_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (feedback.district && feedback.district.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter(feedback => feedback.status === statusFilter);
    }
    
    // Apply category filter
    if (categoryFilter !== "all") {
      result = result.filter(feedback => feedback.category === categoryFilter);
    }
    
    // Apply sorting
    result.sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      } else if (sortBy === "oldest") {
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      } else if (sortBy === "priority") {
        // Priority: pending > reviewing > resolved > rejected
        const priorityMap: Record<string, number> = {
          pending: 3,
          reviewing: 2,
          resolved: 1,
          rejected: 0
        };
        return priorityMap[b.status] - priorityMap[a.status];
      }
      return 0;
    });
    
    setFilteredFeedbacks(result);
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      // First get the feedback to check if it already has the same status
      const { data: feedbackData, error: fetchError } = await supabase
        .from("feedback")
        .select("status, user_id, tracking_id, full_name, email")
        .eq("id", id)
        .single();
      
      if (fetchError) throw fetchError;
      
      // If status is the same, no need to update
      if (feedbackData && feedbackData.status === status) {
        toast.info(`Feedback is already marked as ${status}`);
        return;
      }
      
      // Update the feedback status
      const { error } = await supabase
        .from("feedback")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", id);
        
      if (error) throw error;
      
      // Update local state
      setFeedbacks(prevFeedbacks => 
        prevFeedbacks.map(feedback => 
          feedback.id === id ? { ...feedback, status: status as any, updated_at: new Date().toISOString() } : feedback
        )
      );
      
      if (selectedFeedback && selectedFeedback.id === id) {
        setSelectedFeedback({...selectedFeedback, status: status as any, updated_at: new Date().toISOString()});
      }
      
      // Create a notification for the user
      if (feedbackData) {
        const statusMessages = {
          pending: "Your feedback has been placed in pending status.",
          reviewing: "Your feedback is now being reviewed by a moderator.",
          resolved: "Your feedback has been resolved. Thank you for your contribution!",
          rejected: "Your feedback has been rejected. Please contact us for more information."
        };
        
        // Only create notification if user_id exists
        if (feedbackData.user_id) {
          const { error: notificationError } = await supabase
            .from('feedback_notifications')
            .insert({
              feedback_id: id,
              user_id: feedbackData.user_id,
              message: `Status update: ${statusMessages[status as keyof typeof statusMessages]}`,
              is_read: false
            });
            
          if (notificationError) {
            console.error("Error creating notification:", notificationError);
            // Continue anyway since the status update is already done
          }
        }
        
        // If user provided email, send notification (in a real app this would send an actual email)
        if (feedbackData.email) {
          console.log(`Would send email to ${feedbackData.email} about status change to ${status}`);
          // In a real app: await sendStatusUpdateEmail(feedbackData.email, feedbackData.tracking_id, status);
        }
      }
      
      toast.success(`Feedback status updated to ${status}`);
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  const submitResponse = async () => {
    if (!selectedFeedback || !responseText.trim()) {
      toast.error("Please enter a response");
      return;
    }
    
    try {
      // In a real app, save the response to a responses table
      const responseId = Math.random().toString(36).substring(2, 15);
      
      // For now we'll just create a notification with the response text
      const { data: feedbackData, error: fetchError } = await supabase
        .from("feedback")
        .select("user_id, email, full_name, tracking_id")
        .eq("id", selectedFeedback.id)
        .single();
        
      if (fetchError) throw fetchError;
      
      // Create a notification for the user if they have an account
      if (feedbackData && feedbackData.user_id) {
        const { error: notificationError } = await supabase
          .from('feedback_notifications')
          .insert({
            feedback_id: selectedFeedback.id,
            user_id: feedbackData.user_id,
            message: `Response to your feedback: ${responseText}`,
            is_read: false
          });
          
        if (notificationError) {
          console.error("Error creating notification:", notificationError);
        }
      }
      
      // If user provided email, send notification (in a real app this would send an actual email)
      if (feedbackData && feedbackData.email) {
        console.log(`Would send email to ${feedbackData.email} with response: ${responseText}`);
        // In a real app: await sendResponseEmail(feedbackData.email, feedbackData.tracking_id, responseText);
      }
      
      toast.success("Response sent successfully");
      
      // Update the status to "resolved" if it was "pending" or "reviewing"
      if (selectedFeedback.status === "pending" || selectedFeedback.status === "reviewing") {
        await updateStatus(selectedFeedback.id, "resolved");
      }
      
      // Clear the response text
      setResponseText("");
    } catch (error) {
      console.error("Error submitting response:", error);
      toast.error("Failed to submit response");
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "reviewing":
        return <Clock className="h-4 w-4 text-blue-500" />;
      case "resolved":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "rejected":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">Feedback Management</h2>
          <p className="text-muted-foreground">
            Manage and respond to feedback submissions {region !== "All Regions" ? `in ${region}` : "across all regions"}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={fetchFeedbacks}
            className="flex items-center gap-1"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </Button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Feedback List Section */}
        <div className="lg:w-1/2 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <CardTitle>Feedback List</CardTitle>
                <div className="flex items-center gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="gap-1">
                        <SlidersHorizontal className="h-4 w-4" />
                        <span>Filters</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Filter Feedback</DialogTitle>
                        <DialogDescription>
                          Customize your view by filtering the feedback list
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label>Status</Label>
                          <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger>
                              <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Status</SelectItem>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="reviewing">Reviewing</SelectItem>
                              <SelectItem value="resolved">Resolved</SelectItem>
                              <SelectItem value="rejected">Rejected</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Category</Label>
                          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                            <SelectTrigger>
                              <SelectValue placeholder="Filter by category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Categories</SelectItem>
                              {categories.map(category => (
                                <SelectItem key={category} value={category}>{category}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Sort By</Label>
                          <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="newest">Newest First</SelectItem>
                              <SelectItem value="oldest">Oldest First</SelectItem>
                              <SelectItem value="priority">Priority (Pending First)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button 
                          variant="outline" 
                          onClick={() => {
                            setStatusFilter("all");
                            setCategoryFilter("all");
                            setSortBy("newest");
                          }}
                        >
                          Reset Filters
                        </Button>
                        <DialogClose asChild>
                          <Button>Apply Filters</Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search feedback..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9 h-9"
                    />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-20 w-full" />
                  ))}
                </div>
              ) : filteredFeedbacks.length === 0 ? (
                <div className="text-center py-12">
                  <MessageCircle className="mx-auto h-12 w-12 text-muted-foreground opacity-20" />
                  <h3 className="mt-4 text-lg font-medium">No feedback found</h3>
                  <p className="text-muted-foreground mt-2">Try adjusting your filters or search terms</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredFeedbacks.map((feedback) => (
                    <div 
                      key={feedback.id} 
                      className={`
                        border p-3 rounded-lg cursor-pointer transition-colors
                        ${selectedFeedback?.id === feedback.id ? 'bg-muted/50 border-primary' : 'hover:bg-muted/30'}
                      `}
                      onClick={() => setSelectedFeedback(feedback)}
                    >
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(feedback.status)}
                            <h4 className="font-medium">{feedback.category}</h4>
                            {getStatusBadge(feedback.status)}
                          </div>
                          <p className="text-sm line-clamp-1">{feedback.description}</p>
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                            <span>ID: {feedback.tracking_id}</span>
                            <span>•</span>
                            <span>{format(new Date(feedback.created_at), 'MMM d, yyyy')}</span>
                            <span>•</span>
                            <span>{feedback.district || feedback.region}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {!loading && filteredFeedbacks.length > 0 && (
                <div className="mt-4 text-center text-sm text-muted-foreground">
                  Showing {filteredFeedbacks.length} of {feedbacks.length} items
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Feedback Details Section */}
        <div className="lg:w-1/2">
          <Card className="h-full">
            {selectedFeedback ? (
              <>
                <CardHeader className="pb-3">
                  <div className="flex justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <span>Feedback Details</span>
                        {getStatusBadge(selectedFeedback.status)}
                      </CardTitle>
                      <CardDescription>
                        ID: {selectedFeedback.tracking_id} • Submitted {format(new Date(selectedFeedback.created_at), 'MMM d, yyyy')}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Category</h3>
                      <p>{selectedFeedback.category}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Description</h3>
                      <div className="p-3 bg-muted/50 rounded-md">
                        <p>{selectedFeedback.description}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">Region</h3>
                        <p>{selectedFeedback.region}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">District</h3>
                        <p>{selectedFeedback.district || "Not specified"}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">Ward</h3>
                        <p>{selectedFeedback.ward || "Not specified"}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">Street</h3>
                        <p>{selectedFeedback.street || "Not specified"}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Contact Information</h3>
                      <div className="flex items-center gap-3">
                        {selectedFeedback.full_name ? (
                          <Avatar className="h-10 w-10">
                            <AvatarFallback>
                              {selectedFeedback.full_name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        ) : (
                          <Avatar className="h-10 w-10">
                            <AvatarFallback>?</AvatarFallback>
                          </Avatar>
                        )}
                        <div>
                          <p className="font-medium">{selectedFeedback.full_name || "Anonymous"}</p>
                          <p className="text-sm text-muted-foreground">
                            {selectedFeedback.email || selectedFeedback.phone_number || "No contact provided"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t pt-6">
                    <h3 className="text-sm font-medium mb-2">Response</h3>
                    <Textarea
                      placeholder="Type your response here..."
                      className="min-h-32"
                      value={responseText}
                      onChange={(e) => setResponseText(e.target.value)}
                    />
                    <div className="flex justify-between mt-4">
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1"
                          onClick={() => updateStatus(selectedFeedback.id, "reviewing")}
                        >
                          <Clock className="h-4 w-4" />
                          <span>Mark Reviewing</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1"
                          onClick={() => updateStatus(selectedFeedback.id, "rejected")}
                        >
                          <Ban className="h-4 w-4" />
                          <span>Reject</span>
                        </Button>
                      </div>
                      <Button
                        size="sm"
                        className="gap-1"
                        onClick={submitResponse}
                        disabled={!responseText.trim()}
                      >
                        <ClipboardCheck className="h-4 w-4" />
                        <span>Mark Resolved & Send</span>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center text-center h-full py-16">
                <MessageCircle className="h-16 w-16 text-muted-foreground opacity-20 mb-4" />
                <h3 className="text-lg font-medium">No feedback selected</h3>
                <p className="text-muted-foreground mt-2 mb-8 max-w-md">
                  Select a feedback from the list to view details and respond to it
                </p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
} 