import mongoose from "mongoose";

const { model, Schema, models} = mongoose;

const ServiceSchema = new Schema(
  {
    nom: {type: String, required: true,trim: true },

    description: {type: String,required: true},

    durationMinutes: {type: Number,required: true},

   prix: {type: Number,required: true},

    restrictions: {type: [String],fault: []},

    active: {type: Boolean, default: true}
  },
  {
    timestamps: true
  }
);


const ServiceModel = models.Service || model("Service", ServiceSchema);
export default ServiceModel;

