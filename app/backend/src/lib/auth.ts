import { betterAuth } from "better-auth";

import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db"; 

import { sendEmail } from "./email";
 
export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg", 
    }),
    secret: process.env.BETTER_AUTH_SECRET!,
    url: process.env.BETTER_AUTH_URL!,
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: true,
    },
    trustedOrigins: ["http://localhost:3000"],
    emailVerification: {
        autoSignInAfterVerification: true,
        sendVerificationEmail: async ( { user, url, token }, request) => {
          await sendEmail({
            to: user.email,
            subject: "Verify your email address",
            text: `Click the link to verify your email: ${url}`,
          });
        },
    }
});