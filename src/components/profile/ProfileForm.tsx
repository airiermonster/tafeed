
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CalendarIcon, User, MapPin, Phone, Upload } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export function ProfileForm() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState({
    fullName: "",
    phoneNumber: "",
    region: "",
    dateOfBirth: undefined as Date | undefined,
    avatarUrl: "",
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  // Fetch profile data
  useEffect(() => {
    if (!user) return;

    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error) throw error;

        if (data) {
          setProfile({
            fullName: data.full_name || "",
            phoneNumber: data.phone_number || "",
            region: data.region || "",
            dateOfBirth: data.date_of_birth ? new Date(data.date_of_birth) : undefined,
            avatarUrl: data.avatar_url || "",
          });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to load profile data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }
    const file = e.target.files[0];
    setAvatarFile(file);
    
    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target && typeof e.target.result === "string") {
        setAvatarPreview(e.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Upload avatar if changed
      let avatarUrl = profile.avatarUrl;
      if (avatarFile) {
        const fileExt = avatarFile.name.split('.').pop();
        const filePath = `${user!.id}/avatar.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, avatarFile, { upsert: true });
          
        if (uploadError) throw uploadError;
        
        const { data } = supabase.storage
          .from('avatars')
          .getPublicUrl(filePath);
          
        avatarUrl = data.publicUrl;
      }

      // Update profile data
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          full_name: profile.fullName,
          phone_number: profile.phoneNumber,
          region: profile.region,
          date_of_birth: profile.dateOfBirth ? profile.dateOfBirth.toISOString() : null,
          avatar_url: avatarUrl,
        })
        .eq("id", user!.id);

      if (updateError) throw updateError;

      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-col items-center space-y-4 sm:items-start sm:flex-row sm:space-y-0 sm:space-x-6">
        <div className="relative">
          <Avatar className="w-24 h-24 border-2 border-border">
            <AvatarImage src={avatarPreview || profile.avatarUrl} />
            <AvatarFallback className="text-xl">
              {profile.fullName ? profile.fullName[0].toUpperCase() : user?.email?.[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <Label 
            htmlFor="avatar" 
            className="absolute bottom-0 right-0 p-1 bg-primary text-primary-foreground rounded-full cursor-pointer"
          >
            <Upload size={16} />
            <span className="sr-only">Upload avatar</span>
          </Label>
          <Input 
            id="avatar" 
            type="file" 
            accept="image/*" 
            onChange={handleAvatarChange} 
            className="hidden" 
          />
        </div>
        
        <div className="w-full space-y-2 text-center sm:text-left">
          <h2 className="text-xl font-semibold">{profile.fullName || "User"}</h2>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name</Label>
          <div className="relative">
            <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
            <Input
              id="fullName"
              name="fullName"
              placeholder="Your full name"
              value={profile.fullName}
              onChange={handleChange}
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="phoneNumber">Phone Number</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
            <Input
              id="phoneNumber"
              name="phoneNumber"
              placeholder="+255 XXX XXX XXX"
              value={profile.phoneNumber}
              onChange={handleChange}
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="region">Region</Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
            <Input
              id="region"
              name="region"
              placeholder="Your region"
              value={profile.region}
              onChange={handleChange}
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="dateOfBirth">Date of Birth</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                id="dateOfBirth"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !profile.dateOfBirth && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {profile.dateOfBirth ? format(profile.dateOfBirth, "PPP") : "Select date of birth"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={profile.dateOfBirth}
                onSelect={(date) => setProfile({ ...profile, dateOfBirth: date || undefined })}
                disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                captionLayout="dropdown-buttons"
                fromYear={1900}
                toYear={new Date().getFullYear()}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
}
