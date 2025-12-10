import mongoose from "mongoose";

const {model, models, Schema} = mongoose

const EmployeeSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    role: { type: String, required: true },
    status: {
      type: String,
      enum: ["active", "inactive", "vacation"],
      default: "active",
    },
    joinDate: { type: Date, default: Date.now },
    specialties: { type: [String], default: [] },
  },
  { timestamps: true }
);

const EmployeeModel = models.Employee || model("Employee", EmployeeSchema);


export default EmployeeModel;