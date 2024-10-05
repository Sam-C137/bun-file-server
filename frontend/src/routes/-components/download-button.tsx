import api from "@/lib/api.ts";
import { downloadBlob } from "@/lib/utils.ts";
import { Button } from "@/components/ui/button.tsx";
import { Download } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface DownloadButtonProps {
    fileKey: string;
    filename: string;
    ext: string;
}

export function DownloadButton({
    fileKey,
    filename,
    ext,
}: DownloadButtonProps) {
    const { data, isPending } = useQuery({
        queryKey: ["download", fileKey],
        queryFn: async () => {
            const res = await api.images[":key"].$get({
                param: { key: fileKey },
            });
            if (!res.ok) {
                throw new Error("Failed to download file");
            }

            return res.blob();
        },
        staleTime: Infinity,
    });

    return (
        <Button
            size="sm"
            variant="outline"
            disabled={isPending}
            onClick={() => {
                downloadBlob(data, filename, ext);
            }}
        >
            <Download className="mr-2 h-4 w-4" />
            Download
        </Button>
    );
}
