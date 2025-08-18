import { Hono } from 'hono'
import { cors } from 'hono/cors';

import apiRoutes from "./routes/api";

const app = new Hono()

app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:5000"],
  allowHeaders: ["Content-Type", "Authorization"],
  allowMethods: ["POST", "GET", "OPTIONS"],
  exposeHeaders: ["Content-Length"],
  maxAge: 600,
  credentials: true,
}));

app.get('/', (c) => c.text('ConnectHub API Server'))

// Mount API routes
app.route('/api', apiRoutes);

export default {
  port: process.env.PORT || 5000,
  fetch: app.fetch,
}
