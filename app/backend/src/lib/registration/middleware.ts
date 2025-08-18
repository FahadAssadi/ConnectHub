import { auth } from "../auth";
import { RegistrationManager } from "./registration-manager";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    name: string;
  };
  userProfile?: {
    id: string;
    userType: string;
    registrationStatus: string;
    currentStage: number;
    canAccessMarketplace: boolean;
  };
}

/**
 * Helper function to get user session from request
 */
export async function getSessionFromRequest(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    return session;
  } catch (error) {
    return null;
  }
}

/**
 * Middleware to check authentication status
 */
export async function withAuth(request: AuthenticatedRequest): Promise<Response | null> {
  const session = await getSessionFromRequest(request);
  
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  // Add user to request
  (request as any).user = session.user;

  // Get user profile and registration status
  const userRegistration = await RegistrationManager.getUserRegistrationStatus(session.user.id);
  
  if (userRegistration) {
    (request as any).userProfile = {
      id: userRegistration.id,
      userType: userRegistration.userType,
      registrationStatus: userRegistration.registrationStatus,
      currentStage: userRegistration.currentStage,
      canAccessMarketplace: userRegistration.canAccessMarketplace
    };
  }

  return null; // Continue to next middleware/handler
}

/**
 * Middleware that requires completed registration
 */
export const requireCompleteRegistration = async (request: AuthenticatedRequest) => {
  if (!request.userProfile) {
    return new Response(
      JSON.stringify({ 
        error: "Registration required", 
        redirectTo: "/registration/user-type" 
      }), 
      { 
        status: 403, 
        headers: { "Content-Type": "application/json" } 
      }
    );
  }

  if (request.userProfile.registrationStatus === "incomplete") {
    return new Response(
      JSON.stringify({ 
        error: "Complete registration required", 
        redirectTo: `/registration/stage-${request.userProfile.currentStage}` 
      }), 
      { 
        status: 403, 
        headers: { "Content-Type": "application/json" } 
      }
    );
  }

  if (request.userProfile.registrationStatus === "pending_review") {
    return new Response(
      JSON.stringify({ 
        error: "Registration pending approval", 
        redirectTo: "/registration/pending" 
      }), 
      { 
        status: 403, 
        headers: { "Content-Type": "application/json" } 
      }
    );
  }

  if (request.userProfile.registrationStatus === "rejected") {
    return new Response(
      JSON.stringify({ 
        error: "Registration was rejected", 
        redirectTo: "/registration/rejected" 
      }), 
      { 
        status: 403, 
        headers: { "Content-Type": "application/json" } 
      }
    );
  }

  return null; // Continue to next middleware/handler
};

/**
 * Middleware for marketplace access (BD Partners can access with incomplete profile)
 */
export const requireMarketplaceAccess = async (request: AuthenticatedRequest) => {
  if (!request.userProfile) {
    return new Response(
      JSON.stringify({ 
        error: "Registration required", 
        redirectTo: "/registration/user-type" 
      }), 
      { 
        status: 403, 
        headers: { "Content-Type": "application/json" } 
      }
    );
  }

  const canAccess = await RegistrationManager.canAccessMarketplace(request.user!.id);
  
  if (!canAccess) {
    return new Response(
      JSON.stringify({ 
        error: "Complete registration to access marketplace", 
        redirectTo: `/registration/stage-${request.userProfile.currentStage}` 
      }), 
      { 
        status: 403, 
        headers: { "Content-Type": "application/json" } 
      }
    );
  }

  return null; // Continue to next middleware/handler
};

/**
 * Middleware for BD Partner application access
 */
export const requireBdPartnerApplicationAccess = async (request: AuthenticatedRequest) => {
  if (!request.userProfile) {
    return new Response(
      JSON.stringify({ 
        error: "Registration required", 
        redirectTo: "/registration/user-type" 
      }), 
      { 
        status: 403, 
        headers: { "Content-Type": "application/json" } 
      }
    );
  }

  const canApply = await RegistrationManager.canApplyToProducts(request.user!.id);
  
  if (!canApply) {
    if (!request.userProfile.userType.startsWith('bd_partner')) {
      return new Response(
        JSON.stringify({ 
          error: "Only BD Partners can apply to products" 
        }), 
        { 
          status: 403, 
          headers: { "Content-Type": "application/json" } 
        }
      );
    }

    return new Response(
      JSON.stringify({ 
        error: "Complete registration to apply to products", 
        redirectTo: `/registration/stage-${request.userProfile.currentStage}` 
      }), 
      { 
        status: 403, 
        headers: { "Content-Type": "application/json" } 
      }
    );
  }

  return null; // Continue to next middleware/handler
};
