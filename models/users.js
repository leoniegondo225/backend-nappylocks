import mongoose from "mongoose";
const { model, Schema, models} = mongoose;


const UserSchema = new Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true , trim: true,},
    telephone: { type: String },
    password: { type: String, required: true,},
    role: { type: String, enum: ["client","gerant", "admin", "superadmin"], default: "client" },
     avatar: { type: String, default: "" },
     verified: { type: Boolean, default: false },
     createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

// Vérifie si le modèle existe déjà (utile en hot reload / dev)
const UserModel = models.User || model("User", UserSchema);

// Export par défaut (pour pouvoir faire import UserModel ...)
export default UserModel;
