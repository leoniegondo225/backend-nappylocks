import mongoose from "mongoose";
const { model, Schema, models} = mongoose;

const CategoryPrestationSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    },
  { timestamps: true }
);

const CategoryPrestationModel = models.CategoryPrestation || model("CategoryPrestation", CategoryPrestationSchema);
export default CategoryPrestationModel;