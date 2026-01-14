export default function MaintenancePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4 text-center">
      <h1 className="text-4xl md:text-6xl font-bold mb-6">🚧 Stiamo Lavorando per Voi</h1>
      <p className="text-xl md:text-2xl mb-8 max-w-2xl">
        Sport Essence sta preparando la nuova stagione. <br/>
        Il sito tornerà online a breve per le iscrizioni.
      </p>
      <div className="animate-pulse bg-blue-600 px-6 py-3 rounded-full font-semibold">
        Torneremo presto!
      </div>
    </div>
  )
}