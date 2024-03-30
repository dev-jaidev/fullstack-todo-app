import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Nav from "@/components/navbar/nav";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
    title: "MY TODO",
    description:
        "A to-do list app with a focus on productivity and simplicity.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className="font-mono min-h-screen dark:bg-black">
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                >
                    <div className="w-full min-h-screen flex justify-center">
                        <main className="min-h-screen container">
                            {children}
                            <Toaster/>
                        </main>
                    </div>
                    <footer>
                        <Nav />
                    </footer>
                </ThemeProvider>
            </body>
        </html>
    );
}
