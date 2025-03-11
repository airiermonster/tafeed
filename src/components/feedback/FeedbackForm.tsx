import { useState, ChangeEvent, FormEvent } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Image, Upload, Check, AlertCircle } from "lucide-react";
import { toast } from "sonner";
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Check as CheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { categories } from "@/components/home/CategoryCard";
import { LocationSelector } from "@/components/LocationSelector";
import { supabase } from "@/integrations/supabase/client";

export function FeedbackForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedCategory = searchParams.get("category");
  
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    region: "",
    district: "",
    ward: "",
    street: "",
    category: preselectedCategory || "",
    description: "",
    anonymous: false
  });
  
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [filteredCategories, setFilteredCategories] = useState(categories);
  
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };
  
  const handleCategoryChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      category: value
    }));
  };
  
  const handleRegionChange = (region: string | null) => {
    setFormData(prev => ({
      ...prev,
      region: region || ""
    }));
  };
  
  const handleDistrictChange = (district: string | null) => {
    setFormData(prev => ({
      ...prev,
      district: district || ""
    }));
  };
  
  const handleWardChange = (ward: string | null) => {
    setFormData(prev => ({
      ...prev,
      ward: ward || ""
    }));
  };
  
  const handleVillageChange = (village: string | null) => {
    setFormData(prev => ({
      ...prev,
      street: village || ""
    }));
  };
  
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Validate the form
    if (!formData.region || !formData.category || !formData.description) {
      toast.error("Please fill in all required fields", {
        description: "Region, Category, and Description are required."
      });
      return;
    }
    
    // Start submission
    setIsSubmitting(true);
    
    try {
      // Generate a tracking ID
      const trackingId = Math.random().toString(36).substring(2, 10).toUpperCase();
      
      // Upload the feedback to the database
      const { error } = await supabase
        .from('feedback')
        .insert({
          tracking_id: trackingId,
          full_name: formData.anonymous ? null : formData.fullName,
          phone_number: formData.anonymous ? null : formData.phoneNumber,
          email: formData.anonymous ? null : formData.email,
          region: formData.region,
          district: formData.district,
          ward: formData.ward,
          street: formData.street,
          category: formData.category,
          description: formData.description,
          status: "pending"
        });
      
      if (error) throw error;
      
      // If there's an image, upload it
      if (imageFile) {
        const fileName = `${trackingId}_${Date.now()}.${imageFile.name.split('.').pop()}`;
        
        const { error: uploadError } = await supabase
          .storage
          .from('feedback-evidence')
          .upload(fileName, imageFile);
          
        if (uploadError) {
          console.error("Error uploading image:", uploadError);
          // Continue anyway since the feedback is already submitted
        } else {
          // Link the image to the feedback
          await supabase
            .from('feedback_evidence')
            .insert({
              feedback_id: trackingId,
              file_path: fileName
            });
        }
      }
      
      // Show success message
      toast.success("Feedback submitted successfully!", {
        description: `Your tracking ID is ${trackingId}`
      });
      
      // Redirect to thank you page
      navigate(`/thank-you?id=${trackingId}`);
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error("Failed to submit feedback", {
        description: "Please try again later."
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Filter categories based on search
  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    if (value) {
      const filtered = categories.filter(category => 
        category.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredCategories(filtered);
    } else {
      setFilteredCategories(categories);
    }
  };
  
  return (
    <div className="max-w-2xl mx-auto glass rounded-xl p-6 md:p-8 animate-scale-in shadow-md">
      <h2 className="text-2xl font-bold mb-6">Submit Your Feedback</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-left">Personal Information</h3>
          <p className="text-sm text-muted-foreground text-left mb-4">
            <AlertCircle className="inline-block mr-1 h-4 w-4" /> 
            Name and phone number are optional, but useful for follow-ups.
          </p>
          
          <div className="flex items-center space-x-2 text-left">
            <input
              type="checkbox"
              id="anonymous"
              name="anonymous"
              checked={formData.anonymous}
              onChange={handleCheckboxChange}
              className="rounded border-gray-300 text-primary focus:ring-primary"
            />
            <Label htmlFor="anonymous">Submit anonymously</Label>
          </div>
          
          {!formData.anonymous && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 text-left">
                  <Label htmlFor="fullName">Full Name (Optional)</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    placeholder="Your full name"
                    value={formData.fullName}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2 text-left">
                  <Label htmlFor="phoneNumber">Phone Number (Optional)</Label>
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    placeholder="+255 XXX XXX XXX"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="space-y-2 text-left">
                <Label htmlFor="email">Email (Optional)</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
            </>
          )}
        </div>
        
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-left">Location Information</h3>
          <p className="text-sm text-muted-foreground text-left mb-4">
            <Check className="inline-block mr-1 h-4 w-4" /> 
            Region is required to properly direct your feedback.
          </p>
          
          <LocationSelector
            onRegionChange={handleRegionChange}
            onDistrictChange={handleDistrictChange}
            onWardChange={handleWardChange}
            onVillageChange={handleVillageChange}
            required={true}
          />
        </div>
        
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-left">Feedback Details</h3>
          
          <div className="space-y-2 text-left">
            <Label htmlFor="category">Category <span className="text-red-500">*</span></Label>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-full justify-between"
                >
                  {formData.category
                    ? categories.find((category) => category.id === formData.category)?.name
                    : "Select a category..."}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput 
                    placeholder="Search category..." 
                    value={searchValue}
                    onValueChange={handleSearchChange}
                  />
                  <CommandEmpty>No category found.</CommandEmpty>
                  <CommandGroup className="max-h-64 overflow-auto">
                    {filteredCategories.map((category) => (
                      <CommandItem
                        key={category.id}
                        value={category.id}
                        onSelect={(currentValue) => {
                          handleCategoryChange(currentValue);
                          setOpen(false);
                        }}
                      >
                        <CheckIcon
                          className={cn(
                            "mr-2 h-4 w-4",
                            formData.category === category.id ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {category.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="space-y-2 text-left">
            <Label htmlFor="description">Description <span className="text-red-500">*</span></Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Please describe your feedback in detail..."
              rows={5}
              value={formData.description}
              onChange={handleInputChange}
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
                      className="mx-auto max-h-64 rounded-md object-contain"
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => {
                        setImagePreview(null);
                        setImageFile(null);
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <label
                    htmlFor="image-upload"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-md cursor-pointer hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Click to upload an image
                      </p>
                    </div>
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </label>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <Button 
          type="submit" 
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
              Submitting...
            </>
          ) : (
            "Submit Feedback"
          )}
        </Button>
      </form>
    </div>
  );
}
