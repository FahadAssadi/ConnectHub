import {
    createAuthClient
} from "better-auth/react";

export const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000",
    basePath: "/api/auth",
    fetchOptions: {
        credentials: "include",
    },
})

export const {
    signIn,
    signOut,
    signUp,
    useSession
} = authClient;

export const Session = authClient.$Infer.Session;