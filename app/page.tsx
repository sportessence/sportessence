import Image from 'next/image';
import Link from 'next/link';
import prova from "@/public/hero.jpg";

export default function Home() {
  return (
    <main className="bg-cream text-blue-deep">
      {/* Hero Section */}
<section className="relative h-190 md:h-screen overflow-hidden">
      {/* Immagine di sfondo */}
<Image
  src={prova}
  alt="Bambini che giocano al campo estivo"
  fill
  priority
  className="object-cover object-center"
/>

      {/* Overlay scuro per migliorare leggibilità */}
      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
        <div className="text-center text-white font-bold px-6 md:px-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Vivi un'estate indimenticabile!
          </h1>
          <p className="text-lg mb-6">
            Scopri i nostri campi estivi per bambini e ragazzi dai 6 ai 21 anni.
          </p>
          <Link
            href="/About"
            className="bg-cyan-600 text-white py-3 px-6 rounded-lg shadow-lg hover:text-cyan-600 hover:bg-white transition duration-300"
          >
            Scopri i Campi
          </Link>
        </div>
      </div>
    </section>

<section className="bg-cream py-16 px-6 max-w-7xl mx-auto">
  <div className="flex flex-col md:flex-row md:items-start items-center gap-12">
    
    {/* Logo*/}
    <div className="flex flex-col items-center md:items-start gap-4">
      <Image 
        src="/logoNoSfondo.png" 
        alt="Logo Azienda"
        width={900}
        height={900}
    className="object-contain w-100 md:w-300 lg:w-200" // responsive width
      />
    </div>

    {/* Testo Presentazione */}
    <div className="text-center md:text-left">
      <h2 className="text-3xl font-bold mb-4 text-blue-deep">Chi Siamo</h2>
      <p className="text-gray-700 text-lg">
        Fondata nel XXXX, SPORTESSENCE si dedica a creare esperienze indimenticabili per bambini e ragazzi. 
        Grazie alla nostra passione per lo sport, la creatività e il divertimento, ogni estate trasformiamo il gioco in apprendimento e amicizia.
      </p>
    </div>

  </div>
</section>



{/* Le nostre attività */}
<section className="py-16 px-6 mx-auto max-w-7xl">
  <h2 className="text-3xl font-semibold text-center mb-8">Le nostre attività</h2>

  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    {[
      {
        title: "Sport e Movimento",
        img: "/sport.jpg",
        desc: "Giochi di squadra, tornei e tanto divertimento: ogni giorno si scopre qualcosa di nuovo in campo."
      },
      {
        title: "Creatività senza limiti",
        img: "/colori.jpg",
        desc: "Colori, musica e fantasia: mettiamo le mani in pasta e diamo forma alle idee più pazze."
      },
      {
        title: "Squadra e Amicizia",
        img: "/squadra.jpg",
        desc: "Lavorare insieme, aiutarsi e ridere tanto: la vera forza del camp è il gruppo."
      },
      {
        title: "Giochi e Sfide",
        img: "/arco.jpg",
        desc: "Caccia al tesoro, quiz, scacchi, mini-olimpiadi: ogni giorno una sfida diversa!"
      },
      {
        title: "Allenamento per la mente",
        img: "/scacchi.jpg",
        desc: "Non solo muscoli: alleniamo anche la concentrazione, la strategia e la fantasia."
      },
      {
        title: "Relax e Divertimento",
        img: "/provoHero.jpg",
        desc: "Momenti tranquilli per ricaricare le energie tra una partita e un laboratorio creativo."
      },
    ].map((item) => (
      <div
        key={item.title}
        className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow"
      >
        <div className="overflow-hidden">
          <Image
            src={item.img}
            alt={item.title}
            width={500}
            height={300}
            className="
              w-full 
              md:h-100 h-130
              object-cover object-center 
              transform transition-transform duration-300 
              hover:scale-105
            "
          />
        </div>

        <div className="p-6">
          <h3 className="text-xl text-blue-deep font-semibold mb-2">{item.title}</h3>
          <p className="text-gray-700 mb-4">{item.desc}</p>
        </div>
      </div>
    ))}
  </div>
</section>


      {/* Statistiche */}
      <section className="bg-blue-light py-16">
        <div className="mx-auto max-w-7xl px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: 'Statistica 1', value: '35' },
            { label: 'Statistica 2', value: '10.000+' },
            { label: 'Statistica 3', value: '50+' },
            { label: 'Statistica 4', value: '200+' },
          ].map(({ label, value }) => (
            <div key={label} className="text-center">
              <p className="text-3xl font-bold text-white">{value}</p>
              <p className="text-lg font-bold text-blue-deep">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonianze */}
      <section className="py-16 px-6 bg-cream mx-auto max-w-7xl ">
        <h2 className="text-3xl font-semibold text-center mb-8">Cosa Dicono di Noi</h2>
        <div className="flex flex-wrap justify-center gap-8">
          {[
            { name: 'Valentina R.', text: 'Esperienza super positiva, team qualificato e professionale.' },
            { name: 'Diana M.', text: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Enim sed molestiae, explicabo aspernatur fugiat earum? Saepe, quod! Magnam recusandae in aliquid consequuntur assumenda ad autem, non distinctio molestiae cupiditate modi!" },
            { name: 'Arianna C.', text: 'Ottima organizzazione e gestione dei bambini.' },
          ].map(({ name, text }) => (
            <div key={name} className="bg-white p-6 rounded-lg shadow-md max-w-xs">
              <p className="text-lg italic mb-4">"{text}"</p>
              <p className="font-semibold text-fox">– {name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Sponsor Section */}
<section className="bg-gray-200 py-12">
  <div className="px-6 text-center max-w-7xl mx-auto">
    <h2 className="text-3xl font-semibold mb-6">I nostri sponsor</h2>
    <div className="flex justify-center items-center gap-12 md:gap-24">
      {[
        { name: 'Sponsor 1', img: 'https://www.ascsport.it/wp-content/themes/asc_sport/images_new/ASC-Logo.svg', href: 'https://www.ascsport.it' },
        { name: 'Sponsor 2', img: 'https://www.seristampa.promo/wp-content/uploads/2024/01/LOGO-header.png', href: 'https://www.seristampa.promo' },
        { name: 'Sponsor 3', img: 'https://centrosp.it/wp-content/uploads/2021/12/CPS-Logo-Transparent.png', href: 'https://centrosp.it' },
      ].map((sponsor) => (
        <a key={sponsor.name} href={sponsor.href} target="_blank" className="inline-block transition-transform duration-300 hover:scale-110">
          <Image
            src={sponsor.img}
            alt={sponsor.name}
            width={200} // larghezza compatta
            height={120} // altezza proporzionata
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
