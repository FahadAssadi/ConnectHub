import { betterAuth } from "better-auth";
import { createAuthMiddleware } from "better-auth/api";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

import { db } from "@/db"; 
import * as schema from "@/db/schema/auth-schema";
import { UserController } from "@/controllers/user/UserController";

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
            const { role, ...userData } = body;

            const userController = new UserController();
            await userController.createUserProfile({
                userId: newSession.user.id,
                userRole: role,
                userData: userData
            });
        })
    }
});
