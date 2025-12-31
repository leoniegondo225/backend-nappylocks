import PrestationModel from "../models/prestation.js"
import CategoryPrestationModel from "../models/categoryprestation.js"

// GET all prestations



// CREATE prestation
export const CreatePrestation = async (req, res) => {
  try {
    const { name, categoryPrestationId, prices, description } = req.body;

    console.log("📥 Données reçues pour création prestation :", req.body);

    // Validation nom
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return res.status(400).json({ message: "Le nom de la prestation est obligatoire" });
    }

    // Validation catégorie (doit être un ObjectId valide)
    if (!categoryPrestationId || typeof categoryPrestationId !== "string" || categoryPrestationId.trim().length !== 24) {
      return res.status(400).json({ message: "ID de catégorie invalide" });
    }

    // Nettoyage et validation des prix
    let cleanedPrices = [];
    if (Array.isArray(prices)) {
      cleanedPrices = prices
        .map(p => (typeof p === "string" ? p.trim() : p))
        .map(p => Number(p))
        .filter(p => !isNaN(p) && p > 0);
    }

    if (cleanedPrices.length === 0) {
      return res.status(400).json({ message: "Au moins un prix valide et positif est requis" });
    }

    // Vérification que la catégorie existe
    const categoryExists = await CategoryPrestationModel.findById(categoryPrestationId.trim());
    if (!categoryExists) {
      return res.status(404).json({ message: "Catégorie non trouvée" });
    }

    // Création de la prestation (active par défaut)
    const nouvellePrestation = await PrestationModel.create({
      name: name.trim(),
      categoryPrestationId: categoryPrestationId.trim(),
      prices: cleanedPrices,
      description: description?.trim() || "",
      isActive: true, // ← Nouvelle prestation = active par défaut
    });

    // Populate pour renvoyer le nom de la catégorie
    const prestationAvecCategorie = await nouvellePrestation.populate("categoryPrestationId");

    return res.status(201).json(prestationAvecCategorie);
  } catch (err) {
    console.error("Erreur création prestation :", err);
    return res.status(500).json({ message: "Erreur serveur lors de la création" });
  }
};

// GET toutes les prestations
export const GetPrestations = async (req, res) => {
  try {
    const prestations = await PrestationModel.find()
      .populate("categoryPrestationId")
      .sort({ createdAt: -1 });

    res.status(200).json(prestations); // ← 200 pour un GET
  } catch (err) {
    console.error("Erreur chargement prestations :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// UPDATE prestation
export const UpdatePrestation = async (req, res) => {
  try {
    const { name, categoryPrestationId, prices, description } = req.body;
    const prestationId = req.params.id;

    if (!prestationId) {
      return res.status(400).json({ message: "ID de prestation manquant" });
    }

    const updateData = {};

    if (name !== undefined) updateData.name = name.trim();
    if (description !== undefined) updateData.description = description.trim() || "";

    // Mise à jour de la catégorie
    if (categoryPrestationId !== undefined) {
      if (!categoryPrestationId) {
        return res.status(400).json({ message: "ID de catégorie invalide" });
      }
      const category = await CategoryPrestationModel.findById(categoryPrestationId);
      if (!category) {
        return res.status(404).json({ message: "Catégorie introuvable" });
      }
      updateData.categoryPrestationId = categoryPrestationId;
    }

    // Mise à jour des prix
    if (prices !== undefined) {
      if (!Array.isArray(prices) || prices.length === 0) {
        return res.status(400).json({ message: "Le tableau de prix est invalide" });
      }
      const validPrices = prices
        .map(p => Number(p))
        .filter(p => !isNaN(p) && p > 0);

      if (validPrices.length === 0) {
        return res.status(400).json({ message: "Au moins un prix positif requis" });
      }
      updateData.prices = validPrices;
    }

    const updatedPrestation = await PrestationModel.findByIdAndUpdate(
      prestationId,
      updateData,
      { new: true, runValidators: true }
    ).populate("categoryPrestationId");

    if (!updatedPrestation) {
      return res.status(404).json({ message: "Prestation non trouvée" });
    }

    res.status(200).json(updatedPrestation);
  } catch (err) {
    console.error("Erreur mise à jour prestation :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// DELETE prestation
export const DeletePrestation = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await PrestationModel.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Prestation non trouvée" });
    }

    res.status(200).json({ success: true, message: "Prestation supprimée avec succès" });
  } catch (err) {
    console.error("Erreur suppression prestation :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// TOGGLE isActive
export const TogglePrestation = async (req, res) => {
  try {
    const { id } = req.params;

    const prestation = await PrestationModel.findById(id);

    if (!prestation) {
      return res.status(404).json({ message: "Prestation introuvable" });
    }

    prestation.isActive = !prestation.isActive;
    await prestation.save();

    const populated = await prestation.populate("categoryPrestationId");

    res.status(200).json(populated);
  } catch (err) {
    console.error("Erreur toggle prestation :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
