"use client";
import * as Dialog from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"; // <-- AJOUTÉ
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import { Menu, X } from "lucide-react";
import styles from "./header.module.css";
import { useState, useRef, useEffect } from "react";

const links = [
  { href: "/", label: "Accueil" },
  { href: "/certifications", label: "Certifications" },
  { href: "/materiel", label: "Matériel de travail" },
  { href: "/outils", label: "Outils de travail" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/contact", label: "Contact" },
  { href: "/pacman", label: "Coin détente!", external: true },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [entering, setEntering] = useState(false);
  const closingTimeout = useRef<NodeJS.Timeout | null>(null);

  // Animation d’entrée fluide
  useEffect(() => {
    if (open && !closing) {
      setEntering(true);
      const t = setTimeout(() => setEntering(false), 20);
      return () => clearTimeout(t);
    }
  }, [open, closing]);

  // Animation de fermeture fluide
  const handleOpen = () => {
    setOpen(true);
    setClosing(false);
    if (closingTimeout.current) clearTimeout(closingTimeout.current);
  };

  const handleClose = () => {
    setClosing(true);
    closingTimeout.current = setTimeout(() => {
      setOpen(false);
      setClosing(false);
    }, 340);
  };

  return (
    <header className={styles.cover}>
      <nav className={styles.nav}>
        <ThemeToggle />
        <Dialog.Root open={open}>
          <Dialog.Trigger asChild>
            <button
              className={styles.burger}
              aria-label="Ouvrir le menu"
              aria-haspopup="dialog"
              aria-controls="header-menu"
              aria-expanded={open}
              onClick={handleOpen}
            >
              <Menu size={38} />
            </button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className={styles.overlay} onClick={handleClose} />
            <Dialog.Content
              className={`${styles.menuContainer} ${
                entering ? styles.menuEnter : ""
              } ${closing ? styles.menuExit : ""}`}
              id="header-menu"
              onPointerDownOutside={handleClose}
              onEscapeKeyDown={handleClose}
            >
              {/* Titre accessible (invisible) pour a11y */}
              <Dialog.Title asChild>
                <VisuallyHidden>Menu principal</VisuallyHidden>
              </Dialog.Title>

              <Dialog.Close asChild>
                <button
                  className={styles.close}
                  aria-label="Fermer le menu"
                  onClick={handleClose}
                >
                  <X size={36} />
                </button>
              </Dialog.Close>
              <ul className={styles.menu}>
                {links.map((l) =>
                  l.external ? (
                    <li key={l.href}>
                      <a
                        href={l.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={handleClose}
                      >
                        {l.label}
                      </a>
                    </li>
                  ) : (
                    <li key={l.href}>
                      <Link href={l.href} onClick={handleClose}>
                        {l.label}
                      </Link>
                    </li>
                  )
                )}
              </ul>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </nav>
    </header>
  );
}
