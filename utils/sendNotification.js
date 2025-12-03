import NotificationModel from "../models/notification.js";

export const SendNotification = async (notification) => {
  try {
    // Simuler un envoi selon le canal
    if (notification.channel === "email") {
      console.log("📧 Email envoyé :", notification.message);
    }

    if (notification.channel === "sms") {
      console.log("📱 SMS envoyé :", notification.message);
    }

    if (notification.channel === "app") {
      console.log("🔔 Notification app :", notification.message);
    }

    // Mise à jour
    notification.status = "sent";
    notification.sentAt = new Date();

    await notification.save();

  } catch (error) {
    notification.status = "failed";
    await notification.save();
  }
};
