import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/app/lib/db";
import User from "@/app/lib/models/User";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email e password richieste" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email }).lean();
    console.log(user)
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Utente non trovato" },
        { status: 401 }
      );
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json(
        { success: false, message: "Password errata" },
        { status: 401 }
      );
    }

    // Creiamo cookie di sessione
    const cookieData = JSON.stringify({
      id: user._id,
      ruolo: user.admin? "admin" : "user", 
    });

    const res = NextResponse.json({
      success: true,
      message: "Login effettuato!",
      userId: user._id,
    });

    res.cookies.set("session", cookieData, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 2,
    });

    return res;
  } catch (err) {
    console.error("Errore login:", err);
    return NextResponse.json(
      { success: false, message: "Errore server" },
      { status: 500 }
    );
  }
}
