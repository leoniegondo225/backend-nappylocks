import CategoryModel from "../models/category.js";
import ProduitModel from "../models/produits.js";


// ▶️ Créer un produit
export const CreerProduit = async (req, res) => {
  try {
    const { titre, prix, categoryId , description, tags, active, stock} = req.body;

       if (!titre || !prix || !description) {
      return res.status(400).json({ message: "Titre et prix sont obligatoires" });
    }

     // Vérifier que la catégorie existe
    if (categoryId) {
      const categoryExiste = await CategoryModel.findById(categoryId);
      if (!categoryExiste) {
        return res.status(404).json({ message: "Catégorie introuvable" });
      }
    }

    // Gestion des images uploadées
    let images = [];
    if (req.files && req.files.length > 0) {
      images = req.files.map(file => file.path); // stocke le chemin
    }

    const produit = await ProduitModel.create(req.body);
    res.status(201).json({
      message: "Produit créé avec succès",
      produit,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la création du produit", error });
  }
};

// ▶️ Obtenir tous les produits
export const GetAllProduits = async (req, res) => {
  try {
    const produits = await ProduitModel.find().populate("categoryId", "name");

    res.status(200).json(produits);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des produits", error });
  }
};

// ▶️ Obtenir un produit par ID
export const GetProduitByID = async (req, res) => {
  try {
    const produit = await ProduitModel.findById(req.params.id).populate("categoryId", "name");
    if (!produit) {
      return res.status(404).json({ message: "Produit non trouvé" });
    }
    res.status(200).json(produit);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération du produit", error });
  }
};

// ▶️ Mettre à jour un produit
export const UpdateProduit = async (req, res) => {
  try {
        const { categoryId } = req.body;
    // Vérifier que la catégorie existe
    if (categoryId) {
      const categoryExiste = await CategoryModel.findById(categoryId);
      if (!categoryExiste) {
        return res.status(404).json({ message: "Catégorie introuvable" });
      }
    }

  let images = [];
    if (req.files && req.files.length > 0) {
      images = req.files.map(file => file.path);
      req.body.images = images; // remplace ou ajoute images
    }

    const produit = await ProduitModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    runValidators: true
    });

    if (!produit) {
      return res.status(404).json({ message: "Produit non trouvé" });
    }

    res.status(200).json({
      message: "Produit mis à jour avec succès",
      produit,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la mise à jour du produit", error });
  }
};

// ▶️ Supprimer un produit
export const DeleteProduit = async (req, res) => {
  try {
    const produit = await ProduitModel.findByIdAndDelete(req.params.id);

    if (!produit) {
      return res.status(404).json({ message: "Produit non trouvé" });
    }

    res.status(200).json({ message: "Produit supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la suppression du produit", error });
  }
};
