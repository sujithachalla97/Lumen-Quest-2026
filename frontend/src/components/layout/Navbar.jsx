import { useState } from "react";
import { Sun, Moon, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark");
    setDarkMode(!darkMode);
  };

  return (
    <header className="h-14 w-full bg-white dark:bg-gray-900 shadow flex items-center justify-between px-6">
      <div className="font-semibold text-lg">Welcome Admin</div>
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="rounded-full"
        >
          {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>

        <div className="flex items-center gap-2">
          <User className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          <span className="text-sm font-medium">Admin</span>
        </div>

        <Button variant="destructive" size="sm">
          <LogOut className="h-4 w-4 mr-1" /> Logout
        </Button>
      </div>
    </header>
  );
}
