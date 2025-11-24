import { Hono } from 'hono'
import { auth } from '@/lib/auth';

import { UserController } from '@/controllers/user/UserController';

const userController = new UserController();

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
        const result = await userController.getCompleteUserProfile({ userId: user.id });
        return c.json(result);
    } catch (error) {
        return c.json({ error: 'Failed to fetch user profile' }, 500);
    }
});

export default userInfoRouter;