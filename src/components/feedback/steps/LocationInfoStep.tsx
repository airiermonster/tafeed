
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FeedbackFormData } from "@/types/feedback";
import { Check, MapPin, Building, Landmark, Home } from "lucide-react";

interface LocationInfoStepProps {
  formData: FeedbackFormData;
  updateFormData: (data: Partial<FeedbackFormData>) => void;
}

export function LocationInfoStep({ formData, updateFormData }: LocationInfoStepProps) {
  return (
    <div className="space-y-6 animate-fade-up">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-left">Location Information</h3>
        <p className="text-sm text-muted-foreground text-left mb-4 flex items-center gap-2">
          <Check className="h-4 w-4" /> 
          <span>
            Region is required to properly direct your feedback.
            Additional location details help with context.
          </span>
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2 text-left">
          <Label htmlFor="region">Region <span className="text-red-500">*</span></Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
            <Input
              id="region"
              name="region"
              placeholder="Your region"
              value={formData.region}
              onChange={(e) => updateFormData({ region: e.target.value })}
              className="pl-10"
              required
            />
          </div>
        </div>
        
        <div className="space-y-2 text-left">
          <Label htmlFor="district">District</Label>
          <div className="relative">
            <Building className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
            <Input
              id="district"
              name="district"
              placeholder="Your district"
              value={formData.district}
              onChange={(e) => updateFormData({ district: e.target.value })}
              className="pl-10"
            />
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2 text-left">
          <Label htmlFor="ward">Ward</Label>
          <div className="relative">
            <Landmark className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
            <Input
              id="ward"
              name="ward"
              placeholder="Your ward"
              value={formData.ward}
              onChange={(e) => updateFormData({ ward: e.target.value })}
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="space-y-2 text-left">
          <Label htmlFor="street">Street</Label>
          <div className="relative">
            <Home className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
            <Input
              id="street"
              name="street"
              placeholder="Your street"
              value={formData.street}
              onChange={(e) => updateFormData({ street: e.target.value })}
              className="pl-10"
            />
          </div>
        </div>
      </div>
      
      <div className="rounded-lg bg-green-50 dark:bg-green-900/20 p-4 border border-green-100 dark:border-green-800 mt-6">
        <p className="text-sm text-green-800 dark:text-green-300">
          Accurate location information helps ensure your feedback reaches the right authorities.
          This makes it more likely that your concerns will be addressed effectively.
        </p>
      </div>
    </div>
  );
}
