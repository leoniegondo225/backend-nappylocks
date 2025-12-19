import mongoose from "mongoose";

const { model, models, Schema } = mongoose;

const EmployeeSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },

    role: {
      type: String,
      required: true, // ex: coiffeur, manager, caissier
    },

    status: {
      type: String,
      enum: ["active", "inactive", "vacation"],
      default: "active",
    },

     joinDate: {
      type: Date,
      required: true, // maintenant tu dois le renseigner manuellement
    },

    specialties: {
      type: [String],
      default: [],
    },

    // ✅ LIEN AVEC LE SALON
    salonId: {
      type: Schema.Types.ObjectId,
      ref: "Salon",
      required: true, // un employé appartient toujours à un salon
      index: true,    // 🔥 important pour les requêtes par salon
    },
  },
  { timestamps: true }
);

const EmployeeModel = models.Employee || model("Employee", EmployeeSchema);

export default EmployeeModel;
