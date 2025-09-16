import { Hono } from 'hono'

const router = new Hono();

router.get("/health", (c) => c.text("OK"));
router.notFound((c) => c.text("Not Found", 404));

export default router;