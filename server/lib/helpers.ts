import { unlink } from "node:fs/promises";

export const IMAGE_SPLITTER = "$BFS$";

export function isFile(item: unknown): item is File {
    return item instanceof File;
}

export function stringifyError(error: unknown): string {
    return error instanceof Error ? error.message : JSON.stringify(error);
}

export function isWebStream<T>(data: unknown): data is ReadableStream<T> {
    return Boolean(data && typeof data === "object" && "getReader" in data);
}

export async function sleep(delay: number = 1000) {
    return new Promise((resolve) => setTimeout(resolve, delay));
}

export function scheduleDelete(path: string, waitPeriod = 1000 * 60 * 2) {
    setTimeout(async () => {
        try {
            await unlink(path);
            console.log(`Deleted file: ${path}`);
        } catch (e) {
            console.error(`Error deleting file: ${path}`, e);
        }
    }, waitPeriod);
}
