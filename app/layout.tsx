import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Montserrat } from "next/font/google";
import "./globals.css";

import Navbar from "./components/navbar";
import Footer from "./components/footer";
import { createClient } from "./utils/supabase/server";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SportEssence",
  description: "Sito ufficiale di SportEssence",
};

// ✅ Tipo esplicito per il ruolo
type UserRole = "guest" | "user" | "admin";

// ✅ Funzione per determinare il ruolo utente
async function getUserRole(): Promise<UserRole> {
  try {
    const supabase = await createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return "guest";
    }

    const { data: adminRow } = await supabase
      .from('admins_whitelist')
      .select('id')
      .eq('id', user.id)
      .single();

    if (adminRow) {
      return "admin";
    }

    return "user";
  } catch (error) {
    console.error("Error getting user role:", error);
    return "guest";
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const initialRole = await getUserRole();

  return (
    <html lang="it">
      <body
        className={`${montserrat.className} bg-gray-50 min-h-screen flex flex-col`}
        suppressHydrationWarning={true}
      >
        <Navbar initialRole={initialRole} />

        <main className="flex-grow">{children}</main>

        <Footer />
      </body>
    </html>
  );
}