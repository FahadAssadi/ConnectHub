import { betterAuth } from "better-auth";
import { createAuthMiddleware } from "better-auth/api";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nanoid } from "nanoid";

import { db } from "../db"; 
import * as schema from "../db/schema/auth-schema";
import { userProfiles } from "../db/schema/userProfile-schema";
import { companies } from "../db/schema/company-schema";
import { bdPartners, individualBdPartners, companyBdPartners } from "../db/schema/bd-partner-schema";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
        schema,
    }),
    emailAndPassword: { enabled: true },
    socialProviders: {
        google: { 
            prompt: "select_account", 
            clientId: process.env.GOOGLE_CLIENT_ID as string, 
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, 
        }, 
    },
    hooks: {
        after: createAuthMiddleware(async (ctx) => {
            // This runs after every auth action (sign-in, sign-up, sign-out, etc.)
            // You can access the request and response objects via ctx.req and ctx.res
            // You can also access the user (if signed in) via ctx.user
            
            if (!ctx.path.startsWith("/sign-up")) {
                return; // Only handle sign-up events
            }

            const { body, context } = ctx
            const newSession = context.newSession;

            if (!(body && newSession)) {
                return;
            }
            
            // Add the user profile based on the role provided during sign-up
            const { role } = body;

            const [profile] = await db.insert(userProfiles).values({
                id: nanoid(),
                userId: newSession.user.id,
                userType: role,
            }).returning({ id: userProfiles.id })

            const profileId = profile.id;

            if (role === "company") {
                // Create a company profile
                const { companyName } = body;

                await db.insert(companies).values({
                    id: nanoid(),
                    profileId: profileId,
                    companyName: companyName,
                });
            } else if (role === "bd-partner") {
                // Handle BD partner profile creation
                const { profileType } = body; 

                const [bdPartner] = await db.insert(bdPartners).values({
                    id: nanoid(),
                    profileId: profileId,
                    profileType: profileType,
                }).returning({ id: bdPartners.id });

                const bdPartnerId = bdPartner.id;

                if (profileType === "individual") {
                    const { fullName } = body;

                    await db.insert(individualBdPartners).values({
                        id: nanoid(),
                        bdPartnerId: bdPartnerId,
                        fullName: fullName
                    });
                } else if (profileType === "company") {
                    const { companyName } = body;

                    await db.insert(companyBdPartners).values({
                        id: nanoid(),
                        bdPartnerId: bdPartnerId,
                        companyName: companyName
                    });
                }
            }
        })
    }
});
