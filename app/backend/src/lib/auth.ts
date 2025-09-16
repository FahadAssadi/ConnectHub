import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db"; 
import * as schema from "../db/schema/auth-schema";
import { userProfiles } from "../db/schema/userProfile-schema";
import { nanoid } from "nanoid";

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
    events: {
        // <-- Called whenever a new user signs up
        async onUserCreated({ user, context }: { user: { id: string }, context?: { role?: string } }) {
            const role = context?.role || "company"; // role passed from frontend
            const profileId = nanoid().toString();

            await db.insert(userProfiles).values({
                id: profileId,
                userId: user.id,
                userType: role, // company or bd_partner
                registrationStage: "initial",
            });
        },
    },
});