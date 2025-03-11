
import { useState, useEffect } from "react";
import { Image, Upload, FileX } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { FeedbackFormData } from "@/types/feedback";

interface FeedbackDetailsStepProps {
  formData: FeedbackFormData;
  updateFormData: (data: Partial<FeedbackFormData>) => void;
  imageFile: File | null;
  imagePreview: string | null;
  handleImageChange: (file: File | null, preview: string | null) => void;
}

interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export function FeedbackDetailsStep({ 
  formData, 
  updateFormData, 
  imageFile, 
  imagePreview, 
  handleImageChange 
}: FeedbackDetailsStepProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch categories from Supabase
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from("feedback_categories")
          .select("*");
        
        if (error) throw error;
        
        setCategories(data || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCategories();
  }, []);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (file) {
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        handleImageChange(file, reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const removeImage = () => {
    handleImageChange(null, null);
  };
  
  return (
    <div className="space-y-6 animate-fade-up">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-left">Feedback Details</h3>
        <p className="text-sm text-muted-foreground text-left mb-4">
          Please provide detailed information about your feedback or concern.
        </p>
      </div>
      
      <div className="space-y-4">
        <div className="space-y-2 text-left">
          <Label htmlFor="category">Category <span className="text-red-500">*</span></Label>
          <Select 
            value={formData.category} 
            onValueChange={(value) => updateFormData({ category: value })}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {isLoading ? (
                <SelectItem value="loading" disabled>Loading categories...</SelectItem>
              ) : (
                categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2 text-left">
          <Label htmlFor="description">Description <span className="text-red-500">*</span></Label>
          <Textarea
            id="description"
            name="description"
            placeholder="Please describe your feedback in detail..."
            rows={5}
            value={formData.description}
            onChange={(e) => updateFormData({ description: e.target.value })}
            required
          />
        </div>
        
        <div className="space-y-2 text-left">
          <Label htmlFor="image">Evidence (Image - Optional)</Label>
          <div className="border border-input rounded-md p-4">
            <div className="flex items-center justify-center w-full">
              {imagePreview ? (
                <div className="relative w-full">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="mx-auto max-h-48 rounded-md object-contain"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm"
                    onClick={removeImage}
                  >
                    <FileX className="h-4 w-4 mr-1" /> Remove
                  </Button>
                </div>
              ) : (
                <label
                  htmlFor="image"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-input rounded-md cursor-pointer bg-background hover:bg-secondary/50 transition-colors"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6 animate-pulse">
                    <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                    <p className="mb-1 text-sm text-muted-foreground">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PNG, JPG or JPEG (MAX. 5MB)
                    </p>
                  </div>
                  <Input
                    id="image"
                    type="file"
                    accept="image/png, image/jpeg, image/jpg"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="rounded-lg bg-amber-50 dark:bg-amber-900/20 p-4 border border-amber-100 dark:border-amber-800 mt-6">
        <p className="text-sm text-amber-800 dark:text-amber-300">
          Adding images helps authorities better understand the issue you're reporting.
          Photos of the actual problem or situation can significantly improve response times.
        </p>
      </div>
    </div>
  );
}
