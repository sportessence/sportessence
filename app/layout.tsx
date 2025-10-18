import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Montserrat } from "next/font/google";
import "./globals.css";

// 👇 importa la tua Navbar
import Navbar from "./components/Navbar/page";  
import Footer from "./components/Footer/page";  

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it">
      <body
        className={`${montserrat.className} bg-gray-50 min-h-screen flex flex-col`}
      >
        {/* ✅ Navbar visibile in tutte le pagine */}
        <Navbar />

        {/* Contenuto dinamico della pagina */}
        <main className="flex-grow">{children}</main>

                {/* ✅ Footer visibile in tutte le pagine */}
        <Footer />
      </body>
    </html>
  );
}
