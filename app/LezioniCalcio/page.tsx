import Image from "next/image";
import Link from "next/link";
import { BiMailSend } from "react-icons/bi";

export default function LezioniCalcio() {
  return (
    <main className="bg-cream text-blue-deep">
      {/* HERO */}
      <section className="relative h-[60vh] overflow-hidden">
        <Image
          src="/imgs/calcio.jpg"
          alt="Lezioni individuali di calcio"
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/60 flex items-center justify-center">
          <div className="text-center text-white px-6 md:px-12 max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Lezioni Individuali di Calcio
            </h1>
            <p className="text-lg md:text-xl mb-6">
              Migliora le tue abilità calcistiche con allenamenti personalizzati
            </p>
          </div>
        </div>
      </section>

      {/* INTRODUZIONE */}
      <section className="py-16 px-6 max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <h2 className="text-3xl font-bold text-center mb-6">
            Allenamento Personalizzato per Ogni Livello
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            Le nostre lezioni individuali di calcio sono pensate per chi vuole migliorare le 
            proprie competenze tecniche e tattiche in modo mirato. Che tu sia alle prime armi 
            o un giocatore esperto che vuole perfezionare alcuni aspetti del proprio gioco, 
            i nostri allenatori certificati creano programmi su misura per raggiungere i tuoi obiettivi.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            Ogni sessione è strutturata per massimizzare il tempo e l'attenzione dedicata al singolo 
            atleta, permettendo progressi rapidi e duraturi sia dal punto di vista tecnico che mentale.
          </p>
        </div>
      </section>

      {/* COSA OFFRIAMO */}
      <section className="py-16 px-6 bg-blue-light">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">
            Cosa Include il Percorso
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Tecnica Individuale",
                desc: "Controllo palla, dribbling, finte, cambio di direzione e ricezione. Esercizi specifici per migliorare il tocco.",
                icon: "⚽"
              },
              {
                title: "Tiro e Finalizzazione",
                desc: "Precisione, potenza, colpo di testa e posizionamento in area. Allenamento per aumentare l'efficacia sotto porta.",
                icon: "🥅"
              },
              {
                title: "Passaggio e Visione",
                desc: "Passaggi corti, lunghi, cross e visione di gioco. Sviluppo della capacità di leggere le situazioni.",
                icon: "👁️"
              },
              {
                title: "Difesa e Marcatura",
                desc: "Posizionamento difensivo, anticipo, contrasto e transizioni. Tattiche per ruoli difensivi e mediani.",
                icon: "🛡️"
              },
              {
                title: "Preparazione Fisica",
                desc: "Velocità, resistenza, agilità e forza specifica per il calcio. Esercizi di potenziamento funzionale.",
                icon: "💪"
              },
              {
                title: "Aspetto Mentale",
                desc: "Gestione della pressione, concentrazione e mentalità vincente. Supporto psicologico per le prestazioni.",
                icon: "🧠"
              }
            ].map((area) => (
              <div 
                key={area.title}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-shadow duration-300"
              >
                <div className="text-5xl mb-4 text-center">{area.icon}</div>
                <h3 className="text-xl font-bold text-blue-deep mb-3 text-center">
                  {area.title}
                </h3>
                <p className="text-gray-700 text-center leading-relaxed">
                  {area.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* A CHI È RIVOLTO */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">
          Per Chi Sono Pensate le Lezioni
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            {
              title: "Giovani Calciatori (6-14 anni)",
              desc: "Bambini e ragazzi che vogliono migliorare le basi tecniche e tattiche, o che desiderano prepararsi per provini in squadre giovanili.",
              color: "cyan-600",
              icon: "👦"
            },
            {
              title: "Adolescenti (15-18 anni)",
              desc: "Giovani che giocano in squadre dilettantistiche o scolastiche e vogliono perfezionare aspetti specifici del loro gioco.",
              color: "blue-deep",
              icon: "🧑"
            },
            {
              title: "Adulti Amatori",
              desc: "Appassionati che giocano per divertimento e vogliono migliorare le proprie abilità tecniche o la forma fisica.",
              color: "fox",
              icon: "👨"
            },
            {
              title: "Preparazione Provini",
              desc: "Atleti che si preparano per test, provini o selezioni in squadre di categorie superiori e hanno bisogno di un supporto mirato.",
              color: "cyan-600",
              icon: "🎯"
            }
          ].map((target) => (
            <div 
              key={target.title}
              className={`bg-white rounded-xl shadow-lg p-8 border-l-4 border-${target.color} hover:shadow-2xl transition-shadow duration-300`}
            >
              <div className="flex items-start gap-4">
                <div className="text-5xl">{target.icon}</div>
                <div>
                  <h3 className="text-2xl font-bold text-blue-deep mb-3">
                    {target.title}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {target.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* COME FUNZIONA */}
      <section className="py-16 px-6 bg-blue-light">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">
            Come Funzionano le Lezioni
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Valutazione Iniziale",
                desc: "Prima lezione gratuita per valutare il livello attuale, discutere obiettivi e creare un piano personalizzato."
              },
              {
                step: "02",
                title: "Programma su Misura",
                desc: "Sessioni di 60-90 minuti focalizzate sugli aspetti da migliorare. Frequenza: 1-3 volte a settimana."
              },
              {
                step: "03",
                title: "Monitoraggio Progressi",
                desc: "Valutazioni periodiche, feedback continuo e aggiustamenti del programma in base ai miglioramenti."
              }
            ].map((fase) => (
              <div 
                key={fase.step}
                className="bg-white rounded-xl shadow-xl p-8 text-center"
              >
                <div className="text-5xl font-bold text-cyan-600 mb-4">
                  {fase.step}
                </div>
                <h3 className="text-2xl font-bold text-blue-deep mb-4">
                  {fase.title}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {fase.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* I NOSTRI ALLENATORI */}
      <section className="py-16 px-6 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">
          Il Nostro Team di Allenatori
        </h2>
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-blue-deep mb-4 flex items-center gap-3">
                <span className="text-3xl">🏆</span>
                Qualifiche e Esperienza
              </h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-cyan-600 font-bold text-xl">✓</span>
                  <span>Allenatori UEFA B e C</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-cyan-600 font-bold text-xl">✓</span>
                  <span>Esperienza in settori giovanili professionistici</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-cyan-600 font-bold text-xl">✓</span>
                  <span>Preparatori atletici specializzati</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-cyan-600 font-bold text-xl">✓</span>
                  <span>Certificazioni in psicologia dello sport</span>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-blue-deep mb-4 flex items-center gap-3">
                <span className="text-3xl">💡</span>
                Il Nostro Metodo
              </h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-fox font-bold text-xl">✓</span>
                  <span>Approccio personalizzato per ogni atleta</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-fox font-bold text-xl">✓</span>
                  <span>Utilizzo di tecnologie per analisi video</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-fox font-bold text-xl">✓</span>
                  <span>Focus su tecnica, tattica e mentalità</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-fox font-bold text-xl">✓</span>
                  <span>Comunicazione costante con famiglie e squadre</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIANZE */}
      <section className="py-16 px-6 bg-blue-light">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">
            Storie di Successo
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                text: "Grazie alle lezioni sono migliorato tantissimo nel controllo palla e ho superato il provino per la squadra Allievi!",
                nome: "Matteo R.",
                ruolo: "14 anni"
              },
              {
                text: "Mio figlio ha acquisito fiducia e sicurezza. Gli allenamenti sono divertenti ma anche molto efficaci.",
                nome: "Paola M.",
                ruolo: "Mamma di Luca (10 anni)"
              },
              {
                text: "Da adulto amatore ho riscoperto il piacere di migliorarmi. Le sessioni sono intense e super motivanti!",
                nome: "Andrea S.",
                ruolo: "35 anni"
              }
            ].map((testimonianza, idx) => (
              <div 
                key={idx}
                className="bg-white rounded-xl shadow-xl p-6"
              >
                <p className="text-gray-700 italic mb-4 leading-relaxed text-sm">
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
            Pronto a Migliorare il Tuo Gioco?
          </h2>
          <p className="text-lg text-gray-700 mb-8 leading-relaxed">
            Contattaci per prenotare la tua prima lezione di valutazione gratuita e ricevere 
            informazioni su pacchetti, prezzi e disponibilità degli allenatori.
          </p>
          
          <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
            <div className="flex flex-col items-center gap-6">
              <div className="bg-cyan-600 text-white p-6 rounded-full">
                <BiMailSend className="text-5xl" />
              </div>
              <div>
                <p className="text-gray-600 mb-2">Scrivici a:</p>
                <a 
                  href="mailto:sportessence.asd.aps@gmail.com?subject=Richiesta Informazioni - Lezioni Calcio"
                  className="text-2xl md:text-3xl font-bold text-cyan-600 hover:text-cyan-700 hover:underline transition-all"
                >
                  sportessence.asd.aps@gmail.com
                </a>
              </div>
              <p className="text-sm text-gray-600 max-w-2xl">
                Rispondiamo entro 24 ore con tutte le informazioni su orari, costi, 
                disponibilità degli allenatori e modalità di pagamento.
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
              domanda: "Devo avere un livello minimo per iniziare?",
              risposta: "No! Le lezioni sono adatte a tutti i livelli, dai principianti agli avanzati. L'allenatore adatterà gli esercizi alle tue capacità."
            },
            {
              domanda: "Dove si svolgono le lezioni?",
              risposta: "Collaboriamo con diversi centri sportivi della zona. Durante la prenotazione ti indicheremo le location disponibili più vicine a te."
            },
            {
              domanda: "Posso fare lezioni con un amico?",
              risposta: "Sì! Offriamo anche lezioni in coppia o piccoli gruppi (max 3 persone) a tariffe vantaggiose."
            },
            {
              domanda: "Cosa devo portare?",
              risposta: "Abbigliamento sportivo comodo, scarpe da calcio o da ginnastica, borraccia e voglia di migliorare! Il pallone e gli attrezzi li forniamo noi."
            },
            {
              domanda: "È possibile disdire o spostare una lezione?",
              risposta: "Sì, con almeno 24 ore di preavviso puoi riprogrammare la lezione senza penali."
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

      {/* Sezione Altre Attività */}
        <section className="py-16 px-6">
          <div className="mx-auto max-w-4xl text-center bg-blue-light p-8 rounded-2xl shadow-2xl">
            <h3 className="text-3xl font-bold text-white mb-4">
              Scopri le Nostre Altre Attività! 🌟
            </h3>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/Campi"
                className="bg-white text-blue-deep py-4 px-8 rounded-lg shadow-md 
                  hover:-translate-y-1 hover:shadow-xl transition-all duration-300 font-semibold
                  flex items-center justify-center gap-2"
              >
                <span className="text-2xl">🏕️</span>
                Campi Estivi
              </Link>
              <Link
                href="/Psicomotricita"
                className="bg-white text-blue-deep py-4 px-8 rounded-lg shadow-md 
                  hover:-translate-y-1 hover:shadow-xl transition-all duration-300 font-semibold
                  flex items-center justify-center gap-2"
              >
                <span className="text-2xl">👶</span>
                Psicomotricità negli Asili
              </Link>
            </div>
          </div>
        </section>
    </main>
  );
}