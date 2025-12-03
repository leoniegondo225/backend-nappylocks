import mongoose from "mongoose";
const { model, Schema, models} = mongoose;

// Sous-schéma pour les articles de la commande
const CommandearticlessSchema = new Schema({
  produitId: { type: mongoose.Schema.Types.ObjectId, ref: "Produit", required: true },
  quantité: { type: Number, required: true },
  prix: { type: Number, required: true }, // prix à l’achat
});

const AddressSchema = new Schema({
  nom_prenom: { type: String, required: true },
  addressLine1: { type: String, required: true },
  addressLine2: { type: String },
  ville: { type: String, required: true },
  pays: { type: String, required: true },
  telephone: { type: String, required: true },
});

const CommandeSchema = new Schema(
  {
    UserId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    articles: [CommandearticlessSchema],
    subtotal: { type: Number, required: true },
    taxe: { type: Number },
    shipping: { type: Number, required: true },
    total: { type: Number, required: true },
    paymentMethod: { type: String, enum: ["carte", "paypal", "espèces"], required: true },
    paymentStatus: { type: String, enum: ["en_attente", "payé", "échoué"], default: "en_attente" },
    commandeStatus: { type: String, enum: ["en_attente", "traitement", "expédié", "livré", "annulé"], default: "en_attente" },
    shippingAddress: AddressSchema,
    transactionId: { type: String },
    coupon: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Coupon",
  default: null,
},
discount: {
  type: Number,
  default: 0,
}
  },
  { timestamps: true }
);

const CommandeModel = models.Commande || model("Commande", CommandeSchema);
export default CommandeModel;
