import {
  Controller,
  Get,
  Request as NestRequest,
  BadRequestException,
} from '@nestjs/common';
import { UserProfileService } from '../services/user-profile.service.js';

/**
 * Controller for user profile management.
 * Handles profile registration and retrieval for different user types.
 */
@Controller('user-profile')
export class UserProfileController {
  constructor(private readonly userProfileService: UserProfileService) {}

  /**
   * Get the current user's profile with all nested data.
   * Requires authentication.
   *
   * @param req - Express request with user context
   * @returns The user profile with all related data
   * @throws BadRequestException if userId is not in request
   */
  @Get()
  async getUserProfile(@NestRequest() req: any) {
    const userId = req.user?.id;
    if (!userId) {
      throw new BadRequestException('User ID not found in request context');
    }
    return this.userProfileService.getUserProfile(userId);
  }

}
