import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session");

  if (!session) return NextResponse.json({ role: "guest" });

  try {
    const data = JSON.parse(session.value);
    return NextResponse.json({ role: data.ruolo });
  } catch {
    return NextResponse.json({ role: "guest" });
  }
}

export async function POST() {
    const res = NextResponse.json({ success: true });
    res.cookies.set("session", "", { path: "/", maxAge: 0 });
  return res;
}
