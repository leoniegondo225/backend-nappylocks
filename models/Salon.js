// models/Salon.js
import mongoose from "mongoose";
const { Schema, model, models } = mongoose;

const SalonSchema = new Schema(
  {
    nom: { type: String, required: true, trim: true },
    address: { type: String, required: true },
    telephone: { type: String, required: true },
    pays: { type: String, required: true },
    email: { type: String, required: true },
    ville: { type: String, required: true },
    status: { type: String, enum:  ["active", "inactive"], default: "active" }, // référence aux services proposés
    
  },
  { timestamps: true }
);

const SalonModel = models.Salon || model("Salon", SalonSchema);
export default SalonModel;
