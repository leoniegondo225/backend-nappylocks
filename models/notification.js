import mongoose from "mongoose";

const {Schema, model, models} = mongoose

const NotificationSchema = new Schema({

salonId: { type: Schema.Types.ObjectId, ref: "Salon" },
rdvId: { type: Schema.Types.ObjectId, ref: "Rdv" },


type: {
type: String,
enum: ["NEW_RDV", "CONFIRM_RDV", "CANCEL_RDV"],
},


message: String,
read: { type: Boolean, default: false },
createdAt: { type: Date, default: Date.now },
});


export default models.Notification || model("Notification", NotificationSchema);