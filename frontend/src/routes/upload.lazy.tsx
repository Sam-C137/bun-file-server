import { createLazyFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { useState } from "react";
import { Loader2, Upload } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "@/lib/api.ts";

export const Route = createLazyFileRoute("/upload")({
    component: UploadPage,
});

function UploadPage() {
    const [file, setFile] = useState<File | null>(null);
    const [description, setDescription] = useState("");
    const client = useQueryClient();

    const mutation = useMutation({
        mutationFn: async () => {
            if (!file) return;
            const res = await api.upload.$post({
                form: {
                    file,
                    description,
                },
            });
            if (!res.ok) {
                throw new Error("Failed to upload file");
            }
            await client.invalidateQueries({
                queryKey: ["objects"],
            });
            return (await res.json()) as Promise<{
                imagePath: string;
            }>;
        },
        onSuccess: () => {
            setFile(null);
            setDescription("");
            toast.success("File uploaded successfully");
        },
        onError: () => {
            toast.error("Failed to upload file");
        },
    });

    function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
        if (event.target.files) {
            setFile(event.target.files[0]);
        }
    }

    function handleDescriptionChange(
        event: React.ChangeEvent<HTMLInputElement>,
    ) {
        setDescription(event.target.value);
    }

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!file) return;
        mutation.mutate();
    }

    return (
        <section className="container mx-auto px-4 py-8 max-w-[500px]">
            <h1 className="text-2xl font-bold mb-4">Upload File</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input type="file" onChange={handleFileChange} />
                <Input
                    type="text"
                    placeholder="Description (optional)"
                    value={description}
                    onChange={handleDescriptionChange}
                />
                <Button type="submit" disabled={!file || mutation.isPending}>
                    {mutation.isPending ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <Upload className="mr-2 h-4 w-4" />
                    )}
                    Upload to S3
                </Button>
            </form>
            <div className="mt-4">
                <h3 className="text-lg font-bold text-center mb-2">Preview</h3>
                {mutation.isSuccess ? (
                    <img
                        src={`/api/${mutation.data?.imagePath}`}
                        alt={file?.name}
                    />
                ) : null}
            </div>
        </section>
    );
}
