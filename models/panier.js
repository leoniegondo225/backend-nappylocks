import mongoose from "mongoose";

const { model, Schema, models} = mongoose;

// Sous-schéma pour les articles du panier
const CartarticlesSchema = new Schema({
  produitId: { type: mongoose.Schema.Types.ObjectId, ref: "Produit", required: true },
  quantité: { type: Number, required: true, default: 1 },
  prix: { type: Number, required: true } // prix actuel du produit
});

const PanierSchema = new Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    articles: [CartarticlesSchema],
    total: { type: Number, default: 0 },
    coupon: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Coupon",
  default: null,
},
discount: {
  type: Number,
  default: 0
}

  },
  
  { timestamps: true }
);


const PanierModel = models.Panier || model("Panier", PanierSchema);
export default PanierModel;