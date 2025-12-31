import Image from "next/image";
import Link from "next/link";
import { BiMailSend } from "react-icons/bi";

export default function Psicomotricita() {
  return (
    <main className="bg-cream text-blue-deep">
      {/* HERO */}
      <section className="relative h-[60vh] overflow-hidden">
        <Image
          src="/imgs/psicomotricita-hero.jpg"
          alt="Bambini durante attività di psicomotricità"
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/60 flex items-center justify-center">
          <div className="text-center text-white px-6 md:px-12 max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Psicomotricità negli Asili
            </h1>
            <p className="text-lg md:text-xl mb-6">
              Sviluppo motorio e cognitivo attraverso il gioco per i più piccoli
            </p>
          </div>
        </div>
      </section>

      {/* INTRODUZIONE */}
      <section className="py-16 px-6 max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <h2 className="text-3xl font-bold text-center mb-6">
            Cos'è la Psicomotricità?
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            La psicomotricità è un'attività educativa che favorisce lo sviluppo globale del bambino 
            attraverso il movimento e il gioco. Nei nostri percorsi negli asili, accompagniamo i più 
            piccoli nella scoperta del proprio corpo, dello spazio e delle relazioni con gli altri.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            Ogni sessione è pensata per stimolare la creatività, la coordinazione motoria e le 
            competenze sociali in un ambiente sicuro e divertente, adattato alle esigenze specifiche 
            di ogni fascia d'età.
          </p>
        </div>
      </section>

      {/* BENEFICI */}
      <section className="py-16 px-6 bg-blue-light">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">
            I Benefici della Psicomotricità
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Sviluppo Motorio",
                desc: "Migliora la coordinazione, l'equilibrio e la consapevolezza corporea attraverso attività ludiche mirate.",
                icon: "🤸"
              },
              {
                title: "Capacità Cognitive",
                desc: "Stimola l'attenzione, la memoria e la capacità di risolvere problemi in modo creativo.",
                icon: "🧠"
              },
              {
                title: "Socializzazione",
                desc: "Favorisce la relazione con i coetanei, l'ascolto reciproco e il rispetto delle regole del gioco.",
                icon: "👥"
              },
              {
                title: "Espressione Emotiva",
                desc: "Aiuta i bambini a riconoscere e gestire le proprie emozioni in modo sano e costruttivo.",
                icon: "💙"
              },
              {
                title: "Autonomia",
                desc: "Incoraggia la fiducia in se stessi e l'indipendenza nelle attività quotidiane.",
                icon: "⭐"
              },
              {
                title: "Creatività",
                desc: "Promuove l'immaginazione e la capacità di esprimersi attraverso il movimento e il gioco simbolico.",
                icon: "🎨"
              }
            ].map((beneficio) => (
              <div 
                key={beneficio.title}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-shadow duration-300"
              >
                <div className="text-5xl mb-4 text-center">{beneficio.icon}</div>
                <h3 className="text-xl font-bold text-blue-deep mb-3 text-center">
                  {beneficio.title}
                </h3>
                <p className="text-gray-700 text-center leading-relaxed">
                  {beneficio.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COME FUNZIONA */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">
          Come Funzionano le Nostre Sessioni
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card 1 */}
          <div className="bg-white rounded-xl shadow-lg p-8 border-l-4 border-cyan-600">
            <h3 className="text-2xl font-bold text-blue-deep mb-4">
              📅 Frequenza e Durata
            </h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-cyan-600 font-bold">•</span>
                <span>Sessioni settimanali o bisettimanali</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-600 font-bold">•</span>
                <span>Durata: 45-60 minuti per sessione</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-600 font-bold">•</span>
                <span>Gruppi piccoli (max 10-12 bambini)</span>
              </li>
            </ul>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-xl shadow-lg p-8 border-l-4 border-fox">
            <h3 className="text-2xl font-bold text-blue-deep mb-4">
              👶 Fasce d'Età
            </h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-fox font-bold">•</span>
                <span>Nido: 12-36 mesi</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-fox font-bold">•</span>
                <span>Materna: 3-5 anni</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-fox font-bold">•</span>
                <span>Attività personalizzate per età</span>
              </li>
            </ul>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-xl shadow-lg p-8 border-l-4 border-blue-deep">
            <h3 className="text-2xl font-bold text-blue-deep mb-4">
              🎯 Attività Tipo
            </h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-deep font-bold">•</span>
                <span>Percorsi motori con materiali morbidi</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-deep font-bold">•</span>
                <span>Giochi di equilibrio e coordinazione</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-deep font-bold">•</span>
                <span>Attività con musica e ritmo</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-deep font-bold">•</span>
                <span>Gioco simbolico e drammatizzazione</span>
              </li>
            </ul>
          </div>

          {/* Card 4 */}
          <div className="bg-white rounded-xl shadow-lg p-8 border-l-4 border-cyan-600">
            <h3 className="text-2xl font-bold text-blue-deep mb-4">
              👨‍🏫 Il Nostro Team
            </h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-cyan-600 font-bold">•</span>
                <span>Psicomotricisti qualificati</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-600 font-bold">•</span>
                <span>Esperienza con bambini 0-6 anni</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-600 font-bold">•</span>
                <span>Collaborazione con educatori dell'asilo</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* TESTIMONIANZE */}
      <section className="py-16 px-6 bg-gradient-to-r from-blue-light to-cyan-600">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">
            Cosa Dicono di Noi
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                text: "Mia figlia di 3 anni è migliorata tantissimo nella coordinazione e ora è molto più sicura di sé. Le sessioni sono sempre divertenti e ben organizzate!",
                nome: "Giulia M.",
                ruolo: "Mamma"
              },
              {
                text: "Come educatrice ho visto con i miei occhi i progressi dei bambini. L'approccio ludico li coinvolge totalmente e i benefici si vedono anche in classe.",
                nome: "Sara L.",
                ruolo: "Educatrice Asilo Nido"
              }
            ].map((testimonianza, idx) => (
              <div 
                key={idx}
                className="bg-white rounded-xl shadow-xl p-6 md:p-8"
              >
                <p className="text-gray-700 italic mb-4 leading-relaxed">
                  "{testimonianza.text}"
                </p>
                <div className="border-t pt-4">
                  <p className="font-bold text-blue-deep">{testimonianza.nome}</p>
                  <p className="text-sm text-gray-600">{testimonianza.ruolo}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA CONTATTO */}
      <section className="py-16 px-6 bg-cream">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-deep mb-6">
            Interessato alle Nostre Attività?
          </h2>
          <p className="text-lg text-gray-700 mb-8 leading-relaxed">
            Contattaci per maggiori informazioni sui nostri percorsi di psicomotricità, 
            disponibilità negli asili della tua zona, prezzi e modalità di iscrizione.
          </p>
          
          <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
            <div className="flex flex-col items-center gap-6">
              <div className="bg-cyan-600 text-white p-6 rounded-full">
                <BiMailSend className="text-5xl" />
              </div>
              <div>
                <p className="text-gray-600 mb-2">Scrivici a:</p>
                <a 
                  href="mailto:sportessence.asd.aps@gmail.com?subject=Richiesta Informazioni - Psicomotricità"
                  className="text-2xl md:text-3xl font-bold text-cyan-600 hover:text-cyan-700 hover:underline transition-all"
                >
                  sportessence.asd.aps@gmail.com
                </a>
              </div>
              <p className="text-sm text-gray-600 max-w-2xl">
                Ti risponderemo entro 24-48 ore con tutte le informazioni sui nostri percorsi, 
                costi, orari disponibili e modalità di collaborazione con il tuo asilo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-6 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">
          Domande Frequenti
        </h2>
        <div className="space-y-6">
          {[
            {
              domanda: "È necessaria una valutazione preliminare?",
              risposta: "Non è obbligatoria, ma può essere utile per bambini con esigenze specifiche. Durante la prima sessione osserviamo ogni bambino per personalizzare le attività."
            },
            {
              domanda: "I genitori possono assistere alle sessioni?",
              risposta: "Le sessioni negli asili sono riservate ai bambini per favorire autonomia e socializzazione, ma organizziamo incontri periodici con i genitori per condividere i progressi."
            },
            {
              domanda: "Cosa serve portare?",
              risposta: "Nulla di particolare! Consigliamo abbigliamento comodo e calzini antiscivolo. Tutti i materiali e attrezzature sono forniti da noi."
            },
            {
              domanda: "Collaborate con asili specifici?",
              risposta: "Collaboriamo con diversi asili della zona. Contattaci per sapere se siamo già attivi nel tuo asilo o per proporre una collaborazione."
            }
          ].map((faq, idx) => (
            <div 
              key={idx}
              className="bg-white rounded-lg shadow-md p-6 border-l-4 border-cyan-600"
            >
              <h3 className="text-xl font-bold text-blue-deep mb-3">
                {faq.domanda}
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {faq.risposta}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* LINK ALTRE ATTIVITÀ */}
      <section className="py-12 px-6 bg-blue-light">
        <div className="max-w-5xl mx-auto text-center">
          <h3 className="text-2xl font-bold text-white mb-6">
            Scopri le Nostre Altre Attività
          </h3>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/LezioniCalcio"
              className="bg-white text-blue-deep py-3 px-8 rounded-lg shadow-md 
                hover:-translate-y-1 hover:shadow-xl transition-all duration-300 font-semibold"
            >
              Lezioni Individuali di Calcio ⚽
            </Link>
            <Link
              href="/Campi"
              className="bg-cyan-600 text-white py-3 px-8 rounded-lg shadow-md 
                hover:-translate-y-1 hover:shadow-xl transition-all duration-300 font-semibold"
            >
              Campi Estivi 🏕️
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}