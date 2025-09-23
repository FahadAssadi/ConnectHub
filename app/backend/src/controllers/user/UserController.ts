import { db } from '@/db';
import { eq } from 'drizzle-orm';
import { nanoid } from 'nanoid';

import { userProfiles } from '@/db/schema/userProfile-schema';
import { companies } from '@/db/schema/company-schema';
import { bdPartners, individualBdPartners, companyBdPartners } from '@/db/schema/bd-partner-schema';

export class UserController {
  // User Profiles
  async getUserType(data: { userId: string }) {
    const { userId } = data;

    const result = await db
        .select({
            userType: userProfiles.userType,
            registrationStage: userProfiles.registrationStage
        })
        .from(userProfiles)
        .where(eq(userProfiles.userId, userId));

    if (result.length === 0) {
        return { error: 'User profile not found' };
    }

    return result[0];
  }

  async createUserProfile(data: { userId: string; userRole: string; userData: Record<string, any>;}) {
    const { userId, userRole, userData } = data;

    try {
        const [newProfile] = await db.insert(userProfiles).values({
            id: nanoid(),
            userId: userId,
            userType: userRole,
            registrationStage: 'initial',
        }).returning({ id: userProfiles.id });

        const profileId = newProfile.id;

        if (userRole === 'company') {
            const { companyName } = userData;

            await db.insert(companies).values({
                id: nanoid(),
                profileId: profileId,
                companyName: companyName,
            });
        } else if (userRole === 'bd-partner') {
            const { profileType } = userData;

            const [bdPartner] = await db.insert(bdPartners).values({
                id: nanoid(),
                profileId: profileId,
                profileType: profileType,
            }).returning({ id: bdPartners.id });

            const bdPartnerId = bdPartner.id;

            if (profileType === 'individual') {
                const { fullName } = userData;

                await db.insert(individualBdPartners).values({
                    id: nanoid(),
                    bdPartnerId: bdPartnerId,
                    fullName: fullName
                });
            } else if (profileType === 'company') {
                const { companyName } = userData;

                await db.insert(companyBdPartners).values({
                    id: nanoid(),
                    bdPartnerId: bdPartnerId,
                    companyName: companyName
                });
            }
        } else {
            throw new Error('Invalid user role');
        }

        return { success: true, profileId };
    } catch (error) {
        console.error('Error creating user profile:', error);
        return { error: 'Failed to create user profile' };
    }
  }
}
