// controllers/auth.controller.js
import UserModel from "../models/users.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


// ➤ Créer un utilisateur
export const Register = async (req, res) => {
  try {
    const { username, email, password, role, telephone, salonId } = req.body;
    console.log("REQ.BODY:", req.body);

    const exists = await UserModel.findOne({
      $or: [{ email }, { username }],
    });

    if (exists) {
      return res.status(400).json({ message: "Email ou username déjà utilisé" });
    }

    const hash = await bcrypt.hash(password, 10);
     let finalSalonId = null;
if (req.user && req.user.role === "superadmin") {
      finalSalonId = salonId || null;
    }

    const newUser = await UserModel.create({
      username,
      email,
      password: hash,
      role: role || "client",
      telephone: telephone || null,
      salonId: finalSalonId,
      createdBy: req.user ? req.user._id : null, // 🔥 correction OBLIGATOIRE
    });

    console.log(newUser)

    return res.status(201).json({
      message: "Utilisateur créé avec succès",
      user: {
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        telephone: newUser.telephone,
        salonId: newUser.salonId,
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

    // Validation basique
    if (!identifier || !password) {
      return res.status(400).json({ message: "Identifiant et mot de passe requis" });
    }

    // Recherche insensible à la casse pour email ET username
    const user = await UserModel.findOne({
      $or: [
        { email: { $regex: new RegExp("^" + identifier + "$", "i") } },
        { username: { $regex: new RegExp("^" + identifier + "$", "i") } },
      ],
    });

    if (!user) {
      // Message générique pour éviter l'énumération d'utilisateurs
      return res.status(401).json({ message: "Identifiant ou mot de passe incorrect" });
    }

    // Vérification du mot de passe
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ message: "Identifiant ou mot de passe incorrect" });
    }

    // Payload JWT : on met l'ID + rôle + salonId (important pour les gérants !)
    const payload = {
      id: user._id,
      role: user.role,
    };
    

    // Ajoute salonId seulement s'il existe (pour les gérants)
    if (user.salonId) {
      payload.salonId = user.salonId;
    }

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });

    // Réponse claire pour le frontend
    const userResponse = {
      _id: user._id,
      username: user.username,
      email: user.email,
      telephone: user.telephone,
      role: user.role,
      salonId: user.salonId || null,
    };

    return res.status(200).json({
      message: "Connexion réussie",
      token,
      user: userResponse,
      redirect:
        user.role === "superadmin"
          ? "/dashboard/superadmin"
          : user.role === "admin"
          ? "/dashboard/admin"
          : user.role === "gerant"
          ? "/dashboard/gerant"
          : "/app",
    });
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


// ➤ Récupérer tous les gérants
export const getAllGerants = async (req, res) => {
  try {
    const gerants = await UserModel.find({ role: "gerant" }).select("-password");

    return res.status(200).json(gerants);
  } catch (error) {
    console.error("GET GERANTS ERROR:", error);
    return res.status(500).json({ message: "Erreur serveur" });
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



