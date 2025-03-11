import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { 
  Bell, 
  Trash, 
  Check, 
  Clock, 
  AlertCircle, 
  RefreshCw,
  MessageCircle,
  Sparkles,
  X
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";

interface Notification {
  id: number;
  feedback_id: string;
  user_id: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

interface UserFeedback {
  id: string;
  tracking_id: string;
  category: string;
  description: string;
  region: string;
  district?: string;
  ward?: string;
  street?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export function UserNotifications() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [userFeedback, setUserFeedback] = useState<UserFeedback[]>([]);
  
  useEffect(() => {
    if (user) {
      fetchNotificationsAndFeedback();
    }
  }, [user]);
  
  const fetchNotificationsAndFeedback = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // @ts-ignore - using any to avoid TypeScript errors with the custom table
      const { data: notifData, error: notifError } = await supabase
        .from('feedback_notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (notifError) throw notifError;
      
      // Fetch feedback submissions by this user
      const { data: feedbackData, error: feedbackError } = await supabase
        .from('feedback')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (feedbackError) throw feedbackError;
      
      setNotifications(notifData || []);
      setUserFeedback(feedbackData || []);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };
  
  const markAsRead = async (notificationId: number) => {
    try {
      // @ts-ignore - using any to avoid TypeScript errors with the custom table
      const { error } = await supabase
        .from('feedback_notifications')
        .update({ is_read: true })
        .eq('id', notificationId);
        
      if (error) throw error;
      
      // Update local state
      setNotifications(prevNotifications => 
        prevNotifications.map(notif => 
          notif.id === notificationId ? { ...notif, is_read: true } : notif
        )
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
      toast.error("Failed to update notification");
    }
  };
  
  const markAllAsRead = async () => {
    if (!user || notifications.length === 0) return;
    
    try {
      const unreadIds = notifications
        .filter(notif => !notif.is_read)
        .map(notif => notif.id);
        
      if (unreadIds.length === 0) return;
      
      // @ts-ignore - using any to avoid TypeScript errors with the custom table
      const { error } = await supabase
        .from('feedback_notifications')
        .update({ is_read: true })
        .in('id', unreadIds);
        
      if (error) throw error;
      
      // Update local state
      setNotifications(prevNotifications => 
        prevNotifications.map(notif => ({ ...notif, is_read: true }))
      );
      
      toast.success(`Marked ${unreadIds.length} notification(s) as read`);
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      toast.error("Failed to update notifications");
    }
  };
  
  const deleteFeedback = async (feedbackId: string) => {
    try {
      // Check if feedback can be deleted (only pending status)
      const feedback = userFeedback.find(fb => fb.id === feedbackId);
      
      if (!feedback) {
        toast.error("Feedback not found");
        return;
      }
      
      if (feedback.status !== "pending") {
        toast.error("Only pending feedback can be deleted");
        return;
      }
      
      // Delete related notifications first
      // @ts-ignore - using any to avoid TypeScript errors with the custom table
      await supabase
        .from('feedback_notifications')
        .delete()
        .eq('feedback_id', feedbackId);
        
      // Delete the feedback
      const { error } = await supabase
        .from('feedback')
        .delete()
        .eq('id', feedbackId);
        
      if (error) throw error;
      
      // Update local state
      setUserFeedback(prevFeedback => 
        prevFeedback.filter(fb => fb.id !== feedbackId)
      );
      
      // Remove related notifications
      setNotifications(prevNotifications => 
        prevNotifications.filter(notif => notif.feedback_id !== feedbackId)
      );
      
      toast.success("Feedback deleted successfully");
    } catch (error) {
      console.error("Error deleting feedback:", error);
      toast.error("Failed to delete feedback");
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
        return <Check className="h-4 w-4 text-green-500" />;
      case "rejected":
        return <X className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const unreadCount = notifications.filter(notif => !notif.is_read).length;
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold">My Dashboard</h2>
          {unreadCount > 0 && (
            <Badge className="bg-primary text-primary-foreground">
              {unreadCount} new
            </Badge>
          )}
        </div>
        <Button variant="outline" size="sm" onClick={fetchNotificationsAndFeedback} className="gap-1">
          <RefreshCw className="h-4 w-4" />
          <span>Refresh</span>
        </Button>
      </div>
      
      <Tabs defaultValue="notifications" className="space-y-4">
        <TabsList>
          <TabsTrigger value="notifications" className="flex items-center gap-1">
            <Bell className="h-4 w-4" />
            <span>Notifications</span>
            {unreadCount > 0 && (
              <Badge variant="outline" className="ml-1 bg-primary text-primary-foreground h-5 w-5 p-0 flex items-center justify-center rounded-full">
                {unreadCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="submissions" className="flex items-center gap-1">
            <MessageCircle className="h-4 w-4" />
            <span>My Submissions</span>
            <Badge variant="outline" className="ml-1 bg-muted text-muted-foreground h-5 w-5 p-0 flex items-center justify-center rounded-full">
              {userFeedback.length}
            </Badge>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle>Notifications</CardTitle>
                {unreadCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={markAllAsRead} className="gap-1">
                    <Check className="h-4 w-4" />
                    <span>Mark all as read</span>
                  </Button>
                )}
              </div>
              <CardDescription>
                Status updates and responses to your feedback
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : notifications.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Bell className="h-12 w-12 mx-auto opacity-20" />
                  <h3 className="mt-4 text-lg font-medium">No notifications yet</h3>
                  <p className="mt-2">When moderators respond to your feedback, you'll see updates here</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <div 
                      key={notification.id} 
                      className={`p-4 rounded-lg border ${notification.is_read ? 'bg-card' : 'bg-muted/30 border-primary/20'}`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Sparkles className={`h-4 w-4 ${notification.is_read ? 'text-muted-foreground' : 'text-primary'}`} />
                            <p className="text-sm">
                              {notification.message}
                            </p>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                          </p>
                        </div>
                        {!notification.is_read && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => markAsRead(notification.id)}
                            className="h-8 w-8 p-0"
                          >
                            <Check className="h-4 w-4" />
                            <span className="sr-only">Mark as read</span>
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="submissions" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>My Feedback Submissions</CardTitle>
              <CardDescription>
                View and manage your feedback
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : userFeedback.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <MessageCircle className="h-12 w-12 mx-auto opacity-20" />
                  <h3 className="mt-4 text-lg font-medium">No feedback submitted yet</h3>
                  <p className="mt-2">When you submit feedback, it will appear here</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {userFeedback.map((feedback) => (
                    <div 
                      key={feedback.id} 
                      className="p-4 rounded-lg border"
                    >
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(feedback.status)}
                            <h4 className="font-medium">{feedback.category}</h4>
                            {getStatusBadge(feedback.status)}
                          </div>
                          
                          <p className="text-sm">{feedback.description}</p>
                          
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                            <span>ID: {feedback.tracking_id}</span>
                            <span>•</span>
                            <span>{format(new Date(feedback.created_at), 'MMM d, yyyy')}</span>
                            <span>•</span>
                            <span>{feedback.region}</span>
                            {feedback.district && (
                              <>
                                <span>•</span>
                                <span>{feedback.district}</span>
                              </>
                            )}
                          </div>
                        </div>
                        
                        {feedback.status === "pending" && (
                          <Button 
                            variant="destructive" 
                            size="sm" 
                            onClick={() => deleteFeedback(feedback.id)}
                            className="h-8 gap-1"
                          >
                            <Trash className="h-4 w-4" />
                            <span>Delete</span>
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 