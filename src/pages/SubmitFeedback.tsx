
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { StepperFeedbackForm } from "@/components/feedback/StepperFeedbackForm";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const SubmitFeedback = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  
  // Check if user is logged in
  useEffect(() => {
    if (!isLoading && !user) {
      toast.error("Login required", {
        description: "You must be logged in to submit feedback."
      });
      navigate("/auth");
    }
  }, [user, isLoading, navigate]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!user) return null;
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Tanzania flag colors as decorative elements */}
      <div className="fixed top-0 left-0 w-2 h-screen bg-green-600 z-40"></div>
      <div className="fixed top-0 right-0 w-2 h-screen bg-green-600 z-40"></div>
      <div className="fixed bottom-0 left-0 w-screen h-2 bg-green-600 z-40"></div>
      <div className="fixed top-0 left-0 w-screen h-2 bg-green-600 z-40"></div>
      
      <Header />
      <main className="flex-grow pt-16 pb-20 px-4">
        <div className="container mx-auto py-12">
          <StepperFeedbackForm />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SubmitFeedback;
