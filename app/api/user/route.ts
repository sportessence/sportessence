import User from "@/app/lib/models/User";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = cookies();
  const userId = (await cookieStore).get("userId")?.value;

  if (!userId) return NextResponse.json({ role: "guest" });

  const user = await User.findById(userId).select("ruolo");
  return NextResponse.json({ role: user?.ruolo || "user" });
}
