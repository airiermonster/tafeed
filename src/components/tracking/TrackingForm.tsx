
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { FeedbackSubmission } from "@/types/feedback";
import { PackageSearch } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

export function TrackingForm() {
  const [trackingId, setTrackingId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackSubmission | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!trackingId.trim()) {
      toast.error("Please enter a tracking ID");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase
        .from("feedback")
        .select("*")
        .eq("tracking_id", trackingId.trim())
        .single();
        
      if (error) {
        if (error.code === "PGRST116") {
          toast.error("No feedback found with this tracking ID");
        } else {
          throw error;
        }
        return;
      }
      
      setFeedback(data as unknown as FeedbackSubmission);
      setDialogOpen(true);
    } catch (error) {
      console.error("Error fetching feedback:", error);
      toast.error("Failed to retrieve feedback information");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "pending":
        return {
          badge: <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500">Pending</Badge>,
          description: "Your feedback has been received and is awaiting review by our team."
        };
      case "reviewing":
        return {
          badge: <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-500">Reviewing</Badge>,
          description: "Our team is currently reviewing your feedback and working on it."
        };
      case "resolved":
        return {
          badge: <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500">Resolved</Badge>,
          description: "Your feedback has been addressed and resolved by our team."
        };
      case "rejected":
        return {
          badge: <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500">Rejected</Badge>,
          description: "Your feedback could not be processed or was outside our scope of service."
        };
      default:
        return {
          badge: <Badge variant="outline">{status}</Badge>,
          description: "Status information not available."
        };
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="flex space-x-2 w-full max-w-sm">
        <div className="relative flex-grow">
          <PackageSearch className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Enter your tracking ID"
            value={trackingId}
            onChange={(e) => setTrackingId(e.target.value)}
            className="pl-10"
            disabled={isLoading}
          />
        </div>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Checking..." : "Track"}
        </Button>
      </form>
      
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Feedback Status</DialogTitle>
            <DialogDescription>
              Tracking ID: {feedback?.tracking_id}
            </DialogDescription>
          </DialogHeader>
          
          {feedback && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Status</h3>
                {getStatusInfo(feedback.status).badge}
              </div>
              
              <p className="text-sm text-muted-foreground">
                {getStatusInfo(feedback.status).description}
              </p>
              
              <div className="border-t pt-4">
                <h3 className="font-medium mb-2">Feedback Details</h3>
                <dl className="grid grid-cols-2 gap-2 text-sm">
                  <dt className="text-muted-foreground">Category:</dt>
                  <dd>{feedback.category}</dd>
                  
                  <dt className="text-muted-foreground">Date Submitted:</dt>
                  <dd>{new Date(feedback.created_at).toLocaleDateString()}</dd>
                  
                  <dt className="text-muted-foreground">Region:</dt>
                  <dd>{feedback.region}</dd>
                  
                  <dt className="text-muted-foreground">District:</dt>
                  <dd>{feedback.district || "N/A"}</dd>
                </dl>
              </div>
              
              <div className="border-t pt-4">
                <h3 className="font-medium mb-2">Description</h3>
                <p className="text-sm">{feedback.description}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
