import RdvModel from "../models/rdv.js";
import { generateSlots, OPENING_HOURS } from "../utils/slots.js";

/**
 * ==========================
 * CRÉER RDV EN LIGNE
 * ==========================
 */
export const CreateRdvOnline = async (req, res) => {
  try {
    const { clientId, salonId, date, time, service, coiffeur, notes } = req.body;

    // Vérifier conflit
    const conflict = await RdvModel.findOne({
      salonId,
      date,
      time,
      status: { $ne: "CANCELLED" },
    });

    if (conflict) {
      return res
        .status(409)
        .json({ message: "Oups 😅 ce créneau est déjà pris" });
    }

    const rdv = await RdvModel.create({
      clientId,
      salonId,
      date,
      time,
      service,
      coiffeur,
      notes,
      source: "ONLINE",
      status: "PENDING",
    });

    res.status(201).json(rdv);
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la création du RDV en ligne",
      error: error.message,
    });
  }
};

/**
 * ==========================
 * CRÉER RDV AU SALON (GÉRANT)
 * ==========================
 */
export const CreateRdvSalon = async (req, res) => {
  try {
    const gerantId = req.user.id;
    const { clientId, salonId, date, time, service, coiffeur, notes } = req.body;

    const conflict = await RdvModel.findOne({
      salonId,
      date,
      time,
      status: { $ne: "CANCELLED" },
    });

    if (conflict) {
      return res
        .status(409)
        .json({ message: "Créneau déjà occupé" });
    }

    const rdv = await RdvModel.create({
      clientId,
      salonId,
      date,
      time,
      service,
      coiffeur,
      notes,
      source: "SALON",
      status: "CONFIRMED",
      createdBy: gerantId,
    });

    res.status(201).json(rdv);
  } catch (error) {
    res.status(500).json({
      message: "Erreur création RDV au salon",
      error: error.message,
    });
  }
};

/**
 * ==========================
 * VOIR LES CRÉNEAUX DISPONIBLES
 * ==========================
 */
export const GetAvailableSlots = async (req, res) => {
  try {
    const { salonId, date } = req.query;

    if (!salonId || !date) {
      return res.status(400).json({
        message: "salonId et date sont requis",
      });
    }

    // RDV déjà pris ce jour-là
    const rdvs = await RdvModel.find({
      salonId,
      date,
      status: { $ne: "CANCELLED" },
    });

    const takenTimes = rdvs.map((r) => r.time);

    // Tous les créneaux possibles
    const allSlots = generateSlots(
      OPENING_HOURS.start,
      OPENING_HOURS.end,
      OPENING_HOURS.step
    );

    // Créneaux encore libres
    const availableSlots = allSlots.filter(
      (slot) => !takenTimes.includes(slot)
    );

    res.json({
      date,
      availableSlots,
      takenTimes,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur récupération créneaux",
      error: error.message,
    });
  }
};

/**
 * ==========================
 * CONFIRMER RDV (CLIENT)
 * ==========================
 */
export const ConfirmRdvByClient = async (req, res) => {
  try {
    const rdv = await RdvModel.findById(req.params.id);

    if (!rdv) {
      return res.status(404).json({ message: "RDV introuvable" });
    }

    if (rdv.clientId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Accès refusé" });
    }

    rdv.status = "CONFIRMED";
    await rdv.save();

    res.json({ message: "RDV confirmé avec succès" });
  } catch (error) {
    res.status(500).json({
      message: "Erreur confirmation RDV",
      error: error.message,
    });
  }
};

/**
 * ==========================
 * ANNULER RDV (CLIENT)
 * ==========================
 */
export const CancelRdvByClient = async (req, res) => {
  try {
    const rdv = await RdvModel.findById(req.params.id);

    if (!rdv) {
      return res.status(404).json({ message: "RDV introuvable" });
    }

    if (rdv.clientId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Accès refusé" });
    }

    const rdvDate = new Date(`${rdv.date}T${rdv.time}`);
    const diffDays =
      (rdvDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24);

    if (diffDays < 2) {
      return res.status(403).json({
        message: "Annulation impossible à moins de 48h",
      });
    }

    rdv.status = "CANCELLED";
    await rdv.save();

    res.json({ message: "RDV annulé avec succès" });
  } catch (error) {
    res.status(500).json({
      message: "Erreur annulation RDV",
      error: error.message,
    });
  }
};
