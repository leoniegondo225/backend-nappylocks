import RdvModel from "../models/rdv.js";

// Créer un rendez-vous
export const CreateRdv = async (req, res) => {
  try {
    const { clientId, date, time, service, coiffeur, notes } = req.body;

    const newRdv = new Rdv({ clientId, date, time, service, coiffeur, notes });
    await newRdv.save();

    res.status(201).json(newRdv);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la création du rendez-vous", error });
  }
};

// Récupérer tous les rendez-vous avec infos client
export const GetRdvs = async (req, res) => {
  try {
    const rdvs = await RdvModel.find().populate("clientId", "prenom nom telephone email notes");
    res.status(200).json(rdvs);
  } catch (error) {
    res.status(500).json({ message: "Impossible de récupérer les rendez-vous", error });
  }
};

// Récupérer un rendez-vous par ID
export const GetRdvById = async (req, res) => {
  try {
    const rdv = await RdvModel.findById(req.params.id).populate("clientId", "prenom nom telephone email notes");
    if (!rdv) return res.status(404).json({ message: "Rendez-vous non trouvé" });
    res.status(200).json(rdv);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération du rendez-vous", error });
  }
};

// Mettre à jour un rendez-vous
export const UpdateRdv = async (req, res) => {
  try {
    const rdv = await RdvModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!rdv) return res.status(404).json({ message: "Rendez-vous non trouvé" });
    res.status(200).json(rdv);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la mise à jour du rendez-vous", error });
  }
};

// Supprimer un rendez-vous
export const DeleteRdv = async (req, res) => {
  try {
    const rdv = await RdvModel.findByIdAndDelete(req.params.id);
    if (!rdv) return res.status(404).json({ message: "Rendez-vous non trouvé" });
    res.status(200).json({ message: "Rendez-vous supprimé" });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la suppression du rendez-vous", error });
  }
};
