"use client";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import styles from "./theme-toggle.module.css";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  // Applique le thème à l'hydratation (SSR friendly)
  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const local = localStorage.getItem("theme");
      const system = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
      setTheme(
        local === "dark" || (!local && system === "dark") ? "dark" : "light"
      );
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.body.classList.add("transition-enabled");
    if (theme === "dark") {
      document.body.setAttribute("data-theme", "dark");
    } else {
      document.body.removeAttribute("data-theme");
    }
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", theme);
    }
    const t = setTimeout(() => {
      document.body.classList.remove("transition-enabled");
    }, 520);
    return () => clearTimeout(t);
  }, [theme, mounted]);

  const toggle = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  // On cache l’icône côté serveur pour éviter le “flicker”
  if (!mounted) return <span className={styles.themeToggle} />;

  return (
    <button
      className={styles.themeToggle}
      onClick={toggle}
      aria-label={
        theme === "dark" ? "Activer le mode clair" : "Activer le mode sombre"
      }
      title={theme === "dark" ? "Mode clair" : "Mode sombre"}
      type="button"
    >
      <span className={styles.iconWrapper}>
        {theme === "dark" ? (
          <Sun className={styles.icon} />
        ) : (
          <Moon className={styles.icon} />
        )}
      </span>
    </button>
  );
}
