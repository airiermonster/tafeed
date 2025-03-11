import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface LanguageSwitcherProps {
  language: "en" | "sw";
  setLanguage: (lang: "en" | "sw") => void;
}

export function LanguageSwitcher({ language, setLanguage }: LanguageSwitcherProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
          <Globe className="h-4 w-4" />
          <span className="sr-only">Switch language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem 
          onClick={() => setLanguage("en")}
          className={language === "en" ? "bg-muted" : ""}
        >
          English
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setLanguage("sw")}
          className={language === "sw" ? "bg-muted" : ""}
        >
          Kiswahili
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
