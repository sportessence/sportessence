export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-cream py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8 md:p-12">
        <h1 className="text-4xl font-bold text-blue-deep mb-6">
          Informativa sulla Privacy
        </h1>
        
        <p className="text-sm text-gray-600 mb-8">
          Ultimo aggiornamento: 20 Dicembre 2025
        </p>

        {/* Introduzione */}
        <section className="mb-8">
          <p className="text-gray-700 leading-relaxed">
            La presente informativa sulla privacy descrive come SPORTESSENCE ASD APS
            (di seguito "noi", "ci" o "nostro") raccoglie, utilizza e protegge i dati
            personali degli utenti del sito web sportessence.it (di seguito il "Sito").
          </p>
          <p className="text-gray-700 leading-relaxed mt-4">
            Questa informativa è redatta ai sensi del Regolamento UE 2016/679 (GDPR)
            e del D.Lgs. 196/2003 come modificato dal D.Lgs. 101/2018.
          </p>
        </section>

        {/* Titolare del trattamento */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-blue-deep mb-4">
            1. Titolare del Trattamento
          </h2>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-gray-700">
              <strong>SPORTESSENCE ASD APS</strong><br />
              Indirizzo: [Inserire indirizzo sede legale]<br />
              P.IVA: [Inserire P.IVA]<br />
              Email: sportessence.asd.aps@gmail.com<br />
              Telefono: 342 039 4661
            </p>
          </div>
        </section>

        {/* Dati raccolti */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-blue-deep mb-4">
            2. Dati Personali Raccolti
          </h2>
          <p className="text-gray-700 mb-4">Raccogliamo le seguenti categorie di dati:</p>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold text-blue-deep mb-2">
                2.1 Dati di Registrazione
              </h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li>Nome e cognome</li>
                <li>Indirizzo email</li>
                <li>Codice fiscale</li>
                <li>Numero di telefono</li>
                <li>Indirizzo di residenza (via, civico, CAP, comune, provincia)</li>
                <li>Email di contatto alternativa (opzionale)</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-blue-deep mb-2">
                2.2 Dati di Autenticazione
              </h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li>Password (criptata)</li>
                <li>Token di sessione</li>
                <li>Data e ora di accesso</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-blue-deep mb-2">
                2.3 Dati di Iscrizione ai Campi
              </h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li>Dati del minore iscritto (nome, cognome, data di nascita, codice fiscale)</li>
                <li>Informazioni sanitarie rilevanti (allergie)</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-blue-deep mb-2">
                2.4 Dati Tecnici
              </h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li>Cookie tecnici (solo per autenticazione)</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Finalità e base giuridica */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-blue-deep mb-4">
            3. Finalità e Base Giuridica del Trattamento
          </h2>
          
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-deep mb-2">
                3.1 Gestione Account e Servizi
              </h3>
              <p className="text-gray-700 text-sm">
                <strong>Finalità:</strong> Creare e gestire il tuo account, fornirti accesso
                ai nostri servizi, gestire iscrizioni ai campi estivi.
              </p>
              <p className="text-gray-700 text-sm mt-2">
                <strong>Base giuridica:</strong> Esecuzione del contratto (Art. 6.1.b GDPR)
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-deep mb-2">
                3.2 Comunicazioni di Servizio
              </h3>
              <p className="text-gray-700 text-sm">
                <strong>Finalità:</strong> Inviarti conferme di iscrizione, promemoria,
                aggiornamenti importanti sui campi, comunicazioni obbligatorie.
              </p>
              <p className="text-gray-700 text-sm mt-2">
                <strong>Base giuridica:</strong> Esecuzione del contratto (Art. 6.1.b GDPR)
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-deep mb-2">
                3.3 Sicurezza e Prevenzione Frodi
              </h3>
              <p className="text-gray-700 text-sm">
                <strong>Finalità:</strong> Proteggere il Sito da accessi non autorizzati,
                prevenire frodi, garantire la sicurezza dei dati.
              </p>
              <p className="text-gray-700 text-sm mt-2">
                <strong>Base giuridica:</strong> Legittimo interesse (Art. 6.1.f GDPR)
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-deep mb-2">
                3.4 Obblighi Legali
              </h3>
              <p className="text-gray-700 text-sm">
                <strong>Finalità:</strong> Adempiere a obblighi fiscali, contabili,
                assicurativi e di legge.
              </p>
              <p className="text-gray-700 text-sm mt-2">
                <strong>Base giuridica:</strong> Obbligo legale (Art. 6.1.c GDPR)
              </p>
            </div>
          </div>
        </section>

        {/* Cookie */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-blue-deep mb-4">
            4. Cookie e Tecnologie Simili
          </h2>
          <p className="text-gray-700 mb-4">
            Il Sito utilizza esclusivamente <strong>cookie tecnici</strong> necessari
            per il funzionamento del servizio:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
            <li>
              <strong>Cookie di autenticazione:</strong> Mantengono attiva la sessione
              dopo il login (Supabase)
            </li>
          </ul>
          <p className="text-gray-700 mt-4">
            <strong>Non utilizziamo:</strong> Cookie di profilazione, cookie di terze parti
            per pubblicità o tracking, analytics invasivi.
          </p>
        </section>

        {/* Condivisione dati */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-blue-deep mb-4">
            5. Condivisione dei Dati
          </h2>
          <p className="text-gray-700 mb-4">
            I tuoi dati personali possono essere condivisi con:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
            <li>
              <strong>Supabase (infrastruttura cloud):</strong> Per hosting database
              e autenticazione. Server ubicati in UE, conformi GDPR.
            </li>
            <li>
              <strong>Provider email:</strong> Per invio comunicazioni di servizio.
            </li>
            <li>
              <strong>Autorità competenti:</strong> Solo se richiesto per legge
              (ordini giudiziari, verifiche fiscali, etc.).
            </li>
          </ul>
          <p className="text-gray-700 mt-4 font-semibold">
            Non vendiamo né cediamo i tuoi dati a terzi per scopi commerciali.
          </p>
        </section>

        {/* Conservazione */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-blue-deep mb-4">
            6. Conservazione dei Dati
          </h2>
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
            <p className="text-gray-700">
              <strong>Account attivi:</strong> I dati vengono conservati finché
              mantieni attivo il tuo account.
            </p>
            <p className="text-gray-700 mt-2">
              <strong>Account cancellati:</strong> I dati vengono eliminati entro
              90 giorni dalla richiesta di cancellazione, salvo obblighi legali
              (es. dati fiscali conservati per 10 anni).
            </p>
            <p className="text-gray-700 mt-2">
              <strong>Dati dei minori:</strong> Documenti e consensi vengono
              conservati per tutta la durata del servizio + 5 anni per finalità
              assicurative e legali.
            </p>
          </div>
        </section>

        {/* Diritti GDPR */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-blue-deep mb-4">
            7. I Tuoi Diritti (GDPR)
          </h2>
          <p className="text-gray-700 mb-4">
            Hai diritto di esercitare i seguenti diritti sui tuoi dati personali:
          </p>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="border border-gray-200 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-deep mb-2">✅ Accesso</h3>
              <p className="text-sm text-gray-700">
                Ottenere conferma dei dati trattati e riceverne copia.
              </p>
            </div>

            <div className="border border-gray-200 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-deep mb-2">✏️ Rettifica</h3>
              <p className="text-sm text-gray-700">
                Correggere dati inesatti o incompleti.
              </p>
            </div>

            <div className="border border-gray-200 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-deep mb-2">🗑️ Cancellazione</h3>
              <p className="text-sm text-gray-700">
                Richiedere la cancellazione dei tuoi dati ("diritto all'oblio").
              </p>
            </div>

            <div className="border border-gray-200 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-deep mb-2">📦 Portabilità</h3>
              <p className="text-sm text-gray-700">
                Ricevere i dati in formato strutturato e trasferirli ad altro titolare.
              </p>
            </div>

            <div className="border border-gray-200 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-deep mb-2">🚫 Opposizione</h3>
              <p className="text-sm text-gray-700">
                Opporti al trattamento basato su legittimo interesse.
              </p>
            </div>
          </div>

          <div className="mt-6 bg-cyan-50 p-4 rounded-lg">
            <p className="font-semibold text-blue-deep mb-2">
              Come esercitare i tuoi diritti:
            </p>
            <p className="text-gray-700 text-sm">
              Invia una richiesta via email a:{" "}
              <a
                href="mailto:sportessence.asd.aps@gmail.com"
                className="text-cyan-600 underline font-semibold"
              >
                sportessence.asd.aps@gmail.com
              </a>
            </p>
            <p className="text-gray-700 text-sm mt-2">
              Risponderemo entro <strong>30 giorni</strong> dalla richiesta.
              Potremmo chiederti documenti per verificare la tua identità.
            </p>
          </div>
        </section>

        {/* Sicurezza */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-blue-deep mb-4">
            8. Sicurezza dei Dati
          </h2>
          <p className="text-gray-700 mb-4">
            Adottiamo misure tecniche e organizzative per proteggere i tuoi dati:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
            <li>Connessioni HTTPS crittografate (SSL/TLS)</li>
            <li>Password crittografate con algoritmi robusti</li>
            <li>Database con accesso autenticato e Row Level Security (RLS)</li>
            <li>Backup regolari e ridondanza geografica</li>
            <li>Protezione anti-bot (reCAPTCHA) nei form</li>
            <li>Monitoraggio accessi e log di sicurezza</li>
          </ul>
        </section>

        {/* Minori */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-blue-deep mb-4">
            9. Dati dei Minori
          </h2>
          <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded">
            <p className="text-gray-700 font-semibold mb-2">
              ⚠️ Attenzione: Servizio per maggiorenni
            </p>
            <p className="text-gray-700 text-sm">
              Il Sito è destinato esclusivamente a utenti maggiorenni (18+ anni).
              La registrazione richiede la capacità di agire.
            </p>
            <p className="text-gray-700 text-sm mt-2">
              I dati dei minori (partecipanti ai campi) vengono raccolti e trattati
              solo previa autorizzazione dei genitori/tutori legali.
            </p>
          </div>
        </section>

        {/* Modifiche */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-blue-deep mb-4">
            10. Modifiche all'Informativa
          </h2>
          <p className="text-gray-700">
            Ci riserviamo il diritto di modificare questa informativa in qualsiasi
            momento. Le modifiche saranno pubblicate su questa pagina con data
            aggiornata. Ti consigliamo di consultare periodicamente questa pagina.
          </p>
          <p className="text-gray-700 mt-4">
            In caso di modifiche sostanziali, ti invieremo una notifica via email.
          </p>
        </section>

        {/* Reclami */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-blue-deep mb-4">
            11. Reclami e Autorità Garante
          </h2>
          <p className="text-gray-700 mb-4">
            Se ritieni che il trattamento dei tuoi dati violi il GDPR, hai diritto
            di presentare reclamo all'autorità di controllo:
          </p>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="font-semibold text-blue-deep">
              Garante per la Protezione dei Dati Personali
            </p>
            <p className="text-sm text-gray-700 mt-2">
              Sito web:{" "}
              <a
                href="https://www.garanteprivacy.it"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-600 underline"
              >
                www.garanteprivacy.it
              </a>
            </p>
            <p className="text-sm text-gray-700">
              Email: garante@gpdp.it
            </p>
            <p className="text-sm text-gray-700">
              PEC: protocollo@pec.gpdp.it
            </p>
          </div>
        </section>

        {/* Contatti */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-blue-deep mb-4">
            12. Contatti
          </h2>
          <p className="text-gray-700 mb-4">
            Per qualsiasi domanda relativa a questa informativa o al trattamento
            dei tuoi dati personali, contattaci:
          </p>
          <div className="bg-cyan-50 p-6 rounded-lg">
            <p className="font-semibold text-blue-deep text-lg mb-3">
              SPORTESSENCE ASD APS
            </p>
            <p className="text-gray-700">
              📧 Email:{" "}
              <a
                href="mailto:sportessence.asd.aps@gmail.com"
                className="text-cyan-600 underline font-semibold"
              >
                sportessence.asd.aps@gmail.com
              </a>
            </p>
            <p className="text-gray-700 mt-2">
              📞 Telefono:{" "}
              <a
                href="tel:3420394661"
                className="text-cyan-600 underline font-semibold"
              >
                342 039 4661
              </a>
            </p>
          </div>
        </section>

        {/* Footer */}
        <div className="border-t pt-6 mt-8">
          <p className="text-xs text-gray-500 text-center">
            Questa informativa è conforme al Regolamento UE 2016/679 (GDPR) e al
            D.Lgs. 196/2003 come modificato dal D.Lgs. 101/2018.
          </p>
        </div>
      </div>
    </main>
  );
}