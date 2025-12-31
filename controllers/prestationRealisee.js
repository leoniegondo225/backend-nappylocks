import ClientModel from "../models/client.js";
import EmployeeModel from "../models/employee.js";
import PrestationModel from "../models/prestation.js";
import PrestationRealiseeModel from "../models/PrestationRealiseeSchem.js";

export const createPrestationRealisee = async (req, res) => {
  try {
    const { clientId, serviceId: prestationId, employee: employeeId, price, notes, date } = req.body;

    if (!clientId || !prestationId || !employeeId || !price) {
      return res.status(400).json({ message: "clientId, prestationId, employeeId et price sont obligatoires" });
    }

    const [client, prestation, employee] = await Promise.all([
      ClientModel.findById(clientId),
      PrestationModel.findById(prestationId),
      EmployeeModel.findById(employeeId),
    ]);

    if (!client) return res.status(404).json({ message: "Client non trouvé" });
    if (!prestation) return res.status(404).json({ message: "Prestation non trouvée" });
    if (!employee) return res.status(404).json({ message: "Employé non trouvé" });
    if (!prestation.isActive) return res.status(400).json({ message: "Cette prestation est désactivée" });

    // Création
    const nouvelle = await PrestationRealiseeModel.create({
      clientId,
      prestationId,
      employeeId,
      price: Number(price),
      notes: notes?.trim() || "",
      date: date ? new Date(date) : new Date(),
    });

    // Mise à jour des stats du client
    await ClientModel.findByIdAndUpdate(clientId, {
      $inc: { totalVisits: 1, totalSpent: Number(price) },
      $set: { lastVisit: new Date() },
    });

    // Recherche + populate pour renvoyer les données enrichies
    const populated = await PrestationRealiseeModel.findById(nouvelle._id)
      .populate("prestationId", "name prices")
      .populate("employeeId", "name role")
      .populate("clientId", "prenom nom telephone");

    res.status(201).json({
      message: "Prestation enregistrée avec succès",
      data: populated,
    });
  } catch (err) {
    console.error("Erreur création prestation réalisée :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};


// GET prestations by client
export const getPrestationsByClient = async (req, res) => {
  try {
    const { clientId } = req.params;

    if (!clientId) {
      return res.status(400).json({ message: "clientId requis" });
    }

    const prestations = await PrestationRealiseeModel.find({ clientId })
      .populate("prestationId", "name prices description")
      .populate("employeeId", "name role")
      .sort({ date: -1 }); // Plus récentes en premier

    if (prestations.length === 0) {
      return res.status(200).json({ message: "Aucune prestation pour ce client", data: [] });
    }

    res.status(200).json(prestations);
  } catch (err) {
    console.error("Erreur get prestations by client :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};