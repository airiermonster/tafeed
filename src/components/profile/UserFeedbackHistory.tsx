
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { FeedbackSubmission } from "@/types/feedback";
import { CalendarIcon, Clock, FileText, MapPin } from "lucide-react";
import { toast } from "sonner";

export function UserFeedbackHistory() {
  const { user } = useAuth();
  const [feedbacks, setFeedbacks] = useState<FeedbackSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchUserFeedbacks = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("feedback")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setFeedbacks(data as unknown as FeedbackSubmission[]);
      } catch (error) {
        console.error("Error fetching feedback history:", error);
        toast.error("Failed to load feedback history");
      } finally {
        setLoading(false);
      }
    };

    fetchUserFeedbacks();
  }, [user]);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10">
        <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
        <p className="ml-2">Loading your feedback history...</p>
      </div>
    );
  }

  if (feedbacks.length === 0) {
    return (
      <div className="text-center py-10">
        <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">No feedback submissions yet</h3>
        <p className="text-muted-foreground">
          When you submit feedback, you'll be able to track its status here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium mb-4">Your Submitted Feedback</h3>
      
      {feedbacks.map((feedback) => (
        <Card key={feedback.id} className="overflow-hidden">
          <div className={`h-2 ${
            feedback.status === "resolved" ? "bg-green-500" :
            feedback.status === "reviewing" ? "bg-blue-500" :
            feedback.status === "rejected" ? "bg-red-500" :
            "bg-yellow-500"
          }`} />
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="font-semibold text-lg">{feedback.category}</h4>
                <div className="flex items-center text-sm text-muted-foreground mt-1">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>
                    {new Date(feedback.created_at).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                  <span className="mx-2">•</span>
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{feedback.region}</span>
                </div>
              </div>
              {getStatusBadge(feedback.status || "pending")}
            </div>
            
            <p className="mb-4">{feedback.description}</p>
            
            <div className="bg-muted/50 p-3 rounded-md text-sm">
              <div className="flex items-center">
                <CalendarIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="font-medium">Tracking ID:</span>
                <span className="ml-2">{feedback.tracking_id}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
