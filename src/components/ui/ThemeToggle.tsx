
import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function ThemeToggle() {
  // Get system preference
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  
  // Initialize theme state from localStorage or system preference
  const [isDark, setIsDark] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme ? savedTheme === "dark" : prefersDark;
  });

  // Update document class and localStorage when theme changes
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="hover:bg-secondary transition-colors duration-300"
          aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
        >
          {isDark ? (
            <Sun className="h-5 w-5 text-tz-yellow" />
          ) : (
            <Moon className="h-5 w-5 text-accent" />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{isDark ? "Switch to light theme" : "Switch to dark theme"}</p>
      </TooltipContent>
    </Tooltip>
  );
}
