// controllers/profileController.js
import bcrypt from "bcrypt";
import path from "path";
import fs from "fs";
import UserModel from "../models/users.js";


const SALT_ROUNDS = 10;

// GET /api/me
export const getProfile = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });
    return res.json({ user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

// PUT /api/me  -- update profile (username, email, telephone)
export const updateProfile = async (req, res) => {
  try {
    const { username, email, telephone } = req.body;
    console.log("Données reçues dans req.body :", req.body);

    const userId = req.user.id;

    const user = await UserModel.findById(userId);
    if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });

    // Vérification du username
    if (username && username !== user.username) {
      const exists = await UserModel.findOne({ username });
      if (exists) return res.status(409).json({ message: "Username déjà utilisé" });
      user.username = username;
    }

    // Vérification de l'email
    if (email && email.toLowerCase() !== user.email) {
      const exists = await UserModel.findOne({ email: email.toLowerCase() });
      if (exists) return res.status(409).json({ message: "Email déjà utilisé" });

      user.email = email.toLowerCase();
      user.verified = false; 
    }

   if (telephone !== undefined && telephone !== null && telephone !== "") {
  user.telephone = telephone;
}


    await user.save();

    console.log("User updated:", user);
    
    return res.json({
      message: "Profil mis à jour",
      user: user.toJSON()
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};


// PATCH /api/me/password  -- requires currentPassword + newPassword
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) return res.status(400).json({ message: "currentPassword et newPassword requis" });

    const user = await UserModel.findById(req.user.id).select("+password");
    if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });

    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) return res.status(401).json({ message: "Mot de passe actuel incorrect" });

    const hash = await bcrypt.hash(newPassword, SALT_ROUNDS);
    user.password = hash;
    await user.save();

    return res.json({ message: "Mot de passe mis à jour" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

// PATCH /api/me/avatar  -- upload single file 'avatar'
export const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "Fichier avatar manquant" });

    const user = await UserModel.findById(req.user.id);
    if (!user) {
      // delete uploaded file if user not found
      fs.unlinkSync(req.file.path);
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    // Optionnel : supprimer ancien avatar local
    if (user.avatar) {
      try {
        const oldPath = path.join(__dirname, "..", user.avatar);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      } catch (e) {
        // ignore
      }
    }

    // Stocker chemin relatif (ex: 'uploads/avatars/12345_123.png')
    const relativePath = path.relative(path.join(__dirname, ".."), req.file.path).replace(/\\/g, "/");
    user.avatar = relativePath;
    await user.save();

    return res.json({ message: "Avatar mis à jour", avatar: user.avatar });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};
