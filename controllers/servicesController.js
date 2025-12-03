import ServiceModel from "../models/services.js";


// ▶️ Créer un service
export const CreerService = async (req, res) => {
  try {
    const { nom, description, durationMinutes, prix, restrictions, active } = req.body;

    if (!nom || !description || !durationMinutes || !prix) {
      return res.status(400).json({ message: "Les champs nom, description, durationMinutes et prix sont obligatoires." });
    }

    const service = await ServiceModel.create({
      nom,
      description,
      durationMinutes,
      prix,
      restrictions,
      active
    });

    res.status(201).json({ message: "Service créé avec succès", service });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// ▶️ Obtenir tous les services
export const GetAllServices = async (req, res) => {
  try {
    const services = await ServiceModel.find();
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// ▶️ Obtenir un service par ID
export const GetServiceByID = async (req, res) => {
  try {
    const service = await ServiceModel.findById(req.params.id);

    if (!service) return res.status(404).json({ message: "Service introuvable" });

    res.status(200).json(service);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// ▶️ Mettre à jour un service
export const UpdateService = async (req, res) => {
  try {
    const service = await ServiceModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!service) return res.status(404).json({ message: "Service introuvable" });

    res.status(200).json({ message: "Service mis à jour", service });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// ▶️ Supprimer un service
export const DeleteService = async (req, res) => {
  try {
    const service = await ServiceModel.findByIdAndDelete(req.params.id);

    if (!service) return res.status(404).json({ message: "Service introuvable" });

    res.status(200).json({ message: "Service supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};
