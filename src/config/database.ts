import mongoose from "mongoose";

export async function connectDatabase(uri = process.env.MONGODB_URI) {
  if (!uri) {
    throw new Error("La variable MONGODB_URI es obligatoria");
  }

  await mongoose.connect(uri);
  console.log("Conexión a MongoDB establecida");
}

export async function disconnectDatabase() {
  await mongoose.disconnect();
}
