import mongoose from "mongoose";
const { Schema, model, models  } = mongoose;


const RendezvousSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  serviceId: { type: mongoose.Schema.Types.ObjectId,  ref: "Service", required: true },
  date: { type: Date, required: true },

  salonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Salon",
    required: true   // important : obligatoire maintenant
  },

startTime: {
      type: String, // HH:mm
      required: true
    },

     endTime: {
      type: String, // HH:mm
      required: true
    },

  statut: {
    type: String,
    enum: ["en_attente", "confirmée", "annulée"],
    default: "en_attente"
  },

     notes: {
      type: String,
      default: ""
    }

}, { timestamps: true });
const RendezvousModel = mongoose.models.Rendezvous || mongoose.model("Rendezvous", RendezvousSchema);
export default RendezvousModel;