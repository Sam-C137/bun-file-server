import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { FileText, Github, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button.tsx";
import { Toaster } from "@/components/ui/sonner.tsx";

export const Route = createRootRoute({
    component: () => (
        <div className="flex flex-col min-h-screen">
            <NavBar />
            <hr />

            <main className="flex-1">
                <Outlet />
            </main>

            <Footer />
            <Toaster />
        </div>
    ),
});

function NavBar() {
    const { theme, setTheme } = useTheme();

    return (
        <header className="px-4 lg:px-6 h-14 flex items-center">
            <Link to="/" className="flex items-center justify-center">
                <FileText className="h-6 w-6" />
                <span className="ml-2 text-lg font-bold">FileServer</span>
            </Link>
            <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
                <Link
                    className="text-sm font-medium hover:underline underline-offset-4"
                    to="/"
                >
                    Home
                </Link>
                <Link
                    className="text-sm font-medium hover:underline underline-offset-4"
                    to="/upload"
                >
                    Upload
                </Link>
                <Link
                    className="text-sm font-medium hover:underline underline-offset-4"
                    to="/view"
                >
                    View Uploads
                </Link>
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                        setTheme(theme === "dark" ? "light" : "dark")
                    }
                >
                    {theme === "dark" ? (
                        <Sun className="size-4" />
                    ) : (
                        <Moon className="size-4" />
                    )}
                </Button>
            </nav>
        </header>
    );
}

function Footer() {
    return (
        <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
            <p className="text-xs text-gray-500 dark:text-gray-400">
                © 2024 FileServer. All rights reserved.
            </p>
            <nav className="sm:ml-auto flex gap-4 sm:gap-6">
                <Link
                    className="text-xs hover:underline underline-offset-4"
                    href="#"
                >
                    Terms of Service
                </Link>
                <Link
                    className="text-xs hover:underline underline-offset-4"
                    href="#"
                >
                    Privacy
                </Link>
                <a
                    className="text-xs hover:underline underline-offset-4"
                    href="https://github.com/Sam-C137/bun-file-server"
                >
                    <Github className="h-4 w-4" />
                </a>
            </nav>
        </footer>
    );
}
