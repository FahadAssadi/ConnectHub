import { Hono } from 'hono'
import { lovRouter } from '@/routes/public/lov/lovRouter';
import userRouter from '@/routes/public/user/userRouter';

const publicRouter = new Hono();

publicRouter.get("/health", (c) => c.text("OK"));
publicRouter.notFound((c) => c.text("Not Found", 404));

publicRouter.route("/lov", lovRouter)
publicRouter.route("/user", userRouter)

export default publicRouter;