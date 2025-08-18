import { cookies } from "next/headers";
import { Session } from "./auth-client";

const getServerSession = async (): Promise<typeof Session | null> => {
  try {
    const cookieHeader = (await cookies()).toString();

    const res = await fetch(`http://localhost:5000/api/auth/get-session`, {
      credentials: "include",
      headers: {
        Cookie: cookieHeader,
      },
    });

    return res.json();

  } catch (error) {
    console.error(error);
    return null;
  }
};

export default getServerSession;