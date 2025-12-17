import { createClient } from "../../utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  // Se c'è un parametro 'next', usalo per il redirect, altrimenti vai in home
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Se qualcosa va storto, torna alla login con errore
  return NextResponse.redirect(`${origin}/Login?error=auth-code-error`);
}