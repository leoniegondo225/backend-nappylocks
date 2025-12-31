// middlewares/auth.js
import jwt from "jsonwebtoken";
import UserModel from "../models/users.js";


export const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token manquant" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await UserModel.findById(decoded.id).select("+salonId +role");

    if (!user) {
      return res.status(401).json({ message: "Utilisateur introuvable" });
    }

    // Garde le document Mongoose tel quel → compatible avec ton contrôleur actuel
    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Token invalide ou expiré" });
  }
};