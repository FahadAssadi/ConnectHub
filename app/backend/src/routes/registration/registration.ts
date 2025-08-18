import { Hono } from "hono";
import { RegistrationManager } from "../../lib/registration/registration-manager";
import { withAuth, requireCompleteRegistration, requireMarketplaceAccess, requireBdPartnerApplicationAccess } from "../../lib/registration/middleware";
import { UserType } from "../../db/schema";

const app = new Hono();

/**
 * Initialize user registration with user type selection
 * POST /api/registration/initialize
 */
app.post("/initialize", async (c) => {
  const authCheck = await withAuth(c.req.raw);
  if (authCheck) return authCheck;

  const { userType } = await c.req.json();
  const user = (c.req.raw as any).user;

  if (!userType || !["company", "bd_partner_individual", "bd_partner_company"].includes(userType)) {
    return c.json({ error: "Invalid user type" }, 400);
  }

  try {
    // Check if user already has a profile
    const existingProfile = await RegistrationManager.getUserRegistrationStatus(user.id);
    if (existingProfile) {
      return c.json({ 
        error: "Registration already exists",
        profile: existingProfile 
      }, 400);
    }

    const profile = await RegistrationManager.initializeRegistration(user.id, userType);
    return c.json({ 
      success: true, 
      profile,
      redirectTo: `/registration/stage-1`
    });
  } catch (error) {
    console.error("Registration initialization error:", error);
    return c.json({ error: "Failed to initialize registration" }, 500);
  }
});

/**
 * Get current registration status
 * GET /api/registration/status
 */
app.get("/status", async (c) => {
  const authCheck = await withAuth(c.req.raw);
  if (authCheck) return authCheck;

  const user = (c.req.raw as any).user;

  try {
    const registration = await RegistrationManager.getUserRegistrationStatus(user.id);
    
    if (!registration) {
      return c.json({ 
        hasProfile: false,
        redirectTo: "/registration/user-type"
      });
    }

    return c.json({
      hasProfile: true,
      ...registration
    });
  } catch (error) {
    console.error("Registration status error:", error);
    return c.json({ error: "Failed to get registration status" }, 500);
  }
});

/**
 * Complete a registration stage
 * POST /api/registration/stage/:stageNumber
 */
app.post("/stage/:stageNumber", async (c) => {
  const authCheck = await withAuth(c.req.raw);
  if (authCheck) return authCheck;

  const user = (c.req.raw as any).user;
  const userProfile = (c.req.raw as any).userProfile;
  const stageNumber = parseInt(c.req.param("stageNumber"));
  const stageData = await c.req.json();

  if (!userProfile) {
    return c.json({ 
      error: "Registration not initialized",
      redirectTo: "/registration/user-type"
    }, 400);
  }

  if (stageNumber !== userProfile.currentStage) {
    return c.json({ 
      error: "Invalid stage progression",
      currentStage: userProfile.currentStage
    }, 400);
  }

  try {
    // Validate stage data
    const validationErrors = RegistrationManager.validateStageData(
      userProfile.userType, 
      stageNumber, 
      stageData
    );

    if (validationErrors.length > 0) {
      return c.json({ 
        error: "Validation failed",
        validationErrors 
      }, 400);
    }

    // Complete the stage
    await RegistrationManager.completeStage(userProfile.id, stageNumber, stageData);

    // Get updated profile
    const updatedProfile = await RegistrationManager.getUserRegistrationStatus(user.id);

    const isLastStage = stageNumber >= userProfile.totalStages;
    const nextStage = stageNumber + 1;

    return c.json({
      success: true,
      isComplete: isLastStage,
      nextStage: isLastStage ? null : nextStage,
      redirectTo: isLastStage ? "/registration/pending" : `/registration/stage-${nextStage}`,
      profile: updatedProfile
    });
  } catch (error) {
    console.error("Stage completion error:", error);
    return c.json({ error: "Failed to complete stage" }, 500);
  }
});

/**
 * Get stage configuration
 * GET /api/registration/stage/:stageNumber/config
 */
app.get("/stage/:stageNumber/config", async (c) => {
  const authCheck = await withAuth(c.req.raw);
  if (authCheck) return authCheck;

  const userProfile = (c.req.raw as any).userProfile;
  const stageNumber = parseInt(c.req.param("stageNumber"));

  if (!userProfile) {
    return c.json({ 
      error: "Registration not initialized",
      redirectTo: "/registration/user-type"
    }, 400);
  }

  try {
    const stageConfig = RegistrationManager.REGISTRATION_STAGES[userProfile.userType as UserType]?.find(
      s => s.stageNumber === stageNumber
    );

    if (!stageConfig) {
      return c.json({ error: "Invalid stage" }, 400);
    }

    return c.json({
      ...stageConfig,
      userType: userProfile.userType,
      totalStages: userProfile.totalStages,
      currentStage: userProfile.currentStage
    });
  } catch (error) {
    console.error("Stage config error:", error);
    return c.json({ error: "Failed to get stage configuration" }, 500);
  }
});

/**
 * Check marketplace access
 * GET /api/registration/marketplace-access
 */
app.get("/marketplace-access", async (c) => {
  const authCheck = await withAuth(c.req.raw);
  if (authCheck) return authCheck;

  const user = (c.req.raw as any).user;

  try {
    const canAccess = await RegistrationManager.canAccessMarketplace(user.id);
    return c.json({ canAccess });
  } catch (error) {
    console.error("Marketplace access check error:", error);
    return c.json({ error: "Failed to check marketplace access" }, 500);
  }
});

/**
 * Check BD Partner application access
 * GET /api/registration/application-access
 */
app.get("/application-access", async (c) => {
  const authCheck = await withAuth(c.req.raw);
  if (authCheck) return authCheck;

  const user = (c.req.raw as any).user;

  try {
    const canApply = await RegistrationManager.canApplyToProducts(user.id);
    return c.json({ canApply });
  } catch (error) {
    console.error("Application access check error:", error);
    return c.json({ error: "Failed to check application access" }, 500);
  }
});

export default app;
