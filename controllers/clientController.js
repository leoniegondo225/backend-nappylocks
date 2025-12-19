import ClientModel from "../models/client.js";

// ➤ Créer un nouveau client
export const CreateClient = async (req, res) => {
  try {
    const { prenom, nom, telephone, email, notes } = req.body;

    // Validation des champs obligatoires
    if (!prenom || !nom || !telephone) {
      return res
        .status(400)
        .json({ message: "Prénom, nom et téléphone sont obligatoires." });
    }

    // Vérification que l'utilisateur est authentifié
    if (!req.user || !req.user._id || !req.user.salonId) {
      return res.status(401).json({ message: "Utilisateur non authentifié ou salon inconnu." });
    }

    // Vérifier si le téléphone existe déjà dans ce salon
    const existingClient = await ClientModel.findOne({
      telephone,
      salonId: req.user.salonId,
    });

    if (existingClient) {
      return res
        .status(400)
        .json({ message: "Un client avec ce numéro de téléphone existe déjà dans ce salon." });
    }

    // Création du client avec les champs de traçabilité
    const newClient = await ClientModel.create({
      prenom,
      nom,
      telephone,
      email: email || undefined,
      notes: notes || undefined,
      salonId: req.user.salonId,     // ← Forcé côté serveur
      createdBy: req.user._id,       // ← Qui a créé
    });

    // Optionnel : populate pour renvoyer le nom du créateur
    const populatedClient = await ClientModel.findById(newClient._id)
      .populate("createdBy", "username")
      .lean();

    res.status(201).json({
      message: "Client enregistré avec succès",
      data: populatedClient || newClient,
    });
  } catch (error) {
    console.error("Erreur création client :", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// ➤ Récupérer tous les clients du salon du gérant connecté
export const GetClients = async (req, res) => {
  try {
    if (!req.user || !req.user.salonId) {
      return res.status(401).json({ message: "Utilisateur non authentifié." });
    }
    let query = {};
if (req.user.role !== "superadmin") {
  if (!req.user.salonId) {
    return res.status(401).json({ message: "Utilisateur non authentifié." });
  }
  query = { salonId: req.user.salonId };
}

    const clients = await ClientModel.find({ salonId: req.user.salonId })
      .sort({ createdAt: -1 })
      .populate("createdBy", "username")
      .populate("updatedBy", "username")
      .populate("salonId", "name")
      .lean();

    res.status(200).json(clients);
  } catch (error) {
    console.error("Erreur récupération clients :", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// ➤ Récupérer un client par ID (avec vérification du salon)
export const GetClientById = async (req, res) => {
  try {
    if (!req.user || !req.user.salonId) {
      return res.status(401).json({ message: "Utilisateur non authentifié." });
    }

    const client = await ClientModel.findOne({
      _id: req.params.id,
      salonId: req.user.salonId,
    })
      .populate("createdBy", "username")
      .populate("updatedBy", "username");

    if (!client) {
      return res.status(404).json({ message: "Client non trouvé ou accès refusé." });
    }

    res.status(200).json(client);
  } catch (error) {
    console.error("Erreur récupération client :", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// ➤ Modifier un client
export const UpdateClient = async (req, res) => {
  try {
    const { prenom, nom, telephone, email, notes } = req.body;

    if (!req.user || !req.user._id || !req.user.salonId) {
      return res.status(401).json({ message: "Utilisateur non authentifié." });
    }

    // Mise à jour avec traçabilité
    const client = await ClientModel.findOneAndUpdate(
      {
        _id: req.params.id,
        salonId: req.user.salonId, // Sécurité : on ne modifie que les clients de son salon
      },
      {
        prenom,
        nom,
        telephone,
        email: email || undefined,
        notes: notes || undefined,
        updatedBy: req.user._id,     // ← Qui a modifié
      },
      { new: true, runValidators: true }
    )
      .populate("createdBy", "username")
      .populate("updatedBy", "username");

    if (!client) {
      return res.status(404).json({ message: "Client non trouvé ou accès refusé." });
    }

    res.status(200).json({
      message: "Client mis à jour avec succès",
      data: client,
    });
  } catch (error) {
    console.error("Erreur mise à jour client :", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// ➤ Supprimer un client
export const DeleteClient = async (req, res) => {
  try {
    if (!req.user || !req.user.salonId) {
      return res.status(401).json({ message: "Utilisateur non authentifié." });
    }

    const client = await ClientModel.findOneAndDelete({
      _id: req.params.id,
      salonId: req.user.salonId,
    });

    if (!client) {
      return res.status(404).json({ message: "Client non trouvé ou accès refusé." });
    }

    res.status(200).json({ message: "Client supprimé avec succès" });
  } catch (error) {
    console.error("Erreur suppression client :", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
}; 