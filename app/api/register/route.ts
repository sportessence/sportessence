import type { NextApiRequest, NextApiResponse } from "next";
import connectDB from "@/app/lib/db";
import User from "@/app/lib/models/User";
import bcrypt from "bcryptjs";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST")
    return res.status(405).json({ success: false, message: "Metodo non consentito" });

  try {
    await connectDB();

    const { nome, cognome, email, CF, telefono, emailContatti, residenza, password } = req.body;

    // Controlli base
    if (!nome || !cognome || !email || !CF || !telefono || !password) {
      return res.status(400).json({ success: false, message: "Dati mancanti" });
    }

    // Controllo email/telefono già esistenti
    const existing = await User.findOne({ $or: [{ email }, { telefono }, { CF }] });
    if (existing) {
      let field = existing.email === email ? "Email" : existing.telefono === telefono ? "Telefono" : "Codice Fiscale";
      return res.status(400).json({ success: false, message: `${field} già registrato` });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      nome,
      cognome,
      email,
      CF,
      telefono,
      emailContatti,
      residenza,
      password: hashedPassword,
      figli: [],
    });

    return res.status(201).json({ success: true, message: "Registrazione completata!", userId: newUser._id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Errore server" });
  }
}
