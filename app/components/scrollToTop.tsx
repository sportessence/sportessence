"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Componente che riporta lo scroll in cima alla pagina
 * ogni volta che si cambia route
 */
export default function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    // Scroll to top quando cambia il percorso
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant" as ScrollBehavior,
    });
  }, [pathname]);

  return null;
}