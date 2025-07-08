"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Switch } from "@/components/ui/switch"; // shadcn Switch

export default function ThemeSwitch() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Only run on client
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Render nothing until mounted
  if (!mounted) return null;

  const isDark = resolvedTheme === "dark";

  return (
    <Switch
      checked={isDark}
      onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
      size={"lg"}
      className="data-[state=checked]:bg-green-500"
      aria-label="Toggle theme"
    />
  );
}
