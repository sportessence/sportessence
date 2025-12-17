import { createClient } from "@/app/utils/supabase/server";
import { redirect } from "next/navigation";

// ✅ IMPORTANTE: Disabilita cache
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  
  // ✅ Controllo auth nel layout - TUTTE le pagine admin passano da qui
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    console.log("❌ Admin Layout: No user, redirecting to login");
    redirect('/Login');
  }

  // ✅ Controllo admin
  const { data: adminCheck } = await supabase
    .from('admins_whitelist')
    .select('id')
    .eq('id', user.id)
    .single();

  if (!adminCheck) {
    console.log("❌ Admin Layout: User is not admin, redirecting to home");
    redirect('/');
  }

  // ✅ Se arriviamo qui, l'utente è admin verificato
  return (
    <div>
      {/* Header Admin (opzionale) */}
      <div className="bg-blue-900 text-white py-2 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <p className="text-sm">
            👤 Admin: <span className="font-semibold">{user.email}</span>
          </p>
          <p className="text-xs text-gray-300">Pannello Amministratore</p>
        </div>
      </div>
      
      {/* Contenuto pagina admin */}
      {children}
    </div>
  );
}