import Image from "next/image";
import Link from "next/link";

export default function About() {
  return (
    <main className="min-h-screen bg-cream">
      {/* Hero Section - IDENTICO A CAMPI */}
      <section className="bg-blue-light text-white py-20 px-6 shadow-xl">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 drop-shadow-lg">
            Chi Siamo
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            Più di un campo estivo: una famiglia che cresce insieme da oltre 10 anni
          </p>
        </div>
      </section>

      {/* Storia Azienda */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-deep mb-8 text-center">
              La Nostra Storia
            </h2>
            
            <div className="space-y-6 text-gray-700 text-lg leading-relaxed">
              <p>
                <strong className="text-blue-deep">SPORTESSENCE</strong> nasce nel XXXX 
                dalla passione di un gruppo di educatori e professionisti dello sport che 
                hanno voluto creare qualcosa di speciale: un luogo dove i bambini e ragazzi 
                potessero crescere divertendosi, imparando e facendo amicizie indimenticabili.
              </p>
              
              <p>
                Quello che è iniziato come un piccolo campo estivo con pochi partecipanti 
                è cresciuto anno dopo anno, grazie alla fiducia delle famiglie e alla 
                dedizione del nostro team. Oggi accogliamo centinaia di bambini ogni estate, 
                ma il nostro obiettivo rimane invariato: <strong>fare di ogni giorno 
                un'avventura memorabile</strong>.
              </p>
              
              <p>
                La nostra filosofia si basa su tre pilastri fondamentali:
              </p>
              
              <div className="grid md:grid-cols-3 gap-6 my-8">
                <div className="bg-cyan-50 rounded-xl p-6 text-center border border-cyan-100">
                  <div className="text-5xl mb-3">⚽</div>
                  <h3 className="font-bold text-blue-deep text-xl mb-2">Sport & Movimento</h3>
                  <p className="text-sm text-gray-600">
                    Promuoviamo uno stile di vita attivo e salutare
                  </p>
                </div>
                
                <div className="bg-cyan-50 rounded-xl p-6 text-center border border-cyan-100">
                  <div className="text-5xl mb-3">🎨</div>
                  <h3 className="font-bold text-blue-deep text-xl mb-2">Creatività</h3>
                  <p className="text-sm text-gray-600">
                    Stimoliamo l'immaginazione e l'espressione personale
                  </p>
                </div>
                
                <div className="bg-cyan-50 rounded-xl p-6 text-center border border-cyan-100">
                  <div className="text-5xl mb-3">🤝</div>
                  <h3 className="font-bold text-blue-deep text-xl mb-2">Amicizia & Valori</h3>
                  <p className="text-sm text-gray-600">
                    Coltiviamo rispetto, collaborazione e inclusione
                  </p>
                </div>
              </div>
              
              <p>
                Ogni anno investiamo nella formazione continua del nostro staff, 
                nella sicurezza delle strutture e nell'innovazione delle attività proposte. 
                Il nostro impegno è garantire che ogni bambino viva un'esperienza 
                positiva, formativa e, soprattutto, divertente!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Titolo Team */}
      <section className="pb-12 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-deep mb-4">
            Il Nostro Team
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Incontra le persone che rendono speciale ogni giornata al campo
          </p>
        </div>
      </section>

      {/* FONDATORE - Foto SINISTRA, Testo DESTRA */}
      <section className="pb-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="grid md:grid-cols-[300px_1fr] gap-0">
              {/* Foto */}
              <div className="relative h-80 md:h-auto bg-gradient-to-br from-cyan-100 to-blue-100">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-gray-400">
                    <div className="text-6xl mb-2">👤</div>
                    <p className="text-sm font-semibold">Foto Fondatore</p>
                    <p className="text-xs">[400x500px]</p>
                  </div>
                </div>
              </div>
              
              {/* Testo */}
              <div className="p-8 md:p-10 flex flex-col justify-center">
                <div className="inline-block bg-cyan-100 text-cyan-700 px-4 py-1 rounded-full text-sm font-semibold mb-4 w-fit">
                  Fondatore & Direttore
                </div>
                
                <h3 className="text-2xl md:text-3xl font-bold text-blue-deep mb-3">
                  Mario Rossi
                </h3>
                
                <p className="text-gray-700 leading-relaxed mb-4">
                  Laureato in Scienze Motorie con oltre 15 anni di esperienza nel settore 
                  educativo, Mario ha fondato SPORTESSENCE con una visione chiara: 
                  creare un ambiente dove sport ed educazione si fondono per far crescere 
                  i ragazzi in modo sano e divertente.
                </p>
                
                <p className="text-gray-700 leading-relaxed mb-6">
                  <em className="text-blue-deep font-semibold">
                    "Ogni estate vedo bambini arrivare timidi e partire con nuovi amici e 
                    nuove competenze. È questa la magia del campo estivo: crescere giocando!"
                  </em>
                </p>
                
                <div className="flex flex-wrap gap-2">
                  <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                    Educatore Sportivo
                  </span>
                  <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                    Primo Soccorso
                  </span>
                  <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                    Formatore
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COORDINATRICE - Foto DESTRA, Testo SINISTRA */}
      <section className="pb-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="grid md:grid-cols-[1fr_300px] gap-0">
              {/* Testo */}
              <div className="p-8 md:p-10 flex flex-col justify-center order-2 md:order-1">
                <div className="inline-block bg-purple-100 text-purple-700 px-4 py-1 rounded-full text-sm font-semibold mb-4 w-fit">
                  Coordinatrice Attività
                </div>
                
                <h3 className="text-2xl md:text-3xl font-bold text-blue-deep mb-3">
                  Laura Bianchi
                </h3>
                
                <p className="text-gray-700 leading-relaxed mb-4">
                  Con una laurea in Scienze dell'Educazione e una passione infinita per 
                  il lavoro con i bambini, Laura coordina tutte le attività del campo, 
                  assicurandosi che ogni giornata sia ben organizzata, sicura e piena 
                  di sorprese.
                </p>
                
                <p className="text-gray-700 leading-relaxed mb-6">
                  <em className="text-blue-deep font-semibold">
                    "Il segreto è ascoltare i bambini: ogni gruppo è unico e io amo 
                    creare programmi su misura che li facciano sentire protagonisti!"
                  </em>
                </p>
                
                <div className="flex flex-wrap gap-2">
                  <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                    Educatrice
                  </span>
                  <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                    Animazione
                  </span>
                  <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                    Gestione Gruppi
                  </span>
                </div>
              </div>
              
              {/* Foto */}
              <div className="relative h-80 md:h-auto bg-gradient-to-br from-purple-100 to-pink-100 order-1 md:order-2">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-gray-400">
                    <div className="text-6xl mb-2">👤</div>
                    <p className="text-sm font-semibold">Foto Coordinatrice</p>
                    <p className="text-xs">[400x500px]</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ANIMATORE 1 - Foto SINISTRA, Testo DESTRA */}
      <section className="pb-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="grid md:grid-cols-[300px_1fr] gap-0">
              {/* Foto */}
              <div className="relative h-80 md:h-auto bg-gradient-to-br from-green-100 to-emerald-100">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-gray-400">
                    <div className="text-6xl mb-2">👤</div>
                    <p className="text-sm font-semibold">Foto Animatore</p>
                    <p className="text-xs">[400x500px]</p>
                  </div>
                </div>
              </div>
              
              {/* Testo */}
              <div className="p-8 md:p-10 flex flex-col justify-center">
                <div className="inline-block bg-green-100 text-green-700 px-4 py-1 rounded-full text-sm font-semibold mb-4 w-fit">
                  Animatore Sportivo
                </div>
                
                <h3 className="text-2xl md:text-3xl font-bold text-blue-deep mb-3">
                  Luca Verdi
                </h3>
                
                <p className="text-gray-700 leading-relaxed mb-4">
                  Diplomato ISEF e istruttore di calcio giovanile, Luca è l'anima delle 
                  attività sportive del campo. Con la sua energia contagiosa e la capacità 
                  di coinvolgere anche i più timidi, rende ogni partita un momento speciale.
                </p>
                
                <p className="text-gray-700 leading-relaxed mb-6">
                  <em className="text-blue-deep font-semibold">
                    "Lo sport insegna tanto: rispetto delle regole, lavoro di squadra, 
                    gestione delle emozioni. Ma soprattutto, insegna a divertirsi!"
                  </em>
                </p>
                
                <div className="flex flex-wrap gap-2">
                  <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                    Istruttore Sportivo
                  </span>
                  <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                    Calcio
                  </span>
                  <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                    Giochi di Squadra
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ANIMATRICE 2 - Foto DESTRA, Testo SINISTRA */}
      <section className="pb-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="grid md:grid-cols-[1fr_300px] gap-0">
              {/* Testo */}
              <div className="p-8 md:p-10 flex flex-col justify-center order-2 md:order-1">
                <div className="inline-block bg-pink-100 text-pink-700 px-4 py-1 rounded-full text-sm font-semibold mb-4 w-fit">
                  Animatrice Creativa
                </div>
                
                <h3 className="text-2xl md:text-3xl font-bold text-blue-deep mb-3">
                  Sofia Neri
                </h3>
                
                <p className="text-gray-700 leading-relaxed mb-4">
                  Laureata all'Accademia di Belle Arti e appassionata di teatro, Sofia 
                  guida i laboratori creativi del campo. Dalle opere d'arte ai musical, 
                  ogni progetto diventa un'occasione per liberare la fantasia dei ragazzi.
                </p>
                
                <p className="text-gray-700 leading-relaxed mb-6">
                  <em className="text-blue-deep font-semibold">
                    "Adoro vedere i bambini scoprire talenti che non sapevano di avere. 
                    La creatività è libertà, e qui possono esprimersi senza limiti!"
                  </em>
                </p>
                
                <div className="flex flex-wrap gap-2">
                  <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                    Arte & Manualità
                  </span>
                  <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                    Teatro
                  </span>
                  <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                    Musica
                  </span>
                </div>
              </div>
              
              {/* Foto */}
              <div className="relative h-80 md:h-auto bg-gradient-to-br from-pink-100 to-rose-100 order-1 md:order-2">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-gray-400">
                    <div className="text-6xl mb-2">👤</div>
                    <p className="text-sm font-semibold">Foto Animatrice</p>
                    <p className="text-xs">[400x500px]</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MASCOTTE FIRO - Foto SINISTRA, Testo DESTRA */}
      <section className="pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-4 border-fox">
            <div className="grid md:grid-cols-[300px_1fr] gap-0">
              {/* Foto */}
              <div className="relative h-80 md:h-auto bg-gradient-to-br from-orange-100 to-yellow-100">
                <div className="absolute inset-0 flex items-center justify-center p-8">
                  <Image
                    src="/imgs/mascotte.png"
                    alt="FIRO - Mascotte SPORTESSENCE"
                    width={300}
                    height={300}
                    className="object-contain"
                  />
                </div>
              </div>
              
              {/* Testo */}
              <div className="p-8 md:p-10 flex flex-col justify-center bg-gradient-to-br from-orange-50 to-yellow-50">
                <div className="inline-block bg-fox text-white px-4 py-1 rounded-full text-sm font-semibold mb-4 w-fit">
                  ⭐ Mascotte Ufficiale
                </div>
                
                <h3 className="text-2xl md:text-3xl font-bold text-fox mb-3">
                  FIRO 🦊
                </h3>
                
                <p className="text-gray-700 leading-relaxed mb-4">
                  Ciao! Sono FIRO, una volpe curiosa e super energica che adora fare nuove 
                  amicizie! Ogni anno accompagno i bambini nelle loro avventure al campo, 
                  insegnando loro l'importanza del gioco di squadra, del rispetto e del 
                  divertimento.
                </p>
                
                <p className="text-gray-700 leading-relaxed mb-6">
                  <em className="text-fox font-semibold">
                    "La mia missione? Far sorridere TUTTI, anche i più timidi! 
                    Al campo estivo non ci sono estranei, solo amici che non si sono 
                    ancora conosciuti! 😄"
                  </em>
                </p>
                
                <div className="flex flex-wrap gap-2">
                  <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-semibold">
                    🎉 Allegria Garantita
                  </span>
                  <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-semibold">
                    🤗 Amico di Tutti
                  </span>
                  <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-semibold">
                    ⚡ 100% Energia
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Finale - STILE CAMPI */}
      <section className="bg-blue-light py-16 px-6 shadow-2xl">
        <div className="max-w-3xl mx-auto text-center text-white">
          <div className="text-5xl mb-6">🌟</div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Vieni a Conoscerci!
          </h2>
          <p className="text-lg md:text-xl mb-8 leading-relaxed">
            Vuoi saperne di più sui nostri campi estivi? Contattaci o scopri 
            tutte le informazioni utili.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/Info"
              className="inline-block bg-white text-blue-deep px-8 py-4 rounded-xl shadow-lg 
                hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 ease-out 
                font-bold text-lg"
            >
              Informazioni Utili
            </Link>
            <Link
              href="/Campi"
              className="inline-block bg-transparent border-2 border-white text-white 
                px-8 py-4 rounded-xl shadow-lg hover:bg-white hover:text-cyan-600
                transition-all duration-300 ease-out font-bold text-lg"
            >
              Scopri i Campi
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}