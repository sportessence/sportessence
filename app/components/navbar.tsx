"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { Menu, X, LogOut } from "lucide-react";
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
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  
  const isCheckingRef = useRef(false);

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
      // ✅ 1. Logout da Supabase
      await supabase.auth.signOut();
      
      // ✅ 2. Pulisci tutti i cookie manualmente (backup)
      // Questo garantisce che anche cookie residui vengano rimossi
      if (typeof document !== 'undefined') {
        document.cookie.split(";").forEach((cookie) => {
          const cookieName = cookie.split("=")[0].trim();
          // Rimuovi il cookie settandolo con data passata
          document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        });
      }
      
      // ✅ 3. Aggiorna stato locale
      setRole("guest");
      
      // ✅ 4. Hard reload per pulire tutto
      window.location.href = "/";
    } catch (err) {
      console.error("Errore logout:", err);
      // ✅ Anche in caso di errore, forza il reload
      window.location.href = "/";
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
      { name: "Dashboard", href: "/admin/Dashboard" },
      { name: "Campi Estivi", href: "/admin/Campi" },
      { name: "Pagamenti", href: "/admin/Pagamenti" },
    ],
  };

  return (
    <nav className="bg-blue-light">
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