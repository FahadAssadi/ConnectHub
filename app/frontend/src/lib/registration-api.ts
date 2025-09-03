import { z } from 'zod';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

// Registration stage schemas
export const bdPartnerStageSchemas = {
  basic_info: z.object({
    fullName: z.string().min(2, "Full name must be at least 2 characters"),
    displayName: z.string().optional(),
    title: z.string().optional(),
    email: z.string().email("Invalid email format"),
    phone: z.string().min(10, "Phone number must be at least 10 digits"),
    country: z.string().min(2, "Country is required"),
    city: z.string().min(2, "City is required"),
    state: z.string().optional(),
    timezone: z.string().optional(),
  }),
  
  professional: z.object({
    bio: z.string().min(50, "Bio must be at least 50 characters"),
    professionalBackground: z.string().min(100, "Professional background must be at least 100 characters"),
    availability: z.enum(['part_time', 'full_time', 'flexible', 'project_based']),
    availabilityHours: z.number().min(1).max(80).optional(),
    hourlyRate: z.string().optional(),
    languages: z.array(z.string()).min(1, "At least one language is required"),
  }),
  
  expertise: z.object({
    industries: z.array(z.string()).min(1, "At least one industry is required"),
    expertiseAreas: z.array(z.object({
      industry: z.string(),
      level: z.enum(['beginner', 'intermediate', 'advanced', 'expert']),
      yearsOfExperience: z.number().min(0),
      description: z.string().optional(),
    })).min(1, "At least one expertise area is required"),
    regions: z.array(z.string()).min(1, "At least one region is required"),
  }),
  
  verification: z.object({
    documents: z.array(z.object({
      type: z.enum(['cv', 'portfolio', 'profile', 'certification', 'reference']),
      fileName: z.string(),
      filePath: z.string(),
      fileSize: z.number(),
      description: z.string().optional(),
    })).optional(),
    backgroundCheckConsent: z.boolean().refine(val => val === true, "Background check consent is required"),
    termsAccepted: z.boolean().refine(val => val === true, "Terms must be accepted"),
    privacyAccepted: z.boolean().refine(val => val === true, "Privacy policy must be accepted"),
  }),
};

export const companyStageSchemas = {
  company_info: z.object({
    companyName: z.string().min(2, "Company name must be at least 2 characters"),
    registrationNumber: z.string().optional(),
    taxId: z.string().optional(),
    industry: z.string().min(1, "Industry is required"),
    businessType: z.enum(['startup', 'sme', 'enterprise', 'corporation', 'non_profit', 'government']),
    companySize: z.enum(['micro', 'small', 'medium', 'large', 'enterprise']),
    foundedYear: z.number().min(1800).max(new Date().getFullYear()),
    website: z.string().url("Invalid website URL").optional(),
    description: z.string().min(50, "Company description must be at least 50 characters"),
  }),
  
  contact_info: z.object({
    primaryContactName: z.string().min(2, "Primary contact name is required"),
    primaryContactTitle: z.string().min(2, "Primary contact title is required"),
    primaryContactEmail: z.string().email("Invalid email format"),
    primaryContactPhone: z.string().min(10, "Phone number must be at least 10 digits"),
    country: z.string().min(2, "Country is required"),
    city: z.string().min(2, "City is required"),
    state: z.string().optional(),
    address: z.string().min(10, "Address is required"),
    postalCode: z.string().min(3, "Postal code is required"),
  }),
  
  business_details: z.object({
    targetMarkets: z.array(z.string()).min(1, "At least one target market is required"),
    customerTypes: z.array(z.string()).min(1, "At least one customer type is required"),
    businessModel: z.string().min(50, "Business model description is required"),
    revenueRange: z.string().optional(),
    employeeCount: z.number().min(1).optional(),
    mainProducts: z.array(z.string()).min(1, "At least one main product/service is required"),
  }),
  
  partnership_goals: z.object({
    partnershipObjectives: z.array(z.string()).min(1, "At least one partnership objective is required"),
    expectedPartnerTypes: z.array(z.string()).min(1, "At least one expected partner type is required"),
    commissionStructure: z.object({
      type: z.enum(['percentage', 'fixed', 'tiered', 'custom']),
      value: z.string(),
      details: z.string().optional(),
    }),
    dealSizeExpectations: z.string(),
    timelineExpectations: z.string(),
    exclusivityPreferences: z.boolean(),
  }),
  
  verification: z.object({
    documents: z.array(z.object({
      type: z.enum(['logo', 'profile', 'deck', 'brochure', 'certification', 'agreement', 'financial', 'legal']),
      fileName: z.string(),
      filePath: z.string(),
      fileSize: z.number(),
      description: z.string().optional(),
    })).optional(),
    businessLicenseNumber: z.string().optional(),
    taxCertification: z.boolean().optional(),
    termsAccepted: z.boolean().refine(val => val === true, "Terms must be accepted"),
    privacyAccepted: z.boolean().refine(val => val === true, "Privacy policy must be accepted"),
  }),
};

