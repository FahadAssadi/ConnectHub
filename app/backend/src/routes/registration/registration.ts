import { Hono } from 'hono';
import { db } from '../../db';
import { userProfiles, userActivityLog } from '../../db/schema/user-profiles';
import { bdPartners } from '../../db/schema/bd-partners';
import { companies } from '../../db/schema/companies';
import { eq, and } from 'drizzle-orm';
import { z } from 'zod';

const registrationRouter = new Hono();

// Validation schemas
const baseRegistrationSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  userType: z.enum(['bd_partner', 'company']),
  stage: z.string().min(1, "Stage is required"),
});

const bdPartnerStageSchemas = {
  // Stage 1: Basic Information
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
  
  // Stage 2: Professional Background
  professional: z.object({
    bio: z.string().min(50, "Bio must be at least 50 characters"),
    professionalBackground: z.string().min(100, "Professional background must be at least 100 characters"),
    availability: z.enum(['part_time', 'full_time', 'flexible', 'project_based']),
    availabilityHours: z.number().min(1).max(80).optional(),
    hourlyRate: z.string().optional(),
    languages: z.array(z.string()).min(1, "At least one language is required"),
  }),
  
  // Stage 3: Expertise & Industries
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
  
  // Stage 4: Verification & Documents
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

const companyStageSchemas = {
  // Stage 1: Company Information
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
  
  // Stage 2: Contact Information
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
  
  // Stage 3: Business Details
  business_details: z.object({
    targetMarkets: z.array(z.string()).min(1, "At least one target market is required"),
    customerTypes: z.array(z.string()).min(1, "At least one customer type is required"),
    businessModel: z.string().min(50, "Business model description is required"),
    revenueRange: z.string().optional(),
    employeeCount: z.number().min(1).optional(),
    mainProducts: z.array(z.string()).min(1, "At least one main product/service is required"),
  }),
  
  // Stage 4: BD Partnership Goals
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
  
  // Stage 5: Verification & Documents
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

// Helper function to calculate profile completeness
function calculateProfileCompleteness(userType: string, completedStages: string[]): number {
  const totalStages = userType === 'bd_partner' ? 4 : 5;
  return Math.round((completedStages.length / totalStages) * 100);
}

// Helper function to log user activity
async function logActivity(userId: string, action: string, metadata?: any) {
  try {
    await db.insert(userActivityLog).values({
      userId,
      action,
      entityType: 'registration',
      metadata: metadata ? JSON.stringify(metadata) : null,
    });
  } catch (error) {
    console.error('Failed to log activity:', error);
  }
}

// GET /api/registration/progress/:userId
registrationRouter.get('/progress/:userId', async (c) => {
  try {
    const userId = c.req.param('userId');
    
    if (!userId) {
      return c.json({ error: 'User ID is required' }, 400);
    }

    // Get user profile
    const userProfile = await db.query.userProfiles.findFirst({
      where: eq(userProfiles.userId, userId),
    });

    if (!userProfile) {
      return c.json({ error: 'User profile not found' }, 404);
    }

    // Get registration data based on user type
    let registrationData: any = null;
    let completedStages: string[] = [];

    if (userProfile.userType === 'bd_partner') {
      const bdPartner = await db.query.bdPartners.findFirst({
        where: eq(bdPartners.userId, userId),
      });
      
      if (bdPartner) {
        registrationData = bdPartner;
        // Determine completed stages based on available data
        if (bdPartner.fullName && bdPartner.email && bdPartner.country) {
          completedStages.push('basic_info');
        }
        if (bdPartner.bio && bdPartner.professionalBackground && bdPartner.availability) {
          completedStages.push('professional');
        }
        if (bdPartner.metadata && JSON.parse(bdPartner.metadata || '{}').expertise) {
          completedStages.push('expertise');
        }
        if (bdPartner.isVerified) {
          completedStages.push('verification');
        }
      }
    } else if (userProfile.userType === 'company') {
      const company = await db.query.companies.findFirst({
        where: eq(companies.userId, userId),
      });
      
      if (company) {
        registrationData = company;
        // Determine completed stages based on available data
        if (company.companyName && company.industry && company.businessType) {
          completedStages.push('company_info');
        }
        if (company.email && company.country) {
          completedStages.push('contact_info');
        }
        if (company.metadata && JSON.parse(company.metadata || '{}').businessDetails) {
          completedStages.push('business_details');
        }
        if (company.metadata && JSON.parse(company.metadata || '{}').partnershipGoals) {
          completedStages.push('partnership_goals');
        }
        if (company.isVerified) {
          completedStages.push('verification');
        }
      }
    }

    const profileCompleteness = calculateProfileCompleteness(userProfile.userType, completedStages);

    return c.json({
      success: true,
      data: {
        userProfile,
        registrationData,
        completedStages,
        profileCompleteness,
        isComplete: userProfile.onboardingCompleted,
        nextStage: getNextStage(userProfile.userType, completedStages),
      },
    });
  } catch (error) {
    console.error('Error getting registration progress:', error);
    return c.json({ error: 'Failed to get registration progress' }, 500);
  }
});

// POST /api/registration/stage
registrationRouter.post('/stage', async (c) => {
  try {
    const body = await c.req.json();
    
    // Validate base registration data
    const baseData = baseRegistrationSchema.parse(body);
    const { userId, userType, stage } = baseData;

    // Get the appropriate schema for this stage
    const stageSchemas = userType === 'bd_partner' ? bdPartnerStageSchemas : companyStageSchemas;
    const stageSchema = stageSchemas[stage as keyof typeof stageSchemas];
    
    if (!stageSchema) {
      return c.json({ error: `Invalid stage: ${stage}` }, 400);
    }

    // Validate stage-specific data
    const stageData = stageSchema.parse(body.data);

    // Start transaction
    await db.transaction(async (tx) => {
      // Update or create user profile
      await tx
        .insert(userProfiles)
        .values({
          userId,
          userType: userType as 'bd_partner' | 'company',
          status: 'pending',
          onboardingCompleted: false,
        })
        .onConflictDoUpdate({
          target: userProfiles.userId,
          set: {
            updatedAt: new Date(),
          },
        });

      if (userType === 'bd_partner') {
        await saveBdPartnerStage(tx, userId, stage, stageData);
      } else if (userType === 'company') {
        await saveCompanyStage(tx, userId, stage, stageData);
      }

      // Get updated completedness
      const userProfile = await tx.query.userProfiles.findFirst({
        where: eq(userProfiles.userId, userId),
      });

      if (userProfile) {
        // Calculate new profile completeness
        const completedStages = await getCompletedStages(tx, userId, userType);
        const profileCompleteness = calculateProfileCompleteness(userType, completedStages);
        const isComplete = profileCompleteness === 100;

        // Update profile completeness
        await tx
          .update(userProfiles)
          .set({
            profileCompleteness: profileCompleteness.toString(),
            onboardingCompleted: isComplete,
            status: isComplete ? 'active' : 'pending',
            updatedAt: new Date(),
          })
          .where(eq(userProfiles.userId, userId));
      }
    });

    // Log the activity
    await logActivity(userId, `registration_stage_${stage}_completed`, { stage, userType });

    return c.json({
      success: true,
      message: `Stage ${stage} completed successfully`,
      stage,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({
        error: 'Validation failed',
        details: error.issues.map(err => ({
          field: err.path.join('.'),
          message: err.message,
        })),
      }, 400);
    }

    console.error('Error saving registration stage:', error);
    return c.json({ error: 'Failed to save registration stage' }, 500);
  }
});

// Helper function to save BD Partner stage data
async function saveBdPartnerStage(tx: any, userId: string, stage: string, data: any) {
  const existing = await tx.query.bdPartners.findFirst({
    where: eq(bdPartners.userId, userId),
  });

  let updateData: any = {};
  let metadata = existing?.metadata ? JSON.parse(existing.metadata) : {};

  switch (stage) {
    case 'basic_info':
      updateData = {
        fullName: data.fullName,
        displayName: data.displayName,
        title: data.title,
        email: data.email,
        phone: data.phone,
        country: data.country,
        city: data.city,
        state: data.state,
        timezone: data.timezone,
      };
      break;
    
    case 'professional':
      updateData = {
        bio: data.bio,
        professionalBackground: data.professionalBackground,
        availability: data.availability,
        availabilityHours: data.availabilityHours,
        hourlyRate: data.hourlyRate,
        languages: JSON.stringify(data.languages),
      };
      break;
    
    case 'expertise':
      metadata.expertise = data;
      updateData = { metadata: JSON.stringify(metadata) };
      break;
    
    case 'verification':
      metadata.documents = data.documents;
      metadata.verification = {
        backgroundCheckConsent: data.backgroundCheckConsent,
        termsAccepted: data.termsAccepted,
        privacyAccepted: data.privacyAccepted,
      };
      updateData = {
        metadata: JSON.stringify(metadata),
        backgroundCheckStatus: 'pending',
      };
      break;
  }

  if (existing) {
    await tx
      .update(bdPartners)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(bdPartners.userId, userId));
  } else {
    await tx.insert(bdPartners).values({
      userId,
      ...updateData,
    });
  }
}

// Helper function to save Company stage data
async function saveCompanyStage(tx: any, userId: string, stage: string, data: any) {
  const existing = await tx.query.companies.findFirst({
    where: eq(companies.userId, userId),
  });

  let updateData: any = {};
  let metadata = existing?.metadata ? JSON.parse(existing.metadata) : {};

  switch (stage) {
    case 'company_info':
      updateData = {
        companyName: data.companyName,
        registrationNumber: data.registrationNumber,
        taxId: data.taxId,
        industry: data.industry,
        businessType: data.businessType,
        companySize: data.companySize,
        foundedYear: data.foundedYear,
        website: data.website,
        description: data.description,
      };
      break;
    
    case 'contact_info':
      updateData = {
        email: data.primaryContactEmail,
        phone: data.primaryContactPhone,
        country: data.country,
        city: data.city,
        state: data.state,
        addressLine1: data.address,
        postalCode: data.postalCode,
      };
      metadata.primaryContact = {
        name: data.primaryContactName,
        title: data.primaryContactTitle,
        email: data.primaryContactEmail,
        phone: data.primaryContactPhone,
      };
      updateData.metadata = JSON.stringify(metadata);
      break;
    
    case 'business_details':
      metadata.businessDetails = data;
      updateData = { metadata: JSON.stringify(metadata) };
      break;
    
    case 'partnership_goals':
      metadata.partnershipGoals = data;
      updateData = { metadata: JSON.stringify(metadata) };
      break;
    
    case 'verification':
      metadata.documents = data.documents;
      metadata.verification = {
        businessLicenseNumber: data.businessLicenseNumber,
        taxCertification: data.taxCertification,
        termsAccepted: data.termsAccepted,
        privacyAccepted: data.privacyAccepted,
      };
      updateData = { metadata: JSON.stringify(metadata) };
      break;
  }

  if (existing) {
    await tx
      .update(companies)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(companies.userId, userId));
  } else {
    await tx.insert(companies).values({
      userId,
      ...updateData,
    });
  }
}

// Helper function to get completed stages
async function getCompletedStages(tx: any, userId: string, userType: string): Promise<string[]> {
  const completedStages: string[] = [];

  if (userType === 'bd_partner') {
    const bdPartner = await tx.query.bdPartners.findFirst({
      where: eq(bdPartners.userId, userId),
    });
    
    if (bdPartner) {
      if (bdPartner.fullName && bdPartner.email && bdPartner.country) {
        completedStages.push('basic_info');
      }
      if (bdPartner.bio && bdPartner.professionalBackground && bdPartner.availability) {
        completedStages.push('professional');
      }
      if (bdPartner.metadata && JSON.parse(bdPartner.metadata || '{}').expertise) {
        completedStages.push('expertise');
      }
      if (bdPartner.metadata && JSON.parse(bdPartner.metadata || '{}').verification?.termsAccepted) {
        completedStages.push('verification');
      }
    }
  } else if (userType === 'company') {
    const company = await tx.query.companies.findFirst({
      where: eq(companies.userId, userId),
    });
    
    if (company) {
      if (company.companyName && company.industry && company.businessType) {
        completedStages.push('company_info');
      }
      if (company.primaryContactName && company.primaryContactEmail && company.country) {
        completedStages.push('contact_info');
      }
      if (company.metadata && JSON.parse(company.metadata || '{}').businessDetails) {
        completedStages.push('business_details');
      }
      if (company.metadata && JSON.parse(company.metadata || '{}').partnershipGoals) {
        completedStages.push('partnership_goals');
      }
      if (company.metadata && JSON.parse(company.metadata || '{}').verification?.termsAccepted) {
        completedStages.push('verification');
      }
    }
  }

  return completedStages;
}

// Helper function to get next stage
function getNextStage(userType: string, completedStages: string[]): string | null {
  const allStages = userType === 'bd_partner' 
    ? ['basic_info', 'professional', 'expertise', 'verification']
    : ['company_info', 'contact_info', 'business_details', 'partnership_goals', 'verification'];

  for (const stage of allStages) {
    if (!completedStages.includes(stage)) {
      return stage;
    }
  }

  return null; // All stages completed
}

// GET /api/registration/stages/:userType
registrationRouter.get('/stages/:userType', async (c) => {
  try {
    const userType = c.req.param('userType');
    
    if (!['bd_partner', 'company'].includes(userType)) {
      return c.json({ error: 'Invalid user type' }, 400);
    }

    const stages = userType === 'bd_partner' 
      ? [
          { 
            id: 'basic_info', 
            title: 'Basic Information', 
            description: 'Personal and contact details',
            fields: ['fullName', 'email', 'phone', 'country', 'city']
          },
          { 
            id: 'professional', 
            title: 'Professional Background', 
            description: 'Your experience and availability',
            fields: ['bio', 'professionalBackground', 'availability', 'languages']
          },
          { 
            id: 'expertise', 
            title: 'Expertise & Industries', 
            description: 'Your areas of expertise and target markets',
            fields: ['industries', 'expertiseAreas', 'regions']
          },
          { 
            id: 'verification', 
            title: 'Verification & Documents', 
            description: 'Upload documents and complete verification',
            fields: ['documents', 'backgroundCheckConsent', 'termsAccepted']
          }
        ]
      : [
          { 
            id: 'company_info', 
            title: 'Company Information', 
            description: 'Basic company details and business information',
            fields: ['companyName', 'industry', 'businessType', 'description']
          },
          { 
            id: 'contact_info', 
            title: 'Contact Information', 
            description: 'Primary contact and company address',
            fields: ['primaryContactName', 'primaryContactEmail', 'country', 'address']
          },
          { 
            id: 'business_details', 
            title: 'Business Details', 
            description: 'Target markets and business model',
            fields: ['targetMarkets', 'businessModel', 'mainProducts']
          },
          { 
            id: 'partnership_goals', 
            title: 'Partnership Goals', 
            description: 'Your partnership objectives and expectations',
            fields: ['partnershipObjectives', 'commissionStructure', 'dealSizeExpectations']
          },
          { 
            id: 'verification', 
            title: 'Verification & Documents', 
            description: 'Upload documents and complete verification',
            fields: ['documents', 'termsAccepted', 'privacyAccepted']
          }
        ];

    return c.json({
      success: true,
      data: {
        userType,
        stages,
        totalStages: stages.length,
      },
    });
  } catch (error) {
    console.error('Error getting registration stages:', error);
    return c.json({ error: 'Failed to get registration stages' }, 500);
  }
});

// DELETE /api/registration/reset/:userId
registrationRouter.delete('/reset/:userId', async (c) => {
  try {
    const userId = c.req.param('userId');
    
    if (!userId) {
      return c.json({ error: 'User ID is required' }, 400);
    }

    // Start transaction to reset registration data
    await db.transaction(async (tx) => {
      // Reset user profile
      await tx
        .update(userProfiles)
        .set({
          status: 'pending',
          onboardingCompleted: false,
          profileCompleteness: '0',
          updatedAt: new Date(),
        })
        .where(eq(userProfiles.userId, userId));

      // Delete BD Partner data if exists
      await tx.delete(bdPartners).where(eq(bdPartners.userId, userId));
      
      // Delete Company data if exists
      await tx.delete(companies).where(eq(companies.userId, userId));
    });

    // Log the activity
    await logActivity(userId, 'registration_reset');

    return c.json({
      success: true,
      message: 'Registration data reset successfully',
    });
  } catch (error) {
    console.error('Error resetting registration:', error);
    return c.json({ error: 'Failed to reset registration' }, 500);
  }
});

export default registrationRouter;