import { Hono } from 'hono'
import { UserController } from '@/controllers/user/UserController';

const userRouter = new Hono();
const userController = new UserController();

// get user profile by userId
userRouter.get('/:userId', async (c) => {
    const { userId } = c.req.param();
    
    try {
        const result = await userController.getUserType({ userId });
        return c.json(result);
    } catch (error) {
        return c.json({ error: 'Failed to fetch user profile' }, 500);
    }
});

export default userRouter;