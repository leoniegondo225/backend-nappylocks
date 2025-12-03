import bcrypt from "bcrypt";
import UserModel from "../models/users.js";

export const initSuperAdmin = async () => {
  try {
    const { 
      SUPERADMIN_USERNAME, 
      SUPERADMIN_EMAIL, 
      SUPERADMIN_PASSWORD 
    } = process.env;

    if (!SUPERADMIN_USERNAME || !SUPERADMIN_EMAIL || !SUPERADMIN_PASSWORD) {
      console.error("❌ Les variables SUPERADMIN_* ne sont pas définies dans le fichier .env");
      return;
    }

    const exists = await UserModel.findOne({ role: "superadmin" });

    if (exists) {
      console.log("✔ SuperAdmin déjà existant");
      return;
    }

    const hashed = await bcrypt.hash(SUPERADMIN_PASSWORD, 10);

    await UserModel.create({
      username: SUPERADMIN_USERNAME,
      email: SUPERADMIN_EMAIL,
      password: hashed,
      role: "superadmin",
    });

    console.log("🔥 SuperAdmin créé automatiquement  !");
  } catch (error) {
    console.error("Erreur lors de l'initialisation du SuperAdmin :", error);
  }
};
