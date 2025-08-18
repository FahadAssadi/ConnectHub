import { Hono } from "hono";
import { cors } from "hono/cors";
import { auth } from "../lib/auth";

// Import route modules
import registrationRoutes from "./registration/registration";
import productsRoutes from "./products";

const app = new Hono();

// CORS middleware
app.use("/*", cors({
  origin: ["http://localhost:3000"],
  credentials: true,
}));

// Auth routes (provided by better-auth)
app.mount("/auth", auth.handler);

// Registration routes
app.route("/registration", registrationRoutes);

// Products routes  
app.route("/products", productsRoutes);

// Health check
app.get("/health", (c) => {
  return c.json({ status: "ok", timestamp: new Date().toISOString() });
});

export default app;
