import { z } from "zod";

export const UserSchema = z.object({
  id: z.uuid(),
  email: z.email(),
  name: z.string().min(1)
});

export type User = z.infer<typeof UserSchema>;
