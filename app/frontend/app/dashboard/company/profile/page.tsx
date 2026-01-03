"use client"

import { useEffect, useState } from "react"
import { AppLayout } from "../../(components)/dashboard-layout"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProfileOverviewCard, type ProfileOverviewData } from "./(components)/profile-overview-card"
import { ProfileBasicInfo, type BasicInfoData } from "./(components)/profile-basic-info"
import { ProfileIndustries, type IndustryData } from "./(components)/profile-industries"
import {
  ProfileEngagementTools,
  type EngagementModel,
  type Tool,
  type Certification,
} from "./(components)/profile-engagement-tools"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000"

const defaultProfileOverview: ProfileOverviewData = {
  companyName: "Acme Corp",
  logoURL: undefined,
  status: "approved",
  ndaStatus: true,
  contactPerson: {
    name: "John Doe",
    designation: "Chief Business Officer",
    email: "john.doe@acmecorp.com",
    phone: "+1 (555) 123-4567",
  },
  websiteURL: "https://acmecorp.com",
  linkedInURL: "https://linkedin.com/company/acmecorp",
  description: "Acme Corp is a leading technology solutions provider.",
}

const defaultBasicInfo: BasicInfoData = {
  companyName: "Acme Corp",
  businessRegNumber: "12345678",
  registeredBusinessName: "Acme Corporation Inc.",
  countryOfRegistration: "United States",
  registeredAddress: "123 Tech Street, San Francisco, CA 94105",
  yearOfEstablishment: 2015,
  headOfficeLocation: "San Francisco, California",
}

function mapUserProfileToComponentData(profile: any) {
  const companyProfile = profile?.companyProfile
  const commonDetails = companyProfile?.commonDetails

  const profileOverview: ProfileOverviewData = {
    companyName: commonDetails?.companyName || "N/A",
    logoURL: commonDetails?.logoURL,
    status: profile?.status || "draft",
    ndaStatus: companyProfile?.ndaAgreed || false,
    contactPerson: {
      name: commonDetails?.contactPersonName || "N/A",
      designation: commonDetails?.contactPersonDesignation || "N/A",
      email: commonDetails?.contactPersonEmail || "N/A",
      phone: commonDetails?.contactPersonPhone || "N/A",
    },
    websiteURL: commonDetails?.websiteURL,
    linkedInURL: commonDetails?.linkedInURL,
    description: commonDetails?.description,
  }

  const basicInfo: BasicInfoData = {
    companyName: commonDetails?.companyName || "N/A",
    businessRegNumber: commonDetails?.businessRegNumber || "N/A",
    registeredBusinessName: commonDetails?.registeredBuisnessName,
    countryOfRegistration: commonDetails?.countryOfRegistration || "N/A",
    registeredAddress: commonDetails?.registeredAddress || "N/A",
    yearOfEstablishment: commonDetails?.yearOfEstablishment,
    headOfficeLocation: companyProfile?.headOfficeLocation,
  }

  const industries: IndustryData[] =
    companyProfile?.profileIndustries?.map((pi: any) => ({
      category: pi.industryCategory?.name,
      subCategory: pi.industrySubCategory?.name,
      specialisation: pi.industrySpecialisation?.name,
    })) || []

  const engagementModels: EngagementModel[] =
    companyProfile?.profileEngagements?.map((pe: any) => ({
      name: pe.engagementModel?.name,
    })) || []

  const tools: Tool[] =
    companyProfile?.profileTools?.map((pt: any) => ({
      name: pt.toolPlatform?.name,
    })) || []

  const certifications: Certification[] =
    companyProfile?.profileCertifications?.map((pc: any) => ({
      name: pc.certification?.name,
    })) || []

  return {
    profileOverview,
    basicInfo,
    industries,
    engagementModels,
    tools,
    certifications,
  }
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [profileData, setProfileData] = useState({
    profileOverview: defaultProfileOverview,
    basicInfo: defaultBasicInfo,
    industries: [] as IndustryData[],
    engagementModels: [] as EngagementModel[],
    tools: [] as Tool[],
    certifications: [] as Certification[],
  })

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await fetch(`${API_BASE}/user-profile`, {
          credentials: "include",
        })
        if (!response.ok) {
          throw new Error(`Failed to fetch profile (${response.status})`)
        }
        const data = await response.json()
        const mapped = mapUserProfileToComponentData(data)
        setProfileData(mapped)
        setError(null)
      } catch (err) {
        console.error("Error fetching profile:", err)
        setError("Unable to load profile. Using default data.")
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        <p className="ml-4 text-lg">Loading profile...</p>
      </div>
    )
  }

  const handleEdit = () => {
    console.log("Edit profile")
  }

  return (
      <div className="space-y-6">
        {error && (
          <div className="rounded-md border border-yellow-300 bg-yellow-50 p-4">
            <p className="text-sm text-yellow-800">{error}</p>
          </div>
        )}
        <ProfileOverviewCard data={profileData.profileOverview} onEdit={handleEdit} />

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 lg:w-auto">
            <TabsTrigger value="overview">Basic Info</TabsTrigger>
            <TabsTrigger value="industries">Industries</TabsTrigger>
            <TabsTrigger value="engagement">Engagement & Tools</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <ProfileBasicInfo data={profileData.basicInfo} />
          </TabsContent>

          <TabsContent value="industries" className="space-y-6">
            <ProfileIndustries industries={profileData.industries} />
          </TabsContent>

          <TabsContent value="engagement" className="space-y-6">
            <ProfileEngagementTools
              engagementModels={profileData.engagementModels}
              tools={profileData.tools}
              certifications={profileData.certifications}
            />
          </TabsContent>
        </Tabs>
      </div>
  )
}
