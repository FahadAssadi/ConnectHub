import { eq, and, asc } from "drizzle-orm";
import { db } from "../../db";
import { userProfile, registrationStage } from "../../db/schema";
import type { UserType } from "../../db/schema";

export interface RegistrationStageConfig {
  stageNumber: number;
  stageName: string;
  requiredFields: string[];
  validationRules?: Record<string, any>;
}

// Registration stage configurations for different user types
export const REGISTRATION_STAGES: Record<UserType, RegistrationStageConfig[]> = {
  company: [
    {
      stageNumber: 1,
      stageName: "Company Details",
      requiredFields: [
        "companyName",
        "abnBusinessNumber", 
        "industryCategory",
        "countryOfRegistration",
        "registeredAddress"
      ]
    },
    {
      stageNumber: 2,
      stageName: "Primary Contact",
      requiredFields: [
        "fullName",
        "jobTitle",
        "email",
        "phoneNumber"
      ]
    },
    {
      stageNumber: 3,
      stageName: "Company Overview",
      requiredFields: [
        "briefDescription",
        "websiteUrl"
      ]
    },
    {
      stageNumber: 4,
      stageName: "Legal & Agreement",
      requiredFields: [
        "ndaAcceptance"
      ]
    }
  ],
  bd_partner_individual: [
    {
      stageNumber: 1,
      stageName: "Personal Details",
      requiredFields: [
        "fullName",
        "email",
        "mobileNumber",
        "country",
        "city"
      ]
    },
    {
      stageNumber: 2,
      stageName: "Professional Background",
      requiredFields: [
        "industriesExperienced",
        "domainExpertise",
        "specialization",
        "yearsOfBdExperience",
        "englishFluency"
      ]
    },
    {
      stageNumber: 3,
      stageName: "Engagement Preferences",
      requiredFields: [
        "preferredEngagementTypes",
        "availabilityHoursPerWeek"
      ]
    },
    {
      stageNumber: 4,
      stageName: "Documents & Declarations",
      requiredFields: [
        "resume",
        "idProof",
        "declaration"
      ]
    }
  ],
  bd_partner_company: [
    {
      stageNumber: 1,
      stageName: "Company Details",
      requiredFields: [
        "companyName",
        "yearEstablished",
        "companyType",
        "registrationNumber",
        "countryOfRegistration"
      ]
    },
    {
      stageNumber: 2,
      stageName: "Contact Person & Professional Background",
      requiredFields: [
        "contactPersonName",
        "contactPersonEmail",
        "contactPersonPhone",
        "industriesExperienced",
        "domainExpertise",
        "specialization",
        "numberOfEmployees",
        "yearsOfExperience"
      ]
    },
    {
      stageNumber: 3,
      stageName: "Engagement Preferences",
      requiredFields: [
        "preferredEngagementTypes",
        "capacityCommitment"
      ]
    },
    {
      stageNumber: 4,
      stageName: "Documents & Declarations",
      requiredFields: [
        "companyProfile",
        "businessLicense",
        "declaration"
      ]
    }
  ]
};

export class RegistrationManager {
  
  static get REGISTRATION_STAGES() {
    return REGISTRATION_STAGES;
  }
  
  /**
   * Initialize registration stages for a user
   */
  static async initializeRegistration(userId: string, userType: UserType) {
    const stages = REGISTRATION_STAGES[userType];
    const totalStages = stages.length;

    // Create user profile
    const [profile] = await db.insert(userProfile).values({
      userId,
      userType,
      totalStages,
      currentStage: 1,
      registrationStatus: "incomplete"
    }).returning();

    // Create all registration stages
    const stagePromises = stages.map(stage => 
      db.insert(registrationStage).values({
        userProfileId: profile.id,
        stageNumber: stage.stageNumber,
        stageName: stage.stageName
      })
    );

    await Promise.all(stagePromises);
    return profile;
  }

