import mongoose from "mongoose";
const { Schema, model, models } = mongoose;

const RdvSchema = new Schema({
  clientId: { type: Schema.Types.ObjectId, ref: "Client", required: true }, // référence à ton client
  date: { type: String, required: true },
  time: { type: String, required: true },
  service: { type: String, required: true },
  coiffeur: { type: String, required: true },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now },
  gerantId:{type: String}
});

const RdvModel = models.Rdv || model("Rdv", RdvSchema);
export default RdvModel;
