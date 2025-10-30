import mongoose from "mongoose";

const MONGODB_URI = "mongodb+srv://Vercel-Admin-sportEssenceDB:IInbXKr6WL8cMxzW@sportessencedb.m0ch2vw.mongodb.net/sportEssence";

let isConnected = false;

async function connectDB(){
  if (isConnected) return;

  try {
    await mongoose.connect(MONGODB_URI);
    isConnected = true;
    console.log("Connesso a MongoDB");
  } catch (err) {
    console.error("Errore connessione MongoDB:", err);
    throw err;
  }
};

export default connectDB;
