import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export function ThemeSelect() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // The server cannot know a saved browser preference. Keep the initial
  // control identical during hydration; the provider paints the theme first.
  useEffect(() => setMounted(true), []);

  return (
    <label>
      <span className="sr-only">Color theme</span>
      <select
        className="theme-select"
        value={mounted ? theme : "system"}
        disabled={!mounted}
        onChange={(event) => setTheme(event.target.value)}
      >
        <option value="system">System</option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </label>
  );
}
