import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Search, User, MapPin, Save, RefreshCw } from "lucide-react";
import { tanzaniaRegions } from "@/data/locations";

interface Moderator {
  id: string;
  email: string;
  full_name: string;
  region: string | null;
  district: string | null;
  ward: string | null;
  village: string | null;
  moderation_level: number;
}

export function ModeratorAssignment() {
  const [loading, setLoading] = useState(true);
  const [moderators, setModerators] = useState<Moderator[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedModerator, setSelectedModerator] = useState<Moderator | null>(null);
  
  // Location state
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [selectedWard, setSelectedWard] = useState<string | null>(null);
  const [selectedVillage, setSelectedVillage] = useState<string | null>(null);
  const [moderationLevel, setModerationLevel] = useState<number>(1);
  
  // Options for dropdown selections
  const [districts, setDistricts] = useState<string[]>([]);
  const [wards, setWards] = useState<string[]>([]);
  const [villages, setVillages] = useState<string[]>([]);
  
  useEffect(() => {
    fetchModerators();
  }, []);
  
  // Update available districts when region changes
  useEffect(() => {
    if (selectedRegion) {
      const regionData = tanzaniaRegions.find(r => r.name === selectedRegion);
      if (regionData) {
        setDistricts(regionData.districts.map(d => d.name));
        setSelectedDistrict(null);
        setSelectedWard(null);
        setSelectedVillage(null);
      } else {
        setDistricts([]);
      }
    } else {
      setDistricts([]);
    }
  }, [selectedRegion]);
  
  // Update available wards when district changes
  useEffect(() => {
    if (selectedRegion && selectedDistrict) {
      const regionData = tanzaniaRegions.find(r => r.name === selectedRegion);
      if (regionData) {
        const districtData = regionData.districts.find(d => d.name === selectedDistrict);
        if (districtData) {
          setWards(districtData.wards.map(w => w.name));
          setSelectedWard(null);
          setSelectedVillage(null);
        } else {
          setWards([]);
        }
      }
    } else {
      setWards([]);
    }
  }, [selectedRegion, selectedDistrict]);
  
  // Update available villages when ward changes
  useEffect(() => {
    if (selectedRegion && selectedDistrict && selectedWard) {
      const regionData = tanzaniaRegions.find(r => r.name === selectedRegion);
      if (regionData) {
        const districtData = regionData.districts.find(d => d.name === selectedDistrict);
        if (districtData) {
          const wardData = districtData.wards.find(w => w.name === selectedWard);
          if (wardData && wardData.villages) {
            setVillages(wardData.villages);
            setSelectedVillage(null);
          } else {
            setVillages([]);
          }
        }
      }
    } else {
      setVillages([]);
    }
  }, [selectedRegion, selectedDistrict, selectedWard]);
  
  // Update form when selecting a moderator
  useEffect(() => {
    if (selectedModerator) {
      setSelectedRegion(selectedModerator.region);
      setSelectedDistrict(selectedModerator.district);
      setSelectedWard(selectedModerator.ward);
      setSelectedVillage(selectedModerator.village);
      setModerationLevel(selectedModerator.moderation_level || 1);
    }
  }, [selectedModerator]);

  const fetchModerators = async () => {
    setLoading(true);
    try {
      // Get users with moderator role
      const { data: roleData, error: roleError } = await supabase
        .from("user_roles")
        .select("user_id")
        .eq("role", "moderator");
        
      if (roleError) throw roleError;
      
      if (roleData && roleData.length > 0) {
        const userIds = roleData.map(r => r.user_id);
        
        // Get user data from auth.users
        const { data: userData, error: userError } = await supabase.auth.admin.listUsers();
        
        if (userError) throw userError;
        
        // Get profile data
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .in("id", userIds);
          
        if (profileError) throw profileError;
        
        // Combine data
        if (userData && profileData) {
          const moderatorList = userIds.map(id => {
            const user = userData.users.find(u => u.id === id);
            const profile = profileData.find(p => p.id === id);
            
            return {
              id,
              email: user?.email || "",
              full_name: profile?.full_name || "Unknown",
              region: profile?.region || null,
              district: profile?.district || null,
              ward: profile?.ward || null,
              village: profile?.village || null,
              moderation_level: profile?.moderation_level || 1
            };
          });
          
          setModerators(moderatorList);
        }
      } else {
        setModerators([]);
      }
    } catch (error) {
      console.error("Error fetching moderators:", error);
      toast.error("Failed to load moderators");
    } finally {
      setLoading(false);
    }
  };
  
  const handleSaveAssignment = async () => {
    if (!selectedModerator) {
      toast.error("Please select a moderator");
      return;
    }
    
    try {
      // Determine the appropriate level based on the most specific location assigned
      let calculatedLevel = 0;
      if (selectedRegion) calculatedLevel = 1;
      if (selectedDistrict) calculatedLevel = 2;
      if (selectedWard) calculatedLevel = 3;
      if (selectedVillage) calculatedLevel = 4;
      
      // If manual override is set and it's less than calculated, use the override
      const finalLevel = moderationLevel < calculatedLevel ? moderationLevel : calculatedLevel;
      
      const { error } = await supabase
        .from("profiles")
        .update({
          region: selectedRegion,
          district: selectedDistrict,
          ward: selectedWard,
          village: selectedVillage,
          moderation_level: finalLevel
        })
        .eq("id", selectedModerator.id);
        
      if (error) throw error;
      
      // Update local state
      setModerators(prevModerators => 
        prevModerators.map(mod => 
          mod.id === selectedModerator.id 
            ? { 
                ...mod, 
                region: selectedRegion, 
                district: selectedDistrict, 
                ward: selectedWard, 
                village: selectedVillage,
                moderation_level: finalLevel
              } 
            : mod
        )
      );
      
      toast.success("Moderator assignment updated successfully");
    } catch (error) {
      console.error("Error updating moderator assignment:", error);
      toast.error("Failed to update moderator assignment");
    }
  };
  
  const filteredModerators = moderators.filter(mod => 
    mod.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mod.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (mod.region && mod.region.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  const getLevelDescription = (level: number) => {
    switch(level) {
      case 1: return "Region Moderator";
      case 2: return "District Moderator";
      case 3: return "Ward Moderator";
      case 4: return "Village Moderator";
      default: return "Unassigned";
    }
  };
  
  const getModerationScope = (moderator: Moderator) => {
    if (moderator.village) return `${moderator.village} Village`;
    if (moderator.ward) return `${moderator.ward} Ward`;
    if (moderator.district) return `${moderator.district} District`;
    if (moderator.region) return `${moderator.region} Region`;
    return "Unassigned";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Moderator Assignment</h2>
          <p className="text-muted-foreground">Assign moderators to specific regions, districts, wards, or villages</p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchModerators} className="gap-1">
          <RefreshCw className="h-4 w-4" />
          <span>Refresh</span>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Moderator List */}
        <Card className="md:col-span-5">
          <CardHeader>
            <CardTitle>Moderators</CardTitle>
            <CardDescription>Select a moderator to assign location</CardDescription>
            <div className="relative mt-2">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search moderators..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : filteredModerators.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <User className="h-12 w-12 mx-auto opacity-20" />
                <p className="mt-2">No moderators found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredModerators.map((moderator) => (
                  <div 
                    key={moderator.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedModerator?.id === moderator.id 
                        ? 'bg-muted/50 border-primary' 
                        : 'hover:bg-muted/30'
                    }`}
                    onClick={() => setSelectedModerator(moderator)}
                  >
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-medium">{moderator.full_name}</h3>
                        <p className="text-sm text-muted-foreground">{moderator.email}</p>
                      </div>
                      <Badge variant="outline" className="h-fit">
                        {getLevelDescription(moderator.moderation_level)}
                      </Badge>
                    </div>
                    {(moderator.region || moderator.district || moderator.ward || moderator.village) && (
                      <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        <span>{getModerationScope(moderator)}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Assignment Form */}
        <Card className="md:col-span-7">
          <CardHeader>
            <CardTitle>Area Assignment</CardTitle>
            <CardDescription>
              {selectedModerator 
                ? `Assign ${selectedModerator.full_name} to a location` 
                : "Select a moderator first"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!selectedModerator ? (
              <div className="text-center py-10 text-muted-foreground">
                <MapPin className="h-12 w-12 mx-auto opacity-20" />
                <p className="mt-2">Select a moderator from the list</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label>Moderation Level</Label>
                    <Select 
                      value={moderationLevel.toString()} 
                      onValueChange={(val) => setModerationLevel(parseInt(val))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Region Level (Level 1)</SelectItem>
                        <SelectItem value="2">District Level (Level 2)</SelectItem>
                        <SelectItem value="3">Ward Level (Level 3)</SelectItem>
                        <SelectItem value="4">Village Level (Level 4)</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground mt-1">
                      This determines the moderator's responsibilities and access level
                    </p>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <Label>Region</Label>
                    <Select 
                      value={selectedRegion || ""} 
                      onValueChange={setSelectedRegion}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select region" />
                      </SelectTrigger>
                      <SelectContent>
                        {tanzaniaRegions.map(region => (
                          <SelectItem key={region.name} value={region.name}>
                            {region.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {selectedRegion && (
                    <div>
                      <Label>District</Label>
                      <Select 
                        value={selectedDistrict || ""} 
                        onValueChange={setSelectedDistrict}
                        disabled={districts.length === 0}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select district" />
                        </SelectTrigger>
                        <SelectContent>
                          {districts.map(district => (
                            <SelectItem key={district} value={district}>
                              {district}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  
                  {selectedDistrict && (
                    <div>
                      <Label>Ward</Label>
                      <Select 
                        value={selectedWard || ""} 
                        onValueChange={setSelectedWard}
                        disabled={wards.length === 0}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select ward" />
                        </SelectTrigger>
                        <SelectContent>
                          {wards.map(ward => (
                            <SelectItem key={ward} value={ward}>
                              {ward}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  
                  {selectedWard && villages.length > 0 && (
                    <div>
                      <Label>Village</Label>
                      <Select 
                        value={selectedVillage || ""} 
                        onValueChange={setSelectedVillage}
                        disabled={villages.length === 0}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select village" />
                        </SelectTrigger>
                        <SelectContent>
                          {villages.map(village => (
                            <SelectItem key={village} value={village}>
                              {village}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
                
                <Button className="w-full" onClick={handleSaveAssignment}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Assignment
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 