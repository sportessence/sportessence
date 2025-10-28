import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    nome: { type: String, required: true },
    cognome: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    CF: { type: String, required: true, unique: true },
    telefono: { type: String, required: true },
    emailContatti: { type: String },
    residenza: {
      via: String,
      civico: String,
      paese: String,
      provincia: String,
      CAP: String,
    },
    password: { type: String, required: true },
    figli: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { collection: "Users" } 
);

export default mongoose.models.User || mongoose.model("User", userSchema);
