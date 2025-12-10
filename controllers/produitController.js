// controllers/productController.js
import ProduitModel from "../models/produits.js"; // adapte le chemin si nécessaire
import mongoose from "mongoose";

// Helper : calcule le stock global si tu veux (somme des variantes)
const calcTotalStockFromVariants = (variants) => {
  if (!Array.isArray(variants) || variants.length === 0) return 0;
  return variants.reduce((acc, v) => acc + (Number(v.stock) || 0), 0);
};

// CREATE
export const CreateProduit = async (req, res) => {
  try {
    const {
      nom,
      description,
      prix,
      basePrice,
      mainImage,
      variations,
      benefaits,
      volume,
      categoryId,
      tags,
      active
    } = req.body;

    // validation minimale (tu peux renforcer avec express-validator)
    if (!nom || !prix) {
      return res.status(400).json({ error: "nom et prix sont requis" });
    }

    // Si variations envoyées sous forme JSON string (depuis form-data), parser
    let parsedVariants = variations;
    if (typeof variations === "string") {
      try { parsedVariants = JSON.parse(variations); }
      catch (e) {/* leave as-is */}
    }

    const productData = {
      nom,
      description,
      prix,
      basePrice,
      mainImage,
      variations: parsedVariants || [],
      benefaits: benefaits || [],
      volume,
      categoryId: categoryId ? mongoose.Types.ObjectId(categoryId) : undefined,
      tags: tags || [],
      active: active === undefined ? true : active,
    };

    // calcul du stock global si il y a des variantes
    if (productData.variations && productData.variations.length > 0) {
      productData.stock = calcTotalStockFromVariants(productData.variations);
    }

    const newProduct = await ProduitModel.create(productData);
    return res.status(201).json({ message: "Produit créé", product: newProduct });
  } catch (err) {
    console.error("createProduct err:", err);
    return res.status(500).json({ error: err.message });
  }
};

// GET ALL (avec pagination, filtre par category, search par nom)
export const GetAllProduits = async (req, res) => {
  try {
    const { page = 1, limit = 20, category, q } = req.query;
    const query = {};
    if (category) query.categoryId = category;
    if (q) query.nom = { $regex: q, $options: "i" };

    const skip = (Number(page) - 1) * Number(limit);
    const [products, total] = await Promise.all([
      ProduitModel.find(query).skip(skip).limit(Number(limit)).sort({ createdAt: -1 }),
      ProduitModel.countDocuments(query)
    ]);

    return res.json({ products, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    console.error("getProducts err:", err);
    return res.status(500).json({ error: err.message });
  }
};

// GET by id
export const GetProduit = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await ProduitModel.findById(id);
    if (!product) return res.status(404).json({ error: "Produit introuvable" });
    return res.json({ product });
  } catch (err) {
    console.error("getProduct err:", err);
    return res.status(500).json({ error: err.message });
  }
};

// UPDATE produit (tu peux mettre à jour mainImage, variations, etc.)
export const UpdateProduit = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };

    // Parser variations si envoyé comme string
    if (typeof updates.variations === "string") {
      try { updates.variations = JSON.parse(updates.variations); } catch (e) {}
    }

    // Si on met à jour les variations, recalculer le stock global
    if (updates.variations && Array.isArray(updates.variations)) {
      updates.stock = calcTotalStockFromVariants(updates.variations);
    }

    const updated = await ProduitModel.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ error: "Produit introuvable" });
    return res.json({ message: "Produit mis à jour", product: updated });
  } catch (err) {
    console.error("updateProduct err:", err);
    return res.status(500).json({ error: err.message });
  }
};

// DELETE
export const DeleteProduit = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await ProduitModel.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: "Produit introuvable" });
    return res.json({ message: "Produit supprimé", product: deleted });
  } catch (err) {
    console.error("deleteProduct err:", err);
    return res.status(500).json({ error: err.message });
  }
};
