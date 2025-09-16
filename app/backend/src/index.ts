import { Hono } from 'hono'
import routerAPI from './routes'
import { auth } from './lib/auth'
import { cors } from 'hono/cors'

const app = new Hono<{
	Variables: {
		user: typeof auth.$Infer.Session.user | null;
		session: typeof auth.$Infer.Session.session | null
	}
}>();

// Enable CORS for all routes
app.use(
  '*',
  cors({
    origin: 'http://localhost:3000', // or "*" for all
    allowHeaders: ['Content-Type', 'Authorization'],
    allowMethods: ['GET', 'POST', 'OPTIONS'],
    credentials: true,
  })
)

app.use("*", async (c, next) => {
	const session = await auth.api.getSession({ headers: c.req.raw.headers });

  	if (!session) {
    	c.set("user", null);
    	c.set("session", null);
    	return next();
  	}

  	c.set("user", session.user);
  	c.set("session", session.session);
  	return next();
});

app.on(["POST", "GET"], "/api/auth/*", (c) => {
	return auth.handler(c.req.raw);
});

app.route('/api', routerAPI);

export default { 
  port: 5000, 
  fetch: app.fetch, 
} 