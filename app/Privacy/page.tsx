import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-cream py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8 md:p-12">
        {/* Header */}
        <div className="mb-8 pb-6 border-b-2 border-blue-light">
          <h1 className="text-4xl font-bold text-blue-deep mb-2">
            Privacy Policy
          </h1>
          <p className="text-gray-600 text-sm">
            Ultimo aggiornamento: {new Date().toLocaleDateString('it-IT')}
          </p>
        </div>

        {/* Introduzione */}
        <section className="mb-8">
          <p className="text-gray-700 leading-relaxed mb-4">
            SPORTESSENCE ASD/APS (di seguito "noi", "ci" o "SportEssence") rispetta la tua privacy 
            e si impegna a proteggere i tuoi dati personali. Questa Privacy Policy ti informa su come 
            raccogliamo, utilizziamo e proteggiamo i tuoi dati quando utilizzi il nostro sito web e i nostri servizi.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Questa policy è conforme al Regolamento Generale sulla Protezione dei Dati (GDPR - Regolamento UE 2016/679) 
            e al Codice Privacy italiano (D.Lgs. 196/2003 come modificato dal D.Lgs. 101/2018).
          </p>
        </section>

        {/* 1. Titolare del Trattamento */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-blue-deep mb-4">
            1. Titolare del Trattamento
          </h2>
          <div className="bg-blue-50 p-6 rounded-lg">
            <p className="text-gray-700 mb-2">
              <strong>SPORTESSENCE ASD/APS</strong>
            </p>
            <p className="text-gray-700 mb-2">
              Sede legale: [INSERIRE INDIRIZZO COMPLETO]
            </p>
            <p className="text-gray-700 mb-2">
              Partita IVA / Codice Fiscale: [INSERIRE P.IVA/CF]
            </p>
            <p className="text-gray-700 mb-2">
              Email: <a href="mailto:privacy@sportessence.com" className="text-cyan-600 hover:underline">
                privacy@sportessence.com
              </a>
            </p>
            <p className="text-gray-700">
              Telefono: <a href="tel:3420394661" className="text-cyan-600 hover:underline">342 039 4661</a>
            </p>
          </div>
        </section>

        {/* 2. Dati Raccolti */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-blue-deep mb-4">
            2. Quali Dati Raccogliamo
          </h2>
          
          <h3 className="text-xl font-semibold text-blue-deep mb-3">
            2.1 Dati del Genitore/Tutore
          </h3>
          <p className="text-gray-700 mb-4">
            Durante la registrazione raccogliamo i seguenti dati del genitore o tutore legale:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6 ml-4">
            <li>Nome e cognome</li>
            <li>Indirizzo email (utilizzato per l'accesso)</li>
            <li>Codice fiscale</li>
            <li>Numero di telefono</li>
            <li>Indirizzo completo (via, civico, CAP, comune, provincia)</li>
            <li>Email secondaria per contatti (opzionale)</li>
            <li>Password crittografata (non memorizzata in chiaro)</li>
          </ul>

          <h3 className="text-xl font-semibold text-blue-deep mb-3">
            2.2 Dati del Minore
          </h3>
          <p className="text-gray-700 mb-4">
            Per l'iscrizione ai campi estivi raccogliamo i seguenti dati del bambino/ragazzo:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6 ml-4">
            <li>Nome e cognome</li>
            <li>Data di nascita</li>
            <li>Codice fiscale</li>
            <li>Informazioni mediche rilevanti (allergie, intolleranze, patologie che richiedono attenzione)</li>
            <li>Informazioni su attività fisica e alimentazione</li>
            <li>Certificato medico sportivo (se richiesto)</li>
          </ul>

          <h3 className="text-xl font-semibold text-blue-deep mb-3">
            2.3 Dati di Navigazione
          </h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
            <li>Indirizzo IP</li>
            <li>Tipo di browser e dispositivo</li>
            <li>Pagine visitate e tempo di permanenza</li>
            <li>Dati tecnici necessari per il funzionamento del sito</li>
          </ul>
        </section>

        {/* 3. Finalità e Base Giuridica */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-blue-deep mb-4">
            3. Perché Raccogliamo i Tuoi Dati
          </h2>
          
          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-deep mb-2">
                📋 Gestione Iscrizioni e Servizi
              </h3>
              <p className="text-gray-700 mb-2">
                <strong>Finalità:</strong> Gestire la tua iscrizione ai campi estivi, elaborare pagamenti, 
                comunicazioni relative alle attività.
              </p>
              <p className="text-gray-700">
                <strong>Base giuridica:</strong> Esecuzione del contratto (Art. 6.1.b GDPR)
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-deep mb-2">
                👶 Tutela e Sicurezza dei Minori
              </h3>
              <p className="text-gray-700 mb-2">
                <strong>Finalità:</strong> Garantire la sicurezza e il benessere dei bambini durante le attività 
                (gestione allergie, emergenze mediche, diete speciali).
              </p>
              <p className="text-gray-700">
                <strong>Base giuridica:</strong> Consenso del genitore/tutore (Art. 6.1.a GDPR) + 
                Protezione interessi vitali del minore (Art. 6.1.d GDPR)
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-deep mb-2">
                📧 Comunicazioni
              </h3>
              <p className="text-gray-700 mb-2">
                <strong>Finalità:</strong> Inviarti conferme, promemoria, comunicazioni importanti 
                relative alle attività iscritte.
              </p>
              <p className="text-gray-700">
                <strong>Base giuridica:</strong> Esecuzione del contratto (Art. 6.1.b GDPR)
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-deep mb-2">
                ⚖️ Obblighi Legali
              </h3>
              <p className="text-gray-700 mb-2">
                <strong>Finalità:</strong> Adempiere a obblighi fiscali, contabili e di legge.
              </p>
              <p className="text-gray-700">
                <strong>Base giuridica:</strong> Obbligo legale (Art. 6.1.c GDPR)
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-deep mb-2">
                🔒 Sicurezza del Sito
              </h3>
              <p className="text-gray-700 mb-2">
                <strong>Finalità:</strong> Prevenire frodi, abusi, garantire la sicurezza del servizio.
              </p>
              <p className="text-gray-700">
                <strong>Base giuridica:</strong> Legittimo interesse (Art. 6.1.f GDPR)
              </p>
            </div>
          </div>
        </section>

        {/* 4. Conservazione Dati */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-blue-deep mb-4">
            4. Per Quanto Tempo Conserviamo i Tuoi Dati
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-blue-light text-white">
                  <th className="p-3 border">Tipo di Dato</th>
                  <th className="p-3 border">Periodo di Conservazione</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                <tr>
                  <td className="p-3 border">Dati account attivo</td>
                  <td className="p-3 border">Fino alla cancellazione dell'account</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="p-3 border">Dati iscrizioni completate</td>
                  <td className="p-3 border">5 anni (obblighi fiscali e contabili)</td>
                </tr>
                <tr>
                  <td className="p-3 border">Dati medici minori</td>
                  <td className="p-3 border">Fino a fine attività + 1 anno (sicurezza)</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="p-3 border">Log di sicurezza</td>
                  <td className="p-3 border">1 anno</td>
                </tr>
                <tr>
                  <td className="p-3 border">Backup database</td>
                  <td className="p-3 border">30 giorni (poi cancellazione automatica)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 5. Condivisione Dati */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-blue-deep mb-4">
            5. Con Chi Condividiamo i Tuoi Dati
          </h2>
          <p className="text-gray-700 mb-4">
            I tuoi dati personali <strong>NON vengono venduti</strong> a terzi per scopi commerciali. 
            Condividiamo i tuoi dati solo nei seguenti casi:
          </p>
          <ul className="list-disc list-inside space-y-3 text-gray-700 ml-4">
            <li>
              <strong>Fornitori di servizi tecnici:</strong> Supabase (database hosting - USA con garanzie GDPR), 
              Resend/AWS SES (invio email), Cloudflare (sicurezza e performance)
            </li>
            <li>
              <strong>Elaborazione pagamenti:</strong> Provider di pagamento (Stripe, PayPal, bonifici bancari)
            </li>
            <li>
              <strong>Staff autorizzato:</strong> Personale SportEssence che necessita accesso per gestione campi 
              e sicurezza minori
            </li>
            <li>
              <strong>Autorità competenti:</strong> Se richiesto per legge (autorità fiscali, giudiziarie)
            </li>
          </ul>
          <p className="text-gray-700 mt-4 p-4 bg-yellow-50 border-l-4 border-yellow-500">
            ⚠️ <strong>Importante:</strong> Tutti i nostri fornitori sono tenuti contrattualmente a proteggere 
            i tuoi dati secondo standard GDPR e non possono utilizzarli per scopi propri.
          </p>
        </section>

        {/* 6. Trasferimento Dati Extra-UE */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-blue-deep mb-4">
            6. Trasferimenti Internazionali
          </h2>
          <p className="text-gray-700 mb-4">
            Alcuni dei nostri fornitori (es. Supabase) potrebbero avere server negli Stati Uniti. 
            In questi casi:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
            <li>Utilizziamo solo fornitori certificati con garanzie GDPR</li>
            <li>Sono in vigore Clausole Contrattuali Standard UE</li>
            <li>I dati sono protetti con gli stessi standard europei</li>
            <li>Quando possibile, utilizziamo server in regione EU</li>
          </ul>
        </section>

        {/* 7. I Tuoi Diritti */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-blue-deep mb-4">
            7. I Tuoi Diritti
          </h2>
          <p className="text-gray-700 mb-4">
            In base al GDPR, hai i seguenti diritti sui tuoi dati personali:
          </p>
          
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-deep mb-2">🔍 Diritto di Accesso</h3>
              <p className="text-sm text-gray-700">
                Puoi richiedere copia di tutti i tuoi dati personali in nostro possesso.
              </p>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-deep mb-2">✏️ Diritto di Rettifica</h3>
              <p className="text-sm text-gray-700">
                Puoi correggere dati inesatti o incompleti dal tuo profilo.
              </p>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-deep mb-2">🗑️ Diritto di Cancellazione</h3>
              <p className="text-sm text-gray-700">
                Puoi richiedere la cancellazione dei tuoi dati (salvo obblighi legali).
              </p>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-deep mb-2">🔒 Diritto di Limitazione</h3>
              <p className="text-sm text-gray-700">
                Puoi chiedere di limitare il trattamento in determinate circostanze.
              </p>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-deep mb-2">📦 Diritto di Portabilità</h3>
              <p className="text-sm text-gray-700">
                Puoi ricevere i tuoi dati in formato leggibile e trasferirli altrove.
              </p>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-deep mb-2">🛑 Diritto di Opposizione</h3>
              <p className="text-sm text-gray-700">
                Puoi opporti a determinati trattamenti basati su legittimo interesse.
              </p>
            </div>
          </div>

          <div className="bg-cyan-50 border border-cyan-200 p-6 rounded-lg">
            <h3 className="font-semibold text-blue-deep mb-3">
              Come Esercitare i Tuoi Diritti:
            </h3>
            <p className="text-gray-700 mb-2">
              Per esercitare qualsiasi diritto, contattaci a:
            </p>
            <ul className="space-y-2 text-gray-700">
              <li>
                📧 Email: <a href="mailto:privacy@sportessence.com" className="text-cyan-600 hover:underline font-semibold">
                  privacy@sportessence.com
                </a>
              </li>
              <li>
                📞 Telefono: <a href="tel:3420394661" className="text-cyan-600 hover:underline font-semibold">
                  342 039 4661
                </a>
              </li>
              <li>
                ⏱️ <strong>Risponderemo entro 30 giorni</strong> dalla tua richiesta
              </li>
            </ul>
          </div>

          <p className="text-gray-700 mt-4 p-4 bg-blue-50 border-l-4 border-blue-600">
            ℹ️ <strong>Nota:</strong> Hai anche il diritto di presentare reclamo al Garante per la 
            Protezione dei Dati Personali (<a href="https://www.garanteprivacy.it" target="_blank" rel="noopener noreferrer" className="text-cyan-600 hover:underline">www.garanteprivacy.it</a>).
          </p>
        </section>

        {/* 8. Sicurezza */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-blue-deep mb-4">
            8. Come Proteggiamo i Tuoi Dati
          </h2>
          <p className="text-gray-700 mb-4">
            Implementiamo misure di sicurezza tecniche e organizzative per proteggere i tuoi dati:
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">🔐 Crittografia</h3>
              <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                <li>HTTPS su tutto il sito</li>
                <li>Password crittografate</li>
                <li>Database protetto con crittografia</li>
              </ul>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">🛡️ Accesso Limitato</h3>
              <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                <li>Autenticazione multi-fattore</li>
                <li>Row Level Security (RLS)</li>
                <li>Solo admin autorizzati</li>
              </ul>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">💾 Backup Regolari</h3>
              <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                <li>Backup automatici giornalieri</li>
                <li>Conservazione 30 giorni</li>
                <li>Recovery testato regolarmente</li>
              </ul>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">📊 Monitoraggio</h3>
              <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                <li>Log accessi sensibili</li>
                <li>Alert anomalie</li>
                <li>Audit regolari</li>
              </ul>
            </div>
          </div>
        </section>

        {/* 9. Cookie e Tecnologie */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-blue-deep mb-4">
            9. Cookie e Tecnologie Simili
          </h2>
          
          <h3 className="text-xl font-semibold text-blue-deep mb-3">
            9.1 Cosa Sono i Cookie
          </h3>
          <p className="text-gray-700 mb-4">
            I cookie sono piccoli file di testo memorizzati sul tuo dispositivo quando visiti il nostro sito.
          </p>

          <h3 className="text-xl font-semibold text-blue-deep mb-3">
            9.2 Cookie Che Utilizziamo
          </h3>
          <div className="space-y-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-green-500">
              <h4 className="font-semibold text-gray-800 mb-2">✅ Cookie Tecnici (Necessari)</h4>
              <p className="text-sm text-gray-700 mb-2">
                <strong>Finalità:</strong> Permettere il funzionamento del sito, mantenere la tua sessione di login.
              </p>
              <p className="text-sm text-gray-700 mb-2">
                <strong>Durata:</strong> Sessione o fino al logout
              </p>
              <p className="text-sm text-gray-700">
                <strong>Consenso:</strong> Non richiesto (necessari per il servizio)
              </p>
              <p className="text-xs text-gray-600 mt-2 font-mono">
                Esempi: supabase-auth-token, session_id
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500">
              <h4 className="font-semibold text-gray-800 mb-2">🔧 Cookie Funzionali</h4>
              <p className="text-sm text-gray-700 mb-2">
                <strong>Finalità:</strong> Ricordare preferenze (lingua, tema, etc.)
              </p>
              <p className="text-sm text-gray-700 mb-2">
                <strong>Durata:</strong> 30 giorni
              </p>
              <p className="text-sm text-gray-700">
                <strong>Consenso:</strong> Non richiesto (migliorano esperienza)
              </p>
            </div>
          </div>

          <h3 className="text-xl font-semibold text-blue-deep mb-3">
            9.3 Cookie NON Utilizzati
          </h3>
          <p className="text-gray-700 mb-2">
            Il nostro sito <strong>NON utilizza</strong>:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
            <li>❌ Cookie di profilazione</li>
            <li>❌ Cookie pubblicitari</li>
            <li>❌ Cookie di tracciamento per marketing</li>
            <li>❌ Cookie di terze parti per analytics (Google Analytics, etc.)</li>
          </ul>

          <h3 className="text-xl font-semibold text-blue-deep mb-3 mt-6">
            9.4 Come Gestire i Cookie
          </h3>
          <p className="text-gray-700 mb-4">
            Puoi gestire o eliminare i cookie attraverso le impostazioni del tuo browser:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
            <li>
              <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-cyan-600 hover:underline">
                Google Chrome
              </a>
            </li>
            <li>
              <a href="https://support.mozilla.org/it/kb/protezione-antitracciamento-avanzata-firefox-desktop" target="_blank" rel="noopener noreferrer" className="text-cyan-600 hover:underline">
                Mozilla Firefox
              </a>
            </li>
            <li>
              <a href="https://support.apple.com/it-it/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-cyan-600 hover:underline">
                Safari
              </a>
            </li>
            <li>
              <a href="https://support.microsoft.com/it-it/microsoft-edge/eliminare-i-cookie-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="text-cyan-600 hover:underline">
                Microsoft Edge
              </a>
            </li>
          </ul>
          <p className="text-gray-700 mt-4 p-4 bg-yellow-50 border-l-4 border-yellow-500">
            ⚠️ <strong>Attenzione:</strong> Disabilitare i cookie tecnici potrebbe compromettere 
            il corretto funzionamento del sito (es. non potrai effettuare il login).
          </p>
        </section>

        {/* 10. Minori */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-blue-deep mb-4">
            10. Protezione dei Minori
          </h2>
          <p className="text-gray-700 mb-4">
            I nostri servizi sono rivolti a minori (6-21 anni) ma la registrazione deve essere 
            effettuata esclusivamente da un genitore o tutore legale.
          </p>
          <div className="bg-red-50 border border-red-200 p-6 rounded-lg">
            <h3 className="font-semibold text-red-800 mb-3">⚠️ Importante:</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• Solo genitori/tutori possono creare account</li>
              <li>• I minori NON possono registrarsi autonomamente</li>
              <li>• Il consenso del genitore è obbligatorio per tutti i trattamenti</li>
              <li>• I dati medici dei minori sono trattati con la massima riservatezza</li>
              <li>• L'accesso ai dati dei minori è limitato a personale autorizzato</li>
            </ul>
          </div>
        </section>

        {/* 11. Modifiche Policy */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-blue-deep mb-4">
            11. Modifiche a Questa Policy
          </h2>
          <p className="text-gray-700 mb-4">
            Potremmo aggiornare questa Privacy Policy per riflettere cambiamenti nei nostri servizi 
            o nella normativa. Ti informeremo di eventuali modifiche sostanziali tramite:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
            <li>Email all'indirizzo registrato</li>
            <li>Avviso sul sito web</li>
            <li>Richiesta di nuovo consenso (se necessario)</li>
          </ul>
          <p className="text-gray-700 mt-4">
            Ti invitiamo a consultare regolarmente questa pagina per rimanere aggiornato.
          </p>
        </section>

        {/* 12. Contatti */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-blue-deep mb-4">
            12. Contattaci
          </h2>
          <p className="text-gray-700 mb-4">
            Per qualsiasi domanda su questa Privacy Policy o sui tuoi dati personali, contattaci:
          </p>
          <div className="bg-blue-light text-white p-6 rounded-lg">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-2">📧 Email</h3>
                <a href="mailto:privacy@sportessence.com" className="hover:underline">
                  privacy@sportessence.com
                </a>
              </div>
              <div>
                <h3 className="font-semibold mb-2">📞 Telefono</h3>
                <a href="tel:3420394661" className="hover:underline">
                  342 039 4661
                </a>
              </div>
              <div>
                <h3 className="font-semibold mb-2">📍 Indirizzo</h3>
                <p>[INSERIRE INDIRIZZO COMPLETO SEDE LEGALE]</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">⏱️ Tempi di Risposta</h3>
                <p>Entro 30 giorni dalla richiesta</p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <div className="mt-12 pt-6 border-t-2 border-gray-200">
          <p className="text-center text-gray-600 mb-4">
            Questa Privacy Policy è stata aggiornata il {new Date().toLocaleDateString('it-IT')}
          </p>
          <div className="text-center">
            <Link 
              href="/" 
              className="inline-block bg-cyan-600 text-white px-6 py-3 rounded-lg hover:bg-cyan-700 transition font-semibold"
            >
              Torna alla Home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}