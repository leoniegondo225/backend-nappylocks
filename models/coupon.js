import mongoose from "mongoose";
const { Schema, model, models } = mongoose;

const CouponSchema = new Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },

    type: {
      type: String,
      enum: ["percentage", "fixed"], // % ou montant fixe
      required: true,
    },

    value: {
      type: Number,
      required: true,
      min: 1,
    },

    expiresAt: {
      type: Date,
      required: true,
    },

    usageLimit: {
      type: Number,
      required: true,
      default: 1,
    },

    timesUsed: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const CouponModel = mongoose.models.Coupon || mongoose.model("Coupon", CouponSchema);
export default CouponModel;