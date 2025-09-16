import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
    baseURL: process.env.API_URL
})

export const signInGoogle = async () => {
  const data = await authClient.signIn.social({
    provider: "google",
    callbackURL: "/dashboard", 
    /**
     * A URL to redirect if an error occurs during the sign in process
     */
    errorCallbackURL: "/error",
    /**
     * A URL to redirect if the user is newly registered
     */
    newUserCallbackURL: "/welcome",
    /**
     * disable the automatic redirect to the provider. 
     * @default false
     */
    disableRedirect: true,
  });

  console.log(data);
};

export const signUp = async (email: string, password: string, name: string, callbackURL = "/dashboard") => {
  const { data, error } = await authClient.signUp.email({
    email, // user email address
    password, // user password -> min 8 characters by default
    name, // user display name
    callbackURL // A URL to redirect to after the user verifies their email (optional)
  }, {
        onRequest: (ctx) => {
            //show loading
        },
        onSuccess: (ctx) => {
            //redirect to the dashboard or sign in page
        },
        onError: (ctx) => {
            // display the error message
            alert(ctx.error.message);
        },
  });
  return { data, error };
};

export const signIn = async (email: string, password: string, callbackURL = "/dashboard") => {
  const { data, error } = await authClient.signIn.email({
    email, // user email address
    password, // user password
    callbackURL // A URL to redirect to after successful sign in (optional)
  }, {
        onRequest: (ctx) => {
            //show loading
        },
        onSuccess: (ctx) => {
            //redirect to the dashboard
        },
        onError: (ctx) => {
            // display the error message
            alert(ctx.error.message);
        },
  });
  return { data, error };
}

export const getSession = async () => {
  const { data, error } = await authClient.getSession();
  return { data, error };
}