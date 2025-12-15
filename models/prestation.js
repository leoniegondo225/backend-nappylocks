import mongoose from "mongoose"
const {models, model, Schema}= mongoose
 const PrestationSchema = new Schema({
 
    name: { type: String, required: true },
    categoryId: { type: mongoose.Schema.Types.ObjectId,ref: 'CategoryPrestation', required: true },
 prices: [{ type: Number, required: true }],
    description: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
  
  }, { timestamps: true})


const PrestationModel = models.Prestation || model("Prestation", PrestationSchema);
export default PrestationModel 