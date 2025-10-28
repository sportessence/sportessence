"use client";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";

const attivita = [
  { title: "Sport e Movimento", img: "/sport.jpg", desc: "Giochi di squadra, tornei e tanto divertimento: ogni giorno si scopre qualcosa di nuovo in campo." },
  { title: "Creatività senza limiti", img: "/colori.jpg", desc: "Colori, musica e fantasia: mettiamo le mani in pasta e diamo forma alle idee più pazze." },
  { title: "Squadra e Amicizia", img: "/squadra.jpg", desc: "Lavorare insieme, aiutarsi e ridere tanto: la vera forza del camp è il gruppo." },
  { title: "Giochi e Sfide", img: "/arco.jpg", desc: "Caccia al tesoro, quiz, scacchi, mini-olimpiadi: ogni giorno una sfida diversa!" },
  { title: "Allenamento per la mente", img: "/scacchi.jpg", desc: "Non solo muscoli: alleniamo anche la concentrazione, la strategia e la fantasia." },
  { title: "Relax e Divertimento", img: "/provoHero.jpg", desc: "Momenti tranquilli per ricaricare le energie tra una partita e un laboratorio creativo." },
];

export default function AttivitaSlider() {
  const attivitaRef = useRef<HTMLDivElement>(null);
  const [attivitaIndex, setAttivitaIndex] = useState(0);
  const [attivitaScrollable, setAttivitaScrollable] = useState(false);

  function scrollToIndex(index: number) {
    const el = attivitaRef.current;
    if (!el) return;
    const cards = Array.from(el.children) as HTMLElement[];
    const card = cards[index];
    if (!card) return;
    el.scrollTo({ left: card.offsetLeft - (el.offsetWidth - card.offsetWidth) / 2, behavior: "smooth" });
  }

  function updateIndex() {
    const el = attivitaRef.current;
    if (!el) return;
    const cards = Array.from(el.children) as HTMLElement[];
    const center = el.scrollLeft + el.offsetWidth / 2;
    const i = cards.findIndex(card => center >= card.offsetLeft && center <= card.offsetLeft + card.offsetWidth);
    if (i !== -1) setAttivitaIndex(i);
  }

  useEffect(() => {
    const el = attivitaRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateIndex, { passive: true });
    updateIndex();
    return () => el.removeEventListener("scroll", updateIndex);
  }, []);

  useEffect(() => {
    const el = attivitaRef.current;
    if (!el) return;
    const checkScrollable = () => setAttivitaScrollable(el.scrollWidth > el.clientWidth);
    checkScrollable();
    window.addEventListener("resize", checkScrollable);
    return () => window.removeEventListener("resize", checkScrollable);
  }, []);

  return (
    <section className="py-16 px-6 mx-auto max-w-7xl">
      <h2 className="text-3xl font-semibold text-center mb-8">Le nostre attività</h2>

      <div
        ref={attivitaRef}
        className="flex overflow-x-auto snap-x space-x-6 pb-4 scroll-smooth
        sm:grid md:grid-cols-3 sm:grid-cols-2 sm:gap-5 sm:space-x-0 sm:overflow-visible
        [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        {attivita.map(item => (
          <div key={item.title} className="flex-shrink-0 w-[85vw] sm:w-72 md:w-auto snap-center bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow">
            <Image src={item.img} alt={item.title} width={500} height={300} className="w-full h-64 md:h-72 object-cover object-center" />
            <div className="p-6">
              <h3 className="text-xl text-blue-deep font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-700 mb-4">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {attivitaScrollable && (
        <div className="flex justify-center mt-6 space-x-2 md:hidden">
          {attivita.map((_, i) => (
            <span
              key={i}
              onClick={() => scrollToIndex(i)}
              className={`w-3 h-3 rounded-full transition-all duration-300 cursor-pointer ${i === attivitaIndex ? "bg-cyan-600 scale-110" : "bg-gray-300"}`}
            ></span>
          ))}
        </div>
      )}
    </section>
  );
}
