"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

// Mock BD-Partner data
const mockBdPartnerData = {
  profileType: "individual", // or "company"
  yearsOfExperience: 5,
  englishFluency: "fluent",
  referralNetworkDescription: "Extensive network in the tech industry.",
  existingClientBase: "Worked with over 50 clients globally.",
  weeklyCommitmentHours: 20,
  isVerified: true,
  verificationDate: "2025-01-15",
  isActive: true,
};

export default function BdPartnerProfile() {
  const [bdPartnerData, setBdPartnerData] = useState(mockBdPartnerData);
  const [isEditing, setIsEditing] = useState(false);

  const handleInputChange = (field: string, value: any) => {
    setBdPartnerData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    console.log("Saving BD-Partner data:", bdPartnerData);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">BD-Partner Profile</h1>
          <p className="text-muted-foreground">Manage your BD-Partner information and status</p>
        </div>
        <div className="flex gap-3">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>Save Changes</Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="basic">
        <TabsList>
          <TabsTrigger value="basic">Basic Information</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
        </TabsList>

        <TabsContent value="basic">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Details about your profile</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="profileType">Profile Type</Label>
                <Select
                  value={bdPartnerData.profileType}
                  onValueChange={(value) => handleInputChange("profileType", value)}
                  disabled={!isEditing}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select profile type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="individual">Individual</SelectItem>
                    <SelectItem value="company">Company</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="yearsOfExperience">Years of Experience</Label>
                <Input
                  id="yearsOfExperience"
                  type="number"
                  value={bdPartnerData.yearsOfExperience}
                  onChange={(e) => handleInputChange("yearsOfExperience", e.target.value)}
                  disabled={!isEditing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="englishFluency">English Fluency</Label>
                <Select
                  value={bdPartnerData.englishFluency}
                  onValueChange={(value) => handleInputChange("englishFluency", value)}
                  disabled={!isEditing}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select fluency level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">Basic</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="fluent">Fluent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="engagement">
          <Card>
            <CardHeader>
              <CardTitle>Engagement Details</CardTitle>
              <CardDescription>Information about your availability and network</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="weeklyCommitmentHours">Weekly Commitment Hours</Label>
                <Input
                  id="weeklyCommitmentHours"
                  type="number"
                  value={bdPartnerData.weeklyCommitmentHours}
                  onChange={(e) => handleInputChange("weeklyCommitmentHours", e.target.value)}
                  disabled={!isEditing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="referralNetworkDescription">Referral Network Description</Label>
                <Textarea
                  id="referralNetworkDescription"
                  value={bdPartnerData.referralNetworkDescription}
                  onChange={(e) => handleInputChange("referralNetworkDescription", e.target.value)}
                  disabled={!isEditing}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="existingClientBase">Existing Client Base</Label>
                <Textarea
                  id="existingClientBase"
                  value={bdPartnerData.existingClientBase}
                  onChange={(e) => handleInputChange("existingClientBase", e.target.value)}
                  disabled={!isEditing}
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
