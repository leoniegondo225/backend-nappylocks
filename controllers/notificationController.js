import NotificationModel from "../models/notification.js";
import UserModel from "../models/users.js";

export const CreateNotification = async (req, res) => {
  try {
    const { userId, channel, message, meta } = req.body;

    const user = await UserModel.findById(userId);
    if (!user)
      return res.status(404).json({ message: "Utilisateur introuvable" });

    const notif = await NotificationModel.create({
      userId,
      channel,
      message,
      meta,
      status: "pending",
    });

    res.status(201).json({
      message: "Notification créée",
      notification: notif,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};


export const GetAllNotifications = async (req, res) => {
  try {
    const notifs = await NotificationModel.find()
      .populate("userId", "name email phone");

    res.status(200).json(notifs);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

export const GetNotificationByID = async (req, res) => {
  try {
    const notif = await NotificationModel.findById(req.params.id)
      .populate("userId", "name email phone");

    if (!notif) return res.status(404).json({ message: "Notification introuvable" });

    res.status(200).json(notif);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};


export const UpdateNotification = async (req, res) => {
  try {
    const notif = await NotificationModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!notif)
      return res.status(404).json({ message: "Notification introuvable" });

    res.status(200).json({ message: "Notification mise à jour", notif });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};


export const DeleteNotification = async (req, res) => {
  try {
    const notif = await NotificationModel.findByIdAndDelete(req.params.id);

    if (!notif)
      return res.status(404).json({ message: "Notification introuvable" });

    res.status(200).json({ message: "Notification supprimée" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};
