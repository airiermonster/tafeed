
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { PersonalInfoStep } from "@/components/feedback/steps/PersonalInfoStep";
import { LocationInfoStep } from "@/components/feedback/steps/LocationInfoStep";
import { FeedbackDetailsStep } from "@/components/feedback/steps/FeedbackDetailsStep";
import { SummaryStep } from "@/components/feedback/steps/SummaryStep";
import { FeedbackFormData } from "@/types/feedback";
import { ArrowLeft, ArrowRight, Send, Loader2 } from "lucide-react";

// Generate a random tracking ID
const generateTrackingId = () => {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
};

export function StepperFeedbackForm() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<FeedbackFormData>({
    fullName: "",
    phoneNumber: "",
    email: user?.email || "",
    region: "",
    district: "",
    ward: "",
    street: "",
    category: "",
    description: "",
  });
  
  // Progress calculation
  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;
  
  // Steps title mapping
  const stepsTitle = [
    "Personal Information",
    "Location Information",
    "Feedback Details",
    "Review & Submit"
  ];

  // Update form data
  const updateFormData = (data: Partial<FeedbackFormData>) => {
    setFormData(prev => ({
      ...prev,
      ...data
    }));
  };
  
  // Handle image change
  const handleImageChange = (file: File | null, preview: string | null) => {
    setImageFile(file);
    setImagePreview(preview);
  };
  
  // Handle form submission
  const handleSubmit = async () => {
    if (!user) {
      toast.error("You must be logged in to submit feedback");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Generate tracking ID
      const trackingId = generateTrackingId();
      
      // Insert feedback into database
      const { data: feedbackData, error: feedbackError } = await supabase
        .from("feedback")
        .insert({
          user_id: user.id,
          full_name: formData.fullName,
          phone_number: formData.phoneNumber,
          email: formData.email,
          region: formData.region,
          district: formData.district,
          ward: formData.ward,
          street: formData.street,
          category: formData.category,
          description: formData.description,
          tracking_id: trackingId,
        })
        .select()
        .single();
      
      if (feedbackError) throw feedbackError;
      
      // Upload image if exists
      if (imageFile && feedbackData) {
        const filePath = `${user.id}/${feedbackData.id}/${imageFile.name}`;
        
        const { error: uploadError } = await supabase.storage
          .from("feedback_evidence")
          .upload(filePath, imageFile);
        
        if (uploadError) throw uploadError;
        
        // Link image to feedback
        const { error: evidenceError } = await supabase
          .from("feedback_evidence")
          .insert({
            feedback_id: feedbackData.id,
            file_path: filePath,
          });
        
        if (evidenceError) throw evidenceError;
      }
      
      // Show success message
      toast.success("Feedback submitted successfully!", {
        description: `Your tracking ID is ${trackingId}`
      });
      
      // Redirect to thank you page
      navigate(`/thank-you?id=${trackingId}`);
    } catch (error: any) {
      console.error("Error submitting feedback:", error);
      toast.error("Failed to submit feedback", {
        description: error.message || "Please try again later."
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle next step
  const goToNextStep = () => {
    // Validation for each step
    if (currentStep === 1) {
      // Personal info validation not strictly required
      setCurrentStep(prev => prev + 1);
    } else if (currentStep === 2) {
      // Location validation
      if (!formData.region) {
        toast.error("Region is required");
        return;
      }
      setCurrentStep(prev => prev + 1);
    } else if (currentStep === 3) {
      // Feedback details validation
      if (!formData.category || !formData.description) {
        toast.error("Category and description are required");
        return;
      }
      setCurrentStep(prev => prev + 1);
    }
  };
  
  // Handle previous step
  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };
  
  // Render current step
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <PersonalInfoStep formData={formData} updateFormData={updateFormData} />;
      case 2:
        return <LocationInfoStep formData={formData} updateFormData={updateFormData} />;
      case 3:
        return (
          <FeedbackDetailsStep 
            formData={formData} 
            updateFormData={updateFormData} 
            imageFile={imageFile}
            imagePreview={imagePreview}
            handleImageChange={handleImageChange}
          />
        );
      case 4:
        return (
          <SummaryStep 
            formData={formData} 
            imagePreview={imagePreview} 
          />
        );
      default:
        return <PersonalInfoStep formData={formData} updateFormData={updateFormData} />;
    }
  };
  
  return (
    <div className="max-w-3xl mx-auto glass rounded-xl p-6 md:p-8 animate-scale-in">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Submit Your Feedback</h2>
        <p className="text-muted-foreground mb-4">
          Step {currentStep} of {totalSteps}: {stepsTitle[currentStep - 1]}
        </p>
        <Progress value={progress} className="h-2" />
      </div>
      
      <div className="transition-all duration-300 animate-fade-up">
        {renderStep()}
      </div>
      
      <div className="flex justify-between mt-8 pt-4 border-t">
        {currentStep > 1 ? (
          <Button
            onClick={goToPreviousStep}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" /> Previous
          </Button>
        ) : (
          <div></div>
        )}
        
        {currentStep < totalSteps ? (
          <Button onClick={goToNextStep} className="flex items-center gap-2">
            Next <ArrowRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting}
            className="flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Submitting...
              </>
            ) : (
              <>
                Submit Feedback <Send className="h-4 w-4" />
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
