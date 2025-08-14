import { Hono } from "hono";
import normalRoute from "./normal.route";
import protectedRoute from "./protected.route";

const route = new Hono();

route.route("/normal", normalRoute);
route.route("/protected", protectedRoute);

export default route;