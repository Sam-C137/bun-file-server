import { Button } from "@/components/ui/button.tsx";
import { Loader2, Trash } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api.ts";
import { toast } from "sonner";

interface DeleteButtonProps {
    fileKey: string;
}

export function DeleteButton({ fileKey }: DeleteButtonProps) {
    const client = useQueryClient();
    const mutation = useMutation({
        mutationFn: async () => {
            const res = await api.images[":key"].$delete({
                param: { key: fileKey },
            });
            if (!res.ok) {
                throw new Error("Failed to delete file");
            }
            await client.invalidateQueries({
                queryKey: ["objects"],
            });
            return res.json();
        },
        onSuccess() {
            toast("File deleted");
        },
        onError(error) {
            toast.error("Failed to delete file", {
                description: error.message,
            });
        },
    });

    return (
        <Button
            size="sm"
            variant="outline"
            className="text-red-500"
            onClick={() => mutation.mutate()}
        >
            {mutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
                <Trash className="mr-2 h-4 w-4" />
            )}
            Delete
        </Button>
    );
}
