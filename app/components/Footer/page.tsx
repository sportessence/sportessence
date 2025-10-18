// components/Footer.tsx
"use client";

import { BiMailSend, BiPhone, BiLogoInstagram, BiLogoTiktok, BiLogoFacebook } from "react-icons/bi";

export default function Footer() {

  return (
    <footer className="flex justify-content-center bg-blue-light text-white font-semibold p-8 mt-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-20 gap-y-8">
        {/* Contatti */}
        <div className="gap-2 text-center md:text-left">
          <h5 className="font-bold uppercase mb-2">Contatti</h5>
          <ul className="text-sm space-y-1">
            <li className="flex items-center justify-center md:justify-start gap-2">
  <BiMailSend className="text-2xl flex-shrink-0" />
  Email:
  <a className="hover:underline hover:text-orange-500 underline" href="mailto:sportessence.asd.aps@gmail.com">
    sportessence.asd.aps@gmail.com
  </a>
</li>
<li className="flex items-center justify-center md:justify-start gap-2">
  <BiPhone className="text-2xl flex-shrink-0" />
  Telefono:
  <a className="hover:text-orange-500 underline" href="tel:3420394661">342_039_4661</a>
</li>
          </ul>
        </div>

        {/* Info legali */}
        <div className="gap-2 text-center">
          <h5 className="font-bold mb-2">SPORTESSENCE</h5>
          <ul className="text-sm space-y-1">
            <li><span>P.IVA: </span><span> Inserire partita iva</span></li>
            <li>Sede legale: Inserire sede legale</li>
            <li>Capitale Sociale: Inserire capitale sociale</li>
            <li>Identificativo azienda: tipo REA BG-123456</li>
          </ul>
        </div>

        {/* Social */}
        <div className="gap-2 text-center items-center lg:text-right mb-5">
          <h5 className="font-bold uppercase mb-2">Seguici sui social</h5>
          <div className="flex justify-center items-center lg:justify-end gap-8 text-3xl">
            <a href="https://www.instagram.com/sportessence_official" target="_blank" aria-label="Instagram" className="hover:text-orange-500 transition-colors">
              <BiLogoInstagram />
            </a>
            <a href="https://www.tiktok.com/@sportessence.asd.aps" target="_blank" aria-label="TikTok" className="hover:text-orange-500 transition-colors">
              <BiLogoTiktok />
            </a>
            <a href="https://www.facebook.com/p/Sportessence-61573637458447" target="_blank" aria-label="Facebook" className="hover:text-orange-500 transition-colors">
              <BiLogoFacebook />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
