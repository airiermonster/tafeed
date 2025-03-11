import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { tanzaniaRegions } from "@/data/locations";

interface LocationSelectorProps {
  onRegionChange: (region: string | null) => void;
  onDistrictChange: (district: string | null) => void;
  onWardChange: (ward: string | null) => void;
  onVillageChange: (village: string | null) => void;
  initialRegion?: string | null;
  initialDistrict?: string | null;
  initialWard?: string | null;
  initialVillage?: string | null;
  showVillages?: boolean;
  required?: boolean;
}

export function LocationSelector({
  onRegionChange,
  onDistrictChange,
  onWardChange,
  onVillageChange,
  initialRegion = null,
  initialDistrict = null,
  initialWard = null,
  initialVillage = null,
  showVillages = true,
  required = false
}: LocationSelectorProps) {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(initialRegion);
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(initialDistrict);
  const [selectedWard, setSelectedWard] = useState<string | null>(initialWard);
  const [selectedVillage, setSelectedVillage] = useState<string | null>(initialVillage);
  
  // Options for dropdown selections
  const [districts, setDistricts] = useState<string[]>([]);
  const [wards, setWards] = useState<string[]>([]);
  const [villages, setVillages] = useState<string[]>([]);

  // Set initial values if provided
  useEffect(() => {
    if (initialRegion) {
      setSelectedRegion(initialRegion);
    }
  }, [initialRegion]);

  useEffect(() => {
    if (initialDistrict) {
      setSelectedDistrict(initialDistrict);
    }
  }, [initialDistrict]);

  useEffect(() => {
    if (initialWard) {
      setSelectedWard(initialWard);
    }
  }, [initialWard]);

  useEffect(() => {
    if (initialVillage) {
      setSelectedVillage(initialVillage);
    }
  }, [initialVillage]);
  
  // Update available districts when region changes
  useEffect(() => {
    if (selectedRegion) {
      const regionData = tanzaniaRegions.find(r => r.name === selectedRegion);
      if (regionData) {
        setDistricts(regionData.districts.map(d => d.name));
        onRegionChange(selectedRegion);
        
        // If initial district is not in this region, clear it
        if (selectedDistrict && !regionData.districts.some(d => d.name === selectedDistrict)) {
          setSelectedDistrict(null);
          onDistrictChange(null);
        }
      } else {
        setDistricts([]);
      }
    } else {
      setDistricts([]);
      onRegionChange(null);
    }
  }, [selectedRegion, onRegionChange]);
  
  // Update available wards when district changes
  useEffect(() => {
    if (selectedRegion && selectedDistrict) {
      const regionData = tanzaniaRegions.find(r => r.name === selectedRegion);
      if (regionData) {
        const districtData = regionData.districts.find(d => d.name === selectedDistrict);
        if (districtData) {
          setWards(districtData.wards.map(w => w.name));
          onDistrictChange(selectedDistrict);
          
          // If initial ward is not in this district, clear it
          if (selectedWard && !districtData.wards.some(w => w.name === selectedWard)) {
            setSelectedWard(null);
            onWardChange(null);
          }
        } else {
          setWards([]);
        }
      }
    } else {
      setWards([]);
      onDistrictChange(null);
    }
  }, [selectedRegion, selectedDistrict, onDistrictChange]);
  
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
            onWardChange(selectedWard);
            
            // If initial village is not in this ward, clear it
            if (selectedVillage && wardData.villages && !wardData.villages.includes(selectedVillage)) {
              setSelectedVillage(null);
              onVillageChange(null);
            }
          } else {
            setVillages([]);
          }
        }
      }
    } else {
      setVillages([]);
      onWardChange(null);
    }
  }, [selectedRegion, selectedDistrict, selectedWard, onWardChange]);
  
  // Update village selection
  useEffect(() => {
    onVillageChange(selectedVillage);
  }, [selectedVillage, onVillageChange]);

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="region">
          Region {required && <span className="text-red-500">*</span>}
        </Label>
        <Select 
          value={selectedRegion || ""} 
          onValueChange={(value) => {
            if (value === "") {
              setSelectedRegion(null);
              setSelectedDistrict(null);
              setSelectedWard(null);
              setSelectedVillage(null);
            } else {
              setSelectedRegion(value);
            }
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select region" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Select region</SelectItem>
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
          <Label htmlFor="district">
            District {required && <span className="text-red-500">*</span>}
          </Label>
          <Select 
            value={selectedDistrict || ""} 
            onValueChange={(value) => {
              if (value === "") {
                setSelectedDistrict(null);
                setSelectedWard(null);
                setSelectedVillage(null);
              } else {
                setSelectedDistrict(value);
              }
            }}
            disabled={districts.length === 0}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select district" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Select district</SelectItem>
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
          <Label htmlFor="ward">
            Ward {required && <span className="text-red-500">*</span>}
          </Label>
          <Select 
            value={selectedWard || ""} 
            onValueChange={(value) => {
              if (value === "") {
                setSelectedWard(null);
                setSelectedVillage(null);
              } else {
                setSelectedWard(value);
              }
            }}
            disabled={wards.length === 0}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select ward" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Select ward</SelectItem>
              {wards.map(ward => (
                <SelectItem key={ward} value={ward}>
                  {ward}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      
      {showVillages && selectedWard && villages.length > 0 && (
        <div>
          <Label htmlFor="village">
            Village {required && <span className="text-red-500">*</span>}
          </Label>
          <Select 
            value={selectedVillage || ""} 
            onValueChange={(value) => {
              if (value === "") {
                setSelectedVillage(null);
              } else {
                setSelectedVillage(value);
              }
            }}
            disabled={villages.length === 0}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select village" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Select village</SelectItem>
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
  );
} 