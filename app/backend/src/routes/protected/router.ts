import { Hono } from 'hono'
import { auth } from '@/lib/auth'

const protectedRouter = new Hono<{
    Variables: {
        user: typeof auth.$Infer.Session.user | null;
        session: typeof auth.$Infer.Session.session | null
    }
}>()

// Protected middleware - checks for valid session
protectedRouter.use('*', async (c, next) => {
    const user = c.get('user')
    const session = c.get('session')

    // Check if user is authenticated
    if (!user || !session) {
        return c.json({ error: 'Unauthorized' }, 401)
    }

    // User is authenticated, proceed to next handler
    return next()
})



export default protectedRouter;