import mongoose from "mongoose";
const { model, Schema, models } = mongoose;

const CategoryPrestationSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

// ✅ CORRECTION FINALE
// 1. Nom du modèle : "CategoryPrestation" → SANS "s" à la fin
// 2. Troisième paramètre : nom exact de la collection → "categoryprestations"
const CategoryPrestationModel =
  models.CategoryPrestation ||
  model("CategoryPrestation", CategoryPrestationSchema, "categoryprestations");

export default CategoryPrestationModel;