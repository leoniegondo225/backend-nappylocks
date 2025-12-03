// controllers/auth.controller.js
import UserModel from "../models/users.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


// ➤ Créer un utilisateur
export const Register = async (req, res) => {
  try {
    const { username, email, password, role, telephone } = req.body;
    console.log("REQ.BODY:", req.body);

   // Vérifier email + username uniques
    const exists = await UserModel.findOne({
      $or: [{ email }, { username }],
    });

    if (exists) {
      return res.status(400).json({ message: "Email ou username déjà utilisé" });
    }

     const hash = await bcrypt.hash(password, 10);

    // Création de l'utilisateur
    const newUser = await UserModel.create({
      username,
      email,
      password: hash,
      role: role || "client",
      telephone: telephone || null,
      createdBy: req.user._id,
    });

    return res.status(201).json({
      message: "Utilisateur créé avec succès",
      user: {
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
         telephone: newUser.telephone,
      },
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};


// ➤ LOGIN
export const Login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

      // identifier = email OU username
    const user = await UserModel.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    });

     if (!user) {
      return res.status(400).json({ message: "Utilisateur introuvable" });
    }

   
 const match = await bcrypt.compare(password, user.password);

     if (!match) {
      return res.status(400).json({ message: "Mot de passe incorrect" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

     // 🔥 IMPORTANT : renvoyer un user clair
    const userResponse = {
      _id: user._id,
      email: user.email,
      username: user.username,
      telephone: user.telephone,
      role: user.role,
      createdAt: user.createdAt,
    };

    return res.status(200).json({
      message: "Connexion réussie",
      token,
      role: user.role,
        user: userResponse,
      redirect:
        user.role === "superadmin"
          ? "/dashboard/superadmin"
          : user.role === "admin"
          ? "/dashboard/admin"
          : user.role === "gerant"
          ? "/dashboard/gerant"
          : "/app",
        })
      
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

// Récupérer tous les utilisateurs créés par le superadmin
export const getAllUsers = async (req, res) => {
  try {
    // Si tu veux que chaque superadmin ne voie que ses utilisateurs
    const users = await UserModel.find({ createdBy: req.user._id }).select("-password"); // exclure le mot de passe

    res.status(200).json(users);
  } catch (error) {
    console.error("GET USERS ERROR:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};


// ➤ Obtenir tous les utilisateurs
// export const GetAllUtilisateurs = async (req, res) => {
//   try {
//     const utilisateurs = await UserModel.find();
//     return res.status(200).json(utilisateurs);
//   } catch (error) {
//     return res.status(500).json({ message: "Erreur lors de la récupération", error: error.message });
//   }
// };


// ➤ Obtenir un utilisateur par ID
// export const GetByIDUtilisateur = async (req, res) => {
//   try {
//     const utilisateur = await UserModel.findById(req.params.id);

//     if (!utilisateur) {
//       return res.status(404).json({ message: "Utilisateur non trouvé" });
//     }

//     return res.status(200).json(utilisateur);
//   } catch (error) {
//     return res.status(500).json({ message: "Erreur lors de la récupération", error: error.message });
//   }
// };


// ➤ Mettre à jour un utilisateur
// export const UpdateUtilisateur = async (req, res) => {
//   try {
//     // Empêcher de devenir superadmin via update
//     if (req.body.role === "superadmin") {
//       return res.status(403).json({ message: "Modification en superadmin interdite" });
//     }

//     // Si un mot de passe est envoyé → on le hash
//     if (req.body.password) {
//       req.body.password = await bcrypt.hash(req.body.password, 10);
//     }

//     const utilisateur = await UserModel.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true, runValidators: true }
//     );

//     if (!utilisateur) {
//       return res.status(404).json({ message: "Utilisateur non trouvé" });
//     }

//     return res.status(200).json({ message: "Utilisateur mis à jour", data: utilisateur });
//   } catch (error) {
//     return res.status(500).json({ message: "Erreur lors de la mise à jour", error: error.message });
//   }
// };


// ➤ Supprimer un utilisateur
// export const DeleteUtilisateur = async (req, res) => {
//   try {
//     const utilisateur = await UserModel.findByIdAndDelete(req.params.id);

//     if (!utilisateur) {
//       return res.status(404).json({ message: "Utilisateur non trouvé" });
//     }

//     return res.status(200).json({ message: "Utilisateur supprimé" });
//   } catch (error) {
//     return res.status(500).json({ message: "Erreur lors de la suppression", error: error.message });
//   }
// };



