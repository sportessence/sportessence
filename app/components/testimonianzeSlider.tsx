"use client";
import { useRef, useState, useEffect } from "react";

const testimonianze = [
  { name: "Valentina R.", text: "Esperienza super positiva, team qualificato e professionale." },
  { name: "Diana M.", text: "Organizzazione impeccabile e staff fantastico. I miei figli non vedono l’ora di tornare! L’attenzione al dettaglio è incredibile e ogni giorno tornavano con un sorriso." },
  { name: "Arianna C.", text: "Ottima gestione dei bambini, attività varie e sempre stimolanti." },
  { name: "Francesco P.", text: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quae, maiores nihil odio, reiciendis, modi molestias ullam ad quo blanditiis recusandae soluta dolore expedita iure animi alias harum. Quidem, libero optio." },
];

export default function TestimonianzeSlider() {
  const testimonianzeRef = useRef<HTMLDivElement>(null);
  const [testimonianzeIndex, setTestimonianzeIndex] = useState(0);
  const [testimonianzeScrollable, setTestimonianzeScrollable] = useState(false);

  const scrollToIndex = (i: number) => {
    const el = testimonianzeRef.current;
    if (!el) return;
    const cards = Array.from(el.children) as HTMLElement[];
    const card = cards[i];
    if (!card) return;
    el.scrollTo({ left: card.offsetLeft - (el.offsetWidth - card.offsetWidth) / 2, behavior: "smooth" });
  };

  const updateIndex = () => {
    const el = testimonianzeRef.current;
    if (!el) return;
    const cards = Array.from(el.children) as HTMLElement[];
    const center = el.scrollLeft + el.offsetWidth / 2;
    const i = cards.findIndex(card => center >= card.offsetLeft && center <= card.offsetLeft + card.offsetWidth);
    if (i !== -1) setTestimonianzeIndex(i);
  };

  useEffect(() => {
    const el = testimonianzeRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateIndex, { passive: true });
    updateIndex();
    return () => el.removeEventListener("scroll", updateIndex);
  }, []);

  useEffect(() => {
    const el = testimonianzeRef.current;
    if (!el) return;
    const checkScrollable = () => setTestimonianzeScrollable(el.scrollWidth > el.clientWidth);
    checkScrollable();
    window.addEventListener("resize", checkScrollable);
    return () => window.removeEventListener("resize", checkScrollable);
  }, []);

  return (
    <section className="py-16 px-6 bg-cream mx-auto max-w-7xl">
      <h2 className="text-3xl font-semibold text-center mb-8">Cosa Dicono di Noi</h2>

      {/* MOBILE: scroll orizzontale */}
      <div
        ref={testimonianzeRef}
        className="flex overflow-x-auto snap-x space-x-6 pb-4 scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] sm:hidden"
      >
        {testimonianze.map(({ name, text }) => (
          <div key={name} className="flex-shrink-0 w-[85vw] snap-center bg-white p-6 rounded-lg shadow-md flex flex-col justify-between">
            <p className="text-lg italic mb-4 leading-snug">{`"${text}"`}</p>
            <p className="font-semibold text-fox mt-auto">– {name}</p>
          </div>
        ))}
      </div>

      {/* DESKTOP: griglia */}
      <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonianze.map(({ name, text }) => (
          <div key={name} className="bg-white p-6 rounded-lg shadow-md flex flex-col justify-between">
            <p className="text-lg italic mb-4 leading-snug">{`"${text}"`}</p>
            <p className="font-semibold text-fox mt-auto">– {name}</p>
          </div>
        ))}
      </div>

      {/* PALLINI solo mobile */}
      {testimonianzeScrollable && (
        <div className="flex justify-center mt-6 space-x-2 md:hidden">
          {testimonianze.map((_, i) => (
            <span
              key={i}
              onClick={() => scrollToIndex(i)}
              className={`w-3 h-3 rounded-full transition-all duration-300 cursor-pointer ${i === testimonianzeIndex ? "bg-cyan-600 scale-110" : "bg-gray-300"}`}
            ></span>
          ))}
        </div>
      )}
    </section>
  );
}
