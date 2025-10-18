"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import Cookies from "js-cookie";
import Image from "next/image";
import logo from "@/public/logo.png";
import { usePathname } from "next/navigation"; 

type UserRole = "guest" | "user" | "admin";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [role, setRole] = useState<UserRole>("guest");
  const pathname = usePathname(); 

  useEffect(() => {
    const cookieRole = Cookies.get("role") as UserRole;
    setRole(cookieRole || "guest");
  }, []);

  const navLinks: Record<UserRole, { name: string; href: string }[]> = {
    guest: [
      { name: "Su di noi", href: "/About" },
      { name: "Campi scuola", href: "/Campi" },
      { name: "Info utili", href: "/Info" },
      { name: "Login", href: "/Login" },
      { name: "Registrazione", href: "/Registrazione" },
    ],
    user: [
      { name: "Su di noi", href: "/About" },
      { name: "Info utili", href: "/Info" },
      { name: "Campi scuola", href: "/Campi" },
      { name: "Nuova Iscrizione", href: "/Iscrizione" },
      { name: "Pagina personale", href: "/Profilo" },
    ],
    admin: [
      { name: "Campi scuola", href: "/Campi" },
      { name: "Statistiche", href: "/Statistiche" },
      { name: "Pagamenti", href: "/Pagamenti" },
    ],
  };

  return (
    <nav className="bg-blue-light">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-auto">
          {/* Logo cliccabile */}
          <Link href="/" className="flex items-center shrink-0">
            <Image
              src={logo}
              alt="SportEssence logo"
              quality={100}
              width={290}
              height={150}
              priority
            />
          </Link>

          {/* Desktop menu */}
          <div className="hidden md:flex space-x-6 uppercase text-[15px]">
            {navLinks[role].map((link) => {
              const isActive =
                pathname?.toLowerCase() === link.href.toLowerCase(); 
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`transition hover:underline hover:font-semibold hover:scale-110 ${
                    isActive
                      ? "text-white underline underline-offset-4 decoration-2 font-bold scale-110"
                      : ""
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Mobile button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden block transition-transform duration-200 hover:scale-130 p-2 rounded text-white"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden px-5 pb-3 space-y-2 bg-blue-light font-sans uppercase text-[14px]">
          {navLinks[role].map((link) => {
            const isActive =
              pathname?.toLowerCase() === link.href.toLowerCase();
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
        </div>
      )}
    </nav>
  );
}
