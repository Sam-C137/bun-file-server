import { createLazyFileRoute } from "@tanstack/react-router";
import { FileText, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api.ts";
import { DownloadButton } from "./-components/download-button.tsx";
import { DeleteButton } from "./-components/delete-button.tsx";

export const Route = createLazyFileRoute("/view")({
    component: ViewUploadsPage,
});

function ViewUploadsPage() {
    const { data, isPending, error } = useQuery({
        queryKey: ["objects"],
        queryFn: async () => {
            const res = await api.images.$get();
            if (!res.ok) {
                throw new Error("Failed to fetch files");
            }

            return res.json();
        },
        staleTime: Infinity,
    });

    return (
        <section className="container mx-auto px-4 py-8 max-w-[500px]">
            <h1 className="text-2xl font-bold mb-4">View Uploads</h1>
            {isPending && (
                <div className="w-full h-24 grid place-items-center">
                    <Loader2 className="h-8 w-8 animate-spin" />
                </div>
            )}
            {error && (
                <p className="text-gray-500 text-center">{error.message}</p>
            )}
            <div className="space-y-4">
                {data &&
                    data.objects.map((file) => (
                        <div
                            key={file?.key}
                            className="flex flex-col gap-4 justify-between p-4 border rounded"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <FileText className="mr-2 h-4 w-4" />
                                    <span>{file?.metadata?.filename}</span>
                                </div>
                                <div className="space-x-2">
                                    <DownloadButton
                                        fileKey={file?.key}
                                        filename={
                                            file?.metadata?.filename || ""
                                        }
                                        ext={file?.metadata?.ext || ""}
                                    />
                                    <DeleteButton fileKey={file?.key} />
                                </div>
                            </div>
                            <img
                                src={`/api/${file?.imagePath}`}
                                alt={file?.metadata?.filename}
                                className="w-full max-h-[200px] object-cover rounded"
                            />
                        </div>
                    ))}
                {data && data.objects.length < 1 ? (
                    <p className="text-gray-500 text-center">
                        No uploads found
                    </p>
                ) : null}
            </div>
        </section>
    );
}
