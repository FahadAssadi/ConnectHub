import { Hono } from 'hono'
import publicRouter from '@/routes/public/router';
import protectedRouter from '@/routes/protected/router';


const router = new Hono();

router.get("/health", (c) => c.text("OK"));
router.notFound((c) => c.text("Not Found", 404));

router.route("/protected", protectedRouter)
router.route("/public", publicRouter);

export default router;