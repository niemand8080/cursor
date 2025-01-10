"use client"

import React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"

export function ModeToggle() {
  const { setTheme, resolvedTheme } = useTheme()

  const changeTheme = () => resolvedTheme == "dark" ? setTheme("light") : setTheme("dark");

  return (
    <button className={cn("p-2 rounded-md items-center inline-flex")} onClick={changeTheme}>
      <Sun className={cn(`h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0`)} />
      <Moon className={cn(`absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100`)} />
      <span className="sr-only">Toggle theme</span>
    </button>
  )
}
