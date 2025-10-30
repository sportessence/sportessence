import bcrypt from "bcryptjs";
import connectDB from "@/app/lib/db";
import User from "@/app/lib/models/User";

export async function POST(req:Request) {
  try {
    await connectDB();

    const body = await req.json();
    const { nome, cognome, email, CF, telefono, emailContatti, residenza, password } = body;

    console.log(body)

    // Controlli base
    if (!nome || !cognome || !email || !CF || !telefono || !password) {
      return Response.json(
        { success: false, message: "Dati mancanti" },
        { status: 400 }
      );
    }

    // Controllo esistenza
    const existing = await User.findOne({ $or: [{ email }, { telefono }, { CF }] });
    if (existing) {
      let field =
        existing.email === email
          ? "Email"
          : existing.telefono === telefono
          ? "Telefono"
          : "Codice Fiscale";

      return Response.json(
        { success: false, message: `Utente con ${field} già registrato` },
        { status: 400 }
      );
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

    return Response.json(
      { success: true, message: "Registrazione completata!", userId: newUser._id },
      { status: 201 }
    );
  } catch (err) {
    console.error("Errore server:", err);
    return Response.json(
      { success: false, message: "Errore server" },
      { status: 500 }
    );
  }
}
