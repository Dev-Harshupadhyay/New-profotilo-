import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

const ThemeToggle = () => {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-10 h-10" />;
  }

  return (
    <Button
      variant="quiet"
      size="icon-lg"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="[&_svg]:size-5 transition-all group"
    >
      {theme === "dark" ? (
        <Sun className="h-5 w-5 transition-all duration-300 rotate-0 text-foreground/70 group-hover:text-foreground" />
      ) : (
        <Moon className="h-5 w-5 transition-all duration-300 rotate-0 text-foreground/70 group-hover:text-foreground" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};

export default ThemeToggle;
