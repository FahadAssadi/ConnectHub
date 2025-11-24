import { Hono } from 'hono'
import { auth } from '@/lib/auth'

import userInfoRouter from '@/routes/protected/userInfoRouter';
import { productRouter } from '@/routes/protected/productRouter';
import { relationshipRouter } from '@/routes/protected/relationshipRouter';

const protectedRouter = new Hono<{
    Variables: {
        user: typeof auth.$Infer.Session.user | null;
        session: typeof auth.$Infer.Session.session | null
    }
}>()

// First, parse the session from cookies/headers
protectedRouter.use('*', async (c, next) => {
    // Better Auth will parse the session from cookies and set it in context
    const session = await auth.api.getSession({
        headers: c.req.raw.headers,
    });

    if (session) {
        c.set('user', session.user);
        c.set('session', session.session);
    } else {
        c.set('user', null);
        c.set('session', null);
    }

    return next();
});

// Then, check if user is authenticated for protected routes
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

protectedRouter.route("/user", userInfoRouter);
protectedRouter.route("/products", productRouter);
protectedRouter.route("/relationship", relationshipRouter);

export default protectedRouter;