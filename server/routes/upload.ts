import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import path from "node:path";
import { upload } from "../services/s3.ts";
import {
    IMAGE_SPLITTER,
    isFile,
    scheduleDelete,
    sleep,
} from "../lib/helpers.ts";

const RETRY_ATTEMPTS = 3;

const uploadSchema = z.object({
    file: z.instanceof(File).optional(),
    description: z.string().optional(),
});

export default new Hono().post(
    "/",
    zValidator("form", uploadSchema),
    async (c) => {
        const body = await c.req.formData();
        const file = body.get("file");

        if (!isFile(file)) {
            return c.json({ error: "No file uploaded" }, 400);
        }

        const filePath = path.join(
            __dirname,
            "../files",
            `${Date.now()}${IMAGE_SPLITTER}${file.name}`,
        );

        try {
            await Bun.write(filePath, file);
            for (let attempt = 0; attempt < RETRY_ATTEMPTS; attempt++) {
                const { success, objectUrl, signedUrl, key, error } =
                    await upload(file);

                if (success) {
                    scheduleDelete(filePath);
                    return c.json({
                        success: "file uploaded",
                        objectUrl,
                        signedUrl,
                        imagePath: `images/${key}`,
                    });
                }

                console.error(`Upload attempt ${attempt + 1} failed:`, error);
                if (attempt === RETRY_ATTEMPTS - 1) {
                    console.error(
                        `Failed to upload file after ${RETRY_ATTEMPTS} attempts.`,
                    );
                }

                await sleep();
            }
        } catch (e) {
            console.error(e);
            return c.json({ error: "Error uploading file" }, 500);
        }
    },
);
