import mongoose from "mongoose";
const {Schema, model, models}= mongoose;

const NotificationSchema = new Schema(
  {
    userId: {type: mongoose.Schema.Types.ObjectId,ref: "User",required: true, },

    channel: { type: String,enum: ["email", "sms", "app"],required: true,},

    message: { type: String, required: true,},

    status: { type: String,enum: ["sent", "en_attente", "failed"], default: "en_attente", },

    meta: {type: Object,default: {},},

    sentAt: {type: Date,default: null,},
  },
  { timestamps: true }
);


 const NotificationModel = models.Notification || model("Notification", NotificationSchema);
 export default NotificationModel