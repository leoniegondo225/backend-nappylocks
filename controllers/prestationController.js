import PrestationModel from "../models/prestation.js"
import CategoryPrestationModel from "../models/categoryprestation.js"

// GET all prestations
export const GetPrestations = async (req, res) => {
  try {
    const prestations = await PrestationModel.find()
      .populate("categoryPrestationId")           
      .sort({ createdAt: -1 })

    res.json(prestations)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export const CreatePrestation = async (req, res) => {
  try {
    const { name, categoryPrestationId,  prices, description } = req.body;

    if (!name || !categoryPrestationId || !Array.isArray(prices) || prices.length === 0) {
      return res.status(400).json({ error: "Champs obligatoires manquants ou prix vide" });
    }

    // Récupérer la catégorie par nom
   // Nouveau (correct)
const categoryprestationDoc = await CategoryPrestationModel.findById(categoryPrestationId);
if (!categoryprestationDoc) return res.status(404).json({ error: "Catégorie introuvable" });


    const prestation = await PrestationModel.create({
      name,
     categoryPrestationId: categoryPrestationId,
      prices,       // tableau de prix
      description,
      isActive: true
    });
    
  await prestation.populate("categoryPrestationId");
    res.json(prestation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// UPDATE prestation
export const UpdatePrestation = async (req, res) => {
  try {
    let updateData = { ...req.body };

    // Conversion catégorie nom → ObjectId
    if (req.body.categoryPrestationId) {
      const categoryprestationDoc = await CategoryPrestationModel.findOne({ name: req.body.categoryPrestationId });
      if (!categoryprestationDoc) return res.status(404).json({ error: "Catégorie introuvable" });
      updateData.categoryPrestationId = categoryprestationDoc._id;
    }

    // S'assurer que prices est un tableau si fourni
    if (req.body.prices && (!Array.isArray(req.body.prices) || req.body.prices.length === 0)) {
      return res.status(400).json({ error: "Le tableau de prix est invalide" });
    }

    const updated = await PrestationModel.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// DELETE prestation
export const DeletePrestation = async (req, res) => {
  try {
    await PrestationModel.findByIdAndDelete(req.params.id)
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// TOGGLE active/inactive
export const TogglePrestation = async (req, res) => {
  try {
    const prestation = await PrestationModel.findById(req.params.id)

    if (!prestation) {
      return res.status(404).json({ error: "Prestation introuvable" })
    }

    prestation.isActive = !prestation.isActive
    await prestation.save()

    res.json(prestation)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
