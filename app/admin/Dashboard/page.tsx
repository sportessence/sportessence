import { createClient } from "@/app/utils/supabase/server";
import { redirect } from "next/navigation";

// ✅ IMPORTANTE: Disabilita cache per pagine protette
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminDashboard() {
  const supabase = await createClient();
  
  // ✅ LIVELLO 1: Verifica autenticazione
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    console.log("❌ Dashboard: No user found, redirecting to login");
    redirect('/Login');
  }

  // ✅ LIVELLO 2: Verifica che sia admin
  const { data: adminCheck, error: adminError } = await supabase
    .from('admins_whitelist')
    .select('id')
    .eq('id', user.id)
    .single();

  if (adminError || !adminCheck) {
    console.log("❌ Dashboard: User is not admin, redirecting to home");
    redirect('/');
  }

  // ✅ LIVELLO 3: Se arriviamo qui, l'utente è un admin verificato
  console.log("✅ Dashboard: Admin verified:", user.email);

  // Carica dati admin (protetti da RLS)
  const { data: profiles } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  const { data: enrollments } = await supabase
    .from('enrollments')
    .select('*, children(*), camps(*)')
    .order('created_at', { ascending: false })
    .limit(10);

  // Statistiche
  const totalUsers = profiles?.length || 0;
  const totalEnrollments = enrollments?.length || 0;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-900 mb-8">Dashboard Admin</h1>

        {/* Card Statistiche */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600 text-sm">Utenti Totali</p>
            <p className="text-3xl font-bold text-blue-900">{totalUsers}</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600 text-sm">Iscrizioni Recenti</p>
            <p className="text-3xl font-bold text-blue-900">{totalEnrollments}</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600 text-sm">Utente Loggato</p>
            <p className="text-sm font-semibold text-green-600">{user.email}</p>
          </div>
        </div>

        {/* Lista Utenti */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-blue-900 mb-4">Utenti Registrati</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Nome</th>
                  <th className="text-left py-2">Email</th>
                  <th className="text-left py-2">Telefono</th>
                  <th className="text-left py-2">Registrato il</th>
                </tr>
              </thead>
              <tbody>
                {profiles?.map((profile) => (
                  <tr key={profile.id} className="border-b hover:bg-gray-50">
                    <td className="py-3">{profile.nome} {profile.cognome}</td>
                    <td className="py-3">{profile.email}</td>
                    <td className="py-3">{profile.telefono}</td>
                    <td className="py-3">
                      {new Date(profile.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Iscrizioni Recenti */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-blue-900 mb-4">Iscrizioni Recenti</h2>
          <div className="space-y-3">
            {enrollments?.map((enrollment) => (
              <div key={enrollment.id} className="flex justify-between items-center border-b pb-2">
                <div>
                  <p className="font-semibold">
                    {enrollment.children?.nome} {enrollment.children?.cognome}
                  </p>
                  <p className="text-sm text-gray-600">
                    {enrollment.camps?.nome} - {new Date(enrollment.created_at).toLocaleDateString()}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded text-sm font-semibold ${
                  enrollment.saldata 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {enrollment.saldata ? 'Saldata' : 'Da saldare'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}