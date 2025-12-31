"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { Menu, X, LogOut, ChevronDown } from "lucide-react";
import Image from "next/image";
import logo from "@/public/imgs/logo.png";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "../utils/supabase/client";

type UserRole = "guest" | "user" | "admin";

interface NavbarProps {
  initialRole: UserRole;
}

export default function Navbar({ initialRole }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [role, setRole] = useState<UserRole>(initialRole);
  const [isExtraOpen, setIsExtraOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const isCheckingRef = useRef(false);

  // Chiudi dropdown quando si clicca fuori
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsExtraOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const checkUser = async () => {
      if (isCheckingRef.current) return;
      isCheckingRef.current = true;

      try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          setRole("guest");
          return;
        }

        const { data: adminRow } = await supabase
          .from('admins_whitelist')
          .select('id')
          .eq('id', user.id)
          .single();

        const newRole = adminRow ? "admin" : "user";
        setRole(newRole);
      } finally {
        isCheckingRef.current = false;
      }
    };

    if (role === "guest") {
      checkUser();
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        setRole("guest");
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      
      if (typeof document !== 'undefined') {
        document.cookie.split(";").forEach((cookie) => {
          const cookieName = cookie.split("=")[0].trim();
          document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        });
      }
      
      setRole("guest");
      window.location.href = "/";
    } catch (err) {
      console.error("Errore logout:", err);
      window.location.href = "/";
    }
  };

  const navLinks: Record<UserRole, { name: string; href: string; isExtra?: boolean }[]> = {
    guest: [
      { name: "Home", href: "/" },
      { name: "Chi siamo", href: "/About" },
      { name: "Campi Estivi", href: "/Campi" },
      { name: "EXTRA", href: "#", isExtra: true },
      { name: "Info utili", href: "/Info" },
      { name: "Login", href: "/Login" },
      { name: "Registrazione", href: "/Registrazione" },
    ],
    user: [
      { name: "Home", href: "/" },
      { name: "Chi siamo", href: "/About" },
      { name: "Campi Estivi", href: "/Campi" },
      { name: "EXTRA", href: "#", isExtra: true },
      { name: "Info utili", href: "/Info" },
      { name: "Nuova Iscrizione", href: "/Iscrizione" },
      { name: "Pagina personale", href: "/Utente" },
    ],
    admin: [
      { name: "Dashboard", href: "/admin/Dashboard" },
      { name: "Campi Estivi", href: "/admin/Campi" },
      { name: "EXTRA", href: "#", isExtra: true },
      { name: "Pagamenti", href: "/admin/Pagamenti" },
    ],
  };

  return (
    <nav className="bg-blue-light fixed top-0 left-0 right-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto py-2 px-4 h-auto flex justify-between items-center">
        <Link 
          href={role === "admin" ? "/admin/Dashboard" : "/"} 
          className="flex items-center"
        >
          <Image 
            src={logo} 
            alt="SportEssence logo" 
            quality={100} 
            width={290} 
            height={150} 
            priority 
          />
        </Link>

        {/* Menu desktop */}
        <div className="hidden lg:flex flex-nowrap space-x-6 uppercase text-[clamp(14px,2vw,18px)] items-center">
          {navLinks[role].map((link) => {
            if (link.isExtra) {
              return (
                <div key={link.name} className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsExtraOpen(!isExtraOpen)}
                    className={`flex items-center gap-1 transition hover:underline hover:font-semibold hover:scale-110 ${
                      pathname === "/Psicomotricita" || pathname === "/LezioniCalcio"
                        ? "text-white underline underline-offset-4 decoration-2 font-bold scale-110"
                        : ""
                    }`}
                  >
                    {link.name}
                    <ChevronDown 
                      size={18} 
                      className={`transition-transform duration-200 ${isExtraOpen ? 'rotate-180' : ''}`}
                    />
                  </button>
                  
                  {isExtraOpen && (
                    <div className="absolute top-full left-0 mt-2 w-64 bg-blue-light rounded-lg shadow-2xl py-2 z-50 border border-white">
                      <Link
                        href="/Psicomotricita"
                        onClick={() => setIsExtraOpen(false)}
                        className={`block px-4 py-3 text-sm text-white hover:bg-blue-light hover:text-white transition-colors ${
                          pathname === "/Psicomotricita" ? "bg-blue-light text-white font-semibold" : ""
                        }`}
                      >
                        Psicomotricità negli Asili
                      </Link>
                      <Link
                        href="/LezioniCalcio"
                        onClick={() => setIsExtraOpen(false)}
                        className={`block px-4 py-3 text-sm text-gray-700 hover:bg-blue-light hover:text-white transition-colors ${
                          pathname === "/LezioniCalcio" ? "bg-blue-light text-white font-semibold" : ""
                        }`}
                      >
                        Lezioni Individuali di Calcio
                      </Link>
                    </div>
                  )}
                </div>
              );
            }

            return (
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
            );
          })}

          {role !== "guest" && (
            <button 
              onClick={handleLogout} 
              className="ml-4 text-white hover:text-red-400 transition"
              aria-label="Logout"
              title="Esci"
            >
              <LogOut size={20} />
            </button>
          )}
        </div>

        {/* Hamburger menu mobile */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden block transition-transform duration-200 hover:scale-110 p-2 rounded text-white"
          aria-label={isOpen ? "Chiudi menu" : "Apri menu"}
        >
          {isOpen ? <X size={30} /> : <Menu size={30} />}
        </button>
      </div>

      {/* Menu mobile */}
      {isOpen && (
        <div className="lg:hidden px-5 pb-3 space-y-2 bg-blue-light font-sans uppercase text-[16px]">
          {navLinks[role].map((link) => {
            if (link.isExtra) {
              return (
                <div key={link.name}>
                  <button
                    onClick={() => setIsExtraOpen(!isExtraOpen)}
                    className="w-full text-left flex items-center justify-between transition-transform duration-200 hover:scale-105 hover:underline hover:font-semibold"
                  >
                    <span>{link.name}</span>
                    <ChevronDown 
                      size={18} 
                      className={`transition-transform duration-200 ${isExtraOpen ? 'rotate-180' : ''}`}
                    />
                  </button>
                  
                  {isExtraOpen && (
                    <div className="ml-4 mt-2 space-y-2">
                      <Link
                        href="/Psicomotricita"
                        onClick={() => {
                          setIsExtraOpen(false);
                          setIsOpen(false);
                        }}
                        className={`block text-sm transition-transform duration-200 hover:scale-105 ${
                          pathname === "/Psicomotricita" ? "text-white font-bold underline" : ""
                        }`}
                      >
                        Psicomotricità negli Asili
                      </Link>
                      <Link
                        href="/LezioniCalcio"
                        onClick={() => {
                          setIsExtraOpen(false);
                          setIsOpen(false);
                        }}
                        className={`block text-sm transition-transform duration-200 hover:scale-105 ${
                          pathname === "/LezioniCalcio" ? "text-white font-bold underline" : ""
                        }`}
                      >
                        Lezioni Individuali di Calcio
                      </Link>
                    </div>
                  )}
                </div>
              );
            }

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
              className="flex items-center gap-2 mt-2 text-white hover:text-red-400 transition"
              aria-label="Logout"
            >
              <LogOut size={20} />
              <span>Esci</span>
            </button>
          )}
        </div>
      )}
    </nav>
  );
}