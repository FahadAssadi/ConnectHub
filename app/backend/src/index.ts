import { Hono } from 'hono'
import { cors } from 'hono/cors';

import { auth } from "./lib/auth";
import route from "./routes/route";

const app = new Hono()

app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:5000"],
  allowHeaders: ["Content-Type", "Authorization"],
  allowMethods: ["POST", "GET", "OPTIONS"],
  exposeHeaders: ["Content-Length"],
  maxAge: 600,
  credentials: true,
}));

app.get('/', (c) => c.text('Hello Hono!'))

app.on(["POST", "GET"], "/api/auth/**", (c) => auth.handler(c.req.raw));

app.route('/api', route);

export default {
  port: process.env.PORT || 5000,
  fetch: app.fetch,
}
