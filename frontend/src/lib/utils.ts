import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { toast } from "sonner";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatSize(sizeInBytes: number) {
    const units = ["B", "KB", "MB", "GB", "TB"];

    let size = sizeInBytes;
    let unit = 0;

    while (size >= 1024 && unit < units.length - 1) {
        size /= 1024;
        unit++;
    }

    return `${size.toFixed(2)} ${units[unit]}`;
}

export function downloadBlob(
    blob: Blob | undefined,
    filename: string,
    ext: string,
) {
    if (!blob) return;

    try {
        const file = new File([blob], filename, { type: ext });
        const url = URL.createObjectURL(file);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    } catch (e) {
        toast.error("Failed to download file");
    }
}
