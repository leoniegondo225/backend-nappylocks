import NotificationModel from "../models/notification.js";
import { sendSMS } from "./sms.js";

export const createNotification = async ({
  userId,
  channel,
  message,
  meta = {}
}) => {

  // 1️⃣ Enregistrer en DB
  const notif = await NotificationModel.create({
    userId,
    channel,
    message,
    status: "sent",
    meta,
    sentAt: new Date()
  });

  // 2️⃣ Si c’est un SMS → envoyer via Twilio
  if (channel === "sms" && meta.phone) {
    await sendSMS(meta.phone, message);
  }

  // ⭐ Si besoin, tu rajouteras l'envoi email ici plus tard

  return notif;
};
