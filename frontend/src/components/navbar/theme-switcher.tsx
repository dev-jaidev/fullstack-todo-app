"use client"

import * as React from "react"
import { MoonIcon, SunIcon } from "@radix-ui/react-icons"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"

export default function ThemeSwitcher() {
  const { setTheme, theme } = useTheme()

  return (

        <Button variant="outline" size="icon" onClick={() => setTheme(theme==="dark"?"light":"dark")} className="p-2 h-auto w-auto bg-transparent hover:bg-green-600 hover:text-white border-none rounded-xl">
          <SunIcon className="h-[1.7rem] w-[1.7rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <MoonIcon className="absolute h-[1.7rem] w-[1.7rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>

  )
}
