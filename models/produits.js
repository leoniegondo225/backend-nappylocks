// models/product.js
import mongoose from "mongoose";
const { model, Schema, models } = mongoose;

// Schéma pour une variation du produit (ex : couleur + taille)
const VariationSchema = new Schema({
  color: { type: String, required: true },
  size: { type: String, required: false },
  stock: { type: Number, default: 0, min: [0] },
  images: [{ type: String, required: true }], // URLs des images hébergées  
  prix: { type: Number, required: true },
});


const ProduitSchema = new Schema(
  {
    nom: { type: String, required: [true], trim: true, },

    description: { type: String },

    prix: { type: Number, required: [true], min: [0], },
    mainImage: { type: String, required: false }, // Image principale du produit
    variations: [VariationSchema], // Tableau de variations
    basePrice: { type: Number },
    stock: { type: Number, default: 0, min: [0] },

    benefaits: { type: [String], default: [] },

    volume: { type: String },

    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: false, },// Modifie selon ton besoin

    tags: { type: [String], default: [], }, //Liste de tags (ex : "promo", "nouveauté", "best-seller").

    active: { type: Boolean, default: true, }, //Pour activer / désactiver un produit.
  },

  { timestamps: true }
);

const ProduitModel = models.Produit || model("Produit", ProduitSchema);

export default ProduitModel;
