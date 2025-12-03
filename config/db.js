import mongoose from "mongoose";

export const ConnectDB = async () => {
  try {
    const url = process.env.mongoURI;
    const mongoCompass = process.env.mongoCompass;

    if (mongoose.connection.readyState === 1) {
      console.log("Déjà connecté à la base de donnée");
      return "ok";
    }

    await mongoose.connect(mongoCompass, {
      dbName: "NappyLocks",
    });

    console.log("Connexion à la base de donnée réussie avec succès !");
    return "ok";
  } catch (error) {
    console.log("Erreur de connexion :", error);
    return "problème de connexion à la bd";
  }
};
