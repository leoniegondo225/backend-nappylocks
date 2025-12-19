import mongoose from "mongoose";
const { Schema, model, models } = mongoose;

const RdvSchema = new Schema({
  // 🔗 Relations
  clientId: {
    type: Schema.Types.ObjectId,
    ref: "Client",
    required: true,
  },

  salonId: {
    type: Schema.Types.ObjectId,
    ref: "Salon",
    required: true,
    index: true, // utile pour les recherches par salon
  },

  // 📅 Date & heure
  date: {
    type: String,
    required: true, // YYYY-MM-DD
    index: true,
  },

  time: {
    type: String,
    required: true, // HH:mm
    index: true,
  },

  // 💇 Service
  service: {
    type: String,
    required: true,
  },

  coiffeur: {
    type: String,
  },

  notes: {
    type: String,
  },

  // 🌐 Origine du RDV
  source: {
    type: String,
    enum: ["ONLINE", "SALON"],
    required: true,
  },

  // 📌 Statut
  status: {
    type: String,
    enum: ["PENDING", "CONFIRMED", "CANCELLED"],
    default: "PENDING",
  },

  // 👤 Créé par (gérant / admin / système)
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },

  // 🕒 Date création
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

/**
 * ❗ IMPORTANT
 * Empêche deux RDV actifs sur le même salon,
 * à la même date et à la même heure
 */
RdvSchema.index(
  { salonId: 1, date: 1, time: 1 },
  {
    unique: true,
    partialFilterExpression: {
      status: { $ne: "CANCELLED" },
    },
  }
);

const RdvModel = models.Rdv || model("Rdv", RdvSchema);
export default RdvModel;
