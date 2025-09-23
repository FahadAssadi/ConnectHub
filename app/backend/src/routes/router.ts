import { Hono } from 'hono'
import { metaRoute as lovRouter } from './lov/index.js';
import { userRouter } from './user/userRouter.js';

const router = new Hono();

router.get("/health", (c) => c.text("OK"));
router.notFound((c) => c.text("Not Found", 404));

router.route("/lov", lovRouter)
router.route("/user", userRouter)

export default router;