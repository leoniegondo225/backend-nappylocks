import mongoose from "mongoose";
const {Schema, model, models}= mongoose

const ClientSchema = new Schema(
  {
    prenom: {
      type: String,
      required: true,
      trim: true,
    },
    nom: {
      type: String,
      required: true,
      trim: true,
    },
    telephone: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    notes: {
      type: String,
      trim: true,
    },
    // === NOUVEAUX CHAMPS POUR LE TRACKING ===
    salonId: {
      type: Schema.Types.ObjectId,
      ref: "Salon",
      required: true, // Obligatoire car un client appartient à un salon
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true, // On sait toujours qui a créé
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      // Pas required car la première création n'a pas de "update"
    },
  },
  { timestamps: true }
);

const ClientModel = models.Client || model("Client", ClientSchema);

 export default ClientModel