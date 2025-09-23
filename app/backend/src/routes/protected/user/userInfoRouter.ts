import { Hono } from 'hono'
import { db } from '@/db';
import { eq } from 'drizzle-orm';
import { auth } from '@/lib/auth';

import { userProfiles } from '@/db/schema/userProfile-schema';


const userInfoRouter = new Hono<{
  Variables: {
    user: typeof auth.$Infer.Session.user | null;
    session: typeof auth.$Infer.Session.session | null
  }
}>()

userInfoRouter.get('/', async (c) => {
    const user = c.get('user');

    if (!user) {
        return c.json({ error: 'Unauthorized' }, 401);
    }

    try {