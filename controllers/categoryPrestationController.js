import CategoryPrestationModel from "../models/categoryprestation.js";


// ▶️ Créer une catégorie
export const CreerCategoryPrestation = async (req, res) => {
    console.log("req.body:", req.body);
  try {
    const { name } = req.body;

    if (!name) return res.status(400).json({ message: "Le nom est obligatoire" });

    const exist = await CategoryPrestationModel.findOne({ name });
    if (exist) return res.status(400).json({ message: "Cette catégorie existe déjà" });

    const category = await CategoryPrestationModel.create({ name });

    // Retourne directement l'objet créé
    res.status(201).json(category);
  } catch (error) {
    console.error("Erreur création catégorie :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// ▶️ Obtenir toutes les catégories
export const GetAllCategoriesPrestation = async (req, res) => {
  try {
    const categories = await CategoryPrestationModel.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// ▶️ Obtenir une catégorie par ID
export const GetCategoryPrestationByID = async (req, res) => {
  try {
    const category = await CategoryPrestationModel.findById(req.params.id);
    if (!category) return res.status(404).json({ message: "Catégorie introuvable" });

    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// ▶️ Mettre à jour une catégorie
export const UpdateCategoryPrestation = async (req, res) => {
  try {
    const category = await CategoryPrestationModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!category) return res.status(404).json({ message: "Catégorie introuvable" });

    res.status(200).json({ message: "Catégorie mise à jour", category });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// ▶️ Supprimer une catégorie
export const DeleteCategoryPrestation = async (req, res) => {
  try {
    const category = await CategoryPrestationModel.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ message: "Catégorie introuvable" });

    res.status(200).json({ message: "Catégorie supprimée" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};
