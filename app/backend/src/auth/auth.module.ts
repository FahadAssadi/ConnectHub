import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module.js';
import { UserProfileService } from './services/user-profile.service.js';
import { PostSignupHook } from './hooks/post-signup.hook.js';
import { RegistrationController } from './controllers/registration.controller.js';

/**
 * AuthModule provides authentication and user profile management.
 * - UserProfileService: manages user profile creation and queries
 * - PostSignupHook: automatically creates initial profiles on signup
 * - RegistrationController: handles profile completion endpoints
 */
@Module({
  imports: [DatabaseModule],
  controllers: [RegistrationController],
  providers: [UserProfileService, PostSignupHook],
  exports: [UserProfileService],
})
export class AppAuthModule {}
