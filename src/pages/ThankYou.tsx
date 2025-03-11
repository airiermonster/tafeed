
import { useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { CheckCircle, ArrowLeft, Clipboard } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const ThankYou = () => {
  const [searchParams] = useSearchParams();
  const trackingId = searchParams.get("id") || "N/A";

  useEffect(() => {
    // Scroll to top on page load
    window.scrollTo(0, 0);
  }, []);

  const copyTrackingId = () => {
    navigator.clipboard.writeText(trackingId);
    toast.success("Tracking ID copied to clipboard");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-24 pb-16 px-4 flex items-center justify-center">
        <div className="max-w-lg mx-auto glass rounded-xl p-8 text-center animate-scale-in">
          <div className="flex justify-center mb-6">
            <CheckCircle className="h-20 w-20 text-green-500" />
          </div>
          
          <h1 className="text-3xl font-bold mb-4">Thank You for Your Feedback!</h1>
          
          <p className="text-lg text-muted-foreground mb-6">
            Your feedback has been submitted successfully. We appreciate your contribution to making Tanzania better.
          </p>
          
          <div className="bg-secondary/50 rounded-lg p-4 mb-8">
            <p className="text-sm font-medium mb-2">Your Tracking ID:</p>
            <div className="flex items-center justify-center">
              <p className="text-xl font-mono font-bold">{trackingId}</p>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={copyTrackingId}
                className="ml-2"
                aria-label="Copy tracking ID"
              >
                <Clipboard className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Please keep this ID for future reference. You can use it to track the status of your feedback.
            </p>
          </div>
          
          <div className="flex justify-center space-x-4">
            <Button asChild variant="outline">
              <Link to="/" className="flex items-center">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Return Home
              </Link>
            </Button>
            <Button asChild>
              <Link to="/submit-feedback">
                Submit Another Feedback
              </Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ThankYou;
