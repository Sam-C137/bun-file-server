import { createLazyFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button.tsx";
import { FileText, Upload } from "lucide-react";

export const Route = createLazyFileRoute("/")({
    component: Index,
});

function Index() {
    return (
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center space-y-4 text-center">
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                            Welcome to FileServer
                        </h1>
                        <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                            A simple file server to test AWS SDK for S3. Upload
                            your files and manage them with ease.
                        </p>
                    </div>
                    <div className="space-x-4">
                        <Link to="/upload">
                            <Button>
                                <Upload className="mr-2 h-4 w-4" />
                                Upload File
                            </Button>
                        </Link>
                        <Link to="/view">
                            <Button variant="outline">
                                <FileText className="mr-2 h-4 w-4" />
                                View Uploads
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
