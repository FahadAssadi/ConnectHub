import { Hono } from "hono";

const normalRouter = new Hono();

normalRouter.get("/", (c) => {
    return c.json({ message: "This is non-protected content" });
});

export default normalRouter;