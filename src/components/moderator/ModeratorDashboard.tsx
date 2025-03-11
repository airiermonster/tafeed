import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FeedbackSubmission } from "@/types/feedback";
import { Search } from "lucide-react";
import { ModeratorCharts } from "./ModeratorCharts";
import { FeedbackManagement } from "./FeedbackManagement";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Shield, User } from "lucide-react";

interface ModeratorProfile {
  full_name: string;
  region: string | null;
  district: string | null;
  ward: string | null;
  village: string | null;
  moderation_level: number;
  profileImage?: string;
}

export function ModeratorDashboard() {
  const { profile, user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [moderatorRegion, setModeratorRegion] = useState<string | null>(null);
  const [moderatorProfile, setModeratorProfile] = useState<ModeratorProfile | null>(null);

  useEffect(() => {
    if (profile) {
      fetchModeratorDetails();
    }
  }, [profile]);

  const fetchModeratorDetails = async () => {
    if (!profile || !profile.id) return;
    
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", profile.id)
        .single();
        
      if (error) throw error;
      
      if (data) {
        setModeratorProfile({
          full_name: data.full_name || "Unknown",
          region: data.region || null,
          district: data.district || null,
          ward: data.ward || null,
          village: data.village || null,
          moderation_level: data.moderation_level || 1,
        });
        
        setModeratorRegion(data.region);
      }
    } catch (error) {
      console.error("Error fetching moderator details:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const getLevelDescription = (level: number) => {
    switch(level) {
      case 1: return "Region Level Moderator";
      case 2: return "District Level Moderator";
      case 3: return "Ward Level Moderator";
      case 4: return "Village Level Moderator";
      default: return "Unassigned Moderator";
    }
  };
  
  const getModeratorScope = () => {
    if (!moderatorProfile) return "Unassigned";
    
    if (moderatorProfile.village) return `${moderatorProfile.village} Village`;
    if (moderatorProfile.ward) return `${moderatorProfile.ward} Ward`;
    if (moderatorProfile.district) return `${moderatorProfile.district} District`;
    if (moderatorProfile.region) return `${moderatorProfile.region} Region`;
    return "All Regions";
  };

  if (loading) {
    return (
      <div className="container py-10">
        <Card>
          <CardHeader>
            <CardTitle>Loading dashboard...</CardTitle>
            <CardDescription>Please wait while we retrieve your data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-40 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Moderator Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          {moderatorRegion ? 
            `Manage and respond to feedback submissions in ${moderatorRegion}` : 
            "Manage and respond to feedback submissions"}
        </p>
      </div>
      
      {/* Moderator Profile Card */}
      <Card className="bg-muted/30">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            <Avatar className="h-16 w-16 border-2 border-primary/20">
              <AvatarFallback className="bg-primary/10 text-lg">
                {moderatorProfile?.full_name?.charAt(0) || <User className="h-6 w-6" />}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 space-y-2">
              <div>
                <h2 className="text-xl font-semibold">{moderatorProfile?.full_name}</h2>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <Badge variant="outline" className="bg-primary/10 text-primary flex items-center gap-1">
                    <Shield className="h-3 w-3" />
                    <span>{getLevelDescription(moderatorProfile?.moderation_level || 1)}</span>
                  </Badge>
                </div>
              </div>
              
              <div className="flex flex-col text-sm space-y-1 text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>Assigned Area: {getModeratorScope()}</span>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1">
                  {moderatorProfile?.region && <span>Region: {moderatorProfile.region}</span>}
                  {moderatorProfile?.district && <span>District: {moderatorProfile.district}</span>}
                  {moderatorProfile?.ward && <span>Ward: {moderatorProfile.ward}</span>}
                  {moderatorProfile?.village && <span>Village: {moderatorProfile.village}</span>}
                </div>
              </div>
            </div>
            
            <div className="flex-shrink-0 md:self-end">
              <p className="text-xs text-muted-foreground mt-2">
                Email: {user?.email || "No email available"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="feedback">Feedback Management</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <ModeratorCharts moderatorRegion={moderatorRegion || undefined} />
        </TabsContent>
        
        <TabsContent value="feedback">
          <FeedbackManagement moderatorRegion={moderatorRegion || undefined} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