// API Functions
export interface RegistrationProgress {
  userProfile: any;
  registrationData: any;
  completedStages: string[];
  profileCompleteness: number;
  isComplete: boolean;
  nextStage: string | null;
}

export interface RegistrationStage {
  id: string;
  title: string;
  description: string;
  fields: string[];
}

export interface RegistrationStagesResponse {
  userType: 'bd_partner' | 'company';
  stages: RegistrationStage[];
  totalStages: number;
}

export const registrationAPI = {
  // Get registration progress
  async getProgress(userId: string): Promise<RegistrationProgress> {
    const response = await fetch(`${API_BASE_URL}/api/registration/progress/${userId}`, {
      headers: {
        'X-User-ID': userId,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to get registration progress');
    }
    
    const result = await response.json();
    return result.data;
  },

  // Save registration stage
  async saveStage(userId: string, userType: 'bd_partner' | 'company', stage: string, data: any): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/registration/stage`, {
      method: 'POST',
      headers: {
        'X-User-ID': userId,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        userType,
        stage,
        data,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to save registration stage');
    }
  },

  // Get registration stages
  async getStages(userType: 'bd_partner' | 'company'): Promise<RegistrationStagesResponse> {
    const response = await fetch(`${API_BASE_URL}/api/registration/stages/${userType}`);
    
    if (!response.ok) {
      throw new Error('Failed to get registration stages');
    }
    
    const result = await response.json();
    return result.data;
  },

  // Reset registration
  async reset(userId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/registration/reset/${userId}`, {
      method: 'DELETE',
      headers: {
        'X-User-ID': userId,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to reset registration');
    }
  },
};

// Stage navigation helpers
export const getStageSchema = (userType: 'bd_partner' | 'company', stage: string) => {
  const schemas = userType === 'bd_partner' ? bdPartnerStageSchemas : companyStageSchemas;
  return schemas[stage as keyof typeof schemas];
};

export const getNextStage = (userType: 'bd_partner' | 'company', currentStage: string): string | null => {
  const bdPartnerStages = ['basic_info', 'professional', 'expertise', 'verification'];
  const companyStages = ['company_info', 'contact_info', 'business_details', 'partnership_goals', 'verification'];
  
  const stages = userType === 'bd_partner' ? bdPartnerStages : companyStages;
  const currentIndex = stages.indexOf(currentStage);
  
  if (currentIndex === -1 || currentIndex === stages.length - 1) {
    return null;
  }
  
  return stages[currentIndex + 1];
};

export const getPreviousStage = (userType: 'bd_partner' | 'company', currentStage: string): string | null => {
  const bdPartnerStages = ['basic_info', 'professional', 'expertise', 'verification'];
  const companyStages = ['company_info', 'contact_info', 'business_details', 'partnership_goals', 'verification'];
  
  const stages = userType === 'bd_partner' ? bdPartnerStages : companyStages;
  const currentIndex = stages.indexOf(currentStage);
  
  if (currentIndex <= 0) {
    return null;
  }
  
  return stages[currentIndex - 1];
};
