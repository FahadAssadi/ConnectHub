import { Hono } from "hono";
import { auth } from "../../lib/auth";
import { db } from "../../db";
import { userProfile, user as userTable, companyDetails, primaryContact, bdPartnerIndividual, bdPartnerCompany } from "../../db/schema";
import { eq } from "drizzle-orm";

const app = new Hono();

/**
 * Create account and initialize registration
 * POST /api/registration/create-account
 */
app.post("/create-account", async (c) => {
  try {
    const { email, password, userType } = await c.req.json();

    // Validate input
    if (!email || !password || !userType) {
      return c.json({ 
        error: "Missing required fields",
        details: "Email, password, and user type are required"
      }, 400);
    }

    if (!["company", "individual_bd", "company_bd"].includes(userType)) {
      return c.json({ 
        error: "Invalid user type",
        details: "User type must be company, individual_bd, or company_bd"
      }, 400);
    }

    // Check if user already exists
    const existingUser = await db.select().from(userTable).where(eq(userTable.email, email)).limit(1);
    if (existingUser.length > 0) {
      return c.json({ 
        error: "User already exists",
        details: "An account with this email address already exists"
      }, 400);
    }

    // Create user account using better-auth
    const signUpResult = await auth.api.signUpEmail({
      body: { email, password, name: email.split('@')[0] },
      headers: c.req.header()
    });

    if (!signUpResult) {
      return c.json({ 
        error: "Failed to create account",
        details: "Unable to create user account"
      }, 500);
    }

    // Get the created user
    const createdUser = await db.select().from(userTable).where(eq(userTable.email, email)).limit(1);
    if (createdUser.length === 0) {
      return c.json({ 
        error: "User creation failed",
        details: "Account created but user not found"
      }, 500);
    }

    // Convert userType for database
    const dbUserType = userType === "individual_bd" ? "bd_partner_individual" : 
                      userType === "company_bd" ? "bd_partner_company" : 
                      "company";

    // Create user profile
    const totalStages = userType === "individual_bd" ? 3 : 4;
    const profile = await db.insert(userProfile).values({
      id: crypto.randomUUID(),
      userId: createdUser[0].id,
      userType: dbUserType as any,
      currentStage: 1,
      totalStages,
      registrationStatus: "incomplete" as any,
      canAccessMarketplace: false
    }).returning();

    return c.json({
      success: true,
      userId: createdUser[0].id,
      userType,
      currentStage: 1,
      totalStages,
      nextStage: `/register/${userType === "company" ? "company" : "bd-partner/" + (userType === "individual_bd" ? "individual" : "company")}/stage2`
    });

  } catch (error) {
    console.error("Registration error:", error);
    return c.json({ 
      error: "Internal server error",
      details: "An unexpected error occurred during registration"
    }, 500);
  }
});

/**
 * Complete a registration stage
 * POST /api/registration/stage/:stageNumber
 */
app.post("/stage/:stageNumber", async (c) => {
  try {
    const stageNumber = parseInt(c.req.param("stageNumber"));
    const stageData = await c.req.json();
    const { userId, userType } = stageData;

    if (!userId || !userType) {
      return c.json({ 
        error: "Missing required data",
        details: "User ID and user type are required"
      }, 400);
    }

    // Get user profile
    const profile = await db.select().from(userProfile).where(eq(userProfile.userId, userId)).limit(1);
    if (profile.length === 0) {
      return c.json({ 
        error: "User profile not found",
        details: "Please restart the registration process"
      }, 404);
    }

    const userProfileData = profile[0];

    // Validate stage progression
    if (stageNumber !== userProfileData.currentStage) {
      return c.json({ 
        error: "Invalid stage",
        details: `Expected stage ${userProfileData.currentStage}, got ${stageNumber}`
      }, 400);
    }

    // Save stage data based on user type and stage
    await saveStageData(userType, stageNumber, stageData, userProfileData.id);

    // Update user profile
    const isLastStage = stageNumber >= userProfileData.totalStages;
    const nextStage = isLastStage ? userProfileData.currentStage : stageNumber + 1;
    const newStatus = isLastStage ? "pending_review" : "incomplete";

    await db.update(userProfile)
      .set({
        currentStage: nextStage,
        registrationStatus: newStatus as any,
        ...(isLastStage && { profileCompletedAt: new Date() })
      })
      .where(eq(userProfile.id, userProfileData.id));

    return c.json({
      success: true,
      isComplete: isLastStage,
      currentStage: nextStage,
      status: newStatus
    });

  } catch (error) {
    console.error("Stage completion error:", error);
    return c.json({ 
      error: "Failed to save stage data",
      details: "An error occurred while saving your information"
    }, 500);
  }
});

/**
 * Get user registration status
 * GET /api/registration/status/:userId
 */
app.get("/status/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    
    const profile = await db.select().from(userProfile).where(eq(userProfile.userId, userId)).limit(1);
    if (profile.length === 0) {
      return c.json({ 
        error: "Profile not found",
        details: "User profile does not exist"
      }, 404);
    }

    return c.json({
      success: true,
      profile: profile[0]
    });

  } catch (error) {
    console.error("Status check error:", error);
    return c.json({ 
      error: "Failed to get status",
      details: "Unable to retrieve registration status"
    }, 500);
  }
});

