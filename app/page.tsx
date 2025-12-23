
import Image from "next/image";
import Link from "next/link";
import AttivitaSlider from "@/app/components/attivitaSlider";
import TestimonianzeSlider from "@/app/components/testimonianzeSlider";
import Hero from "@/public/imgs/immagineHome.jpeg";

export default function Home() {
  return (
    <main className="bg-cream text-blue-deep">
      {/* HERO */}
<section className="relative h-screen overflow-hidden">
        <Image
          src={Hero}
          alt="Bambini che giocano al campo estivo"
          fill
          priority
          className="object-cover object-center"
        />
    
      </section>

      {/* CHI SIAMO */}
      <section className="bg-cream py-16 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-start items-center gap-12">
          <div className="flex flex-col items-center md:items-start gap-4">
            <Image
              src="/imgs/logoNoSfondo.png"
              alt="Logo Azienda"
              width={900}
              height={900}
              className="object-contain w-100 sm:w-100 md:w-300 lg:w-200 min-w-[350px]"
            />
          </div>
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-bold mb-4 text-blue-deep">Chi Siamo</h2>
            <p className="text-gray-700 text-lg">
              Fondata nel XXXX, SPORTESSENCE si dedica a creare esperienze indimenticabili
              per bambini e ragazzi. Grazie alla nostra passione per lo sport, la creatività
              e il divertimento, ogni estate trasformiamo il gioco in apprendimento e amicizia.
            </p>
          </div>
        </div>
      </section>

      {/* MASCOTTE */}
      <section className="bg-blue-light py-16 px-6">
        <div className="flex flex-col md:flex-row items-center gap-12 max-w-7xl mx-auto">
          <div className="flex flex-col items-center gap-4">
            <Image
              src="/imgs/mascotte.png"
              alt="Mascotte FIRO"
              width={400}
              height={400}
              className="object-contain w-72 sm:w-80 md:w-96 lg:w-[400px] min-w-[200px]"
            />
          </div>
          <div className="text-center md:text-left flex flex-col justify-center">
            <h2 className="text-3xl font-bold mb-4 text-white">Ciao, sono FIRO!</h2>
            <p className="text-white text-lg">
              Sono FIRO, la mascotte ufficiale di SPORTESSENCE! 😄
              Ogni anno accompagno bambini e ragazzi nelle nostre attività,
              portando allegria, curiosità e tanto divertimento. Vieni a scoprire
              con me tutte le avventure che ti aspettano ai nostri campi estivi!
            </p>
          </div>
        </div>
      </section>

      {/* COMPONENTI CLIENT */}
      <AttivitaSlider />

         {/* STATISTICHE */}
      <section className="bg-blue-light py-16">
        <div className="mx-auto max-w-7xl px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {[{ label: "Statistica 1", value: "35" }, { label: "Statistica 2", value: "10.000+" }, { label: "Statistica 3", value: "50+" }, { label: "Statistica 4", value: "200+" }].map(({ label, value }) => (
            <div key={label} className="text-center">
              <p className="text-3xl font-bold text-white">{value}</p>
              <p className="text-lg font-bold text-blue-deep">{label}</p>
            </div>
          ))}
        </div>
      </section>


      <TestimonianzeSlider />

      {/* FAQ + CTA */}
      <section className="bg-cream py-16 px-6">
        <div className="max-w-7xl mx-auto text-center md:text-left grid md:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col justify-center items-center">
            <h2 className="text-3xl font-bold text-blue-deep mb-4">
              Hai domande? Abbiamo le risposte!
            </h2>
            <p className="text-blue-deep text-lg mb-4">
              Consulta le nostre domande più frequenti o scopri informazioni utili
              su iscrizioni, attività e sicurezza.
            </p>
            <ul className="text-blue-deep mb-4 list-disc list-inside space-y-2">
              <li><strong>Qual è l’età minima per partecipare?</strong> Dai 6 ai 21 anni.</li>
              <li><strong>È possibile iscriversi a metà estate?</strong> Sì, verifica i posti disponibili.</li>
              <li><strong>Serve il certificato medico?</strong> Sì, è obbligatorio per le attività sportive.</li>
              <li><strong>Ci sono sconti per fratelli?</strong> Certo, chiedi informazioni al momento dell’iscrizione.</li>
              <li><strong>Come posso contattarvi?</strong> Trovi tutto nella sezione “Contatti”.</li>
            </ul>
            <Link
              href="/faq"
              className="bg-cyan-600 text-white py-3 px-6 rounded-lg shadow-md 
                hover:-translate-y-1 hover:shadow-xl transition-all duration-300 ease-out"
            >
              Scopri tutte le FAQ
            </Link>
          </div>

          <div className="bg-blue-light p-8 rounded-lg text-white flex flex-col justify-center items-center">
            <h3 className="text-2xl font-semibold mb-4">Prenota il tuo posto oggi!</h3>
            <p className="mb-6 text-center">
              Non perdere l’occasione di vivere un’estate indimenticabile con SPORTESSENCE. Posti limitati!
            </p>
            <Link
              href="/iscrizione"
              className="bg-white text-blue-deep py-3 px-6 rounded-lg shadow-md 
                hover:-translate-y-1 hover:shadow-xl transition-all duration-300 ease-out"
            >
              Iscriviti Ora
            </Link>
          </div>
        </div>
      </section>

      {/* SPONSOR */}
      <section className="bg-blue-light py-12">
        <div className="px-6 text-center max-w-7xl mx-auto">
          <h2 className="text-3xl font-semibold mb-6">I nostri sponsor</h2>
          <div className="flex justify-center items-center gap-12 flex-wrap">
            {[{
              name: "Sponsor 1",
              img: "https://www.ascsport.it/wp-content/themes/asc_sport/images_new/ASC-Logo.svg",
              href: "https://www.ascsport.it"
            },{
              name: "Sponsor 2",
              img: "https://www.seristampa.promo/wp-content/uploads/2024/01/LOGO-header.png",
              href: "https://www.seristampa.promo"
            },{
              name: "Sponsor 3",
              img: "https://centrosp.it/wp-content/uploads/2021/12/CPS-Logo-Transparent.png",
              href: "https://centrosp.it"
            }].map((sponsor) => (
              <a
                key={sponsor.name}
                href={sponsor.href}
                target="_blank"
                className="inline-block transition-transform duration-300 hover:scale-110"
              >
                <Image
                  src={sponsor.img}
                  alt={sponsor.name}
                  width={200}
                  height={120}
                  className="object-contain"
                />
              </a>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

   
   
