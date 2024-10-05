import { Hono } from "hono";
import { deleteObject, list, retrieve } from "../services/s3.ts";
import { IMAGE_SPLITTER, isWebStream } from "../lib/helpers.ts";
import { stream } from "hono/streaming";
import { Readable } from "stream";

export default new Hono()
    .get("/", async (c) => {
        const pageSize = Number(c.req.query("limit") || "10");
        const { success, error, objects } = await list(pageSize);

        if (!success || error || !objects) {
            return c.json({ error }, 500);
        }

        return c.json({
            objects: objects.map(([key, size]) => ({
                key,
                size,
                imagePath: `images/${key}`,
                metadata: {
                    filename: key.split(IMAGE_SPLITTER).pop(),
                    ext: key.split(".").pop(),
                    size,
                },
            })),
        });
    })
    .get("/:key", async (c) => {
        const key = c.req.param("key");
        const { data, success, contentType } = await retrieve(key);

        if (!success || !data) {
            return c.json(
                {
                    error: "Image not found",
                },
                404,
            );
        }

        c.header("Content-Type", contentType || "application/octet-stream");

        return stream(c, async (stream) => {
            for await (const chunk of s3Stream(data)) {
                await stream.write(chunk);
            }
        });
    })
    .delete("/:key", async (c) => {
        const key = c.req.param("key");
        const { success, error } = await deleteObject(key);

        if (!success || error) {
            return c.json({ error }, 500);
        }

        return c.json({ key });
    });

async function* s3Stream<T>(data: T): AsyncGenerator<Uint8Array> {
    if (data instanceof Readable) {
        for await (const chunk of data) {
            yield new Uint8Array(chunk);
        }
    } else if (isWebStream<Uint8Array>(data)) {
        const reader = data.getReader();
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            yield value;
        }
    } else if (data instanceof Blob) {
        const arrayBuffer = await data.arrayBuffer();
        yield new Uint8Array(arrayBuffer);
    } else {
        throw new Error("Unsupported data type for streaming");
    }
}