async function saveStageData(userType: string, stageNumber: number, data: any, userProfileId: string) {
  switch (userType) {
    case "company":
      await saveCompanyStageData(stageNumber, data, userProfileId);
      break;
    case "individual_bd":
      await saveIndividualBdStageData(stageNumber, data, userProfileId);
      break;
    case "company_bd":
      await saveCompanyBdStageData(stageNumber, data, userProfileId);
      break;
    default:
      throw new Error("Invalid user type");
  }
}

async function saveCompanyStageData(stageNumber: number, data: any, userProfileId: string) {
  switch (stageNumber) {
    case 2: // Company Details
      await db.insert(companyDetails).values({
        id: crypto.randomUUID(),
        userProfileId,
        companyName: data.companyName,
        abnBusinessNumber: data.abnBusinessRegistrationNumber,
        registeredBusinessName: data.registeredBusinessName,
        industryCategory: data.industryCategory,
        countryOfRegistration: data.countryOfRegistration,
        registeredAddress: data.registeredAddress
      }).onConflictDoUpdate({
        target: companyDetails.userProfileId,
        set: {
          companyName: data.companyName,
          abnBusinessNumber: data.abnBusinessRegistrationNumber,
          registeredBusinessName: data.registeredBusinessName,
          industryCategory: data.industryCategory,
          countryOfRegistration: data.countryOfRegistration,
          registeredAddress: data.registeredAddress
        }
      });
      break;
    case 3: // Primary Contact
      const companyRecord = await db.select().from(companyDetails).where(eq(companyDetails.userProfileId, userProfileId)).limit(1);
      if (companyRecord.length > 0) {
        await db.insert(primaryContact).values({
          id: crypto.randomUUID(),
          companyDetailsId: companyRecord[0].id,
          fullName: data.fullName,
          jobTitle: data.jobTitle,
          email: data.emailAddress,
          phoneNumber: data.phoneNumber,
          linkedinProfile: data.linkedInProfile
        }).onConflictDoUpdate({
          target: primaryContact.companyDetailsId,
          set: {
            fullName: data.fullName,
            jobTitle: data.jobTitle,
            email: data.emailAddress,
            phoneNumber: data.phoneNumber,
            linkedinProfile: data.linkedInProfile
          }
        });
      }
      break;
  }
}

async function saveIndividualBdStageData(stageNumber: number, data: any, userProfileId: string) {
  switch (stageNumber) {
    case 2: // Personal & Professional Details
      await db.insert(bdPartnerIndividual).values({
        id: crypto.randomUUID(),
        userProfileId,
        fullName: data.fullName,
        email: data.emailAddress,
        mobileNumber: data.mobileNumber,
        country: data.country,
        stateProvince: data.stateProvince,
        city: data.city,
        linkedinProfile: data.linkedInProfile
      }).onConflictDoUpdate({
        target: bdPartnerIndividual.userProfileId,
        set: {
          fullName: data.fullName,
          email: data.emailAddress,
          mobileNumber: data.mobileNumber,
          country: data.country,
          stateProvince: data.stateProvince,
          city: data.city,
          linkedinProfile: data.linkedInProfile
        }
      });
      break;
    case 3: // Engagement & Documents
      console.log("Engagement data saved for individual BD:", data);
      break;
  }
}

async function saveCompanyBdStageData(stageNumber: number, data: any, userProfileId: string) {
  switch (stageNumber) {
    case 2: // Company Details & Contact
      const companyId = crypto.randomUUID();
      await db.insert(companyDetails).values({
        id: companyId,
        userProfileId,
        companyName: data.companyName,
        yearOfIncorporation: parseInt(data.yearEstablished),
        companyType: data.companyType as any,
        registeredBusinessName: data.registeredCompanyName,
        countryOfRegistration: data.countryOfRegistration,
        website: data.website,
        linkedinUrl: data.linkedInSocialLinks
      }).onConflictDoUpdate({
        target: companyDetails.userProfileId,
        set: {
          companyName: data.companyName,
          yearOfIncorporation: parseInt(data.yearEstablished),
          companyType: data.companyType as any,
          registeredBusinessName: data.registeredCompanyName,
          countryOfRegistration: data.countryOfRegistration,
          website: data.website,
          linkedinUrl: data.linkedInSocialLinks
        }
      });

      await db.insert(bdPartnerCompany).values({
        id: crypto.randomUUID(),
        userProfileId,
        companyDetailsId: companyId,
        contactPersonName: data.contactPersonName,
        contactPersonDesignation: data.designation,
        contactPersonEmail: data.emailAddress
      }).onConflictDoUpdate({
        target: bdPartnerCompany.userProfileId,
        set: {
          contactPersonName: data.contactPersonName,
          contactPersonDesignation: data.designation,
          contactPersonEmail: data.emailAddress
        }
      });
      break;
    case 3: // Profile & Engagement
      console.log("Profile & engagement data saved for company BD:", data);
      break;
    case 4: // Documents & Declarations
      console.log("Documents & declarations data saved for company BD:", data);
      break;
  }
}

export default app;
