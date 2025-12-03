import CategoryModel from "../models/category.js";


// ▶️ Créer une catégorie
export const CreerCategory = async (req, res) => {
  try {
    const { nom, description, image } = req.body;

    if (!nom) return res.status(400).json({ message: "Le nom est obligatoire" });

    const exist = await CategoryModel.findOne({ nom });
    if (exist) return res.status(400).json({ message: "Cette catégorie existe déjà" });

    const category = await CategoryModel.create({ nom, description, image });

    res.status(201).json({ message: "Catégorie créée", category });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// ▶️ Obtenir toutes les catégories
export const GetAllCategories = async (req, res) => {
  try {
    const categories = await CategoryModel.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// ▶️ Obtenir une catégorie par ID
export const GetCategoryByID = async (req, res) => {
  try {
    const category = await CategoryModel.findById(req.params.id);
    if (!category) return res.status(404).json({ message: "Catégorie introuvable" });

    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// ▶️ Mettre à jour une catégorie
export const UpdateCategory = async (req, res) => {
  try {
    const category = await CategoryModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!category) return res.status(404).json({ message: "Catégorie introuvable" });

    res.status(200).json({ message: "Catégorie mise à jour", category });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// ▶️ Supprimer une catégorie
export const DeleteCategory = async (req, res) => {
  try {
    const category = await CategoryModel.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ message: "Catégorie introuvable" });

    res.status(200).json({ message: "Catégorie supprimée" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};
