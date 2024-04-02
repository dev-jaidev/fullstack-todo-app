"use client";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { forwardRef } from "react";

const ThemeSwitcher = forwardRef((props, ref) => {
    const { setTheme, theme } = useTheme();

    return (
        <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 h-auto w-auto bg-transparent hover:bg-green-600 hover:text-white border-none rounded-xl"
        >
            <SunIcon className="h-[1.7rem] w-[1.7rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <MoonIcon className="absolute sm:h-[1.7rem] sm:w-[1.7rem] h-[1.5rem] w-[1.5rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
        </Button>
    );
});

ThemeSwitcher.displayName = "ThemeSwitcher";

export default ThemeSwitcher;
