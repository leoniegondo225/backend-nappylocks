// models/Salon.js
import mongoose from "mongoose";
const { Schema, model, models } = mongoose;

const SalonSchema = new Schema(
  {
    nom: {
      type: String,
      required: [true, "Le nom du salon est obligatoire"],
      trim: true,
    },
    address: {
      type: String,
      trim: true,
      default: "",
    },
    ville: {
      type: String,
      trim: true,
      default: "",
    },
    pays: {
      type: String,
      trim: true,
      default: "",
    },
    telephone: {
      type: String,
      trim: true,
      default: "",
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "inactive", // Important : inactif par défaut
    },
    gerantId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
      // Pas de "unique: true" ici !
      // On autorise plusieurs salons sans gérant
    },
  },
  { timestamps: true }
);

// Optionnel : si tu veux un index pour accélérer les recherches par gérant, mais PAS unique
SalonSchema.index({ gerantId: 1 }, { sparse: true }); // sparse = ignore les null

const SalonModel = models.Salon || model("Salon", SalonSchema);
export default SalonModel;