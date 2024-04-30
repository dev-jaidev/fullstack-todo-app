"use client";
import { RecoilRoot } from "recoil";
import { ThemeProvider } from "./components/theme-provider";
import { ReactNode } from "react";

export default function Providers({ children }: { children: React.ReactNode }){
    return (
        <RecoilRoot>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                {children}
            </ThemeProvider>
        </RecoilRoot>
    );
}