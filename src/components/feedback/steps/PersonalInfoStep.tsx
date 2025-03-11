
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FeedbackFormData } from "@/types/feedback";
import { User, Phone, Mail, AlertCircle } from "lucide-react";

interface PersonalInfoStepProps {
  formData: FeedbackFormData;
  updateFormData: (data: Partial<FeedbackFormData>) => void;
}

export function PersonalInfoStep({ formData, updateFormData }: PersonalInfoStepProps) {
  return (
    <div className="space-y-6 animate-fade-up">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-left">Personal Information</h3>
        <p className="text-sm text-muted-foreground text-left mb-4 flex items-center gap-2">
          <AlertCircle className="h-4 w-4" /> 
          <span>
            Name and phone number are optional, but useful for follow-ups. 
            Your information is kept private.
          </span>
        </p>
      </div>
      
      <div className="space-y-4">
        <div className="space-y-2 text-left">
          <Label htmlFor="fullName">Full Name (Optional)</Label>
          <div className="relative">
            <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
            <Input
              id="fullName"
              name="fullName"
              placeholder="Your full name"
              value={formData.fullName}
              onChange={(e) => updateFormData({ fullName: e.target.value })}
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="space-y-2 text-left">
          <Label htmlFor="phoneNumber">Phone Number (Optional)</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
            <Input
              id="phoneNumber"
              name="phoneNumber"
              placeholder="+255 XXX XXX XXX"
              value={formData.phoneNumber}
              onChange={(e) => updateFormData({ phoneNumber: e.target.value })}
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="space-y-2 text-left">
          <Label htmlFor="email">Email (Optional)</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="your.email@example.com"
              value={formData.email}
              onChange={(e) => updateFormData({ email: e.target.value })}
              className="pl-10"
            />
          </div>
        </div>
      </div>
      
      <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 p-4 border border-blue-100 dark:border-blue-800 mt-6">
        <p className="text-sm text-blue-800 dark:text-blue-300">
          This information helps us follow up with you if needed. 
          You can update your contact details at any time.
        </p>
      </div>
    </div>
  );
}
