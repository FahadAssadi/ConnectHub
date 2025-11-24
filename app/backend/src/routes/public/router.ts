import { Hono } from 'hono'
import { lovRouter } from '@/routes/public/lovRouter';
import userRouter from '@/routes/public/userRouter';
import { productRouter } from '@/routes/public/productRouter';

export const publicRouter = new Hono();

publicRouter.get("/health", (c) => c.text("OK"));
publicRouter.notFound((c) => c.text("Not Found", 404));

publicRouter.route("/lov", lovRouter)
publicRouter.route("/user", userRouter)
publicRouter.route("/products", productRouter);