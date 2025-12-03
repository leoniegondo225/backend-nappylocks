import mongoose from "mongoose";
const { model, Schema, models} = mongoose;

const CategorySchema = new Schema(
  {
    nom: { type: String, required: true, unique: true },
    description: { type: String },
    image: { type: String }
  },
  { timestamps: true }
);

const CategoryModel = models.Category || model("Category", CategorySchema);
export default CategoryModel;