import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Nav from "@/components/navbar/nav";
import { Toaster } from "@/components/ui/sonner";
import { RecoilRoot } from "recoil";
import Providers from "@/providers";

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
                <Providers>
                    <div className="w-full min-h-screen flex justify-center">
                        <main className="min-h-screen w-full px-2 sm:container">
                            {children}
                            <Toaster />
                        </main>
                    </div>
                    <footer>
                        <Nav />
                    </footer>
                    </Providers>
            </body>
        </html>
    );
}
