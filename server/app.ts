import { Hono } from "hono";
import { logger } from "hono/logger";
import { serveStatic } from "hono/bun";
import upload from "./routes/upload.ts";
import images from "./routes/images.ts";

const app = new Hono();

app.use("*", logger());

const apiRoutes = app
    .basePath("/api")
    .route(
        "/",
        new Hono().get("/", (c) => {
            return c.json({
                message: "good to go",
            });
        }),
    )
    .route("/upload", upload)
    .route("/images", images);

app.get("*", serveStatic({ root: "./frontend/dist" }));
app.get("*", serveStatic({ path: "./frontend/dist/index.html" }));

export default app;
export type ApiRoutes = typeof apiRoutes;
