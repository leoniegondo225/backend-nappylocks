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
    res.status(500).json({ message: error.message });
  }
};

// Modifier un salon (SuperAdmin)
export const updateSalon = async (req, res) => {
  try {
    const { nom, address, ville, telephone, email, pays, status } = req.body;

    const salon = await SalonModel.findByIdAndUpdate(
      req.params.id,
      { nom, address, ville, telephone, email, pays, status },
      { new: true }
    );

    if (!salon)
      return res.status(404).json({ message: "Salon introuvable" });

    res.json({
      message: "Salon mis à jour",
      salon,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Supprimer un salon (SuperAdmin)
export const deleteSalon = async (req, res) => {
  try {
    const salon = await SalonModel.findByIdAndDelete(req.params.id);

    if (!salon) return res.status(404).json({ message: "Salon introuvable" });

    res.json({ message: "Salon supprimé" });
  } catch (error) {
    res.status(500).json({ message: error.message });
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
