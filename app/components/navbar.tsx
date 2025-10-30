"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X, LogOut } from "lucide-react";
import Image from "next/image";
import logo from "@/public/imgs/logo.png";
import { usePathname, useRouter } from "next/navigation";

type UserRole = "guest" | "user" | "admin";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [role, setRole] = useState<UserRole>("guest");
  const pathname = usePathname();
  const router = useRouter();

  // Fetch ruolo da server
  const fetchRole = async () => {
    try {
      const res = await fetch("/api/user/cookies", { credentials: "include" });
      const data = await res.json();
      setRole(data.role as UserRole);
    } catch {
      setRole("guest");
    }
  };

  useEffect(() => {
    fetchRole();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/user/cookies", { method: "POST", credentials: "include" });
      setRole("guest"); // aggiorna stato a guest
      router.push("/"); // torna alla home
    } catch (err) {
      console.error("Errore logout:", err);
    }
  };

  const navLinks: Record<UserRole, { name: string; href: string }[]> = {
    guest: [
      { name: "Home", href: "/" },
      { name: "Chi siamo", href: "/About" },
      { name: "Campi Estivi", href: "/Campi" },
      { name: "Info utili", href: "/Info" },
      { name: "Login", href: "/Login" },
      { name: "Registrazione", href: "/Registrazione" },
    ],
    user: [
      { name: "Home", href: "/" },
      { name: "Chi siamo", href: "/About" },
      { name: "Info utili", href: "/Info" },
      { name: "Campi Estivi", href: "/Campi" },
      { name: "Nuova Iscrizione", href: "/Iscrizione" },
      { name: "Pagina personale", href: "/Utente" },
    ],
    admin: [
      { name: "Home", href: "/" },
      { name: "Chi siamo", href: "/About" },
      { name: "Campi Estivi", href: "/Campi" },
      { name: "Statistiche", href: "/Statistiche" },
      { name: "Pagamenti", href: "/Pagamenti" },
    ],
  };

  return (
    <nav className="bg-blue-light">
      <div className="max-w-7xl mx-auto py-2 px-4 h-auto flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <Image src={logo} alt="SportEssence logo" quality={100} width={290} height={150} priority />
        </Link>

        {/* Menu desktop */}
        <div className="hidden lg:flex flex-nowrap space-x-6 uppercase text-[clamp(14px,2vw,18px)] items-center">
          {navLinks[role].map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`transition hover:underline hover:font-semibold hover:scale-110 ${
                pathname?.toLowerCase() === link.href.toLowerCase()
                  ? "text-white underline underline-offset-4 decoration-2 font-bold scale-110"
                  : ""
              }`}
            >
              {link.name}
            </Link>
          ))}

          {role !== "guest" && (
            <button onClick={handleLogout} className="ml-4 text-white hover:text-red-400 transition">
              <LogOut size={20} />
            </button>
          )}
        </div>

        {/* Hamburger menu mobile */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden block transition-transform duration-200 hover:scale-110 p-2 rounded text-white"
        >
          {isOpen ? <X size={30} /> : <Menu size={30} />}
        </button>
      </div>

      {/* Menu mobile */}
      {isOpen && (
        <div className="lg:hidden px-5 pb-3 space-y-2 bg-blue-light font-sans uppercase text-[16px]">
          {navLinks[role].map((link) => {
            const isActive = pathname?.toLowerCase() === link.href.toLowerCase();
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`block transition-transform duration-200 hover:scale-105 hover:underline hover:font-semibold ${
                  isActive ? "text-white font-bold underline underline-offset-4 decoration-2" : ""
                }`}
              >
                {link.name}
              </Link>
            );
          })}

          {role !== "guest" && (
            <button
              onClick={() => {
                handleLogout();
                setIsOpen(false);
              }}
              className="block mt-2 text-white hover:text-red-400 transition"
            >
              <LogOut size={20} />
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
