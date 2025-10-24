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

//////OCCHio CHE FAI CHIAMATA API SENZA CHE CI SIA UN CAZZO DA CHIAMARE
useEffect(() => {
  fetch("/api/user/role", { credentials: "include" })
    .then(res => res.json())
    .then(data => setRole(data.role))
    .catch(() => setRole("guest"));
}, []);

  const navLinks: Record<UserRole, { name: string; href: string }[]> = {
    guest: [
      { name: "Chi siamo", href: "/About" },
      { name: "Campi Estivi", href: "/Campi" },
      { name: "Info utili", href: "/Info" },
      { name: "Login", href: "/Login" },
      { name: "Registrazione", href: "/Registrazione" },
    ],
    user: [
      { name: "Chi siamo", href: "/About" },
      { name: "Info utili", href: "/Info" },
      { name: "Campi Estivi", href: "/Campi" },
      { name: "Nuova Iscrizione", href: "/Iscrizione" },
      { name: "Pagina personale", href: "/Profilo" },
    ],
    admin: [
      { name: "Chi siamo", href: "/About" },
      { name: "Campi Estivi", href: "/Campi" },
      { name: "Statistiche", href: "/Statistiche" },
      { name: "Pagamenti", href: "/Pagamenti" },
    ],
  };

  return (
    <nav className="bg-blue-light">
      <div className="max-w-7xl mx-auto py-2 px-4 h-auto">
        <div className="flex justify-between items-center">
          {/* Logo cliccabile */}
          <Link href="/" className="flex items-center">
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
          <div className="hidden md:flex space-x-6 uppercase text-[18px]">
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
            {isOpen ? <X size={30} /> : <Menu size={30} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden px-5 pb-3 space-y-2 bg-blue-light font-sans uppercase text-[16px]">
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
