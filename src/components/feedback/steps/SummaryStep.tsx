
import { FeedbackFormData } from "@/types/feedback";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

interface SummaryStepProps {
  formData: FeedbackFormData;
  imagePreview: string | null;
}

export function SummaryStep({ formData, imagePreview }: SummaryStepProps) {
  return (
    <div className="space-y-6 animate-fade-up">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-left flex items-center gap-2">
          <Check className="h-5 w-5 text-green-500" />
          Please Review Your Feedback
        </h3>
        <p className="text-sm text-muted-foreground text-left mb-4">
          Confirm that all information is correct before submitting.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 pt-0">
            <div>
              <span className="text-sm font-medium">Full Name:</span>{" "}
              <span className="text-sm">{formData.fullName || "Not provided"}</span>
            </div>
            <div>
              <span className="text-sm font-medium">Phone Number:</span>{" "}
              <span className="text-sm">{formData.phoneNumber || "Not provided"}</span>
            </div>
            <div>
              <span className="text-sm font-medium">Email:</span>{" "}
              <span className="text-sm">{formData.email || "Not provided"}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Location Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 pt-0">
            <div>
              <span className="text-sm font-medium">Region:</span>{" "}
              <span className="text-sm">{formData.region}</span>
            </div>
            <div>
              <span className="text-sm font-medium">District:</span>{" "}
              <span className="text-sm">{formData.district || "Not provided"}</span>
            </div>
            <div>
              <span className="text-sm font-medium">Ward:</span>{" "}
              <span className="text-sm">{formData.ward || "Not provided"}</span>
            </div>
            <div>
              <span className="text-sm font-medium">Street:</span>{" "}
              <span className="text-sm">{formData.street || "Not provided"}</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Feedback Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-0">
          <div>
            <span className="text-sm font-medium">Category:</span>{" "}
            <Badge variant="outline" className="ml-1">{formData.category}</Badge>
          </div>
          <div className="space-y-1">
            <span className="text-sm font-medium">Description:</span>
            <p className="text-sm p-3 bg-muted/50 rounded-md whitespace-pre-wrap">
              {formData.description}
            </p>
          </div>
          
          {imagePreview && (
            <div className="space-y-2">
              <span className="text-sm font-medium">Evidence Image:</span>
              <div className="border rounded-md p-2">
                <img 
                  src={imagePreview} 
                  alt="Evidence" 
                  className="max-h-40 mx-auto object-contain rounded"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      <div className="rounded-lg bg-green-50 dark:bg-green-900/20 p-4 border border-green-100 dark:border-green-800 mt-6">
        <p className="text-sm text-green-800 dark:text-green-300">
          After submission, you'll receive a tracking ID that you can use to follow up on your feedback.
          You'll be able to check the status of your submission at any time.
        </p>
      </div>
    </div>
  );
}