  /**
   * Get user's current registration status and stage
   */
  static async getUserRegistrationStatus(userId: string) {
    const profile = await db.select()
      .from(userProfile)
      .where(eq(userProfile.userId, userId))
      .limit(1);

    if (!profile.length) return null;

    const stages = await db.select()
      .from(registrationStage)
      .where(eq(registrationStage.userProfileId, profile[0].id))
      .orderBy(asc(registrationStage.stageNumber));

    return {
      ...profile[0],
      registrationStages: stages
    };
  }

  /**
   * Complete a registration stage
   */
  static async completeStage(userProfileId: string, stageNumber: number, stageData?: any) {
    // Mark the stage as completed
    await db.update(registrationStage)
      .set({
        isCompleted: true,
        completedAt: new Date(),
        stageData: stageData ? JSON.stringify(stageData) : null
      })
      .where(and(
        eq(registrationStage.userProfileId, userProfileId),
        eq(registrationStage.stageNumber, stageNumber)
      ));

    // Update user profile current stage
    const [profile] = await db.select()
      .from(userProfile)
      .where(eq(userProfile.id, userProfileId))
      .limit(1);

    if (profile) {
      const nextStage = stageNumber + 1;
      const isLastStage = stageNumber >= profile.totalStages;

      await db.update(userProfile)
        .set({
          currentStage: isLastStage ? profile.totalStages : nextStage,
          registrationStatus: isLastStage ? "pending_review" : "incomplete",
          profileCompletedAt: isLastStage ? new Date() : null,
          updatedAt: new Date()
        })
        .where(eq(userProfile.id, userProfileId));
    }
  }

  /**
   * Check if user can access marketplace
   */
  static async canAccessMarketplace(userId: string): Promise<boolean> {
    const [profile] = await db.select()
      .from(userProfile)
      .where(eq(userProfile.userId, userId))
      .limit(1);

    if (!profile) return false;

    // BD Partners can access marketplace with incomplete profile
    // but need to complete registration to apply
    if (profile.userType.startsWith('bd_partner')) {
      return true;
    }

    // Companies must complete registration
    return profile.registrationStatus === "approved";
  }

  /**
   * Check if user can apply to products
   */
  static async canApplyToProducts(userId: string): Promise<boolean> {
    const [profile] = await db.select()
      .from(userProfile)
      .where(eq(userProfile.userId, userId))
      .limit(1);

    if (!profile) return false;

    // Only BD Partners can apply, and they must have completed registration
    return profile.userType.startsWith('bd_partner') && 
           profile.registrationStatus === "approved";
  }

  /**
   * Get the next incomplete stage for a user
   */
  static async getNextIncompleteStage(userProfileId: string) {
    const [incompleteStage] = await db.select()
      .from(registrationStage)
      .where(and(
        eq(registrationStage.userProfileId, userProfileId),
        eq(registrationStage.isCompleted, false)
      ))
      .orderBy(asc(registrationStage.stageNumber))
      .limit(1);

    return incompleteStage;
  }

  /**
   * Validate stage data against required fields
   */
  static validateStageData(userType: UserType, stageNumber: number, data: any): string[] {
    const stageConfig = REGISTRATION_STAGES[userType]?.find(s => s.stageNumber === stageNumber);
    if (!stageConfig) return ["Invalid stage"];

    const errors: string[] = [];
    
    for (const field of stageConfig.requiredFields) {
      if (!data[field] || (Array.isArray(data[field]) && data[field].length === 0)) {
        errors.push(`${field} is required`);
      }
    }

    return errors;
  }

  /**
   * Approve user registration
   */
  static async approveRegistration(userProfileId: string) {
    await db.update(userProfile)
      .set({
        registrationStatus: "approved",
        approvedAt: new Date(),
        canAccessMarketplace: true,
        updatedAt: new Date()
      })
      .where(eq(userProfile.id, userProfileId));
  }

  /**
   * Reject user registration
   */
  static async rejectRegistration(userProfileId: string, reason: string) {
    await db.update(userProfile)
      .set({
        registrationStatus: "rejected",
        rejectedAt: new Date(),
        rejectionReason: reason,
        updatedAt: new Date()
      })
      .where(eq(userProfile.id, userProfileId));
  }
}

export default RegistrationManager;
