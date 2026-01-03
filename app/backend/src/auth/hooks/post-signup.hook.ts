import { Injectable } from '@nestjs/common';
import { AfterHook, Hook } from '@thallesp/nestjs-better-auth';
import type { AuthHookContext } from '@thallesp/nestjs-better-auth';
import { UserProfileService } from '../services/user-profile.service.js';

/**
 * Hook that runs after a user successfully signs up via email/password or OAuth.
 * Creates an initial UserProfile with type=PENDING and status=DRAFT.
 *
 * This separates auth provisioning (Better Auth) from domain onboarding.
 * The user then completes their profile via the /registration endpoints.
 */
@Hook()
@Injectable()
export class PostSignupHook {
  constructor(private readonly userProfileService: UserProfileService) {}

  @AfterHook('/sign-up/email')
  async handleEmailSignup(ctx: AuthHookContext) {
    const userId = ctx.context.newSession?.user?.id;

    if (!userId) {
      // User should exist at this point in the hook chain
      return;
    }

    // Create initial profile for this user
    await this.userProfileService.createInitialProfile(userId);
  }

  @AfterHook('/sign-in/oauth')
  async handleOAuthSignup(ctx: AuthHookContext) {
    const userId = ctx.context.newSession?.user?.id;

    if (!userId) {
      return;
    }

    // Check if profile already exists (user may have signed in before)
    const existingProfile = await this.userProfileService.getUserProfile(userId);
    if (existingProfile) {
      return;
    }

    // Create initial profile for first-time OAuth user
    await this.userProfileService.createInitialProfile(userId);
  }
}
