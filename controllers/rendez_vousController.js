import UserModel from "../models/users.js";
import ServiceModel from "../models/services.js";
import RendezvousModel from "../models/rendez_vous.js";

// ▶ Créer un rendez-vous
export const CreeRendezvous = async (req, res) => {
  try {
    const { userId, serviceId, salonId, date, startTime, endTime, notes } = req.body;

    if (!userId || !serviceId || !salonId || !date || !startTime || !endTime) {
      return res.status(400).json({ message: "Tous les champs obligatoires doivent être fournis." });
    }
// Notification SMS
    await createNotification({
      userId: user._id,
      channel: "sms",
      message: `Votre rendez-vous pour ${service.name} est confirmé le ${appointment.date}`,
      meta: { phone: user.phone }
    });

    // Vérif user
    const user = await UserModel.findById(userId);
    if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });

    // Vérif service
    const service = await ServiceModel.findById(serviceId);
    if (!service) return res.status(404).json({ message: "Service introuvable" });

    // Vérif styliste (si styliste = user avec role="stylist")
    const salon = await UserModel.findById(salonId);
    if (!salon) return res.status(404).json({ message: "Styliste introuvable" });

    const rendezvous = await RendezvousModel.create({
      userId,
      serviceId,
      salonId,
      date,
      startTime,
      endTime,
      notes
    });

    res.status(201).json({ message: "Rendez-vous créé avec succès", rendezvous });

  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// ▶ Obtenir tous les rendez-vous
export const GetAllRendezvouss = async (req, res) => {
  try {
    const rendezvouss = await RendezvousModel.find()
      .populate("userId", "username email")
      .populate("serviceId", "name price durationMinutes")
      .populate("stylistId", "username email");

    res.status(200).json(rendezvouss);

  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// ▶ Obtenir un rendez-vous par ID
export const GetRendezvousByID = async (req, res) => {
  try {
    const rendezvous = await RendezvousModel.findById(req.params.id)
      .populate("userId", "username email")
      .populate("serviceId", "name price durationMinutes")
      .populate("salonId", "username email");

    if (!rendezvous)
      return res.status(404).json({ message: "Rendez-vous introuvable" });

    res.status(200).json(rendezvous);

  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// ▶ Mettre à jour un rendez-vous
export const UpdateRendezvous = async (req, res) => {
  try {
    const rendezvous = await RendezvousModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!rendezvous)
      return res.status(404).json({ message: "Rendez-vous introuvable" });

    res.status(200).json({ message: "Rendez-vous mis à jour", rendezvous });

  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// ▶ Supprimer un rendez-vous
export const DeleteRendezvous = async (req, res) => {
  try {
    const rendezvous = await RendezvousModel.findByIdAndDelete(req.params.id);

    if (!rendezvous)
      return res.status(404).json({ message: "Rendez-vous introuvable" });

    res.status(200).json({ message: "Rendez-vous supprimé" });

  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};
