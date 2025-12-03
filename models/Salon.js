// models/Salon.js
import mongoose from "mongoose";
const { Schema, model, models } = mongoose;

const SalonSchema = new Schema(
  {
    nom: { type: String, required: true, trim: true },
    address: { type: String, required: true },
    telephone: { type: String, required: true },
    gerant: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["en_attente", "validé", "rejeté"], default: "en_attente" },
    services: [{ type: Schema.Types.ObjectId, ref: "Service" }], // référence aux services proposés
    description: { type: String, default: "" },
  },
  { timestamps: true }
);

const SalonModel = models.Salon || model("Salon", SalonSchema);
export default SalonModel;
