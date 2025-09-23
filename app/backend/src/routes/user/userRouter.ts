import { Hono } from 'hono'
import { db } from '../../db/index.js';
import { userProfiles } from '../../db/schema/userProfile-schema.js';
import { eq } from 'drizzle-orm';

const userRouter = new Hono();

// get user profile by userId
userRouter.get('/:userId', async (c) => {
    const { userId } = c.req.param();
    const result = await db
        .select({
            userType: userProfiles.userType,
            registrationStage: userProfiles.registrationStage
        })
        .from(userProfiles)
        .where(eq(userProfiles.userId, userId));

    if (result.length === 0) {
        return c.json({ error: 'User profile not found' }, 404);
    }

    return c.json(result[0]);
});

export { userRouter };