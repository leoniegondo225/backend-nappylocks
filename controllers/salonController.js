import SalonModel from "../models/Salon.js";

// Créer un salon
export const createSalon = async (req, res) => {
  try {
    const { nom, address, telephone, ville, pays, email } = req.body;

    const salon = await SalonModel.create({
      nom,
      address,
      ville,
      email,
      pays,
      telephone,
      status: "inactive", // Par défaut, le salon est inactif en attendant la validation
    });

    res.status(201).json({
      message: "Salon créé et en attente de validation",
      salon,
    });

  } catch (error) {
    console.error("Erreur création salon :", error);

  if (error.name === "ValidationError") {
    const errors = Object.values(error.errors).map(err => err.message);
    return res.status(400).json({ message: "Données invalides", errors });
  }

  res.status(500).json({ message: "Erreur serveur lors de la création du salon" });
  }
};

// Mettre à jour un salon (SuperAdmin uniquement)
export const updateSalon = async (req, res) => {
  try {
    console.log("données : ",req.body)
    const { nom, address, ville, telephone, email, pays, status } = req.body;
    const { id } = req.params;

    const updatedSalon = await SalonModel.findByIdAndUpdate(
      id,
      {
        nom,
        address,
        ville,
        telephone,
        email,
        pays,
        status,
      },
      { new: true } // renvoie le document mis à jour
    ).select("-__v"); // optionnel : exclure le champ __v

    if (!updatedSalon) {
      return res.status(404).json({ message: "Salon introuvable" });
    }

    // Réponse attendue par le frontend : { salon: { ... } }
    res.status(200).json({
      message: "Salon mis à jour avec succès",
      salon: updatedSalon,
    });
  } catch (error) {
    console.error("UPDATE SALON ERROR:", error);
    res.status(500).json({ message: "Erreur serveur lors de la mise à jour" });
  }
};

// Supprimer un salon (SuperAdmin uniquement)
export const deleteSalon = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedSalon = await SalonModel.findByIdAndDelete(id);

    if (!deletedSalon) {
      return res.status(404).json({ message: "Salon introuvable" });
    }

    // Réponse simple mais claire pour le frontend
    res.status(200).json({
      message: "Salon supprimé avec succès",
      // Pas besoin de renvoyer le salon supprimé, mais tu peux si tu veux
    });
  } catch (error) {
    console.error("DELETE SALON ERROR:", error);
    res.status(500).json({ message: "Erreur serveur lors de la suppression" });
  }
};

// Lister tous les salons (SuperAdmin)
export const getAllSalons = async (req, res) => {
  try {
    const salons = await SalonModel.find(); // ❌ suppression du populate gérant
    res.json(salons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
