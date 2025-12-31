// models/PrestationRealisee.js
import mongoose from "mongoose";
const {models, model, Schema}= mongoose

const PrestationRealiseeSchema = new mongoose.Schema({
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client",
    required: true,
  },
  prestationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Prestation", // ← ta collection des prestations (allprestations)
    required: true,
  },
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  notes: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});


const PrestationRealiseeModel = models.PrestationRealisee || model("PrestationRealisee", PrestationRealiseeSchema);
export default PrestationRealiseeModel 
