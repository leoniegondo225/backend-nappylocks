// models/product.js
import mongoose from "mongoose";
const { model, Schema, models} = mongoose;

const ProduitSchema = new Schema(
  {
    titre: { type: String, required: [true, "Le titre du produit est obligatoire"],trim: true,},

    description: {type: String,required: [true, "La description du produit est obligatoire"], },

    prix: {type: Number,required: [true, "Le prix est obligatoire"], min: [0, "Le prix ne peut pas être négatif"],},

    stock: {type: Number,default: 0,min: [0, "Le stock ne peut pas être négatif"],},

    images: [{ type: String }],

    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: false, },// Modifie selon ton besoin

     tags: { type: [String], default: [],}, //Liste de tags (ex : "promo", "nouveauté", "best-seller").

    active: { type: Boolean, default: true, }, //Pour activer / désactiver un produit.
  },

  { timestamps: true }
);

const ProduitModel = models.Produit || model("Produit", ProduitSchema);

export default ProduitModel;
