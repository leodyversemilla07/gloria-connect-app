"use client"

import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import * as React from "react"

export function ThemeToggle() {
  const { setTheme } = useTheme()

  const onToggle = React.useCallback(() => {
    const isDark = document.documentElement.classList.contains("dark")
    setTheme(isDark ? "light" : "dark")
  }, [setTheme])

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Toggle theme"
      onClick={onToggle}
      className="focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-colors hover:bg-accent active:bg-accent/70 rounded-full"
    >
      {/* Avoid rendering conditionally on theme to prevent hydration mismatches */}
      <Sun className="hidden h-5 w-5 text-foreground dark:block" />
      <Moon className="block h-5 w-5 text-muted-foreground dark:hidden" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
